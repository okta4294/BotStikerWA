const { ttdl } = require('btch-downloader');
const { processMediaUrl, isMaxContentLengthError } = require('../utils/media');
const { TIKTOK_API_FAILED, TIKTOK_NO_VIDEO, MEDIA_TOO_LARGE, DOWNLOAD_FAILED } = require('../constants/messages');
const { createMediaAxiosConfig } = require('../utils/axios');

const axiosConfig = createMediaAxiosConfig();

function extractVideoUrl(ttRes) {
  if (!ttRes.video || ttRes.video.length === 0) {
    return null;
  }

  const firstItem = ttRes.video[0];
  
  if (typeof firstItem === 'string') {
    return firstItem;
  }

  if (firstItem && typeof firstItem === 'object') {
    const noWm = ttRes.video.find(v => 
      v.type === 'nowm' || 
      (v.url && (v.url.includes('nowatermark') || v.url.includes('no_wm')))
    );
    return noWm ? noWm.url : firstItem.url;
  }

  return null;
}

async function downloadTikTokMedia(url, chat, asSticker) {
  const ttRes = await ttdl(url);
  
  if (!ttRes || !ttRes.status) {
    throw new Error(TIKTOK_API_FAILED);
  }

  const videoUrl = extractVideoUrl(ttRes);
  
  if (!videoUrl) {
    throw new Error(TIKTOK_NO_VIDEO);
  }

  try {
    await processMediaUrl(videoUrl, chat, asSticker, { 
      headers: { 'Referer': 'https://www.tiktok.com/' } 
    });
  } catch (error) {
    if (isMaxContentLengthError(error)) {
      await chat.sendMessage(MEDIA_TOO_LARGE('TikTok'));
    } else {
      await chat.sendMessage(DOWNLOAD_FAILED('TikTok', error.message));
    }
  }
}

module.exports = { downloadTikTokMedia };
