import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Check, Star, Tag, X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { getProduct, products, formatPrice, discountPercent, type DescriptionSection } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Produto indisponível — PadrronCroche" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.title} — PadrronCroche`;
    return {
      meta: [
        { title },
        { name: "description", content: product.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: product.tagline },
      ],
    };
  },
  component: ProdutoPage,
});

const ratingBars = [
  { stars: 5, percent: 91 },
  { stars: 4, percent: 9 },
  { stars: 3, percent: 0 },
  { stars: 2, percent: 0 },
  { stars: 1, percent: 0 },
];

const reviewsList = [
  {
    name: "Megana",
    stars: 4,
    date: "24 out 2024",
    text: "Seria um ótimo ponto de partida para quem está começando. Tem cada passo que você precisa para começar a crochetar, mas se você já é uma crocheteira mais experiente é meio…",
  },
  {
    name: "Jane Lima",
    stars: 5,
    date: "13 jan 2026",
    text: "Este produto superou minhas expectativas! É absolutamente incrível e você conseguiria aprender a crochetar do zero com ele.",
  },
  {
    name: "Cláudia M.",
    stars: 5,
    date: "05 fev 2026",
    text: "As receitas são muito bem explicadas, o PDF abre perfeitamente no celular. Vale cada centavo!",
  },
  {
    name: "Mariana S.",
    stars: 5,
    date: "10 fev 2026",
    text: "Já fiz 3 bichinhos com as receitas desse pacote. Estão vendendo super bem!",
  },
];

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

function Countdown() {
  const [seconds, setSeconds] = useState(14 * 60 + 54);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="rounded-md bg-[#fff7ed] py-2 text-center text-sm font-bold text-[#9a3412]">
      Rápido! Oferta expira em {mm}:{ss} ⏰
    </div>
  );
}

function ProdutoPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const bundleOfferEnabled = !product.hideBundleOffer;
  const [bundle, setBundle] = useState(bundleOfferEnabled ? 1 : 0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  

  const amigurumiProduct = products.find(p => p.slug === "4000-receitas-amigurumi")!;
  const bolsaProduct = products.find(p => p.slug === "300-receitas-bolsa-croche")!;
  const sapatinhosProduct = products.find(p => p.slug === "100-sapatinhos-croche-bebe")!;

  const bundles = bundleOfferEnabled
    ? [
        {
          id: 0,
          title: product.title,
          note: "Preço padrão",
          price: product.price,
          compareAt: product.compareAt,
        },
        {
          id: 1,
          title: "🎁 Compre 2 & Ganhe 1 GRÁTIS",
          note: "Pague 2, Leve 3",
          price: product.price * 2,
          compareAt: 99.8,
          popular: true,
          items: [
            product,
            amigurumiProduct.slug === product.slug ? bolsaProduct : amigurumiProduct,
            (product.slug !== amigurumiProduct.slug && product.slug !== bolsaProduct.slug) ? bolsaProduct : sapatinhosProduct
          ]
        },
      ]
    : [
        {
          id: 0,
          title: product.title,
          note: "Preço padrão",
          price: product.price,
          compareAt: product.compareAt,
        },
      ];

  const selected = bundles[bundle] ?? bundles[0]!;
  const allImages = product.gallery?.length ? [product.image, ...product.gallery] : [product.image];
  const currentReviews = product.customerReviews?.length ? product.customerReviews : reviewsList;

  // Mede a distância real entre slides (largura do item + gap), já que os
  // itens não ocupam 100% da largura do carrossel (efeito "peek").
  const getSlideStep = () => {
    const el = scrollContainerRef.current;
    if (!el || el.children.length < 1) return 0;
    const first = el.children[0] as HTMLElement;
    const second = el.children[1] as HTMLElement | undefined;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = getSlideStep();
    if (!step) return;
    const index = Math.round(el.scrollLeft / step);
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
    }
  };

  const goToImage = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = getSlideStep();
    const clamped = Math.max(0, Math.min(allImages.length - 1, index));
    el.scrollTo({ left: clamped * step, behavior: "smooth" });
    setActiveImageIndex(clamped);
  };

  return (
    <div className="pb-28">
      <div className="bg-white">
        <div className="relative">
          {allImages.length > 1 ? (
            <>
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide gap-3 px-8 py-4 [-webkit-overflow-scrolling:touch] [touch-action:pan-x] sm:gap-4 sm:px-16 md:px-24"
              >
                {allImages.map((img, i) => (
                  <div key={i} className="w-[80%] shrink-0 snap-center sm:w-[58%] md:w-[42%]">
                    <img
                      src={img}
                      alt={`${product.title} - imagem ${i + 1}`}
                      width={816}
                      height={816}
                      className="aspect-square w-full select-none rounded-md object-cover"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                aria-label="Imagem anterior"
                onClick={() => goToImage(activeImageIndex - 1)}
                disabled={activeImageIndex === 0}
                className="absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur transition hover:bg-background disabled:opacity-0 sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Próxima imagem"
                onClick={() => goToImage(activeImageIndex + 1)}
                disabled={activeImageIndex === allImages.length - 1}
                className="absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur transition hover:bg-background disabled:opacity-0 sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <span className="absolute right-10 top-7 rounded-full bg-foreground/60 px-2 py-0.5 text-[11px] font-bold text-background sm:right-[4.5rem]">
                {activeImageIndex + 1}/{allImages.length}
              </span>
            </>
          ) : (
            <div className="flex justify-center px-4 py-4">
              <img
                src={product.image}
                alt={product.title}
                width={816}
                height={816}
                className="aspect-square w-full max-w-lg rounded-md object-cover"
              />
            </div>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 bg-white pb-4 pt-1">
            {allImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para imagem ${i + 1}`}
                onClick={() => goToImage(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === i ? "w-6 bg-brand" : "w-1.5 bg-brand/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>


      <div className="px-5">
        <div className="flex items-center gap-2">
          <Stars value={product.rating} className="gap-0.5" />
          <span className="text-sm text-muted-foreground">{product.reviews}</span>
        </div>

        <h1 className="mt-2 font-display text-[1.48rem] font-extrabold leading-tight sm:text-[1.65rem]">
          {product.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="font-display text-2xl font-extrabold text-brand">
            {formatPrice(product.price)}
          </span>
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(product.compareAt)}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-sale px-2 py-0.5 text-[10px] font-extrabold uppercase text-sale-foreground">
            <Tag className="h-2.5 w-2.5" />
            Economize {discountPercent(product)}%
          </span>
        </div>


        <ul className="mt-6 space-y-4">
          {product.highlights.map((h: string) => (
            <li key={h} className="flex items-start gap-3">
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50">
                <Check className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span className="font-display text-base font-extrabold text-foreground">{h}</span>
            </li>
          ))}
        </ul>

        {bundleOfferEnabled && (
          <>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#fde68a]" />
              <span className="text-[11px] sm:text-sm font-extrabold flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden">
                <span className="h-px w-8 sm:w-12 shrink-0 bg-[#fde68a]" />
                🎁 Oferta Especial: Compre 2 & Ganhe 1 GRÁTIS
                <span className="h-px w-8 sm:w-12 shrink-0 bg-[#fde68a]" />
              </span>
              <span className="h-px flex-1 bg-[#fde68a]" />
            </div>

            <div className="mt-4">
              <Countdown />
            </div>
          </>
        )}

        <div className="mt-4 space-y-4">
          {/* Bundle 1 */}
          <label className={`relative flex cursor-pointer flex-col gap-3 rounded-md border p-4 ${bundle === 0 ? "border-[#fbbf24] bg-[#fffbeb]" : "border-border bg-background"}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="bundle" checked={bundle === 0} onChange={() => setBundle(0)} className="h-5 w-5 accent-[#fbbf24]" />
              <div className="flex-1">
                <span className="block font-display text-base font-extrabold">{product.title} (PDF)</span>
                <span className="block text-xs text-muted-foreground">Preço padrão</span>
              </div>
            </div>

            {product.singleOfferShowcase?.length === 2 && (
              <div className="flex items-center justify-center gap-3 border-t border-[#fde68a] pt-3">
                <div className="flex flex-1 flex-col items-center gap-1 text-center">
                  <img
                    src={product.singleOfferShowcase[0]!.image}
                    alt={product.singleOfferShowcase[0]!.label}
                    className="h-16 w-16 rounded border border-border object-cover"
                  />
                  <span className="mt-1 h-6 max-w-[92px] text-[10px] font-bold leading-tight line-clamp-2">
                    {product.singleOfferShowcase[0]!.label}
                  </span>
                </div>
                <span className="shrink-0 text-xl font-bold text-[#fbbf24]">+</span>
                <div className="flex flex-1 flex-col items-center gap-1 text-center">
                  <img
                    src={product.singleOfferShowcase[1]!.image}
                    alt={product.singleOfferShowcase[1]!.label}
                    className="h-16 w-16 rounded border border-border object-cover"
                  />
                  <span className="mt-1 h-6 max-w-[92px] text-[10px] font-bold leading-tight line-clamp-2">
                    {product.singleOfferShowcase[1]!.label}
                  </span>
                </div>
              </div>
            )}
          </label>

          {/* Bundle 2 (Compre 2 Ganhe 1) */}
          {bundleOfferEnabled && (
            <label className={`relative flex cursor-pointer flex-col gap-3 rounded-md border p-4 ${bundle === 1 ? "border-[#fbbf24] bg-white ring-1 ring-[#fbbf24]" : "border-border bg-background"}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="bundle" checked={bundle === 1} onChange={() => setBundle(1)} className="h-5 w-5 accent-[#fbbf24]" />
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <span className="block font-display text-[13px] sm:text-base font-extrabold">🎁 Compre 2 & Ganhe 1 GRÁTIS</span>
                    
                  </div>
                  <div className="text-right">
                    <span className="block font-display text-lg font-extrabold">{formatPrice(product.price * 2)}</span>
                    <span className="block text-xs text-muted-foreground line-through">{formatPrice(product.price * 3)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-[#fde68a] pt-3">
                {selected.items?.map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 text-center">
                     <div className="relative">
                      <img src={p?.image} alt="" className="h-16 w-16 rounded border border-border object-cover" />
                      {i < 2 && <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[#fbbf24] font-bold">+</span>}
                    </div>
                    <span className="text-[10px] font-bold leading-tight mt-1 h-6 line-clamp-2">{p?.title?.split('–')[0]?.trim()}</span>
                    <div className="flex items-center gap-1">
                      {i === 2 ? (
                        <span className="text-[10px] font-bold text-brand uppercase">GRÁTIS 🎁</span>
                      ) : (
                        <span className="text-[10px] font-bold">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <span className="absolute -top-3 right-3 rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase text-white shadow-sm flex items-center gap-1">
                97% escolhem este ✨
              </span>
            </label>
          )}
        </div>


        <button
          type="button"
          onClick={() => {
            if (bundle === 0) {
              add(product);
            } else {
              // Add bundle items: 2 paid, 1 free
              selected.items?.forEach((item, index) => {
                if (item) {
                  const isFree = index === 2; // The 3rd item is free in "Buy 2 Get 1"
                  add(item, 1, isFree);
                }
              });
            }

            toast.success("Produto adicionado ao carrinho");
          }}
          className="mt-4 w-full rounded-md bg-brand px-6 py-2.5 font-display text-lg font-extrabold uppercase text-primary-foreground transition hover:bg-brand-deep shadow-md active:scale-[0.98]"
        >
          Adicionar ao carrinho
        </button>


        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Pix", "Visa", "Mastercard", "Elo", "Amex", "Hipercard", "Boleto", "Google Pay"].map(
            (m) => (
              <span
                key={m}
                className="rounded border border-border px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground"
              >
                {m}
              </span>
            ),
          )}
        </div>
        
        {/* Sessão de Garantia */}
        <div className="mt-8 rounded-xl bg-green-50/50 border border-green-100 p-4 text-center relative overflow-hidden">
          {/* Círculos decorativos sutis */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-100/40 rounded-full" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-100/40 rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-green-100/50">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h3 className="font-display text-base font-extrabold text-slate-900">
              Garantia incondicional de 7 dias
            </h3>
            
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 max-w-sm">
              Experimente sem risco. Se por qualquer motivo você não gostar, basta enviar um e-mail em até <strong>7 dias</strong> e devolvemos <strong>100% do seu dinheiro</strong>. Sem perguntas.
            </p>
            
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-100/80 px-3 py-1 text-[11px] font-bold text-green-700">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              O risco é todo nosso
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-12">
          {product.descriptionSections?.length ? (
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                  {product.descriptionHeadline ?? "Veja Tudo Que Você Vai Receber"}
                </h2>
                {product.descriptionSubheadline && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {product.descriptionSubheadline}
                  </p>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {product.descriptionSections.map((section: DescriptionSection, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="font-display text-lg font-extrabold">{section.title}</h3>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                      {section.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h2 className="mt-12 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                Conheça o {product.title} para Projetos Criativos
              </h2>
              <p className="mt-4 text-sm font-bold">🧶 {product.tagline} 🌸</p>
            </>
          )}

          {product.thematicThemes && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl text-center">
                {product.thematicThemes.title}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {product.thematicThemes.items.map((theme: { icon: string; label: string }, idx: number) => (
                  <div key={idx} className="flex flex-col items-center justify-center rounded-lg border border-border p-4 text-center transition hover:border-brand hover:bg-brand-tint">
                    <span className="text-3xl mb-2">{theme.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{theme.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground italic mt-4">
                ...e centenas de outras categorias organizadas por tema.
              </p>
            </div>
          )}

          <div className="mt-12 space-y-10">
            <div className="rounded-2xl border border-border bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/5">
                  <span className="text-2xl">📧</span>
                </div>
                <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">Como Você Recebe Suas Receitas</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-[15px] font-black italic text-slate-800 tracking-wide">
                  O acesso é imediato após a compra:
                </p>
                
                <div className="space-y-5">
                  {[
                    "Receba o link por e-mail após a compra",
                    "Abra o link seguro do Google Drive",
                    "Acesse todas as suas incríveis receitas ❤️"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-5 group">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[13px] font-black text-brand ring-4 ring-brand/5 transition-transform group-hover:scale-110">
                        {i + 1}
                      </div>
                      <span className="text-[15px] font-bold text-slate-600 leading-tight">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/5">
                  <span className="text-xl">📄</span>
                </div>
                <h3 className="font-display text-xl font-black text-slate-900 tracking-tight">Informações do Produto</h3>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { 
                    icon: "📦", 
                    label: "CONTEÚDO", 
                    value: "Receitas em PDF (Download Instantâneo)" 
                  },
                  { 
                    icon: "🇧🇷", 
                    label: "IDIOMA", 
                    value: "Receitas 100% em Português — Gráficos, receitas e termos fáceis de entender" 
                  },
                  { 
                    icon: "🔑", 
                    label: "ACESSO", 
                    value: "Acesso Vitalício e Ilimitado — Seu para sempre, acesse quando quiser" 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 bg-slate-50/30 transition-colors hover:bg-slate-50/60">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-black uppercase tracking-[0.1em] text-brand/70">{item.label}</span>
                      <p className="text-[13px] font-bold text-slate-700 leading-snug">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-brand/10 bg-brand-tint/20 p-6 text-center">
              <span className="text-3xl mb-3 block">💖</span>
              <h3 className="font-display text-xl font-extrabold text-slate-900 mb-2">Obrigada por apoiar nossa loja</h3>
              <div className="space-y-4 text-sm font-medium text-slate-600 leading-relaxed">
                <p>
                  Obrigada por escolher nossa coleção digital de crochê. Esperamos que este pacote lhe traga criatividade, relaxamento e muitos momentos alegres de crochê.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 py-1">
                  <span>Se você gostou da sua compra, uma avaliação de</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span>significa muito para nós e ajuda a apoiar criadores digitais independentes.</span>
                </div>
                <p className="font-extrabold text-slate-800 flex items-center justify-center gap-2 pt-2">
                  Divirta-se fazendo crochê 🧶💕
                </p>
              </div>
            </div>
          </div>
        </div>



        <section className="mt-14 pt-10 border-t border-border">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-extrabold text-yellow-400 font-display">
              {product.rating.toFixed(1)}<span className="text-2xl text-slate-900">/5</span>
            </h2>
            <div className="flex justify-center mt-2">
              <Stars value={product.rating} className="scale-125" />
            </div>
            <p className="mt-3 text-sm text-slate-500 font-medium">De {product.reviews} avaliações</p>
          </div>

          <div className="mx-auto max-w-sm space-y-3">
            {ratingBars.map((r) => (
              <div key={r.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-6">
                  <span className="text-sm font-bold text-slate-700">{r.stars}</span>
                  <Star className="h-3 w-3 fill-slate-400 text-slate-400" />
                </div>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500" 
                    style={{ width: `${r.percent}%` }} 
                  />
                </div>
                <span className="w-10 rounded-full bg-slate-50 border border-slate-100 py-0.5 text-center text-[10px] font-bold text-slate-600">
                  {Math.round((r.percent / 100) * product.reviews)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center px-4">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full max-w-[200px] rounded-lg bg-slate-900 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-lg transition hover:bg-slate-800 active:scale-95"
            >
              Escrever Avaliação
            </button>

          </div>


          <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
            {currentReviews.map((r) => (
              <article key={r.name} className="rounded-md border border-border p-4">
                <Stars value={r.stars} />
                <p className="mt-2 font-display text-lg font-extrabold">{r.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-bold">
                    Útil
                  </span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">Você também vai amar</h2>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
            {products
              .filter((p) => p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <Link key={p.slug} to="/produtos/$slug" params={{ slug: p.slug }} className="block">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={816}
                    height={816}
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <p className="mt-2 line-clamp-1 text-sm font-bold">{p.title}</p>
                  <p className="font-display text-sm font-extrabold text-brand">
                    {formatPrice(p.price)}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 border-t border-border bg-background px-4 py-3">
        <img
          src={product.image}
          alt=""
          width={816}
          height={816}
          loading="lazy"
          className="h-12 w-12 rounded object-cover"
        />
        <p className="flex-1 text-sm font-bold leading-tight">{product.title}</p>
        <button
          type="button"
          onClick={() => {
            if (bundle === 0) {
              add(product);
            } else {
              selected.items?.forEach((item, index) => {
                if (item) add(item, 1, index === 2);
              });
            }
            toast.success(`${selected.title} adicionado ao carrinho`);
          }}

          className="rounded-md bg-brand px-5 py-3 text-sm font-extrabold text-primary-foreground transition hover:bg-brand-deep active:scale-[0.98]"
        >
          Escolher pacote
        </button>

      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">

          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-display text-lg font-extrabold text-slate-900">Escrever Avaliação</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Avaliação enviada com sucesso! Ela aparecerá após moderação.");
                setIsReviewModalOpen(false);
              }}
              className="p-6 space-y-5"
            >
              <div className="flex justify-center gap-1.5 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star 
                      className={`h-8 w-8 ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} 
                    />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Nome</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Seu nome"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">E-mail</label>
                  <input 
                    required
                    type="email" 
                    placeholder="seu@email.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sua Avaliação</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Conte o que achou das receitas..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Anexar Fotos (Opcional)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-6 transition hover:border-brand hover:bg-slate-50"
                >
                  <Camera className="mb-2 h-6 w-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">Clique para enviar fotos da sua peça</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand py-3.5 font-display text-base font-extrabold uppercase tracking-widest text-white shadow-lg shadow-brand/20 transition hover:bg-brand-deep active:scale-[0.98]"
              >
                Enviar Avaliação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}





