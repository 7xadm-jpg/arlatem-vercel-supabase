const state = {
  data: null,
  loggedIn: false
};

const schemas = {
  brands: {
    containerId: 'brandsEditor',
    title: 'Marca',
    fields: [{ name: 'name', label: 'Nome da marca', type: 'text', full: true }],
    blank: () => ({ name: '' })
  },
  categories: {
    containerId: 'categoriesEditor',
    title: 'Categoria',
    fields: [
      { name: 'name', label: 'Nome', type: 'text' },
      { name: 'icon', label: 'Ícone (pump, sensor, chip, etc.)', type: 'text' },
      { name: 'description', label: 'Descrição', type: 'textarea', full: true }
    ],
    blank: () => ({ name: '', description: '', icon: 'shield' })
  },
  benefits: {
    containerId: 'benefitsEditor',
    title: 'Diferencial',
    fields: [
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'icon', label: 'Ícone', type: 'text' },
      { name: 'text', label: 'Texto', type: 'textarea', full: true }
    ],
    blank: () => ({ title: '', text: '', icon: 'check' })
  },
  blog: {
    containerId: 'blogEditor',
    title: 'Artigo',
    fields: [
      { name: 'tag', label: 'Tag', type: 'text' },
      { name: 'title', label: 'Título', type: 'text' },
      { name: 'excerpt', label: 'Resumo', type: 'textarea', full: true }
    ],
    blank: () => ({ tag: '', title: '', excerpt: '' })
  },
  testimonials: {
    containerId: 'testimonialsEditor',
    title: 'Depoimento',
    fields: [
      { name: 'author', label: 'Autor', type: 'text' },
      { name: 'role', label: 'Cargo / empresa', type: 'text' },
      { name: 'stars', label: 'Estrelas', type: 'number' },
      { name: 'quote', label: 'Texto do depoimento', type: 'textarea', full: true }
    ],
    blank: () => ({ quote: '', author: '', role: '', stars: 5 })
  },
  faq: {
    containerId: 'faqEditor',
    title: 'Pergunta',
    fields: [
      { name: 'question', label: 'Pergunta', type: 'text', full: true },
      { name: 'answer', label: 'Resposta', type: 'textarea', full: true }
    ],
    blank: () => ({ question: '', answer: '' })
  },
  aboutSpecs: {
    containerId: 'aboutSpecsEditor',
    title: 'Linha',
    fields: [
      { name: 'label', label: 'Rótulo', type: 'text' },
      { name: 'value', label: 'Valor', type: 'text' }
    ],
    blank: () => ({ label: '', value: '' })
  }
};

const simpleLists = {
  highlights: { containerId: 'highlightsListEditor', label: 'Destaque' },
  aboutPoints: { containerId: 'aboutPointsEditor', label: 'Ponto' }
};

const refs = {
  loginScreen: document.getElementById('loginScreen'),
  dashboard: document.getElementById('dashboard'),
  loginForm: document.getElementById('loginForm'),
  loginUsername: document.getElementById('loginUsername'),
  loginPassword: document.getElementById('loginPassword'),
  loginMessage: document.getElementById('loginMessage'),
  statusBar: document.getElementById('statusBar'),
  saveBtn: document.getElementById('saveBtn'),
  backupBtn: document.getElementById('backupBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  heroImageUpload: document.getElementById('heroImageUpload'),
  heroImagePreview: document.getElementById('heroImagePreview'),
  addProductBtn: document.getElementById('addProductBtn'),
  productsEditor: document.getElementById('productsEditor'),
  adminPathInfo: document.getElementById('adminPathInfo')
};

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showStatus(message, type = '') {
  refs.statusBar.textContent = message;
  refs.statusBar.className = `status-bar ${type}`.trim();
}

async function api(url, options = {}) {
  const config = { ...options, headers: { ...(options.headers || {}) } };
  if (config.body && typeof config.body !== 'string') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Erro na requisição');
  }
  return payload;
}

function dataUrlFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file, fileName) {
  const dataUrl = await dataUrlFromFile(file);
  const payload = await api('/api/admin/upload-image', {
    method: 'POST',
    body: { fileName, dataUrl }
  });
  return payload.path;
}

async function trySession() {
  try {
    const payload = await api('/api/admin/content');
    state.data = payload.data;
    state.loggedIn = true;
    enterDashboard();
  } catch (error) {
    state.loggedIn = false;
    refs.loginScreen.classList.remove('hidden');
    refs.dashboard.classList.add('hidden');
  }
}

function enterDashboard() {
  refs.loginScreen.classList.add('hidden');
  refs.dashboard.classList.remove('hidden');
  populateForm();
  showStatus('Conteúdo carregado. Você já pode editar.', 'success');
}

async function handleLogin(event) {
  event.preventDefault();
  refs.loginMessage.textContent = 'Entrando...';
  try {
    await api('/api/login', {
      method: 'POST',
      body: {
        username: refs.loginUsername.value.trim(),
        password: refs.loginPassword.value
      }
    });
    refs.loginMessage.textContent = '';
    await trySession();
  } catch (error) {
    refs.loginMessage.textContent = error.message;
  }
}

async function handleLogout() {
  await api('/api/logout', { method: 'POST' });
  location.reload();
}

function setValue(id, value) {
  const field = document.getElementById(id);
  if (field) field.value = value || '';
}

function populateForm() {
  const { settings, hero, banner, about } = state.data;
  refs.adminPathInfo.textContent = settings.adminPath || '/acesso-tecnico-arlatem';

  setValue('settings_siteName', settings.siteName);
  setValue('settings_tagline', settings.tagline);
  setValue('settings_whatsappNumber', settings.whatsappNumber);
  setValue('settings_email', settings.email);
  setValue('settings_instagram', settings.instagram);
  setValue('settings_facebook', settings.facebook);
  setValue('settings_location', settings.location);
  setValue('settings_hours', settings.hours);
  setValue('settings_copyrightText', settings.copyrightText);

  setValue('hero_eyebrow', hero.eyebrow);
  setValue('hero_title', hero.title);
  setValue('hero_subtitle', hero.subtitle);
  setValue('hero_searchPlaceholder', hero.searchPlaceholder);
  setValue('hero_backgroundImage', hero.backgroundImage);
  refs.heroImagePreview.src = hero.backgroundImage || '';

  setValue('banner_eyebrow', banner.eyebrow);
  setValue('banner_title', banner.title);
  setValue('banner_subtitle', banner.subtitle);

  setValue('about_title', about.title);
  setValue('about_paragraph1', about.paragraph1);
  setValue('about_paragraph2', about.paragraph2);

  renderSimpleList('highlights', state.data.highlights || []);
  renderSimpleList('aboutPoints', about.points || []);
  renderObjectList('brands', state.data.brands || []);
  renderObjectList('categories', state.data.categories || []);
  renderObjectList('benefits', state.data.benefits || []);
  renderObjectList('blog', state.data.blog || []);
  renderObjectList('testimonials', state.data.testimonials || []);
  renderObjectList('faq', state.data.faq || []);
  renderObjectList('aboutSpecs', about.specs || []);
  renderProducts(state.data.products || []);
}

function renderSimpleList(key, items) {
  const config = simpleLists[key];
  const container = document.getElementById(config.containerId);
  container.innerHTML = items.map((value, index) => `
    <div class="simple-item" data-simple-key="${key}">
      <input type="text" value="${escapeHtml(value)}" placeholder="${config.label}" />
      <button class="remove-btn" data-remove-simple="${key}" data-index="${index}">Remover</button>
    </div>
  `).join('');
}

function renderObjectList(key, items) {
  const schema = schemas[key];
  const container = document.getElementById(schema.containerId);
  container.innerHTML = items.map((item, index) => `
    <div class="repeat-item" data-object-key="${key}">
      <div class="repeat-item-header">
        <strong class="repeat-item-title">${schema.title} ${index + 1}</strong>
        <button class="remove-btn" data-remove-object="${key}" data-index="${index}">Remover</button>
      </div>
      <div class="repeat-fields">
        ${schema.fields.map((field) => field.type === 'textarea'
          ? `<label class="${field.full ? 'full' : ''}">${field.label}<textarea rows="${field.rows || 3}" data-field="${field.name}">${escapeHtml(item[field.name] || '')}</textarea></label>`
          : `<label class="${field.full ? 'full' : ''}">${field.label}<input type="${field.type || 'text'}" data-field="${field.name}" value="${escapeHtml(item[field.name] || '')}" /></label>`
        ).join('')}
      </div>
    </div>
  `).join('');
}

function renderProducts(products) {
  refs.productsEditor.innerHTML = products.map((product, index) => `
    <div class="product-item" data-product-item>
      <div class="product-head">
        <strong>${escapeHtml(product.name || `Produto ${index + 1}`)}</strong>
        <button class="remove-btn" data-remove-product="${index}">Remover produto</button>
      </div>
      <div class="image-row">
        <img class="image-preview" src="${escapeHtml(product.image || '')}" alt="Preview do produto" />
        <div class="product-fields">
          <label class="full">Imagem do produto (URL interna)
            <input type="text" data-product-field="image" value="${escapeHtml(product.image || '')}" />
          </label>
          <label class="full">Upload da foto
            <input type="file" class="product-upload-input" accept="image/*" data-index="${index}" />
          </label>
        </div>
      </div>
      <div class="product-fields">
        <label>Nome<input type="text" data-product-field="name" value="${escapeHtml(product.name || '')}" /></label>
        <label>Código<input type="text" data-product-field="code" value="${escapeHtml(product.code || '')}" /></label>
        <label>Marca<input type="text" data-product-field="brand" value="${escapeHtml(product.brand || '')}" /></label>
        <label>Categoria<input type="text" data-product-field="category" value="${escapeHtml(product.category || '')}" /></label>
        <label>Compatibilidade<input type="text" data-product-field="compatibility" value="${escapeHtml(product.compatibility || '')}" /></label>
        <label>Modelo<input type="text" data-product-field="model" value="${escapeHtml(product.model || '')}" /></label>
        <label>Montadora<input type="text" data-product-field="montadora" value="${escapeHtml(product.montadora || '')}" /></label>
        <label>Ano<input type="text" data-product-field="year" value="${escapeHtml(product.year || '')}" /></label>
        <label>Motor<input type="text" data-product-field="motor" value="${escapeHtml(product.motor || '')}" /></label>
        <label>Fabricante<input type="text" data-product-field="manufacturer" value="${escapeHtml(product.manufacturer || '')}" /></label>
        <label>Disponibilidade<input type="text" data-product-field="availability" value="${escapeHtml(product.availability || '')}" /></label>
        <label>Garantia<input type="text" data-product-field="warranty" value="${escapeHtml(product.warranty || '')}" /></label>
        <label class="full">Tags (separadas por vírgula)<input type="text" data-product-field="tags" value="${escapeHtml((product.tags || []).join(', '))}" /></label>
        <label class="full">Descrição<textarea rows="3" data-product-field="description">${escapeHtml(product.description || '')}</textarea></label>
        <label class="full">Aplicações<textarea rows="3" data-product-field="applications">${escapeHtml(product.applications || '')}</textarea></label>
      </div>
    </div>
  `).join('');
}

function getSimpleListValues(key) {
  const config = simpleLists[key];
  return [...document.querySelectorAll(`#${config.containerId} .simple-item input`)]
    .map((input) => input.value.trim())
    .filter(Boolean);
}

function getObjectListValues(key) {
  const schema = schemas[key];
  return [...document.querySelectorAll(`#${schema.containerId} .repeat-item`)].map((item) => {
    const obj = {};
    schema.fields.forEach((field) => {
      const element = item.querySelector(`[data-field="${field.name}"]`);
      obj[field.name] = field.type === 'number' ? Number(element.value || 0) : element.value.trim();
    });
    return obj;
  }).filter((item) => Object.values(item).some((value) => String(value).trim()));
}

function getProductsValues() {
  return [...document.querySelectorAll('[data-product-item]')].map((card, index) => {
    const product = { id: index + 1 };
    card.querySelectorAll('[data-product-field]').forEach((field) => {
      const key = field.dataset.productField;
      if (key === 'tags') {
        product.tags = field.value.split(',').map((tag) => tag.trim()).filter(Boolean);
      } else {
        product[key] = field.value.trim();
      }
    });
    return product;
  }).filter((item) => item.name || item.code || item.brand);
}

function buildPayload() {
  return {
    settings: {
      siteName: document.getElementById('settings_siteName').value.trim(),
      tagline: document.getElementById('settings_tagline').value.trim(),
      whatsappNumber: document.getElementById('settings_whatsappNumber').value.trim(),
      email: document.getElementById('settings_email').value.trim(),
      instagram: document.getElementById('settings_instagram').value.trim(),
      facebook: document.getElementById('settings_facebook').value.trim(),
      location: document.getElementById('settings_location').value.trim(),
      hours: document.getElementById('settings_hours').value.trim(),
      copyrightText: document.getElementById('settings_copyrightText').value.trim(),
      adminPath: state.data.settings.adminPath || '/acesso-tecnico-arlatem'
    },
    hero: {
      eyebrow: document.getElementById('hero_eyebrow').value.trim(),
      title: document.getElementById('hero_title').value.trim(),
      subtitle: document.getElementById('hero_subtitle').value.trim(),
      searchPlaceholder: document.getElementById('hero_searchPlaceholder').value.trim(),
      backgroundImage: document.getElementById('hero_backgroundImage').value.trim()
    },
    highlights: getSimpleListValues('highlights'),
    categories: getObjectListValues('categories'),
    brands: getObjectListValues('brands'),
    benefits: getObjectListValues('benefits'),
    banner: {
      eyebrow: document.getElementById('banner_eyebrow').value.trim(),
      title: document.getElementById('banner_title').value.trim(),
      subtitle: document.getElementById('banner_subtitle').value.trim()
    },
    about: {
      title: document.getElementById('about_title').value.trim(),
      paragraph1: document.getElementById('about_paragraph1').value.trim(),
      paragraph2: document.getElementById('about_paragraph2').value.trim(),
      points: getSimpleListValues('aboutPoints'),
      specs: getObjectListValues('aboutSpecs')
    },
    blog: getObjectListValues('blog'),
    testimonials: getObjectListValues('testimonials'),
    faq: getObjectListValues('faq'),
    products: getProductsValues()
  };
}

async function saveAll() {
  try {
    showStatus('Salvando alterações...', 'warning');
    const data = buildPayload();
    await api('/api/admin/content', { method: 'PUT', body: { data } });
    state.data = data;
    populateForm();
    showStatus('Alterações salvas com sucesso. Atualize o site para ver as mudanças.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

async function backupData() {
  try {
    const payload = await api('/api/admin/backup');
    const blob = new Blob([JSON.stringify(payload.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arlatem-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showStatus('Backup baixado com sucesso.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

function addSimpleItem(key, value = '') {
  const values = getSimpleListValues(key);
  values.push(value);
  renderSimpleList(key, values);
}

function addObjectItem(key, item = null) {
  const values = getObjectListValues(key);
  values.push(item || schemas[key].blank());
  renderObjectList(key, values);
}

function removeSimpleItem(key, index) {
  const values = getSimpleListValues(key);
  values.splice(index, 1);
  renderSimpleList(key, values);
}

function removeObjectItem(key, index) {
  const values = getObjectListValues(key);
  values.splice(index, 1);
  renderObjectList(key, values);
}

function addProduct(event) {
  if (event) event.preventDefault();

  const products = getProductsValues();

  products.push({
    id: products.length + 1,
    name: '',
    code: '',
    brand: '',
    compatibility: '',
    category: '',
    model: '',
    montadora: '',
    year: '',
    motor: '',
    manufacturer: '',
    availability: '',
    warranty: '',
    tags: [],
    description: '',
    applications: '',
    image: ''
  });

  renderProducts(products);

  requestAnimationFrame(() => {
    const items = refs.productsEditor.querySelectorAll('[data-product-item]');
    const lastItem = items[items.length - 1];

    if (lastItem) {
      lastItem.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const firstInput = lastItem.querySelector('[data-product-field="name"]');
      if (firstInput) firstInput.focus();
    }
  });
}

function removeProduct(index) {
  const products = getProductsValues();
  products.splice(index, 1);
  renderProducts(products);
}

async function handleHeroUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    showStatus('Enviando imagem do hero...', 'warning');
    const imagePath = await uploadImage(file, 'hero');
    document.getElementById('hero_backgroundImage').value = imagePath;
    refs.heroImagePreview.src = imagePath;
    showStatus('Imagem do hero enviada com sucesso.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

async function handleProductUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    showStatus('Enviando imagem do produto...', 'warning');
    const imagePath = await uploadImage(file, `produto-${input.dataset.index || 'item'}`);
    const card = input.closest('[data-product-item]');
    card.querySelector('[data-product-field="image"]').value = imagePath;
    card.querySelector('.image-preview').src = imagePath;
    showStatus('Imagem do produto enviada com sucesso.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

function handleProductsEvents(event) {
  const removeIndex = event.target.dataset.removeProduct;
  if (removeIndex !== undefined) {
    removeProduct(Number(removeIndex));
  }
}

function wireEvents() {
  refs.loginForm.addEventListener('submit', handleLogin);
  refs.logoutBtn.addEventListener('click', handleLogout);
  refs.saveBtn.addEventListener('click', saveAll);
  refs.backupBtn.addEventListener('click', backupData);
  refs.heroImageUpload.addEventListener('change', handleHeroUpload);

  if (refs.addProductBtn) {
    refs.addProductBtn.addEventListener('click', addProduct);
  }

  document.addEventListener('click', (event) => {
    const addSimple = event.target.dataset.addSimple;
    const addObject = event.target.dataset.addObject;
    const removeSimple = event.target.dataset.removeSimple;
    const removeObject = event.target.dataset.removeObject;
    const removeProductIndex = event.target.dataset.removeProduct;

    if (addSimple) addSimpleItem(addSimple);
    if (addObject) addObjectItem(addObject);
    if (removeSimple !== undefined) removeSimpleItem(removeSimple, Number(event.target.dataset.index));
    if (removeObject !== undefined) removeObjectItem(removeObject, Number(event.target.dataset.index));
    if (removeProductIndex !== undefined) removeProduct(Number(removeProductIndex));
  });

  document.addEventListener('change', async (event) => {
    if (event.target.matches('.product-upload-input')) {
      await handleProductUpload(event.target);
    }

    if (event.target.matches('[data-product-field="image"]')) {
      const card = event.target.closest('[data-product-item]');
      if (card) {
        const preview = card.querySelector('.image-preview');
        if (preview) preview.src = event.target.value.trim();
      }
    }

    if (event.target.id === 'hero_backgroundImage') {
      refs.heroImagePreview.src = event.target.value.trim();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.matches('[data-product-field="name"]')) {
      const card = event.target.closest('[data-product-item]');
      if (card) {
        const title = card.querySelector('.product-head strong');
        if (title) title.textContent = event.target.value.trim() || 'Novo produto';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  wireEvents();
  await trySession();
});
