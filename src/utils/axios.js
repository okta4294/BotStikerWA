const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const { MAX_FILE_SIZE, USER_AGENT } = require('../config');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  family: 4,
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

const axiosInstance = axios.create({
  maxContentLength: MAX_FILE_SIZE,
  maxBodyLength: MAX_FILE_SIZE,
  httpsAgent,
  headers: { 'User-Agent': USER_AGENT },
  responseType: 'arraybuffer',
  timeout: 60000,
});

function createMediaAxiosConfig(overrides = {}) {
  return {
    maxContentLength: MAX_FILE_SIZE,
    maxBodyLength: MAX_FILE_SIZE,
    httpsAgent,
    headers: { 'User-Agent': USER_AGENT },
    responseType: 'arraybuffer',
    timeout: 60000,
    ...overrides,
  };
}

module.exports = {
  axiosInstance,
  createMediaAxiosConfig,
  httpsAgent,
};
