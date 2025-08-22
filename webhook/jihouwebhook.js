const axios = require('axios');

const CHATWORK_API_TOKEN = process.env.jihouCHATWORK_API_TOKEN

async function mentionWebhook(req, res) {
    const accountId = req.body.webhook_event.from_account_id;
    const roomId = req.body.webhook_event.room_id;
    const messageId = req.body.webhook_event.message_id;
    const body = req.body.webhook_event.body;  

    try {
        if (body.includes("削除")) {
            await deleteMessages(body, messageId, roomId, accountId);
            return res.sendStatus(200);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.sendStatus(500);
    }
}

//メッセージ削除
async function deleteMessages(body, messageId, roomId, accountId) {
  const dlmessageIds = [...body.matchAll(/(?<=to=\d+-)(\d+)/g)].map(match => match[0]);

  if (dlmessageIds.length === 0) {
    return;
  }

  for (let i = 0; i < dlmessageIds.length; i++) {
    const messageId = dlmessageIds[i];
    const url = `https://api.chatwork.com/v2/rooms/${roomId}/messages/${messageId}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          'Accept': 'application/json',
          'x-chatworktoken': CHATWORK_API_TOKEN,
        }
      });

    } catch (err) {
      console.error(`メッセージID ${messageId} の削除中にエラーが発生しました:`, err.response ? err.response.data : err.message);
    }
  }
}

module.exports = {
    mentionWebhook
};