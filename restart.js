const { exec } = require('child_process');

const messageedit = require('../suisho/message');

const reAcId = [10023242, 9700874, 9430470, 9885111, 9454064];

function restartServer(body, message, messageId, roomId, accountId) {
  console.log(accountId)
  if (!reAcId.includes(accountId)) {
    messageedit.sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nあなたには、その権限がない`, roomId);
    return;
  }
  
  const Command = 'enable-pnpm';

  exec(Command, (error, stdout, stderr) => {
    if (error) {
      console.error(`サーバーの再起動に失敗: ${error}`);
      return;
    }
    console.log(`サーバーが再起動おけ: ${stdout}`);
    if (stderr) {
      console.error(`(u_u): ${stderr}`);
    }
  });
}

module.exports = restartServer;