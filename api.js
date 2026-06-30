// REST API for Jinzi Shabu — bookings + CMS (menu / gallery / settings / upload).
import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { db, getSettings, saveSettings, DEFAULT_SETTINGS } from './db.js';
import { TABLE_MAP, PACKAGES } from './tables.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const api = express.Router();

// ---------------------------------------------------------------------------
// Admin auth — single staff PIN, stateless HMAC token (no session storage).
// ---------------------------------------------------------------------------
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'jinzi-dev-secret-change-me';

function adminToken() {
  return crypto.createHmac('sha256', ADMIN_SECRET).update('jinzi-admin').digest('hex');
}
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const expected = adminToken();
  const ok = token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if (!ok) return res.status(401).json({ error: 'unauthorized' });
  next();
}

api.post('/admin/login', (req, res) => {
  const pin = String((req.body || {}).pin || '').trim();
  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'รหัส PIN ไม่ถูกต้อง' });
  res.json({ token: adminToken() });
});

// ---------------------------------------------------------------------------
// Image upload (admin) — multer → public/uploads, returns the served URL.
// ---------------------------------------------------------------------------
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname || '') || '.jpg').toLowerCase();
    cb(null, Date.now() + '-' + crypto.randomBytes(4).toString('hex') + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },  // 6 MB
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

api.post('/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูป (ต้องเป็นไฟล์รูปภาพ ≤ 6MB)' });
  res.status(201).json({ url: '/uploads/' + req.file.filename });
});

// ===========================================================================
// MENU (CMS)
// ===========================================================================
const menuCols = ['sort','image','name_th','name_en','name_zh','sub_th','sub_en','sub_zh','is_active'];
function menuFromBody(f, base = {}) {
  return {
    sort: f.sort != null ? Number(f.sort) : (base.sort ?? 0),
    image: f.image != null ? String(f.image) : (base.image ?? ''),
    name_th: f.name_th ?? base.name_th ?? '', name_en: f.name_en ?? base.name_en ?? '', name_zh: f.name_zh ?? base.name_zh ?? '',
    sub_th: f.sub_th ?? base.sub_th ?? '', sub_en: f.sub_en ?? base.sub_en ?? '', sub_zh: f.sub_zh ?? base.sub_zh ?? '',
    is_active: f.is_active == null ? (base.is_active ?? 1) : (f.is_active ? 1 : 0),
  };
}

api.get('/menu', (req, res) => {
  const all = req.query.all === '1';
  const sql = 'SELECT * FROM menu_items' + (all ? '' : ' WHERE is_active = 1') + ' ORDER BY sort, id';
  res.json(db.prepare(sql).all());
});

api.post('/menu', requireAdmin, (req, res) => {
  const m = menuFromBody(req.body || {});
  const info = db.prepare(`INSERT INTO menu_items (${menuCols.join(',')}) VALUES (${menuCols.map(() => '?').join(',')})`)
    .run(...menuCols.map((c) => m[c]));
  res.status(201).json(db.prepare('SELECT * FROM menu_items WHERE id = ?').get(info.lastInsertRowid));
});

api.patch('/menu/:id', requireAdmin, (req, res) => {
  const cur = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(Number(req.params.id));
  if (!cur) return res.status(404).json({ error: 'ไม่พบเมนู' });
  const m = menuFromBody(req.body || {}, cur);
  db.prepare(`UPDATE menu_items SET ${menuCols.map((c) => c + '=?').join(', ')} WHERE id = ?`)
    .run(...menuCols.map((c) => m[c]), cur.id);
  res.json(db.prepare('SELECT * FROM menu_items WHERE id = ?').get(cur.id));
});

api.delete('/menu/:id', requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM menu_items WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'ไม่พบเมนู' });
  res.json({ ok: true });
});

// ===========================================================================
// GALLERY (CMS)
// ===========================================================================
api.get('/gallery', (req, res) => {
  const all = req.query.all === '1';
  const sql = 'SELECT * FROM gallery' + (all ? '' : ' WHERE is_active = 1') + ' ORDER BY sort, id';
  res.json(db.prepare(sql).all());
});

api.post('/gallery', requireAdmin, (req, res) => {
  const f = req.body || {};
  if (!f.image) return res.status(400).json({ error: 'ต้องมีรูป' });
  const info = db.prepare('INSERT INTO gallery (sort, image, span, is_active) VALUES (?,?,?,?)')
    .run(Number(f.sort || 0), String(f.image), f.span === 2 || f.span === '2' ? 2 : 1, f.is_active === 0 ? 0 : 1);
  res.status(201).json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(info.lastInsertRowid));
});

api.patch('/gallery/:id', requireAdmin, (req, res) => {
  const cur = db.prepare('SELECT * FROM gallery WHERE id = ?').get(Number(req.params.id));
  if (!cur) return res.status(404).json({ error: 'ไม่พบรูป' });
  const f = req.body || {};
  db.prepare('UPDATE gallery SET sort=?, image=?, span=?, is_active=? WHERE id=?')
    .run(f.sort != null ? Number(f.sort) : cur.sort,
         f.image != null ? String(f.image) : cur.image,
         f.span != null ? (Number(f.span) === 2 ? 2 : 1) : cur.span,
         f.is_active == null ? cur.is_active : (f.is_active ? 1 : 0), cur.id);
  res.json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(cur.id));
});

api.delete('/gallery/:id', requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM gallery WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'ไม่พบรูป' });
  res.json({ ok: true });
});

// ===========================================================================
// SETTINGS (CMS) — editable site text / contact
// ===========================================================================
api.get('/settings', (_req, res) => res.json(getSettings()));
api.get('/settings/defaults', requireAdmin, (_req, res) => res.json(DEFAULT_SETTINGS));

api.put('/settings', requireAdmin, (req, res) => {
  const body = req.body || {};
  // shallow-merge top-level sections so a partial save keeps the rest
  const cur = getSettings();
  const next = { ...cur };
  for (const k of Object.keys(body)) next[k] = { ...(cur[k] || {}), ...(body[k] || {}) };
  res.json(saveSettings(next));
});

// ===========================================================================
// AVAILABILITY + BOOKINGS
// ===========================================================================
api.get('/availability', (req, res) => {
  const { date, time } = req.query;
  if (!date) return res.status(400).json({ error: 'ระบุวันที่' });
  let sql = `SELECT DISTINCT table_id FROM bookings
    WHERE booking_date = ? AND status != 'cancelled' AND table_id IS NOT NULL`;
  const params = [date];
  if (time) { sql += ' AND booking_time = ?'; params.push(time); }
  const occupied = db.prepare(sql).all(...params).map((r) => r.table_id);
  res.json({ date, time: time || null, occupied });
});

api.post('/bookings', (req, res) => {
  const f = req.body || {};
  const name = String(f.name || '').trim();
  const phone = String(f.phone || '').trim();
  const partySize = Math.max(1, Number(f.party_size || f.pax || 2));
  const tableId = f.table_id || f.table || null;
  const pkg = PACKAGES.includes(String(f.package)) ? String(f.package) : '459';

  if (!name) return res.status(400).json({ error: 'กรุณากรอกชื่อผู้จอง' });
  if (phone.replace(/\D/g, '').length < 9) return res.status(400).json({ error: 'เบอร์โทรไม่ถูกต้อง' });
  if (!f.booking_date || !f.booking_time) return res.status(400).json({ error: 'เลือกวันและเวลา' });
  if (!tableId) return res.status(400).json({ error: 'กรุณาเลือกโต๊ะ' });

  const table = TABLE_MAP[tableId];
  if (!table) return res.status(404).json({ error: 'ไม่พบโต๊ะที่เลือก' });
  if (table.seats < partySize) return res.status(409).json({ error: 'โต๊ะนี้รองรับจำนวนคนไม่พอ' });

  const taken = db.prepare(`SELECT 1 FROM bookings
    WHERE booking_date=? AND booking_time=? AND table_id=? AND status!='cancelled' LIMIT 1`)
    .get(f.booking_date, f.booking_time, tableId);
  if (taken) return res.status(409).json({ error: 'โต๊ะนี้ถูกจองในช่วงเวลานี้แล้ว กรุณาเลือกโต๊ะอื่น' });

  const ref = 'JZ' + Date.now().toString().slice(-6);
  db.prepare(`INSERT INTO bookings
    (ref, name, phone, booking_date, booking_time, party_size, table_id, package, notes, status, lang)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run(ref, name, phone, f.booking_date, f.booking_time, partySize, tableId, pkg,
         String(f.notes || '').trim(), 'pending', String(f.lang || 'th'));

  res.status(201).json(db.prepare('SELECT * FROM bookings WHERE ref = ?').get(ref));
});

api.get('/bookings', requireAdmin, (req, res) => {
  let sql = 'SELECT * FROM bookings WHERE 1=1';
  const p = [];
  if (req.query.date) { sql += ' AND booking_date = ?'; p.push(req.query.date); }
  if (req.query.status && req.query.status !== 'all') { sql += ' AND status = ?'; p.push(req.query.status); }
  if (req.query.q) {
    sql += ' AND (name LIKE ? OR phone LIKE ? OR ref LIKE ?)';
    const q = `%${req.query.q}%`; p.push(q, q, q);
  }
  sql += ' ORDER BY booking_date ASC, booking_time ASC, created_at DESC';
  res.json(db.prepare(sql).all(...p));
});

api.patch('/bookings/:ref', requireAdmin, (req, res) => {
  const b = db.prepare('SELECT * FROM bookings WHERE ref = ?').get(req.params.ref);
  if (!b) return res.status(404).json({ error: 'ไม่พบการจอง' });
  const status = (req.body || {}).status;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
  }
  db.prepare(`UPDATE bookings SET status=?, updated_at=datetime('now') WHERE ref=?`).run(status, b.ref);
  res.json(db.prepare('SELECT * FROM bookings WHERE ref = ?').get(b.ref));
});

api.delete('/bookings/:ref', requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM bookings WHERE ref = ?').run(req.params.ref);
  if (!info.changes) return res.status(404).json({ error: 'ไม่พบการจอง' });
  res.json({ ok: true });
});

export default api;
