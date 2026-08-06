function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCategoryNames(data) {
  const fromContent = (data?.categories || []).map((item) => item.name).filter(Boolean);
  const fromProducts = (data?.products || []).map((item) => item.category).filter(Boolean);
  return [...new Set([...fromContent, ...fromProducts])];
}

function getCategoryBySlug(data, slug) {
  const cleanSlug = slugify(slug);
  const categories = data?.categories || [];
  const fromContent = categories.find((item) => slugify(item.name) === cleanSlug);

  if (fromContent) return fromContent;

  const fallbackName = getCategoryNames(data).find((name) => slugify(name) === cleanSlug);
  return fallbackName ? { name: fallbackName, description: '', icon: 'shield' } : null;
}

function getCategoryUrl(slug) {
  return `/${slugify(slug)}/`;
}

function getCategorySeo(categoryName) {
  return {
    title: `${categoryName} | Catálogo de Peças ARLATEM`,
    description: `Veja produtos da categoria ${categoryName} no catálogo da ARLATEM. Peças para ARLA 32, sistema SCR e pós-tratamento diesel com atendimento rápido para linha pesada.`,
    heading: `${categoryName} para ARLA 32, Sistema SCR e Linha Pesada`,
    intro: `Navegue pelos produtos da categoria ${categoryName} no catálogo da ARLATEM e solicite orçamento rápido para peças de pós-tratamento diesel, caminhões e linha pesada.`
  };
}

module.exports = {
  normalizeText,
  slugify,
  getCategoryNames,
  getCategoryBySlug,
  getCategoryUrl,
  getCategorySeo
};
