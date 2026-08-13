const { getPublicClient, getServiceClient } = require('./supabase');
const { getDefaultPayload } = require('./default-data');

function pickArray(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function pickObject(value, fallback) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? { ...fallback, ...value }
    : fallback;
}

function mergeContent(fallback, content = {}) {
  return {
    settings: pickObject(content.settings, fallback.settings),
    hero: pickObject(content.hero, fallback.hero),
    highlights: pickArray(content.highlights, fallback.highlights),
    categories: pickArray(content.categories, fallback.categories),
    brands: pickArray(content.brands, fallback.brands),
    benefits: pickArray(content.benefits, fallback.benefits),
    banner: pickObject(content.banner, fallback.banner),
    about: {
      ...fallback.about,
      ...pickObject(content.about, fallback.about),
      points: pickArray(content.about?.points, fallback.about.points),
      specs: pickArray(content.about?.specs, fallback.about.specs)
    },
    blog: pickArray(content.blog, fallback.blog),
    testimonials: pickArray(content.testimonials, fallback.testimonials),
    faq: pickArray(content.faq, fallback.faq)
  };
}

async function readStore(client) {
  const supabase = client || getPublicClient();
  const { data, error } = await supabase
    .from('site_store')
    .select('key,value')
    .in('key', ['content', 'products']);

  if (error) throw error;

  const fallback = getDefaultPayload();
  const contentRow = (data || []).find((item) => item.key === 'content');
  const productsRow = (data || []).find((item) => item.key === 'products');

  const mergedContent = mergeContent(fallback, contentRow?.value || {});
  const products = Array.isArray(productsRow?.value) && productsRow.value.length
    ? productsRow.value
    : fallback.products;

  return {
    ...mergedContent,
    products
  };
}

async function readStoreSafe() {
  try {
    return await readStore(getPublicClient());
  } catch (error) {
    return getDefaultPayload();
  }
}

async function writeStore(payload) {
  const supabase = getServiceClient();
  const { products = [], ...content } = payload || {};
  const rows = [
    { key: 'content', value: content },
    { key: 'products', value: products }
  ];
  const { error } = await supabase.from('site_store').upsert(rows, { onConflict: 'key' });
  if (error) throw error;
  return { ...content, products };
}

module.exports = {
  readStore,
  readStoreSafe,
  writeStore
};
