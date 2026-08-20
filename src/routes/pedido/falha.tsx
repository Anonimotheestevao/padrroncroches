import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/pedido/falha")({
  component: FalhaPage,
  head: () => ({
    meta: [{ title: "Pagamento não aprovado — PadrronCroche" }],
  }),
});

function FalhaPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-9 w-9 text-red-600" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        Pagamento não aprovado
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Isso pode acontecer por saldo insuficiente, dados incorretos ou bloqueio do seu banco. Tente
        novamente com outro cartão ou método de pagamento.
      </p>
      <Link
        to="/checkout"
        className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20"
      >
        Tentar novamente
      </Link>
    </div>
  );
}
