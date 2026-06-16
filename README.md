# WhatsApp Sticker & Media Downloader Bot 🚀

Bot WhatsApp sederhana berbasis Node.js yang berfungsi untuk membuat stiker secara otomatis dari media yang dikirimkan, serta mengunduh media dari platform sosial media populer seperti Instagram dan X (Twitter).

---

## ✨ Fitur Utama

- 🎨 **Pembuat Stiker Otomatis (`/sticker` atau `/stiker`)**:
  - Konversi gambar, GIF, dan video menjadi stiker langsung di WhatsApp.
  - Mendukung pembuatan stiker dari media yang dikirim langsung atau dengan membalas (reply) media lain.
  - Mendukung pembuatan stiker langsung dari link media sosial.
- 📥 **Media Downloader (`/download` atau `/dl`)**:
  - Mengunduh media dalam format asli (gambar/video) tanpa dikonversi menjadi stiker.
  - Mendukung pengunduhan dari **Instagram** (termasuk multi-slide/carousel) dan **X (Twitter)**.
- 🛡️ **Anti-Error & Stabil**:
  - Dilengkapi bypass SSL/TLS handshake error (`EPROTO` Cloudflare) dan pemaksaan IPv4 (`fetch failed`) yang sering terjadi pada Node.js versi terbaru.
  - Memiliki sistem cadangan (fallback) multi-layer untuk pengunduhan media dari X (Twitter).
- 🔑 **Local Authentication**:
  - Sesi login Anda tersimpan secara lokal di folder `.wwebjs_auth/`. Tidak perlu melakukan scan ulang setiap kali bot dinyalakan.

---

## 🛠️ Prasyarat & Teknologi

Pastikan Anda sudah menginstal:
- **Node.js** (versi 18 ke atas disarankan)
- **Git**
- **Google Chrome** atau **Chromium** (untuk Puppeteer)

### Dependensi Utama:
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - Client API WhatsApp Web untuk Node.js.
- [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static) - Untuk memproses dan mengonversi format video/stiker bergerak.
- [axios](https://github.com/axios/axios) - Library HTTP client stabil untuk mengunduh konten media.
- [instagram-url-direct](https://github.com/meshred/instagram-url-direct) - Scraper untuk mengambil link video/foto Instagram.
- [btch-downloader](https://github.com/BochilGaming/btch-downloader) - Cadangan downloader untuk media X/Twitter.

---

## 🚀 Cara Instalasi & Menjalankan

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/okta4294/BotStikerWA.git
   cd BotStikerWA
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Bot:**
   ```bash
   npm start
   ```

4. **Scan QR Code:**
   Setelah menjalankan perintah di atas, QR Code akan muncul di terminal Anda. Silakan scan menggunakan menu **Perangkat Tertaut** (Linked Devices) di aplikasi WhatsApp Anda.

---

## 📖 Cara Penggunaan / Perintah (Commands)

Kirimkan perintah berikut di chat pribadi maupun grup yang dimasuki bot:

| Perintah | Deskripsi | Cara Penggunaan |
| :--- | :--- | :--- |
| **`/sticker`** atau **`/stiker`** | Membuat stiker dari media | <ul><li>Kirim gambar/video/gif dengan caption `/sticker`</li><li>Balas (reply) gambar/video/gif dengan ketik `/sticker`</li><li>Kirim link Instagram atau X (Twitter) dengan ketik `/sticker <link>`</li></ul> |
| **`/download`** atau **`/dl`** | Mengunduh media dari link sosial media | Kirim pesan `/download <link_instagram_atau_x>` |
| **`/menu`** atau **`/help`** | Menampilkan daftar menu bantuan | Kirim `/menu` atau `/help` |

---

## 📝 Konfigurasi Tambahan (Opsional)
Bot ini secara default akan mengirimkan pesan notifikasi `"Aktif boloo"` ke nomor WhatsApp Anda sendiri setelah bot berhasil tersambung dan siap digunakan.

Untuk mengubah perilaku atau metadata stiker, Anda dapat menyesuaikan konfigurasi berikut di file `index.js`:
```javascript
sendMediaAsSticker: true,
stickerName: 'Bot Stiker', // Ubah nama stiker di sini
stickerAuthor: 'MyBot'       // Ubah pembuat stiker di sini
```

---

## ⚖️ Lisensi
Proyek ini dibuat untuk tujuan hiburan dan pembelajaran. Didistribusikan di bawah lisensi ISC.
