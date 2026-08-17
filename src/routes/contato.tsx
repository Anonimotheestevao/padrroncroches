import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Fale Conosco — PadrronCroche" },
      {
        name: "description",
        content:
          "Precisa de ajuda com o seu padrão de crochê? Envie sua mensagem e responderemos em até 24 horas.",
      },
      { property: "og:title", content: "Fale Conosco — PadrronCroche" },
      {
        property: "og:description",
        content: "Envie sua mensagem para a equipe do PadrronCroche.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-5 py-8">
      <h1 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
        📩 Fale Conosco
      </h1>

      <form
        className="mx-auto mt-8 max-w-xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          toast.success("Mensagem enviada! Responderemos em até 24 horas.");
        }}
      >
        <input
          required
          placeholder="Nome"
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-base outline-none focus:border-brand"
        />
        <input
          required
          type="email"
          placeholder="E-mail"
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-base outline-none focus:border-brand"
        />
        <input
          placeholder="Telefone"
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-base outline-none focus:border-brand"
        />
        <textarea
          rows={5}
          placeholder="Comentário"
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-base outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-accent px-4 py-3 font-bold text-accent-foreground transition hover:bg-brand hover:text-primary-foreground"
        >
          {sent ? "Enviado" : "Enviar"}
        </button>
      </form>
    </div>
  );
}
