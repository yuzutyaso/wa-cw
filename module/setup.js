// ============================
// 基礎的なもの。その他もろもろ
// ===========================

const randomId = require('random-id');

var randomIdlen = 30;
var randomIdpattern = 'aA0'

const messageedit = require('../suisho/message');
const getCWdata = require('../suisho/cwdata');

//Help
async function wakamehelp(body, message, messageId, roomId, accountId) {
  await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん[info][title]ヘルプ[/title]こんにちは！これはゆずbotのヘルプです。[/info]`,
    roomId
  );
}

//SetUp
async function wakamesetup(body, message, messageId, roomId, accountId) {
  await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん[info][title]ヘルプ[/title]こんにちは！これはゆずbotのヘルプです。[/info]`,
    roomId
  );
}

//test
async function test(body, message, messageId, roomId, accountId) {
  await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nそれについて、おk`,
    roomId
  );
}

//ようこそ！
async function welcomedayo(body, message, messageId, roomId, accountId) {
  const welcomeId = (message.match(/\[piconname:(\d+)\]/) || [])[1];
  
  const memberinfo = await getCWdata.getChatworkMember(roomId, welcomeId);
  
  await messageedit.sendchatwork(
    `[rp aid=${welcomeId} to=${roomId}-${messageId}][pname:${welcomeId}]さん\nようこそ！あなたのアカウント情報を解析中です...`,
    roomId
  );
  await new Promise(resolve => setTimeout(resolve, 5000));
  await messageedit.sendchatwork(
    `[info][title]解析データ[/title]name: ${memberinfo.name}\naccountId: ${memberinfo.account_id}\nuserId: ${memberinfo.chatwork_id}\norganizationId: ${memberinfo.organization_id}[/info]
    [info]アカウントへのログインを試みています...[/info]`,
    roomId
  );
  const randomValue = Math.random();
  await new Promise(resolve => setTimeout(resolve, 5000));
  if (randomValue < 0.3) {
   await messageedit.sendchatwork(
    `[info]require(pass)\ntoken: ok\n[picon:${welcomeId}]のアカウントのログインに成功しました☑️[/info]`,
    roomId
   );
  } else{
   await messageedit.sendchatwork(
    `[info]Error: pass is required!\n[picon:${welcomeId}]のアカウントの正しいパスワードを取得できませんでした[/info]`,
    roomId
   );
  }
  return;
}

async function welcomenanodayo(body, message, messageId, roomId, accountId) {
  const welcomeId = accountId;
  
  const memberinfo = await getCWdata.getChatworkMember(roomId, welcomeId);
  
  await messageedit.sendchatwork(
    `[rp aid=${welcomeId} to=${roomId}-${messageId}][pname:${welcomeId}]さん\nようこそ！あなたのアカウント情報を解析中です...`,
    roomId
  );
  await new Promise(resolve => setTimeout(resolve, 5000));
  await messageedit.sendchatwork(
    `[info][title]解析データ[/title]name: ${memberinfo.name}\naccountId: ${memberinfo.account_id}\nuserId: ${memberinfo.chatwork_id}\norganizationId: ${memberinfo.organization_id}[/info]
    [info]アカウントへのログインを試みています...[/info]`,
    roomId
  );
  const randomValue = Math.random();
  await new Promise(resolve => setTimeout(resolve, 5000));
  if (randomValue < 0.3) {
   await messageedit.sendchatwork(
    `[info]require(pass)\ntoken: ok\n[picon:${welcomeId}]のアカウントのログインに成功しました☑️[/info]`,
    roomId
   );
  } else{
   await messageedit.sendchatwork(
    `[info]Error: pass is required!\n[picon:${welcomeId}]のアカウントの正しいパスワードを取得できませんでした[/info]`,
    roomId
   );
  }
  return;
}

module.exports = {
    wakamehelp,
    wakamesetup,
    test,
    welcomedayo
};
