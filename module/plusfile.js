const filetocw = require('../suisho/file');
const messageedit = require('../suisho/message');

const randomId = require('random-id');

var randomIdlen = 30;
var randomIdpattern = 'aA0'


async function file(body, message, messageId, roomId, accountId) {
  if (message) {
    const url = body.replace(/\[To:\d+\]ゆずbotさん|\/file\/|\s+/g, "");
    const filename = randomId(randomIdlen, randomIdpattern);
    await filetocw.sendFile(roomId, url, filename, accountId, messageId);
  }else{
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n正しい画像URLを入力してね`, roomId);
  }
  return;
}

module.exports = {
    file
};
