const FormData = require('form-data');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const randomId = require('random-id');
const axios = require('axios');
const miniget = require("miniget");

const messageedit = require('../suisho/message');
const fileedit = require('../suisho/file');
const cwData = require('../suisho/cwdata');

const momo = require('../req/doujin');

const CHATWORK_API_TOKEN = process.env.jihouCHATWORK_API_TOKEN;

var randomIdlen = 30;
var randomIdpattern = 'aA0'

const trustroom = [382774811,383920733];

//ファイル送信
async function sendFile(roomId, url, filename,  accountId, messageId, message) {
  try {
    const outputDir = path.join(__dirname, '..', 'image');
    const fileId = randomId(randomIdlen, randomIdpattern);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const formData = new FormData();
    formData.append("file", miniget(url), {
      filename: `${filename}ページ-${roomId}-${fileId}.jpg`,
    });
    if (accountId){
      if (message){
        formData.append('message', `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${message}`);
      }else{
        formData.append('message', `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん`);
      }
    };

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });
  } catch (error) {
    console.error('ファイル送信でエラーが発生しました');
    throw error;
  }
}

async function search(body, message, messageId, roomId, accountId) {
  if (!trustroom.includes(roomId)) {
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nError:許可されていない`, roomId);
    return;
  }
  try {
    const results = await momo.search(message);
    if (results && results.length > 0) {
      const randomIndex = Math.floor(Math.random() * results.length);
      const selectedItem = results[randomIndex];
      await fileedit.doujin(roomId, selectedItem.image, accountId, messageId, selectedItem.title, selectedItem.rule);
    } else {
      await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nごめん、見つかんないわ`,roomId);
      return;
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nエラー、あらら`,roomId);
    return;
  }
}

async function wakamedo(body, message, messageId, roomId, accountId) {
  try {
    const djmessageIds = [...body.matchAll(/(?<=to=\d+-)(\d+)/g)].map(match => match[0]);
    const ddId = `${djmessageIds[0]}`;
    const djmessage = await cwData.getChatworkmessage(roomId, ddId);
    const ms = djmessage.body;
    const regex = new RegExp(`${roomId}-([^\\s-]+)-`);
    const id = ms.match(regex);
    const rule = id[1].substring(0, 2);
    if(!id){
      return;
    }
    if (rule === "re" || rule === "mo") {
      moredoujin(id, roomId, accountId, messageId);
    }
    if (rule === "sm") {
      smdoujin(id, roomId, accountId, messageId);
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    await messageedit.sendchatwork(roomId, `エラーが発生しました:${error}`);
  }
}

async function moredoujin(id, roomId, accountId, messageId){
  try{
    let data = "";
    if(id[1].includes("re")){
      data = await momo.nyadoujin(id[1]);
    }
    if(id[1].includes("mo")){
      data = await momo.doujin(id[1]);
    }
    if(!data){
      return;
    }
    const InfoMessage = `タイトル: ${data.title}\nページ数: ${data.pages}\n作者: ${data.authors ?? '不明'}\nサークル: ${data.circle ?? '不明'}`;
    await sendFile(roomId, `${data.imageUrls[0]}`, 1, accountId, messageId, InfoMessage);
    for (var i = 1; i < data.imageUrls.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await sendFile(roomId, `${data.imageUrls[i]}`, i + 1);
    }
  }catch(error){
    console.log('エラーが発生しました:', error);
    await messageedit.sendchatwork(roomId, `エラーが発生しました:${error}`);
  }
}

async function smdoujin(id, roomId, accountId, messageId){
  try{
    console.log("スマート同人");
    const comicId = id[1].slice(2);
    console.log(comicId);
    const data = await momo.smdoujin(comicId);
    if(!data){
      return;
    }
    console.log(data);
    const InfoMessage = `タイトル: ${data.title}\nページ数: ${data.pages ?? '不明'}\n作者: ${data.authors ?? '不明'}\nサークル: ${data.circle ?? '不明'}`;

    await sendFile(roomId, `${data.imageUrl}001.jpg`, 1, accountId, messageId, InfoMessage);
    let pageIndex = 2;
    const maxPages = 500;
    while(pageIndex <= maxPages){
      await new Promise(resolve => setTimeout(resolve, 5000));
      const pageNumberStr = String(pageIndex).padStart(3, '0');
      const imageUrl = `${data.imageUrl}${pageNumberStr}.jpg`;
      try{
        await sendFile(roomId, imageUrl, pageIndex);
        pageIndex++;
      } catch(err){
        break;
      }
    }
  }catch(error){
    console.log('エラーが発生しました:', error);
    await messageedit.sendchatwork(roomId, `エラーが発生しました:${error}`);
  }
}


module.exports = {
    search,
    wakamedo
};
