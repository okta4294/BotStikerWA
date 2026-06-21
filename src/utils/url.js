const { PLATFORMS } = require('../config');

function extractUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

function getPlatform(url) {
  if (!url) return null;
  const lowerUrl = url.toLowerCase();
  for (const [platform, domains] of Object.entries(PLATFORMS)) {
    if (domains.some(domain => lowerUrl.includes(domain))) {
      return platform;
    }
  }
  return null;
}

function isSupportedPlatform(url) {
  return getPlatform(url) !== null;
}

function cleanUrl(url) {
  return url.split('?')[0];
}

function extractTweetId(url) {
  const clean = cleanUrl(url);
  return clean.split('/').pop();
}

module.exports = {
  extractUrl,
  getPlatform,
  isSupportedPlatform,
  cleanUrl,
  extractTweetId,
};
