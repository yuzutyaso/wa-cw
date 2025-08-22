const axios = require('axios');

class R34Utils {
    constructor() {
        this.providers = {
            XXX: 'http://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=200&tags=',
            YANDERE: 'https://yande.re/post.xml?limit=250&tags=',
            PAHEAL: 'https://rule34.paheal.net/rss/images/',
            LOLIAPP: 'https://api.lolicon.app/setu/v2?r18=1&num=20&keyword='
        };
    }

    async getImageUrl(query) {
        const imageUrls = [];
        imageUrls.push(...await this.getImageURLFromSearch(this.getBooruUrl(query), 'YANDERE'));
        imageUrls.push(...await this.getImageURLFromJson(this.getLoliappUrl(query), 'LOLIAPP'));

        if (imageUrls.length === 0) {
            imageUrls.push(...await this.getImageURLFromSearch(this.getXXUrl(query), 'XXX'));
            imageUrls.push(...await this.getImageURLFromSearch(this.getPahealUrl(query), 'PAHEAL'));
        }
      
        if (imageUrls.length === 0) {
            throw new Error("見つからなかった");
        }

        return imageUrls[Math.floor(Math.random() * imageUrls.length)];
    }

    async getImageURLFromSearch(url) {
        try {
            const response = await axios.get(url);
            const responseBody = response.data;

            const regex = url.includes("paheal.net")
                ? /<media:content url="([^"]+)"/g
                : /sample_url=['"]?([^'"]+)['"]?/g;

            const possibleLinks = [];
            let match;
            while ((match = regex.exec(responseBody)) !== null) {
                possibleLinks.push(match[1]);
            }

            return possibleLinks;
        } catch (error) {
            console.warn(`サイト応答なし: ${url}`, error);
            return [];
        }
    }
  
    async getImageURLFromJson(url) {
       try {
           const response = await axios.get(url, {timeout: 5000});
           const responseBody = response.data;

           const imageUrls = responseBody.data.map(item => item.urls.original);
           return imageUrls;
       } catch (error) {
           console.warn(`サイト応答なし: ${url}`, error);
           return [];
       }
   }  

    getXXUrl(query) {
        return `${this.providers.XXX}${encodeURIComponent(query)}`;
    }

    getBooruUrl(query) {
        return `${this.providers.YANDERE}${encodeURIComponent(query)}`;
    }

    getPahealUrl(query) {
        return `${this.providers.PAHEAL}${encodeURIComponent(query)}/1`;
    }
  
    getLoliappUrl(query) {
        return `${this.providers.LOLIAPP}${encodeURIComponent(query)}`;
    }
}

module.exports = R34Utils;