const { readStoreSafe } = require('../lib/store');
const { getCategoryNames, slugify, getCategoryUrl } = require('../lib/category-seo');

function sitemapUrl(loc, { priority = '0.8', changefreq = 'weekly' } = {}) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    '    <lastmod>2026-08-05</lastmod>',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n');
}

module.exports = async (req, res) => {
  try {
    const data = await readStoreSafe();
    const baseUrl = 'https://www.arlatem.com.br';
    const categoryUrls = getCategoryNames(data).map((name) => `${baseUrl}${getCategoryUrl(slugify(name))}`);

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      sitemapUrl(`${baseUrl}/`, { priority: '1.0', changefreq: 'daily' }),
      ...categoryUrls.map((url) => sitemapUrl(url)),
      '</urlset>'
    ].join('\n');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.end(xml);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end('<?xml version="1.0" encoding="UTF-8"?><error>Falha ao gerar sitemap</error>');
  }
};
