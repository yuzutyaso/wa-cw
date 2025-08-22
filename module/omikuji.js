// ============================
// おみくじやら何やらの運ゲー。
// ===========================

const axios = require('axios');

const messageedit = require('../suisho/message');

async function userkuji(body, message, messageId, roomId, accountId) {
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let piconNames = [];
    for (let i = 0; i < 10; i++) {
        const randomID = getRandomNumber(1, 10007187);
        piconNames.push(`[piconname:${randomID}]`);
    }
    const ms = piconNames.join('\n');
    await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${ms}`,
    roomId
  );
  return;
}

async function omikuji(body, message, messageId, roomId, accountId) {
    const title = await randomTitle();
    const results = [
        "大吉",
        "中吉",
        "小吉",
        "吉",
        "凶",
        "大凶",
        "猫",
        "宇宙",
        "幸運の星",
        "バナナ",
        "大冒険",
        "ピザ",
        "虹",
        "サボテン",
        "魔法",
        "カレー",
        "トランポリン",
        "スパゲッティ",
        "夢",
        "冒険者",
        "ドラゴン",
        "星座",
        "チョコレート",
        "風船",
        "サッカー",
        "おにぎり",
        "カメラ",
        "音楽",
        "旅行",
        "お菓子",
        "花火",
        "海",
        "山",
        "空",
        "未来",
        "過去",
        "時間",
        "冒険",
        "友情",
        "愛",
        "運命",
        "運転",
        "スイカ",
        "パンダ",
        "カメ",
        "クマ",
        "ウサギ",
        "星",
        "月",
        "太陽",
        "風",
        "雪",
        "雨",
        "雲",
        "光",
        "影",
        "夢見る",
        "笑顔",
        "希望",
        "勇気",
        "挑戦",
        "成功",
        "失敗",
        "発見",
        "成長",
        "変化",
        "運",
        "運勢",
        "運命の輪",
        "不思議",
        "奇跡",
        "冒険の旅",
        "新しい出発",
        "未来の扉",
        "心の声",
        "直感",
        "インスピレーション",
        "エネルギー",
        "リズム",
        "バランス",
        "調和",
        "創造性",
        "発想",
        "アイデア",
        "夢中",
        "情熱",
        "愛情",
        "感謝",
        "笑い",
        "楽しみ",
        "喜び",
        "幸せ",
        "運命の出会い",
        "ピカチュウ",
        "ポケモン",
        "ゲーム",
        "ドラえもん",
        "コナン",
        "名探偵",
        "忍者",
        "武士",
        "侍",
        "剣士",
        "剣道",
        "武道",
        "カンフー",
        "忍術",
        "シャーマン",
        "魔術師",
        "呪術",
        "妖怪",
        "神話",
        "伝説",
        "ミステリー",
        "サスペンス",
        "ホラー",
        "スリラー",
        "ファンタジー",
        "SF",
        "ロボット",
        "宇宙船",
        "タイムトラベル",
        "異世界",
        "魔法使い",
        "ドラゴン",
        "妖精",
        "ユニコーン",
        "ゾンビ",
        "吸血鬼",
        "ワーウルフ",
        "謎",
        "陰謀",
        "秘密",
        "ミステリアス",
        "未知",
        "不可解",
        "怪奇",
        "超常",
        "パラノーマル",
        "オカルト",
        "超能力",
        "占い",
        "タロット",
        "水晶玉",
        "フォーチュン",
        "ラッキー",
        "幸運",
        "ラッキーチャーム",
        "お守り",
        "お札",
        "お寺",
        "神社",
        "お祈り",
        "お願い事",
        "お祝い",
        "お土産",
        "お手玉",
        "お茶",
        "お花",
        "お絵かき",
        "お散歩",
        "お昼寝",
        "お祭り",
        "お寿司",
        "お菓子",
        "お弁当",
        "お手伝い",
        "お掃除",
        "お洗濯",
        "お洋服",
        "お風呂",
        "お食事",
        "お酒",
        "お休み",
        "お仕事",
        "お出かけ",
        "お友達",
        "お家",
        "お母さん",
        "お父さん",
        "お姉さん",
        "お兄さん",
        "お子さん",
        "お人形",
        "お絵描き",
        "お歌",
        "お話",
        "お祝い",
        "お願い",
        "お礼",
        "お祝い",
        "お見舞い",
        "お誕生日",
        "お正月",
        "お盆",
        "お月見",
        "お花見",
        "お祭り",
        "お寺参り",
        "お神社参り",
        "お参り",
        "お詣り",
        "お寺",
        "お神社",
        "お仏壇",
        "お墓参り",
        "お経",
        "お春雨",
        "花",
        "うらやみしい",
        "うるさい🔮",
        "春眠暁を覚えず",
        "夜来風雨の声",
        "責めること火の如し",
        "昆布茶",
        "おみくじ！",
        "バッハ",
        "コンセントレート",
        "ピタゴラス",
        "ぴかぴか",
        "ぱらぱら",
        "お寺の鐘",
        "も、どーしたい？もどしたい！もう痴態？無法地帯！",
        "おまえBANな",
        "掃除屋になれます🧹",
        "いい意見だね",
        "いいおみくじだね",
        "竜人族",
        "漫画好き",
        "ラッキー！",
        "ポッキー",
        "授業",
        "",
        "カッシーニ",
        "🥠",
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`,
        `${title}`
    ];

    const randomIndex = Math.floor(Math.random() * results.length);
    await messageedit.sendchatwork(
    `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん[info]${results[randomIndex]}[/info]`,
    roomId
  );
  return
}

async function randomTitle(url) {
  try {
    const target = url || "https://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5:%E3%81%8A%E3%81%BE%E3%81%8B%E3%81%9B%E8%A1%A8%E7%A4%BA";
    const response = await axios.get(target);
    const html = response.data;

    const titleRegex = /<title>(.*?) - Wikipedia<\/title>/;
    const match = html.match(titleRegex);

    if (match) {
      const title = match[1];
      const titleok = title.replace(/ \(曖昧さ回避\)/g, '');
      return titleok;
    } else {
      return "わかめ";
    }
  } catch (error) {
    return "おばけ";
  }
}

async function saikoro(body, message, messageId, roomId, accountId) {
  const saikoro = [...message.matchAll(/\d+(?=d)/g)].map((saikoro) => saikoro[0]);
  const men = [...message.matchAll(/(?<=d)\d+/g)].map((men) => men[0]);
  const number = [];
  for (let s = 0; s < saikoro; s++) {
    number.push(Math.floor(Math.random() * men) + 1);
  }
  const sum = number.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  if (saikoro == 1) {
    if (men > 0 && saikoro > 0) {
      messageedit.sendchatwork(
        `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n${number}`,
        roomId
      );
    } else {
      messageedit.sendchatwork(
        `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nダイスの数と面の数を指定してください`,
        roomId
      );
    }
  } else if (men > 0 && saikoro > 0) {
    messageedit.sendchatwork(
      `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\n${number} ${
        "合計値" + sum
      }`,
      roomId
    );
  } else {
    messageedit.sendchatwork(
      `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}] さん\nダイスの数と面の数を指定してください`,
      roomId
    );
  }
}

module.exports = {
    omikuji,
    userkuji,
    randomTitle,
    saikoro
};