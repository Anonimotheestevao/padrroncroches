import granny from "@/assets/produto-granny.jpg";
import flores from "@/assets/produto-flores.jpg";
import bebe from "@/assets/produto-bebe.jpg";
import mantas from "@/assets/produto-mantas.jpg";
import almofadas from "@/assets/produto-almofadas.jpg";
import amigurumi from "@/assets/produto-amigurumi.jpg";
import amigurumiCapa4000 from "@/assets/amigurumi-capa-4000-receitas.jpg";
import amigurumiReceba from "@/assets/amigurumi-receba-pdf.jpg";
import amigurumiGridAnimais from "@/assets/amigurumi-grid-animais.jpg";
import amigurumiGridChaveiros from "@/assets/amigurumi-grid-chaveiros.jpg";
import amigurumiGridOceano from "@/assets/amigurumi-grid-oceano.jpg";
import amigurumiGridSafari from "@/assets/amigurumi-grid-safari.jpg";
import bolsaCapa300 from "@/assets/bolsa-capa-300-receitas.jpg";
import bolsaReceba from "@/assets/bolsa-receba-pdf.jpg";
import bolsaGridTiracolo from "@/assets/bolsa-grid-tiracolo.jpg";
import bolsaGridMochilas from "@/assets/bolsa-grid-mochilas.jpg";
import bolsaGridPraia from "@/assets/bolsa-grid-praia.jpg";
import coelhinhaGallery1 from "@/assets/coelhinha-gallery-1.jpg";
import coelhinhaGallery2 from "@/assets/coelhinha-gallery-2.jpg";
import coelhinhaGallery3 from "@/assets/coelhinha-gallery-3.jpg";
import coelhinhaGallery4 from "@/assets/coelhinha-gallery-4.jpg";
import coelhinhaGallery5 from "@/assets/coelhinha-gallery-5.jpg";
import coelhinhaGallery6 from "@/assets/coelhinha-gallery-6.jpg";
import coelhinhaGallery7 from "@/assets/coelhinha-gallery-7.jpg";
import coelhinhaGallery8 from "@/assets/coelhinha-gallery-8.jpg";
import coelhinhaGallery9 from "@/assets/coelhinha-gallery-9.jpg";
import coelhinhaRoupinhasKit from "@/assets/coelhinha-roupinhas-kit.jpg";
import sapatinhoCapa100 from "@/assets/sapatinho-capa-100-receitas.jpg";
import sapatinhoReceba from "@/assets/sapatinho-receba-pdf.jpg";
import sapatinhoGridMenina from "@/assets/sapatinho-grid-menina.jpg";
import sapatinhoGridAnimais from "@/assets/sapatinho-grid-animais.jpg";



export type DescriptionSection = {
  icon: string;
  title: string;
  items: string[];
};

export type CustomerReview = {
  name: string;
  stars: number;
  date: string;
  text: string;
};

export type Product = {
  slug: string;
  title: string;
  price: number;
  compareAt: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviews: number;
  badge?: string;
  tagline: string;
  highlights: string[];
  descriptionHeadline?: string;
  descriptionSubheadline?: string;
  descriptionSections?: DescriptionSection[];
  customerReviews?: CustomerReview[];
  hideBundleOffer?: boolean;
  singleOfferShowcase?: { image: string; label: string }[];
  thematicThemes?: {
    title: string;
    items: { icon: string; label: string }[];
  };
};

export const products: Product[] = [
  {
    slug: "4000-receitas-amigurumi",
    title: "+4000 Receitas Amigurumis – Pacote PDF",
    price: 10.9,
    compareAt: 49.9,
    image: amigurumiCapa4000,
    gallery: [
      amigurumiReceba,
      amigurumiGridAnimais,
      amigurumiGridChaveiros,
      amigurumiGridOceano,
      amigurumiGridSafari,
    ],
    rating: 5.0,
    reviews: 94,
    badge: "MAIS VENDIDO",
    tagline: "Um acervo completo para criar amigurumis com mais praticidade, organização e qualidade.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Aprovado por milhares de crocheteiras",
    ],
    descriptionSections: [
      {
        icon: "📚",
        title: "+4.000 Receitas em PDF",
        items: [
          "Animais, bonecas, personagens, chaveiros e muito mais.",
          "Arquivos das receitas organizados por categorias.",
          "Tudo pronto para acessar e baixar.",
        ],
      },
      {
        icon: "🧸",
        title: "Receitas com Passo a Passo Ilustrado",
        items: [
          "Fotos detalhadas durante o processo.",
          "Explicação dos pontos utilizados.",
          "Maior facilidade na execução das peças.",
        ],
      },
      {
        icon: "📱",
        title: "Acesso em Qualquer Dispositivo",
        items: [
          "Celular, computador ou tablet.",
          "Arquivos organizados no Google Drive.",
          "Consulte as receitas onde e quando quiser.",
        ],
      },
      {
        icon: "⚡",
        title: "Entrega Imediata",
        items: [
          "Receba o link por e-mail.",
          "Comece a acessar em poucos minutos.",
          "Sem esperar dias pela entrega.",
        ],
      },
      {
        icon: "📂",
        title: "Conteúdo Organizado",
        items: ["Categorias separadas.", "Fácil navegação.", "Biblioteca sempre organizada."],
      },
      {
        icon: "⭐",
        title: "Mais de 12.000 Acessos Realizados",
        items: [
          "Receitas utilizadas em todo o Brasil.",
          "Milhares de downloads realizados.",
          "Conteúdo aprovado por quem ama amigurumi.",
        ],
      },
    ],
    thematicThemes: {
      title: "Encontre receitas de todos esses temas",
      items: [
        { icon: "🧸", label: "Ursinhos" },
        { icon: "🦁", label: "Safari" },
        { icon: "🔑", label: "Chaveiros" },
        { icon: "🐮", label: "Fazendinha" },
        { icon: "🧜", label: "Princesas" },
        { icon: "🎮", label: "Personagens Famosos" },
        { icon: "🐟", label: "Fundo do Mar" },
        { icon: "👼", label: "Maternidade" },
      ],
    },
  },
  {
    slug: "300-receitas-bolsa-croche",
    title: "+300 Receitas de Bolsa Croche – Pacote PDF",
    price: 10.9,
    compareAt: 49.9,
    image: bolsaCapa300,
    gallery: [
      bolsaReceba,
      bolsaGridTiracolo,
      bolsaGridMochilas,
      bolsaGridPraia,
    ],


    rating: 5.0,
    reviews: 87,
    badge: "COLEÇÃO PREMIUM",
    tagline: "Um acervo completo para criar bolsas com mais praticidade, organização e acabamento profissional.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Modelos exclusivos",
    ],
    descriptionSections: [
      {
        icon: "👜",
        title: "+300 Receitas em PDF",
        items: [
          "Bolsas de praia, mochilas, bolsas de festa, carteiras e tiracolo.",
          "Arquivos organizados por modelos e tipos de fios (fio de malha, barbante, náutico).",
          "Tudo pronto para acessar, salvar e baixar.",
        ],
      },
      {
        icon: "🧵",
        title: "Passo a Passo com Gráficos e Receitas Ilustradas",
        items: [
          "Fotos detalhadas das etapas mais complexas.",
          "Explicação clara dos pontos utilizados.",
          "Maior facilidade na execução de fundos, laterais e fechamentos.",
        ],
      },
      {
        icon: "📱",
        title: "Acesso em Qualquer Dispositivo",
        items: [
          "Celular, computador ou tablet.",
          "Arquivos organizados de forma limpa no Google Drive.",
          "Consulte as receitas na sua mesa de trabalho onde e quando quiser.",
        ],
      },
      {
        icon: "⚡",
        title: "Entrega Imediata",
        items: [
          "Receba o link de acesso imediatamente por e-mail após a compra.",
          "Comece a crochetar em poucos minutos.",
          "Sem esperar dias e sem pagar frete.",
        ],
      },
      {
        icon: "📂",
        title: "Conteúdo Organizado",
        items: [
          "Categorias separadas por nível de dificuldade (Iniciante ao Avançado).",
          "Fácil navegação para encontrar o modelo perfeito para sua cliente.",
          "Biblioteca digital para sempre.",
        ],
      },
      {
        icon: "⭐",
        title: "Mais de 8.000 Acessos Realizados",
        items: [
          "Modelos que seguem as maiores tendências de moda do Brasil.",
          "Milhares de downloads de gráficos testados e aprovados.",
          "Conteúdo selecionado por quem ama a arte das bolsas estruturadas.",
        ],
      },
    ],
    thematicThemes: {
      title: "Encontre modelos e passo a passo de todos esses estilos",
      items: [
        { icon: "☀️", label: "Bolsas de Praia" },
        { icon: "👜", label: "Tiracolo e Transversais" },
        { icon: "🎒", label: "Mochilas Estruturadas" },
        { icon: "💎", label: "Clutches e Festa" },
        { icon: "🧶", label: "Fio de Malha (Estruturadas)" },
        { icon: "🛍️", label: "Bolsas Sacola" },
        { icon: "👛", label: "Carteiras e Porta-Celular" },
        { icon: "👝", label: "Nécessaires" },
      ],
    },
  },
  {
    slug: "100-sapatinhos-croche-bebe",
    title: "+100 Sapatinhos de crochê para bebês",
    price: 10.9,
    compareAt: 49.9,
    image: sapatinhoCapa100,
    gallery: [
      sapatinhoReceba,
      sapatinhoGridMenina,
      sapatinhoGridAnimais,
    ],
    rating: 5.0,
    reviews: 82,
    badge: "LANÇAMENTO",
    tagline: "Um acervo completo para criar sapatinhos com mais praticidade, organização e acabamento profissional.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Modelos exclusivos",
    ],
    descriptionSections: [
      {
        icon: "👶",
        title: "Mais de 100 Modelos Exclusivos",
        items: [
          "Desde os clássicos para recém-nascidos até os sapatinhos modernos para os primeiros passos.",
        ],
      },
      {
        icon: "🧵",
        title: "Gráficos Limpos e Sem Complicação",
        items: [
          "Chega de pontos errados. Fotos detalhadas das etapas mais delicadas para você acertar a sola e a costura logo de primeira.",
        ],
      },
      {
        icon: "📱",
        title: "Acesse Onde e Quando Quiser",
        items: [
          "Baixe no seu celular, tablet ou computador. Suas receitas organizadas para você consultar direto na sua mesa de trabalho.",
        ],
      },
      {
        icon: "⚡",
        title: "Comece a Crochetar Ainda Hoje",
        items: [
          "Nada de esperar dias pelos Correios ou pagar frete caro. Comprou, o link chega na mesma hora no seu e-mail.",
        ],
      },
      {
        icon: "📂",
        title: "Do Iniciante ao Avançado",
        items: [
          "Conteúdo separado por níveis de dificuldade. Encontre o modelo perfeito para o bebê sem perder tempo procurando.",
        ],
      },
      {
        icon: "⭐",
        title: "Modelos que Mais Vendem no Brasil",
        items: [
          "Gráficos testados e aprovados que seguem as maiores tendências de enxovais de maternidade atuais.",
        ],
      },
    ],
    thematicThemes: {
      title: "Encontre modelos e passo a passo de todos esses estilos",
      items: [
        { icon: "☀️", label: "Sapatinhos de Verão" },
        { icon: "👟", label: "Tênis de Crochê" },
        { icon: "🎀", label: "Sapatinhos de Menina" },
        { icon: "🚙", label: "Sapatinhos de Menino" },
        { icon: "🧸", label: "Modelos com Bichinhos" },
        { icon: "👑", label: "Sapatinhos de Batizado" },
        { icon: "🩰", label: "Sapatilhas e Balé" },
        { icon: "🎁", label: "Conjuntos para Maternidade" },
      ],
    },
  },
  {
    slug: "800-padroes-granny-square",
    title: "800+ Padrões Granny Square",
    price: 14.9,
    compareAt: 117,
    image: granny,
    rating: 5.0,
    reviews: 98,
    badge: "MAIS DE 800 PADRÕES",
    tagline:
      "Pacote definitivo com mais de 800 padrões de granny square em crochê – e mais 20 padrões florais GRÁTIS!",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Aprovado por milhares de crocheteiras",
    ],
  },
  {
    slug: "800-padroes-de-flores",
    title: "800 Padrões de Flores em Crochê",
    price: 14.9,
    compareAt: 74.9,
    image: flores,
    rating: 4.8,
    reviews: 89,
    badge: "BUNDLE DIGITAL",
    tagline:
      "Uma biblioteca completa de flores em crochê para transformar qualquer peça em algo especial.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Receitas passo a passo",
    ],
  },
  {
    slug: "100-padroes-de-bebe",
    title: "100+ Padrões de Crochê para Bebê",
    price: 12.9,
    compareAt: 64,
    image: bebe,
    rating: 4.9,
    reviews: 92,
    badge: "MAIS DE 100 PDFs",
    tagline: "Botinhas, mantas, toucas e conjuntinhos para presentear ou vender.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Do iniciante ao avançado",
    ],
  },
  {
    slug: "30-padroes-de-mantas",
    title: "30 Padrões de Mantas em Crochê",
    price: 11.9,
    compareAt: 64,
    image: mantas,
    rating: 4.7,
    reviews: 85,
    badge: "PADRÕES DE MANTAS",
    tagline: "Mantas modernas e clássicas para deixar a casa ainda mais aconchegante.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Gráficos e receitas escritas",
    ],
  },
  {
    slug: "10-em-1-almofadas",
    title: "10 em 1 Almofadas de Crochê",
    price: 11.9,
    compareAt: 64,
    image: almofadas,
    rating: 4.8,
    reviews: 81,
    badge: "10 MODELOS",
    tagline: "Dez almofadas de animais fofos explicadas passo a passo com fotos.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Passo a passo com fotos",
    ],
  },
  {
    slug: "coelhinha-bella-croche-roupinha",
    title: "Coelhinha Bella de Crochê + Roupinha",
    price: 10.9,
    compareAt: 49.9,
    image: coelhinhaGallery1,
    gallery: [
      coelhinhaGallery2,
      coelhinhaGallery3,
      coelhinhaGallery4,
      coelhinhaGallery5,
      coelhinhaGallery6,
      coelhinhaGallery7,
      coelhinhaGallery8,
      coelhinhaGallery9,
    ],
    rating: 5.0,
    reviews: 88,
    badge: "LANÇAMENTO",
    hideBundleOffer: true,
    singleOfferShowcase: [
      { image: coelhinhaGallery9, label: "Coelhinha Bella de Crochê" },
      { image: coelhinhaRoupinhasKit, label: "Kit de 3 Roupinhas para a Bella" },
    ],
    tagline: "Uma receita fofa e completa para criar a Coelhinha Bella com roupinha personalizada em crochê.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Passo a passo detalhado",
    ],
    descriptionHeadline: "🐰 Crie sua própria coelhinha Bella. Um conjunto de crochê feito com muito carinho.",
    descriptionSubheadline:
      "🧸 Macia, fofinha e cheia de charme, Bella vem com um look completo: suéter, calça, chapéu, laço, tiara e muito mais. Um projeto tão prazeroso de fazer quanto de presentear.",
    descriptionSections: [
      {
        icon: "📦",
        title: "O que está incluído",
        items: [
          "📜 Receita completa de crochê para a coelhinha Bella (aproximadamente 28-30 cm de altura)",
          "👗 Instruções de montagem do look: suéter, calça, chapéu, laço, tiara e acessórios",
          "📸 Fotos passo a passo para maior clareza e facilidade",
          "🧶 Lista de materiais, gráfico de pontos e explicações claras",
          "📥 Download instantâneo do PDF — comece a fazer crochê agora mesmo",
        ],
      },
      {
        icon: "💖",
        title: "Por que você vai amar Bella",
        items: [
          "👶 Presente artesanal perfeito",
          "🪡 Desenhado com amor, com cuidado em cada detalhe costurado",
          "✨ Valor 2 em 1: coelhinho + roupinha em um único conjunto",
          "🎨 Personalizável — ajuste o tamanho, as cores e os detalhes para tornar a Bella verdadeiramente sua",
          "🧵 Faça crochê com carinho e crie a Bella, a Coelhinha, uma lembrança que você guardará para sempre",
        ],
      },
    ],
    customerReviews: [
      {
        name: "Fernanda R.",
        stars: 5,
        date: "02 mar 2026",
        text: "A Bella ficou um amor! As instruções da roupinha são claríssimas, terminei em um fim de semana e o resultado ficou lindo demais.",
      },
      {
        name: "Patrícia Souza",
        stars: 5,
        date: "18 fev 2026",
        text: "Comprei para vender e já fiz 5 encomendas. O passo a passo com fotos ajuda muito na hora de montar o conjuntinho inteiro.",
      },
      {
        name: "Camila Andrade",
        stars: 4,
        date: "27 jan 2026",
        text: "Muito fofa! Só achei o chapéu um pouco mais trabalhoso, mas o resultado final compensa cada pontinho. Recomendo demais.",
      },
      {
        name: "Larissa M.",
        stars: 5,
        date: "09 fev 2026",
        text: "Fiz para minha sobrinha e ela amou a Bella. O PDF é bem organizado, dá para seguir tranquilamente mesmo sendo iniciante.",
      },
    ],
  },
  {
    slug: "12-padroes-de-amigurumi",
    title: "12 Padrões de Animais em Amigurumi",
    price: 11.9,
    compareAt: 64,
    image: amigurumi,
    rating: 4.9,
    reviews: 95,
    badge: "12 PADRÕES",
    tagline: "Elefante, coelho, urso e muito mais — receitas completas com fotos.",
    highlights: [
      "Download imediato",
      "Acesso em segundos",
      "Receita digital em PDF",
      "Compra segura",
      "Aprovado por milhares de crocheteiras",
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function discountPercent(p: Product) {
  return Math.round((1 - p.price / p.compareAt) * 100);
}
