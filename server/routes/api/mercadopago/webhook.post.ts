import { defineHandler } from "nitro";
import { getPayment } from "../../../../src/lib/server/mercadopago";
import { supabaseAdmin } from "../../../../src/lib/server/supabaseAdmin";

// O Mercado Pago chama esta rota automaticamente sempre que o status de um
// pagamento muda (aprovado, recusado, etc). Nunca confiamos direto no corpo
// que ele envia — sempre buscamos o pagamento de novo na API deles usando o
// ID recebido, para confirmar que a notificação é legítima.
export default defineHandler(async (event) => {
  let paymentId: string | null = null;

  try {
    const body = (await event.req.json().catch(() => null)) as
      | { type?: string; data?: { id?: string | number } }
      | null;
    if (body?.type === "payment" && body.data?.id) {
      paymentId = String(body.data.id);
    }
  } catch {
    // corpo vazio/ não-JSON — tenta buscar pelos query params (formato antigo de IPN)
  }

  if (!paymentId) {
    paymentId = event.url.searchParams.get("id") ?? event.url.searchParams.get("data.id");
  }

  if (!paymentId) {
    // Notificação que não reconhecemos (ex: teste do painel). Respondemos OK
    // mesmo assim para o Mercado Pago não ficar re-tentando à toa.
    return { received: true, ignored: true };
  }

  try {
    const payment = await getPayment(paymentId);
    const orderId = payment.external_reference;

    if (orderId && payment.status === "approved") {
      await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          mp_payment_id: String(payment.id),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    } else if (orderId && (payment.status === "rejected" || payment.status === "cancelled")) {
      await supabaseAdmin
        .from("orders")
        .update({
          status: "failed",
          mp_payment_id: String(payment.id),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }
  } catch (err) {
    // Registramos o erro mas ainda respondemos 200: se devolvêssemos erro,
    // o Mercado Pago ficaria retentando repetidamente por algo que pode ser
    // transitório do nosso lado (ex: banco fora do ar por 1 segundo).
    console.error("[Webhook Mercado Pago] Falha ao processar notificação", err);
  }

  return { received: true };
});
