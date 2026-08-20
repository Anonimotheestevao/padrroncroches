import { createServerFn } from "@tanstack/react-start";
import { products } from "@/data/products";
import { supabaseAdmin } from "./server/supabaseAdmin";
import { createPayment, type BrickFormData } from "./server/mercadopago";

type CheckoutItemInput = {
  slug: string;
  quantity: number;
  isFree?: boolean | undefined;
  isBump?: boolean | undefined;
};

// Fonte única da verdade para preços: NUNCA confiamos em valores enviados pelo
// navegador (poderiam ser adulterados no DevTools/rede). Tudo é recalculado
// aqui a partir do catálogo real de produtos + das mesmas regras de desconto
// usadas visualmente no carrinho (order bump = 55% do preço, item grátis = 0).
function resolveUnitPrice(item: CheckoutItemInput): number {
  const product = products.find((p) => p.slug === item.slug);
  if (!product) {
    throw new Error(`Produto inválido no carrinho: ${item.slug}`);
  }
  if (item.isFree) return 0;
  if (item.isBump) return Math.round(product.price * 0.55 * 100) / 100;
  return product.price;
}

async function getUserFromToken(accessToken: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error("Sessão inválida. Faça login novamente antes de continuar.");
  }
  return data.user;
}

// Etapa 1: cria o pedido no banco (status "pending") com os preços já
// validados. A página de checkout chama isso assim que carrega, antes de
// mostrar o formulário de pagamento — assim o Payment Brick já nasce sabendo
// o valor exato e confiável a cobrar.
export const createOrder = createServerFn({ method: "POST" })
  .validator((input: { accessToken: string; items: CheckoutItemInput[] }) => input)
  .handler(async ({ data }) => {
    if (!data.items.length) {
      throw new Error("Carrinho vazio.");
    }

    const user = await getUserFromToken(data.accessToken);

    const resolvedItems = data.items.map((item) => {
      const product = products.find((p) => p.slug === item.slug)!;
      return {
        slug: item.slug,
        title: product.title,
        unitPrice: resolveUnitPrice(item),
        quantity: item.quantity,
      };
    });

    const total = resolvedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const billableTotal = resolvedItems
      .filter((item) => item.unitPrice > 0)
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    if (billableTotal <= 0) {
      throw new Error("O pedido não tem nenhum item cobrável.");
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({ user_id: user.id, status: "pending", total })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error("Não foi possível criar o pedido. Tente novamente em instantes.");
    }

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      resolvedItems.map((item) => ({
        order_id: order.id as string,
        product_slug: item.slug,
        product_title: item.title,
        unit_price: item.unitPrice,
        quantity: item.quantity,
      })),
    );

    if (itemsError) {
      throw new Error("Não foi possível registrar os itens do pedido. Tente novamente.");
    }

    return {
      orderId: order.id as string,
      amount: billableTotal,
      payerEmail: user.email ?? "",
      items: resolvedItems.map((i) => i.title),
    };
  });

// Etapa 2: chamado pelo onSubmit do Payment Brick, já com o token do cartão
// (ou dados do Pix/boleto) gerado no navegador pelo SDK do Mercado Pago.
// Revalida que o pedido pertence ao usuário e ainda está pendente, cobra
// usando o valor que JÁ estava salvo no pedido (não o que vier do front),
// e atualiza o status assim que a resposta chega.
export const submitPayment = createServerFn({ method: "POST" })
  .validator((input: { accessToken: string; orderId: string; formData: BrickFormData }) => input)
  .handler(async ({ data }) => {
    const user = await getUserFromToken(data.accessToken);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, total")
      .eq("id", data.orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Pedido não encontrado.");
    }
    if (order.user_id !== user.id) {
      throw new Error("Este pedido não pertence à sua conta.");
    }
    if (order.status !== "pending") {
      throw new Error("Este pedido já foi processado.");
    }

    const payment = await createPayment({
      orderId: order.id as string,
      amount: order.total as number,
      description: "Compra PadrronCroche",
      payerEmail: user.email ?? data.formData.payer.email,
      formData: data.formData,
    });

    const newStatus =
      payment.status === "approved" ? "paid" : payment.status === "rejected" ? "failed" : "pending";

    await supabaseAdmin
      .from("orders")
      .update({
        status: newStatus,
        mp_payment_id: String(payment.id),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id as string);

    return {
      status: payment.status,
      statusDetail: payment.status_detail,
      // Pix: QR code e "copia e cola" para exibir na tela caso o método seja Pix.
      qrCode: payment.point_of_interaction?.transaction_data?.qr_code ?? null,
      qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64 ?? null,
    };
  });
