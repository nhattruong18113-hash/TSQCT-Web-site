import { out } from './_util.js';
// Vercel không có ổ đĩa ghi lâu dài. Nếu đặt UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// (Vercel → Storage → Upstash Redis) thì dữ liệu được lưu vào list "users"; nếu không thì chỉ ghi log.
export default async function handler(req, res) {
  if (req.method !== 'POST') return out(res, { ok: false }, 405);
  const b = req.body || {};
  let name = String(b.name || '').replace(/\s+/g, ' ').trim();
  const email = String(b.email || '').trim().toLowerCase();
  if (name.length < 2 || name.length > 120 || !/^[a-z0-9._%+-]+@gmail\.com$/.test(email)) return out(res, { ok: false, error: 'invalid' }, 400);
  if (/^[=+\-@]/.test(name)) name = "'" + name;
  const row = JSON.stringify({ t: new Date().toISOString(), name, email });
  const url = process.env.UPSTASH_REDIS_REST_URL, tok = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && tok) {
    try { await fetch(`${url}/lpush/users`, { method: 'POST', headers: { Authorization: `Bearer ${tok}` }, body: row }); } catch (_) {}
  } else { console.log('SAVE_USER', row); }
  out(res, { ok: true });
}
