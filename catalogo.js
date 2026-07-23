const refs = {
  preloader: document.getElementById('preloader'),
  header: document.getElementById('siteHeader'),
  menuToggle: document.getElementById('menuToggle'),
  nav: document.getElementById('mainNav'),
  productGrid: document.getElementById('productGridFull'),
  resultsInfo: document.getElementById('catalogResultsInfo'),
  activeFilters: document.getElementById('activeFiltersPage'),
  paginationWrap: document.getElementById('paginationWrap'),
  search: document.getElementById('catalogSearchPage'),
  clearFilters: document.getElementById('clearFiltersPage'),
  filterCategory: document.getElementById('filterCategoryPage'),
  filterBrand: document.getElementById('filterBrandPage'),
  filterMontadora: document.getElementById('filterMontadoraPage'),
  filterAvailability: document.getElementById('filterAvailabilityPage'),
  productModal: document.getElementById('productModal'),
  modalBody: document.getElementById('modalBody'),
  modalTitle: document.getElementById('modalTitle'),
  closeModal: document.getElementById('closeModal')
};

const state = {
  content: null,
  products: [],
  search: '',
  category: '',
  brand: '',
  montadora: '',
  availability: '',
  page: 1,
  perPage: 12
};

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
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.4 9.74 8 11 4.6-1.26 8-6 8-11V7l-8-4Zm0 2.18L18 8v4c0 3.82-2.33 7.46-6 8.82C8.33 19.46 6 15.82 6 12V8l6-2.82Z"/></svg>'
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
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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

function normalizeSocialUrl(value, platform) {
  const raw = String(value || '').trim();
  if (!raw || raw === '#') return '#';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

  const username = raw.replace(/^@/, '');

  if (platform === 'instagram') return `https://www.instagram.com/${username}/`;
  if (platform === 'facebook') return `https://www.facebook.com/${username}`;
  return raw;
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
  renderHeroStats();
  renderFilters();
  renderProducts();
  setupMisc();
}

function renderBrand() {
  const { settings } = state.content;
  document.title = `Catálogo de Peças para ARLA 32 e SCR | ARLATEM`;
  const footerBrandName = document.getElementById('footerBrandName');
  if (footerBrandName) footerBrandName.textContent = settings.siteName;
}

function renderHeroStats() {
  document.getElementById('totalProductsHero').textContent = state.products.length;
  document.getElementById('totalCategoriesHero').textContent = [...new Set(state.products.map((product) => product.category).filter(Boolean))].length;
  setWhatsAppLink(document.getElementById('navWhatsapp'), 'Olá! Quero solicitar um orçamento na ARLATEM.');
}

function uniqueValues(field) {
  return [...new Set(state.products.map((product) => product[field]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), 'pt-BR')
  );
}

function fillSelect(select, values, firstLabel = 'Todas') {
  if (!select) return;
  select.innerHTML = `<option value="">${firstLabel}</option>`;
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function renderFilters() {
  fillSelect(refs.filterCategory, uniqueValues('category'));
  fillSelect(refs.filterBrand, uniqueValues('brand'));
  fillSelect(refs.filterMontadora, uniqueValues('montadora'));
  fillSelect(refs.filterAvailability, uniqueValues('availability'));
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
    const categoryMatch = !state.category || product.category === state.category;
    const brandMatch = !state.brand || product.brand === state.brand;
    const montadoraMatch = !state.montadora || product.montadora === state.montadora;
    const availabilityMatch = !state.availability || product.availability === state.availability;

    return searchMatch && categoryMatch && brandMatch && montadoraMatch && availabilityMatch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * state.perPage;
  const end = Math.min(start + state.perPage, filtered.length);
  const pageItems = filtered.slice(start, start + state.perPage);

  refs.resultsInfo.textContent = `${filtered.length} produto${filtered.length === 1 ? '' : 's'} encontrados`;
  renderActiveFilters();

  const rangeInfo = document.getElementById('catalogRangeInfo');
  if (rangeInfo) {
    rangeInfo.textContent = filtered.length
      ? `Exibindo ${start + 1}–${end} de ${filtered.length} produtos`
      : 'Nenhum produto encontrado';
  }

  if (!pageItems.length) {
    refs.productGrid.innerHTML = `
      <div class="no-results catalog-empty-state">
        <h3>Nenhum produto encontrado</h3>
        <p>Tente ajustar os filtros ou falar com nossa equipe no WhatsApp.</p>
        <a class="btn btn-primary" href="${buildWhatsAppLink('Olá! Não encontrei o produto que procuro no catálogo completo.')}" target="_blank" rel="noopener noreferrer">Falar com a equipe</a>
      </div>
    `;
    refs.paginationWrap.innerHTML = '';
    return;
  }

  refs.productGrid.innerHTML = pageItems.map((product) => `
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
          <a class="btn-card primary" href="${buildWhatsAppLink(`Olá! Quero solicitar orçamento para ${product.name} (${product.code || ''}).`)}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
        </div>
      </div>
    </article>
  `).join('');

  bindDetailButtons();
  renderPagination(totalPages, filtered.length, start, end);
}

function renderActiveFilters() {
  const filters = [];
  if (state.search) filters.push(`Busca: ${state.search}`);
  if (state.category) filters.push(`Categoria: ${state.category}`);
  if (state.brand) filters.push(`Marca: ${state.brand}`);
  if (state.montadora) filters.push(`Montadora: ${state.montadora}`);
  if (state.availability) filters.push(`Disponibilidade: ${state.availability}`);

  refs.activeFilters.innerHTML = filters.map((item) => `<span class="tag-pill">${item}</span>`).join('');
}

function renderPagination(totalPages, totalItems, start, end) {
  if (totalPages <= 1) {
    refs.paginationWrap.innerHTML = '';
    return;
  }

  let pageButtons = '';

  const createPageButton = (page) => {
    return `<button class="page-btn ${page === state.page ? 'active' : ''}" data-page="${page}">${page}</button>`;
  };

  const pages = [];
  const maxVisible = 5;

  let pageStart = Math.max(1, state.page - 2);
  let pageEnd = Math.min(totalPages, pageStart + maxVisible - 1);

  if (pageEnd - pageStart < maxVisible - 1) {
    pageStart = Math.max(1, pageEnd - maxVisible + 1);
  }

  for (let i = pageStart; i <= pageEnd; i++) {
    pages.push(i);
  }

  if (pageStart > 1) {
    pageButtons += createPageButton(1);
    if (pageStart > 2) pageButtons += `<span class="page-dots">...</span>`;
  }

  pageButtons += pages.map(createPageButton).join('');

  if (pageEnd < totalPages) {
    if (pageEnd < totalPages - 1) pageButtons += `<span class="page-dots">...</span>`;
    pageButtons += createPageButton(totalPages);
  }

  refs.paginationWrap.innerHTML = `
    <div class="pagination-top-info">
      <span>Página ${state.page} de ${totalPages}</span>
      <span>Exibindo ${start + 1}–${end} de ${totalItems}</span>
    </div>

    <div class="pagination-inner">
      <button class="page-nav-btn" id="firstPageBtn" ${state.page === 1 ? 'disabled' : ''}>Primeira</button>
      <button class="page-nav-btn" id="prevPageBtn" ${state.page === 1 ? 'disabled' : ''}>Anterior</button>

      <div class="page-number-wrap">${pageButtons}</div>

      <button class="page-nav-btn" id="nextPageBtn" ${state.page === totalPages ? 'disabled' : ''}>Próxima</button>
      <button class="page-nav-btn" id="lastPageBtn" ${state.page === totalPages ? 'disabled' : ''}>Última</button>
    </div>
  `;

  document.querySelectorAll('.page-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.page = Number(button.dataset.page);
      renderProducts();
      scrollToCatalogTop();
    });
  });

  const firstBtn = document.getElementById('firstPageBtn');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const lastBtn = document.getElementById('lastPageBtn');

  if (firstBtn) {
    firstBtn.addEventListener('click', () => {
      state.page = 1;
      renderProducts();
      scrollToCatalogTop();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.page > 1) {
        state.page -= 1;
        renderProducts();
        scrollToCatalogTop();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.page < totalPages) {
        state.page += 1;
        renderProducts();
        scrollToCatalogTop();
      }
    });
  }

  if (lastBtn) {
    lastBtn.addEventListener('click', () => {
      state.page = totalPages;
      renderProducts();
      scrollToCatalogTop();
    });
  }
}

function scrollToCatalogTop() {
  const section = document.querySelector('.catalog-full-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
          <a class="btn btn-primary" href="${buildWhatsAppLink(`Olá! Quero orçamento para ${product.name} (${product.code || ''}).`)}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
          <a class="btn btn-secondary" href="/catalogo.html">Continuar navegando</a>
        </div>
      </div>
    </div>
  `;

  if (refs.productModal && typeof refs.productModal.showModal === 'function') {
    refs.productModal.showModal();
  }
}

function bindDetailButtons() {
  document.querySelectorAll('.details-trigger').forEach((button) => {
    button.addEventListener('click', () => openProductModal(button.dataset.id));
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

  document.getElementById('instagramLink').href = normalizeSocialUrl(settings.instagram, 'instagram');
  document.getElementById('facebookLink').href = normalizeSocialUrl(settings.facebook, 'facebook');
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
function applyFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const categoria = params.get('categoria');
  const marca = params.get('marca');
  const montadora = params.get('montadora');

  if (categoria) {
    state.category = categoria;
    if (refs.filterCategory) refs.filterCategory.value = categoria;
  }

  if (marca) {
    state.brand = marca;
    if (refs.filterBrand) refs.filterBrand.value = marca;
  }

  if (montadora) {
    state.montadora = montadora;
    if (refs.filterMontadora) refs.filterMontadora.value = montadora;
  }

  state.page = 1;
  renderProducts();
}
function resetFilters() {
  state.search = '';
  state.category = '';
  state.brand = '';
  state.montadora = '';
  state.availability = '';
  state.page = 1;

  refs.search.value = '';
  refs.filterCategory.value = '';
  refs.filterBrand.value = '';
  refs.filterMontadora.value = '';
  refs.filterAvailability.value = '';

  renderProducts();
}

function bindEvents() {
  if (refs.search) {
    refs.search.addEventListener('input', () => {
      state.search = refs.search.value.trim();
      state.page = 1;
      renderProducts();
    });
  }

  if (refs.filterCategory) {
    refs.filterCategory.addEventListener('change', () => {
      state.category = refs.filterCategory.value;
      state.page = 1;
      renderProducts();
    });
  }

  if (refs.filterBrand) {
    refs.filterBrand.addEventListener('change', () => {
      state.brand = refs.filterBrand.value;
      state.page = 1;
      renderProducts();
    });
  }

  if (refs.filterMontadora) {
    refs.filterMontadora.addEventListener('change', () => {
      state.montadora = refs.filterMontadora.value;
      state.page = 1;
      renderProducts();
    });
  }

  if (refs.filterAvailability) {
    refs.filterAvailability.addEventListener('change', () => {
      state.availability = refs.filterAvailability.value;
      state.page = 1;
      renderProducts();
    });
  }

  if (refs.clearFilters) {
    refs.clearFilters.addEventListener('click', resetFilters);
  }

  if (refs.menuToggle) {
    refs.menuToggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  }

  if (refs.nav) {
    refs.nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => document.body.classList.remove('menu-open'));
    });
  }

  if (refs.closeModal) {
    refs.closeModal.addEventListener('click', () => refs.productModal.close());
  }

  if (refs.productModal) {
    refs.productModal.addEventListener('click', (event) => {
      const rect = refs.productModal.getBoundingClientRect();
      const inside = rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right;
      if (!inside) refs.productModal.close();
    });
  }

  window.addEventListener('scroll', () => {
    if (refs.header) refs.header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    if (refs.preloader) refs.preloader.classList.add('hidden');
  }, 450);
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    bindEvents();
    await loadData();
    applyFiltersFromUrl();
  } catch (error) {
    console.error(error);
    alert('Não foi possível carregar o catálogo completo.');
  }
});
