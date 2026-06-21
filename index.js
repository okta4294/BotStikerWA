const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const { handleMessage } = require('./src/handlers/message');
const { BOT_READY, NOTIFICATION_SENT, NOTIFICATION_FAILED, BOT_DISCONNECTED, BOT_RESTARTING } = require('./src/constants/messages');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.env.PATH = path.dirname(ffmpegPath) + path.delimiter + process.env.PATH;

const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: ffmpegPath,
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('Scan QR Code ini menggunakan WhatsApp Anda:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log(BOT_READY);
  try {
    const myNumber = client.info.wid._serialized;
    console.log('Mencoba mengirim notifikasi ke nomor:', myNumber);
    await client.sendMessage(myNumber, 'Aktif boloo');
    console.log(NOTIFICATION_SENT);
  } catch (e) {
    console.error(NOTIFICATION_FAILED(e));
  }
});

client.on('message', handleMessage);

client.on('disconnected', (reason) => {
  console.log(BOT_DISCONNECTED(reason));
  console.log(BOT_RESTARTING);
  process.exit(1);
});

client.initialize();
