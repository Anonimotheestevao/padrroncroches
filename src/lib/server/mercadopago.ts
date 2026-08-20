import "server-only";

const MP_API_BASE = "https://api.mercadopago.com";

function getAccessToken(): string {
  const token = process.env["MERCADOPAGO_ACCESS_TOKEN"];
  if (!token) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não configurado. Adicione essa variável de ambiente " +
        "com o Access Token do seu painel do Mercado Pago (Produção ou Teste).",
    );
  }
  return token;
}

// Formato que o Payment Brick (front-end) devolve no onSubmit — enviamos isso
// quase sem alterações para a API de pagamentos do Mercado Pago, mas SEMPRE
// sobrescrevendo transaction_amount e description com valores calculados
// pelo nosso servidor (nunca confiamos em valor vindo do navegador).
export type BrickFormData = {
  token?: string;
  issuer_id?: string;
  payment_method_id: string;
  installments?: number;
  payer: {
    email: string;
    identification?: { type: string; number: string };
  };
};

export type MercadoPagoPayment = {
  id: number;
  status: string; // approved | in_process | pending | rejected | cancelled
  status_detail: string;
  external_reference: string | null;
  transaction_amount: number;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
};

export async function createPayment(opts: {
  orderId: string;
  amount: number;
  description: string;
  payerEmail: string;
  formData: BrickFormData;
}): Promise<MercadoPagoPayment> {
  const response = await fetch(`${MP_API_BASE}/v1/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
      // Evita cobrança duplicada caso a requisição seja reenviada por instabilidade de rede.
      "X-Idempotency-Key": opts.orderId,
    },
    body: JSON.stringify({
      transaction_amount: opts.amount,
      description: opts.description,
      external_reference: opts.orderId,
      token: opts.formData.token,
      issuer_id: opts.formData.issuer_id,
      payment_method_id: opts.formData.payment_method_id,
      installments: opts.formData.installments ?? 1,
      payer: {
        email: opts.payerEmail,
        identification: opts.formData.payer.identification,
      },
    }),
  });

  const data = (await response.json()) as MercadoPagoPayment & { message?: string };

  if (!response.ok) {
    throw new Error(`Erro ao processar pagamento no Mercado Pago: ${data.message ?? response.status}`);
  }

  return data;
}

export async function getPayment(paymentId: string): Promise<MercadoPagoPayment> {
  const response = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao buscar pagamento no Mercado Pago (${response.status}): ${errorBody}`);
  }

  return (await response.json()) as MercadoPagoPayment;
}
