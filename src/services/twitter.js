const axios = require('axios');
const { createMediaAxiosConfig } = require('../utils/axios');
const { processMediaUrl, isMaxContentLengthError } = require('../utils/media');
const { extractTweetId, cleanUrl } = require('../utils/url');
const { TWITTER_NO_MEDIA, TWITTER_ALL_FAILED, MEDIA_TOO_LARGE, DOWNLOAD_FAILED } = require('../constants/messages');

const { httpsAgent } = require('../utils/axios');

const axiosConfig = createMediaAxiosConfig();

async function fetchFromVxTwitter(tweetId) {
  const apiUrl = `https://api.vxtwitter.com/i/status/${tweetId}`;
  const response = await axios.get(apiUrl, axiosConfig);
  if (response.data && response.data.mediaURLs && response.data.mediaURLs.length > 0) {
    return response.data.mediaURLs;
  }
  throw new Error('vxtwitter: media tidak ditemukan');
}

async function fetchFromFxTwitter(tweetId) {
  const apiUrl = `https://api.fxtwitter.com/i/status/${tweetId}`;
  const response = await axios.get(apiUrl, axiosConfig);
  if (response.data && response.data.tweet && response.data.tweet.media && response.data.tweet.media.all) {
    return response.data.tweet.media.all.map(m => m.url);
  }
  throw new Error('fxtwitter: media tidak ditemukan');
}

async function fetchFromBtchDownloader(url) {
  const { twitter: btchTwitter } = require('btch-downloader');
  const btchRes = await btchTwitter(url);
  if (btchRes && btchRes.url && btchRes.url.length > 0) {
    return btchRes.url.filter(u => u.url).map(u => u.url);
  }
  throw new Error('btch-downloader: media tidak ditemukan');
}

async function getTwitterMediaUrls(url) {
  const tweetId = extractTweetId(url);
  let lastError;

  try {
    return await fetchFromVxTwitter(tweetId);
  } catch (err) {
    console.log('vxtwitter gagal, mencoba fxtwitter...', err.message);
    lastError = err;
  }

  try {
    return await fetchFromFxTwitter(tweetId);
  } catch (err) {
    console.log('fxtwitter gagal, mencoba btch-downloader...', err.message);
    lastError = err;
  }

  try {
    return await fetchFromBtchDownloader(url);
  } catch (err) {
    console.log('btch-downloader gagal', err.message);
    lastError = err;
  }

  throw new Error(TWITTER_ALL_FAILED(lastError.message));
}

async function downloadTwitterMedia(url, chat, asSticker) {
  const mediaUrls = await getTwitterMediaUrls(url);
  
  if (mediaUrls.length === 0) {
    throw new Error(TWITTER_NO_MEDIA);
  }

  for (const mediaUrl of mediaUrls) {
    try {
      await processMediaUrl(mediaUrl, chat, asSticker);
    } catch (error) {
      if (isMaxContentLengthError(error)) {
        await chat.sendMessage(MEDIA_TOO_LARGE('X/Twitter'));
      } else {
        await chat.sendMessage(DOWNLOAD_FAILED('X/Twitter', error.message));
      }
    }
  }
}

module.exports = { downloadTwitterMedia };