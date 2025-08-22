const axios = require('axios');

const waifutoken = process.env.waifuAPI;

async function waifu(pp) {
  try {
    const url = `https://waifu.it/api/v4/${pp}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: waifutoken,
      },
    });
    if (response.data) {
      return response.data;
    } else {
      return 'error';
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 'error';
  }
}

module.exports = {
    waifu
};