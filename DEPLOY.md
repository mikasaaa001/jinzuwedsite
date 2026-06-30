# 🚀 วิธี Deploy ขึ้นออนไลน์ (Render / Railway)

แอปนี้เป็น **Node.js + Express + SQLite** ต้องใช้โฮสต์ที่รัน Node ได้ (Render / Railway)
**ลากวางบน Netlify Drop ไม่ได้** เพราะ Netlify เสิร์ฟไฟล์ static อย่างเดียว ไม่มีเซิร์ฟเวอร์เก็บการจอง/เนื้อหา

> ต้องใช้ **Node 22.5 ขึ้นไป** (ใช้ `node:sqlite`) — ตั้งค่าใน `.nvmrc` (=24) และ `render.yaml` ให้แล้ว

---

## ขั้นที่ 1 — เอาโค้ดขึ้น GitHub

```bash
cd jinzi-shabu
git init
git add .
git commit -m "Jinzi Shabu booking + CMS"
# สร้าง repo เปล่าบน github.com ก่อน แล้ว:
git remote add origin https://github.com/<username>/jinzi-shabu.git
git branch -M main
git push -u origin main
```

---

## ขั้นที่ 2A — Render (แนะนำ)

1. https://render.com → เข้าสู่ระบบด้วย GitHub
2. **New +** → **Blueprint** → เลือก repo `jinzi-shabu` (อ่าน `render.yaml` ให้อัตโนมัติ)
   หรือเลือก **Web Service** เองแล้วตั้ง: Build `npm install` · Start `npm start` · Instance Free
3. **Environment** → ตรวจ/เพิ่ม:
   - `NODE_VERSION` = `24.15.0`
   - `ADMIN_PIN` = **รหัสลับของร้าน** (เปลี่ยนจาก 1234!)
   - `ADMIN_SECRET` = (กดให้ Render สุ่ม หรือสตริงยาวๆ เดายาก)
4. **Create** → ได้ลิงก์ `https://jinzi-shabu-xxxx.onrender.com`

> ⚠️ ถ้า repo มีหลายโฟลเดอร์ ตั้ง **Root Directory = `jinzi-shabu`**

---

## ขั้นที่ 2B — Railway (ทางเลือก)

1. https://railway.app → **New Project** → **Deploy from GitHub repo** → เลือก repo
2. **Variables** → `NODE_VERSION=24.15.0`, `ADMIN_PIN=...`, `ADMIN_SECRET=...`
3. **Settings → Networking → Generate Domain**

---

## ⚠️ สำคัญมากสำหรับ CMS: ข้อมูล + รูปอัปโหลดจะหายตอน redeploy (free tier)

Render/Railway free tier ใช้ดิสก์ชั่วคราว →
- `jinzi.db` (การจอง, เมนู, แกลเลอรี, ตั้งค่า) ถูกสร้างใหม่จากค่า seed
- **รูปที่อัปโหลดผ่านหลังบ้าน** (`public/uploads/`) จะหายด้วย

เหมาะกับ **เดโม/ทดลอง** ถ้าจะ **ใช้จริง** ต้องทำอย่างใดอย่างหนึ่ง:
- **Render → Persistent Disk** (เสียเงิน) mount ที่โฟลเดอร์ `public/uploads` + ย้าย `jinzi.db` ไปบนดิสก์นั้น
- **เก็บรูปบน Cloud (แนะนำ):** ย้าย upload ไป Cloudinary / AWS S3 — รูปไม่หาย แม้ redeploy (แจ้งได้ เดี๋ยวช่วยต่อให้)
- **ฐานข้อมูลถาวร:** ย้าย `jinzi.db` → Postgres (hosted)

> Render free tier จะ "หลับ" หลังไม่มีคนเข้า ~15 นาที (เปิดครั้งแรกหลังหลับช้า ~30 วิ) — ปกติของแพลนฟรี

---

## หลัง deploy ควรลอง
1. เข้า `/admin` ล็อกอินด้วย `ADMIN_PIN`
2. แท็บ **ตั้งค่าเว็บ** → แก้เบอร์โทร/ที่อยู่ → กดบันทึก → เปิดหน้าแรกเช็กว่าเปลี่ยน
3. แท็บ **เมนู/แกลเลอรี** → ลองอัปโหลดรูป
4. ลองจองจากมือถือ → เช็กว่าโผล่ในแท็บ **การจอง**
