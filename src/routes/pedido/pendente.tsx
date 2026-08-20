import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

type SearchParams = { order?: string | undefined };

export const Route = createFileRoute("/pedido/pendente")({
  component: PendentePage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    order: typeof search["order"] === "string" ? search["order"] : undefined,
  }),
  head: () => ({
    meta: [{ title: "Pagamento em análise — PadrronCroche" }],
  }),
});

function PendentePage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
        <Clock className="h-9 w-9 text-amber-600" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        Pagamento em análise
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Se você escolheu Pix ou boleto, assim que o pagamento for confirmado (geralmente em poucos
        minutos), liberamos o acesso automaticamente e avisamos por e-mail.
      </p>
      <Link
        to="/minha-conta/pedidos"
        className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20"
      >
        Acompanhar meu pedido
      </Link>
    </div>
  );
}
