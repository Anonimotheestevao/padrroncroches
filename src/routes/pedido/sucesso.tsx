import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getOrder } from "@/lib/orders";

type SearchParams = { order?: string | undefined };

export const Route = createFileRoute("/pedido/sucesso")({
  component: SucessoPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    order: typeof search["order"] === "string" ? search["order"] : undefined,
  }),
  head: () => ({
    meta: [{ title: "Pedido confirmado — PadrronCroche" }],
  }),
});

type OrderDetails = {
  status: string;
  total: number;
  items: { productSlug: string; productTitle: string; deliveryUrl: string | null }[];
};

function SucessoPage() {
  const { order: orderId } = Route.useSearch();
  const { session } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !session) return;
    getOrder({ data: { accessToken: session.access_token, orderId } })
      .then((result) => setOrder(result))
      .finally(() => setLoading(false));
  }, [orderId, session]);

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-9 w-9 text-green-600" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        Pagamento aprovado!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Seu pedido foi confirmado. Os links de acesso estão logo abaixo — também vamos te enviar por
        e-mail.
      </p>

      {loading && (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      )}

      {!loading && order && (
        <div className="mt-8 space-y-3 text-left">
          {order.items.map((item) => (
            <div
              key={item.productSlug}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <span className="text-sm font-bold text-slate-900">{item.productTitle}</span>
              {item.deliveryUrl ? (
                <a
                  href={item.deliveryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Acessar
                </a>
              ) : (
                <span className="shrink-0 text-xs font-semibold text-slate-400">Em breve</span>
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        to="/minha-conta/pedidos"
        className="mt-10 inline-block text-sm font-bold text-brand hover:underline"
      >
        Ver todos os meus pedidos
      </Link>
    </div>
  );
}
