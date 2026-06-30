// Entry point — Express server: serves the static front-ends + mounts the API.
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { migrate, seed } from './db.js';
import api from './api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// ensure uploads dir exists (for CMS image uploads)
fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });

migrate();
seed();

const app = express();
app.use(express.json());

app.use('/api', api);

// Static front-end (customer site at /, booking at /booking, admin at /admin)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/booking', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'booking.html')));
app.get('/admin', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🍲 Jinzi Shabu`);
  console.log(`   Customer : http://localhost:${PORT}/`);
  console.log(`   Booking  : http://localhost:${PORT}/booking`);
  console.log(`   Admin    : http://localhost:${PORT}/admin`);
  console.log(`   API      : http://localhost:${PORT}/api\n`);
});
