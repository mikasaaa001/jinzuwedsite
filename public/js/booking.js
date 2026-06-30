// Booking page — Jinzi Shabu. Interactive floor plan with live availability
// from the server, table selection, package picker and submit → REST API.
import { TABLES, TABLE_MAP, TIERS, TIME_SLOTS, todayStr, escapeHtml } from './data.js';
import { api } from './api.js';

const STR = {
  th: {
    back:'หน้าแรก', backHome:'กลับหน้าแรก', langSwitch:'EN',
    eyebrow:'Reservation', pageTitle:'จองโต๊ะ & เลือกที่นั่ง',
    pageSub:'เลือกวัน เวลา จำนวนคน แล้วแตะเลือกโต๊ะจากผังร้านได้เลย',
    step1:'เลือกโต๊ะ', step2:'กรอกข้อมูล', step3:'เสร็จสิ้น',
    crTitle:'วัน เวลา และจำนวนคน',
    fDate:'วันที่', fTime:'เวลา', fPax:'จำนวนคน', people:'ท่าน', selectTime:'-- เลือกเวลา --',
    planTitle:'ผังโต๊ะในร้าน', planHint:'แตะโต๊ะสีทองที่ว่างเพื่อเลือก โต๊ะสีแดงคือถูกจองแล้ว',
    zoneOutdoor:'โซนกลางแจ้ง', zoneIndoor:'โซนในร้าน (แอร์)', zonePrivate:'โซนกรุ๊ป / ส่วนตัว', entrance:'ทางเข้า',
    legAvail:'ว่าง', legSel:'ที่เลือก', legOcc:'จองแล้ว', legSmall:'เล็กเกินไป',
    seatWord:'ที่นั่ง', booked:'จองแล้ว', pickTimeFirst:'เลือกเวลาก่อนเพื่อดูที่ว่าง',
    selNoneTitle:'ยังไม่ได้เลือกโต๊ะ', selNoneDetail:'แตะโต๊ะที่ว่างจากผังด้านบน',
    selTitle:'เลือกโต๊ะ', selDetailTpl:'{zone} · นั่งได้ {seats} ท่าน',
    detailsTitle:'ข้อมูลผู้จอง',
    fName:'ชื่อผู้จอง', fPhone:'เบอร์โทรศัพท์', fPkg:'เลือกแพ็กเกจ', fNotes:'หมายเหตุเพิ่มเติม',
    phName:'เช่น สมชาย ใจดี', phPhone:'08X-XXX-XXXX', phNotes:'เช่น ฉลองวันเกิด, ต้องการเก้าอี้เด็ก',
    bookSubmit:'ยืนยันการจอง', bookDisclaimer:'การจองจะสมบูรณ์เมื่อทีมงานยืนยันทางโทรศัพท์',
    errMsg:'กรุณาเลือกโต๊ะ และกรอกชื่อ เบอร์โทร วันและเวลาให้ครบ',
    confirmTitle:'จองสำเร็จแล้ว!', confirmSub:'ขอบคุณที่เลือกจิ้นซึชาบู เราจะติดต่อกลับเพื่อยืนยันโดยเร็ว',
    confirmNote:'กรุณาบันทึกรหัสการจองไว้สำหรับอ้างอิง', bookAgain:'จองอีกครั้ง',
    refLabel:'รหัสการจอง', sumName:'ชื่อ', sumWhen:'วัน-เวลา', sumPax:'จำนวน', sumPkg:'แพ็กเกจ', sumTable:'โต๊ะ', sumZone:'โซน',
    footRights:'© 2026 Jinzi Shabu สงวนลิขสิทธิ์',
    tiers:{ '299':'คลาสสิก','459':'พรีเมียม','699':'ดีลักซ์' },
  },
  en: {
    back:'Home', backHome:'Back to Home', langSwitch:'中文',
    eyebrow:'Reservation', pageTitle:'Reserve & Pick Your Seat',
    pageSub:'Choose date, time and guests, then tap a table on the floor plan.',
    step1:'Pick Table', step2:'Your Details', step3:'Done',
    crTitle:'Date, Time & Guests',
    fDate:'Date', fTime:'Time', fPax:'Guests', people:'guests', selectTime:'-- Select time --',
    planTitle:'Restaurant Floor Plan', planHint:'Tap an available gold table. Red tables are already booked.',
    zoneOutdoor:'Outdoor', zoneIndoor:'Indoor (A/C)', zonePrivate:'Private / Group', entrance:'Entrance',
    legAvail:'Available', legSel:'Selected', legOcc:'Booked', legSmall:'Too small',
    seatWord:'seats', booked:'Booked', pickTimeFirst:'Pick a time first to see availability',
    selNoneTitle:'No table selected', selNoneDetail:'Tap an available table on the plan above',
    selTitle:'Table', selDetailTpl:'{zone} · seats {seats}',
    detailsTitle:'Your Details',
    fName:'Full Name', fPhone:'Phone Number', fPkg:'Select Package', fNotes:'Special Requests',
    phName:'e.g. John Smith', phPhone:'08X-XXX-XXXX', phNotes:'e.g. birthday celebration, need a high chair',
    bookSubmit:'Confirm Reservation', bookDisclaimer:'Your reservation is confirmed once our team calls you back.',
    errMsg:'Please pick a table and complete name, phone, date and time.',
    confirmTitle:'Reservation Received!', confirmSub:'Thank you for choosing Jinzi Shabu. We will contact you shortly to confirm.',
    confirmNote:'Please keep your reference code for follow-up.', bookAgain:'Book Again',
    refLabel:'Reference', sumName:'Name', sumWhen:'Date & Time', sumPax:'Guests', sumPkg:'Package', sumTable:'Table', sumZone:'Zone',
    footRights:'© 2026 Jinzi Shabu. All rights reserved.',
    tiers:{ '299':'Classic','459':'Premium','699':'Deluxe' },
  },
  zh: {
    back:'首页', backHome:'返回首页', langSwitch:'ไทย',
    eyebrow:'预订', pageTitle:'订位 & 选择座位',
    pageSub:'选择日期、时间与人数，然后在平面图上点选餐桌。',
    step1:'选择餐桌', step2:'填写信息', step3:'完成',
    crTitle:'日期、时间与人数',
    fDate:'日期', fTime:'时间', fPax:'人数', people:'位', selectTime:'-- 选择时间 --',
    planTitle:'餐厅平面图', planHint:'点选金色空桌，红色餐桌已被预订。',
    zoneOutdoor:'露天区', zoneIndoor:'店内（空调）', zonePrivate:'团体／包间', entrance:'入口',
    legAvail:'空位', legSel:'已选', legOcc:'已订', legSmall:'座位不足',
    seatWord:'座', booked:'已订', pickTimeFirst:'请先选择时间以查看空位',
    selNoneTitle:'尚未选择餐桌', selNoneDetail:'请在上方平面图点选空桌',
    selTitle:'餐桌', selDetailTpl:'{zone} · 可坐 {seats} 位',
    detailsTitle:'预订人信息',
    fName:'预订人姓名', fPhone:'电话号码', fPkg:'选择套餐', fNotes:'特别要求',
    phName:'例如：张伟', phPhone:'08X-XXX-XXXX', phNotes:'例如：生日庆祝、需要儿童座椅',
    bookSubmit:'确认预订', bookDisclaimer:'预订将在我们团队回电后正式确认。',
    errMsg:'请选择餐桌并填写姓名、电话、日期与时间。',
    confirmTitle:'预订成功！', confirmSub:'感谢您选择金子虾火锅，我们将尽快与您联系确认。',
    confirmNote:'请保留您的预订编号以便查询。', bookAgain:'再次预订',
    refLabel:'预订编号', sumName:'姓名', sumWhen:'日期与时间', sumPax:'人数', sumPkg:'套餐', sumTable:'餐桌', sumZone:'区域',
    footRights:'© 2026 金子虾火锅 版权所有',
    tiers:{ '299':'经典','459':'高级','699':'豪华' },
  },
};

const KANIT = "'Kanit','Noto Sans SC',sans-serif";
const params = new URLSearchParams(location.search);
const state = {
  lang: localStorage.getItem('jinzi_lang') || 'th',
  form: { name:'', phone:'', notes:'', date: todayStr(), time:'', pax:2,
    package: ['299','459','699'].includes(params.get('pkg')) ? params.get('pkg') : '459' },
  table: null,
  occupied: new Set(),
  errors: {},
  confirmed: false,
  bookingRef: '',
  submitError: '',
  submitting: false,
};
const app = document.getElementById('app');

function zoneName(t, zone) {
  return { outdoor: t.zoneOutdoor, indoor: t.zoneIndoor, private: t.zonePrivate }[zone];
}

async function refreshAvailability() {
  const { date, time } = state.form;
  if (!date || !time) { state.occupied = new Set(); revalidateTable(); render(); return; }
  try {
    const r = await api.availability(date, time);
    state.occupied = new Set(r.occupied || []);
  } catch (e) { state.occupied = new Set(); }
  revalidateTable();
  render();
}
function revalidateTable() {
  if (!state.table) return;
  const tb = TABLE_MAP[state.table];
  if (!tb || state.occupied.has(tb.id) || tb.seats < state.form.pax) state.table = null;
}

function render() {
  const t = STR[state.lang];
  const f = state.form;
  const errs = state.errors;
  const sel = state.table;
  const curStep = state.confirmed ? 3 : (sel ? 2 : 1);

  const steps = [t.step1, t.step2, t.step3].map((label, i) => {
    const active = (i + 1) <= curStep;
    const arrow = i < 2 ? `<span style="color:rgba(251,233,200,.5); font-size:14px;">→</span>` : '';
    return `<div style="display:flex; align-items:center; gap:6px;">
      <div style="display:flex; align-items:center; gap:8px; padding:8px 16px; border-radius:999px; background:${active?'rgba(243,213,138,.18)':'rgba(0,0,0,.18)'}; border:1px solid ${active?'rgba(243,213,138,.5)':'rgba(214,169,76,.2)'};">
        <span style="width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:${KANIT}; font-weight:700; font-size:13px; background:${active?'linear-gradient(180deg,#F3D58A,#C9952F)':'rgba(255,255,255,.15)'}; color:${active?'#7a0a16':'#E7B7A0'};">${i+1}</span>
        <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:${active?'#fff':'rgba(231,183,160,.8)'};">${escapeHtml(label)}</span>
      </div>${arrow}</div>`;
  }).join('');

  const timeOpts = `<option value="">${escapeHtml(t.selectTime)}</option>` +
    TIME_SLOTS.map((ts) => `<option value="${ts}" ${f.time===ts?'selected':''}>${ts}</option>`).join('');

  const noTime = !f.time;
  const tableEls = TABLES.map((tb) => {
    const isOcc = state.occupied.has(tb.id);
    const tooSmall = tb.seats < f.pax;
    const isSel = sel === tb.id;
    const disabled = isOcc || tooSmall || noTime;
    let bg, bd, fg, ring = false;
    if (isSel) { bg = 'linear-gradient(180deg,#F3D58A,#C9952F)'; bd = '#7a0a16'; fg = '#7a0a16'; ring = true; }
    else if (isOcc) { bg = '#ecc7c7'; bd = '#cf9a9a'; fg = '#9c4a4a'; }
    else if (tooSmall) { bg = '#ece1cd'; bd = '#d9c39a'; fg = '#b3a07e'; }
    else { bg = '#fff8ea'; bd = '#C9952F'; fg = '#7a0a16'; }
    const radius = tb.shape === 'round' ? '50%' : '13px';
    const sub = isOcc ? t.booked : (tb.seats + ' ' + t.seatWord);
    return `<button ${disabled?'disabled':`data-table="${tb.id}"`} title="${tb.id} · ${tb.seats} ${t.seatWord}"
      style="position:absolute; left:${tb.x}%; top:${tb.y}%; width:${tb.w}%; height:${tb.h}%;
      border-radius:${radius}; border:2px solid ${bd}; background:${bg}; cursor:${disabled?'not-allowed':'pointer'};
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; padding:0; line-height:1.05;
      transition:transform .12s, box-shadow .12s; box-shadow:${isSel?'0 7px 20px rgba(201,149,47,.5)':'0 2px 6px rgba(122,10,22,.12)'};
      animation:${ring?'jzPulse 1.6s ease-in-out infinite':'none'}; opacity:${tooSmall?0.75:(noTime&&!isOcc?0.92:1)};">
      <span style="font-family:${KANIT}; font-weight:700; font-size:clamp(10px,1.5vw,15px); color:${fg};">${tb.id}</span>
      <span style="font-size:clamp(8px,1.1vw,11px); color:${fg}; opacity:.85;">${escapeHtml(sub)}</span>
    </button>`;
  }).join('');

  const legend = [
    { label:t.legAvail, bg:'#fff8ea', bd:'#C9952F' },
    { label:t.legSel,   bg:'linear-gradient(180deg,#F3D58A,#C9952F)', bd:'#7a0a16' },
    { label:t.legOcc,   bg:'#ecc7c7', bd:'#cf9a9a' },
    { label:t.legSmall, bg:'#ece1cd', bd:'#d9c39a' },
  ].map((lg) => `<div style="display:flex; align-items:center; gap:7px;">
      <span style="width:16px; height:16px; border-radius:5px; background:${lg.bg}; border:2px solid ${lg.bd};"></span>
      <span style="font-size:13px; color:#5a3a2c;">${escapeHtml(lg.label)}</span></div>`).join('');

  const selTb = sel ? TABLE_MAP[sel] : null;
  const selBox = selTb
    ? { bg:'#fff6e2', bd:'#C9952F', fg:'#7a0a16', icon:'🪑', title: t.selTitle + ' ' + selTb.id,
        detail: t.selDetailTpl.replace('{zone}', zoneName(t, selTb.zone)).replace('{seats}', selTb.seats) }
    : { bg:'#FCF4E6', bd:'#e6d2ac', fg:'#9a6a52', icon:'👆',
        title: noTime ? t.pickTimeFirst : t.selNoneTitle, detail: noTime ? '' : t.selNoneDetail };

  const pkgChoices = ['299','459','699'].map((p) => {
    const s = f.package === p;
    return `<button data-pkg="${p}" type="button" style="cursor:pointer; padding:14px 12px; border-radius:13px; border:2px solid ${s?'#C41230':'#e0c79a'}; background:${s?'#fff1f1':'#FCF8EF'}; text-align:center;">
      <div style="font-family:${KANIT}; font-weight:800; font-size:24px; color:${s?'#C41230':'#7a0a16'};">${p}฿</div>
      <div style="font-size:13px; color:${s?'#C41230':'#9a6a52'};">${escapeHtml(TIERS[p][state.lang])}</div></button>`;
  }).join('');

  const bdc = (k) => errs[k] ? '#e05151' : '#e0c79a';
  const hasError = !!(errs.name || errs.phone || errs.date || errs.time || errs.table);
  const errBox = (hasError || state.submitError) ? `
    <div style="margin-top:16px; padding:12px 16px; background:#fdecec; border:1px solid #f3b4b4; border-radius:11px; color:#b21f1f; font-size:14px;">${escapeHtml(state.submitError || t.errMsg)}</div>` : '';

  const confirmRows = (() => {
    const cTb = state.table ? TABLE_MAP[state.table] : null;
    return [
      { k:t.refLabel, v:state.bookingRef, color:'#C41230' },
      { k:t.sumName,  v:f.name, color:'#3a2218' },
      { k:t.sumWhen,  v:(f.date + '  ' + f.time), color:'#3a2218' },
      { k:t.sumPax,   v:(f.pax + ' ' + t.people), color:'#3a2218' },
      { k:t.sumPkg,   v:(f.package + '฿ · ' + t.tiers[f.package]), color:'#3a2218' },
      { k:t.sumTable, v:(cTb ? cTb.id : '-'), color:'#C41230' },
      { k:t.sumZone,  v:(cTb ? zoneName(t, cTb.zone) : '-'), color:'#3a2218' },
    ].map((r, i, arr) => `<div style="display:flex; justify-content:space-between; gap:12px; padding:9px 0; border-bottom:1px dashed ${i===arr.length-1?'transparent':'#d8c39a'};">
        <span style="color:#9a6a52; font-size:15px;">${escapeHtml(r.k)}</span>
        <span style="font-family:${KANIT}; font-weight:700; color:${r.color}; font-size:15px; text-align:right;">${escapeHtml(r.v)}</span></div>`).join('');
  })();

  const header = `
  <header style="position:sticky; top:0; z-index:60; background:rgba(140,11,27,.96); backdrop-filter:blur(8px); border-bottom:1px solid rgba(214,169,76,.45);">
    <div style="max-width:1080px; margin:0 auto; padding:10px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
      <a href="/" style="display:flex; align-items:center; gap:11px; text-decoration:none;">
        <img src="images/logo.jpg" alt="Jinzi Shabu" style="width:46px; height:46px; border-radius:50%; object-fit:cover; border:2px solid #D6A94C;">
        <span style="display:flex; flex-direction:column; line-height:1;">
          <span style="font-family:${KANIT}; font-weight:800; letter-spacing:3px; color:#F3D58A; font-size:19px;">JINZI</span>
          <span style="font-family:${KANIT}; font-weight:500; letter-spacing:5px; color:#E7B7A0; font-size:10px;">SHABU</span>
        </span>
      </a>
      <div style="display:flex; align-items:center; gap:10px;">
        <a href="/" style="text-decoration:none; display:inline-flex; align-items:center; gap:7px; color:#FBE9C8; font-weight:500; font-size:15px; padding:8px 14px; border:1px solid rgba(214,169,76,.5); border-radius:999px;">‹ ${escapeHtml(t.back)}</a>
        <button data-lang style="cursor:pointer; background:transparent; border:1px solid rgba(214,169,76,.6); color:#F3D58A; font-family:${KANIT}; font-weight:600; font-size:13px; padding:8px 13px; border-radius:999px;">${escapeHtml(t.langSwitch)}</button>
      </div>
    </div>
  </header>`;

  const title = `
  <section style="background:linear-gradient(160deg,#9E0B1B,#7a0a16); padding:clamp(34px,6vw,56px) 24px clamp(48px,7vw,72px);">
    <div style="max-width:1080px; margin:0 auto; text-align:center;">
      <div style="color:#E8C77A; font-family:${KANIT}; font-weight:600; letter-spacing:3px; font-size:14px; text-transform:uppercase;">${escapeHtml(t.eyebrow)}</div>
      <h1 style="margin:8px 0 0; font-family:${KANIT}; font-weight:800; font-size:clamp(28px,5vw,46px); color:#fff;">${escapeHtml(t.pageTitle)}</h1>
      <p style="margin:12px auto 0; max-width:560px; color:#FBE9C8; font-size:17px;">${escapeHtml(t.pageSub)}</p>
      <div style="display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:6px; margin-top:26px;">${steps}</div>
    </div>
  </section>`;

  const footer = `
  <footer style="background:#1c060a; padding:34px 24px;">
    <div style="max-width:1080px; margin:0 auto; display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="images/logo.jpg" alt="Jinzi Shabu" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid #D6A94C;">
        <div style="font-family:${KANIT}; font-weight:800; letter-spacing:2px; color:#F3D58A; font-size:16px;">JINZI SHABU</div>
      </div>
      <div style="color:#8a5a4a; font-size:13px;">${escapeHtml(t.footRights)}</div>
    </div>
  </footer>`;

  const confirmView = `
    <div style="background:#fff; border-radius:22px; padding:clamp(28px,5vw,52px); text-align:center; box-shadow:0 24px 60px rgba(122,10,22,.22); border:2px solid #D6A94C; animation:jzFadeUp .4s ease;">
      <div style="width:88px; height:88px; margin:0 auto 18px; border-radius:50%; background:linear-gradient(135deg,#1F8A5B,#15633f); display:flex; align-items:center; justify-content:center; font-size:44px; color:#fff;">✓</div>
      <h2 style="margin:0; font-family:${KANIT}; font-weight:800; font-size:30px; color:#7a0a16;">${escapeHtml(t.confirmTitle)}</h2>
      <p style="margin:8px 0 0; color:#7a4a3a; font-size:16px;">${escapeHtml(t.confirmSub)}</p>
      <div style="margin:24px auto 0; max-width:460px; text-align:left; background:#FCF4E6; border-radius:16px; padding:22px 24px; border:1px solid #ecd9b4;">${confirmRows}</div>
      <p style="margin:18px 0 0; color:#9a6a52; font-size:14px;">${escapeHtml(t.confirmNote)}</p>
      <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:24px;">
        <button data-again style="cursor:pointer; background:transparent; border:1px solid #C41230; color:#C41230; font-family:${KANIT}; font-weight:600; font-size:16px; padding:13px 28px; border-radius:999px;">${escapeHtml(t.bookAgain)}</button>
        <a href="/" style="text-decoration:none; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:16px; padding:13px 30px; border-radius:999px;">${escapeHtml(t.backHome)}</a>
      </div>
    </div>`;

  const formView = `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <div style="background:#fff; border-radius:20px; padding:clamp(20px,3vw,30px); box-shadow:0 14px 36px rgba(122,10,22,.12); border:1px solid #f0dcb6;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
          <span style="width:30px; height:30px; border-radius:50%; background:#C41230; color:#fff; display:flex; align-items:center; justify-content:center; font-family:${KANIT}; font-weight:700; font-size:15px;">1</span>
          <h3 style="margin:0; font-family:${KANIT}; font-weight:700; font-size:19px; color:#7a0a16;">${escapeHtml(t.crTitle)}</h3>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; align-items:end;">
          <label style="display:flex; flex-direction:column; gap:7px;">
            <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fDate)}</span>
            <input data-date type="date" value="${f.date}" min="${todayStr()}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:16px; padding:12px 14px; border-radius:11px; border:1.5px solid ${bdc('date')}; background:#FCF8EF; outline:none; color:#2A0A0E;">
          </label>
          <label style="display:flex; flex-direction:column; gap:7px;">
            <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fTime)}</span>
            <select data-time style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:16px; padding:13px 14px; border-radius:11px; border:1.5px solid ${bdc('time')}; background:#FCF8EF; outline:none; color:#2A0A0E;">${timeOpts}</select>
          </label>
          <div style="display:flex; flex-direction:column; gap:7px;">
            <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fPax)}</span>
            <div style="display:flex; align-items:center; gap:10px;">
              <button data-dec type="button" style="cursor:pointer; width:44px; height:46px; border-radius:11px; border:1.5px solid #e0c79a; background:#FCF8EF; font-size:22px; color:#C41230; font-weight:700; line-height:1;">−</button>
              <div style="flex:1; text-align:center; font-family:${KANIT}; font-weight:700; font-size:20px; color:#7a0a16;">${f.pax} <span style="font-size:13px; font-weight:500; color:#9a6a52;">${escapeHtml(t.people)}</span></div>
              <button data-inc type="button" style="cursor:pointer; width:44px; height:46px; border-radius:11px; border:1.5px solid #e0c79a; background:#FCF8EF; font-size:22px; color:#C41230; font-weight:700; line-height:1;">+</button>
            </div>
          </div>
        </div>
      </div>

      <div style="background:#fff; border-radius:20px; padding:clamp(20px,3vw,30px); box-shadow:0 14px 36px rgba(122,10,22,.12); border:1px solid #f0dcb6;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
          <span style="width:30px; height:30px; border-radius:50%; background:#C41230; color:#fff; display:flex; align-items:center; justify-content:center; font-family:${KANIT}; font-weight:700; font-size:15px;">2</span>
          <h3 style="margin:0; font-family:${KANIT}; font-weight:700; font-size:19px; color:#7a0a16;">${escapeHtml(t.planTitle)}</h3>
        </div>
        <p style="margin:0 0 16px 40px; color:#9a6a52; font-size:14px;">${escapeHtml(t.planHint)}</p>
        <div style="display:flex; flex-wrap:wrap; gap:14px; margin-bottom:16px;">${legend}</div>
        <div style="position:relative; width:100%; aspect-ratio:1000/700; background:repeating-linear-gradient(45deg,#fbf1dd,#fbf1dd 22px,#f7ebd2 22px,#f7ebd2 44px); border:2px solid #e3cda0; border-radius:16px; overflow:hidden;">
          <div style="position:absolute; left:1.5%; top:3%; width:97%; height:25%; background:rgba(31,138,91,.09); border:1.6px dashed rgba(31,138,91,.45); border-radius:13px;"></div>
          <div style="position:absolute; left:1.5%; top:31%; width:97%; height:38%; background:rgba(214,169,76,.12); border:1.6px dashed rgba(201,149,47,.55); border-radius:13px;"></div>
          <div style="position:absolute; left:1.5%; top:71.5%; width:97%; height:25%; background:rgba(196,18,48,.07); border:1.6px dashed rgba(196,18,48,.4); border-radius:13px;"></div>
          <div style="position:absolute; left:3%; top:4.5%; display:flex; align-items:center; gap:6px; background:rgba(31,138,91,.92); color:#fff; padding:4px 11px; border-radius:999px; font-family:${KANIT}; font-weight:600; font-size:12px;">🏮 ${escapeHtml(t.zoneOutdoor)}</div>
          <div style="position:absolute; left:3%; top:32.5%; display:flex; align-items:center; gap:6px; background:rgba(201,149,47,.95); color:#fff; padding:4px 11px; border-radius:999px; font-family:${KANIT}; font-weight:600; font-size:12px;">❄️ ${escapeHtml(t.zoneIndoor)}</div>
          <div style="position:absolute; left:3%; top:73%; display:flex; align-items:center; gap:6px; background:rgba(196,18,48,.92); color:#fff; padding:4px 11px; border-radius:999px; font-family:${KANIT}; font-weight:600; font-size:12px;">👥 ${escapeHtml(t.zonePrivate)}</div>
          <div style="position:absolute; left:50%; bottom:-1px; transform:translateX(-50%); background:#7a0a16; color:#F3D58A; padding:4px 16px; border-radius:8px 8px 0 0; font-family:${KANIT}; font-weight:600; font-size:12px;">🚪 ${escapeHtml(t.entrance)}</div>
          ${tableEls}
        </div>
        <div style="margin-top:18px; padding:16px 20px; border-radius:14px; background:${selBox.bg}; border:1.5px solid ${selBox.bd}; display:flex; align-items:center; gap:14px;">
          <span style="font-size:26px;">${selBox.icon}</span>
          <div>
            <div style="font-family:${KANIT}; font-weight:700; font-size:17px; color:${selBox.fg};">${escapeHtml(selBox.title)}</div>
            <div style="font-size:14px; color:#7a4a3a;">${escapeHtml(selBox.detail)}</div>
          </div>
        </div>
      </div>

      <div style="background:#fff; border-radius:20px; padding:clamp(20px,3vw,30px); box-shadow:0 14px 36px rgba(122,10,22,.12); border:1px solid #f0dcb6;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
          <span style="width:30px; height:30px; border-radius:50%; background:#C41230; color:#fff; display:flex; align-items:center; justify-content:center; font-family:${KANIT}; font-weight:700; font-size:15px;">3</span>
          <h3 style="margin:0; font-family:${KANIT}; font-weight:700; font-size:19px; color:#7a0a16;">${escapeHtml(t.detailsTitle)}</h3>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px;">
          <label style="display:flex; flex-direction:column; gap:7px;">
            <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fName)}</span>
            <input data-name value="${escapeHtml(f.name)}" placeholder="${escapeHtml(t.phName)}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:16px; padding:13px 14px; border-radius:11px; border:1.5px solid ${bdc('name')}; background:#FCF8EF; outline:none; color:#2A0A0E;">
          </label>
          <label style="display:flex; flex-direction:column; gap:7px;">
            <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fPhone)}</span>
            <input data-phone value="${escapeHtml(f.phone)}" inputmode="tel" placeholder="${escapeHtml(t.phPhone)}" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:16px; padding:13px 14px; border-radius:11px; border:1.5px solid ${bdc('phone')}; background:#FCF8EF; outline:none; color:#2A0A0E;">
          </label>
        </div>
        <div style="margin-top:20px;">
          <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fPkg)}</span>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-top:9px;">${pkgChoices}</div>
        </div>
        <label style="display:flex; flex-direction:column; gap:7px; margin-top:20px;">
          <span style="font-family:${KANIT}; font-weight:600; font-size:14px; color:#7a0a16;">${escapeHtml(t.fNotes)}</span>
          <textarea data-notes placeholder="${escapeHtml(t.phNotes)}" rows="3" style="font-family:'Sarabun','Noto Sans SC',sans-serif; font-size:16px; padding:13px 14px; border-radius:11px; border:1.5px solid #e0c79a; background:#FCF8EF; outline:none; resize:vertical; color:#2A0A0E;">${escapeHtml(f.notes)}</textarea>
        </label>
        ${errBox}
        <button data-submit ${state.submitting?'disabled':''} style="cursor:${state.submitting?'wait':'pointer'}; width:100%; margin-top:22px; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; border:none; font-family:${KANIT}; font-weight:700; font-size:19px; padding:17px; border-radius:999px; box-shadow:0 8px 22px rgba(0,0,0,.18); opacity:${state.submitting?0.7:1};">${escapeHtml(t.bookSubmit)}</button>
        <p style="text-align:center; margin:14px 0 0; color:#9a6a52; font-size:13px;">${escapeHtml(t.bookDisclaimer)}</p>
      </div>
    </div>`;

  app.innerHTML = `${header}${title}
    <div style="max-width:1080px; margin:-32px auto 0; padding:0 20px clamp(60px,9vw,100px);">
      ${state.confirmed ? confirmView : formView}
    </div>${footer}`;

  wire();
}

function wire() {
  app.querySelector('[data-lang]')?.addEventListener('click', () => {
    const order = ['th','en','zh'];
    state.lang = order[(order.indexOf(state.lang) + 1) % 3];
    localStorage.setItem('jinzi_lang', state.lang);
    render();
  });
  app.querySelector('[data-name]')?.addEventListener('input', (e) => { state.form.name = e.target.value; state.errors.name = false; });
  app.querySelector('[data-phone]')?.addEventListener('input', (e) => { state.form.phone = e.target.value; state.errors.phone = false; });
  app.querySelector('[data-notes]')?.addEventListener('input', (e) => { state.form.notes = e.target.value; });
  app.querySelector('[data-date]')?.addEventListener('change', (e) => { state.form.date = e.target.value; state.errors.date = false; refreshAvailability(); });
  app.querySelector('[data-time]')?.addEventListener('change', (e) => { state.form.time = e.target.value; state.errors.time = false; refreshAvailability(); });
  app.querySelector('[data-inc]')?.addEventListener('click', () => { state.form.pax = Math.min(12, state.form.pax + 1); revalidateTable(); render(); });
  app.querySelector('[data-dec]')?.addEventListener('click', () => { state.form.pax = Math.max(1, state.form.pax - 1); revalidateTable(); render(); });
  app.querySelectorAll('[data-pkg]').forEach((b) => b.addEventListener('click', () => { state.form.package = b.getAttribute('data-pkg'); render(); }));
  app.querySelectorAll('[data-table]').forEach((b) => b.addEventListener('click', () => { state.table = b.getAttribute('data-table'); state.errors.table = false; render(); }));
  app.querySelector('[data-submit]')?.addEventListener('click', submit);
  app.querySelector('[data-again]')?.addEventListener('click', () => {
    state.confirmed = false; state.bookingRef = ''; state.errors = {}; state.table = null; state.submitError = '';
    state.form = { name:'', phone:'', notes:'', date: todayStr(), time:'', pax:2, package:'459' };
    state.occupied = new Set();
    render();
  });
}

async function submit() {
  const f = state.form;
  const errors = {};
  if (!f.name.trim()) errors.name = true;
  if (f.phone.replace(/\D/g, '').length < 9) errors.phone = true;
  if (!f.date) errors.date = true;
  if (!f.time) errors.time = true;
  if (!state.table) errors.table = true;
  state.errors = errors;
  state.submitError = '';
  if (Object.keys(errors).length) { render(); return; }

  state.submitting = true; render();
  try {
    const booking = await api.createBooking({
      name: f.name, phone: f.phone, booking_date: f.date, booking_time: f.time,
      party_size: f.pax, table_id: state.table, package: f.package, notes: f.notes, lang: state.lang,
    });
    state.confirmed = true;
    state.bookingRef = booking.ref;
    state.submitting = false;
    render();
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
  } catch (err) {
    state.submitting = false;
    state.submitError = err.message || 'จองไม่สำเร็จ กรุณาลองใหม่';
    refreshAvailability();
  }
}

let rT;
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(render, 120); });
render();
