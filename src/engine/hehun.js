import { GAN_WUXING, HIDE_GAN, shiShen, isLiuHe, isChong, isHai, isSanHe, isXing, isZiXing, ZHI_SHENGXIAO } from './constants.js';

const GAN_HE = [['甲', '己'], ['乙', '庚'], ['丙', '辛'], ['丁', '壬'], ['戊', '癸']];
const GAN_CHONG = [['甲', '庚'], ['乙', '辛'], ['丙', '壬'], ['丁', '癸']];

function isGanHe(a, b) {
  return GAN_HE.some((p) => p.includes(a) && p.includes(b));
}
function isGanChong(a, b) {
  return GAN_CHONG.some((p) => p.includes(a) && p.includes(b));
}
function zhiRelation(a, b) {
  if (isLiuHe(a, b)) return { key: '六合', level: '上', good: true };
  if (isSanHe(a, b)) return { key: '三合', level: '上', good: true };
  if (isZiXing(a, b)) return { key: '自刑', level: '下', good: false };
  if (isXing(a, b)) return { key: '相刑', level: '下', good: false };
  if (isChong(a, b)) return { key: '六冲', level: '下', good: false };
  if (isHai(a, b)) return { key: '相害', level: '中下', good: false };
  if (a === b) return { key: '同支', level: '中', good: true };
  return { key: '平', level: '中', good: true };
}

function ganRelation(a, b) {
  if (isGanHe(a, b)) return { key: '五合', good: true };
  if (isGanChong(a, b)) return { key: '相冲', good: false };
  const wa = GAN_WUXING[a];
  const wb = GAN_WUXING[b];
  if (wa === wb) return { key: '比和', good: true };
  const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
  if (SHENG[wa] === wb || SHENG[wb] === wa) return { key: '相生', good: true };
  return { key: '相克', good: false };
}

const YEAR_SCORE = { 六合: 12, 三合: 9, 同支: 5, 平: 0, 相害: -6, 相刑: -9, 六冲: -12 };
const DAY_SCORE = { 六合: 14, 三合: 10, 同支: 4, 平: 0, 相害: -8, 相刑: -12, 六冲: -14, 自刑: -10 };
const GAN_SCORE = { 五合: 11, 相生: 7, 比和: 4, 相克: -6, 相冲: -10 };

/**
 * 五行互补：看彼此缺什么、多什么
 * @returns {{score:number, notes:string[]}}
 */
function wuxingComplement(a, b) {
  const notes = [];
  let score = 0;
  const lack = (wx) => wx.filter((x) => x.value <= 0.2).map((x) => x.name);
  const strong = (wx) => wx.filter((x) => x.value >= 2.5).map((x) => x.name);
  const lackA = lack(a.wuxing);
  const lackB = lack(b.wuxing);
  const strongA = strong(a.wuxing);
  const strongB = strong(b.wuxing);
  strongA.filter((x) => lackB.includes(x)).forEach((x) => {
    score += 8;
    notes.push(`甲方${x}旺，正补乙方所缺`);
  });
  strongB.filter((x) => lackA.includes(x)).forEach((x) => {
    score += 8;
    notes.push(`乙方${x}旺，正补甲方所缺`);
  });
  const both = lackA.filter((x) => lackB.includes(x));
  if (both.length) {
    score -= 5 * both.length;
    notes.push(`两人同缺${both.join('、')}，需共同补益`);
  }
  if (!notes.length) notes.push('两人五行分布接近，互补性一般');
  return { score, notes };
}

/** 十神互看：我看对方 / 对方看我 */
function deityCross(a, b) {
  const ab = shiShen(a.pillars[2].gan, b.pillars[2].gan);
  const ba = shiShen(b.pillars[2].gan, a.pillars[2].gan);
  const good = ['正官', '正财', '正印', '食神', '偏财'];
  const score = (good.includes(ab) ? 4 : 2) + (good.includes(ba) ? 4 : 2);
  return { ab, ba, score };
}

function levelOf(score) {
  if (score >= 90) return '上等婚配';
  if (score >= 75) return '良好配对';
  if (score >= 60) return '中等配对';
  if (score >= 45) return '需用心经营';
  return '磨合较多';
}

/**
 * 双人合婚
 * @param {object} a 甲方（buildBazi 结果）
 * @param {object} b 乙方（buildBazi 结果）
 */
export function buildHehun(a, b) {
  const aYear = a.pillars[0].zhi;
  const bYear = b.pillars[0].zhi;
  const aDay = a.pillars[2].zhi;
  const bDay = b.pillars[2].zhi;
  const aGan = a.pillars[2].gan;
  const bGan = b.pillars[2].gan;

  const yRel = zhiRelation(aYear, bYear);
  const dRel = zhiRelation(aDay, bDay);
  const gRel = ganRelation(aGan, bGan);
  const wuxing = wuxingComplement(a, b);
  const deity = deityCross(a, b);

  const score = Math.max(0, Math.min(100,
    40 + (YEAR_SCORE[yRel.key] || 0) + (DAY_SCORE[dRel.key] || 0) + (GAN_SCORE[gRel.key] || 0) + wuxing.score + (deity.score - 4)));

  const items = [
    { title: '生肖根基', tag: yRel.key },
    { title: '夫妻宫', tag: dRel.key },
    { title: '日干气场', tag: gRel.key },
    { title: '五行互补', tag: wuxing.score >= 8 ? '互补' : wuxing.score < 0 ? '同缺' : '平' },
    { title: '十神互看', tag: `${deity.ab}／${deity.ba}` },
  ];

  const sections = [
    {
      title: '生肖根基',
      tag: yRel.key,
      basis: [`甲方年支 ${aYear}（属${ZHI_SHENGXIAO['子丑寅卯辰巳午未申酉戌亥'.indexOf(aYear)]}）`, `乙方年支 ${bYear}（属${ZHI_SHENGXIAO['子丑寅卯辰巳午未申酉戌亥'.indexOf(bYear)]}）`],
      plain: yRel.good
        ? `${aYear}与${bYear}为${yRel.key}，长辈缘与起点气场相合，两家往来容易谈得拢；适合以「先合家人、再谈两人」的节奏推进。`
        : `${aYear}与${bYear}为${yRel.key}，起点气场有摩擦，常见于节奏与家庭观念不同；宜早把节假日安排、双方父母界限讲清，避免小事积压。`,
    },
    {
      title: '夫妻宫',
      tag: dRel.key,
      basis: [`甲方日支 ${aDay}（配偶宫）`, `乙方日支 ${bDay}（配偶宫）`],
      plain: dRel.key === '六合' || dRel.key === '三合'
        ? `两人日支${dRel.key}，是最实在的一项：日常相处节奏容易对上，吵架后也容易和好。此项在合婚里分量最重，属可长期经营的组合。`
        : dRel.key === '六冲'
          ? `两人日支六冲，作息、脾气、家务分工都容易顶牛；冲不是不能过，但要靠制度（分工表、冷静期）替代靠感觉。`
          : dRel.key === '相刑' || dRel.key === '自刑'
            ? `两人日支${dRel.key}，容易在同一件事上反复较劲；宜提前约定「谁说了算」的领域，各自留空间。`
            : dRel.key === '相害'
              ? `两人日支相害，容易在细节上互相消耗，表面无事、内里记账；宜把不满当场说清，别过夜。`
              : `两人日支${dRel.key}，相处基调平稳，谈不上天作之合，但胜在不折腾；靠日常维护即可。`,
    },
    {
      title: '日干气场',
      tag: gRel.key,
      basis: [`甲方日干 ${aGan}（${GAN_WUXING[aGan]}）`, `乙方日干 ${bGan}（${GAN_WUXING[bGan]}）`],
      plain: gRel.good
        ? `${aGan}与${bGan}${gRel.key}，两人在「想法与表达」上容易接得住对方，遇事能商量；${gRel.key === '五合' ? '五合更是难得，主天然亲近。' : '保持各自的节奏即可。'}`
        : `${aGan}与${bGan}${gRel.key}，表达方式差异明显，一方直、一方绕；宜先复述对方意思再回应，减少误读。`,
    },
    {
      title: '五行互补',
      tag: wuxing.score >= 8 ? '互补' : wuxing.score < 0 ? '同缺' : '平',
      basis: wuxing.notes,
      plain: wuxing.score > 0
        ? '彼此的强项正是对方的短板，属「搭伙能过好日子」的组合；建议把互补落到分工上，谁强谁主事。'
        : wuxing.score < 0
          ? '两人缺同一类五行，容易在同一件事上一起失衡（如都缺金则决断慢）；宜引入第三方意见或外部规则。'
          : '五行互补性一般，日子更多靠经营而非靠气场。',
    },
    {
      title: '十神互看',
      tag: `${deity.ab}／${deity.ba}`,
      basis: [`甲方看乙方为${deity.ab}`, `乙方看甲方为${deity.ba}`],
      plain: `在甲方眼里，乙方是「${deity.ab}」的角色；在乙方眼里，甲方是「${deity.ba}」。${
        ['正官', '正财', '正印', '食神', '偏财'].includes(deity.ab) && ['正官', '正财', '正印', '食神', '偏财'].includes(deity.ba)
          ? '双方互为正星，容易彼此认可、愿意负责，是适合结婚的组合。'
          : '角色定位不完全对等，需注意别把对方当成「照顾者」或「管理者」，把期待说成请求更有效。'
      }`,
    },
  ];

  const advice = [];
  if (!dRel.good) advice.push('日支有摩擦：固定每周一次「不带情绪的复盘」，只谈事不谈人。');
  if (!gRel.good) advice.push('表达方式不同：重要的话写成文字再发，避免当面越说越急。');
  if (wuxing.score < 0) advice.push(`两人同缺${wuxing.notes.join('；')}：把补益落到共同习惯上（作息、方位、颜色、运动）。`);
  if (yRel.good) advice.push('生肖根基相合：多安排两家共同出席的场合，长辈支持会成为助力。');
  advice.push('分数只是传统算法的参考，不是定论；能落地的相处建议比分数更重要。');

  return {
    score,
    level: levelOf(score),
    items,
    sections,
    advice,
    a: {
      name: a.name, gender: a.gender, shengxiao: a.header.shengxiao,
      sizhu: a.pillars.map((p) => p.gan + p.zhi),
      solar: a.solarText, riZhi: aDay, dayGan: aGan,
    },
    b: {
      name: b.name, gender: b.gender, shengxiao: b.header.shengxiao,
      sizhu: b.pillars.map((p) => p.gan + p.zhi),
      solar: b.solarText, riZhi: bDay, dayGan: bGan,
    },
    detail: { year: yRel.key, day: dRel.key, gan: gRel.key },
  };
}
