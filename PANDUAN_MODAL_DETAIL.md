# Panduan Instalasi Fitur Modal Detail Surat

## 1. Buat Tabel Comments di Database

1. Buka **Laragon** → Klik **Database** atau buka **phpMyAdmin**
2. Pilih database `inpro_db`
3. Klik tab **SQL**
4. Copy paste script dari file `create-comments-table.sql`:

```sql
-- Tambahkan tabel untuk comments
CREATE TABLE IF NOT EXISTS surat_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surat_id INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (surat_id) REFERENCES surat(id) ON DELETE CASCADE
);

-- Index untuk optimasi query
CREATE INDEX idx_surat_comments_surat_id ON surat_comments(surat_id);
```

5. Klik **Go** untuk menjalankan

## 2. Restart Backend

Jika backend sudah running, tidak perlu restart karena menggunakan nodemon.
Jika belum running:

```bash
cd backend
npm start
```

## 3. Test Fitur Baru

### A. Klik Card untuk Lihat Detail
1. Buka dashboard admin
2. Klik salah satu card surat
3. Modal detail akan muncul menampilkan:
   - Detail lengkap surat
   - Attachment (jika ada)
   - Form komentar
   - List komentar

### B. Tambah Komentar
1. Di modal detail, scroll ke bagian **💬 Komentar**
2. Ketik komentar di textarea
3. Klik **Kirim Komentar**
4. Komentar akan muncul dengan nama admin dan timestamp

### C. Upload Attachment
1. Di modal detail, scroll ke bagian **📎 Attachment**
2. Klik **Choose File** dan pilih file (.pdf, .doc, .docx)
3. Klik **Upload**
4. Link dokumen akan muncul dan bisa diklik untuk membuka

## Fitur Yang Ditambahkan:

✅ **Modal Detail Surat** - Klik card untuk lihat detail lengkap
✅ **Sistem Komentar** - Semua admin bisa memberi komentar
✅ **Upload Attachment** - Bisa upload file dokumen surat
✅ **Tampilan Seperti Trello** - Modal mirip dengan card detail di Trello
✅ **Real-time Comments** - Komentar tersimpan di database dengan timestamp

## Endpoints API Baru:

- `GET /api/surat/:id/comments` - Ambil semua komentar surat
- `POST /api/surat/:id/comments` - Tambah komentar baru
- `POST /api/surat/:id/attachment` - Upload attachment surat

## File Yang Dimodifikasi:

1. **Frontend:**
   - `src/pages/AdminDashboard.jsx` - Tambah modal detail dan state management
   - `src/App.css` - Styling untuk modal

2. **Backend:**
   - `backend/controllers/commentController.js` - Controller untuk comments (BARU)
   - `backend/src/routes/commentRoutes.js` - Routes untuk comments (BARU)
   - `backend/src/controllers/suratController.js` - Tambah uploadAttachment
   - `backend/src/routes/suratRoutes.js` - Tambah route attachment
   - `backend/src/server.js` - Register comment routes
   - `backend/create-comments-table.sql` - SQL untuk tabel comments (BARU)
