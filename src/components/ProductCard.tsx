import { Link } from "@tanstack/react-router";
import { Heart, Tag } from "lucide-react";
import { discountPercent, formatPrice, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product, wishlist = false }: { product: Product; wishlist?: boolean }) {
  const { add } = useCart();

  return (
    <div className="flex flex-col">
      <Link
        to="/produtos/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden rounded-md bg-muted"
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-cover"
        />
        {wishlist && (
          <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90">
            <Heart className="h-4 w-4" />
          </span>
        )}
        <span className="absolute bottom-2 left-0 flex items-center gap-1 rounded-r-md bg-sale px-2 py-0.5 text-[9px] font-extrabold uppercase text-sale-foreground">
          <Tag className="h-2.5 w-2.5" />
          Economize {discountPercent(product)}%
        </span>
      </Link>

      <Link
        to="/produtos/$slug"
        params={{ slug: product.slug }}
        className="mt-3 text-[13px] font-bold leading-snug text-foreground"
      >
        {product.title}
      </Link>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-base font-extrabold text-brand">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(product.compareAt)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          add(product);
          toast.success("Produto adicionado ao carrinho");
        }}
        className="mt-3 w-full rounded-md border-2 border-brand bg-transparent px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-primary-foreground active:scale-[0.98]"
      >
        Adicionar ao carrinho
      </button>

    </div>
  );
}
