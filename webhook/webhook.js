// ============================
// メッセージが更新された際の処理
// ============================

const messageedit = require('../suisho/message');

const omikuji = require('../module/omikuji');
const wakamesetup = require('../module/setup');
const wakameAI = require('../module/gemini');

async function getchat(req, res) { 
  console.log(req.body);

  const body = req.body.webhook_event.body;
  const message = req.body.webhook_event.body;
  const accountId = req.body.webhook_event.account_id;
  const roomId = req.body.webhook_event.room_id;
  const messageId = req.body.webhook_event.message_id;
  
  if (accountId === 9912086) {
    return res.sendStatus(200);
  }
  
  if (roomId === 401530604) {
    await wakameAI.chatwithAI(body, message, messageId, roomId, accountId);
    return res.sendStatus(200);
  }
  
  if (body.includes("[To:9912086]")) {
    return res.sendStatus(200);
  }

  if (message.includes("おみくじ")) {
    await omikuji.omikuji(body, message, messageId, roomId, accountId);
    return res.sendStatus(200);
  }
  
  if (message === "test tester") {
    await wakamesetup.test(body, message, messageId, roomId, accountId);
    return res.sendStatus(200);
  }
  
  if (/^\[info\]\[title\]\[dtext:chatroom_chat_edited\]\[\/title\]\[dtext:chatroom_member_is\]\[piconname:\d+\]\[dtext:chatroom_added\]\[\/info\]$/.test(message)) {
    await wakamesetup.welcomedayo(body, message, messageId, roomId, accountId);
    return res.sendStatus(200);
  }
  
  if (message === "[info][dtext:chatroom_chat_joined][/info]") {
    await wakamesetup.welcomenanodayo(body, message, messageId, roomId, accountId);
    return res.sendStatus(200);
  }

  res.sendStatus(200);
}

module.exports = getchat;