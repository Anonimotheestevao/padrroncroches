import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Loader2, Package } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/minha-conta/pedidos")({
  component: MeusPedidosPage,
  head: () => ({
    meta: [{ title: "Meus Pedidos — PadrronCroche" }],
  }),
});

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productSlug: string; productTitle: string; deliveryUrl: string | null }[];
};

const statusLabel: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "bg-green-100 text-green-700" },
  pending: { label: "Aguardando pagamento", className: "bg-amber-100 text-amber-700" },
  failed: { label: "Não aprovado", className: "bg-red-100 text-red-700" },
  refunded: { label: "Reembolsado", className: "bg-slate-100 text-slate-600" },
};

function MeusPedidosPage() {
  const { user, session, loading: authLoading, open: openAuth } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !session) {
      openAuth("login");
      setLoading(false);
      return;
    }
    listOrders({ data: { accessToken: session.access_token } })
      .then((result) => setOrders(result))
      .finally(() => setLoading(false));
  }, [authLoading, user, session, openAuth]);

  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-xl font-extrabold text-slate-900">Entre para ver seus pedidos</p>
        <button
          onClick={() => openAuth("login")}
          className="mt-6 rounded-xl bg-brand px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        Meus Pedidos
      </h1>

      {loading && (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      )}

      {!loading && orders && orders.length === 0 && (
        <div className="mt-16 text-center">
          <Package className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-muted-foreground">Você ainda não fez nenhum pedido.</p>
          <Link to="/catalogo" className="mt-4 inline-block text-sm font-bold text-brand hover:underline">
            Ver catálogo
          </Link>
        </div>
      )}

      {!loading && orders && orders.length > 0 && (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const status = statusLabel[order.status] ?? statusLabel["pending"]!;
            return (
              <div key={order.id} className="rounded-2xl border border-slate-100 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="font-display text-base font-extrabold text-slate-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {order.items.map((item) => (
                    <div key={item.productSlug} className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-700">{item.productTitle}</span>
                      {item.deliveryUrl ? (
                        <a
                          href={item.deliveryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-brand hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Acessar
                        </a>
                      ) : (
                        <span className="shrink-0 text-xs font-semibold text-slate-400">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
