const fs = require('fs');
const path = require('path');
const { readStoreSafe } = require('../lib/store');
const { getCategoryBySlug, getCategorySeo, slugify } = require('../lib/category-seo');

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

function patchCatalogTemplate(template, { slug, seo }) {
  const canonicalUrl = `https://www.arlatem.com.br/categoria/${slug}/`;

  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${seo.title}</title>`);

  if (/<meta name="description" content=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${seo.description}" />`);
  }

  if (/<meta property="og:title" content=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${seo.title}" />`);
  }

  if (/<meta property="og:description" content=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${seo.description}" />`);
  }

  if (/<meta property="og:url" content=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <meta property="og:url" content="${canonicalUrl}" />\n</head>`);
  }

  if (/<link rel="canonical" href=".*?"\s*\/?>/i.test(html)) {
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  html = html.replace(/<h1>.*?<\/h1>/s, `<h1>${seo.heading}</h1>`);
  html = html.replace(/<p>Pesquise, filtre e navegue pelo catálogo completo da ARLATEM para encontrar a peça certa em segundos\.<\/p>/, `<p>${seo.intro}</p>`);
  html = html.replace('<script src="/catalogo.js"></script>', '<script src="/catalogo.js?v=31"></script>');
  html = html.replace('/styles.css"', '/styles.css?v=31"');
  html = html.replace('/catalogo.css"', '/catalogo.css?v=31"');

  const initialScript = `\n  <script>window.__CATEGORY_SLUG__ = ${JSON.stringify(slug)};<\/script>\n`;
  html = html.replace('</body>', `${initialScript}</body>`);

  return html;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return sendHtml(res, 405, '<h1>Método não permitido</h1>');

  try {
    const data = await readStoreSafe();
    const slug = String(req.query.slug || '').trim();
    const category = getCategoryBySlug(data, slug);

    if (!category) {
      return sendHtml(
        res,
        404,
        '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="robots" content="noindex, follow" /><title>Categoria não encontrada | ARLATEM</title></head><body><h1>Categoria não encontrada</h1></body></html>'
      );
    }

    const templatePath = path.join(process.cwd(), 'catalogo.html');
    const template = fs.readFileSync(templatePath, 'utf-8');
    const seo = getCategorySeo(category.name);
    const html = patchCatalogTemplate(template, { slug: slugify(category.name), seo });

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400');
    return sendHtml(res, 200, html);
  } catch (error) {
    return sendHtml(res, 500, `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Erro | ARLATEM</title></head><body><h1>Erro ao carregar categoria</h1><pre>${String(error.message || error)}</pre></body></html>`);
  }
};
v
