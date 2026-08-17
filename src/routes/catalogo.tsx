import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Produtos — Padrões de Crochê | PadrronCroche" },
      {
        name: "description",
        content:
          "Todos os padrões de crochê em PDF do PadrronCroche: granny squares, flores, bebê, mantas, almofadas e amigurumi.",
      },
      { property: "og:title", content: "Produtos — Padrões de Crochê | PadrronCroche" },
      {
        property: "og:description",
        content: "Catálogo completo de padrões de crochê digitais em PDF.",
      },

    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  return (
    <div className="px-5 py-8">
      <h1 className="text-center font-display text-3xl font-extrabold sm:text-5xl">Produtos</h1>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-bold text-brand-soft"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar e ordenar
        </button>
        <span className="text-sm text-muted-foreground">{products.length} produtos</span>
      </div>

      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} wishlist />
        ))}
      </div>
    </div>
  );
}
