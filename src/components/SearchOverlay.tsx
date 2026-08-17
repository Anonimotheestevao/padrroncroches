import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { formatPrice, products, type Product } from "@/data/products";

export interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matches(product: Product, term: string) {
  const haystack = normalize(
    [product.title, product.tagline, product.badge ?? "", ...(product.highlights ?? [])].join(" "),
  );
  return normalize(term)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTerm("");
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = term.trim();
    if (!q) return [];
    return products.filter((p) => matches(p, q)).slice(0, 8);
  }, [term]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-deep/40">
      <div className="bg-background px-4 pb-4 pt-4 shadow-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted px-4 py-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar receitas de crochê..."
              aria-label="Buscar produtos"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button type="button" aria-label="Fechar busca" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-auto mt-4 max-h-[60vh] max-w-3xl overflow-y-auto">
          {term.trim() === "" ? (
            <p className="py-2 text-sm text-muted-foreground">
              Digite para encontrar padrões, amigurumis, bolsas e mais.
            </p>
          ) : results.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">
              Nenhum produto encontrado para “{term}”.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/produtos/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-14 w-14 rounded-md object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{p.title}</span>
                      <span className="block text-xs font-bold text-brand">
                        {formatPrice(p.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="Fechar busca"
        className="h-full w-full"
        onClick={onClose}
      />
    </div>
  );
}
