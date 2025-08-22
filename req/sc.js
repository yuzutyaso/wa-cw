const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function gethtml(url, outputDir, fileName) {
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const localFilePath = path.join(outputDir, fileName);

        const writer = fs.createWriteStream(localFilePath);
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
        });
        await response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        return localFilePath;
    } catch (error) {
        console.error('html取得エラー:', error);
        throw error;
    }
}

module.exports = { gethtml };