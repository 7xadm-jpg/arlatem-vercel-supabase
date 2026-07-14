const { sendJson } = require('../../lib/http');
const { requireAuth } = require('../../lib/auth');
const { readStoreSafe } = require('../../lib/store');

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (req.method !== 'GET') return sendJson(res, 405, { ok: false, message: 'Método não permitido' });

  try {
    const data = await readStoreSafe();
    return sendJson(res, 200, { ok: true, exportedAt: new Date().toISOString(), data });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error.message || 'Falha ao gerar backup' });
  }
};
