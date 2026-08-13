const { sendJson } = require('../lib/http');
const { readStoreSafe } = require('../lib/store');
const { getDefaultPayload } = require('../lib/default-data');

function pickArray(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function pickObject(value, fallback) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? { ...fallback, ...value }
    : fallback;
}

function mergePayload(data, fallback) {
  return {
    settings: pickObject(data.settings, fallback.settings),
    hero: pickObject(data.hero, fallback.hero),
    highlights: pickArray(data.highlights, fallback.highlights),
    categories: pickArray(data.categories, fallback.categories),
    brands: pickArray(data.brands, fallback.brands),
    benefits: pickArray(data.benefits, fallback.benefits),
    banner: pickObject(data.banner, fallback.banner),
    about: {
      ...fallback.about,
      ...pickObject(data.about, fallback.about),
      points: pickArray(data.about?.points, fallback.about.points),
      specs: pickArray(data.about?.specs, fallback.about.specs)
    },
    blog: pickArray(data.blog, fallback.blog),
    testimonials: pickArray(data.testimonials, fallback.testimonials),
    faq: pickArray(data.faq, fallback.faq),
    products: pickArray(data.products, fallback.products)
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, message: 'Método não permitido' });
  }

  try {
    const fallback = getDefaultPayload();
    const storeData = await readStoreSafe();
    const data = mergePayload(storeData || {}, fallback);

    return sendJson(
      res,
      200,
      { ok: true, data },
      {
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
      }
    );
  } catch (error) {
    const fallback = getDefaultPayload();

    return sendJson(
      res,
      200,
      { ok: true, data: fallback },
      {
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
      }
    );
  }
};
