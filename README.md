# InPro - Sistem Informasi Manager Activity dan Tracking

Sistem tracking surat untuk Pegawai Negeri Sipil Pemerintahan dengan fitur QR Code tracking dan manajemen dokumen.

## 🎯 Fitur Utama

- 🔐 **Login Admin** - Authentication untuk admin
- 🔍 **Tracking Surat** - Tracking real-time dengan QR Code
- 📄 **Manajemen Surat** - CRUD surat dengan auto-generate QR Code
- 👥 **Manajemen PNS** - Data pegawai lengkap dengan info pensiun
- 📋 **Template Surat** - Upload dan download template surat
- 📊 **Dashboard** - Statistik dan overview sistem

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- React Router DOM
- Axios
- Context API

**Backend:**
- Node.js + Express
- MySQL (Laragon)
- JWT Authentication
- QRCode Generator

## 📁 Struktur Project

```
InPro/
├── src/                    # Frontend React
│   ├── components/         # Komponen reusable
│   ├── pages/             # Halaman utama
│   ├── services/          # API services
│   ├── context/           # React Context
│   └── utils/             # Helper functions
│
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & upload
│   │   └── utils/        # QR & validation
│   └── uploads/          # Uploaded files
│
└── database/             # SQL scripts
    ├── schema.sql        # Database schema
    └── seeds.sql         # Sample data
```

## 🚀 Cara Menjalankan

### 1. Setup Database

```bash
# 1. Jalankan Laragon
# 2. Buka HeidiSQL atau phpMyAdmin
# 3. Import file: database/schema.sql
# 4. Import file: database/seeds.sql (optional - data contoh)
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Backend akan berjalan di: `http://localhost:3000`

### 3. Setup Frontend

```bash
# Di root folder
npm install react-router-dom axios
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## 📝 Dependencies yang Perlu Diinstall

### Frontend (Root folder)

```bash
npm install react-router-dom axios
```

### Backend

```bash
cd backend
npm install
```

## 🗄️ Database Schema

**Tabel Utama:**
- `users` - Admin/user sistem
- `pegawai` - Data PNS (nama, NIP, pangkat, golongan, jabatan, unit kerja, usia, pensiun)
- `surat` - Dokumen surat dengan QR Code
- `tracking` - Tracking 4 tahap proses surat
- `template_surat` - Template surat yang bisa didownload

## 🔑 Default Login

```
Username: admin
Password: admin123
```

## 📱 Fitur Tracking

1. **Scan QR Code** - Scan QR di surat fisik
2. **Input Manual** - Masukkan nomor surat
3. **View Timeline** - Lihat 4 tahap proses:
   - Tahap 1: Pendaftaran
   - Tahap 2: Verifikasi
   - Tahap 3: Persetujuan/Review
   - Tahap 4: Distribusi/Arsip

## 🎨 Halaman Utama

1. **Home** - Landing page dengan menu Login & Tracking
2. **Login** - Authentication admin
3. **Dashboard Admin** - Overview & statistik
4. **Kelola Surat** - CRUD surat dengan QR Code
5. **Kelola Pegawai** - CRUD data PNS
6. **Tracking** - Public tracking dengan QR scanner

## 📞 Support

Untuk pertanyaan atau bantuan, silakan hubungi tim development.

## 📄 License

Copyright © 2026 InPro
