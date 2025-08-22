const HMtai = require("hmtai");
const hmtai = new HMtai();

async function getImageURL(type, category) {
  try {
    if (type === "sfw") {
      switch (category) {
        case "neko":
          return await hmtai.sfw.neko();
        case "wallpaper":
          return await hmtai.sfw.wallpaper();
        case "hug":
          return await hmtai.sfw.hug();
        default:
          throw new Error("無効なSFWカテゴリです");
      }
    }
    else if (type === "nsfw") {
      switch (category) {
        case "hentai":
          return await hmtai.nsfw.hentai();
        case "ero":
          return await hmtai.nsfw.ero();
        case "nsfwNeko":
          return await hmtai.nsfw.nsfwNeko();
        default:
          throw new Error("無効なカテゴリ");
      }
    } else {
      throw new Error("タイプが変っぽい");
    }
  } catch (error) {
    console.error("画像取得中にエラーが発生しました:", error.message);
    return null;
  }
}

module.exports = getImageURL;