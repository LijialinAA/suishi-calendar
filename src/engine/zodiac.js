// 十二星座档案：阳历生日定星座，四象/五行意象、性格、今日联动、开运、配对
// 数据取自桌面版 v25 星座档案，纯本地计算

export const ZODIAC = [
  { n: '白羊座', s: '♈', a: [3, 21], b: [4, 19], el: '火', yy: '阳', star: '火星', wx: '火',
    keys: ['直率', '开创', '行动力'],
    good: ['先动手再完善，破局速度最快', '不记旧账，愿意给人第二次机会'],
    care: ['性子急，容易把话说满', '开局猛、收尾松，要给自己设检查点'],
    color: '朱红', cval: '#b3442f', num: '9', best: ['狮子座', '射手座'], careZ: '天秤座',
    desc: '春分后第一股生发之气，象火之炎上：先动起来，再在途中校准方向。' },
  { n: '金牛座', s: '♉', a: [4, 20], b: [5, 20], el: '土', yy: '阴', star: '金星', wx: '土',
    keys: ['稳当', '耐力', '质感'],
    good: ['慢热但持久，能把事一件件做实', '对钱与资源有天然的边界感'],
    care: ['一旦定了节奏就不太愿意改', '容易把「稳妥」拖成「不动」'],
    color: '缃黄', cval: '#b8924a', num: '6', best: ['处女座', '摩羯座'], careZ: '水瓶座',
    desc: '象土之稼穑：先把根扎稳，收成自然来，急不得也催不得。' },
  { n: '双子座', s: '♊', a: [5, 21], b: [6, 21], el: '风', yy: '阳', star: '水星', wx: '木',
    keys: ['灵敏', '联结', '好奇'],
    good: ['信息抓得快，能在不同人之间搭桥', '同时开几条线也不慌'],
    care: ['兴趣太散，容易样样浅尝', '答应得太快，交付时要补账'],
    color: '竹青', cval: '#3f6b5e', num: '5', best: ['天秤座', '水瓶座'], careZ: '双鱼座',
    desc: '风木同气，主生发流通：靠连接与交换长本事，别把自己锁在一条道上。' },
  { n: '巨蟹座', s: '♋', a: [6, 22], b: [7, 22], el: '水', yy: '阴', star: '月亮', wx: '水',
    keys: ['顾家', '体察', '守成'],
    good: ['记得住别人的细节，照顾得体面', '能把散的人与事收拢成一处'],
    care: ['情绪一上来就先退半步', '太怕打扰别人，容易自己扛'],
    color: '玄青', cval: '#3f5b6b', num: '2', best: ['天蝎座', '双鱼座'], careZ: '白羊座',
    desc: '象水之润下：往下沉、往里护，安稳感是自己一点点养出来的。' },
  { n: '狮子座', s: '♌', a: [7, 23], b: [8, 22], el: '火', yy: '阳', star: '太阳', wx: '火',
    keys: ['坦荡', '担当', '场面感'],
    good: ['敢把责任揽到自己身上', '给人撑场面，也让人愿意跟着干'],
    care: ['在意是否被看见，容易硬撑', '不太擅长先认错再收场'],
    color: '赤金', cval: '#c07b2c', num: '1', best: ['白羊座', '射手座'], careZ: '天蝎座',
    desc: '火之正位，光明外显：把台子搭起来，也记得给别人留光。' },
  { n: '处女座', s: '♍', a: [8, 23], b: [9, 22], el: '土', yy: '阴', star: '水星', wx: '土',
    keys: ['条理', '校准', '务实'],
    good: ['能把混乱的流程理出顺序', '发现小问题早，省掉后面大返工'],
    care: ['标准一高，就容易陷进细节', '对人对己同一把尺，太紧'],
    color: '秋香', cval: '#8a8a4a', num: '4', best: ['金牛座', '摩羯座'], careZ: '射手座',
    desc: '土之收敛：先把边界和次序理清，效率是从整洁里长出来的。' },
  { n: '天秤座', s: '♎', a: [9, 23], b: [10, 23], el: '风', yy: '阳', star: '金星', wx: '木',
    keys: ['权衡', '分寸', '协调'],
    good: ['天然会看两边的立场，适合做调停', '审美与分寸感稳，不轻易失礼'],
    care: ['反复比较，决定下得慢', '为了不扫兴，容易把真实想法咽回去'],
    color: '月白', cval: '#c9c2b0', num: '7', best: ['双子座', '水瓶座'], careZ: '白羊座',
    desc: '风木主疏泄：把关系理顺比把事做快更要紧，但别把取舍也一并拖住。' },
  { n: '天蝎座', s: '♏', a: [10, 24], b: [11, 22], el: '水', yy: '阴', star: '冥王星', wx: '水',
    keys: ['深究', '专注', '洞察'],
    good: ['看人看事能穿过表层', '认定了就肯长时间投入，不轻易撤'],
    care: ['不轻易交底，容易被人误读', '记性太好，旧账放得慢'],
    color: '墨紫', cval: '#5b3a5b', num: '8', best: ['巨蟹座', '双鱼座'], careZ: '狮子座',
    desc: '水之沉潜：往深里去是本事，偶尔浮上来透口气也是本事。' },
  { n: '射手座', s: '♐', a: [11, 23], b: [12, 21], el: '火', yy: '阳', star: '木星', wx: '火',
    keys: ['开阔', '直陈', '远行'],
    good: ['看得远，愿意为可能性下注', '话说得直，合作里反而省成本'],
    care: ['讨厌琐碎，落地环节容易掉链子', '承诺给得比时间表快'],
    color: '赭橙', cval: '#a85f34', num: '3', best: ['白羊座', '狮子座'], careZ: '处女座',
    desc: '火之行健：方向感比路线图重要，但走到最后还得靠一张能执行的表。' },
  { n: '摩羯座', s: '♑', a: [12, 22], b: [1, 19], el: '土', yy: '阴', star: '土星', wx: '土',
    keys: ['克制', '耐久', '章法'],
    good: ['肯做长周期的事，不靠一时热度', '有台阶意识，知道先补哪块短板'],
    care: ['习惯独自扛，不太开口求助', '把休息也排成任务，弦绷得久'],
    color: '黛黑', cval: '#4a4a46', num: '10', best: ['金牛座', '处女座'], careZ: '巨蟹座',
    desc: '土之厚重：一步一步往上垒，慢是慢，但垒起来的不太会塌。' },
  { n: '水瓶座', s: '♒', a: [1, 20], b: [2, 18], el: '风', yy: '阳', star: '天王星', wx: '木',
    keys: ['独立', '重构', '前瞻'],
    good: ['敢换框架想问题，不困在惯例里', '对异见包容，能容纳很不一样的人'],
    care: ['讲道理多于讲感受，容易显得远', '规则说改就改，旁人跟不上'],
    color: '霜蓝', cval: '#6b8496', num: '11', best: ['双子座', '天秤座'], careZ: '金牛座',
    desc: '风木之变：先看到另一种可能，再回来把根扎进现实里。' },
  { n: '双鱼座', s: '♓', a: [2, 19], b: [3, 20], el: '水', yy: '阴', star: '海王星', wx: '水',
    keys: ['共情', '想象', '包容'],
    good: ['能接住别人没说出口的情绪', '在模糊地带也能找到自己的做法'],
    care: ['边界软，容易被别人的事卷进去', '想得美、落得慢，需要有人帮忙定时'],
    color: '藕荷', cval: '#a98aa8', num: '12', best: ['巨蟹座', '天蝎座'], careZ: '双子座',
    desc: '水之无形：随物赋形是天赋，给自己留一条岸也是必要的。' }
];

export const EL_TXT = {
  '火': '火象 → 火（炎上）：主动、外放、先行动再校准；对应礼。',
  '土': '土象 → 土（稼穑）：承载、务实、重积累；对应信。',
  '风': '风象 → 木（风木同气）：生发、流通、善联结；对应仁。',
  '水': '水象 → 水（润下）：内敛、洞察、往下沉；对应智。'
};

function md(m, d) { return m * 100 + d; }

export function zodiacOf(month, day) {
  const v = md(month, day);
  for (const z of ZODIAC) {
    const a = md(z.a[0], z.a[1]);
    const b = md(z.b[0], z.b[1]);
    if (a <= b) { if (v >= a && v <= b) return z; }
    else { if (v >= a || v <= b) return z; }
  }
  return null;
}

export function dateRange(z) {
  return `${z.a[0]}月${z.a[1]}日 – ${z.b[0]}月${z.b[1]}日`;
}

/** 生成星座档案
 * @param {number} month 阳历月
 * @param {number} day 阳历日
 * @param {object} al 今日黄历 (buildAlmanac 结果)
 * @param {object|null} meta 八字元信息 {day_gan, tone, xi, ji, sizhu}，可空
 * @param {string} focus 'all'|'trait'|'today'|'match'
 * @param {boolean} wxOn 是否叠加八字喜用
 */
export function buildZodiac(month, day, al, meta, focus = 'all', wxOn = true) {
  const z = zodiacOf(month, day);
  if (!z) throw new Error('未能定位星座，请确认阳历生日');
  const a = al || {};
  let todayZ = null;
  for (const x of ZODIAC) { if (String(a.xingzuo || '').indexOf(x.n) === 0) { todayZ = x; break; } }
  const isToday = !!todayZ && todayZ.n === z.n;
  const showTrait = focus === 'all' || focus === 'trait';
  const showToday = focus === 'all' || focus === 'today';
  const showMatch = focus === 'all' || focus === 'match';
  const metaOk = wxOn && meta && meta.xi && meta.xi.length;

  // 今日提示文案
  let line;
  if (isToday) line = '今日太阳正行经本命星座，宜把最要紧的一件事放在吉时里办。';
  else if (todayZ && todayZ.el === z.el) line = `今日 ${a.xingzuo || ''}座与本命同属${z.el}象，节奏合拍，适合推进已定下来的事。`;
  else line = `今日 ${a.xingzuo || ''}座属${todayZ ? todayZ.el : '他'}象，与本命${z.el}象节奏不同，宜慢半拍、多确认一句。`;

  return {
    z, todayZ, isToday, showTrait, showToday, showMatch, metaOk,
    dateRange: dateRange(z),
    elText: EL_TXT[z.el],
    todayLine: line,
    luckyHour: (a.luckyHours && a.luckyHours[0]) || '—',
    yi: (a.yi || []).slice(0, 3).join('、') || '—',
    ji: (a.ji || []).slice(0, 2).join('、') || '—',
    note: '星座以阳历日期分区，八字以干支历推演，二者分属不同体系，本页的「五行参照」只作意象对照，不做命理量化。报告由本地引擎生成，不联网、不上传任何输入内容。'
  };
}
