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

function productImage(product) {
  return product.image || '/uploads/favicon.png';
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

  const rangeInfo = document.getElementById('catalogRangeInfo');
  if (rangeInfo) {
    rangeInfo.textContent = filtered.length
      ? `Exibindo ${start + 1}–${end} de ${filtered.length} produtos`
      : 'Nenhum produto encontrado';
  }

  renderActiveFilters();

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

  let buttons = '';
  for (let page = 1; page <= totalPages; page += 1) {
    buttons += `<button class="page-btn ${page === state.page ? 'active' : ''}" data-page="${page}">${page}</button>`;
  }

  refs.paginationWrap.innerHTML = `
    <div class="pagination-top-info">
      <span>Página ${state.page} de ${totalPages}</span>
      <span>Exibindo ${start + 1}–${end} de ${totalItems} produtos</span>
    </div>
    <div class="pagination-inner">
      <button class="page-nav-btn" id="prevPageBtn" ${state.page === 1 ? 'disabled' : ''}>Anterior</button>
      <div class="page-number-wrap">${buttons}</div>
      <button class="page-nav-btn" id="nextPageBtn" ${state.page === totalPages ? 'disabled' : ''}>Próxima</button>
    </div>
  `;

  document.querySelectorAll('.page-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.page = Number(button.dataset.page);
      renderProducts();
      window.scrollTo({ top: 280, behavior: 'smooth' });
    });
  });

  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.page > 1) {
        state.page -= 1;
        renderProducts();
        window.scrollTo({ top: 280, behavior: 'smooth' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.page < totalPages) {
        state.page += 1;
        renderProducts();
        window.scrollTo({ top: 280, behavior: 'smooth' });
      }
    });
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
  } catch (error) {
    console.error(error);
    alert('Não foi possível carregar o catálogo completo.');
  }
});
