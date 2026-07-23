const refs = {
  preloader: document.getElementById('preloader'),
  header: document.getElementById('siteHeader'),
  menuToggle: document.getElementById('menuToggle'),
  nav: document.getElementById('mainNav'),
  productGrid: document.getElementById('categoryProductGrid'),
  resultCount: document.getElementById('categoryResultsInfo'),
  rangeInfo: document.getElementById('categoryRangeInfo'),
  search: document.getElementById('categorySearch'),
  modal: document.getElementById('productModal'),
  modalBody: document.getElementById('modalBody'),
  modalTitle: document.getElementById('modalTitle'),
  closeModal: document.getElementById('closeModal')
};

const state = {
  content: null,
  products: [],
  filteredProducts: [],
  categoryName: '',
  page: 1,
  perPage: 12,
  search: ''
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
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

function productImage(product) {
  if (product.image) return product.image;
  return '/uploads/favicon.png';
}

async function loadData() {
  const response = await fetch('/api/content', { cache: 'no-store' });
  const payload = await response.json();
  if (!payload.ok) throw new Error('Falha ao carregar conteúdo');

  state.content = payload.data;
  state.products = payload.data.products || [];
  state.categoryName = window.CATEGORY_CONFIG?.name || 'Categoria';

  document.title = window.CATEGORY_CONFIG?.title || `${state.categoryName} | ARLATEM`;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta && window.CATEGORY_CONFIG?.description) {
    descriptionMeta.setAttribute('content', window.CATEGORY_CONFIG.description);
  }

  filterProducts();
  renderPage();
  setupMisc();
}

function filterProducts() {
  const categoryNormalized = normalizeText(state.categoryName);

  state.filteredProducts = state.products.filter((product) => {
    const productCategory = normalizeText(product.category);
    const text = normalizeText([
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
    ].join(' '));

    const categoryMatch = productCategory === categoryNormalized;
    const searchMatch = !state.search || text.includes(normalizeText(state.search));

    return categoryMatch && searchMatch;
  });
}

function renderPage() {
  document.getElementById('categoryTitle').textContent = window.CATEGORY_CONFIG?.heading || state.categoryName;
  document.getElementById('categorySubtitle').textContent = window.CATEGORY_CONFIG?.description || `Peças da categoria ${state.categoryName}.`;
  document.getElementById('categoryTotalProducts').textContent = state.filteredProducts.length;

  renderProducts();
  renderPagination();
}

function renderProducts() {
  const total = state.filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / state.perPage));

  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * state.perPage;
  const end = Math.min(start + state.perPage, total);
  const visible = state.filteredProducts.slice(start, end);

  refs.resultCount.textContent = `${total} produto${total === 1 ? '' : 's'} encontrados`;
  refs.rangeInfo.textContent = total ? `Exibindo ${start + 1}–${end} de ${total} produtos` : 'Nenhum produto encontrado';

  if (!visible.length) {
    refs.productGrid.innerHTML = `
      <div class="no-results category-empty-state">
        <h3>Nenhum produto encontrado</h3>
        <p>Não encontramos produtos nessa categoria com esse filtro. Fale com nossa equipe pelo WhatsApp.</p>
        <a class="btn btn-primary" href="${buildWhatsAppLink(`Olá! Quero ajuda com a categoria ${state.categoryName}.`)}" target="_blank" rel="noopener noreferrer">Solicitar ajuda</a>
      </div>
    `;
    return;
  }

  refs.productGrid.innerHTML = visible.map((product) => `
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
          <a class="btn-card primary" href="${buildWhatsAppLink(`Olá! Quero orçamento para ${product.name} (${product.code || ''}).`)}" target="_blank" rel="noopener noreferrer">Solicitar orçamento</a>
        </div>
      </div>
    </article>
  `).join('');

  bindDetailButtons();
}

function renderPagination() {
  const total = state.filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / state.perPage));

  if (totalPages <= 1) {
    const wrap = document.getElementById('categoryPaginationWrap');
    if (wrap) wrap.innerHTML = '';
    return;
  }

  const wrap = document.getElementById('categoryPaginationWrap');

  let numbers = '';
  for (let i = 1; i <= totalPages; i++) {
    numbers += `<button class="page-btn ${i === state.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  wrap.innerHTML = `
    <div class="pagination-inner">
      <button class="page-nav-btn" id="prevPageBtn" ${state.page === 1 ? 'disabled' : ''}>Anterior</button>
      <div class="page-number-wrap">${numbers}</div>
      <button class="page-nav-btn" id="nextPageBtn" ${state.page === totalPages ? 'disabled' : ''}>Próxima</button>
    </div>
  `;

  wrap.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.page = Number(btn.dataset.page);
      renderProducts();
      renderPagination();
      scrollToTopList();
    });
  });

  document.getElementById('prevPageBtn')?.addEventListener('click', () => {
    if (state.page > 1) {
      state.page -= 1;
      renderProducts();
      renderPagination();
      scrollToTopList();
    }
  });

  document.getElementById('nextPageBtn')?.addEventListener('click', () => {
    if (state.page < totalPages) {
      state.page += 1;
      renderProducts();
      renderPagination();
      scrollToTopList();
    }
  });
}

function scrollToTopList() {
  document.querySelector('.category-full-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <a class="btn btn-secondary" href="${window.location.pathname}">Continuar navegando</a>
        </div>
      </div>
    </div>
  `;

  refs.modal?.showModal();
}

function bindDetailButtons() {
  document.querySelectorAll('.details-trigger').forEach((button) => {
    button.addEventListener('click', () => openProductModal(button.dataset.id));
  });
}

function setupMisc() {
  const { settings } = state.content;
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('footerBrandName').textContent = settings.siteName;
  document.getElementById('contactWhatsapp').textContent = `WhatsApp: ${settings.whatsappNumber}`;
  setWhatsAppLink(document.getElementById('contactWhatsapp'), `Olá! Preciso de um orçamento para ${state.categoryName}.`);
  setWhatsAppLink(document.getElementById('footerWhatsapp'), 'Olá! Quero falar com a ARLATEM.');
  setWhatsAppLink(document.getElementById('floatingWhatsapp'), `Olá! Quero solicitar um orçamento para ${state.categoryName}.`);
  setWhatsAppLink(document.getElementById('navWhatsapp'), `Olá! Quero solicitar um orçamento para ${state.categoryName}.`);

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

function bindEvents() {
  refs.search?.addEventListener('input', () => {
    state.search = refs.search.value.trim();
    state.page = 1;
    filterProducts();
    renderPage();
  });

  refs.menuToggle?.addEventListener('click', () => document.body.classList.toggle('menu-open'));

  refs.nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => document.body.classList.remove('menu-open'));
  });

  refs.closeModal?.addEventListener('click', () => refs.modal.close());

  refs.modal?.addEventListener('click', (event) => {
    const rect = refs.modal.getBoundingClientRect();
    const inside = rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right;
    if (!inside) refs.modal.close();
  });

  window.addEventListener('scroll', () => {
    refs.header?.classList.toggle('scrolled', window.scrollY > 10);
  });
}

window.addEventListener('load', () => {
  setTimeout(() => refs.preloader?.classList.add('hidden'), 450);
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    bindEvents();
    await loadData();
  } catch (error) {
    console.error(error);
    alert('Não foi possível carregar a categoria.');
  }
});
