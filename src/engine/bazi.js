import { Solar, Lunar } from 'lunar-javascript';
import {
  GAN_WUXING, HIDE_GAN, HIDE_WEIGHT, WUXING_ORDER, shiShen,
} from './constants.js';

/** 均时差（分钟），用于真太阳时校正 */
function equationOfTime(y, m, d) {
  const start = new Date(y, 0, 1);
  const n = Math.floor((new Date(y, m - 1, d) - start) / 86400000) + 1;
  const B = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/** 按出生地经度 + 均时差校正真太阳时 */
export function trueSolarTime(y, m, d, hour, minute, lon) {
  const eot = equationOfTime(y, m, d);
  const lonOffset = (lon - 120) * 4;
  const total = lonOffset + eot;
  const t = new Date(y, m - 1, d, hour, minute, 0);
  t.setMinutes(t.getMinutes() + Math.round(total));
  const sign = total >= 0 ? '+' : '−';
  const abs = Math.abs(total);
  const note = `经度差 ${lonOffset >= 0 ? '+' : '−'}${Math.abs(lonOffset).toFixed(1)} 分，均时差 ${eot >= 0 ? '+' : '−'}${Math.abs(eot).toFixed(1)} 分，合计 ${sign}${Math.floor(abs)} 分 ${Math.round((abs % 1) * 60)} 秒；校正后 ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`;
  return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate(), hour: t.getHours(), minute: t.getMinutes(), note, totalMinutes: total };
}

/** 生辰入参 → 公历 Solar */
export function toSolar(input) {
  const { solar, leap, year, month, day, hour, minute = 0 } = input;
  if (solar) {
    return Solar.fromYmdHms(year, month, day, hour, minute, 0);
  }
  const lunarMonth = leap ? -Math.abs(month) : month;
  const lunar = Lunar.fromYmdHms(year, lunarMonth, day, hour, minute, 0);
  return lunar.getSolar();
}

/** 四柱 */
function buildPillars(ec) {
  const dayGan = ec.getDayGan();
  const defs = [
    { label: '年柱', gan: ec.getYearGan(), zhi: ec.getYearZhi(), hide: ec.getYearHideGan(), nayin: ec.getYearNaYin(), dishi: ec.getYearDiShi(), xunkong: ec.getYearXunKong(), shiShenGan: ec.getYearShiShenGan() },
    { label: '月柱', gan: ec.getMonthGan(), zhi: ec.getMonthZhi(), hide: ec.getMonthHideGan(), nayin: ec.getMonthNaYin(), dishi: ec.getMonthDiShi(), xunkong: ec.getMonthXunKong(), shiShenGan: ec.getMonthShiShenGan() },
    { label: '日柱', gan: ec.getDayGan(), zhi: ec.getDayZhi(), hide: ec.getDayHideGan(), nayin: ec.getDayNaYin(), dishi: ec.getDayDiShi(), xunkong: ec.getDayXunKong(), shiShenGan: '日主' },
    { label: '时柱', gan: ec.getTimeGan(), zhi: ec.getTimeZhi(), hide: ec.getTimeHideGan(), nayin: ec.getTimeNaYin(), dishi: ec.getTimeDiShi(), xunkong: ec.getTimeXunKong(), shiShenGan: ec.getTimeShiShenGan() },
  ];
  return defs.map((p) => ({
    label: p.label,
    gan: p.gan,
    zhi: p.zhi,
    ganDeity: p.shiShenGan,
    zhiDeity: shiShen(dayGan, p.hide[0]),
    naYin: p.nayin,
    diShi: p.dishi,
    xunKong: p.xunkong,
    hideGan: p.hide.map((g) => ({ gan: g, deity: shiShen(dayGan, g) })),
  }));
}

/** 五行分布（天干 1 分 / 藏干本气 1、中气 0.4、余气 0.2，月支 ×1.8） */
function buildWuXing(pillars) {
  const map = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  pillars.forEach((p, i) => {
    map[GAN_WUXING[p.gan]] += 1;
    const zhiWeight = i === 1 ? 1.8 : 1;
    (HIDE_GAN[p.zhi] || []).forEach((g, k) => {
      map[GAN_WUXING[g]] += HIDE_WEIGHT[k] * zhiWeight;
    });
  });
  return WUXING_ORDER.map((name) => ({ name, value: Math.round(map[name] * 10) / 10 }));
}

/** 大运 */
function buildDaYun(ec, gender, currentYear) {
  const yun = ec.getYun(gender === '女' ? 0 : 1);
  const list = yun.getDaYun().slice(1).map((d) => ({
    gz: d.getGanZhi(),
    startAge: d.getStartAge(),
    endAge: d.getEndAge(),
    startYear: d.getStartYear(),
    endYear: d.getEndYear(),
    current: currentYear >= d.getStartYear() && currentYear <= d.getEndYear(),
  }));
  const startText = `${yun.getStartYear()} 年 ${yun.getStartMonth()} 个月 ${yun.getStartDay()} 天起运`;
  return { list, startText, startSolar: yun.getStartSolar().toYmd() };
}

/**
 * 构建单人排盘（四柱部分；紫微由 ziwei.js 单独计算）
 * 仅做历法换算与盘面数据呈现，不含任何判断性内容。
 */
export function buildBazi(input, currentYear = new Date().getFullYear()) {
  const hour = input.hour;
  const minute = input.minute || 0;
  let correction = null;

  let solar = toSolar({ ...input, hour, minute });
  if (input.truesolar && input.lon) {
    const adj = trueSolarTime(solar.getYear(), solar.getMonth(), solar.getDay(), solar.getHour(), minute, input.lon);
    correction = { ...adj, city: input.city, lon: input.lon };
    solar = Solar.fromYmdHms(adj.y, adj.m, adj.d, adj.hour, adj.minute, 0);
  }

  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const pillars = buildPillars(ec);
  const wuxing = buildWuXing(pillars);
  const daYun = buildDaYun(ec, input.gender, currentYear);
  const beijingSolar = toSolar({ ...input, hour, minute });

  return {
    name: input.name || '',
    gender: input.gender,
    birthplace: input.birthplace || '',
    solarText: solar.toYmd(),
    lunarText: `${lunar.getYearInChinese()}年${(lunar.getMonth() < 0 ? '闰' : '')}${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    header: {
      solar: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${String(solar.getHour()).padStart(2, '0')}:${String(solar.getMinute()).padStart(2, '0')}`,
      lunar: `${lunar.getYearInChinese()}年${(lunar.getMonth() < 0 ? '闰' : '')}${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`,
      minggong: ec.getMingGong(),
      taiyuan: ec.getTaiYuan(),
      shengong: ec.getShenGong(),
      start: daYun.startText,
      shengxiao: lunar.getYearShengXiao(),
      xingzuo: beijingSolar.getXingZuo() + '座',
    },
    pillars,
    wuxing,
    strength: {
      dayGan: pillars[2].gan,
      dayWuXing: GAN_WUXING[pillars[2].gan],
    },
    dayun: daYun,
    correction,
    lunar,
    solar,
    eightChar: ec,
  };
}
