const { downloadMediaWithTimeout, sendMedia } = require('../utils/media');
const { downloadInstagramMedia } = require('../services/instagram');
const { downloadTwitterMedia } = require('../services/twitter');
const { downloadTikTokMedia } = require('../services/tiktok');
const { downloadYouTubeMedia } = require('../services/youtube');
const { downloadThreadsMedia } = require('../services/threads');
const { extractUrl, getPlatform, isSupportedPlatform } = require('../utils/url');
const { PROCESSING_URL, MEDIA_PROCESS_FAILED, NO_MEDIA_OR_URL } = require('../constants/messages');
const { DOWNLOAD_TIMEOUT } = require('../config');

async function handleDirectMedia(msg, chat, quotedMsg) {
  const targetMsg = quotedMsg || msg;
  
  try {
    const media = await downloadMediaWithTimeout(targetMsg, DOWNLOAD_TIMEOUT);
    if (media) {
      console.log('Memproses media...');
      await sendMedia(chat, media, true);
      console.log('Media berhasil dikirim!');
      return true;
    }
  } catch (error) {
    console.error('Gagal downloadMedia:', error.message || error);
    await msg.reply(MEDIA_PROCESS_FAILED);
    return true;
  }
  return false;
}

async function handleUrlMedia(msg, chat, asSticker) {
  const url = extractUrl(msg.body);
  
  if (!url || !isSupportedPlatform(url)) {
    return false;
  }

  console.log('Mendownload dari URL:', url);
  await msg.reply(PROCESSING_URL);

  const platform = getPlatform(url);
  
  try {
    switch (platform) {
      case 'INSTAGRAM':
        await downloadInstagramMedia(url, chat, asSticker);
        break;
      case 'TWITTER':
        await downloadTwitterMedia(url, chat, asSticker);
        break;
      case 'TIKTOK':
        await downloadTikTokMedia(url, chat, asSticker);
        break;
      case 'YOUTUBE':
        await downloadYouTubeMedia(url, chat, asSticker);
        break;
      case 'THREADS':
        await downloadThreadsMedia(url, chat, asSticker);
        break;
      default:
        return false;
    }
    return true;
  } catch (error) {
    console.error('Gagal memproses URL:', error.message);
    await msg.reply(MEDIA_PROCESS_FAILED);
    return true;
  }
}

async function handleSticker(msg) {
  const chat = await msg.getChat();
  const text = msg.body.toLowerCase();
  const isSticker = text.includes('/sticker') || text.includes('/stiker');
  const isDownload = text.includes('/download') || text.includes('/dl');
  const asSticker = isSticker;

  if (msg.hasMedia) {
    return handleDirectMedia(msg, chat);
  }

  if (msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg && quotedMsg.hasMedia) {
      return handleDirectMedia(msg, chat, quotedMsg);
    }
  }

  return handleUrlMedia(msg, chat, asSticker);
}

module.exports = { handleSticker };
