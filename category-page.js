const fs = require('fs');
const path = require('path');
const { readStoreSafe } = require('../lib/store');
const { getCategoryBySlug, getCategorySeo, getCategoryUrl, slugify } = require('../lib/category-seo');

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function withOrCreateTag(html, regex, replacement, fallback) {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace('</head>', `${fallback}\n</head>`);
}

function buildJsonLd({ categoryName, canonicalUrl, products }) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ARLATEM',
    url: 'https://www.arlatem.com.br/',
    logo: 'https://www.arlatem.com.br/uploads/favicon.png'
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ARLATEM',
    url: 'https://www.arlatem.com.br/'
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.arlatem.com.br/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: canonicalUrl
      }
    ]
  };

  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} | Catálogo de Peças ARLATEM`,
    url: canonicalUrl,
    isPartOf: 'https://www.arlatem.com.br/catalogo.html',
    about: categoryName
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Produtos da categoria ${categoryName}`,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: canonicalUrl,
      sku: product.code || undefined,
      brand: product.brand || undefined
    }))
  };

  return [organization, website, breadcrumb, collectionPage, itemList]
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join('\n');
}

function patchCatalogTemplate(template, { slug, categoryName, seo, products }) {
  const canonicalPath = getCategoryUrl(slug);
  const canonicalUrl = `https://www.arlatem.com.br${canonicalPath}`;
  const safeTitle = escapeHtml(seo.title);
  const safeDescription = escapeHtml(seo.description);
  const safeHeading = escapeHtml(seo.heading);
  const safeIntro = escapeHtml(seo.intro);
  const jsonLd = buildJsonLd({ categoryName, canonicalUrl, products });

  let html = template;
  html = html.replace(/<title>.*?<\/title>/is, `<title>${safeTitle}</title>`);
  html = withOrCreateTag(
    html,
    /<meta name="description" content=".*?"\s*\/?>/i,
    `<meta name="description" content="${safeDescription}" />`,
    `  <meta name="description" content="${safeDescription}" />`
  );
  html = withOrCreateTag(
    html,
    /<meta property="og:title" content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`,
    `  <meta property="og:title" content="${safeTitle}" />`
  );
  html = withOrCreateTag(
    html,
    /<meta property="og:description" content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${safeDescription}" />`,
    `  <meta property="og:description" content="${safeDescription}" />`
  );
  html = withOrCreateTag(
    html,
    /<meta property="og:url" content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `  <meta property="og:url" content="${canonicalUrl}" />`
  );
  html = withOrCreateTag(
    html,
    /<meta name="twitter:card" content=".*?"\s*\/?>/i,
    '<meta name="twitter:card" content="summary_large_image" />',
    '  <meta name="twitter:card" content="summary_large_image" />'
  );
  html = withOrCreateTag(
    html,
    /<meta name="twitter:title" content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `  <meta name="twitter:title" content="${safeTitle}" />`
  );
  html = withOrCreateTag(
    html,
    /<meta name="twitter:description" content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${safeDescription}" />`,
    `  <meta name="twitter:description" content="${safeDescription}" />`
  );
  html = withOrCreateTag(
    html,
    /<meta name="robots" content=".*?"\s*\/?>/i,
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '  <meta name="robots" content="index, follow, max-image-preview:large" />'
  );
  html = withOrCreateTag(
    html,
    /<link rel="canonical" href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `  <link rel="canonical" href="${canonicalUrl}" />`
  );

  html = html.replace(/<h1>.*?<\/h1>/is, `<h1>${safeHeading}</h1>`);
  html = html.replace(/<p>Pesquise, filtre e navegue pelo catálogo completo da ARLATEM para encontrar a peça certa em segundos\.<\/p>/, `<p>${safeIntro}</p>`);

  html = html.replace(/<script src="\/catalogo\.js(?:\?v=\d+)?"><\/script>/i, '<script src="/catalogo.js?v=32"></script>');
  html = html.replace(/\/styles\.css(?:\?v=\d+)?"/g, '/styles.css?v=32"');
  html = html.replace(/\/catalogo\.css(?:\?v=\d+)?"/g, '/catalogo.css?v=32"');

  const bootstrap = [
    `<script>window.__CATEGORY_SLUG__ = ${JSON.stringify(slug)};</script>`,
    '<script>window.__CATEGORY_SEO_LOCK__ = true;</script>',
    jsonLd
  ].join('\n');

  html = html.replace('</head>', `  ${bootstrap}\n</head>`);
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
    const products = (data.products || []).filter((product) => product.category === category.name).slice(0, 24);
    const html = patchCatalogTemplate(template, {
      slug: slugify(category.name),
      categoryName: category.name,
      seo,
      products
    });

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400');
    return sendHtml(res, 200, html);
  } catch (error) {
    return sendHtml(res, 500, `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Erro | ARLATEM</title></head><body><h1>Erro ao carregar categoria</h1><pre>${escapeHtml(String(error.message || error))}</pre></body></html>`);
  }
};
