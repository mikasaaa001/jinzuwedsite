// Admin dashboard — Jinzi Shabu. PIN login (server-validated) → tabs:
// bookings / menu (CMS) / gallery (CMS) / site settings (CMS).
import { TABLES, TABLE_MAP, todayStr, escapeHtml } from './data.js';
import { api } from './api.js';

const KANIT = "'Kanit','Noto Sans SC',sans-serif";
const ZONENAME = { outdoor:'โซนกลางแจ้ง', indoor:'โซนในร้าน', private:'โซนส่วนตัว' };
const STATUS = {
  pending:   { label:'รอยืนยัน',  icon:'⏳', bg:'#fff4dd', fg:'#a9741a', accent:'#E0A52E' },
  confirmed: { label:'ยืนยันแล้ว', icon:'✓', bg:'#e3f6ec', fg:'#1F8A5B', accent:'#1F8A5B' },
  cancelled: { label:'ยกเลิก',    icon:'✕', bg:'#f1e7e7', fg:'#9c5050', accent:'#bd8b8b' },
};
const LANGS = [['th','ไทย'], ['en','EN'], ['zh','中文']];

const state = {
  token: sessionStorage.getItem('jinzi_token') || '',
  pin: '', pinError: false,
  tab: 'bookings',
  bookings: [], search: '', statusFilter: 'all', dateFilter: '',
  menu: [], gallery: [], settings: null,
  editing: null,            // menu item being edited in the modal (or null)
  msg: '', loadError: '',
  vw: window.innerWidth,
};
const app = document.getElementById('app');

// ---------------------------------------------------------------------------
// data loading + auth
// ---------------------------------------------------------------------------
async function loadAll() {
  if (!state.token) return;
  try {
    const [bookings, menu, gallery, settings] = await Promise.all([
      api.listBookings({}, state.token),
      api.getMenu(true), api.getGallery(true), api.getSettings(),
    ]);
    state.bookings = bookings; state.menu = menu; state.gallery = gallery; state.settings = settings;
    state.loadError = '';
  } catch (e) {
    if (/unauthorized|401/i.test(e.message)) { logout(); return; }
    state.loadError = e.message;
  }
  render();
}
async function doLogin() {
  try {
    const r = await api.adminLogin(state.pin.trim());
    state.token = r.token; sessionStorage.setItem('jinzi_token', r.token);
    state.pin = ''; state.pinError = false;
    render(); loadAll();
  } catch (e) { state.pinError = true; render(); }
}
function logout() {
  sessionStorage.removeItem('jinzi_token');
  state.token = ''; state.bookings = []; state.menu = []; state.gallery = [];
  render();
}
function flash(m) { state.msg = m; render(); setTimeout(() => { state.msg = ''; render(); }, 2500); }
function onAuthErr(e) { if (/unauthorized|401/i.test(e.message)) logout(); else flash('ผิดพลาด: ' + e.message); }

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
function renderLogin() {
  app.innerHTML = `
  <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;">
    <div style="width:min(400px,94vw); background:#fff; border-radius:22px; padding:clamp(30px,5vw,44px); box-shadow:0 30px 80px rgba(0,0,0,.5); border:2px solid #D6A94C; text-align:center; animation:jzFadeUp .4s ease;">
      <img src="images/logo.jpg" alt="Jinzi Shabu" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid #D6A94C; margin-bottom:14px;">
      <h1 style="margin:0; font-family:${KANIT}; font-weight:800; font-size:24px; color:#7a0a16;">ระบบหลังบ้าน</h1>
      <p style="margin:6px 0 22px; color:#9a6a52; font-size:14px;">สำหรับพนักงาน Jinzi Shabu</p>
      <input data-pin value="${escapeHtml(state.pin)}" type="password" inputmode="numeric" placeholder="กรอกรหัส PIN"
        style="width:100%; text-align:center; letter-spacing:8px; font-family:${KANIT}; font-size:22px; padding:14px; border-radius:13px; border:1.5px solid ${state.pinError?'#e05151':'#e0c79a'}; background:#FCF8EF; outline:none; color:#2A0A0E;">
      ${state.pinError ? `<div style="margin-top:12px; color:#b21f1f; font-size:14px;">รหัส PIN ไม่ถูกต้อง</div>` : ''}
      <button data-login style="cursor:pointer; width:100%; margin-top:18px; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; border:none; font-family:${KANIT}; font-weight:700; font-size:18px; padding:15px; border-radius:999px;">เข้าสู่ระบบ</button>
      <p style="margin:16px 0 0; color:#c0a47e; font-size:12px;">เดโม — รหัสเริ่มต้น: 1234</p>
      <a href="/" style="text-decoration:none; display:inline-block; margin-top:14px; color:#C41230; font-size:13px;">‹ กลับหน้าเว็บไซต์</a>
    </div>
  </div>`;
  const pin = app.querySelector('[data-pin]');
  pin?.addEventListener('input', (e) => { state.pin = e.target.value; state.pinError = false; });
  pin?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  pin?.focus();
  app.querySelector('[data-login]')?.addEventListener('click', doLogin);
}

// ---------------------------------------------------------------------------
// SHELL (tabs)
// ---------------------------------------------------------------------------
function shell(content) {
  const tabs = [
    ['bookings','📋 การจอง'], ['menu','🍲 เมนู'], ['gallery','🖼 แกลเลอรี'], ['settings','⚙️ ตั้งค่าเว็บ'],
  ].map(([id, label]) => {
    const active = state.tab === id;
    return `<button data-tab="${id}" style="cursor:pointer; padding:8px 16px; border-radius:999px; border:1px solid ${active?'#F3D58A':'rgba(214,169,76,.4)'}; background:${active?'rgba(243,213,138,.18)':'transparent'}; color:${active?'#F3D58A':'#E7B7A0'}; font-family:${KANIT}; font-weight:600; font-size:14px;">${label}</button>`;
  }).join('');
  const msg = state.msg ? `<div style="position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:90; background:#1F8A5B; color:#fff; padding:11px 22px; border-radius:999px; font-family:${KANIT}; font-weight:600; box-shadow:0 10px 30px rgba(0,0,0,.4);">${escapeHtml(state.msg)}</div>` : '';
  const err = state.loadError ? `<div style="max-width:1200px; margin:0 auto 0; padding:0 20px;"><div style="background:#fdecec; border:1px solid #f3b4b4; color:#b21f1f; padding:12px 16px; border-radius:11px; font-size:14px;">โหลดข้อมูลไม่สำเร็จ: ${escapeHtml(state.loadError)}</div></div>` : '';
  return `
  <header style="position:sticky; top:0; z-index:40; background:rgba(140,11,27,.97); backdrop-filter:blur(8px); border-bottom:1px solid rgba(214,169,76,.4);">
    <div style="max-width:1200px; margin:0 auto; padding:11px 20px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="images/logo.jpg" alt="" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid #D6A94C;">
        <div style="line-height:1.15;">
          <div style="font-family:${KANIT}; font-weight:800; letter-spacing:2px; color:#F3D58A; font-size:16px;">JINZI · ระบบหลังบ้าน</div>
          <div style="color:#E7B7A0; font-size:12px;">จัดการร้าน + การจอง</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:9px;">
        <button data-reload style="cursor:pointer; background:rgba(0,0,0,.25); border:1px solid rgba(214,169,76,.45); color:#FBE9C8; font-size:13px; padding:8px 14px; border-radius:999px;">↻ รีเฟรช</button>
        <button data-logout style="cursor:pointer; background:transparent; border:1px solid rgba(214,169,76,.45); color:#F3D58A; font-family:${KANIT}; font-weight:600; font-size:13px; padding:8px 14px; border-radius:999px;">ออกจากระบบ</button>
      </div>
    </div>
    <div style="max-width:1200px; margin:0 auto; padding:0 20px 11px; display:flex; gap:8px; flex-wrap:wrap;">${tabs}</div>
  </header>
  ${err}
  <div style="max-width:1200px; margin:0 auto; padding:24px 20px 90px;">${content}</div>
  ${msg}`;
}

// ---------------------------------------------------------------------------
// TAB: BOOKINGS
// ---------------------------------------------------------------------------
function bookingsTab() {
  const isMobile = state.vw < 920;
  const today = todayStr();
  const all = state.bookings.slice();
  const countBy = (st) => all.filter((b) => b.status === st).length;
  const todayList = all.filter((b) => b.booking_date === today && b.status !== 'cancelled');
  const todayGuests = todayList.reduce((n, b) => n + (Number(b.party_size) || 0), 0);

  const stats = [
    { icon:'📋', label:'จองวันนี้', value: todayList.length,    color:'#F3D58A' },
    { icon:'⏳', label:'รอยืนยัน',   value: countBy('pending'),   color:'#E0A52E' },
    { icon:'✓',  label:'ยืนยันแล้ว', value: countBy('confirmed'), color:'#5fd39a' },
    { icon:'👥', label:'แขกวันนี้',   value: todayGuests,          color:'#F3D58A' },
  ].map((s) => `
    <div style="background:linear-gradient(160deg,#3a0f15,#2a0a0e); border:1px solid rgba(214,169,76,.28); border-radius:18px; padding:20px 22px;">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:24px;">${s.icon}</span>
        <span style="font-family:${KANIT}; font-weight:800; font-size:34px; color:${s.color};">${s.value}</span>
      </div>
      <div style="margin-top:4px; color:#E7C6A6; font-size:14px;">${escapeHtml(s.label)}</div>
    </div>`).join('');

  const tabDefs = [
    { id:'all', label:'ทั้งหมด', count: all.length },
    { id:'pending', label:'รอยืนยัน', count: countBy('pending') },
    { id:'confirmed', label:'ยืนยันแล้ว', count: countBy('confirmed') },
    { id:'cancelled', label:'ยกเลิก', count: countBy('cancelled') },
  ].map((td) => {
    const active = state.statusFilter === td.id;
    return `<button data-sfilter="${td.id}" style="cursor:pointer; display:inline-flex; align-items:center; gap:7px; padding:8px 15px; border-radius:999px; border:1.5px solid ${active?'#7a0a16':'#e0c79a'}; background:${active?'#7a0a16':'#FCF4E6'}; color:${active?'#F3D58A':'#7a4a3a'}; font-family:${KANIT}; font-weight:600; font-size:13px;">
      ${escapeHtml(td.label)}<span style="background:${active?'rgba(243,213,138,.25)':'#fff'}; color:${active?'#F3D58A':'#9a6a52'}; border-radius:999px; padding:1px 8px; font-size:12px;">${td.count}</span></button>`;
  }).join('');

  const q = state.search.trim().toLowerCase();
  let rowsData = all.filter((b) => {
    if (state.statusFilter !== 'all' && b.status !== state.statusFilter) return false;
    if (state.dateFilter && b.booking_date !== state.dateFilter) return false;
    if (q) { const hay = ((b.name||'')+' '+(b.phone||'')+' '+(b.ref||'')).toLowerCase(); if (!hay.includes(q)) return false; }
    return true;
  });
  rowsData.sort((a, b) => (a.booking_date+a.booking_time).localeCompare(b.booking_date+b.booking_time));

  const rows = rowsData.map((b) => {
    const st = STATUS[b.status] || STATUS.pending;
    const tb = TABLE_MAP[b.table_id];
    let actions = '';
    if (b.status === 'pending') {
      actions += btn('confirmed', b.ref, '✓ ยืนยัน', '#1F8A5B', '#1F8A5B', '#fff');
      actions += btn('cancelled', b.ref, '✕ ยกเลิก', '#fff', '#e0b0b0', '#b25050');
    } else if (b.status === 'confirmed') {
      actions += btn('cancelled', b.ref, '✕ ยกเลิก', '#fff', '#e0b0b0', '#b25050');
    } else {
      actions += btn('pending', b.ref, '↺ คืนสถานะ', '#FCF4E6', '#e0c79a', '#9a6a52');
    }
    actions += `<button data-del="${b.ref}" style="cursor:pointer; padding:9px 18px; border-radius:999px; border:1.5px solid #e0c79a; background:transparent; color:#9a6a52; font-family:${KANIT}; font-weight:600; font-size:14px;">🗑 ลบ</button>`;
    const notes = (b.notes && b.notes.trim())
      ? `<div style="margin-top:12px; padding:9px 13px; background:#FCF4E6; border:1px solid #ecd9b4; border-radius:10px; color:#7a4a3a; font-size:13px;">📝 ${escapeHtml(b.notes)}</div>` : '';
    return `
    <div style="background:#fff; border-radius:18px; border:1px solid rgba(214,169,76,.3); border-left:5px solid ${st.accent}; box-shadow:0 10px 26px rgba(0,0,0,.18); overflow:hidden;">
      <div style="padding:18px 20px;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:50px; height:50px; border-radius:13px; background:linear-gradient(135deg,#9E0B1B,#C41230); color:#F3D58A; display:flex; align-items:center; justify-content:center; font-family:${KANIT}; font-weight:800; font-size:16px;">${escapeHtml(b.table_id || '—')}</div>
            <div>
              <div style="font-family:${KANIT}; font-weight:700; font-size:18px; color:#2A0A0E;">${escapeHtml(b.name)}</div>
              <div style="color:#9a6a52; font-size:13px;">${escapeHtml(b.ref)} · ${escapeHtml(tb ? ZONENAME[tb.zone] : '—')}</div>
            </div>
          </div>
          <span style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:999px; background:${st.bg}; color:${st.fg}; font-family:${KANIT}; font-weight:600; font-size:13px;">${st.icon} ${escapeHtml(st.label)}</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:10px 22px; margin-top:14px;">
          <div style="display:flex; align-items:center; gap:7px; color:#3a2218; font-size:14px;"><span style="color:#C9952F;">📅</span>${escapeHtml(b.booking_date)}</div>
          <div style="display:flex; align-items:center; gap:7px; color:#3a2218; font-size:14px;"><span style="color:#C9952F;">🕒</span>${escapeHtml(b.booking_time)} น.</div>
          <div style="display:flex; align-items:center; gap:7px; color:#3a2218; font-size:14px;"><span style="color:#C9952F;">👥</span>${escapeHtml(b.party_size)} ท่าน</div>
          <div style="display:flex; align-items:center; gap:7px; color:#3a2218; font-size:14px;"><span style="color:#C9952F;">🎫</span>${escapeHtml(b.package)}฿</div>
          <a href="tel:${escapeHtml((b.phone||'').replace(/\s/g,''))}" style="text-decoration:none; display:flex; align-items:center; gap:7px; color:#1769c4; font-size:14px;"><span>📞</span>${escapeHtml(b.phone)}</a>
        </div>
        ${notes}
        <div style="display:flex; flex-wrap:wrap; gap:9px; margin-top:16px;">${actions}</div>
      </div>
    </div>`;
  }).join('');

  const empty = rowsData.length === 0 ? `
    <div style="background:#fff; border-radius:18px; padding:48px 24px; text-align:center; border:1px dashed #e0c79a;">
      <div style="font-size:42px;">🍲</div>
      <div style="margin-top:10px; font-family:${KANIT}; font-weight:700; font-size:18px; color:#7a0a16;">ยังไม่มีการจองที่ตรงเงื่อนไข</div>
      <div style="margin-top:4px; color:#9a6a52; font-size:14px;">การจองใหม่จากลูกค้าจะปรากฏที่นี่อัตโนมัติ</div>
    </div>` : '';

  return `
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px;">${stats}</div>
    <div style="background:#fff; border-radius:18px; padding:18px; border:1px solid rgba(214,169,76,.3); box-shadow:0 12px 30px rgba(0,0,0,.25); margin-top:24px;">
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <input data-search value="${escapeHtml(state.search)}" placeholder="ค้นหา ชื่อ / เบอร์ / รหัสจอง" style="flex:1; min-width:200px; font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:15px; padding:11px 14px; border-radius:11px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; color:#2A0A0E;">
        <input data-datefilter type="date" value="${state.dateFilter}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:15px; padding:10px 12px; border-radius:11px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; color:#2A0A0E;">
        <button data-cleardate style="cursor:pointer; background:#FCF4E6; border:1.5px solid #e0c79a; color:#9a6a52; font-size:13px; padding:10px 14px; border-radius:11px;">ทุกวัน</button>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">${tabDefs}</div>
    </div>
    <div style="margin-top:18px; display:flex; flex-direction:column; gap:14px;">${empty}${rows}</div>`;

  function btn(act, ref, label, bg, bd, fg) {
    return `<button data-act="${act}" data-ref="${ref}" style="cursor:pointer; padding:9px 18px; border-radius:999px; border:1.5px solid ${bd}; background:${bg}; color:${fg}; font-family:${KANIT}; font-weight:600; font-size:14px;">${label}</button>`;
  }
}

// ---------------------------------------------------------------------------
// TAB: MENU
// ---------------------------------------------------------------------------
function menuTab() {
  const cards = state.menu.map((m) => `
    <div style="background:#fff; border-radius:16px; overflow:hidden; border:1px solid rgba(214,169,76,.3); opacity:${m.is_active?1:.55};">
      <div style="aspect-ratio:4/3; background:#f3e7cf;"><img src="${escapeHtml(m.image)}" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></div>
      <div style="padding:12px 14px;">
        <div style="font-family:${KANIT}; font-weight:700; color:#2A0A0E; font-size:15px;">${escapeHtml(m.name_th || '(ไม่มีชื่อ)')}</div>
        <div style="color:#9a6a52; font-size:12px; margin-top:2px;">${escapeHtml(m.sub_th || '')}</div>
        <div style="display:flex; gap:7px; margin-top:11px;">
          <button data-medit="${m.id}" style="cursor:pointer; flex:1; padding:8px; border-radius:9px; border:1.5px solid #e0c79a; background:#FCF4E6; color:#7a0a16; font-family:${KANIT}; font-weight:600; font-size:13px;">แก้ไข</button>
          <button data-mtoggle="${m.id}" style="cursor:pointer; padding:8px 12px; border-radius:9px; border:1.5px solid ${m.is_active?'#1F8A5B':'#cf9a9a'}; background:#fff; color:${m.is_active?'#1F8A5B':'#9c4a4a'}; font-family:${KANIT}; font-weight:600; font-size:13px;">${m.is_active?'แสดง':'ซ่อน'}</button>
          <button data-mdel="${m.id}" style="cursor:pointer; padding:8px 11px; border-radius:9px; border:1.5px solid #e0c79a; background:transparent; color:#9a6a52; font-size:13px;">🗑</button>
        </div>
      </div>
    </div>`).join('');

  return `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
      <div style="color:#E7C6A6; font-family:${KANIT}; font-weight:700; font-size:18px;">เมนูทั้งหมด (${state.menu.length})</div>
      <button data-madd style="cursor:pointer; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; border:none; font-family:${KANIT}; font-weight:700; font-size:14px; padding:10px 20px; border-radius:999px;">＋ เพิ่มเมนู</button>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px;">${cards || '<div style="color:#9a6a52;">ยังไม่มีเมนู</div>'}</div>
    ${state.editing ? menuEditor() : ''}`;
}

function menuEditor() {
  const m = state.editing;
  const isNew = !m.id;
  const field = (key, label, ph = '') => `
    <label style="display:flex; flex-direction:column; gap:5px;">
      <span style="font-size:12px; color:#9a6a52;">${escapeHtml(label)}</span>
      <input data-mkey="${key}" value="${escapeHtml(m[key] || '')}" placeholder="${escapeHtml(ph)}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:15px; padding:10px 12px; border-radius:9px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; color:#2A0A0E;">
    </label>`;
  return `
  <div data-mclose-bg style="position:fixed; inset:0; z-index:80; background:rgba(20,4,7,.72); display:flex; align-items:flex-start; justify-content:center; padding:24px; overflow:auto;">
    <div data-mstop style="width:min(560px,96vw); background:#fff; border-radius:18px; border:2px solid #D6A94C; padding:24px; margin:auto;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <h3 style="margin:0; font-family:${KANIT}; font-weight:800; color:#7a0a16; font-size:20px;">${isNew?'เพิ่มเมนูใหม่':'แก้ไขเมนู'}</h3>
        <button data-mclose style="cursor:pointer; border:none; background:transparent; font-size:22px; color:#9a6a52;">✕</button>
      </div>
      <div style="display:flex; gap:14px; align-items:center; margin-bottom:16px;">
        <div style="width:90px; height:90px; border-radius:12px; overflow:hidden; background:#f3e7cf; border:1px solid #e0c79a; flex-shrink:0;">
          ${m.image ? `<img data-mpreview src="${escapeHtml(m.image)}" style="width:100%; height:100%; object-fit:cover;">` : `<div data-mpreview style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#b89a6a; font-size:11px;">ไม่มีรูป</div>`}
        </div>
        <div>
          <input data-mfile type="file" accept="image/*" style="font-size:13px;">
          <div style="color:#9a6a52; font-size:12px; margin-top:6px;">อัปโหลดรูปเมนู (≤ 6MB)</div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        ${field('name_th','ชื่อ (ไทย)','เช่น เนื้อหมูสไลซ์')}
        ${field('sub_th','คำอธิบาย (ไทย)','เช่น สามชั้น สันคอ')}
        ${field('name_en','ชื่อ (EN)','Sliced Pork')}
        ${field('sub_en','คำอธิบาย (EN)','Belly · Collar')}
        ${field('name_zh','ชื่อ (中文)','猪肉片')}
        ${field('sub_zh','คำอธิบาย (中文)','五花·梅肉')}
      </div>
      <label style="display:flex; align-items:center; gap:8px; margin-top:14px; color:#3a2218; font-size:14px;">
        <input data-mactive type="checkbox" ${m.is_active!==0?'checked':''}> แสดงเมนูนี้บนเว็บ
      </label>
      <div style="display:flex; gap:10px; margin-top:20px;">
        <button data-msave style="cursor:pointer; flex:1; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; border:none; font-family:${KANIT}; font-weight:700; font-size:16px; padding:13px; border-radius:999px;">บันทึก</button>
        <button data-mclose style="cursor:pointer; background:#fff; border:1.5px solid #e0c79a; color:#9a6a52; font-family:${KANIT}; font-weight:600; font-size:16px; padding:13px 22px; border-radius:999px;">ยกเลิก</button>
      </div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// TAB: GALLERY
// ---------------------------------------------------------------------------
function galleryTab() {
  const cards = state.gallery.map((g) => `
    <div style="background:#fff; border-radius:14px; overflow:hidden; border:1px solid rgba(214,169,76,.3); opacity:${g.is_active?1:.55};">
      <div style="aspect-ratio:4/3; background:#f3e7cf;"><img src="${escapeHtml(g.image)}" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></div>
      <div style="padding:10px 12px; display:flex; align-items:center; gap:7px; flex-wrap:wrap;">
        <button data-gspan="${g.id}" style="cursor:pointer; padding:6px 10px; border-radius:8px; border:1.5px solid #e0c79a; background:#FCF4E6; color:#7a0a16; font-size:12px;">${g.span===2?'ช่องใหญ่':'ช่องปกติ'}</button>
        <button data-gtoggle="${g.id}" style="cursor:pointer; padding:6px 10px; border-radius:8px; border:1.5px solid ${g.is_active?'#1F8A5B':'#cf9a9a'}; background:#fff; color:${g.is_active?'#1F8A5B':'#9c4a4a'}; font-size:12px;">${g.is_active?'แสดง':'ซ่อน'}</button>
        <button data-gdel="${g.id}" style="cursor:pointer; padding:6px 9px; border-radius:8px; border:1.5px solid #e0c79a; background:transparent; color:#9a6a52; font-size:12px;">🗑</button>
      </div>
    </div>`).join('');

  return `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
      <div style="color:#E7C6A6; font-family:${KANIT}; font-weight:700; font-size:18px;">รูปบรรยากาศ (${state.gallery.length})</div>
      <label style="cursor:pointer; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:14px; padding:10px 20px; border-radius:999px;">
        ＋ เพิ่มรูป <input data-gfile type="file" accept="image/*" style="display:none;">
      </label>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:16px;">${cards || '<div style="color:#9a6a52;">ยังไม่มีรูป</div>'}</div>`;
}

// ---------------------------------------------------------------------------
// TAB: SETTINGS
// ---------------------------------------------------------------------------
function settingsTab() {
  const s = state.settings || {};
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), s);

  const mlField = (key, label, area) => {
    const inputs = LANGS.map(([code, ll]) => {
      const v = (get(key) || {})[code] || '';
      const el = area
        ? `<textarea data-skey="${key}.${code}" rows="2" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:14px; padding:9px 11px; border-radius:9px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; color:#2A0A0E; resize:vertical;">${escapeHtml(v)}</textarea>`
        : `<input data-skey="${key}.${code}" value="${escapeHtml(v)}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:14px; padding:9px 11px; border-radius:9px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; color:#2A0A0E;">`;
      return `<label style="display:flex; flex-direction:column; gap:4px;"><span style="font-size:11px; color:#9a6a52;">${ll}</span>${el}</label>`;
    }).join('');
    return `<div style="margin-bottom:18px;"><div style="font-family:${KANIT}; font-weight:600; color:#3a2218; font-size:14px; margin-bottom:7px;">${escapeHtml(label)}</div><div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:9px;">${inputs}</div></div>`;
  };
  const oneField = (key, label, ph = '') => `
    <label style="display:flex; flex-direction:column; gap:5px; margin-bottom:18px;">
      <span style="font-family:${KANIT}; font-weight:600; color:#3a2218; font-size:14px;">${escapeHtml(label)}</span>
      <input data-skey="${key}" value="${escapeHtml(get(key) || '')}" placeholder="${escapeHtml(ph)}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:14px; padding:10px 12px; border-radius:9px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; color:#2A0A0E;">
    </label>`;
  const card = (title, inner) => `
    <div style="background:#fff; border-radius:16px; padding:20px 22px; border:1px solid rgba(214,169,76,.3); margin-bottom:18px;">
      <h3 style="margin:0 0 16px; font-family:${KANIT}; font-weight:700; color:#7a0a16; font-size:17px;">${escapeHtml(title)}</h3>${inner}</div>`;

  return `
    <div style="max-width:760px;">
      ${card('ส่วนหัว Hero', mlField('hero.title','หัวข้อหลัก') + mlField('hero.accent','หัวข้อ (ตัวอักษรทอง)') + mlField('hero.sub','คำโปรย', true))}
      ${card('ป๊อปอัพโปรโมชั่น', mlField('promo.title','หัวข้อโปรโม') + mlField('promo.sub','คำโปรยโปรโม', true))}
      ${card('ข้อมูลติดต่อ', oneField('contact.phone','เบอร์โทร','โทร. 0XX-XXX-XXXX') + mlField('contact.address','ที่อยู่ร้าน', true) + mlField('contact.hours','เวลาเปิดบริการ', true) + oneField('contact.facebook','ลิงก์ Facebook','https://facebook.com/...') + oneField('contact.mapsQuery','คำค้น Google Maps (ชื่อร้าน/พิกัด)','Jinzi Shabu'))}
      <button data-ssave style="cursor:pointer; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; border:none; font-family:${KANIT}; font-weight:700; font-size:16px; padding:14px 32px; border-radius:999px;">บันทึกการตั้งค่า</button>
    </div>`;
}

// ---------------------------------------------------------------------------
// render dispatch + wiring
// ---------------------------------------------------------------------------
function render() {
  if (!state.token) { renderLogin(); return; }
  const content = state.tab === 'menu' ? menuTab()
    : state.tab === 'gallery' ? galleryTab()
    : state.tab === 'settings' ? settingsTab()
    : bookingsTab();
  app.innerHTML = shell(content);
  wireShell();
  if (state.tab === 'bookings') wireBookings();
  if (state.tab === 'menu') wireMenu();
  if (state.tab === 'gallery') wireGallery();
  if (state.tab === 'settings') wireSettings();
}

function wireShell() {
  app.querySelector('[data-reload]')?.addEventListener('click', loadAll);
  app.querySelector('[data-logout]')?.addEventListener('click', logout);
  app.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => { state.tab = b.getAttribute('data-tab'); state.editing = null; render(); }));
}

function wireBookings() {
  const search = app.querySelector('[data-search]');
  search?.addEventListener('input', (e) => { state.search = e.target.value; render(); const el = app.querySelector('[data-search]'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } });
  app.querySelector('[data-datefilter]')?.addEventListener('change', (e) => { state.dateFilter = e.target.value; render(); });
  app.querySelector('[data-cleardate]')?.addEventListener('click', () => { state.dateFilter = ''; render(); });
  app.querySelectorAll('[data-sfilter]').forEach((b) => b.addEventListener('click', () => { state.statusFilter = b.getAttribute('data-sfilter'); render(); }));
  app.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', async () => {
    try { await api.setStatus(b.getAttribute('data-ref'), b.getAttribute('data-act'), state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));
  app.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('ลบการจองนี้?')) return;
    try { await api.removeBooking(b.getAttribute('data-del'), state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));
}

function wireMenu() {
  app.querySelector('[data-madd]')?.addEventListener('click', () => { state.editing = { is_active: 1 }; render(); });
  app.querySelectorAll('[data-medit]').forEach((b) => b.addEventListener('click', () => {
    const id = Number(b.getAttribute('data-medit'));
    state.editing = { ...state.menu.find((m) => m.id === id) };
    render();
  }));
  app.querySelectorAll('[data-mtoggle]').forEach((b) => b.addEventListener('click', async () => {
    const id = Number(b.getAttribute('data-mtoggle'));
    const m = state.menu.find((x) => x.id === id);
    try { await api.saveMenu({ id, is_active: m.is_active ? 0 : 1 }, state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));
  app.querySelectorAll('[data-mdel]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('ลบเมนูนี้?')) return;
    try { await api.deleteMenu(Number(b.getAttribute('data-mdel')), state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));

  // editor modal
  if (state.editing) {
    const close = () => { state.editing = null; render(); };
    app.querySelectorAll('[data-mclose]').forEach((b) => b.addEventListener('click', close));
    app.querySelector('[data-mclose-bg]')?.addEventListener('click', close);
    app.querySelector('[data-mstop]')?.addEventListener('click', (e) => e.stopPropagation());
    app.querySelector('[data-mfile]')?.addEventListener('change', async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try {
        const r = await api.upload(file, state.token);
        state.editing.image = r.url;
        const prev = app.querySelector('[data-mpreview]');
        if (prev) { const img = document.createElement('img'); img.src = r.url; img.style.cssText = 'width:100%;height:100%;object-fit:cover;'; prev.replaceWith(img); img.setAttribute('data-mpreview',''); }
        flash('อัปโหลดรูปแล้ว');
      } catch (err) { onAuthErr(err); }
    });
    app.querySelector('[data-msave]')?.addEventListener('click', async () => {
      const payload = { ...state.editing };
      app.querySelectorAll('[data-mkey]').forEach((el) => { payload[el.getAttribute('data-mkey')] = el.value; });
      payload.is_active = app.querySelector('[data-mactive]')?.checked ? 1 : 0;
      if (!payload.image) { flash('กรุณาอัปโหลดรูปก่อน'); return; }
      try { await api.saveMenu(payload, state.token); state.editing = null; await loadAll(); flash('บันทึกเมนูแล้ว'); } catch (e) { onAuthErr(e); }
    });
  }
}

function wireGallery() {
  app.querySelector('[data-gfile]')?.addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const r = await api.upload(file, state.token);
      await api.saveGallery({ image: r.url, span: 1, sort: state.gallery.length }, state.token);
      await loadAll(); flash('เพิ่มรูปแล้ว');
    } catch (err) { onAuthErr(err); }
  });
  app.querySelectorAll('[data-gspan]').forEach((b) => b.addEventListener('click', async () => {
    const id = Number(b.getAttribute('data-gspan'));
    const g = state.gallery.find((x) => x.id === id);
    try { await api.saveGallery({ id, span: g.span === 2 ? 1 : 2 }, state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));
  app.querySelectorAll('[data-gtoggle]').forEach((b) => b.addEventListener('click', async () => {
    const id = Number(b.getAttribute('data-gtoggle'));
    const g = state.gallery.find((x) => x.id === id);
    try { await api.saveGallery({ id, is_active: g.is_active ? 0 : 1 }, state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));
  app.querySelectorAll('[data-gdel]').forEach((b) => b.addEventListener('click', async () => {
    if (!confirm('ลบรูปนี้?')) return;
    try { await api.deleteGallery(Number(b.getAttribute('data-gdel')), state.token); await loadAll(); } catch (e) { onAuthErr(e); }
  }));
}

function wireSettings() {
  app.querySelector('[data-ssave]')?.addEventListener('click', async () => {
    const obj = {};
    app.querySelectorAll('[data-skey]').forEach((el) => {
      const path = el.getAttribute('data-skey').split('.');
      let o = obj;
      for (let i = 0; i < path.length - 1; i++) { o[path[i]] = o[path[i]] || {}; o = o[path[i]]; }
      o[path[path.length - 1]] = el.value;
    });
    try { state.settings = await api.saveSettings(obj, state.token); flash('บันทึกการตั้งค่าแล้ว'); } catch (e) { onAuthErr(e); }
  });
}

let rT;
window.addEventListener('resize', () => { state.vw = window.innerWidth; clearTimeout(rT); rT = setTimeout(render, 150); });
render();
if (state.token) loadAll();
