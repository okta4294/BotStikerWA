const { MessageMedia } = require('whatsapp-web.js');
const { axiosInstance, createMediaAxiosConfig } = require('./axios');
const { MAX_FILE_SIZE, STICKER_NAME, STICKER_AUTHOR } = require('../config');

async function downloadMediaWithTimeout(msgTarget, timeoutMs) {
  return Promise.race([
    msgTarget.downloadMedia(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Download timeout (Media mungkin sudah expired)')), timeoutMs)
    ),
  ]);
}

function createMessageMedia(mimetype, data, filename = 'media') {
  return new MessageMedia(mimetype, data, filename);
}

function createStickerOptions() {
  return {
    sendMediaAsSticker: true,
    stickerName: STICKER_NAME,
    stickerAuthor: STICKER_AUTHOR,
  };
}

async function downloadAndCreateMedia(url, config = {}) {
  const response = await axiosInstance.get(url, config);
  const mimetype = response.headers['content-type'] || 'application/octet-stream';
  const data = Buffer.from(response.data, 'binary').toString('base64');
  return createMessageMedia(mimetype, data);
}

async function sendMedia(chat, media, asSticker = false) {
  return chat.sendMessage(media, asSticker ? createStickerOptions() : undefined);
}

async function processMediaUrl(url, chat, asSticker = false, extraConfig = {}) {
  const media = await downloadAndCreateMedia(url, extraConfig);
  await sendMedia(chat, media, asSticker);
}

function isMaxContentLengthError(error) {
  return error.message && error.message.includes('maxContentLength');
}

module.exports = {
  downloadMediaWithTimeout,
  createMessageMedia,
  createStickerOptions,
  downloadAndCreateMedia,
  sendMedia,
  processMediaUrl,
  isMaxContentLengthError,
};
