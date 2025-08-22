// ============================
// YouTube関連のモジュール。
// ============================

const axios = require('axios');

const messageedit = require('../suisho/message');
const filetocw = require('../suisho/file');

//わかめtubeのURL
const wakametube = "wakametube";

//youtube
const YOUTUBE_URL = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w\-]+)/;

async function getwakametube(body, message, messageId, roomId, accountId) {
  const ms = message.replace(/\s+/g, "");
  const regex = /「(.*?)」/;
  const matchid = ms.match(regex);
  if (matchid && matchid[1]) {
    try{
      const searchQuery = matchid[1];
      console.log(`検索クエリ: ${searchQuery}`);

     const videoId3 = await getFirstVideoId(searchQuery)
  　　　　.then(videoId => {
         return videoId;
         });
     console.log(videoId3);
     const response = await axios.get(`${wakametube}${videoId3}`,);
     const videoData = response.data;
      
     const streamUrl = videoData.streamUrl;
     const videoTitle = videoData.videoTitle;
     const sssl = videoData.sssl;
     
    if (streamUrl) {
      await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}]\n${videoTitle}\n[code]${streamUrl}[/code]\nこちらのURLでも再生できるかもしれません\n[code]${sssl}[/code]`, roomId);
      await filetocw.sendFileyt(roomId, videoId3, videoTitle)
      return;
    }
    }catch (error) {
    await messageedit.sendchatwork("[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nエラーが発生しました。", messageId, roomId, accountId);
    return;
  }
  }
  
  const match = ms.match(YOUTUBE_URL);

  if (match) {
    const videoId = match[1];

    try {
      const response = await axios.get(`${wakametube}${videoId}`,);
      const videoData = response.data;
      const streamUrl = videoData.streamUrl;
      const videoTitle = videoData.videoTitle;
      const sssl = videoData.sssl;
      await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}]\n${videoTitle}\n[code]${streamUrl}[/code]\nこちらのURLでも再生できるかもしれません\n[code]${sssl}[/code]`, roomId);
      await filetocw.sendFileyt(roomId, videoId, videoTitle)
      return;
    } catch (error) {
      console.error("APIリクエストエラー:", error);
      await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nえらー。あらら。`, roomId);
      return;
    }
  } else {
    await messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nURLが無効です。正しいYouTubeのURLを入力してください。`, roomId);
  }
  return;
}

function getFirstVideoId(query) {
    return "";
}

module.exports = {
    getwakametube,
    getFirstVideoId
};
