const { handleSticker } = require('./sticker');
const { COMMANDS } = require('../config');
const { MENU, NO_MEDIA_OR_URL, COPY_PASTE_REPLY } = require('../constants/messages');

function isCommand(text, commands) {
  return commands.some(cmd => text.includes(cmd));
}

async function handleMessage(msg) {
  try {
    const chat = await msg.getChat();
    const text = msg.body.toLowerCase();

    if (text.includes('sedang mencoba ')) {
      await msg.reply(COPY_PASTE_REPLY);
      return;
    }

    const isSticker = isCommand(text, COMMANDS.STICKER);
    const isDownload = isCommand(text, COMMANDS.DOWNLOAD);
    const isMenu = isCommand(text, COMMANDS.MENU);

    if (isMenu) {
      await msg.reply(MENU);
      return;
    }

    if (isSticker || isDownload) {
      const handled = await handleSticker(msg);
      if (!handled) {
        await msg.reply(NO_MEDIA_OR_URL);
      }
      return;
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

module.exports = { handleMessage };
