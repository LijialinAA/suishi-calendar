// 起名引擎：按八字喜用五行配字，兼顾音韵、笔画、字义
// 字库 100 字，与桌面版 v25 一致；纯本地确定性匹配，不联网

const CH = [
  ['铭','金','ming',11,'铭记不忘，笃定有守',1],['钧','金','jun',9,'持重均衡，有担当',1],
  ['锦','金','jin',13,'锦绣前程，文采斐然',0],['铮','金','zheng',11,'铮铮有骨，不随波逐流',1],
  ['钰','金','yu',10,'珍金美玉，温润坚贞',2],['钦','金','qin',9,'敬慎端方，为人所重',1],
  ['铄','金','shuo',10,'光辉震烁，才华外显',1],['琛','金','chen',12,'天然珍宝，内蕴丰厚',0],
  ['瑞','金','rui',13,'祥瑞相随，逢凶化吉',0],['瑜','金','yu',13,'玉之光泽，瑕不掩瑜',0],
  ['铖','金','cheng',11,'金声玉振，稳而不折',1],['珊','金','shan',9,'珊瑚在侧，清丽可人',2],
  ['铃','金','ling',10,'清音悦耳，灵动不滞',2],['锴','金','kai',14,'精铁良材，可堪大用',1],
  ['鎏','金','liu',18,'流光溢彩，气度从容',0],['铉','金','xuan',10,'鼎之枢纽，举足轻重',1],
  ['钺','金','yue',10,'有断有谋，行事果决',1],['睿','金','rui',14,'目光深远，通达明理',0],
  ['诚','金','cheng',8,'言出有信，立身之本',1],['诗','金','shi',8,'诗书养性，雅致从容',2],

  ['林','木','lin',8,'双木成林，生生不息',0],['森','木','sen',12,'根基深厚，气象葱茏',1],
  ['桐','木','tong',10,'梧桐引凤，品格高洁',0],['梓','木','zi',11,'良木可材，桑梓情长',0],
  ['柏','木','bai',9,'岁寒不凋，持守有节',1],['楠','木','nan',13,'名木坚致，堪当栋梁',1],
  ['楷','木','kai',13,'端正为范，可作楷模',1],['荣','木','rong',9,'枝叶向荣，兴旺有成',0],
  ['蔚','木','wei',14,'蔚然成风，文采丰茂',0],['茗','木','ming',9,'茶香清远，淡泊自持',2],
  ['芷','木','zhi',7,'岸芷汀兰，清香自守',2],['芸','木','yun',7,'芸香辟蠹，勤学不倦',2],
  ['桦','木','hua',10,'白桦挺直，清爽利落',1],['栋','木','dong',9,'栋梁之材，可托重任',1],
  ['桢','木','zhen',10,'坚木为桢，立得住根',1],['栩','木','xu',10,'栩栩如生，灵动有神',0],
  ['棠','木','tang',12,'海棠春睡，温和可亲',2],['槿','木','jin',15,'木槿朝开，日日自新',2],
  ['松','木','song',8,'长青不老，耐得住寒',1],['萱','木','xuan',12,'忘忧之草，宽和舒朗',2],

  ['涵','水','han',11,'海纳百川，包容有度',0],['泽','水','ze',8,'润泽及人，厚德载物',1],
  ['清','水','qing',11,'澄澈见底，心明不浊',0],['源','水','yuan',13,'源远流长，本固枝荣',1],
  ['泓','水','hong',8,'一泓澄碧，深而不喧',0],['涛','水','tao',10,'胸有波澜，行有力道',1],
  ['渊','水','yuan',11,'渊渟岳峙，学识深沉',1],['沛','水','pei',7,'充沛丰盈，生气流转',0],
  ['润','水','run',10,'温润而泽，不疾不徐',0],['沐','水','mu',7,'如沐春风，受教承泽',0],
  ['汐','水','xi',6,'潮信有期，张弛合度',2],['淳','水','chun',11,'质朴敦厚，返璞归真',1],
  ['湛','水','zhan',12,'湛然清明，见解透澈',1],['洛','水','luo',9,'洛水灵图，文思有源',0],
  ['霏','水','fei',16,'烟雨霏微，细腻婉转',2],['霖','水','lin',16,'甘霖济旱，久旱逢时',1],
  ['霁','水','ji',14,'雨过天晴，豁然开朗',0],['洵','水','xun',9,'洵然可信，诚而不饰',1],
  ['洋','水','yang',9,'汪洋自恣，格局开阔',1],['溪','水','xi',13,'溪水长流，细水不竭',2],

  ['煜','火','yu',13,'光耀照人，神采奕奕',1],['烨','火','ye',10,'火光盛明，气宇轩昂',1],
  ['熠','火','yi',15,'熠熠生辉，才气难掩',0],['焕','火','huan',11,'焕然一新，生机勃发',0],
  ['曜','火','yao',18,'日月齐光，明朗显达',1],['曦','火','xi',20,'晨光初照，希望在前',0],
  ['晟','火','sheng',10,'日盛中天，正当其时',1],['昭','火','zhao',9,'昭然若揭，分明不昧',0],
  ['朗','火','lang',10,'朗月清风，胸襟开阔',1],['烁','火','shuo',9,'明而不灼，灵动有光',0],
  ['煊','火','xuan',13,'暖意四布，声名温和',1],['暄','火','xuan',13,'风和日暄，待人温厚',2],
  ['晗','火','han',11,'天将破晓，含光待发',0],['昕','火','xin',8,'日出扶桑，开端正好',0],
  ['彤','火','tong',7,'赤心一片，热忱分明',2],['煦','火','xu',13,'和煦如春，润物无声',0],
  ['晔','火','ye',10,'华光内蕴，文采可观',1],['昱','火','yu',9,'日立当空，明日可期',1],
  ['灿','火','can',7,'灿烂不隐，坦荡明亮',0],['炅','火','jiong',8,'日火相映，聪敏机捷',1],

  ['坤','土','kun',8,'厚德载物，地势宽和',1],['垚','土','yao',9,'三土成山，稳重厚实',1],
  ['培','土','pei',11,'培土育苗，功在久长',1],['基','土','ji',11,'根基扎实，起得平稳',1],
  ['垣','土','yuan',9,'墙垣有守，界限分明',1],['均','土','jun',7,'持平均衡，不偏不倚',0],
  ['城','土','cheng',9,'城池有固，可守可安',1],['域','土','yu',11,'领域自开，格局自成',1],
  ['砚','土','yan',9,'砚田笔耕，勤学有成',0],['硕','土','shuo',11,'硕果累累，学有所成',1],
  ['岚','土','lan',7,'山间云气，清远出尘',2],['嵩','土','song',13,'高山仰止，稳如磐石',1],
  ['玮','土','wei',8,'美玉为玮，质厚而珍',0],['琬','土','wan',12,'琬圭温润，柔中有则',2],
  ['瑛','土','ying',12,'玉光外现，才质自彰',2],['瑶','土','yao',14,'琼瑶之美，明净无瑕',2],
  ['璧','土','bi',18,'完璧无缺，慎守本心',0],['圣','土','sheng',5,'通达而敬，行有所本',1],
  ['圭','土','gui',6,'圭臬有度，行为有准',1],['屹','土','yi',6,'屹然不动，立身坚定',1]
];

function nameScore(picks, meta, gender, mode) {
  const xi = meta.xi || [], ji = meta.ji || [];
  let s = 50;
  const wxs = [];
  picks.forEach(c => {
    wxs.push(c[1]);
    if (xi.indexOf(c[1]) >= 0) s += (mode === 'strong' ? 30 : 22);
    else if (ji.indexOf(c[1]) >= 0) s -= (mode === 'soft' ? 8 : 18);
    else s += 4;
    const g = c[5];
    if (g === 0) s += 3;
    else if (g === (gender === '男' ? 1 : 2)) s += 8;
    else s -= 10;
  });
  if (picks.length === 2) {
    if (picks[0][1] !== picks[1][1]) s += 8;
    if (picks[0][2] !== picks[1][2]) s += 6;
    else s -= 12;
    if (Math.abs(picks[0][3] - picks[1][3]) <= 6) s += 4;
  }
  if (wxs.every(w => xi.indexOf(w) >= 0)) s += 6;
  return s;
}

function makeNames(meta, gender, len, mode, surname) {
  const xi = meta.xi || [], ji = meta.ji || [];
  let pool = CH.filter(c => {
    if (c[0] === surname) return false;
    const g = c[5];
    if (g !== 0 && g !== (gender === '男' ? 1 : 2)) return false;
    return true;
  });
  pool.sort((a, b) => {
    const sa = (xi.indexOf(a[1]) >= 0 ? 2 : 0) - (ji.indexOf(a[1]) >= 0 ? 1 : 0);
    const sb = (xi.indexOf(b[1]) >= 0 ? 2 : 0) - (ji.indexOf(b[1]) >= 0 ? 1 : 0);
    return sb - sa;
  });
  const head = pool.slice(0, 46);
  const out = [];
  if (len === 1) {
    head.forEach(c => { out.push({ cs: [c], sc: nameScore([c], meta, gender, mode) }); });
  } else {
    for (let i = 0; i < head.length; i++) {
      for (let j = i + 1; j < head.length; j++) {
        if (head[i][2] === head[j][2]) continue;
        out.push({ cs: [head[i], head[j]], sc: nameScore([head[i], head[j]], meta, gender, mode) });
      }
    }
  }
  out.sort((a, b) => b.sc - a.sc);
  const seen = {}, combo = {}, first = {}, res = [];
  for (let k = 0; k < out.length && res.length < 12; k++) {
    const o = out[k];
    const txt = surname + o.cs.map(c => c[0]).join('');
    if (seen[txt]) continue;
    const key = o.cs.map(c => c[1]).join('');
    if (combo[key] >= 3) continue;
    const fk = o.cs[0][0];
    if (first[fk] >= 2) continue;
    seen[txt] = 1; combo[key] = (combo[key] || 0) + 1; first[fk] = (first[fk] || 0) + 1;
    res.push(o);
  }
  return res;
}

export const WUXING_COLOR = { '金': '#c8a155', '木': '#6ba87a', '水': '#6b94ad', '火': '#c8704f', '土': '#9a7ba0' };

/**
 * 取名
 * @param {object} meta {day_gan, tone, xi[], ji[], sizhu[]}
 * @param {string} gender '男'|'女'
 * @param {number} len 1=单字名 2=双字名
 * @param {string} mode 'auto'|'soft'|'strong'
 * @param {string} surname 姓氏
 */
export function buildNaming(meta, gender, len, mode, surname) {
  const xi = meta.xi || [], ji = meta.ji || [];
  const list = makeNames(meta, gender, len, mode, surname);
  const names = list.map(o => {
    const cs = o.cs.map(c => ({
      char: c[0], wuxing: c[1], pinyin: c[2], stroke: c[3], meaning: c[4],
      type: xi.indexOf(c[1]) >= 0 ? '补益喜用' : (ji.indexOf(c[1]) >= 0 ? '忌神，仅作音义搭配' : '中和调候')
    }));
    const text = surname + cs.map(c => c.char).join('');
    const pinyin = cs.map(c => c.pinyin).join(' ');
    const wxs = cs.map(c => c.wuxing).join('＋');
    const why = cs.map(c => `${c.char}（${c.wuxing}）${c.type}`).join('；');
    const stroke = cs.map(c => c.stroke).join(' + ');
    const fluent = (cs.length === 2 && cs[0].pinyin !== cs[1].pinyin) ? '声母错落、不拗口' : '清亮顺口';
    return { text, pinyin, wxs, why, stroke, fluent, cs };
  });
  return {
    surname, gender, len, mode,
    sizhu: (meta.sizhu || []).join(' '),
    dayGan: meta.day_gan || '', tone: meta.tone || '',
    xi: xi.join('、'), ji: ji.join('、'),
    names,
    note: '名字由本地八字引擎给出的喜用五行与内置字库确定性匹配生成，不接入外部服务、不随机编造；传统取名另有音律、族谱、长辈避讳等考量，此处结果供取舍参考，最终定名仍在家中。'
  };
}
