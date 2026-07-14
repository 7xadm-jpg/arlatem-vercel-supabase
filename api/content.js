const { sendJson } = require('../lib/http');
const { readStoreSafe } = require('../lib/store');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return sendJson(res, 405, { ok: false, message: 'Método não permitido' });
  try {
    const data = await readStoreSafe();
    return sendJson(res, 200, { ok: true, data });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error.message || 'Falha ao carregar conteúdo' });
  }
};
