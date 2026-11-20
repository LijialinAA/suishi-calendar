// 事业 / 学业 专题详批：基于四柱八字的喜用、十神、神煞、大运推导
// 替代桌面版 /api/topic 后端逻辑，纯本地计算

import { shiShen } from './constants.js';

// 行业方向：按喜用五行映射
const INDUSTRY = {
  '金': ['金融财会', '机械五金', '法律法务', '珠宝钟表', '汽车制造'],
  '木': ['教育出版', '医药养生', '林业园艺', '文化创意', '服饰纺织'],
  '水': ['商贸流通', '交通运输', '传媒资讯', '水产海洋', '旅游酒店'],
  '火': ['能源电力', '餐饮食品', '文娱演出', '电子科技', '互联网'],
  '土': ['地产建筑', '农业畜牧', '仓储物流', '陶瓷建材', '咨询顾问']
};

const INDUSTRY_BASE = {
  '金': '金主义，主肃杀决断，适合规则清晰、凭专业立身的行业。',
  '木': '木主仁，主生发条达，适合与人打交道、需要耐心与成长的行业。',
  '水': '水主智，主流通变化，适合信息密集、节奏快、需要灵活应变的行业。',
  '火': '火主礼，主光明外显，适合表达、创意、需要热度与感染力的行业。',
  '土': '土主信，主承载厚重，适合需要积累、守成、长期主义的行业。'
};

const SUBJECT = {
  '金': ['法学', '金融', '机械工程', '医学外科', '统计学'],
  '木': ['教育学', '文学', '中医学', '农林', '设计学'],
  '水': ['经济学', '传播学', '物流工程', '计算机', '外语'],
  '火': ['电子信息', '能源动力', '新闻传播', '表演艺术', '烹饪'],
  '土': ['土木工程', '建筑学', '农学', '地理科学', '管理学']
};

// 日主强弱 → 发展风格
const STRENGTH_STYLE = {
  '身强': '日主偏强，能量足、能扛事，适合做主攻手或独立担责；但要避免刚愎自用、听不进意见。',
  '中和': '日主中和，进退有度，能攻能守，适合在团队里做枢纽型角色，也能独当一面。',
  '身弱': '日主偏弱，需要借力与平台，适合在体系内稳步晋升或与强者合作；不宜单打独斗硬撑。'
};

// 十神 → 能力画像
const SHISHEN_ABILITY = {
  '比肩': '独立性强，肯自己扛；但容易与人争资源，合作中要主动让一步。',
  '劫财': '行动力快，敢闯敢拼；花钱与用权都要留余地，别凭一时义气。',
  '食神': '表达与享受兼备，有创意、会生活；适合靠内容、手艺、专业吃饭。',
  '伤官': '才华外显，能破局；但锋芒太露易招忌，学会收一半、露一半。',
  '偏财': '财路活络，善抓机会；适合做开拓与变现，忌贪多求快。',
  '正财': '财源稳定，重积累；适合做深耕型事业，一步一步垒。',
  '七杀': '压力下出成绩，决断力强；但脾气与压力管理要跟上，别硬扛。',
  '正官': '守规则、有担当，适合在体系内晋升；但别被条条框框框死。',
  '偏印': '思维独特，善钻研冷门；适合做研究、策划、技术攻关。',
  '正印': '学习力强，靠资历与学识吃饭；适合在专业领域持续积累。'
};

function shenShaSet(bazi) {
  const set = new Set();
  (bazi.shensha || []).forEach(s => set.add(s.name));
  return set;
}

// 带批语的大运在 bazi.comments.dayun（含 gz/age/current/level/text）
function currentDayun(bazi) {
  return (bazi.comments && bazi.comments.dayun || []).find(d => d.current) || null;
}

function nearYears(bazi, count = 10) {
  // 用大运的流年近似（这里简化：取当前大运干支与相邻年）
  const dy = currentDayun(bazi);
  if (!dy) return [];
  const base = new Date().getFullYear();
  const out = [];
  for (let i = 0; i < count; i++) {
    const y = base + i;
    // 简化：年干 = (y-4)%10, 年支 = (y-4)%12
    const ganIdx = (y - 4) % 10;
    const zhiIdx = (y - 4) % 12;
    const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const gz = GAN[ganIdx] + ZHI[zhiIdx];
    // 喜用判定：年干五行是否在喜用里
    const WX = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
    const xi = bazi.strength.favor || [];
    const ji = bazi.strength.avoid || [];
    const w = WX[GAN[ganIdx]];
    let level, tag, text;
    if (xi.indexOf(w) >= 0) { level = '吉'; tag = '得助'; text = '该年五行生扶日主，宜顺势推进、主动出击。'; }
    else if (ji.indexOf(w) >= 0) { level = '慎'; tag = '受制'; text = '该年五行克泄日主，宜守不宜攻，少做重大决策。'; }
    else { level = '中'; tag = '平稳'; text = '该年五行不偏不倚，按既定节奏走即可。'; }
    out.push({ y, age: y - (bazi.solar ? bazi.solar.getYear() : base) + 1, gz, level, tag, text, focus: i < 3 });
  }
  return out;
}

function wealthInfo(bazi) {
  const dayGan = bazi.strength.dayGan;
  const GAN_WX = {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'};
  const KE = {'木':'土','火':'金','土':'水','金':'木','水':'火'};
  const dayWx = GAN_WX[dayGan];
  const wealthWx = KE[dayWx];
  // 找财星位置
  let wealthStem = '', wealthBranch = '';
  bazi.pillars.forEach((p, i) => {
    const labels = ['年柱','月柱','日柱','时柱'];
    if (GAN_WX[p.gan] === wealthWx) wealthStem += labels[i] + ' ';
  });
  return { wealthWx, wealthStem: wealthStem.trim() || '四柱不显', note: `日主${dayGan}（${dayWx}）克${wealthWx}为财，${wealthStem ? '财星透出，财源较显' : '财星藏而不透，求财宜稳不宜急'}。` };
}

/**
 * 事业/学业专题
 * @param {string} kind 'career'|'study'
 * @param {object} bazi buildBazi 返回结果
 * @returns {sections, years, dayun, summary, meta}
 */
export function buildTopic(kind, bazi) {
  const meta = {
    name: bazi.name || '命主',
    gender: bazi.gender,
    day_gan: bazi.strength.dayGan,
    tone: bazi.strength.level,
    xi: bazi.strength.favor,
    ji: bazi.strength.avoid,
    sizhu: bazi.pillars.map(p => p.gan + p.zhi)
  };

  const ss = shenShaSet(bazi);
  const cur = currentDayun(bazi);
  const favor = bazi.strength.favor || [];
  const dayGan = bazi.strength.dayGan;

  // 找日主十神主气（月干）
  const monthGan = bazi.pillars[1] ? bazi.pillars[1].gan : dayGan;
  const mainShen = shiShen(dayGan, monthGan);
  const abilityText = SHISHEN_ABILITY[mainShen] || '日主格局平实，宜凭专业与积累立身。';

  const sections = [];

  if (kind === 'career') {
    // 1. 行业方向
    const ind = favor.length ? INDUSTRY[favor[0]] : ['咨询顾问', '服务业'];
    sections.push({
      id: 'industry', title: '行业方向',
      intro: INDUSTRY_BASE[favor[0]] || '喜用不显，宜先试错再聚焦。',
      items: [{
        t: '契合的行业（取第一喜用）',
        b: `日主 ${dayGan}，喜用 ${favor.join('、') || '待补'}，忌 ${(bazi.strength.avoid||[]).join('、')||'—'}。`,
        p: `首推：${ind.slice(0, 3).join('、')}；备选：${ind.slice(3).join('、')}。`,
        a: '入行前先做 3 个月的行业访谈或实习，确认节奏与价值观合得来再决定。'
      }]
    });

    // 2. 优势定位
    const ssList = [];
    if (ss.has('天乙贵人')) ssList.push('得天乙贵人，遇事多有人帮，适合做需要协调资源的岗位');
    if (ss.has('文昌')) ssList.push('文昌入命，文字、策划、学习能力是加分项');
    if (ss.has('驿马')) ssList.push('驿马星动，适合出差、外派、跨区域拓展的工作');
    if (ss.has('将星')) ssList.push('将星照命，有领导力，适合带团队或独立操盘');
    sections.push({
      id: 'ability', title: '优势定位',
      intro: STRENGTH_STYLE[meta.tone] || '',
      items: [
        { t: '主气十神', b: `月干 ${monthGan}，日主 ${dayGan}，主气为「${mainShen}」。`, p: abilityText, a: '把优势用在能反复放大的地方，而非每个项目都从零开始。' },
        { t: '神煞助力', b: `命中神煞：${[...ss].join('、')||'无显煞'}。`, p: ssList.length ? ssList.join('；') + '。' : '神煞不显，靠扎实基本功立身。', a: '有贵人星就主动维护人脉，有驿马就接受外勤机会。' }
      ]
    });

    // 3. 发展节奏（大运）
    const dyRows = (bazi.comments && bazi.comments.dayun || []).slice(0, 6).map(d => ({
      gz: d.gz, age: d.age, level: d.level || '中', text: d.text || ''
    }));
    sections.push({
      id: 'rhythm', title: '发展节奏（大运）',
      intro: cur ? `当前行「${cur.gz}」大运（${cur.age}岁起）。` : '大运尚未排定。',
      items: [{ t: '近六步大运', b: '大运管十年之走势，吉运宜进取，平运宜积累。', p: cur && cur.level === '吉' ? '当前大运为吉，宜抓住窗口做跃迁，但别把运气当能力。' : '当前大运偏平，宜练好内功、等下一个风口。', a: '每步大运的前 2 年定方向，中间 6 年执行，最后 2 年准备切换。' }]
    });

    // 4. 财路
    const w = wealthInfo(bazi);
    sections.push({
      id: 'wealth', title: '财路',
      intro: w.note,
      items: [{ t: '求财方式', b: `财星五行：${w.wealthWx}，透出：${w.wealthStem}。`, p: w.wealthStem !== '四柱不显' ? '财星透出，适合主动开拓、做销售或经营型岗位；也可适当理财。' : '财星藏支，求财宜走技术、专业路线，靠专业溢价而非冒险投机。', a: '不论财星显隐，都建议先存 6 个月应急金，再谈投资。' }]
    });

    // 5. 人际
    sections.push({
      id: 'relation', title: '人 际',
      intro: ss.has('天乙贵人') ? '命中带贵人，但贵人只帮「靠谱的人」。' : '贵人不显，人脉要靠自己一点点经营。',
      items: [{ t: '合作策略', b: `主气十神「${mainShen}」。`, p: mainShen === '比肩' || mainShen === '劫财' ? '比劫旺者，合作中要主动谈清分账，别讲面子。' : '食伤或官杀重者，适合找互补型搭档（一个对外、一个对内）。', a: '每年主动维护 3-5 个关键人脉，别等有事才联系。' }]
    });

    return {
      kind, title: '事业参考', summary: `日主 ${dayGan}，${meta.tone}，喜用 ${favor.join('、')||'—'}。整体宜在${ind[0]}-${ind[1]}类行业里，以「${mainShen}」为立身之本，借力当前大运与贵人星稳步推进。`,
      meta, sections, years: nearYears(bazi), dayun: dyRows,
      note: '本报告依据四柱十神、五行强弱、神煞与大运综合推演，供参考取舍；路怎么走，最终仍在自己脚下。'
    };
  }

  // study
  const sub = favor.length ? SUBJECT[favor[0]] : ['基础学科'];
  sections.push({
    id: 'subject', title: '学科方向',
    intro: INDUSTRY_BASE[favor[0]] || '',
    items: [{
      t: '契合的学科',
      b: `日主 ${dayGan}，喜用 ${favor.join('、')||'待补'}。`,
      p: `首推：${sub.slice(0, 3).join('、')}；可拓展：${sub.slice(3).join('、')}。`,
      a: '选专业前先了解该专业本科 4 年的核心课表，确认自己学得下去。'
    }]
  });

  const luckItems = [];
  if (ss.has('文昌')) luckItems.push('文昌入命，记忆力与文字表达是长项，适合偏文、偏记忆的科目');
  if (ss.has('华盖')) luckItems.push('华盖星现，适合钻研冷门、小众、需要深度的学问');
  if (ss.has('学堂') || ss.has('词馆')) luckItems.push('学堂/词馆入命，读书运较顺，易遇良师');
  sections.push({
    id: 'luck', title: '读书运',
    intro: luckItems.length ? '命中有助学之星。' : '命中无显耀助学星，靠方法与坚持更可靠。',
    items: [{
      t: '学习优势',
      b: `神煞：${[...ss].join('、')||'无显煞'}；主气十神「${mainShen}」。`,
      p: luckItems.length ? luckItems.join('；') + '。' : '没有文昌华盖也没关系，好的学习方法比天赋更重要。',
      a: mainShen === '正印' || mainShen === '偏印' ? '印星重者，适合系统学习、啃教材；把笔记做成可检索的知识库。' : '食伤重者，适合输出驱动：学完一章就讲给别人听或写成文章。'
    }]
  });

  // 考试吉年
  sections.push({
    id: 'exam', title: '考试吉年',
    intro: '以下为近十年流年五行对照喜用，仅作择期参考。',
    items: [{ t: '择期建议', b: '喜用年份宜安排重要考试、答辩、晋级。', p: '忌神年份宜回避重大考试，或提前加倍准备、留出余量。', a: '真正决定成绩的是平日积累，年份只影响发挥状态，别把它当唯一因素。' }]
  });

  // 阶段建议
  sections.push({
    id: 'stage', title: '阶段建议',
    intro: cur ? `当前行「${cur.gz}」大运。` : '',
    items: [{ t: '当下阶段', b: `主气「${mainShen}」，大运 ${cur ? cur.gz : '未定'}。`, p: STRENGTH_STYLE[meta.tone] || '', a: '把大目标拆成每周能完成的小任务，每周日晚上复盘一次。' }]
  });

  return {
    kind, title: '学业参考', summary: `日主 ${dayGan}，${meta.tone}，喜用 ${favor.join('、')||'—'}。整体宜在${sub[0]}-${sub[1]}方向深耕，借${ss.has('文昌')?'文昌':'学习方法'}之力，按流年节奏安排关键节点。`,
    meta, sections, years: nearYears(bazi), dayun: (bazi.comments && bazi.comments.dayun || []).slice(0, 6).map(d => ({ gz: d.gz, age: d.age, level: d.level || '中', text: d.text || '' })),
    note: '本报告依据四柱十神、五行强弱、神煞与大运综合推演，供参考取舍；读书的路，最终仍在自己脚下。'
  };
}
