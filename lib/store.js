const { getServiceClient } = require('./supabase');
const { getDefaultPayload } = require('./default-data');

async function readStore(client) {
  const supabase = client || getServiceClient();

  const { data, error } = await supabase
    .from('site_store')
    .select('key,value')
    .in('key', ['content', 'products']);

  if (error) throw error;

  const fallback = getDefaultPayload();
  const contentRow = (data || []).find((item) => item.key === 'content');
  const productsRow = (data || []).find((item) => item.key === 'products');

  return {
    ...(contentRow?.value || fallback),
    products: productsRow?.value || fallback.products
  };
}

async function readStoreSafe() {
  try {
    return await readStore(getServiceClient());
  } catch (error) {
    console.error('Erro ao ler conteúdo no Supabase:', error);
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

  const { error } = await supabase
    .from('site_store')
    .upsert(rows, { onConflict: 'key' });

  if (error) throw error;

  return { ...content, products };
}

module.exports = {
  readStore,
  readStoreSafe,
  writeStore
};
