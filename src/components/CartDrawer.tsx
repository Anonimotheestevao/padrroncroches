import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { formatPrice, products } from "@/data/products";
import { Lock, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ProductCard } from "./ProductCard";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

export function CartDrawer() {
  const { items, total, count, isOpen, close, add, remove, updateQuantity } = useCart();
  const { user, open: openAuth } = useAuth();
  const navigate = useNavigate();

  // Produto de order bump: sugere o primeiro item que o cliente ainda não tem no carrinho
  const bumpProduct = products.find((p) => !items.some((i) => i.product.slug === p.slug));
  const bumpPrice = bumpProduct ? Math.round(bumpProduct.price * 0.55 * 100) / 100 : 0;
  const bumpDiscount = bumpProduct ? Math.round((1 - bumpPrice / bumpProduct.compareAt) * 100) : 0;
  const isBumpInCart = bumpProduct
    ? items.some((i) => i.product.slug === bumpProduct.slug && i.isBump)
    : false;

  // Produtos recomendados para a seção "Você também pode gostar" (exclui o que já está no carrinho)
  const recommended = products
    .filter((p) => !items.some((i) => i.product.slug === p.slug))
    .slice(0, 8);

  const handleCheckout = () => {
    if (!items.length) return;
    if (!user) {
      close();
      openAuth("login");
      toast.info("Entre ou crie sua conta para finalizar a compra.");
      return;
    }
    close();
    navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="flex h-full w-[90%] max-w-[420px] flex-col overflow-hidden rounded-l-3xl border-l-0 p-0 shadow-2xl inset-y-0 right-0 duration-300 animate-in slide-in-from-right">
        <div className="flex flex-col h-full bg-white">
          <SheetHeader className="px-6 py-6 flex flex-row items-center justify-between border-b shrink-0">
            <SheetTitle className="font-display text-2xl font-black text-slate-900 tracking-tight">
              Seu carrinho
            </SheetTitle>
            <button 
              onClick={close}
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Minus className="h-6 w-6 rotate-45" />
            </button>
          </SheetHeader>

          {count === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-tint">
                <ShoppingBag className="h-10 w-10 text-brand" />
              </div>
              <h3 className="font-display text-xl font-extrabold">Seu carrinho está vazio</h3>
              <p className="mt-2 text-muted-foreground">
                Parece que você ainda não adicionou nenhum padrão de crochê.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-brand text-brand hover:bg-brand hover:text-white rounded-full px-8"
                onClick={close}
              >
                Explorar padrões
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6">
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={`${item.product.slug}-${item.isFree}-${item.isBump}`} className="py-6">
                      <div className="flex gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-0.5">
                              <h4 className="text-[14px] font-bold leading-tight text-slate-900">
                                {item.product.title}
                              </h4>
                              {item.isFree ? (
                                <div className="flex items-center gap-1.5 text-brand">
                                  <span className="text-xs">🔥</span>
                                  <span className="text-[10px] font-black uppercase tracking-tight">Compre 2 Leve 1 GRÁTIS</span>
                                </div>
                              ) : item.isBump ? (
                                <div className="flex items-center gap-1.5 text-brand">
                                  <Sparkles className="h-3 w-3" />
                                  <span className="text-[10px] font-black uppercase tracking-tight">Oferta exclusiva do carrinho</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-slate-500">
                                  <span className="text-[10px] grayscale opacity-50">🏷️</span>
                                  <span className="text-[10px] font-bold uppercase tracking-tighter">Desconto aplicado</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                               <span className="text-sm font-bold text-slate-900">
                                {formatPrice(item.isFree ? 0 : (item.isBump && item.bumpPrice != null ? item.bumpPrice : item.product.price) * item.quantity)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center rounded-md border border-slate-200">
                              <button
                                onClick={() => updateQuantity(item.product.slug, item.quantity - 1, item.isFree, item.isBump)}
                                className="flex h-7 w-7 items-center justify-center hover:bg-slate-50 transition-colors"
                              >
                                <Minus className="h-3 w-3 text-slate-600" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.slug, item.quantity + 1, item.isFree, item.isBump)}
                                className="flex h-7 w-7 items-center justify-center hover:bg-slate-50 transition-colors"
                              >
                                <Plus className="h-3 w-3 text-slate-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(item.product.slug, item.isFree, item.isBump)}
                              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
                              aria-label="Remover item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order bump: oferta especial de 1 clique para aumentar o ticket médio */}
                {bumpProduct && (
                  <div className="pt-5">
                    <label
                      className={`flex cursor-pointer gap-3 rounded-xl border-2 p-3 transition ${
                        isBumpInCart ? "border-brand bg-brand-tint/40" : "border-dashed border-brand/40 bg-brand-tint/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isBumpInCart}
                        onChange={(e) => {
                          if (e.target.checked) {
                            add(bumpProduct, 1, false, bumpPrice);
                          } else {
                            remove(bumpProduct.slug, false, true);
                          }
                        }}
                        className="mt-1 h-5 w-5 shrink-0 accent-brand"
                      />
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                        <img src={bumpProduct.image} alt={bumpProduct.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-brand" />
                          <span className="text-[10px] font-black uppercase tracking-wide text-brand">
                            Oferta relâmpago · só nesta compra
                          </span>
                        </div>
                        <p className="text-[13px] font-bold leading-tight text-slate-900">
                          Adicione: {bumpProduct.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-black text-brand">{formatPrice(bumpPrice)}</span>
                          <span className="text-xs text-slate-400 line-through">{formatPrice(bumpProduct.compareAt)}</span>
                          <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-black text-white">
                            -{bumpDiscount}%
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Subtotal + Finalizar Pedido: fazem parte do fluxo normal, rolam junto com o resto */}
                <div className="space-y-3 border-t border-slate-100 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">Subtotal</span>
                    <span className="text-lg font-black text-slate-900">{formatPrice(total)} BRL</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand font-display text-base font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20 transition hover:bg-brand-deep active:scale-[0.98]"
                  >
                    <Lock className="h-4 w-4" /> Finalizar Pedido
                  </Button>
                </div>

                {/* Você também pode gostar: aparece abaixo do botão de finalizar */}
                {recommended.length > 0 && (
                  <div className="border-t border-slate-100 pb-8 pt-6">
                    <p className="mb-4 font-display text-xl font-extrabold tracking-tight text-slate-900">
                      Você também pode gostar
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                      {recommended.map((p) => (
                        <ProductCard key={p.slug} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
