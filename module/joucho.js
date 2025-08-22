//============================
// 冗長。
// ============================

const filetocw = require('../suisho/file');

//html取得
async function htmlget(body, message, messageId, roomId, accountId) {
    await filetocw.sendHtmlFile(roomId, body, accountId, messageId);
  return;
}

//スクリーンショット
async function shotget(body, message, messageId, roomId, accountId) {
    await filetocw.sendsiteshotFile(roomId, message, accountId, messageId);
  return;
}

async function imageAI(body, message, messageId, roomId, accountId) {
    await filetocw.generateImageAI(roomId, message, accountId, messageId);
  return;
}

async function ggimageAI(body, message, messageId, roomId, accountId) {
    await filetocw.gggenerateImageAI(roomId, message, accountId, messageId);
  return;
}

module.exports = {
    htmlget,
    shotget,
    imageAI,
    ggimageAI
};