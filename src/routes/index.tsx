import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-croche.jpg";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Download, Zap, FileText, ShieldCheck, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import review1 from "@/assets/review-1.png.asset.json";
import review2 from "@/assets/review-2.png.asset.json";
import review3 from "@/assets/review-3.png.asset.json";
import heroBanner from "@/assets/hero-banner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PadrronCroche — Padrões de Crochê em PDF para Download" },
      {
        name: "description",
        content:
          "Padrões de crochê em PDF para download imediato, criados para inspirar o seu próximo projeto artesanal. Compre 4 e ganhe 30% OFF + 2 brindes.",
      },
      { property: "og:title", content: "PadrronCroche — Padrões de Crochê em PDF" },
      {
        property: "og:description",
        content: "PDFs para download imediato feitos para inspirar seu próximo projeto artesanal.",
      },
    ],
  }),
  component: Index,
});

const benefits = [
  { icon: Download, label: "Download imediato" },
  { icon: Zap, label: "Acesso em segundos" },
  { icon: FileText, label: "Padrão digital em PDF" },
  { icon: ShieldCheck, label: "Compra segura" },
  { icon: HeartHandshake, label: "Aprovado por milhares de crocheteiras" },
];

function Index() {
  const [currentReview, setCurrentReview] = useState(0);
  const reviews = [
    {
      image: review1.url,
      name: "Mariana Silva",
      stars: 5,
      text: "Nunca imaginei que conseguiria fazer crochê tão rápido! As receitas são tão detalhadas e fáceis de seguir que terminei meu primeiro amigurumi em poucos dias. Já virei cliente fiel da PadrronCroche! 😍",
    },
    {
      image: review2.url,
      name: "Ana Beatriz Rocha",
      stars: 5,
      text: "Eu tinha muita dificuldade em ler gráficos, mas o PDF da PadrronCroche explica tudo de um jeito tão simples que finalmente me sinto segura para criar peças sozinhas. A economia de tempo é real! ✨",
    },
    {
      image: review3.url,
      name: "Carla Oliveira",
      stars: 5,
      text: "Estou simplesmente encantada com o suporte e a qualidade das receitas. O acesso imediato pelo Google Drive facilita muito para baixar e consultar no tablet enquanto faço meus pontos. Recomendo demais! ❤️",
    },
  ];

  const nextReview = () => setCurrentReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div>
      <section className="w-full overflow-hidden shadow-sm border-b border-brand/10">
        <img 
          src={heroBanner} 
          alt="PadrronCroche - Materiais e receitas de crochê" 
          className="w-full object-cover aspect-[32/9] sm:aspect-[4/1] md:aspect-[6/1] lg:aspect-[7/1]"
        />
      </section>

      <section className="overflow-hidden bg-brand-tint py-2 border-b border-brand/10">
        <div className="flex marquee-track whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-12 px-6 font-sans text-sm font-semibold text-brand-deep">
              <span className="flex items-center gap-2">⚡ Download Instantâneo no Email</span>
              <span className="flex items-center gap-2">🔒 Pagamento 100% Seguro</span>
              <span className="flex items-center gap-2">📄 Arquivos em PDF Prontos para Imprimir</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-12 pb-10 text-center sm:px-8">
        <h1 className="mx-auto font-display text-[1.65rem] font-extrabold leading-tight text-brand sm:text-4xl md:text-5xl">
          Descomplique seu crochê com receitas passo a passo prontas para criar
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Receitas digitais em PDF de download imediato. Economize tempo, evite erros e dê vida às suas peças favoritas hoje mesmo.
        </p>
      </section>




      <section className="px-5 pb-4">
        <h2 className="text-center font-display text-2xl font-extrabold sm:text-4xl">
          Coleção destaque
        </h2>
        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Bem-vinda Section - Light Themed & Minimalist */}
      <section className="mt-14 bg-brand-tint/20 px-6 py-20 overflow-hidden relative border-y border-brand/10">
        <div className="mx-auto max-w-2xl text-center space-y-12 relative z-10">
          <div className="space-y-6">
            <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl text-brand-deep">
              Bem-vinda ao <span className="italic">PadrronCroche</span>
            </h2>
            <p className="text-slate-600 text-[17px] leading-relaxed font-medium">
              Descubra um mundo de criatividade, onde cada ponto conta uma história. 
              Seja você iniciante ou experiente, nossas <span className="text-brand font-bold">receitas de crochê e designs digitais</span> estão aqui para inspirar seu próximo projeto.
            </p>
          </div>

          <div className="space-y-10">
            <h3 className="font-display text-2xl font-bold text-brand-deep">
              🧶 O que você encontra aqui ✨:
            </h3>

            <div className="grid gap-10 text-center">
              {[
                { 
                  title: "Receitas de Crochê Únicas 🎨", 
                  desc: "desenhadas com amor e instruções fáceis de seguir." 
                },
                { 
                  title: "Downloads Digitais Instantâneos ⚡", 
                  desc: "comece seu projeto agora mesmo, sem esperas." 
                },
                { 
                  title: "Designs Modernos e Atemporais 🧸", 
                  desc: "desde amigurumis fofos até decoração estilosa." 
                },
                { 
                  title: "Feito para Todos 💪", 
                  desc: "adequado para todos os níveis de habilidade." 
                }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-[18px]">{item.title} —</h4>
                    <p className="text-slate-600 text-[16px] leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-16 space-y-8">
            <h3 className="font-display text-xl font-bold text-brand italic">
              Por que escolher a PadrronCroche? ✨
            </h3>
            
            <div className="space-y-4 text-slate-700 text-[17px] font-medium leading-relaxed">
              <p>— 📍 Instruções claras passo a passo.</p>
              <p>— 🎀 Designs lindos que você não encontra em outro lugar.</p>
              <p>— 📚 Coleção crescente sempre atualizada com novas ideias.</p>
              <p>— 💖 Suporte amigável para sua jornada criativa.</p>
              
              <p className="pt-4 text-brand-deep text-[18px] font-black italic">
                Vamos criar algo lindo juntas! 🧶
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-slate-600 leading-relaxed font-medium text-lg">
            Na <span className="font-bold text-brand">PadrronCroche</span>, acreditamos que o crochê é mais do que apenas um hobby – é uma habilidade que cresce a cada ponto. Nossas receitas digitais são projetadas para tornar o aprendizado simples, divertido e inspirador. 🧶
          </p>

          {/* Review Carousel - Inspiration Styled */}
          <div className="mt-20 relative max-w-[340px] mx-auto">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-50 flex flex-col items-center">
              <div className="w-full pt-12 relative flex justify-center">
                {/* Overlapping Quote Icon */}
                <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-xl z-20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.9124 14 13.017 13.1046 13.017 12V6C13.017 4.89543 13.9124 4 15.017 4H21.017C22.1216 4 23.017 4.89543 23.017 6V12C23.017 13.1046 22.1216 14 21.017 14H21.017C21.017 16.7614 18.7784 19 16.017 19L14.017 21ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017V14H2.017C0.91243 14 0.017 13.1046 0.017 12V6C0.017 4.89543 0.91243 4 2.017 4H8.017C9.12157 4 10.017 4.89543 10.017 6V12C10.017 13.1046 9.12157 14 8.017 14H8.017C8.017 16.7614 5.77843 19 3.017 19L1.017 21Z"/></svg>
                </div>
              </div>
              
              <div className="p-8 pt-10 text-center space-y-4 bg-slate-50/50">
                <div className="flex justify-center gap-1">
                  {[...Array(reviews[currentReview]?.stars || 5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <h4 className="font-display text-xl font-bold text-slate-900">{reviews[currentReview]?.name}</h4>
                <p className="text-slate-600 text-[15px] leading-relaxed italic font-medium">
                  {reviews[currentReview]?.text}
                </p>
                <div className="text-brand text-xs">💕</div>
              </div>
            </div>

            {/* Carousel Controls - Minimalist format < 1/3 > */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button 
                onClick={prevReview}
                className="text-slate-400 hover:text-brand transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[13px] font-bold text-slate-500 font-sans tracking-widest">
                {currentReview + 1} / {reviews.length}
              </span>
              <button 
                onClick={nextReview}
                className="text-slate-400 hover:text-brand transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
