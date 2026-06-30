// Thin fetch wrapper around the Jinzi Shabu REST API.
async function req(method, path, body, token) {
  const opts = { method, headers: {} };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch('/api' + path, opts);
  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) throw new Error((data && data.error) || ('HTTP ' + res.status));
  return data;
}

export const api = {
  // public
  availability: (date, time) => req('GET', `/availability?date=${encodeURIComponent(date)}${time ? '&time=' + encodeURIComponent(time) : ''}`),
  createBooking: (payload) => req('POST', '/bookings', payload),
  getMenu: (all) => req('GET', '/menu' + (all ? '?all=1' : '')),
  getGallery: (all) => req('GET', '/gallery' + (all ? '?all=1' : '')),
  getSettings: () => req('GET', '/settings'),

  // admin — auth
  adminLogin: (pin) => req('POST', '/admin/login', { pin }),

  // admin — bookings
  listBookings: (params, token) => {
    const qs = new URLSearchParams(params || {}).toString();
    return req('GET', '/bookings' + (qs ? '?' + qs : ''), undefined, token);
  },
  setStatus: (ref, status, token) => req('PATCH', '/bookings/' + encodeURIComponent(ref), { status }, token),
  removeBooking: (ref, token) => req('DELETE', '/bookings/' + encodeURIComponent(ref), undefined, token),

  // admin — CMS
  saveMenu: (item, token) => item.id ? req('PATCH', '/menu/' + item.id, item, token) : req('POST', '/menu', item, token),
  deleteMenu: (id, token) => req('DELETE', '/menu/' + id, undefined, token),
  saveGallery: (item, token) => item.id ? req('PATCH', '/gallery/' + item.id, item, token) : req('POST', '/gallery', item, token),
  deleteGallery: (id, token) => req('DELETE', '/gallery/' + id, undefined, token),
  saveSettings: (obj, token) => req('PUT', '/settings', obj, token),

  // admin — image upload (multipart)
  async upload(file, token) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd });
    let data = null; try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error((data && data.error) || ('HTTP ' + res.status));
    return data;  // { url }
  },
};
