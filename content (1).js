const { sendJson, readJsonBody } = require('../../lib/http');
const { requireAuth } = require('../../lib/auth');
const { readStoreSafe, writeStore } = require('../../lib/store');

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;

  try {
    if (req.method === 'GET') {
      const data = await readStoreSafe();
      return sendJson(res, 200, { ok: true, data });
    }

    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      const data = await writeStore(body.data || body);
      return sendJson(res, 200, { ok: true, message: 'Conteúdo salvo com sucesso', data });
    }

    return sendJson(res, 405, { ok: false, message: 'Método não permitido' });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error.message || 'Erro ao salvar conteúdo' });
  }
};
