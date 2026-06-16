# Agent Documentation for Bot Stiker Project

## Project Overview
This project is a WhatsApp bot built with `whatsapp-web.js` that allows users to send and receive stickers via WhatsApp. The bot is written in JavaScript and runs on Node.js.

## Key Features
- QR code based authentication with persistent session storage (`.wwebjs_auth` folder).
- Sticker generation from images or URLs.
- Simple command interface (extendable) for sending stickers.
- Uses `axios` for HTTP requests and `ffmpeg-static` for video processing if needed.

## Project Structure
```
/ (root)
│
├─ index.js          # Main entry point – starts the WhatsApp client
├─ package.json      # npm metadata and scripts
├─ package-lock.json # Locked dependency versions
├─ node_modules/     # Installed npm packages (generated)
└─ .wwebjs_auth/     # Session data (created after first login)
```

## How to Run
1. **Prerequisites**
   - Node.js (>=14) installed.
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
- **Add New Commands**: Modify `index.js` where the message handler is defined. Look for `client.on('message', async msg => { ... })`.
- **Sticker Generation**: Use existing helper functions or integrate with external image processing libraries (e.g., `sharp`, `jimp`).
- **Configuration**: For environment‑specific values (API keys, etc.), consider using a `.env` file and the `dotenv` package.

## Testing
Currently there is no formal test suite. To verify functionality:
- Run the bot and send test messages in a private chat or with a secondary WhatsApp number.
- Check console output for logs and errors.

## Notes
- Keep `.wwebjs_auth/` directory backed up if you want to preserve sessions across machines.
- Do not commit `node_modules/` or `.wwebjs_auth/` to version control (they are already ignored implicitly).
- Update dependencies periodically with `npm update` or `npm audit fix`.

## License
ISC – see `package.json`.

---
*This document serves as a reference for developers or AI agents working on the Bot Stiker project. Adjust as the project evolves.*