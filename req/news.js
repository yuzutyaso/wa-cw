const axios = require('axios');

const apiKey = process.env.newskey;

async function JapaneseNews() {
  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=tesla&from=2025-05-27&sortBy=publishedAt&apiKey=${apiKey}`);

    if (response.data.articles.length > 0) {
      const articles = response.data.articles;
      const randomIndex = Math.floor(Math.random() * articles.length);
      const article = articles[randomIndex];
      return `${article.title} - ${article.content}`;
    } else {
      return 'error';
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 'error';
  }
}

module.exports = {
    JapaneseNews
};