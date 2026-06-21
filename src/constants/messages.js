const MENU = 
`*🌟 BOT STIKER & DOWNLOADER 🌟*

*🛠️ FITUR UTAMA:*

*1. 🖼️ Pembuat Stiker* (/sticker / /stiker)
   - *Kirim/Reply:* Gambar, Video, atau GIF -> Jadi Stiker.
   - *Link:* Kirim link sosmed -> Otomatis jadi stiker.

*2. 📥 Media Downloader* (/download / /dl)
   - *Instagram:* Post & Reels 🟣
   - *X / Twitter:* Video & Foto 🐦
   - *TikTok:* Video (Tanpa Watermark) 🎵
   - *YouTube:* Video MP4 ▶️
   - *Threads:* Foto & Video 🧵

*💡 CARA PAKAI:*
   - Ketik /sticker [link/media] untuk stiker.
   - Ketik /download [link] untuk download file.
   - Atau cukup *Reply* media dengan perintah tersebut.

*ℹ️ Bantuan:* Ketik /menu atau /help untuk melihat pesan ini.

*Created by: Gue* ✨`;

const NO_MEDIA_OR_URL = 'Kirim gambar/video/URL matane ki lo, /menu ben paham';
const PROCESSING_URL = '⏳ Sedang mencoba mendownload dan memproses URL. Mohon tunggu sebentar...';
const MEDIA_TOO_LARGE = (platform) => `❌ Gagal mengunduh: Ukuran media ${platform} terlalu besar (melebihil batas 50 MB).`;
const DOWNLOAD_FAILED = (platform, error) => `❌ Gagal mengunduh media ${platform}: ${error}`;
const GENERIC_DOWNLOAD_FAILED = '❌ Maaf, gagal mendownload atau memproses URL tersebut. Pastikan URL publik (tidak di-private).';
const MEDIA_PROCESS_FAILED = '❌ Gagal memproses media. (Mungkin ukuran file terlalu besar atau media sudah kedaluwarsa).';
const IG_NO_MEDIA = 'Tidak dapat menemukan media di URL Instagram tersebut.';
const TWITTER_NO_MEDIA = 'Tidak dapat menemukan media di URL X/Twitter tersebut.';
const TIKTOK_NO_VIDEO = 'URL video TikTok tidak ditemukan di respons API.';
const YOUTUBE_NO_FORMAT = 'Format video tidak ditemukan atau API bermasalah.';
const THREADS_NO_MEDIA = 'Media tidak ditemukan di link Threads tersebut.';
const THREADS_FORMAT_UNKNOWN = 'Format media Threads tidak dikenali.';
const TWITTER_ALL_FAILED = (error) => `Semua metode Twitter gagal: ${error}`;
const TIKTOK_API_FAILED = 'Gagal mengambil info video TikTok dari API.';

const COPY_PASTE_REPLY = 'Falah akbar kontol';
const BOT_READY = 'Bot sudah siap dan berjalan!';
const BOT_DISCONNECTED = (reason) => `Bot terputus (disconnected) dari WhatsApp! Alasan: ${reason}`;
const BOT_RESTARTING = 'Bot akan dimatikan agar bisa di-restart ulang...';
const NOTIFICATION_SENT = 'Notifikasi berhasil terkirim!';
const NOTIFICATION_FAILED = (error) => `Gagal mengirim notifikasi: ${error}`;

module.exports = {
  MENU,
  NO_MEDIA_OR_URL,
  PROCESSING_URL,
  MEDIA_TOO_LARGE,
  DOWNLOAD_FAILED,
  GENERIC_DOWNLOAD_FAILED,
  MEDIA_PROCESS_FAILED,
  IG_NO_MEDIA,
  TWITTER_NO_MEDIA,
  TIKTOK_NO_VIDEO,
  YOUTUBE_NO_FORMAT,
  THREADS_NO_MEDIA,
  THREADS_FORMAT_UNKNOWN,
  TWITTER_ALL_FAILED,
  TIKTOK_API_FAILED,
  COPY_PASTE_REPLY,
  BOT_READY,
  BOT_DISCONNECTED,
  BOT_RESTARTING,
  NOTIFICATION_SENT,
  NOTIFICATION_FAILED,
};