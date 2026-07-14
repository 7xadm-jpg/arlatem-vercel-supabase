const crypto = require('crypto');
const { sendJson, readJsonBody } = require('./http');

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(
    raw
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function signSession(username) {
  const secret = process.env.SESSION_SECRET || 'change-me';
  const payload = JSON.stringify({ username, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  const base = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(base).digest('base64url');
  return `${base}.${sig}`;
}

function verifySession(token) {
  try {
    const secret = process.env.SESSION_SECRET || 'change-me';
    if (!token || !token.includes('.')) return null;
    const [base, sig] = token.split('.');
    const expected = crypto.createHmac('sha256', secret).update(base).digest('base64url');
    if (!sig || sig.length !== expected.length) return null;
    const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!valid) return null;
    const payload = JSON.parse(Buffer.from(base, 'base64url').toString('utf-8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'gestor-arlatem',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || ''
  };
}

async function loginHandler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, message: 'Método não permitido' });
  try {
    const body = await readJsonBody(req);
    const { username, password } = body;
    const admin = getAdminCredentials();
    if (!admin.passwordHash) {
      return sendJson(res, 500, { ok: false, message: 'ADMIN_PASSWORD_HASH não configurado' });
    }
    if (String(username || '') !== admin.username || sha256(password || '') !== admin.passwordHash) {
      return sendJson(res, 401, { ok: false, message: 'Usuário ou senha inválidos' });
    }
    const token = signSession(admin.username);
    return sendJson(
      res,
      200,
      { ok: true, message: 'Login realizado com sucesso' },
      { 'Set-Cookie': `arlatem_session=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure` }
    );
  } catch (error) {
    return sendJson(res, 400, { ok: false, message: 'Falha no login' });
  }
}

function logoutHandler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { ok: false, message: 'Método não permitido' });
  return sendJson(
    res,
    200,
    { ok: true },
    { 'Set-Cookie': 'arlatem_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure' }
  );
}

function requireAuth(req, res) {
  const cookies = parseCookies(req);
  const session = verifySession(cookies.arlatem_session);
  const admin = getAdminCredentials();
  if (!session || session.username !== admin.username) {
    sendJson(res, 401, { ok: false, message: 'Não autorizado' });
    return null;
  }
  return session;
}

module.exports = {
  sha256,
  parseCookies,
  signSession,
  verifySession,
  loginHandler,
  logoutHandler,
  requireAuth,
  getAdminCredentials
};
