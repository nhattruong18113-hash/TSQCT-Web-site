import { out } from './_util.js';
const FEEDS = {
  army: '(site:qdnd.vn OR site:mod.gov.vn OR site:qpvn.vn) when:14d',
  tsqct: '"Trường Sĩ quan Chính trị" OR "Đại học Chính trị" OR "Trường Đại học Chính trị" when:60d',
};
const dec = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').trim();
const tag = (x, t) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? dec(m[1]) : ''; };
export default async function handler(req, res) {
  const q = FEEDS[String(req.query.f || '')];
  if (!q) return out(res, { error: 'feed' }, 400);
  try {
    const r = await fetch('https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=vi&gl=VN&ceid=VN:vi', { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SQCTWeb/1.0)' } });
    if (!r.ok) throw new Error('bad');
    const xml = await r.text();
    const items = (xml.match(/<item>[\s\S]*?<\/item>/g) || []).map((x) => {
      const t = Date.parse(tag(x, 'pubDate'));
      return { title: tag(x, 'title'), source: tag(x, 'source'), link: tag(x, 'link'), time: t || 0 };
    });
    if (!items.length) throw new Error('empty');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8').send(JSON.stringify({ items }));
  } catch (_) {
    out(res, { error: 'Không lấy được tin từ máy chủ.' }, 502);
  }
}
