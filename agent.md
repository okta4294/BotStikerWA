# Agent Documentation for Bot Stiker Project

## Project Overview
This project is a WhatsApp bot built with `whatsapp-web.js` that allows users to send and receive stickers via WhatsApp. The bot is written in JavaScript and runs on Node.js. It has evolved into a versatile media downloader bot supporting multiple social platforms.

## Key Features
- **Authentication**: QR code based authentication with persistent session storage (`.wwebjs_auth` folder).
- **Sticker Generation**: Automatic sticker creation from images, videos, or GIFs via the `/sticker` command.
- **Social Media Downloader**: 
  - Supports downloading from **Instagram** (via `instagram-url-direct`).
  - Supports downloading from **Twitter / X** (via public APIs like fxtwitter/vxtwitter and `btch-downloader`).
  - Supports downloading from **YouTube** (via `btch-downloader`).
  - Supports downloading from **TikTok** (via `btch-downloader` `ttdl` — returns no-watermark video when available).
  - Supports downloading from **Threads** (via `btch-downloader`).
- **Commands Available**:
  - `/sticker` (or `/stiker`): Convert media or links into stickers.
  - `/download` (or `/dl`): Download media from links (IG/X/YT/TT/Threads) and send it as normal video/image.
  - `/menu` (or `/help`): Display the help menu.
- **Safety & Stability**: 
  - Implements a 50MB file size limit (`maxContentLength`) for Axios requests to prevent Puppeteer memory crashes (`Target closed` errors).
  - Handles `downloadMedia()` try-catch blocks to prevent unhandled promise rejections on expired or large WhatsApp media.
  - Auto-exit on `disconnected` event to allow process managers (like pm2) to restart the bot automatically.

## Project Structure
```
/ (root)
│
├─ index.js              # Main entry point – initializes client, registers handlers
├─ package.json          # npm metadata and scripts
├─ package-lock.json     # Locked dependency versions
├─ node_modules/         # Installed npm packages
├─ .wwebjs_auth/         # Session data (created after first login)
└─ src/
   ├─ config/
   │   └─ index.js       # Centralized configuration (limits, metadata, timeouts)
   ├─ constants/
   │   └─ messages.js    # All reply templates
   ├─ utils/
   │   ├─ axios.js       # Shared axios instance with custom HTTPS agent
   │   ├─ url.js         # URL extraction & platform detection
   │   └─ media.js       # Media download/convert helpers
   ├─ services/          # Platform-specific downloaders
   │   ├─ instagram.js
   │   ├─ twitter.js     # Fallback chain: vxtwitter → fxtwitter → btch-downloader
   │   ├─ tiktok.js
   │   ├─ youtube.js
   │   └─ threads.js
   └─ handlers/
       ├─ sticker.js     # Sticker/download logic (media, reply, URL)
       └─ message.js     # Main message router
```

## How to Run
1. **Prerequisites**
   - Node.js (>=18 recommended) installed.
   - Internet connectivity for QR code scan and external API calls.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Bot**
   ```bash
   npm start
   # or
   node index.js
   ```

4. **First‑time Login**
   - Scan the QR code displayed in the terminal using WhatsApp (Linked Devices → Link a Device).
   - After successful login, a session is saved under `.wwebjs_auth/` so future runs do not require rescanning.

## Extending the Bot
- **Add New Commands**: Modify `src/handlers/message.js` in the `handleMessage` function.
- **Add New Downloader**: 
  1. Create a new service in `src/services/` (e.g., `newplatform.js`)
  2. Export a `downloadNewPlatformMedia(url, chat, asSticker)` function
  3. Register it in `src/handlers/sticker.js` in the `handleUrlMedia` switch statement
  4. Use shared utilities: `createMediaAxiosConfig()` from `../utils/axios`, `processMediaUrl()` from `../utils/media`

## Known Issues & Workarounds
- **"Target closed" Error**: Occurs when Puppeteer's internal browser crashes. This is mitigated by restricting large video downloads (>50MB).
- **Twitter Fetch Failing**: Uses custom HTTPS agent (`rejectUnauthorized: false`, IPv4 forced) to bypass "fetch failed" or EPROTO bugs on Windows Node.js environments when hitting Cloudflare-protected APIs.

## License
ISC – see `package.json`.

---
*This document serves as a reference for developers or AI agents working on the Bot Stiker project. Adjust as the project evolves.*