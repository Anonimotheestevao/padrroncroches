import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { Lock, ShieldCheck, Star, Loader2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/data/products";
import { createOrder, submitPayment } from "@/lib/checkout";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [{ title: "Finalizar Compra — PadrronCroche" }],
  }),
});

const MP_PUBLIC_KEY = import.meta.env["VITE_MERCADOPAGO_PUBLIC_KEY"] as string | undefined;
let mpInitialized = false;

type OrderState = {
  orderId: string;
  amount: number;
  payerEmail: string;
  items: string[];
};

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user, session, loading: authLoading, open: openAuth } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderState | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    if (MP_PUBLIC_KEY && !mpInitialized) {
      initMercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
      mpInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !session) {
      openAuth("login");
      return;
    }
    if (!items.length) return;
    if (createdRef.current) return;
    createdRef.current = true;

    createOrder({
      data: {
        accessToken: session.access_token,
        items: items.map((item) => ({
          slug: item.product.slug,
          quantity: item.quantity,
          isFree: item.isFree,
          isBump: item.isBump,
        })),
      },
    })
      .then((result) => {
        setOrder(result);
        setCreatingOrder(false);
      })
      .catch((err: unknown) => {
        setOrderError(err instanceof Error ? err.message : "Não foi possível iniciar o pedido.");
        setCreatingOrder(false);
      });
  }, [authLoading, user, session, items, openAuth]);

  if (!items.length && !order) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-xl font-extrabold text-slate-900">Seu carrinho está vazio</p>
        <p className="mt-2 text-sm text-muted-foreground">Adicione produtos antes de finalizar a compra.</p>
        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-xl font-extrabold text-slate-900">Entre para continuar</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Você precisa estar logado para finalizar a compra.
        </p>
        <button
          onClick={() => openAuth("login")}
          className="mt-6 rounded-xl bg-brand px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20"
        >
          Entrar
        </button>
      </div>
    );
  }

  if (!MP_PUBLIC_KEY) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-xl font-extrabold text-slate-900">Pagamento indisponível</p>
        <p className="mt-2 text-sm text-muted-foreground">
          VITE_MERCADOPAGO_PUBLIC_KEY não está configurado. Preencha o arquivo .env com a Public Key do
          seu painel do Mercado Pago.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
        <Lock className="h-4 w-4 text-brand" />
        Ambiente de pagamento seguro
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Coluna do formulário de pagamento */}
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Finalizar compra
          </h1>

          {orderError && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
              {orderError}
            </div>
          )}

          {creatingOrder && !orderError && (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm font-semibold">Preparando seu pedido...</p>
            </div>
          )}

          {order && (
            <div className="mt-6">
              <Payment
                initialization={{
                  amount: order.amount,
                  payer: { email: order.payerEmail },
                }}
                customization={{
                  paymentMethods: {
                    creditCard: "all",
                    debitCard: "all",
                    bankTransfer: "all", // Pix
                    ticket: "all", // Boleto
                  },
                }}
                onSubmit={async ({ formData }) => {
                  try {
                    const result = await submitPayment({
                      data: {
                        accessToken: session!.access_token,
                        orderId: order.orderId,
                        formData: formData as never,
                      },
                    });

                    if (result.status === "approved") {
                      clear();
                      toast.success("Pagamento aprovado!");
                      navigate({ to: "/pedido/sucesso", search: { order: order.orderId } });
                    } else if (result.status === "in_process" || result.status === "pending") {
                      clear();
                      navigate({ to: "/pedido/pendente", search: { order: order.orderId } });
                    } else {
                      toast.error("Pagamento não aprovado. Tente outro método ou cartão.");
                    }
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Erro ao processar pagamento.");
                  }
                }}
                onError={(err) => {
                  console.error("[Payment Brick]", err);
                }}
              />
            </div>
          )}

          {/* Prova social — exatamente o que não dava pra colocar no checkout externo */}
          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand" />
              Pagamento 100% seguro
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <BadgeCheck className="h-5 w-5 shrink-0 text-brand" />
              Acesso liberado na hora
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Star className="h-5 w-5 shrink-0 fill-brand text-brand" />
              +5.000 clientes satisfeitas
            </div>
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="order-1 h-fit rounded-2xl border border-slate-100 bg-slate-50 p-5 lg:order-2">
          <p className="font-display text-base font-extrabold text-slate-900">Resumo do pedido</p>
          <div className="mt-4 space-y-3 divide-y divide-slate-200">
            {items.map((item) => (
              <div
                key={`${item.product.slug}-${item.isFree}-${item.isBump}`}
                className="flex items-center gap-3 pt-3 first:pt-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="h-12 w-12 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900">{item.product.title}</p>
                  <p className="text-[11px] text-slate-500">Qtd: {item.quantity}</p>
                </div>
                <span className="shrink-0 text-xs font-black text-slate-900">
                  {item.isFree
                    ? "Grátis"
                    : formatPrice(
                        (item.isBump && item.bumpPrice != null ? item.bumpPrice : item.product.price) *
                          item.quantity,
                      )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="font-display text-base font-black text-slate-900">Total</span>
            <span className="font-display text-lg font-black text-brand">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
