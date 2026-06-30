# 🍲 Jinzi Shabu — ระบบจองโต๊ะ + ระบบหลังบ้าน (CMS)

เว็บจองโต๊ะร้านชาบู พร้อมหลังบ้านที่แก้เนื้อหาเว็บเองได้ — **Node.js + Express + SQLite**

- **เว็บลูกค้า** (`/`) — โปรโมชั่น, แพ็กเกจ 299/459/699฿, เมนู, แกลเลอรี, ติดต่อ — 3 ภาษา (ไทย / EN / 中文)
- **หน้าจองโต๊ะ** (`/booking`) — เลือกวัน-เวลา-คน แล้วแตะเลือกโต๊ะจากผังร้านจริง (กันจองซ้ำ)
- **หลังบ้าน** (`/admin`, PIN) — 4 แท็บ:
  - **📋 การจอง** — ดูสถิติ, ยืนยัน/ยกเลิก/ลบการจอง, ค้นหา/กรอง
  - **🍲 เมนู** — เพิ่ม/แก้/ลบ/ซ่อน เมนู + อัปโหลดรูป + ชื่อ/คำอธิบาย 3 ภาษา
  - **🖼 แกลเลอรี** — อัปโหลด/ลบ/ซ่อน/ปรับขนาดช่อง รูปบรรยากาศ
  - **⚙️ ตั้งค่าเว็บ** — แก้ข้อความ Hero, โปรโม, เบอร์โทร, ที่อยู่, เวลาเปิด, Facebook, แผนที่ (ครบ 3 ภาษา)

> การจอง + เนื้อหาเก็บที่ **เซิร์ฟเวอร์** → แก้ในหลังบ้านแล้วเด้งขึ้นเว็บทันที และการจองจากมือถือลูกค้าเห็นในหลังบ้านทุกเครื่อง

---

## รันบนเครื่อง (ต้องใช้ Node 22.5+)

```bash
cd jinzi-shabu
npm install
npm start
```
เปิด http://localhost:3000/ · จอง `/booking` · หลังบ้าน `/admin` (PIN เริ่มต้น **1234**)

ฐานข้อมูล `jinzi.db` + รูปตัวอย่าง + เนื้อหาเริ่มต้น จะถูกสร้าง/seed ให้อัตโนมัติ

---

## โครงสร้าง

```
jinzi-shabu/
├── index.js        # Express server (เสิร์ฟหน้าเว็บ + mount API + เตรียม uploads/)
├── api.js          # REST API: bookings + CMS (menu/gallery/settings/upload)
├── db.js           # schema + seed + ค่าตั้งต้นของ settings (node:sqlite)
├── tables.js       # ผังโต๊ะ 16 โต๊ะ 3 โซน
├── public/
│   ├── index.html / booking.html / admin.html
│   ├── js/  (data, api, landing, booking, admin)
│   ├── images/   (รูปตั้งต้น)  ·  uploads/  (รูปที่อัปโหลดผ่านหลังบ้าน)
├── render.yaml · DEPLOY.md
```

---

## REST API ย่อ

| Method | Path | สิทธิ์ | ใช้ทำอะไร |
|--------|------|--------|-----------|
| `GET` | `/api/menu` · `/api/gallery` · `/api/settings` | public | เนื้อหาเว็บ (หน้าแรกดึงไปแสดง) |
| `GET` | `/api/availability?date=&time=` | public | โต๊ะที่ถูกจองในช่วงเวลานั้น |
| `POST` | `/api/bookings` | public | สร้างการจอง (กันจองซ้ำ) |
| `POST` | `/api/admin/login` | public | ล็อกอิน PIN → token |
| `POST` | `/api/admin/upload` | admin | อัปโหลดรูป → คืน url |
| `POST/PATCH/DELETE` | `/api/menu` · `/api/gallery` | admin | จัดการเมนู/แกลเลอรี |
| `PUT` | `/api/settings` | admin | บันทึกข้อความ/ข้อมูลติดต่อ |
| `GET/PATCH/DELETE` | `/api/bookings[/:ref]` | admin | ดู/เปลี่ยนสถานะ/ลบการจอง |

---

## Environment variables

| ตัวแปร | ค่าเริ่มต้น | ความหมาย |
|--------|-----------|----------|
| `PORT` | `3000` | พอร์ตเซิร์ฟเวอร์ |
| `ADMIN_PIN` | `1234` | PIN เข้าหลังบ้าน — **เปลี่ยนก่อนใช้จริง** |
| `ADMIN_SECRET` | (dev fallback) | กุญแจลับเซ็น token — ตั้งค่าสุ่มยาวๆ ตอน deploy |

วิธีนำขึ้นออนไลน์ดูที่ [DEPLOY.md](DEPLOY.md)

> ⚠️ บน Render free tier ทั้ง `jinzi.db` และรูปใน `public/uploads/` จะหายตอน redeploy — ถ้าใช้จริงจังต้องต่อ Persistent Disk หรือเก็บรูปบน Cloudinary/S3 (แจ้งได้ เดี๋ยวช่วยต่อให้)
