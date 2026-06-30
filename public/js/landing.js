// Landing page — Jinzi Shabu. Marketing site with TH/EN/ZH, promo popup,
// gallery lightbox, lanterns. Menu / gallery / editable text come from the CMS API.
import { PACKAGES, escapeHtml } from './data.js';
import { api } from './api.js';

const STR = {
  th: {
    navPackages:'แพ็กเกจ', navMenu:'เมนู', navGallery:'บรรยากาศ', navContact:'ติดต่อ', navBook:'จองโต๊ะ', langSwitch:'EN',
    heroBadge:'บุฟเฟต์ชาบู สั่งได้ไม่อั้น', heroTitle:'อิ่มไม่อั้น', heroTitleAccent:'ชาบูจิ้นซึ',
    heroSub:'ชาบู ซีฟู้ด แซลมอน และค็อกเทล สดใหม่ทุกวัน ในบรรยากาศจีนมงคลสุดอบอุ่น เริ่มต้นเพียง 299 บาท',
    heroCtaBook:'จองโต๊ะเลย', heroCtaMenu:'ดูเมนู',
    pkgEyebrow:'Packages', pkgTitle:'เลือกแพ็กเกจของคุณ', pkgSub:'ทุกแพ็กเกจสั่งได้ไม่อั้น เลือกระดับความฟินที่ใช่สำหรับคุณ',
    pkgPerPerson:'ต่อท่าน', pkgPopular:'ยอดนิยม', pkgChoose:'เลือกแพ็กเกจนี้',
    pkgFootnote:'*ราคายังไม่รวมเครื่องดื่ม / เด็กสูงไม่เกิน 90 ซม. ทานฟรี',
    menuEyebrow:'Menu', menuTitle:'วัตถุดิบสดทุกวัน', menuSub:'เนื้อ ซีฟู้ด ผัก ของหวาน และน้ำจิ้มรสเด็ด — ทุกอย่างสั่งได้ไม่อั้น',
    galEyebrow:'Gallery', galTitle:'บรรยากาศร้าน', galSub:'มุมจีนมงคล โคมแดง อบอุ่น เหมาะกับทุกโอกาสพิเศษ',
    contactEyebrow:'Contact', contactTitle:'มาเยือนเราได้เลย',
    cAddress:'ที่อยู่ร้าน', cAddressVal:'จิ้นซึชาบู — ดูพิกัดและสาขาได้ที่เพจเฟซบุ๊กของเรา',
    cHours:'เวลาเปิดบริการ', cHoursVal:'ทุกวัน 11:00 – 22:00 น. (รับลูกค้าเข้าครั้งสุดท้าย 21:00 น.)',
    cPhone:'โทรสอบถาม / จอง', cPhoneVal:'โทร. 0XX-XXX-XXXX', cFollow:'ติดตามเพจ Facebook',
    footTagline:'ชาบูบุฟเฟต์ สั่งได้ไม่อั้น', footRights:'© 2026 Jinzi Shabu สงวนลิขสิทธิ์', staffLogin:'สำหรับพนักงาน',
    promoBadge:'โปรโมชั่นพิเศษ', promoTitle:'สั่งได้ไม่อั้น เริ่ม 299฿', promoSub:'ชาบู ซีฟู้ด แซลมอน จัดเต็มทุกวัน — จองโต๊ะวันนี้รับสิทธิ์ก่อนใคร', promoCta:'จองโต๊ะเลย',
    chips:['เริ่มต้น','+ ซีฟู้ด','จัดเต็ม'], feats:['วัตถุดิบสดใหม่ทุกวัน','สั่งได้ไม่อั้น','ค็อกเทลพิเศษ'],
  },
  en: {
    navPackages:'Packages', navMenu:'Menu', navGallery:'Gallery', navContact:'Contact', navBook:'Reserve', langSwitch:'中文',
    heroBadge:'All-You-Can-Eat Shabu Buffet', heroTitle:'Eat Unlimited', heroTitleAccent:'at Jinzi Shabu',
    heroSub:'Fresh shabu, seafood, salmon and cocktails every day in a warm, festive Chinese atmosphere — starting at just 299 THB.',
    heroCtaBook:'Reserve a Table', heroCtaMenu:'View Menu',
    pkgEyebrow:'Packages', pkgTitle:'Choose Your Package', pkgSub:'Every package is all-you-can-eat. Pick the level that suits your appetite.',
    pkgPerPerson:'per person', pkgPopular:'Popular', pkgChoose:'Choose This',
    pkgFootnote:'*Prices exclude drinks. Kids under 90 cm eat free.',
    menuEyebrow:'Menu', menuTitle:'Fresh Every Day', menuSub:'Meats, seafood, vegetables, desserts and signature sauces — all unlimited.',
    galEyebrow:'Gallery', galTitle:'Our Atmosphere', galSub:'Festive lanterns and a warm Chinese setting for every special occasion.',
    contactEyebrow:'Contact', contactTitle:'Come Visit Us',
    cAddress:'Address', cAddressVal:'Jinzi Shabu — find our exact location and branches on our Facebook page.',
    cHours:'Opening Hours', cHoursVal:'Daily 11:00 – 22:00 (last seating 21:00)',
    cPhone:'Call / Reserve', cPhoneVal:'Tel. 0XX-XXX-XXXX', cFollow:'Follow on Facebook',
    footTagline:'All-you-can-eat shabu buffet', footRights:'© 2026 Jinzi Shabu. All rights reserved.', staffLogin:'Staff Login',
    promoBadge:'Special Offer', promoTitle:'All-You-Can-Eat from 299฿', promoSub:'Shabu, seafood & salmon loaded daily — reserve today to secure your table.', promoCta:'Reserve Now',
    chips:['Classic','+ Seafood','Deluxe'], feats:['Fresh ingredients daily','All you can eat','Signature cocktails'],
  },
  zh: {
    navPackages:'套餐', navMenu:'菜单', navGallery:'店内环境', navContact:'联系我们', navBook:'订位', langSwitch:'ไทย',
    heroBadge:'放题火锅自助餐', heroTitle:'吃到饱', heroTitleAccent:'金子虾火锅',
    heroSub:'每日新鲜的火锅、海鲜、三文鱼与鸡尾酒，置身喜庆的中式氛围，仅需 299 泰铢起。',
    heroCtaBook:'立即订位', heroCtaMenu:'查看菜单',
    pkgEyebrow:'套餐', pkgTitle:'选择您的套餐', pkgSub:'每款套餐皆可无限畅吃，选择最适合您的丰盛程度。',
    pkgPerPerson:'每位', pkgPopular:'热门', pkgChoose:'选择此套餐',
    pkgFootnote:'*价格不含饮料。身高90厘米以下儿童免费。',
    menuEyebrow:'菜单', menuTitle:'每日新鲜', menuSub:'肉类、海鲜、蔬菜、甜点与招牌酱料——全部无限畅吃。',
    galEyebrow:'相册', galTitle:'店内环境', galSub:'喜庆的红灯笼与温馨的中式布置，适合各种特别场合。',
    contactEyebrow:'联系', contactTitle:'欢迎光临',
    cAddress:'地址', cAddressVal:'金子虾火锅——请在我们的 Facebook 专页查看具体位置与分店。',
    cHours:'营业时间', cHoursVal:'每天 11:00 – 22:00（最后入座 21:00）',
    cPhone:'电话／预订', cPhoneVal:'电话 0XX-XXX-XXXX', cFollow:'关注 Facebook',
    footTagline:'火锅自助餐 无限畅吃', footRights:'© 2026 金子虾火锅 版权所有', staffLogin:'员工登录',
    promoBadge:'特别优惠', promoTitle:'无限畅吃 299泰铢起', promoSub:'火锅、海鲜、三文鱼每日丰盛供应——立即订位，抢先享有。', promoCta:'立即订位',
    chips:['经典','+ 海鲜','豪华'], feats:['每日新鲜食材','无限畅吃','招牌鸡尾酒'],
  },
};

const KANIT = "'Kanit','Noto Sans SC',sans-serif";
const state = {
  lang: localStorage.getItem('jinzi_lang') || 'th',
  mobileOpen: false,
  promoOpen: false,
  lightbox: null,
  menu: [],        // from CMS
  gallery: [],     // from CMS
  settings: null,  // from CMS
};
const app = document.getElementById('app');

function gold(text, size) {
  return `<span style="font-family:${KANIT}; font-weight:800; font-size:${size}; background:linear-gradient(180deg,#F8E2A8,#C9952F); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;">${text}</span>`;
}

// Merge editable CMS settings over the built-in language strings.
function localize() {
  const t = { ...STR[state.lang] };
  const s = state.settings;
  const lang = state.lang;
  if (s) {
    const pick = (o) => (o && (o[lang] || o.th)) || '';
    if (s.hero) {
      if (pick(s.hero.title))  t.heroTitle = pick(s.hero.title);
      if (pick(s.hero.accent)) t.heroTitleAccent = pick(s.hero.accent);
      if (pick(s.hero.sub))    t.heroSub = pick(s.hero.sub);
    }
    if (s.promo) {
      if (pick(s.promo.title)) t.promoTitle = pick(s.promo.title);
      if (pick(s.promo.sub))   t.promoSub = pick(s.promo.sub);
    }
    if (s.contact) {
      if (s.contact.phone)      t.cPhoneVal = s.contact.phone;
      if (pick(s.contact.address)) t.cAddressVal = pick(s.contact.address);
      if (pick(s.contact.hours))   t.cHoursVal = pick(s.contact.hours);
      t._facebook = s.contact.facebook || '';
      t._mapsQuery = s.contact.mapsQuery || 'Jinzi Shabu';
    }
  }
  t._facebook = t._facebook || 'https://www.facebook.com/';
  t._mapsQuery = t._mapsQuery || 'Jinzi Shabu';
  return t;
}

function render() {
  const t = localize();
  const lang = state.lang;
  const isMobile = window.innerWidth < 880;

  const priceVals = ['299฿','459฿','699฿'];
  const priceChips = priceVals.map((p, i) => `
    <div style="display:flex; flex-direction:column; align-items:center; min-width:120px; padding:16px 22px; border:1px solid rgba(214,169,76,.5); border-radius:16px; background:rgba(0,0,0,.3);">
      ${gold(p, '34px')}
      <span style="color:#FBE9C8; font-size:13px; margin-top:2px;">${escapeHtml(t.chips[i])}</span>
    </div>`).join('');

  const features = ['🦐','♾️','🍸'].map((ic, i) => `
    <div style="display:flex; align-items:center; gap:10px; color:#FBE9C8; font-size:15px;">
      <span style="color:#E8C77A; font-size:18px;">${ic}</span><span>${escapeHtml(t.feats[i])}</span>
    </div>`).join('');

  const lanterns = [0,1,2,3,4,5].map(() => `
    <div style="display:flex; flex-direction:column; align-items:center; transform-origin:top center; animation:jzSway 4s ease-in-out infinite;">
      <div style="width:1px; height:34px; background:linear-gradient(#D6A94C,rgba(214,169,76,.2));"></div>
      <div style="width:22px; height:28px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #ff6a52, #C41230 70%); border:1px solid #E8C77A; box-shadow:0 0 14px rgba(255,90,60,.6);"></div>
      <div style="width:2px; height:10px; background:#E8C77A;"></div>
    </div>`).join('');

  const pkgCards = PACKAGES.map((p) => {
    const border = p.popular ? '#C9952F' : '#f0dcb6';
    const popular = p.popular ? `<div style="position:absolute; top:16px; right:-34px; transform:rotate(45deg); background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:12px; padding:5px 40px;">${escapeHtml(t.pkgPopular)}</div>` : '';
    const includes = p.includes[lang].map((inc) => `
      <li style="display:flex; align-items:flex-start; gap:10px; color:#3a2218; font-size:15px;">
        <span style="color:#C9952F; font-size:13px; margin-top:3px;">◆</span><span>${escapeHtml(inc)}</span></li>`).join('');
    return `
    <div style="position:relative; display:flex; flex-direction:column; background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 16px 40px rgba(122,10,22,.14); border:2px solid ${border};">
      ${popular}
      <div style="background:linear-gradient(135deg,#9E0B1B,#C41230); padding:26px 24px 22px; text-align:center;">
        <div style="color:#F3D58A; font-family:${KANIT}; font-weight:600; letter-spacing:2px; font-size:14px;">${escapeHtml(p.tier[lang])}</div>
        <div style="display:flex; align-items:baseline; justify-content:center; gap:4px; margin-top:6px;">
          <span style="font-family:${KANIT}; font-weight:800; font-size:54px; color:#fff;">${p.price}</span>
          <span style="color:#F3D58A; font-size:22px;">฿</span><span style="color:#F3D58A; font-size:22px;">+</span>
        </div>
        <div style="color:#FBE9C8; font-size:13px;">${escapeHtml(t.pkgPerPerson)}</div>
      </div>
      <div style="padding:22px 24px; flex:1;">
        <ul style="list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:11px;">${includes}</ul>
      </div>
      <div style="padding:0 24px 26px;">
        <button data-pkg="${p.price}" style="cursor:pointer; width:100%; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; border:none; font-family:${KANIT}; font-weight:700; font-size:16px; padding:14px; border-radius:999px;">${escapeHtml(t.pkgChoose)}</button>
      </div>
    </div>`;
  }).join('');

  const menuItems = state.menu.map((m) => {
    const name = m['name_' + lang] || m.name_th || '';
    const sub = m['sub_' + lang] || m.sub_th || '';
    return `
    <button data-light="${escapeHtml(m.image)}" style="cursor:pointer; text-align:left; padding:0; border:1px solid rgba(214,169,76,.3); border-radius:14px; overflow:hidden; background:#3a0f15; position:relative;">
      <div style="aspect-ratio:1/1; overflow:hidden;"><img src="${escapeHtml(m.image)}" alt="${escapeHtml(name)}" style="width:100%; height:100%; object-fit:cover; display:block;"></div>
      <div style="position:absolute; left:0; right:0; bottom:0; padding:24px 12px 12px; background:linear-gradient(180deg,transparent,rgba(42,10,14,.92));">
        <div style="color:#fff; font-family:${KANIT}; font-weight:600; font-size:16px; line-height:1.2;">${escapeHtml(name)}</div>
        <div style="color:#E8C77A; font-size:12px; margin-top:2px;">${escapeHtml(sub)}</div>
      </div>
    </button>`;
  }).join('');

  const galleryItems = state.gallery.map((g) => `
    <button data-light="${escapeHtml(g.image)}" style="cursor:pointer; padding:0; border:none; border-radius:14px; overflow:hidden; grid-row:span ${g.span === 2 ? 2 : 1}; box-shadow:0 8px 22px rgba(122,10,22,.16);">
      <img src="${escapeHtml(g.image)}" alt="" style="width:100%; height:100%; object-fit:cover; display:block;"></button>`).join('');

  const nav = isMobile ? `
    <div style="display:flex; align-items:center; gap:8px;">
      <button data-lang style="cursor:pointer; background:transparent; border:1px solid rgba(214,169,76,.6); color:#F3D58A; font-family:${KANIT}; font-weight:600; font-size:13px; padding:7px 11px; border-radius:999px;">${escapeHtml(t.langSwitch)}</button>
      <button data-mobile aria-label="menu" style="cursor:pointer; width:42px; height:42px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; background:linear-gradient(180deg,#F3D58A,#C9952F); border:none; border-radius:10px;">
        <span style="width:18px; height:2px; background:#7a0a16; border-radius:2px;"></span>
        <span style="width:18px; height:2px; background:#7a0a16; border-radius:2px;"></span>
        <span style="width:18px; height:2px; background:#7a0a16; border-radius:2px;"></span>
      </button>
    </div>` : `
    <nav style="display:flex; align-items:center; gap:6px;">
      <a href="#packages" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:15px; padding:8px 12px; border-radius:8px;">${escapeHtml(t.navPackages)}</a>
      <a href="#menu" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:15px; padding:8px 12px; border-radius:8px;">${escapeHtml(t.navMenu)}</a>
      <a href="#gallery" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:15px; padding:8px 12px; border-radius:8px;">${escapeHtml(t.navGallery)}</a>
      <a href="#contact" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:15px; padding:8px 12px; border-radius:8px;">${escapeHtml(t.navContact)}</a>
      <button data-lang style="cursor:pointer; margin-left:4px; background:transparent; border:1px solid rgba(214,169,76,.6); color:#F3D58A; font-family:${KANIT}; font-weight:600; font-size:13px; padding:7px 12px; border-radius:999px;">${escapeHtml(t.langSwitch)}</button>
      <a href="/booking" style="text-decoration:none; margin-left:4px; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:15px; padding:10px 20px; border-radius:999px; box-shadow:0 4px 14px rgba(0,0,0,.25);">${escapeHtml(t.navBook)}</a>
    </nav>`;

  const mobilePanel = (isMobile && state.mobileOpen) ? `
    <nav style="display:flex; flex-direction:column; padding:8px 20px 18px; gap:2px; background:rgba(120,9,23,.99); border-top:1px solid rgba(214,169,76,.3);">
      <a data-closem href="#packages" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:17px; padding:13px 8px; border-bottom:1px solid rgba(214,169,76,.16);">${escapeHtml(t.navPackages)}</a>
      <a data-closem href="#menu" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:17px; padding:13px 8px; border-bottom:1px solid rgba(214,169,76,.16);">${escapeHtml(t.navMenu)}</a>
      <a data-closem href="#gallery" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:17px; padding:13px 8px; border-bottom:1px solid rgba(214,169,76,.16);">${escapeHtml(t.navGallery)}</a>
      <a data-closem href="#contact" style="text-decoration:none; color:#FBE9C8; font-weight:500; font-size:17px; padding:13px 8px; border-bottom:1px solid rgba(214,169,76,.16);">${escapeHtml(t.navContact)}</a>
      <a data-closem href="/booking" style="text-decoration:none; text-align:center; margin-top:10px; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:17px; padding:13px; border-radius:999px;">${escapeHtml(t.navBook)}</a>
    </nav>` : '';

  const promo = state.promoOpen ? `
    <div data-promo-bg style="position:fixed; inset:0; z-index:120; background:rgba(20,4,7,.78); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:24px; animation:jzFadeIn .25s ease;">
      <div data-stop style="position:relative; width:min(460px,94vw); background:linear-gradient(180deg,#7a0a16,#9E0B1B); border:2px solid #D6A94C; border-radius:22px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,.55); animation:jzPopIn .55s cubic-bezier(.18,.9,.3,1.2) both;">
        <button data-promo-close aria-label="close" style="position:absolute; top:12px; right:12px; z-index:2; width:38px; height:38px; border-radius:50%; border:1px solid rgba(255,255,255,.4); background:rgba(0,0,0,.45); color:#fff; font-size:20px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
        <div style="padding:18px 18px 0;"><img src="images/promo-spread.jpg" alt="โปรโมชั่น" style="width:100%; border-radius:14px; display:block;"></div>
        <div style="padding:18px 24px 24px; text-align:center;">
          <div style="display:inline-block; padding:5px 16px; border:1px solid rgba(214,169,76,.6); border-radius:999px; color:#F3D58A; font-family:${KANIT}; font-weight:600; font-size:13px; letter-spacing:1px;">${escapeHtml(t.promoBadge)}</div>
          <h3 style="margin:12px 0 4px; font-family:${KANIT}; font-weight:800; font-size:26px; color:#fff;">${escapeHtml(t.promoTitle)}</h3>
          <p style="margin:0 0 16px; color:#FBE9C8; font-size:15px;">${escapeHtml(t.promoSub)}</p>
          <a href="/booking" style="text-decoration:none; display:inline-block; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:17px; padding:13px 36px; border-radius:999px; box-shadow:0 6px 18px rgba(0,0,0,.3);">${escapeHtml(t.promoCta)}</a>
        </div>
      </div>
    </div>` : '';

  const lightbox = state.lightbox ? `
    <div data-light-close style="position:fixed; inset:0; z-index:100; background:rgba(20,4,7,.92); display:flex; align-items:center; justify-content:center; padding:24px; cursor:zoom-out; animation:jzFloat 6s ease-in-out infinite;">
      <img src="${escapeHtml(state.lightbox)}" alt="" style="max-width:94vw; max-height:90vh; border-radius:14px; border:2px solid #D6A94C; box-shadow:0 20px 60px rgba(0,0,0,.6);">
    </div>` : '';

  const mapsSrc = 'https://maps.google.com/maps?q=' + encodeURIComponent(t._mapsQuery) + '&t=&z=13&ie=UTF8&iwloc=&output=embed';

  app.innerHTML = `
  ${promo}
  <header style="position:sticky; top:0; z-index:60; background:rgba(140,11,27,.96); backdrop-filter:blur(8px); border-bottom:1px solid rgba(214,169,76,.45);">
    <div style="max-width:1200px; margin:0 auto; padding:10px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
      <a href="#top" style="display:flex; align-items:center; gap:11px; text-decoration:none;">
        <img src="images/logo.jpg" alt="Jinzi Shabu" style="width:46px; height:46px; border-radius:50%; object-fit:cover; border:2px solid #D6A94C;">
        <span style="display:flex; flex-direction:column; line-height:1;">
          <span style="font-family:${KANIT}; font-weight:800; letter-spacing:3px; color:#F3D58A; font-size:19px;">JINZI</span>
          <span style="font-family:${KANIT}; font-weight:500; letter-spacing:5px; color:#E7B7A0; font-size:10px;">SHABU</span>
        </span>
      </a>
      ${nav}
    </div>
    ${mobilePanel}
  </header>

  <section id="top" style="position:relative; background:#7a0a16; overflow:hidden;">
    <img src="images/full-table.jpg" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.30;">
    <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(122,10,22,.55) 0%, rgba(122,10,22,.82) 55%, rgba(42,10,14,.96) 100%);"></div>
    <div style="position:absolute; top:0; left:0; right:0; display:flex; justify-content:space-around; padding:0 8%; pointer-events:none; z-index:2;">${lanterns}</div>
    <div style="position:relative; z-index:3; max-width:1100px; margin:0 auto; padding:clamp(90px,13vw,150px) 24px clamp(70px,9vw,110px); text-align:center;">
      <div style="display:inline-flex; align-items:center; gap:8px; padding:7px 18px; border:1px solid rgba(214,169,76,.6); border-radius:999px; background:rgba(0,0,0,.25); margin-bottom:24px;">
        <span style="color:#F3D58A; font-size:13px;">◆</span>
        <span style="color:#F3D58A; font-family:${KANIT}; font-weight:500; letter-spacing:1px; font-size:13px;">${escapeHtml(t.heroBadge)}</span>
        <span style="color:#F3D58A; font-size:13px;">◆</span>
      </div>
      <h1 style="margin:0; font-family:${KANIT}; font-weight:800; line-height:1.04; font-size:clamp(40px,8vw,84px); color:#fff; text-shadow:0 4px 24px rgba(0,0,0,.5);">
        ${escapeHtml(t.heroTitle)}<br>${gold(escapeHtml(t.heroTitleAccent), 'clamp(40px,8vw,84px)')}
      </h1>
      <p style="max-width:620px; margin:22px auto 0; font-size:clamp(16px,2.2vw,20px); color:#FBE9C8; line-height:1.6;">${escapeHtml(t.heroSub)}</p>
      <div style="display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin:34px 0 8px;">${priceChips}</div>
      <div style="display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-top:30px;">
        <a href="/booking" style="text-decoration:none; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:18px; padding:15px 36px; border-radius:999px; box-shadow:0 8px 24px rgba(0,0,0,.35); animation:jzGlow 3s ease-in-out infinite;">${escapeHtml(t.heroCtaBook)}</a>
        <a href="#menu" style="text-decoration:none; background:transparent; color:#F3D58A; border:1px solid rgba(214,169,76,.7); font-family:${KANIT}; font-weight:600; font-size:18px; padding:15px 32px; border-radius:999px;">${escapeHtml(t.heroCtaMenu)}</a>
      </div>
    </div>
    <div style="position:relative; z-index:3; border-top:1px solid rgba(214,169,76,.3); background:rgba(42,10,14,.55);">
      <div style="max-width:1100px; margin:0 auto; padding:18px 24px; display:flex; flex-wrap:wrap; gap:14px; justify-content:center;">${features}</div>
    </div>
  </section>

  <section id="packages" style="scroll-margin-top:80px; padding:clamp(64px,9vw,100px) 24px; background:linear-gradient(180deg,#FCF4E6,#F6E7CC);">
    <div style="max-width:1180px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:46px;">
        <div style="color:#C41230; font-family:${KANIT}; font-weight:600; letter-spacing:3px; font-size:14px; text-transform:uppercase;">${escapeHtml(t.pkgEyebrow)}</div>
        <h2 style="margin:8px 0 0; font-family:${KANIT}; font-weight:800; font-size:clamp(30px,5vw,46px); color:#7a0a16;">${escapeHtml(t.pkgTitle)}</h2>
        <p style="margin:12px auto 0; max-width:560px; color:#7a4a3a; font-size:17px;">${escapeHtml(t.pkgSub)}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:24px;">${pkgCards}</div>
      <p style="text-align:center; margin:26px 0 0; color:#9a6a52; font-size:14px;">${escapeHtml(t.pkgFootnote)}</p>
    </div>
  </section>

  <section id="menu" style="scroll-margin-top:80px; padding:clamp(64px,9vw,100px) 24px; background:#2A0A0E; position:relative;">
    <div style="max-width:1180px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:46px;">
        <div style="color:#E8C77A; font-family:${KANIT}; font-weight:600; letter-spacing:3px; font-size:14px; text-transform:uppercase;">${escapeHtml(t.menuEyebrow)}</div>
        <h2 style="margin:8px 0 0; font-family:${KANIT}; font-weight:800; font-size:clamp(30px,5vw,46px); color:#fff;">${escapeHtml(t.menuTitle)}</h2>
        <p style="margin:12px auto 0; max-width:560px; color:#E7C6A6; font-size:17px;">${escapeHtml(t.menuSub)}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:18px;">${menuItems}</div>
    </div>
  </section>

  <section id="gallery" style="scroll-margin-top:80px; padding:clamp(64px,9vw,100px) 24px; background:linear-gradient(180deg,#F6E7CC,#FCF4E6);">
    <div style="max-width:1180px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:46px;">
        <div style="color:#C41230; font-family:${KANIT}; font-weight:600; letter-spacing:3px; font-size:14px; text-transform:uppercase;">${escapeHtml(t.galEyebrow)}</div>
        <h2 style="margin:8px 0 0; font-family:${KANIT}; font-weight:800; font-size:clamp(30px,5vw,46px); color:#7a0a16;">${escapeHtml(t.galTitle)}</h2>
        <p style="margin:12px auto 0; max-width:560px; color:#7a4a3a; font-size:17px;">${escapeHtml(t.galSub)}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); grid-auto-rows:200px; gap:14px;">${galleryItems}</div>
    </div>
  </section>

  <section id="contact" style="scroll-margin-top:80px; padding:clamp(64px,9vw,100px) 24px; background:#2A0A0E;">
    <div style="max-width:1180px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:46px;">
        <div style="color:#E8C77A; font-family:${KANIT}; font-weight:600; letter-spacing:3px; font-size:14px; text-transform:uppercase;">${escapeHtml(t.contactEyebrow)}</div>
        <h2 style="margin:8px 0 0; font-family:${KANIT}; font-weight:800; font-size:clamp(30px,5vw,46px); color:#fff;">${escapeHtml(t.contactTitle)}</h2>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:24px; align-items:stretch;">
        <div style="background:#3a0f15; border:1px solid rgba(214,169,76,.3); border-radius:18px; padding:32px;">
          <div style="display:flex; flex-direction:column; gap:22px;">
            <div style="display:flex; gap:14px; align-items:flex-start;"><span style="font-size:22px; color:#E8C77A;">📍</span>
              <div><div style="font-family:${KANIT}; font-weight:600; color:#fff; font-size:16px;">${escapeHtml(t.cAddress)}</div><div style="color:#E7C6A6; font-size:15px; margin-top:3px;">${escapeHtml(t.cAddressVal)}</div></div></div>
            <div style="display:flex; gap:14px; align-items:flex-start;"><span style="font-size:22px; color:#E8C77A;">🕒</span>
              <div><div style="font-family:${KANIT}; font-weight:600; color:#fff; font-size:16px;">${escapeHtml(t.cHours)}</div><div style="color:#E7C6A6; font-size:15px; margin-top:3px;">${escapeHtml(t.cHoursVal)}</div></div></div>
            <div style="display:flex; gap:14px; align-items:flex-start;"><span style="font-size:22px; color:#E8C77A;">📞</span>
              <div><div style="font-family:${KANIT}; font-weight:600; color:#fff; font-size:16px;">${escapeHtml(t.cPhone)}</div><div style="color:#E7C6A6; font-size:15px; margin-top:3px;">${escapeHtml(t.cPhoneVal)}</div></div></div>
            <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:6px;">
              <a href="${escapeHtml(t._facebook)}" target="_blank" rel="noopener" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; background:#1877F2; color:#fff; font-weight:600; font-size:15px; padding:12px 20px; border-radius:999px;">f &nbsp;${escapeHtml(t.cFollow)}</a>
              <a href="/booking" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; background:linear-gradient(180deg,#F3D58A,#C9952F); color:#7a0a16; font-family:${KANIT}; font-weight:700; font-size:15px; padding:12px 22px; border-radius:999px;">${escapeHtml(t.navBook)}</a>
            </div>
          </div>
        </div>
        <div style="border-radius:18px; overflow:hidden; border:1px solid rgba(214,169,76,.3); min-height:300px;">
          <iframe title="map" src="${escapeHtml(mapsSrc)}" style="width:100%; height:100%; min-height:300px; border:0; filter:saturate(.9);"></iframe>
        </div>
      </div>
    </div>
  </section>

  <footer style="background:#1c060a; padding:40px 24px; border-top:1px solid rgba(214,169,76,.25);">
    <div style="max-width:1180px; margin:0 auto; display:flex; flex-wrap:wrap; gap:20px; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:12px;">
        <img src="images/logo.jpg" alt="Jinzi Shabu" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid #D6A94C;">
        <div style="line-height:1.2;">
          <div style="font-family:${KANIT}; font-weight:800; letter-spacing:2px; color:#F3D58A; font-size:17px;">JINZI SHABU</div>
          <div style="color:#b07a68; font-size:13px;">${escapeHtml(t.footTagline)}</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <a href="/admin" style="text-decoration:none; color:#6a463a; font-size:12px; border:1px solid rgba(214,169,76,.22); padding:5px 12px; border-radius:999px;">${escapeHtml(t.staffLogin)}</a>
        <div style="color:#8a5a4a; font-size:13px;">${escapeHtml(t.footRights)}</div>
      </div>
    </div>
  </footer>
  ${lightbox}`;

  wire();
}

function wire() {
  app.querySelector('[data-lang]')?.addEventListener('click', () => {
    const order = ['th','en','zh'];
    state.lang = order[(order.indexOf(state.lang) + 1) % 3];
    localStorage.setItem('jinzi_lang', state.lang);
    render();
  });
  app.querySelector('[data-mobile]')?.addEventListener('click', () => { state.mobileOpen = !state.mobileOpen; render(); });
  app.querySelectorAll('[data-closem]').forEach((a) => a.addEventListener('click', () => { state.mobileOpen = false; }));
  app.querySelectorAll('[data-pkg]').forEach((b) => b.addEventListener('click', () => {
    window.location.href = '/booking?pkg=' + b.getAttribute('data-pkg');
  }));
  app.querySelectorAll('[data-light]').forEach((b) => b.addEventListener('click', () => { state.lightbox = b.getAttribute('data-light'); render(); }));
  app.querySelector('[data-light-close]')?.addEventListener('click', () => { state.lightbox = null; render(); });
  const promoBg = app.querySelector('[data-promo-bg]');
  if (promoBg) {
    promoBg.addEventListener('click', () => { state.promoOpen = false; render(); });
    app.querySelector('[data-promo-close]')?.addEventListener('click', () => { state.promoOpen = false; render(); });
    app.querySelector('[data-stop]')?.addEventListener('click', (e) => e.stopPropagation());
  }
}

async function init() {
  render();  // first paint with defaults
  try {
    const [menu, gallery, settings] = await Promise.all([api.getMenu(), api.getGallery(), api.getSettings()]);
    state.menu = menu || [];
    state.gallery = gallery || [];
    state.settings = settings || null;
    render();
  } catch (e) { /* keep defaults; site still works */ }
}

let rT;
window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(render, 120); });
init();
setTimeout(() => { state.promoOpen = true; render(); }, 700);
