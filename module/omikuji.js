// ============================
// おみくじやら何やらの運ゲー。
// ===========================

const axios = require('axios');

const messageedit = require('../suisho/message');

async function userkuji(body, message, messageId, roomId, accountId) {
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let piconNames = [];
    for (let i = 0; i < 10; i++) {
        const randomID = getRandomNumber(1, 10007187);
        piconNames.push(`[piconname:${randomID}]`);
    }
    const ms = piconNames.join('\n');
    await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${ms}`,
    roomId
  );
  return;
}

async function omikuji(body, message, messageId, roomId, accountId) {
    const title = await randomTitle();
    const results = [
        "大吉",
        "中吉",
        "小吉",
        "吉",
        "凶",
        "大凶",
       ];

    const randomIndex = Math.floor(Math.random() * results.length);
    await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん[info]${results[randomIndex]}[/info]`,
    roomId
  );
  return
}



async function saikoro(body, message, messageId, roomId, accountId) {
  const saikoro = [...message.matchAll(/\d+(?=d)/g)].map((saikoro) => saikoro[0]);
  const men = [...message.matchAll(/(?<=d)\d+/g)].map((men) => men[0]);
  const number = [];
  for (let s = 0; s < saikoro; s++) {
    number.push(Math.floor(Math.random() * men) + 1);
  }
  const sum = number.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  if (saikoro == 1) {
    if (men > 0 && saikoro > 0) {
      messageedit.sendchatwork(
        `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n${number}`,
        roomId
      );
    } else {
      messageedit.sendchatwork(
        `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nダイスの数と面の数を指定してください`,
        roomId
      );
    }
  } else if (men > 0 && saikoro > 0) {
    messageedit.sendchatwork(
      `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n${number} ${
        "合計値" + sum
      }`,
      roomId
    );
  } else {
    messageedit.sendchatwork(
      `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nダイスの数と面の数を指定してください`,
      roomId
    );
  }
}

module.exports = {
    omikuji,
    userkuji,
    randomTitle,
    saikoro
};
