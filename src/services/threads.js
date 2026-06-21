const { threads } = require('btch-downloader');
const { processMediaUrl, isMaxContentLengthError } = require('../utils/media');
const { THREADS_NO_MEDIA, THREADS_FORMAT_UNKNOWN, MEDIA_TOO_LARGE, DOWNLOAD_FAILED } = require('../constants/messages');

async function downloadThreadsMedia(url, chat, asSticker) {
  const threadsRes = await threads(url);
  
  if (!threadsRes || !threadsRes.result) {
    throw new Error(THREADS_NO_MEDIA);
  }

  const downloadUrl = threadsRes.result.video || threadsRes.result.image || threadsRes.result.download;
  
  if (!downloadUrl) {
    throw new Error(THREADS_FORMAT_UNKNOWN);
  }

  try {
    await processMediaUrl(downloadUrl, chat, asSticker);
  } catch (error) {
    if (isMaxContentLengthError(error)) {
      await chat.sendMessage(MEDIA_TOO_LARGE('Threads'));
    } else {
      await chat.sendMessage(DOWNLOAD_FAILED('Threads', error.message));
    }
  }
}

module.exports = { downloadThreadsMedia };
