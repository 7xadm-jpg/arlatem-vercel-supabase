const refs = {
  preloader: document.getElementById('preloader'),
  header: document.getElementById('siteHeader'),
  menuToggle: document.getElementById('menuToggle'),
  nav: document.getElementById('mainNav'),
  productGrid: document.getElementById('arlaProductGrid'),
  productModal: document.getElementById('productModal'),
  modalBody: document.getElementById('modalBody'),
  modalTitle: document.getElementById('modalTitle'),
  closeModal: document.getElementById('closeModal')
};

const state = {
  content: null,
  products: []
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

  const keywords = ['ARLA', 'Bomba', 'Dosador', 'Filtro', 'Reservatório'];
  state.products = (payload.data.products || []).filter((product) => {
    const text = [
      product.name,
      product.category,
      product.description,
      ...(product.tags || [])
    ].join(' ').toUpperCase();

    return keywords.some((keyword) => text.includes(keyword.toUpperCase()));
  });

  renderAll();
}

function renderAll() {
  renderHero();
  renderProducts();
  setupMisc();
}

function renderHero() {
  document.title = 'Peças para ARLA 32 | ARLATEM';
  document.getElementById('arlaTotalProducts').textContent = state.products.length;
  setWhatsAppLink(document.getElementById('navWhatsapp'), 'Olá! Quero solicitar um orçamento para peças de ARLA 32.');
}

function renderProducts() {
  refs.productGrid.innerHTML = state.products.map((product) => `
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
          <a class="btn btn-secondary" href="/arla.html">Continuar navegando</a>
        </div>
      </div>
    </div>
  `;

  refs.productModal.showModal();
}

function bindDetailButtons() {
  document.querySelectorAll('.details-trigger').forEach((button) => {
    button.addEventListener('click', () => openProductModal(button.dataset.id));
  });
}

function setupMisc() {
  const { settings } = state.content;

  document.getElementById('currentYear').textContent = new Date().getFullYear();
  document.getElementById('contactWhatsapp').textContent = `WhatsApp: ${settings.whatsappNumber}`;
  setWhatsAppLink(document.getElementById('contactWhatsapp'), 'Olá! Preciso de um orçamento de peças para ARLA 32.');
  setWhatsAppLink(document.getElementById('footerWhatsapp'), 'Olá! Quero falar com a ARLATEM.');
  setWhatsAppLink(document.getElementById('floatingWhatsapp'), 'Olá! Quero solicitar um orçamento para peças de ARLA 32.');

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
  refs.menuToggle?.addEventListener('click', () => document.body.classList.toggle('menu-open'));

  if (refs.nav) {
    refs.nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => document.body.classList.remove('menu-open'));
    });
  }

  refs.closeModal?.addEventListener('click', () => refs.productModal.close());

  refs.productModal?.addEventListener('click', (event) => {
    const rect = refs.productModal.getBoundingClientRect();
    const inside = rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right;
    if (!inside) refs.productModal.close();
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
    alert('Não foi possível carregar a página ARLA.');
  }
});
