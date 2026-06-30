// Shared front-end data: floor-plan layout, packages, fallback menu/gallery.
// Menu & gallery are normally loaded from the API (CMS); these are fallbacks.
export const TABLES = [
  { id: 'O1', zone: 'outdoor', seats: 2,  shape: 'round', x: 4,  y: 8,  w: 11, h: 15 },
  { id: 'O2', zone: 'outdoor', seats: 2,  shape: 'round', x: 19, y: 8,  w: 11, h: 15 },
  { id: 'O3', zone: 'outdoor', seats: 4,  shape: 'rect',  x: 38, y: 7,  w: 16, h: 16 },
  { id: 'O4', zone: 'outdoor', seats: 4,  shape: 'rect',  x: 60, y: 7,  w: 16, h: 16 },
  { id: 'O5', zone: 'outdoor', seats: 2,  shape: 'round', x: 84, y: 8,  w: 11, h: 15 },
  { id: 'T1', zone: 'indoor',  seats: 4,  shape: 'rect',  x: 5,  y: 34, w: 15, h: 14 },
  { id: 'T2', zone: 'indoor',  seats: 4,  shape: 'rect',  x: 24, y: 34, w: 15, h: 14 },
  { id: 'T3', zone: 'indoor',  seats: 2,  shape: 'round', x: 44, y: 35, w: 12, h: 12 },
  { id: 'T4', zone: 'indoor',  seats: 6,  shape: 'rect',  x: 62, y: 33, w: 23, h: 16 },
  { id: 'T5', zone: 'indoor',  seats: 4,  shape: 'rect',  x: 5,  y: 53, w: 15, h: 14 },
  { id: 'T6', zone: 'indoor',  seats: 4,  shape: 'rect',  x: 24, y: 53, w: 15, h: 14 },
  { id: 'T7', zone: 'indoor',  seats: 2,  shape: 'round', x: 44, y: 54, w: 12, h: 12 },
  { id: 'T8', zone: 'indoor',  seats: 6,  shape: 'rect',  x: 62, y: 52, w: 23, h: 16 },
  { id: 'P1', zone: 'private', seats: 8,  shape: 'rect',  x: 5,  y: 75, w: 26, h: 18 },
  { id: 'P2', zone: 'private', seats: 10, shape: 'rect',  x: 36, y: 75, w: 30, h: 18 },
  { id: 'P3', zone: 'private', seats: 6,  shape: 'rect',  x: 71, y: 75, w: 24, h: 18 },
];
export const TABLE_MAP = Object.fromEntries(TABLES.map((t) => [t.id, t]));

export const PACKAGES = [
  { price: '299', popular: false,
    tier: { th: 'คลาสสิก', en: 'Classic', zh: '经典' },
    includes: {
      th: ['หมู ไก่ สไลซ์สดใหม่', 'ผักรวม บะหมี่ ไข่', 'ลูกชิ้น เต้าหู้ ของดอง', 'น้ำซุปและน้ำจิ้มไม่อั้น'],
      en: ['Fresh sliced pork & chicken', 'Mixed vegetables, noodles & egg', 'Meatballs, tofu & pickles', 'Unlimited soup base & sauces'],
      zh: ['新鲜猪肉与鸡肉片', '综合蔬菜、面条与鸡蛋', '丸子、豆腐与腌菜', '无限汤底与蘸酱'] } },
  { price: '459', popular: true,
    tier: { th: 'พรีเมียม', en: 'Premium', zh: '高级' },
    includes: {
      th: ['ทุกอย่างในชุด 299', 'ซีฟู้ด ปลาหมึก กุ้ง', 'แซลมอนซาชิมิ', 'ค็อกเทล ฟรี 1 ชุด'],
      en: ['Everything in 299', 'Seafood, squid & shrimp', 'Salmon sashimi', '1 free cocktail set'],
      zh: ['包含299全部', '海鲜、鱿鱼与虾', '三文鱼刺身', '免费鸡尾酒一套'] } },
  { price: '699', popular: false,
    tier: { th: 'ดีลักซ์', en: 'Deluxe', zh: '豪华' },
    includes: {
      th: ['ทุกอย่างในชุด 459', 'กุ้งไซส์ใหญ่จัดเต็ม', 'แซลมอน ปลาสด ไม่อั้น', 'ค็อกเทลไม่อั้น'],
      en: ['Everything in 459', 'Jumbo shrimp, loaded', 'Unlimited salmon & fresh fish', 'Unlimited cocktails'],
      zh: ['包含459全部', '大size鲜虾管够', '三文鱼与鲜鱼无限', '鸡尾酒无限畅饮'] } },
];
export const TIERS = { '299': { th: 'คลาสสิก', en: 'Classic', zh: '经典' },
  '459': { th: 'พรีเมียม', en: 'Premium', zh: '高级' },
  '699': { th: 'ดีลักซ์', en: 'Deluxe', zh: '豪华' } };

// Buffet booking time slots: 11:00 – 21:30 every 30 min.
export const TIME_SLOTS = (() => {
  const s = [];
  for (let h = 11; h <= 21; h++) { s.push((h < 10 ? '0' : '') + h + ':00'); if (h < 21) s.push((h < 10 ? '0' : '') + h + ':30'); }
  s.push('21:30');
  return s;
})();

export function todayStr() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
export function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
