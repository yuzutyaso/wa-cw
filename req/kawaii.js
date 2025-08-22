const axios = require('axios');

const kawaiitoken = process.env.kawaiiAPI;

async function gif(pp) {
  try {
    const url = `https://kawaii.red/api/gif/${pp}?token=${kawaiitoken}`;
    const response = await axios.get(url);
    if (response.data.response) {
      const imageUrl = response.data.response;
      return imageUrl;
    } else {
      return 'error';
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 'error';
  }
}

module.exports = {
    gif
};