const fs = require('fs');
const path = require('path');

function safeReadJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function getDefaultPayload() {
  const defaultContent = {
    settings: {
      siteName: 'ARLATEM',
      tagline: 'ARLA 32 • SCR • Linha Pesada',
      whatsappNumber: '5531992007778',
      email: 'arlatem.sac@gmail.com',
      instagram: '@arlatem.oficial',
      facebook: 'arlatem',
      location: 'R. Maestro Azérias, 133 - Inconfidentes, Contagem - MG, 32260-270',
      hours: 'Seg a Sex • 08h às 18h',
      copyrightText: 'ARLATEM — Contagem/MG. Especialistas em peças para ARLA 32, sistema SCR e pós-tratamento diesel.',
      adminPath: '/acesso-tecnico-arlatem'
    },
    hero: {
      eyebrow: 'Tudo em Peças para ARLA 32, Sistema SCR e Pós-Tratamento Diesel',
      title: 'Peças para ARLA 32, Sistema SCR e Catalisadores em Contagem, Belo Horizonte e Região Metropolitana',
      subtitle: 'Sensores NOx, bombas dosadoras, módulos eletrônicos, catalisadores e componentes de pós-tratamento diesel para linha pesada.',
      backgroundImage: '/uploads/hero-trucks-arla.png',
      searchPlaceholder: 'Pesquisar por Sensor NOx, Bomba ARLA, Catalisador, Dosador, Chicote, Filtro, Módulo, Válvula...'
    },
    highlights: [
      'Peças Originais',
      'Atendimento Especializado',
      'Produtos Testados',
      'Suporte Técnico',
      'Envio para Todo Brasil'
    ],
    categories: [],
    brands: [],
    benefits: [],
    banner: {
      eyebrow: 'Suporte comercial rápido',
      title: 'Não encontrou sua peça?',
      subtitle: 'Nossa equipe encontra para você com base no código, chassi, montadora ou aplicação.'
    },
    about: {
      title: 'Especialistas em ARLA 32, SCR e pós-tratamento diesel',
      paragraph1: 'A ARLATEM atende oficinas, transportadoras, frotistas e compradores técnicos.',
      paragraph2: 'Atendimento em Contagem, Belo Horizonte, RMBH e todo o Brasil.',
      points: [],
      specs: []
    },
    blog: [],
    testimonials: [],
    faq: []
  };

  const defaultProducts = [];

  const contentPath = path.join(process.cwd(), 'data', 'default-content.json');
  const productsPath = path.join(process.cwd(), 'data', 'default-products.json');

  const content = safeReadJson(contentPath, defaultContent);
  const products = safeReadJson(productsPath, defaultProducts);

  return {
    ...defaultContent,
    ...content,
    products
  };
}

module.exports = {
  getDefaultPayload
};
