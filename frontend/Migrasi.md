# Migrasi PostgreSQL → SQLite

## 1. Install dependency baru

```bash
cd backend
npm uninstall pg
npm install better-sqlite3
```

## 2. Ganti file-file ini

| File | Keterangan |
|------|-----------|
| `src/config/database.js` | Koneksi SQLite, helper `query()` |
| `src/controllers/authController.js` | Query dikonversi |
| `src/controllers/adminController.js` | Query dikonversi |
| `src/middlewares/auth.js` | Query sync (tanpa await) |

## 3. Update `.env`

Hapus variabel PostgreSQL, tambah:

```env
# Hapus: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
DB_PATH=./data/persuratan.db
```

## 4. Buat tabel + superadmin pertama

```bash
node src/config/seed.js
```

Default login:
- Username: `superadmin`
- Password: `Admin@1234`

Atau set password custom via env sebelum seed:
```bash
SEED_PASSWORD=passwordkamu node src/config/seed.js
```

## 5. Update `app.js` / `server.js`

Tambahkan import `initDatabase` di file entry point:

```js
const { initDatabase } = require("./src/config/database");
initDatabase(); // panggil sebelum app.listen()
```

---

## Perbedaan PostgreSQL vs SQLite (ringkasan)

| PostgreSQL | SQLite |
|-----------|--------|
| `$1, $2, ...` | `?` |
| `public.admin` | `admin` (tanpa schema) |
| `ILIKE` | `LIKE` + `LOWER()` |
| `CURRENT_TIMESTAMP` | `datetime('now')` |
| `RETURNING` | Tidak ada — ambil data manual setelah mutasi |
| `boolean` native | `INTEGER` 0/1 (helper auto-konversi) |
| async/await `pool.query()` | sync `db.prepare().run()` via helper |

---

## Catatan

- File database SQLite tersimpan di `backend/data/persuratan.db`
- Backup cukup copy file `.db` tersebut
- WAL mode sudah aktif untuk performa concurrent read/write