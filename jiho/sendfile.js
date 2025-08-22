const FormData = require('form-data');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const randomId = require('random-id');
const axios = require('axios');
const { DateTime } = require('luxon');
const geminiAPIKey = process.env.GEMINI_API;

const reqnews = require('../req/news');
const r34 = require('../req/34');
const reqkawaii = require('../req/kawaii');
const reqwaifu = require('../req/waifu');

const messageedit = require('../suisho/message');

const CHATWORK_API_TOKEN = process.env.jihouCHATWORK_API_TOKEN;

var randomIdlen = 30;
var randomIdpattern = 'aA0'

const trustroom = [382774811,383920733];

async function sendFile(roomId, url) {
  try {
    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const localFilePath = path.join(outputDir, `${roomId}-${fileId}.jpeg`);
    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const bufferjpeg = await sharp(imageBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    fs.writeFileSync(localFilePath, bufferjpeg);
    
    const japanTime = DateTime.now().setZone('Asia/Tokyo');
    const timenow = japanTime.toFormat('H時m分');
    
    const newsde = await reqnews.JapaneseNews();
    console.log(newsde);
    const pnprompt = `以下のニュース内容を「どこどこでなになにがあったみたい。楽しそうだねぇ」と言った40字以内のフランクな内容に日本語に変換してください。${newsde}`;
    const teresponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiAPIKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: pnprompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseContent = teresponse.data.candidates[0].content;
    let responseParts = responseContent.parts.map((part) => part.text).join("\n");
    responseParts = responseParts.replace(/\*/g, "");
    
    const formData = new FormData();
    formData.append('message', `[info][title]${timenow}をおしらせ[/title]${responseParts}[/info]`);
    formData.append('file', fs.createReadStream(localFilePath));

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });

    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('ファイル送信でエラーが発生しました', error);
  }
}

//ロリ時報！
async function Lolijiho(roomId) {
  try {
    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const localFilePath = path.join(outputDir, `${roomId}-${fileId}.jpeg`);
    
    const r34Utils = new r34();
    
    const results = [
      "kani_biimu",
      "nanao_naru",
      "karory",
      "muninshiki",
      "ramchi",
      "professor_niyaniya",
      "namikishiho",
      "oryou",
      "miyasaka_naco",
      "kino"
    ];
    const text = Math.floor(Math.random() * results.length);
    
    const imageUrls = [];
    imageUrls.push(...await r34Utils.getImageURLFromSearch(`https://yande.re/post.xml?limit=250&tags=${results[text]}`));
    
    const url = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const bufferjpeg = await sharp(imageBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    fs.writeFileSync(localFilePath, bufferjpeg);
    
    const japanTime = DateTime.now().setZone('Asia/Tokyo');
    const timenow = japanTime.toFormat('H時m分');
    
    const formData = new FormData();
    formData.append('message', `[info]${timenow}をおしらせ[/info]`);
    formData.append('file', fs.createReadStream(localFilePath));

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });

    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('ファイル送信でエラーが発生しました', error);
  }
}

//画像のおまかせ表示
async function omakasendFile(body, message, messageId, roomId, accountId) {
  try {
    const url = `https://pic.re/image?in=${message}`;
    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const localFilePath = path.join(outputDir, `${roomId}-${fileId}.jpeg`);
    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const bufferjpeg = await sharp(imageBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    fs.writeFileSync(localFilePath, bufferjpeg);
    
    const formData = new FormData();
    formData.append('message', `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん`);
    formData.append('file', fs.createReadStream(localFilePath));

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });

    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('ファイル送信でエラーが発生しました', error);
  }
}

//ふぉおおおおおおおおお
async function rrr34(body, message, messageId, roomId, accountId) {
  if (!trustroom.includes(roomId)) {
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nError:許可されていない`, roomId);
    return;
  }
  try {
    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const localFilePath = path.join(outputDir, `${roomId}-${fileId}.jpeg`);
    
    const r34Utils = new r34();
    const url = await r34Utils.getImageUrl(message);
    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const bufferjpeg = await sharp(imageBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    fs.writeFileSync(localFilePath, bufferjpeg);
    
    const formData = new FormData();
    formData.append('message', `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん`);
    formData.append('file', fs.createReadStream(localFilePath));

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });

    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('ファイル送信でエラーが発生しました', error);
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nごめん、見つかんないわ`, roomId);
  }
}

//GIF画像
async function gif(body, message, messageId, roomId, accountId) {
  try {
    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const kawawords = ["alarm", "amazing", "ask", "baka", "bite", "blush", "blyat", "boop", "clap", "coffee", "confused", "cry", "cuddle", "cute", "dance", "destroy", "die", "disappear", "dodge", "error", "facedesk", "facepalm", "fbi", "fight", "happy", "hide", "highfive", "hug", "kill", "kiss", "laugh", "lick", "lonely", "love", "mad", "money", "nom", "nosebleed", "ok", "party", "pat", "peek", "poke", "pout", "protect", "puke", "punch", "purr", "pusheen", "run", "salute", "scared", "scream", "shame", "shocked", "shoot", "shrug", "sip", "sit", "slap", "sleepy", "smile", "smoke", "smug", "spin", "stare", "stomp", "tickle", "trap", "triggered", "uwu", "wasted", "wave", "wiggle", "wink", "yeet"];
    
    if(!message){
      message = kawawords[Math.floor(Math.random() * kawawords.length)];
    }
    
    const url = await reqkawaii.gif(message);
    
    const localFilePath = path.join(outputDir, `${roomId}-${message}-${fileId}.jpeg`);
    
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(localFilePath, imageBuffer);
    
    const formData = new FormData();
    formData.append('message', `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん`);
    formData.append('file', fs.createReadStream(localFilePath));

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });

    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('ファイル送信でエラーが発生しました', error);
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nごめん、見つかんないわ`, roomId);
  }
}

//ランダムキャラ
async function waifu(body, message, messageId, roomId, accountId) {
  try {
    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const localFilePath = path.join(outputDir, `${roomId}-${fileId}.jpeg`);
    
    const info = await reqwaifu.waifu("waifu");
    
    const name = info.name.native;
    const image = info.image.large;
    const des = info.description;
    const age = info.age;
    const se = info.gender;
    
    console.log(name);
    console.log(des);
    const pnprompt = `次のアニメまたは漫画のキャラクターについて簡単にまとめる文章を作って。既存のネット情報を使っても構いません。「${name}」{$des}`;
    const teresponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiAPIKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: pnprompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseContent = teresponse.data.candidates[0].content;
    let responseParts = responseContent.parts.map((part) => part.text).join("\n");
    responseParts = responseParts.replace(/\*/g, "");
    
    const response = await axios.get(image, { responseType: 'arraybuffer' });
    const imageBuffer = response.data;
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(localFilePath, imageBuffer);
    
    const formData = new FormData();
    formData.append('message', `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${responseParts}`);
    formData.append('file', fs.createReadStream(localFilePath));

    const uploadUrl = `https://api.chatwork.com/v2/rooms/${roomId}/files`;
    const headers = {
      ...formData.getHeaders(),
      'x-chatworktoken': CHATWORK_API_TOKEN,
    };

    const uploadResponse = await axios.post(uploadUrl, formData, { headers });

    fs.unlinkSync(localFilePath);
  } catch (error) {
    console.log('ファイル送信でエラーが発生しました', error);
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nごめん、見つかんないわ`, roomId);
  }
}

module.exports = {
    sendFile,
    Lolijiho,
    omakasendFile,
    rrr34,
    gif,
    waifu
};
