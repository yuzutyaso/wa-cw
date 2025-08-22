// ============================
// Make it a quote用のモジュール。
// ============================

const axios = require('axios');
const CHATWORK_API_TOKEN = process.env.CHATWORK_API_TOKENmain;

const filetocw = require('../suisho/file');

//Makeitaquote
async function makeitaquote(body, message, messageId, roomId, accountId) {
  const chatworkUrl = body.replace(/\[To:\d+\]和歌さん|\/miaq\/|\s+/g, "");
  const miaqIds = [...chatworkUrl.matchAll(/(?<=rid\d+-)(\d+)/g)].map(match => match[0]);
  const roomIds = [...chatworkUrl.matchAll(/(?<=rid)(\d+)(?=-)/g)].map(match => match[0]);
  if (miaqIds.length === 0) {
    return;
  }

  for (let i = 0; i < miaqIds.length; i++) {
    const messageId = miaqIds[i];
    const roomIddesu = roomIds[i];
    const url = `https://api.chatwork.com/v2/rooms/${roomIddesu}/messages/${messageId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'x-chatworktoken': CHATWORK_API_TOKEN,
        }
      });
      
      const name = response.data.account.name;
      const imageUrl1 = response.data.account.avatar_image_url;
      const imageUrl = imageUrl1.replace(/rsz\./g, '');
      const acid = response.data.account.account_id;
      const ms = response.data.body;
      
      const message1 = ms.replace(/\[To:\d+\]/g, '@');
      const message = message1.replace(/\[rp aid=\d+ to=\d+-\d+\]/g, '@');
      console.log(name);
      console.log(imageUrl);
      console.log(acid);
      console.log(message);
      await filetocw.sendmiaq(roomId, imageUrl, name, message, acid);
      
    } catch (err) {
      console.error(`miaq error`, err.response ? err.response.data : err.message);
    }
  }
}

module.exports = makeitaquote;