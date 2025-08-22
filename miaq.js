// ============================
// Make it a quote生成
// ============================

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const randomId = require('random-id');
const { MiQ } = require('../miq.js');
const axios = require('axios');

const quote = new MiQ();
var randomIdlen = 30;
var randomIdpattern = 'aA0'

async function makeitaquote(req, res) {
  console.log(req.body);
  const { imageUrl, name, message, acID } = req.body;
  try {
        const response = await axios.get("https://cdn.glitch.global/21c63086-ffc1-4d28-8e9a-e2c12f51b431/IMG_2577.png?v=1740068521568", { responseType: 'arraybuffer' });
        const backgroundBuffer = Buffer.from(response.data);
        const resizedbackBuffer = await sharp(backgroundBuffer)
            .extract({ left: 0, top: 0, width: 500, height: 630 })
            .toBuffer();

        const iconResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const iconBuffer = Buffer.from(iconResponse.data);
    
    const resizedIconBuffer = await sharp(iconBuffer)
      .resize(500, 630)
      .modulate({ saturation: 0.4 })
      .toBuffer();

    const baseurl = await new MiQ()
      .setText(message)
      .setAvatar('https://cdn.discordapp.com/avatars/1333300001778176082/b24986060349791144eaba260105c5f5')
      .setUsername(`ID${acID}`)
      .setDisplayname(name)
      .setColor(false)
      .setWatermark('Make it a Quote#massiro')
      .generate();
    const baseResponse = await axios.get(baseurl, { responseType: 'arraybuffer' });
    const baseBuffer = Buffer.from(baseResponse.data);

        const outputBuffer = await sharp(baseBuffer)
            .composite([
                {
                    input: resizedIconBuffer,
                    top: 0,
                    left: 0
                },
                {
                    input: resizedbackBuffer,
                    top: 0,
                    left: 0
                }
            ])
            .toBuffer();

    const fileId = randomId(randomIdlen, randomIdpattern);
    const outputDir = path.join(__dirname, '..', 'image');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${fileId}.png`);
    
    await sharp(outputBuffer).toFile(outputPath);

    res.sendFile(outputPath, async (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('エラーが発生しました。');
      } else {
        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('ファイルの削除を失敗としてマーク:', unlinkErr);
          } else {
            console.log('正常に完了:', outputPath);
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('エラーが発生しました。');
  }
}

//バッファ
async function makeitaquotebuffer(imageUrl, name, message, acID) {
  try {
    const response = await axios.get("https://cdn.glitch.global/21c63086-ffc1-4d28-8e9a-e2c12f51b431/IMG_2577.png?v=1740068521568", { responseType: 'arraybuffer' });
    const backgroundBuffer = Buffer.from(response.data);
    
    const resizedbackBuffer = await sharp(backgroundBuffer)
      .extract({ left: 0, top: 0, width: 500, height: 630 })
      .toBuffer();

    const iconResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const iconBuffer = Buffer.from(iconResponse.data);
    
    const resizedIconBuffer = await sharp(iconBuffer)
      .resize(500, 630)
      .modulate({ saturation: 0.4 })
      .toBuffer();
    
    const baseurl = await new MiQ()
      .setText(message)
      .setAvatar('https://cdn.discordapp.com/avatars/1333300001778176082/b24986060349791144eaba260105c5f5')
      .setUsername(`ID${acID}`)
      .setDisplayname(name)
      .setColor(false)
      .setWatermark('Make it a Quote#massiro')
      .generate();

    const baseResponse = await axios.get(baseurl, { responseType: 'arraybuffer' });
    const baseBuffer = Buffer.from(baseResponse.data);

    const outputBuffer = await sharp(baseBuffer)
      .composite([
        {
          input: resizedIconBuffer,
          top: 0,
          left: 0
        },
        {
          input: resizedbackBuffer,
          top: 0,
          left: 0
        }
      ])
      .toBuffer();

    return outputBuffer;

  } catch (error) {
    console.error(error);
    throw new Error('エラーが発生しました。');
  }
}

module.exports = {
    makeitaquote,
    makeitaquotebuffer
};