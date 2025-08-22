const FormData = require('form-data');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const randomId = require('random-id');
const axios = require('axios');
const { DateTime } = require('luxon');
const geminiAPIKey = process.env.GEMINI_API;

const sendfile = require('../jihou/sendfile');
const messageedit = require('../suisho/message');

const ranking = require('../module/tops');

const CHATWORK_API_TOKEN = process.env.jihouCHATWORK_API_TOKEN;
const apiKey = process.env.newskey;

var randomIdlen = 30;
var randomIdpattern = 'aA0'

async function jihou(req, res) {
  const Id = req.body.checkId;
  console.log(Id)
  if (Id === "ranking") {
    await ranking.top(396176442);
    await ranking.save();
    return res.sendStatus(200);
  }
  
  res.sendStatus(200);
}

async function jihoum(body, message, messageId, roomId, accountId) {
  const randomValue = Math.random();
  if (randomValue < 0.1) {
    await sendfile.sendFile(roomId, "https://pic.re/image");
    return;
  } else {
    await sendfile.Lolijiho(roomId);
    return;
  } 
}

async function omakasendFile(body, message, messageId, roomId, accountId) {
  await sendfile.omakasendFile(body, message, messageId, roomId, accountId);
}

async function gif(body, message, messageId, roomId, accountId) {
  await sendfile.gif(body, message, messageId, roomId, accountId);
}

async function waifu(body, message, messageId, roomId, accountId) {
  await sendfile.waifu(body, message, messageId, roomId, accountId);
}

async function rimage(body, message, messageId, roomId, accountId) {
    const allowedRoomIds = [382774811, 383920733, 366961386, 384781317, 379850565];
    if (!allowedRoomIds.includes(roomId)) {
        await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nこのルームではharusameコマンドの利用が許可されていません`, roomId);
        return;
    }
    try {
    await sendfile.rrr34(body, message, messageId, roomId, accountId);
    } catch(error) {
        await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nエラー、あらら。`, roomId);
        return;
    }
}

module.exports = {
    jihou,
    jihoum,
    rimage,
    gif,
    waifu,
    omakasendFile
};
