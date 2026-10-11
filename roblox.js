import { rbx, out } from './_util.js';
export default async function handler(req, res) {
  const name = String(req.query.name || '');
  if (!/^[A-Za-z0-9_]{3,20}$/.test(name)) return out(res, { error: 'Tên Roblox không hợp lệ.' }, 400);
  const r = await rbx('https://users.roblox.com/v1/usernames/users', { usernames: [name], excludeBannedUsers: false });
  if (r.code === 429) return out(res, { error: 'Roblox đang giới hạn truy cập. Hãy thử lại sau vài phút.' }, 429);
  if (r.data === null) return out(res, { error: 'Không kết nối được tới Roblox.' }, 502);
  if (!r.data.data || !r.data.data[0]) return out(res, { error: 'Không tìm thấy người chơi này.' }, 404);
  const id = Number(r.data.data[0].id);
  const [u, g, av] = await Promise.all([
    rbx(`https://users.roblox.com/v1/users/${id}`),
    rbx(`https://groups.roblox.com/v2/users/${id}/groups/roles`),
    rbx(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=false`),
  ]);
  if (u.data === null) return out(res, { error: 'Không lấy được thông tin tài khoản.' }, 502);
  const roles = (g.data && g.data.data) || [];
  const avatar = (av.data && av.data.data && av.data.data[0] && av.data.data[0].imageUrl) || '';
  const ids = roles.map((x) => x.group.id);
  const icons = {};
  for (let i = 0; i < ids.length; i += 100) {
    const ic = await rbx('https://thumbnails.roblox.com/v1/groups/icons?groupIds=' + ids.slice(i, i + 100).join(',') + '&size=150x150&format=Png&isCircular=false');
    ((ic.data && ic.data.data) || []).forEach((x) => { icons[x.targetId] = x.imageUrl || ''; });
  }
  const groups = roles.map((x) => ({ id: x.group.id, name: x.group.name, role: x.role.name, rank: x.role.rank, icon: icons[x.group.id] || '' }))
    .sort((a, b) => b.rank - a.rank);
  out(res, { id, name: u.data.name, displayName: u.data.displayName, created: u.data.created, isBanned: !!u.data.isBanned, avatar, groups });
}
