const MAX_FILE_SIZE = 50 * 1024 * 1024;
const DOWNLOAD_TIMEOUT = 15000;
const STICKER_NAME = 'Bot Stiker';
const STICKER_AUTHOR = 'MyBot';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';

const PLATFORMS = {
  INSTAGRAM: ['instagram.com'],
  TWITTER: ['x.com', 'twitter.com'],
  TIKTOK: ['tiktok.com', 'vt.tiktok.com'],
  YOUTUBE: ['youtube.com', 'youtu.be'],
  THREADS: ['threads.net', 'threads.com'],
};

const COMMANDS = {
  STICKER: ['/sticker', '/stiker'],
  DOWNLOAD: ['/download', '/dl'],
  MENU: ['/menu', '/help'],
};

module.exports = {
  MAX_FILE_SIZE,
  DOWNLOAD_TIMEOUT,
  STICKER_NAME,
  STICKER_AUTHOR,
  USER_AGENT,
  PLATFORMS,
  COMMANDS,
};
