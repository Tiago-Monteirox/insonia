export const products = [
  {
    id: "jaqueta-line",
    slug: "jaqueta-line",
    name: "Jaqueta Line",
    price: 349.9,
    priceLabel: "R$ 349,90",
    category: "Roupas",
    categorySlug: "roupas",
    badge: "Novo",
    color: "Preto profundo",
    fit: "Slim urbano",
    stock: 8,
    sizes: ["P", "M", "G", "GG"],
    collections: ["novidades", "roupas"],
    featured: true,
    image: "/images/products/jaqueta-line.png",
    description: "Jaqueta leve de corte seco, pensada para sobrepor camisetas e moletons sem perder a silhueta.",
    details: ["Tecido encorpado com toque fosco", "Bolsos frontais embutidos", "Barra ajustavel", "Etiqueta INSÔNIA discreta"]
  },
  {
    id: "camiseta-eye",
    slug: "camiseta-eye",
    name: "Camiseta Eye",
    price: 149.9,
    priceLabel: "R$ 149,90",
    category: "Roupas",
    categorySlug: "roupas",
    badge: "Essencial",
    color: "Off-white lavado",
    fit: "Reta slim",
    stock: 18,
    sizes: ["PP", "P", "M", "G", "GG"],
    collections: ["novidades", "roupas"],
    featured: true,
    image: "/images/products/camiseta-eye.png",
    description: "Camiseta de algodao com logo central inspirado no olho INSÔNIA, criada para ser a base do drop.",
    details: ["Algodao macio", "Gola reforcada", "Estampa frontal tonal", "Comprimento regular"]
  },
  {
    id: "calca-slim-cargo",
    slug: "calca-slim-cargo",
    name: "Calça Slim Cargo",
    price: 289.9,
    priceLabel: "R$ 289,90",
    category: "Roupas",
    categorySlug: "roupas",
    badge: "Mais vista",
    color: "Grafite",
    fit: "Slim com mobilidade",
    stock: 11,
    sizes: ["36", "38", "40", "42", "44"],
    collections: ["novidades", "roupas"],
    featured: true,
    image: "/images/products/calca-slim-cargo.png",
    description: "Cargo slim com bolsos baixos, cintura confortavel e construcao voltada para movimento.",
    details: ["Sarja com elastano", "Bolsos cargo laterais", "Cintura media", "Punho levemente ajustado"]
  },
  {
    id: "overshirt-grafite",
    slug: "overshirt-grafite",
    name: "Overshirt Grafite",
    price: 319.9,
    priceLabel: "R$ 319,90",
    category: "Roupas",
    categorySlug: "roupas",
    badge: "Drop 01",
    color: "Grafite escuro",
    fit: "Slim relaxado",
    stock: 7,
    sizes: ["P", "M", "G", "GG"],
    collections: ["novidades", "roupas", "outlet"],
    featured: true,
    image: "/images/products/overshirt-grafite.png",
    description: "Camisa sobreposta com estrutura de jaqueta leve, ideal para compor looks noturnos em camadas.",
    details: ["Botao fosco", "Bolso frontal unico", "Caimento reto", "Acabamento interno limpo"]
  },
  {
    id: "tenis-asfalto-low",
    slug: "tenis-asfalto-low",
    name: "Tênis Asfalto Low",
    price: 399.9,
    priceLabel: "R$ 399,90",
    category: "Calçados",
    categorySlug: "calcados",
    badge: "Skate",
    color: "Preto e vinho",
    fit: "Forma regular",
    stock: 9,
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    collections: ["novidades", "calcados"],
    featured: false,
    description: "Tenis baixo de sola reta, visual limpo e construcao pensada para rotina urbana.",
    details: ["Sola emborrachada", "Biqueira reforcada", "Palmilha macia", "Detalhe vinho lateral"]
  },
  {
    id: "tenis-vinho-mid",
    slug: "tenis-vinho-mid",
    name: "Tênis Vinho Mid",
    price: 429.9,
    priceLabel: "R$ 429,90",
    category: "Calçados",
    categorySlug: "calcados",
    badge: "Novo",
    color: "Vinho fechado",
    fit: "Cano medio",
    stock: 6,
    sizes: ["38", "39", "40", "41", "42"],
    collections: ["calcados"],
    featured: false,
    description: "Modelo mid com presenca mais forte, mantendo a linha slim e escura da INSÔNIA.",
    details: ["Cano acolchoado", "Sola preta", "Recortes tonais", "Cadarco encerado"]
  },
  {
    id: "bone-panel-eye",
    slug: "bone-panel-eye",
    name: "Boné Panel Eye",
    price: 119.9,
    priceLabel: "R$ 119,90",
    category: "Acessórios",
    categorySlug: "acessorios",
    badge: "Acessorio",
    color: "Preto",
    fit: "Ajustavel",
    stock: 15,
    sizes: ["Unico"],
    collections: ["acessorios", "outlet"],
    featured: false,
    description: "Bone de aba curva com aplicacao discreta, criado para fechar a identidade visual do look.",
    details: ["Ajuste traseiro", "Logo bordado", "Aba estruturada", "Forro interno leve"]
  },
  {
    id: "shoulder-bag-noite",
    slug: "shoulder-bag-noite",
    name: "Shoulder Bag Noite",
    price: 179.9,
    priceLabel: "R$ 179,90",
    category: "Acessórios",
    categorySlug: "acessorios",
    badge: "Utilitario",
    color: "Grafite",
    fit: "Compacta",
    stock: 10,
    sizes: ["Unico"],
    collections: ["acessorios", "novidades"],
    featured: false,
    description: "Bolsa compacta com divisorias para carregar o essencial sem quebrar a silhueta.",
    details: ["Alca regulavel", "Bolso externo", "Fechamento zipado", "Etiqueta lateral tonal"]
  }
];

export const featuredProducts = products.filter((product) => product.featured);

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug || product.id === slug);
}

export function getProductsByCollection(collectionSlug) {
  return products.filter((product) => product.collections.includes(collectionSlug));
}

export function getOrderById(id) {
  return orders.find((order) => order.id.toLowerCase() === id.toLowerCase());
}

export const collections = {
  novidades: {
    activeNav: "novidades",
    kicker: "Novidades",
    title: "Drop novo",
    description: "Jaquetas, camisetas e cargos com silhueta slim para a primeira vitrine INSÔNIA.",
    label: "Últimas peças adicionadas"
  },
  calcados: {
    activeNav: "calcados",
    kicker: "Calçados",
    title: "Tênis e shapes urbanos",
    description: "Uma seleção escura, limpa e voltada para o uso diário no skatewear.",
    label: "Base de calçados"
  },
  roupas: {
    activeNav: "roupas",
    kicker: "Roupas",
    title: "Roupas skatewear",
    description: "Cortes retos, tons fechados e peças fáceis de combinar em looks noturnos.",
    label: "Peças principais"
  },
  acessorios: {
    activeNav: "acessorios",
    kicker: "Acessórios",
    title: "Detalhes de rua",
    description: "Bonés, bolsas e itens complementares para fechar a identidade da coleção.",
    label: "Complementos do drop"
  },
  outlet: {
    activeNav: "outlet",
    kicker: "Outlet",
    title: "Últimas peças",
    description: "Produtos demonstrativos com preço de saída, mantendo a estética premium INSÔNIA.",
    label: "Seleção outlet"
  }
};

export const orders = [
  {
    id: "IN-1048",
    title: "Drop noturno completo",
    items: "Jaqueta Line, Camiseta Eye e Calça Slim Cargo",
    total: "R$ 789,70",
    status: "Enviado",
    statusClass: "is-shipping",
    steps: [
      ["Confirmado", "Pedido recebido", "complete"],
      ["Pagamento aceito", "Cartão aprovado", "complete"],
      ["Enviado", "A caminho", "current"],
      ["Entregue", "Aguardando entrega", ""]
    ]
  },
  {
    id: "IN-1032",
    title: "Kit skatewear essencial",
    items: "Overshirt Grafite e Camiseta Eye",
    total: "R$ 469,80",
    status: "Entregue",
    statusClass: "is-delivered",
    steps: [
      ["Confirmado", "Pedido recebido", "complete"],
      ["Pagamento aceito", "Pix aprovado", "complete"],
      ["Enviado", "Saiu para entrega", "complete"],
      ["Entregue", "Finalizado", "complete"]
    ]
  },
  {
    id: "IN-1024",
    title: "Camisetas da coleção",
    items: "Camiseta Eye e Camiseta Night Logo",
    total: "R$ 299,80",
    status: "Pagamento aceito",
    statusClass: "is-payment",
    steps: [
      ["Confirmado", "Pedido recebido", "complete"],
      ["Pagamento aceito", "Boleto compensado", "current"],
      ["Enviado", "Em preparação", ""],
      ["Entregue", "Aguardando envio", ""]
    ]
  }
];

export const adminSales = [
  {
    id: "IN-1052",
    customer: "Marina Costa",
    date: "Hoje, 19:12",
    channel: "Site",
    payment: "Pix",
    status: "Pago",
    fulfillment: "Separar",
    total: 619.8,
    profit: 232.4,
    items: "Tênis Asfalto Low, Boné Panel Eye",
    statusClass: "is-payment"
  },
  {
    id: "IN-1051",
    customer: "Rafael Nunes",
    date: "Hoje, 17:46",
    channel: "Site",
    payment: "Cartão",
    status: "Enviado",
    fulfillment: "Em transporte",
    total: 789.7,
    profit: 318.6,
    items: "Jaqueta Line, Camiseta Eye, Calça Slim Cargo",
    statusClass: "is-shipping"
  },
  {
    id: "IN-1050",
    customer: "Bianca Torres",
    date: "Hoje, 15:08",
    channel: "Site",
    payment: "Pix",
    status: "Confirmado",
    fulfillment: "Aguardando separação",
    total: 319.9,
    profit: 126.2,
    items: "Overshirt Grafite",
    statusClass: "is-pending"
  },
  {
    id: "IN-1049",
    customer: "Lucas Andrade",
    date: "Ontem, 21:32",
    channel: "Instagram",
    payment: "Cartão",
    status: "Entregue",
    fulfillment: "Finalizado",
    total: 549.8,
    profit: 201.7,
    items: "Tênis Vinho Mid, Shoulder Bag Noite",
    statusClass: "is-delivered"
  },
  {
    id: "IN-1048",
    customer: "Camila Souza",
    date: "Ontem, 18:40",
    channel: "Site",
    payment: "Cartão",
    status: "Enviado",
    fulfillment: "A caminho",
    total: 789.7,
    profit: 318.6,
    items: "Jaqueta Line, Camiseta Eye, Calça Slim Cargo",
    statusClass: "is-shipping"
  }
];

export const salesTimeline = [
  { label: "Seg", value: 420 },
  { label: "Ter", value: 760 },
  { label: "Qua", value: 590 },
  { label: "Qui", value: 980 },
  { label: "Sex", value: 1240 },
  { label: "Sáb", value: 860 },
  { label: "Dom", value: 690 }
];

export const topProducts = [
  { name: "Jaqueta Line", sold: 18, revenue: 6298.2 },
  { name: "Tênis Asfalto Low", sold: 14, revenue: 5598.6 },
  { name: "Calça Slim Cargo", sold: 12, revenue: 3478.8 },
  { name: "Camiseta Eye", sold: 22, revenue: 3297.8 }
];
