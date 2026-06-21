const { youtube } = require('btch-downloader');
const { processMediaUrl, isMaxContentLengthError } = require('../utils/media');
const { YOUTUBE_NO_FORMAT, MEDIA_TOO_LARGE, DOWNLOAD_FAILED } = require('../constants/messages');

async function downloadYouTubeMedia(url, chat, asSticker) {
  const ytRes = await youtube(url);
  
  if (!ytRes || !ytRes.status || !ytRes.mp4) {
    throw new Error(YOUTUBE_NO_FORMAT);
  }

  try {
    await processMediaUrl(ytRes.mp4, chat, asSticker);
  } catch (error) {
    if (isMaxContentLengthError(error)) {
      await chat.sendMessage(MEDIA_TOO_LARGE('YouTube'));
    } else {
      await chat.sendMessage(DOWNLOAD_FAILED('YouTube', error.message));
    }
  }
}

module.exports = { downloadYouTubeMedia };
