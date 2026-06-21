const { instagramGetUrl } = require('instagram-url-direct');
const { processMediaUrl, isMaxContentLengthError } = require('../utils/media');
const { IG_NO_MEDIA, MEDIA_TOO_LARGE, DOWNLOAD_FAILED } = require('../constants/messages');

async function downloadInstagramMedia(url, chat, asSticker) {
  const igRes = await instagramGetUrl(url);
  
  if (!igRes || !igRes.url_list || igRes.url_list.length === 0) {
    throw new Error(IG_NO_MEDIA);
  }

  for (const mediaUrl of igRes.url_list) {
    try {
      await processMediaUrl(mediaUrl, chat, asSticker);
    } catch (error) {
      if (isMaxContentLengthError(error)) {
        await chat.sendMessage(MEDIA_TOO_LARGE('Instagram'));
      } else {
        console.error('Gagal memproses salah satu media IG:', error.message);
      }
    }
  }
}

module.exports = { downloadInstagramMedia };
