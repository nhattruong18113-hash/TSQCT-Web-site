export async function rbx(url, body) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), 'User-Agent': 'Mozilla/5.0 (compatible; SQCTWeb/1.0)' },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctl.signal,
    });
    let data = null;
    try { data = await r.json(); } catch (_) {}
    return { code: r.status, data };
  } catch (_) {
    return { code: 0, data: null };
  } finally { clearTimeout(t); }
}
export function out(res, obj, code = 200) {
  res.status(code).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store');
  res.send(JSON.stringify(obj));
}
