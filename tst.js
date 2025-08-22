const axios = require('axios');
const cheerio = require('cheerio');

const mm = "https://momon-ga.com";
const nya = "https://nyahentai.re";
const sm = "https://ddd-smart.net";

async function doujin(id) {
  try {
    let url = `${mm}/fanzine/${id}`;
    const response = await axios.get(url, {timeout: 5000});
    
    if (response.data) {
      const html = response.data;
      const $ = cheerio.load(html);

      const title = $('h1').text().trim() || 'タイトル不明';

      const pages = $('#post-number').text().trim() || 'ページ数不明';

      let authors = '';
      $('#post-tag .post-tag-table').each((i, elem) => {
        const title = $(elem).find('.post-tag-title').text().trim();
        if (title === '作者') {
          authors = $(elem)
            .find('.post-tags a[rel="tag"]')
            .map((j, authorElem) => $(authorElem).text().trim())
            .get()
            .join(', ');
        }
      });

      let circle = '';
      $('#post-tag .post-tag-table').each((i, elem) => {
        const title = $(elem).find('.post-tag-title').text().trim();
        if (title === 'サークル') {
          circle = $(elem)
            .find('.post-tags a[rel="tag"]')
            .map((j, circleElem) => $(circleElem).text().trim())
            .get()
            .join(', ');
        }
      });

      const imageUrls = [];
      $('#post-hentai img').each((i, img) => {
        imageUrls.push($(img).attr('src'));
      });

      return {
        title,
        pages,
        authors,
        circle,
        imageUrls
      };
    } else {
      return 'error';
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 'error';
  }
}

async function nyadoujin(id) {
  try {
    console.log(id)
    let url = `${nya}/fanzine/${id}`;
    const response = await axios.get(url, {timeout: 5000});
    
    if (response.data) {
      const html = response.data;
      const $ = cheerio.load(html);

      const title = $('h1').text().trim() || 'タイトル不明';

      const pages = $('#post-number').text().trim() || 'ページ数不明';

      const links = $('#post-tag a[rel="tag"]');
      const authors = links
      .filter((i, a) => /\/artist\//.test($(a).attr('href')))
      .map((i, a) => $(a).text().trim())
      .get()
      .join(', ');

      const circle = links
      .filter((i, a) => /\/circle\//.test($(a).attr('href')))
      .map((i, a) => $(a).text().trim())
      .get()
      .join(', ');

      const imageUrls = [];
      $('#post-comic img').each((i, img) => {
        imageUrls.push($(img).attr('src'));
      });

      return {
        title,
        pages,
        authors,
        circle,
        imageUrls
      };
    } else {
      return 'error';
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 'error';
  }
}

async function search(q) {
  try{
   if(!q){
     let result = await getpagenya(q);
     return result;
   }
  const [momoResults, nyaResults] = await Promise.all([
      getpagemomo(q),
      getpagenya(q)
  ]);

  let results = [];
    results.push(...momoResults);
    results.push(...nyaResults);
  
  if (results.length === 0) {
    throw new Error("見つからなかった");
    return;
  }
   return results;
  } catch(error){
    console.log(error);
    return;
  }
}

//ももんが
async function getpagemomo(q) {
  try {
    let url = "";
    if(q){
      const p = await totallage(`${mm}/?s=${encodeURIComponent(q)}`);
      const page = await Math.floor(Math.random() * p) + 1;
      url = `${mm}/page/${page}/?s=${encodeURIComponent(q)}`;
    else {
      const ppurl = ["https://momon-ga.com","https://momon-ga.com/trend"];
      const randomIndex = Math.floor(Math.random() * ppurl.length);
      url = ppurl[randomIndex];
    }
    const response = await axios.get(url, {timeout: 5000});
    if (response.data) {
      const html = response.data;
      const regex = /<img src="([^"]+)"[^>]*alt="([^"]+)"/g;
      let results = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        results.push({ image: match[1], title: match[2], rule: "mo" });
      }
      return results;
    } else {
      return [];
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return [];
  }
}

//にゃー
async function getpagenya(q) {
  try {
    if (q) 
      const p = await totallage(`${nya}/?s=${encodeURIComponent(q)}`);
      const page = await Math.floor(Math.random() * p) + 1;
      url = `${nya}/page/${page}/?s=${encodeURIComponent(q)}`;
    else {
      const ppurl = ["https://nyahentai.re", "https://nyahentai.re/rising"];
      const randomIndex = Math.floor(Math.random() * ppurl.length);
      url = ppurl[randomIndex];
    }
    const response = await axios.get(url, {timeout: 5000});
    if (response.data) {
      const html = response.data;
      const $ = cheerio.load(html);

      let results = [];

      $('a').each((index, element) => {
        const imageElement = $(element).find('.post-list-image img');
        const imageSrc = imageElement.attr('src');
        const titleElement = $(element).find('span');
        const title = titleElement.text().trim();

        if (imageSrc && title) {
          results.push({ image: imageSrc, title: title, rule: "re" });
        }
      });

      return results;
    } else {
      return [];
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return [];
  }
}

//スマート
async function getpagesm(q) {
  try {
    if (q)
      const p = await totallageSM(`${sm}/search.php?keyword=${encodeURIComponent(q)}&s=%E6%A4%9C%E7%B4%A2`);
      const page = await Math.floor(Math.random() * p) + 1;
      url = `${sm}/search.php?keyword=${encodeURIComponent(q)}&page=2&sort_key=1`;
    else {
      const ppurl = ["https://ddd-smart.net"];
      const randomIndex = Math.floor(Math.random() * ppurl.length);
      url = ppurl[randomIndex];
    }
    const response = await axios.get(url, {timeout: 5000});
    if (response.data) {
      const html = response.data;
      const $ = cheerio.load(html);

      let results = [];

      $('.comics').each((i, elem) => {
        if (!$(elem).find('.favorite-comic').length) return;
        const title = $(elem).find('p.title').text().trim();
        const imgUrl = $(elem).find('div.thumbnail img').attr('src');
        results.push({ title: title, image: imgUrl, rule: "sm" });
      });

      $('li').each((i, elem) => {
        if (!$(elem).find('.favorite-comic').length) return;
        const imgUrl = $(elem).find('.list-thumbnail img').attr('src');
        const title = $(elem).find('.package-list-text h2').text().trim();
        results.push({ title: title, image: imgUrl, rule: "sm" });
      });

      return results;
    } else {
      return [];
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return [];
  }
}

async function totallage(url) {
  try {
    const response = await axios.get(url, {timeout: 5000});
    if (response.data) {
      const html = response.data;
      const $ = cheerio.load(html);
      const pagesText = $('.wp-pagenavi .pages').text().trim();
      const totalPagesMatch = pagesText.match(/(\d+) \/ (\d+)/);
      const totalPages = totalPagesMatch ? totalPagesMatch[2] : '1';
      return totalPages;
    } else {
      return 1;
    }
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 1;
  }
}

async function totallageSM(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (!response.data) return 1;
    const html = response.data;
    const $ = cheerio.load(html);
    let totalPages = 1;
    $('.page_menu .cover-ul li a').each((i, elem) => {
      const num = parseInt($(elem).text().trim(), 10);
      if (!isNaN(num) && num > totalPages) {
        totalPages = num;
      }
    });
    return totalPages;
  } catch (error) {
    console.log('エラーが発生しました:', error);
    return 1;
  }
}


module.exports = {
    search,
    doujin,
    nyadoujin
};
