const { sendJson } = require('../lib/http');
const { getDefaultPayload } = require('../lib/default-data');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, message: 'Método não permitido' });
  }

  try {
    const data = getDefaultPayload();

    return sendJson(
      res,
      200,
      { ok: true, data },
      {
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
      }
    );
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error.message || 'Falha ao carregar conteúdo'
    });
  }
};
