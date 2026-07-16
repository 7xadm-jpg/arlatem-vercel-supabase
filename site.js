const refs = {
  preloader: document.getElementById('preloader'),
  header: document.getElementById('siteHeader'),
  menuToggle: document.getElementById('menuToggle'),
  nav: document.getElementById('mainNav'),
  heroSearchForm: document.getElementById('heroSearchForm'),
  heroSearch: document.getElementById('heroSearch'),
  catalogSearch: document.getElementById('catalogSearch'),
  clearFilters: document.getElementById('clearFilters'),
  productGrid: document.getElementById('productGrid'),
  resultCount: document.getElementById('resultCount'),
  activeFilters: document.getElementById('activeFilters'),
  productModal: document.getElementById('productModal'),
  modalBody: document.getElementById('modalBody'),
  modalTitle: document.getElementById('modalTitle'),
  closeModal: document.getElementById('closeModal'),
  testimonialsTrack: document.getElementById('testimonialsTrack'),
  prevTestimonial: document.getElementById('prevTestimonial'),
  nextTestimonial: document.getElementById('nextTestimonial')
};

const state = {
  content: null,
  products: [],
  search: '',
  brand: '',
  category: '',
  montadora: '',
  model: '',
  year: '',
  motor: '',
  manufacturer: '',
  availability: ''
};

const filterFields = ['brand', 'category', 'montadora', 'model', 'year', 'motor', 'manufacturer', 'availability'];
const filterElements = Object.fromEntries(
  filterFields.map((field) => [field, document.getElementById(`filter${field.charAt(0).toUpperCase() + field.slice(1)}`)])
);

let testimonialIndex = 0;
let testimonialTimer;

const ICONS = {
  pump: '<svg viewBox="0 0 24 24"><path d="M6 8h8a4 4 0 0 1 4 4v4h-2v-4a2 2 0 0 0-2-2H6v6H4V7a3 3 0 0 1 3-3h3v2H7a1 1 0 0 0-1 1v1Zm4 4h3l2 2v5H8v-5l2-2Z"/></svg>',
  sensor: '<svg viewBox="0 0 24 24"><path d="M11 2h2v7h-2V2Zm0 13h2v7h-2v-7ZM2 11h7v2H2v-2Zm13 0h7v2h-7v-2ZM5.64 4.22l1.41-1.41 4.95 4.95-1.41 1.41-4.95-4.95Zm7.36 7.36 1.41-1.41 4.95 4.95-1.41 1.41L13 11.58ZM4.22 18.36l4.95-4.95 1.41 1.41-4.95 4.95-1.41-1.41Zm9.78-9.78 4.95-4.95 1.41 1.41-4.95 4.95L14 8.58Z"/></svg>',
  grid: '<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6V6Zm2 2v8h8V8H8Zm1 1h2v2H9V9Zm4 0h2v2h-2V9ZM9 13h2v2H9v-2Zm4 0h2v2h-2v-2Z"/></svg>',
  doser: '<svg viewBox="0 0 24 24"><path d="M10 3h4v5h-4V3Zm-4 7h12l-1 10H7L6 10Zm3 2v6h2v-6H9Zm4 0v6h2v-6h-2Z"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><path d="M5 4h14l-5 7v7l-4 2v-9L5 4Z"/></svg>',
  chip: '<svg viewBox="0 0 24 24"><path d="M7 7h10v10H7V7Zm-4 4h2v2H3v-2Zm16 0h2v2h-2v-2ZM11 3h2v2h-2V3Zm0 16h2v2h-2v-2ZM9 9h6v6H9V9Z"/></svg>',
  cable: '<svg viewBox="0 0 24 24"><path d="M7 6a3 3 0 1 1 2.83 4H10a3 3 0 0 1-3-4Zm10 8a3 3 0 1 1-2.83 4H14a3 3 0 0 1 3-4ZM8 9h8a3 3 0 0 1 0 6H8V9Zm2 2v2h6a1 1 0 0 0 0-2h-6Z"/></svg>',
  tank: '<svg viewBox="0 0 24 24"><path d="M7 4h10l1 4v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V8l1-4Zm2 2-.5 2h7L15 6H9Zm1 5h4v6h-4v-6Z"/></svg>',
  pipe: '<svg viewBox="0 0 24 24"><path d="M6 5h3v3H6V5Zm9 0h3v3h-3V5ZM7.5 6.5h4A3.5 3.5 0 0 1 15 10v4a2.5 2.5 0 1 0 5 0V11h2v3a4.5 4.5 0 1 1-9 0v-4a1.5 1.5 0 0 0-1.5-1.5h-4v-2Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M5 10h6V5h2v5h6v2h-6v7h-2v-7H5v-2Z"/></svg>',
  repair: '<svg viewBox="0 0 24 24"><path d="M20.71 7.04 16.96 3.3a1 1 0 0 0-1.41 0l-2.27 2.27 5.15 5.15 2.28-2.27a1 1 0 0 0 0-1.41ZM12.57 6.29 4 14.86V20h5.14l8.57-8.57-5.14-5.14Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.4 9.74 8 11 4.6-1.26 8-6 8-11V7l-8-4Zm0 2.18L18 8v4c0 3.82-2.33 7.46-6 8.82C8.33 19.46 6 15.82 6 12V8l6-2.82Z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5.25 3.4 10.17 8 11 4.6-.83 8-5.75 8-11V5l-8-3Zm-1 14-4-4 1.41-1.41L11 13.17l4.59-4.58L17 10l-6 6Z"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M3 6h13v8h5l-2 3h-3a3 3 0 1 1-6 0H8a3 3 0 1 1-6 0H1V9l2-3Zm2 2-1 1.5V15h1a3 3 0 0 1 6 0h3V8H5Zm13 2v5h1.9l1-1.5V10H18Zm-12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>',
  support: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7v2h1a2 2 0 0 1 2 2v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4a2 2 0 0 1 2-2h1V9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5v2h10V9a5 5 0 0 0-5-5Zm-4 9H4v4a3 3 0 0 0 3 3h1v-7Zm2 0v7h4v-7h-4Zm6 0v7h1a3 3 0 0 0 3-3v-4h-4Z"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M4 5h16v2H4V5Zm2 4h12v10H6V9Zm3 2v2h6v-2H9Zm0 4v2h4v-2H9Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><path d="M12 3a8 8 0 0 1 8 8c0 5.25-8 10-8 10S4 16.25 4 11a8 8 0 0 1 8-8Zm0 4a1 1 0 0 0-1 1v4.59l3.7 3.7 1.4-1.42-3.1-3.08V8a1 1 0 0 0-1-1Z"/></svg>',
  verified: '<svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-3h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 9-3-3 1.4-1.4 1.6 1.6 4.6-4.6L17 6l-6 6Z"/></svg>'
};

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value;
}

function setHtml(id, value) {
  const el = byId(id);
  if (el) el.innerHTML = value;
}

function iconMarkup(key) {
  return ICONS[key] || ICONS.shield;
}

function productImage(product) {
  if (product.image) return product.image;

  const colorMap = {
    'Bombas ARLA': ['#0b5ed7', '#2ecc71'],
    'Sensores NOx': ['#123a74', '#0b5ed7'],
    'Catalisadores': ['#0b5ed7', '#0d8e61'],
    'Dosadores': ['#1f6fe5', '#34d67d'],
    'Filtros': ['#3b82f6', '#2ecc71'],
    'Módulos': ['#0f3d91', '#20c997'],
    'Chicotes': ['#214e9a', '#2ecc71'],
    'Reservatórios': ['#0a69cc', '#4ade80'],
    'Tubulações': ['#0e57c7', '#2dbf74'],
    'Peças Pneumáticas': ['#1d4ed8', '#10b981'],
    'Kits de Reparo': ['#2563eb', '#22c55e'],
    'Acessórios': ['#0b5ed7', '#44c767']
  };

  const [start, end] = colorMap[product.category] || ['#0b5ed7', '#2ecc71'];
  const category = String(product.category || '').replace(/&/g, '&amp;');
  const name = String(product.name || '').slice(0, 28).replace(/&/g, '&amp;');
  const brand = String(product.brand || '').replace(/&/g, '&amp;');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}"/>
          <stop offset="100%" stop-color="${end}"/>
        </linearGradient>
      </defs>
      <rect width="640" height="440" rx="30" fill="url(#g)"/>
      <circle cx="540" cy="90" r="82" fill="rgba(255,255,255,0.12)"/>
      <circle cx="100" cy="360" r="96" fill="rgba(255,255,255,0.08)"/>
      <rect x="44" y="54" width="552" height="332" rx="26" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)"/>
      <rect x="92" y="124" width="240" height="140" rx="24" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.18)"/>
      <circle cx="175" cy="194" r="42" fill="rgba(255,255,255,0.9)"/>
      <circle cx="175" cy="194" r="24" fill="${start}"/>
      <rect x="240" y="164" width="210" height="18" rx="9" fill="rgba(255,255,255,0.84)"/>
      <rect x="240" y="194" width="160" height="14" rx="7" fill="rgba(255,255,255,0.48)"/>
      <text x="92" y="94" fill="white" font-size="28" font-family="Inter, Arial, sans-serif" font-weight="700">${category}</text>
      <text x="92" y="350" fill="white" font-size="20" font-family="Inter, Arial, sans-serif" opacity="0.92">${brand}</text>
      <text x="92" y="378" fill="white" font-size="18" font-family="Inter, Arial, sans-serif" opacity="0.74">${name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeSocialUrl(value, platform) {
  const raw = String(value || '').trim();
  if (!raw || raw === '#') return '#';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  const username = raw.replace(/^@/, '');

  if (platform === 'instagram') {
    return `https://www.instagram.com/${username}/`;
  }

  if (platform === 'facebook') {
    return `https://www.facebook.com/${username}`;
  }

  return raw;
}

function buildWhatsAppLink(message) {
  const number = String(state.content?.settings?.whatsappNumber || '').replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function setWhatsAppLink(element, message) {
  if (!element) return;
  element.href = buildWhatsAppLink(message);
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
}

async function loadData() {
  const response = await fetch('/api/content', { cache: 'no-store' });
  const payload = await response.json();

  if (!payload.ok) throw new Error('Falha ao carregar conteúdo');

  state.content = payload.data;
  state.products = payload.data.products || [];
  renderAll();
}

function renderAll() {
  renderBrand();
  renderHero();
  renderHighlights();
  renderCategories();
  renderBrands();
  renderBenefits();
  renderBanner();
  renderAbout();
  renderBlog();
  renderFaq();
  renderProducts();
  renderTestimonials();
  setupFilters();
  setupMisc();
  setupObserver();
}

function renderBrand() {
  const { settings } = state.content;

  setText('brandName', settings.siteName);
  setText('brandTagline', settings.tagline);
  setText('footerBrandName', settings.siteName);

  document.title = `${settings.siteName} | Catálogo Profissional`;
}

function renderHero() {
  const { hero } = state.content;

  setText('heroEyebrow', hero.eyebrow);
  setText('heroTitle', hero.title);
  setText('heroSubtitle', hero.subtitle);

  const heroImage = byId('heroImage');
  if (heroImage) heroImage.src = hero.backgroundImage;

  if (refs.heroSearch) refs.heroSearch.placeholder = hero.searchPlaceholder;

  setText('productCountBadge', `+${state.products.length}`);

  const tags = ['Sensor NOx', 'Bomba ARLA', 'Catalisador', 'Dosador', 'Filtro', 'Módulo'];
  setHtml(
    'searchTags',
    tags.map((tag) => `<button type="button" class="tag-pill search-chip">${tag}</button>`).join('')
  );

  setWhatsAppLink(byId('navWhatsapp'), 'Olá! Quero solicitar um orçamento na ARLATEM.');
  setWhatsAppLink(byId('heroWhatsapp'), 'Olá! Quero solicitar um orçamento para peças do sistema de ARLA.');

  document.querySelectorAll('.search-chip').forEach((chip) => {
    chip.addEventListener('click', () => applySearchTerm(chip.textContent.trim()));
  });
}

function renderHighlights() {
  const list = state.content.highlights || [];
  setHtml(
    'highlightsList',
    list.map((item) => `<div class="quick-item"><span>✔</span> ${item}</div>`).join('')
  );
}

function renderCategories() {
  const categories = state.content.categories || [];

  setHtml(
    'categoryGrid',
    categories
      .map(
        (category, index) => `
      <button class="category-card reveal ${index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : ''}" data-category="${category.name}">
        <span class="icon-wrap">${iconMarkup(category.icon)}</span>
        <strong>${category.name}</strong>
        <small>${category.description}</small>
      </button>
    `
      )
      .join('')
  );
