const crypto = require('crypto');
const { sendJson, readJsonBody } = require('../../lib/http');
const { requireAuth } = require('../../lib/auth');
const { getServiceClient, getBucketName, requireEnv } = require('../../lib/supabase');

function sanitizeFileName(fileName = 'arquivo') {
  const ext = (fileName.split('.').pop() || 'png').toLowerCase();
  const allowed = ['png', 'jpg', 'jpeg', 'webp'];
  const finalExt = allowed.includes(ext) ? ext : 'png';
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${finalExt}`;
}

module.exports = async (req, res) => {
  const session = requireAuth(req, res);
  if (!session) return;
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, message: 'Método não permitido' });

  try {
    const body = await readJsonBody(req);
    const match = /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/i.exec(body.dataUrl || '');
    if (!match) return sendJson(res, 400, { ok: false, message: 'Formato de imagem inválido' });

    const mime = match[1].toLowerCase();
    const base64 = match[3];
    const buffer = Buffer.from(base64, 'base64');
    const fileName = sanitizeFileName(body.fileName || 'upload.png');
    const bucket = getBucketName();
    const filePath = `arlatem/${fileName}`;
    const supabase = getServiceClient();

    const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: mime,
      upsert: true
    });
    if (error) throw error;

    const baseUrl = requireEnv('SUPABASE_URL');
    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
    return sendJson(res, 200, { ok: true, path: publicUrl });
  } catch (error) {
    return sendJson(res, 500, { ok: false, message: error.message || 'Falha no upload' });
  }
};
