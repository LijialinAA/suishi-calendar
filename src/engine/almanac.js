import { Solar, Lunar } from 'lunar-javascript';
import { WUXING_ORDER, HIDE_GAN, HIDE_WEIGHT, GAN_WUXING, HOUR_NAMES } from './constants.js';

const WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];

/** 农历年总天数与已过天数（以正月初一为起点） */
function lunarYearProgress(lunar) {
  const ly = lunar.getYear();
  const start = Lunar.fromYmd(ly, 1, 1).getSolar();
  const nextStart = Lunar.fromYmd(ly + 1, 1, 1).getSolar();
  const total = nextStart.subtract(start);
  const passed = lunar.getSolar().subtract(start) + 1;
  const remainPct = Math.max(0, Math.round(((total - passed) / total) * 100));
  return { lyYear: ly, lyTotal: total, lyPassed: passed, lyRemainPct: remainPct };
}

function lunarMonthCN(lunar) {
  const m = lunar.getMonth();
  return (m < 0 ? '闰' : '') + lunar.getMonthInChinese() + '月';
}

/** 某日某时的五行分布（以时柱干支的藏干计权） */
function hourWuXing(gz) {
  const map = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  if (!gz) return map;
  const gan = gz.charAt(0);
  const zhi = gz.charAt(1);
  map[GAN_WUXING[gan]] += 1;
  (HIDE_GAN[zhi] || []).forEach((g, i) => {
    map[GAN_WUXING[g]] += HIDE_WEIGHT[i] || 0.2;
  });
  WUXING_ORDER.forEach((k) => { map[k] = Math.round(map[k] * 10) / 10; });
  return map;
}

/** 构建某一天的月历（周一开头，含上月/下月补位） */
function buildCalendar(year, month, day, today) {
  const first = new Date(year, month - 1, 1);
  const offset = (first.getDay() + 6) % 7; // 周一 = 0
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();
  const cells = [];
  const total = 42;
  for (let i = 0; i < total; i++) {
    const idx = i - offset + 1;
    let y = year; let m = month; let d = idx; let inMonth = true;
    if (idx < 1) { inMonth = false; d = prevMonthDays + idx; m = month - 1; if (m < 1) { m = 12; y -= 1; } }
    else if (idx > daysInMonth) { inMonth = false; d = idx - daysInMonth; m = month + 1; if (m > 12) { m = 1; y += 1; } }
    const solar = Solar.fromYmd(y, m, d);
    const lunar = solar.getLunar();
    const jq = lunar.getJieQi();
    const lunarDay = lunar.getDayInChinese();
    let lunarText = lunarDay;
    if (lunar.getDay() === 1) lunarText = lunarMonthCN(lunar);
    if (jq) lunarText = jq;
    cells.push({
      y, m, d,
      lunar: lunarText,
      inMonth,
      weekday: solar.getWeek(),
      jq: !!jq,
      today: !!today && y === today.y && m === today.m && d === today.d,
      sel: y === year && m === month && d === day,
    });
  }
  // 末尾整周若全部属于下月则裁掉
  while (cells.length > 35 && cells.slice(35).every((c) => !c.inMonth)) cells.length = 35;
  return cells;
}

/** 今日宜忌、方位、时辰等黄历主体 */
export function buildAlmanac(year, month, day, now = new Date()) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const progress = lunarYearProgress(lunar);

  const nowHour = now.getHours();
  const times = lunar.getTimes();
  // getTimes 返回 13 项（含早子、晚子），展示取前 12 项（子时至亥时）
  const rows = times.slice(0, 12).map((t, i) => ({
    name: HOUR_NAMES[i],
    range: `${t.getMinHm()}–${t.getMaxHm()}`,
    gz: t.getGanZhi(),
    tianshen: t.getTianShen(),
    luck: t.getTianShenLuck(),
    chong: t.getChongDesc(),
    shengxiao: t.getShengXiao(),
    yi: t.getYi().slice(0, 6),
    ji: t.getJi().slice(0, 6),
  }));

  const curRow = rows[Math.floor(((nowHour + 1) % 24) / 2)];
  const luckyHours = rows.filter((r) => r.luck === '吉').map((r) => r.name);

  const isToday = now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day;

  return {
    y: year, m: month, d: day,
    week: '星期' + WEEK_CN[solar.getWeek()],
    isToday,
    lunar: `${lunarMonthCN(lunar)}${lunar.getDayInChinese()}`,
    lunarFull: `农历${lunar.getYearInChinese()}年${lunarMonthCN(lunar)}${lunar.getDayInChinese()}`,
    gzYear: lunar.getYearInGanZhi(),
    gzMonth: lunar.getMonthInGanZhi(),
    gzDay: lunar.getDayInGanZhi(),
    sxYear: lunar.getYearShengXiao(),
    sxMonth: lunar.getMonthShengXiao(),
    sxDay: lunar.getDayShengXiao(),
    nyYear: lunar.getYearNaYin(),
    nyMonth: lunar.getMonthNaYin(),
    nyDay: lunar.getDayNaYin(),
    xingzuo: solar.getXingZuo() + '座',
    fest: lunar.getFestivals().concat(lunar.getOtherFestivals()),
    jieqi: lunar.getJieQi(),
    ...progress,
    tianshen: lunar.getDayTianShen(),
    tianshenType: lunar.getDayTianShenType(),
    zhixing: lunar.getZhiXing(),
    wuhou: lunar.getWuHou(),
    yuexiang: lunar.getYueXiang(),
    dayLu: lunar.getDayLu(),
    chong: lunar.getDayChongDesc(),
    sha: lunar.getDaySha(),
    pengzuGan: lunar.getPengZuGan(),
    pengzuZhi: lunar.getPengZuZhi(),
    yi: lunar.getDayYi(),
    ji: lunar.getDayJi(),
    jishen: lunar.getDayJiShen(),
    xiongsha: lunar.getDayXiongSha(),
    posCai: lunar.getDayPositionCaiDesc(),
    posXi: lunar.getDayPositionXiDesc(),
    posFu: lunar.getDayPositionFuDesc(),
    wuxing: WUXING_ORDER.map((name) => ({ name, value: hourWuXing(curRow && curRow.gz)[name] })),
    hourNow: curRow ? { name: curRow.name, range: curRow.range, gz: curRow.gz } : { name: '', range: '', gz: '' },
    luckyHours,
    times: rows,
    cal: buildCalendar(year, month, day, { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() }),
  };
}

/** 今日锦囊：宜忌 / 吉时 / 方位 / 开运 */
export function buildTips(al) {
  const sorted = al.wuxing.slice().sort((a, b) => b.value - a.value);
  const top = sorted[0] || { name: '土', value: 0 };
  return {
    yi: al.yi.slice(0, 2),
    ji: al.ji.slice(0, 2),
    hours: al.luckyHours.slice(0, 6),
    hourNow: al.hourNow.name,
    cai: al.posCai,
    xi: al.posXi,
    sha: al.sha,
    topWuxing: top.name,
    topValue: top.value,
    jishenCount: al.jishen.length,
    xiongshaCount: al.xiongsha.length,
  };
}

/** 流年太岁：值年干支纳音、犯太岁生肖、太岁方与岁破方 */
export function buildTaisui(al) {
  const yearZhi = al.gzYear.charAt(1);
  const chongPair = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
  const haiPair = { 子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅', 卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉' };
  const dir = { 子: '正北', 丑: '东北', 寅: '东北', 卯: '正东', 辰: '东南', 巳: '东南', 午: '正南', 未: '西南', 申: '西南', 酉: '正西', 戌: '西北', 亥: '西北' };
  const sx = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const offend = [];
  if (chongPair[yearZhi]) offend.push(sx[zhiList.indexOf(chongPair[yearZhi])] + '（冲）');
  if (haiPair[yearZhi]) offend.push(sx[zhiList.indexOf(haiPair[yearZhi])] + '（害）');
  offend.push(sx[zhiList.indexOf(yearZhi)] + '（值）');
  const sixtyIndex = (() => {
    const gz = al.gzYear;
    const ganIdx = '甲乙丙丁戊己庚辛壬癸'.indexOf(gz.charAt(0));
    const zhiIdx = zhiList.indexOf(gz.charAt(1));
    for (let i = 0; i < 60; i++) {
      if (i % 10 === ganIdx && i % 12 === zhiIdx) return i + 1;
    }
    return 0;
  })();
  return {
    gzYear: al.gzYear,
    nayin: al.nyYear,
    shengxiao: al.sxYear,
    offend: offend.join(' · '),
    taishuiDir: dir[yearZhi] || '',
    suipoDir: dir[chongPair[yearZhi]] || '',
    gzDay: al.gzDay,
    dayChong: al.chong,
    sixtyIndex,
  };
}
