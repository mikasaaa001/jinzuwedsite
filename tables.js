// Shared floor-plan layout for Jinzi Shabu.
// Fixed restaurant layout — used by both the API (capacity / double-booking
// checks) and the front-end floor plan. x/y/w/h are percentages of the plan box.
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

export const ZONE_NAME = { outdoor: 'โซนกลางแจ้ง', indoor: 'โซนในร้าน', private: 'โซนส่วนตัว' };

// Valid package codes (per-person buffet tiers, THB).
export const PACKAGES = ['299', '459', '699'];
