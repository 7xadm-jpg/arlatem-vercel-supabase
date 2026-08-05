const { readStoreSafe } = require('../lib/store');
const { getCategoryBySlug, getCategoryUrl, slugify } = require('../lib/category-seo');

module.exports = async (req, res) => {
  try {
    const data = await readStoreSafe();
    const rawCategory = String(req.query.categoria || req.query.categoriaSlug || '').trim();
    const slug = slugify(rawCategory);
    const category = getCategoryBySlug(data, slug);

    if (!category) {
      res.statusCode = 302;
      res.setHeader('Location', '/catalogo.html');
      return res.end();
    }

    res.statusCode = 301;
    res.setHeader('Location', getCategoryUrl(category.name));
    return res.end();
  } catch (error) {
    res.statusCode = 302;
    res.setHeader('Location', '/catalogo.html');
    return res.end();
  }
};
