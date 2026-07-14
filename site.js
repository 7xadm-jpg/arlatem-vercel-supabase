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
const filterElements = Object.fromEntries(filterFields.map((field) => [field, document.getElementById(`filter${field.charAt(0).toUpperCase() + field.slice(1)}`)]));

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
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildWhatsAppLink(message) {
  const number = state.content.settings.whatsappNumber || '';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function setWhatsAppLink(element, message) {
  if (!element) return;
  element.href = buildWhatsAppLink(message);
  element.target = '_blank';
  element.rel = 'noopener noreferrer';
}

async function loadData() {
  if (window.__INITIAL_DATA__) {
    state.content = window.__INITIAL_DATA__;
    state.products = window.__INITIAL_DATA__.products || [];
    renderAll();
    return;
  }

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
  document.getElementById('brandName').textContent = settings.siteName;
  document.getElementById('brandTagline').textContent = settings.tagline;
  document.getElementById('footerBrandName').textContent = settings.siteName;
  document.title = `${settings.siteName} | Catálogo Profissional`;
}

function renderHero() {
  const { hero } = state.content;
  document.getElementById('heroEyebrow').textContent = hero.eyebrow;
  document.getElementById('heroTitle').textContent = hero.title;
  document.getElementById('heroSubtitle').textContent = hero.subtitle;
  document.getElementById('heroImage').src = hero.backgroundImage;
  refs.heroSearch.placeholder = hero.searchPlaceholder;
  document.getElementById('productCountBadge').textContent = `+${state.products.length}`;

  const tags = ['Sensor NOx', 'Bomba ARLA', 'Catalisador', 'Dosador', 'Filtro', 'Módulo'];
  document.getElementById('searchTags').innerHTML = tags
    .map((tag) => `<button type="button" class="tag-pill search-chip">${tag}</button>`)
    .join('');

  setWhatsAppLink(document.getElementById('navWhatsapp'), 'Olá! Quero solicitar um orçamento na ARLATEM.');
  setWhatsAppLink(document.getElementById('heroWhatsapp'), 'Olá! Quero solicitar um orçamento para peças do sistema de ARLA.');
}

function renderHighlights() {
  const list = state.content.highlights || [];
  document.getElementById('highlightsList').innerHTML = list
    .map((item) => `<div class="quick-item"><span>✔</span> ${item}</div>`)
    .join('');
}

function renderCategories() {
  const categories = state.content.categories || [];
  document.getElementById('categoryGrid').innerHTML = categories.map((category, index) => `
    <button class="category-card reveal ${index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : ''}" data-category="${category.name}">
      <span class="icon-wrap">${iconMarkup(category.icon)}</span>
      <strong>${category.name}</strong>
      <small>${category.description}</small>
    </button>
  `).join('');

  document.querySelectorAll('.category-card').forEach((button) => {
    button.addEventListener('click', () => {
      filterElements.category.value = button.dataset.category;
      state.category = button.dataset.category;
      renderProducts();
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.search-chip').forEach((chip) => {
    chip.addEventListener('click', () => applySearchTerm(chip.textContent.trim()));
  });
}

function renderBrands() {
  const brands = state.content.brands || [];
  document.getElementById('brandGrid').innerHTML = brands.map((brand) => `<div class="brand-pill">${brand.name}</div>`).join('');
}

function renderBenefits() {
  const benefits = state.content.benefits || [];
  document.getElementById('benefitsGrid').innerHTML = benefits.map((item, index) => `
    <article class="benefit-card glass-card reveal ${index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : ''}">
      <span class="icon-wrap">${iconMarkup(item.icon)}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderBanner() {
  const { banner } = state.content;
  document.getElementById('bannerEyebrow').textContent = banner.eyebrow;
  document.getElementById('bannerTitle').textContent = banner.title;
  document.getElementById('bannerSubtitle').textContent = banner.subtitle;
  setWhatsAppLink(document.getElementById('bannerWhatsapp'), 'Olá! Não encontrei minha peça no catálogo e preciso de ajuda para localizar.');
}

function renderAbout() {
  const { about } = state.content;
  document.getElementById('aboutTitle').textContent = about.title;
  document.getElementById('aboutParagraph1').textContent = about.paragraph1;
  document.getElementById('aboutParagraph2').textContent = about.paragraph2;
  document.getElementById('aboutPoints').innerHTML = (about.points || []).map((item) => `<div class="about-point">${item}</div>`).join('');
  document.getElementById('aboutSpecs').innerHTML = (about.specs || []).map((spec) => `<div class="spec-line"><span>${spec.label}</span><strong>${spec.value}</strong></div>`).join('');
}

function renderBlog() {
  const blog = state.content.blog || [];
  document.getElementById('blogGrid').innerHTML = blog.map((item, index) => `
    <article class="blog-card reveal ${index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : ''}">
      <span class="blog-tag">${item.tag}</span>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <a href="#contato">Ler mais</a>
    </article>
  `).join('');
}

function renderFaq() {
  const faq = state.content.faq || [];
  document.getElementById('faqList').innerHTML = faq.map((item, index) => `
    <details class="faq-item reveal ${index % 3 === 1 ? 'delay-1' : index % 3 === 2 ? 'delay-2' : ''}" ${index === 0 ? 'open' : ''}>
      <summary>${item.question}</summary>
      <p>${item.answer}</p>
    </details>
  `).join('');
}

function uniqueValues(field) {
  return [...new Set(state.products.map((product) => product[field]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'));
}

function fillSelect(select, values) {
  select.innerHTML = `<option value="">${select.id === 'filterBrand' ? 'Todas' : select.id === 'filterCategory' ? 'Todas' : select.id === 'filterMontadora' ? 'Todas' : 'Todos'}</option>`;
  if (select.id === 'filterAvailability') select.innerHTML = '<option value="">Todas</option>';
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function setupFilters() {
  fillSelect(filterElements.brand, uniqueValues('brand'));
  fillSelect(filterElements.category, uniqueValues('category'));
  fillSelect(filterElements.montadora, uniqueValues('montadora'));
  fillSelect(filterElements.model, uniqueValues('model'));
  fillSelect(filterElements.year, uniqueValues('year'));
  fillSelect(filterElements.motor, uniqueValues('motor'));
  fillSelect(filterElements.manufacturer, uniqueValues('manufacturer'));
  fillSelect(filterElements.availability, uniqueValues('availability'));
}

function renderProducts() {
  const results = getFilteredProducts();
  refs.resultCount.textContent = `${results.length} produto${results.length === 1 ? '' : 's'}`;
  renderActiveFilters();

  if (!results.length) {
    refs.productGrid.innerHTML = `
      <div class="no-results">
        <h3>Nenhum item encontrado</h3>
        <p>Tente ajustar os filtros, pesquisar por código ou solicitar ajuda pelo WhatsApp.</p>
        <a class="btn btn-primary" href="${buildWhatsAppLink('Olá! Não encontrei a peça desejada no catálogo e preciso de ajuda.')}" target="_blank" rel="noopener noreferrer">Solicitar ajuda</a>
      </div>`;
    return;
  }

  refs.productGrid.innerHTML = results.map((product) => `
    <article class="product-card reveal visible">
      <div class="product-media">
        <img src="${productImage(product)}" alt="${product.name}" loading="lazy" />
        <span class="product-badge">${product.availability || 'Consulte'}</span>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <div class="product-meta">
          <div class="meta-row"><span>Código</span><strong>${product.code || '-'}</strong></div>
          <div class="meta-row"><span>Marca</span><strong>${product.brand || '-'}</strong></div>
          <div class="meta-row"><span>Compatibilidade</span><strong>${product.compatibility || '-'}</strong></div>
        </div>
        <div class="product-tags">
          ${(product.tags || []).map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}
        </div>
        <div class="product-actions">
          <button class="btn-card details-trigger" data-id="${product.id}">Ver detalhes</button>
          <a class="btn-card primary" href="${buildWhatsAppLink(`Olá! Quero solicitar orçamento para ${product.name} (${product.code}).`)}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
        </div>
      </div>
    </article>
  `).join('');

  bindDetailButtons();
}

function getFilteredProducts() {
  return state.products.filter((product) => {
    const haystack = [
      product.name,
      product.code,
      product.brand,
      product.compatibility,
      product.category,
      product.model,
      product.montadora,
      product.year,
      product.motor,
      product.manufacturer,
      product.availability,
      ...(product.tags || [])
    ].join(' ').toLowerCase();

    const searchMatch = !state.search || haystack.includes(state.search.toLowerCase());
    const brandMatch = !state.brand || product.brand === state.brand;
    const categoryMatch = !state.category || product.category === state.category;
    const montadoraMatch = !state.montadora || product.montadora === state.montadora;
    const modelMatch = !state.model || product.model === state.model;
    const yearMatch = !state.year || product.year === state.year;
    const motorMatch = !state.motor || product.motor === state.motor;
    const manufacturerMatch = !state.manufacturer || product.manufacturer === state.manufacturer;
    const availabilityMatch = !state.availability || product.availability === state.availability;
    return searchMatch && brandMatch && categoryMatch && montadoraMatch && modelMatch && yearMatch && motorMatch && manufacturerMatch && availabilityMatch;
  });
}

function renderActiveFilters() {
  const labelMap = {
    search: 'Busca',
    brand: 'Marca',
    category: 'Categoria',
    montadora: 'Montadora',
    model: 'Modelo',
    year: 'Ano',
    motor: 'Motor',
    manufacturer: 'Fabricante',
    availability: 'Disponibilidade'
  };
  refs.activeFilters.innerHTML = Object.entries(state)
    .filter(([key, value]) => key !== 'content' && key !== 'products' && value)
    .map(([key, value]) => `<span class="tag-pill">${labelMap[key]}: ${value}</span>`)
    .join('');
}

function applySearchTerm(term) {
  refs.catalogSearch.value = term;
  refs.heroSearch.value = term;
  state.search = term;
  renderProducts();
  document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function syncStateFromInputs() {
  state.search = refs.catalogSearch.value.trim();
  filterFields.forEach((field) => { state[field] = filterElements[field].value; });
}

function resetFilters() {
  refs.catalogSearch.value = '';
  refs.heroSearch.value = '';
  state.search = '';
  filterFields.forEach((field) => {
    state[field] = '';
    filterElements[field].value = '';
  });
  renderProducts();
}

function bindFilterEvents() {
  refs.catalogSearch.addEventListener('input', () => { syncStateFromInputs(); renderProducts(); });
  Object.entries(filterElements).forEach(([field, element]) => {
    element.addEventListener('change', () => { state[field] = element.value; renderProducts(); });
  });
  refs.heroSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applySearchTerm(refs.heroSearch.value.trim());
  });
  refs.clearFilters.addEventListener('click', resetFilters);
}

function openProductModal(productId) {
  const product = state.products.find((item) => String(item.id) === String(productId));
  if (!product) return;
  refs.modalTitle.textContent = product.name;
  refs.modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-image"><img src="${productImage(product)}" alt="${product.name}" /></div>
      <div class="modal-content">
        <p>${product.description || ''}</p>
        <div class="modal-specs">
          <div class="modal-spec"><span>Código</span><strong>${product.code || '-'}</strong></div>
          <div class="modal-spec"><span>Marca</span><strong>${product.brand || '-'}</strong></div>
          <div class="modal-spec"><span>Categoria</span><strong>${product.category || '-'}</strong></div>
          <div class="modal-spec"><span>Compatibilidade</span><strong>${product.compatibility || '-'}</strong></div>
          <div class="modal-spec"><span>Modelo</span><strong>${product.model || '-'}</strong></div>
          <div class="modal-spec"><span>Montadora</span><strong>${product.montadora || '-'}</strong></div>
          <div class="modal-spec"><span>Motor</span><strong>${product.motor || '-'}</strong></div>
          <div class="modal-spec"><span>Disponibilidade</span><strong>${product.availability || '-'}</strong></div>
          <div class="modal-spec"><span>Aplicações</span><strong>${product.applications || '-'}</strong></div>
          <div class="modal-spec"><span>Garantia</span><strong>${product.warranty || '-'}</strong></div>
        </div>
        <div class="product-tags">${(product.tags || []).map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}</div>
        <div class="modal-actions">
          <a class="btn btn-primary" href="${buildWhatsAppLink(`Olá! Quero orçamento para ${product.name} (${product.code}).`)}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
          <a class="btn btn-secondary" href="#produtos">Continuar navegando</a>
        </div>
      </div>
    </div>`;
  refs.productModal.showModal();
}

function bindDetailButtons() {
  document.querySelectorAll('.details-trigger').forEach((button) => {
    button.addEventListener('click', () => openProductModal(button.dataset.id));
  });
}

function renderTestimonials() {
  testimonialIndex = 0;
  showTestimonial();
}

function showTestimonial() {
  const testimonials = state.content.testimonials || [];
  if (!testimonials.length) return;
  const testimonial = testimonials[testimonialIndex];
  refs.testimonialsTrack.innerHTML = `
    <article class="testimonial-card">
      <div class="stars">${'★'.repeat(Number(testimonial.stars || 5))}</div>
      <p>“${testimonial.quote}”</p>
      <div class="testimonial-author">
        <strong>${testimonial.author}</strong>
        <span>${testimonial.role}</span>
      </div>
    </article>`;
}

function nextTestimonial() {
  const total = (state.content.testimonials || []).length || 1;
  testimonialIndex = (testimonialIndex + 1) % total;
  showTestimonial();
}

function prevTestimonial() {
  const total = (state.content.testimonials || []).length || 1;
  testimonialIndex = (testimonialIndex - 1 + total) % total;
  showTestimonial();
}

function startTestimonials() {
  refs.nextTestimonial.addEventListener('click', () => { nextTestimonial(); restartTestimonials(); });
  refs.prevTestimonial.addEventListener('click', () => { prevTestimonial(); restartTestimonials(); });
  restartTestimonials();
}

function restartTestimonials() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 5000);
}

function setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function handleHeader() {
  window.addEventListener('scroll', () => refs.header.classList.toggle('scrolled', window.scrollY > 10));
}

function handleMenu() {
  refs.menuToggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  refs.nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => document.body.classList.remove('menu-open')));
}

function handleModal() {
  refs.closeModal.addEventListener('click', () => refs.productModal.close());
  refs.productModal.addEventListener('click', (event) => {
    const rect = refs.productModal.getBoundingClientRect();
    const inside = rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right;
    if (!inside) refs.productModal.close();
  });
}

function setupMisc() {
  const { settings } = state.content;
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('contactWhatsapp').textContent = `WhatsApp: ${formatPhone(settings.whatsappNumber)}`;
  setWhatsAppLink(document.getElementById('contactWhatsapp'), 'Olá! Preciso de um orçamento na ARLATEM.');
  setWhatsAppLink(document.getElementById('footerWhatsapp'), 'Olá! Quero falar com a ARLATEM.');
  setWhatsAppLink(document.getElementById('floatingWhatsapp'), 'Olá! Quero solicitar um orçamento para peças do sistema de ARLA.');
  const email = document.getElementById('contactEmail');
  email.textContent = settings.email;
  email.href = `mailto:${settings.email}`;
  document.getElementById('instagramLink').href = settings.instagram || '#';
  document.getElementById('facebookLink').href = settings.facebook || '#';
  document.getElementById('contactLocation').textContent = `${settings.location} • Atendimento em todo o Brasil`;
  document.getElementById('contactHours').textContent = settings.hours;
  document.getElementById('mapLocation').textContent = settings.location;
  document.getElementById('copyrightText').textContent = settings.copyrightText;
}

function formatPhone(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length >= 12) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
  }
  return number || '(00) 00000-0000';
}

window.addEventListener('load', () => {
  setTimeout(() => refs.preloader.classList.add('hidden'), 450);
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadData();
    bindFilterEvents();
    startTestimonials();
    handleHeader();
    handleMenu();
    handleModal();
  } catch (error) {
    console.error(error);
    alert('Não foi possível carregar o site.');
  }
});
