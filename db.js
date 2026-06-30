// Database layer using Node's built-in SQLite (node:sqlite, Node >= 22.5).
// Schema + seed data for Jinzi Shabu booking system + CMS (menu / gallery / settings).
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'jinzi.db');

export const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
export function migrate() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 2,
    table_id TEXT,
    package TEXT DEFAULT '459',
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',          -- pending / confirmed / cancelled
    lang TEXT DEFAULT 'th',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings (booking_date, booking_time);

  -- CMS: menu items (3 languages)
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort INTEGER DEFAULT 0,
    image TEXT DEFAULT '',
    name_th TEXT DEFAULT '', name_en TEXT DEFAULT '', name_zh TEXT DEFAULT '',
    sub_th  TEXT DEFAULT '', sub_en  TEXT DEFAULT '', sub_zh  TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- CMS: gallery / atmosphere images
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sort INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    span INTEGER DEFAULT 1,                  -- grid row span (1 or 2)
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- CMS: editable site text / contact (single JSON row, key='site')
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  `);
}

// ---------------------------------------------------------------------------
// Default editable site settings (overlaid onto the front-end's built-in text).
// ---------------------------------------------------------------------------
export const DEFAULT_SETTINGS = {
  hero: {
    title:  { th:'อิ่มไม่อั้น', en:'Eat Unlimited', zh:'吃到饱' },
    accent: { th:'ชาบูจิ้นซึ', en:'at Jinzi Shabu', zh:'金子虾火锅' },
    sub:    { th:'ชาบู ซีฟู้ด แซลมอน และค็อกเทล สดใหม่ทุกวัน ในบรรยากาศจีนมงคลสุดอบอุ่น เริ่มต้นเพียง 299 บาท',
              en:'Fresh shabu, seafood, salmon and cocktails every day in a warm, festive Chinese atmosphere — starting at just 299 THB.',
              zh:'每日新鲜的火锅、海鲜、三文鱼与鸡尾酒，置身喜庆的中式氛围，仅需 299 泰铢起。' },
  },
  promo: {
    title: { th:'สั่งได้ไม่อั้น เริ่ม 299฿', en:'All-You-Can-Eat from 299฿', zh:'无限畅吃 299泰铢起' },
    sub:   { th:'ชาบู ซีฟู้ด แซลมอน จัดเต็มทุกวัน — จองโต๊ะวันนี้รับสิทธิ์ก่อนใคร',
             en:'Shabu, seafood & salmon loaded daily — reserve today to secure your table.',
             zh:'火锅、海鲜、三文鱼每日丰盛供应——立即订位，抢先享有。' },
  },
  contact: {
    phone: '0XX-XXX-XXXX',
    address: { th:'จิ้นซึชาบู — ดูพิกัดและสาขาได้ที่เพจเฟซบุ๊กของเรา',
               en:'Jinzi Shabu — find our exact location and branches on our Facebook page.',
               zh:'金子虾火锅——请在我们的 Facebook 专页查看具体位置与分店。' },
    hours: { th:'ทุกวัน 11:00 – 22:00 น. (รับลูกค้าเข้าครั้งสุดท้าย 21:00 น.)',
             en:'Daily 11:00 – 22:00 (last seating 21:00)',
             zh:'每天 11:00 – 22:00（最后入座 21:00）' },
    facebook: 'https://www.facebook.com/p/Jinzi-shabu-%E0%B8%8A%E0%B8%B2%E0%B8%9A%E0%B8%B9-%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B5%E0%B9%88-100087910578266/',
    mapsQuery: 'Jinzi Shabu',
  },
};

export function getSettings() {
  const row = db.prepare("SELECT value FROM settings WHERE key='site'").get();
  if (!row) return DEFAULT_SETTINGS;
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(row.value) }; }
  catch (e) { return DEFAULT_SETTINGS; }
}
export function saveSettings(obj) {
  const value = JSON.stringify(obj);
  db.prepare(`INSERT INTO settings (key, value) VALUES ('site', ?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(value);
  return getSettings();
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
function today() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function addDays(n) {
  return new Date(Date.now() + n * 86400000 - new Date().getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10);
}

function seedBookings() {
  if (db.prepare('SELECT COUNT(*) AS c FROM bookings').get().c > 0) return;
  const t = today(), tom = addDays(1);
  const ins = db.prepare(`INSERT INTO bookings
    (ref, name, phone, booking_date, booking_time, party_size, table_id, package, notes, status, lang)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  [
    ['JZ100204', 'คุณสมหญิง ใจดี', '0812345678', t,   '18:00', 4, 'T1', '459', 'ฉลองวันเกิด ขอเค้ก 1 ก้อน', 'pending',   'th'],
    ['JZ100198', 'คุณวิชัย พงษ์ไพ', '0898765432', t,   '19:30', 6, 'T4', '699', '',                          'confirmed', 'th'],
    ['JZ100187', 'Mr. Chen Wei',    '0911122233', t,   '12:30', 2, 'O1', '299', 'ขอโต๊ะริมหน้าต่าง',          'pending',   'en'],
    ['JZ100165', 'คุณนภา ศรีสุข',   '0867778899', tom, '17:00', 8, 'P1', '459', 'งานเลี้ยงบริษัท',            'confirmed', 'th'],
  ].forEach((r) => ins.run(...r));
}

function seedMenu() {
  if (db.prepare('SELECT COUNT(*) AS c FROM menu_items').get().c > 0) return;
  const ins = db.prepare(`INSERT INTO menu_items
    (sort, image, name_th, name_en, name_zh, sub_th, sub_en, sub_zh) VALUES (?,?,?,?,?,?,?,?)`);
  [
    ['images/menu-pork.jpg',     'เนื้อหมูสไลซ์', 'Sliced Pork',   '猪肉片',     'สามชั้น สันคอ สันนอก', 'Belly · Collar · Loin', '五花·梅肉·里脊'],
    ['images/menu-shrimp.jpg',   'กุ้งไซส์ใหญ่', 'Jumbo Shrimp',  '大虾',       'สดใหม่ทุกวัน', 'Fresh daily', '每日新鲜'],
    ['images/menu-squid.jpg',    'ปลาหมึก',      'Squid',         '鱿鱼',       'หนึบเด้ง', 'Tender & bouncy', '弹牙'],
    ['images/menu-meatball.jpg', 'ลูกชิ้นรวม',   'Meatballs',     '综合丸子',   'หลากหลายไส้', 'Assorted', '多种口味'],
    ['images/menu-veg.jpg',      'ผัก บะหมี่ ไข่', 'Veg & Noodles', '蔬菜·面·蛋', 'ผักสดกรอบ', 'Crisp & fresh', '新鲜爽脆'],
    ['images/menu-seaweed.jpg',  'สาหร่าย ข้าวผัด', 'Seaweed & Rice', '海苔·炒饭', 'ของทานเล่น', 'Sides', '小食'],
    ['images/menu-pickle.jpg',   'ของดอง',       'Pickled Sides', '腌菜',       'แกล้มเด็ด', 'Tangy bites', '开胃小菜'],
    ['images/menu-soup.jpg',     'น้ำซุป',       'Soup Base',     '汤底',       'ใส · หม่าล่า', 'Clear · Mala', '清汤·麻辣'],
    ['images/menu-sauce.jpg',    'น้ำจิ้มสูตรเด็ด', 'Dipping Sauces', '招牌蘸酱', 'หลายสูตร', 'Many styles', '多种口味'],
    ['images/menu-cake.jpg',     'เค้ก',         'Cake',          '蛋糕',       'ของหวาน', 'Dessert', '甜点'],
    ['images/menu-icecream.jpg', 'ไอศกรีม',      'Ice Cream',     '冰淇淋',     'เย็นชื่นใจ', 'Cool treat', '清凉'],
  ].forEach((m, i) => ins.run(i, ...m));
}

function seedGallery() {
  if (db.prepare('SELECT COUNT(*) AS c FROM gallery').get().c > 0) return;
  const ins = db.prepare('INSERT INTO gallery (sort, image, span) VALUES (?,?,?)');
  [
    ['images/storefront.jpg', 2], ['images/interior-1.jpg', 1], ['images/full-table.jpg', 1],
    ['images/interior-2.jpg', 1], ['images/birthday-cake.jpg', 1], ['images/interior-3.jpg', 1],
    ['images/promo-spread.jpg', 1], ['images/interior-4.jpg', 1],
  ].forEach(([img, span], i) => ins.run(i, img, span));
}

function seedSettings() {
  if (db.prepare("SELECT COUNT(*) AS c FROM settings WHERE key='site'").get().c > 0) return;
  saveSettings(DEFAULT_SETTINGS);
}

export function seed() {
  const fresh = db.prepare('SELECT COUNT(*) AS c FROM bookings').get().c === 0;
  seedBookings();
  seedMenu();
  seedGallery();
  seedSettings();
  if (fresh) console.log('✅ Seed complete — sample bookings + menu + gallery + settings added.');
}

// Run directly: `node db.js --seed`
if (process.argv[1] && process.argv[1].endsWith('db.js')) {
  migrate();
  seed();
}
