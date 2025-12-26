# 📚 NakaManga Backend API

Backend API untuk aplikasi pembaca manga **NakaManga**. API ini menyediakan layanan autentikasi pengguna dan scraping data manga dari [komiku.org](https://komiku.org).

## 🛠️ Teknologi yang Digunakan

| Teknologi      | Versi    | Deskripsi                     |
| -------------- | -------- | ----------------------------- |
| **Node.js**    | -        | Runtime JavaScript            |
| **Express.js** | ^5.2.1   | Web framework untuk REST API  |
| **Prisma**     | ^5.22.0  | ORM untuk database            |
| **MySQL**      | -        | Database relasional           |
| **Puppeteer**  | ^24.32.0 | Web scraping untuk data manga |
| **Bcrypt**     | ^6.0.0   | Enkripsi password             |
| **Joi**        | ^18.0.2  | Validasi input                |

## 📁 Struktur Proyek

```
komiku-be/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── src/
│   ├── config/
│   │   └── database.js      # Konfigurasi Prisma client
│   ├── controllers/
│   │   ├── manga-controller.js   # Controller untuk manga
│   │   └── user-controller.js    # Controller untuk user
│   ├── routes/
│   │   ├── mangas.js        # Routes untuk manga
│   │   └── users.js         # Routes untuk user
│   ├── services/
│   │   ├── manga-service.js # Business logic manga
│   │   └── user-service.js  # Business logic user
│   ├── utils/
│   │   ├── get-chapter-slug.js   # Utility untuk slug chapter
│   │   ├── get-comic-by-genre.js # Scraper manga berdasarkan genre
│   │   ├── get-comic-chapter.js  # Scraper gambar chapter
│   │   ├── get-detail-comic.js   # Scraper detail manga
│   │   ├── latest-comic.js       # Scraper manga terbaru
│   │   ├── map-error.js          # Utility error mapping
│   │   ├── popular-comic.js      # Scraper manga populer
│   │   ├── search-comic.js       # Scraper pencarian manga
│   │   └── top-comic.js          # Scraper manga top
│   ├── validations/
│   │   └── user-validation.js    # Schema validasi user
│   └── app.js               # Entry point aplikasi
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── readme.md
```

## 🗄️ Database Schema

### Model User

| Field     | Type       | Deskripsi                    |
| --------- | ---------- | ---------------------------- |
| id        | Int        | Primary key (auto increment) |
| name      | String     | Nama pengguna                |
| email     | String     | Email (unique)               |
| password  | String     | Password (hashed)            |
| histories | History[]  | Relasi ke history            |
| favorites | Favorite[] | Relasi ke favorit            |

### Model History

| Field     | Type     | Deskripsi                    |
| --------- | -------- | ---------------------------- |
| id        | Int      | Primary key (auto increment) |
| title     | String   | Judul manga                  |
| slug      | String   | Slug manga                   |
| chapter   | String   | Chapter terakhir dibaca      |
| progress  | String   | Progress membaca             |
| image     | String   | URL gambar cover             |
| userId    | Int      | Foreign key ke User          |
| updatedAt | DateTime | Waktu update terakhir        |
| createdAt | DateTime | Waktu dibuat                 |

### Model Favorite

| Field  | Type   | Deskripsi                    |
| ------ | ------ | ---------------------------- |
| id     | Int    | Primary key (auto increment) |
| title  | String | Judul manga                  |
| slug   | String | Slug manga                   |
| genre  | String | Genre manga                  |
| image  | String | URL gambar cover             |
| userId | Int    | Foreign key ke User          |

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js (v18+)
- MySQL Server
- npm atau yarn

### Instalasi

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd komiku-be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Buat file `.env` dan isi dengan konfigurasi database:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/komiku"
   ```

4. **Setup database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Jalankan server**
   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### User Routes (`/user`)

| Method   | Endpoint               | Deskripsi             |
| -------- | ---------------------- | --------------------- |
| `POST`   | `/user/register`       | Registrasi user baru  |
| `POST`   | `/user/login`          | Login user            |
| `POST`   | `/user/confirm-email`  | Konfirmasi email user |
| `PATCH`  | `/user/reset-password` | Reset password user   |
| `PATCH`  | `/user/:id/update`     | Update data user      |
| `DELETE` | `/user/:id/delete`     | Hapus user            |

### Manga Routes (`/manga`)

| Method | Endpoint                       | Deskripsi            |
| ------ | ------------------------------ | -------------------- |
| `GET`  | `/manga`                       | Ambil daftar manga   |
| `GET`  | `/manga/:slug`                 | Ambil detail manga   |
| `GET`  | `/manga/chapter/:chapter_slug` | Ambil gambar chapter |

### Query Parameters untuk `/manga`

| Parameter | Nilai          | Deskripsi                |
| --------- | -------------- | ------------------------ |
| `sort`    | `latest`       | Manga terbaru            |
| `sort`    | `popular`      | Manga populer            |
| `sort`    | `top`          | Manga top                |
| `genre`   | `<nama-genre>` | Filter berdasarkan genre |
| `page`    | `<number>`     | Pagination (untuk genre) |
| `q`       | `<keyword>`    | Pencarian manga          |

## 📋 Contoh Request & Response

### Register User

**Request:**

```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "status": "Success",
  "message": "Berhasil mendaftarkan user",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User

**Request:**

```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "status": "Success",
  "message": "Berhasil login",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Latest Manga

**Request:**

```http
GET /manga?sort=latest
```

**Response (200 OK):**

```json
{
  "status": "Ok",
  "message": "Berhasil mengambil data",
  "data": [
    {
      "title": "One Piece",
      "slug": "one-piece",
      "genre": "Action",
      "category": "Manga",
      "chapter": "1100",
      "chapterSlug": "one-piece-chapter-1100",
      "image": "https://..."
    }
  ]
}
```

### Get Manga Detail

**Request:**

```http
GET /manga/one-piece
```

**Response (200 OK):**

```json
{
  "status": "Ok",
  "message": "Data berhasil diambil",
  "data": {
    "title": "One Piece",
    "slug": "one-piece",
    "synopsis": "...",
    "chapters": [...]
  }
}
```

### Get Chapter Images

**Request:**

```http
GET /manga/chapter/one-piece-chapter-1100
```

**Response (200 OK):**

```json
{
  "status": "Ok",
  "message": "Data berhasil diambil",
  "data": ["https://image1.jpg", "https://image2.jpg"]
}
```

## ⚠️ Validasi

### Register

- `name`: Minimal 3 karakter
- `email`: Format email valid
- `password`: Minimal 8 karakter

### Login

- `email`: Format email valid
- `password`: Minimal 8 karakter

### Reset Password

- `password`: Minimal 8 karakter
- `confirmedPassword`: Harus sama dengan password

## 🔒 Keamanan

- Password di-hash menggunakan **bcrypt** dengan salt rounds 10
- Validasi input menggunakan **Joi** untuk mencegah invalid data
- Password tidak dikembalikan dalam response API

## 📜 Scripts

| Script        | Deskripsi                                       |
| ------------- | ----------------------------------------------- |
| `npm run dev` | Menjalankan server dengan nodemon (development) |
| `npm test`    | Menjalankan test (belum dikonfigurasi)          |

## 📝 Catatan

- API ini menggunakan **web scraping** dari [komiku.org](https://komiku.org) untuk mendapatkan data manga dan hanya digunakan untuk tujuan **pembelajaran**
- Puppeteer digunakan dalam mode headless untuk scraping
- Pastikan koneksi internet stabil untuk scraping data manga

---
