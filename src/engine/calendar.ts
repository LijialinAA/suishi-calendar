import { Lunar, LunarMonth, LunarYear, Solar } from 'lunar-javascript';

const CN_NUM = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const CN_DAY = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

export const LUNAR_YEARS = (() => {
  const arr: number[] = [];
  for (let y = 1900; y <= 2100; y++) arr.push(y);
  return arr;
})();

/** 某农历年的月份选项（含闰月） */
export function lunarMonthOptions (year: number) {
  const leap = LunarYearLeap(year);
  const list: { label: string, value: number }[] = [];
  for (let m = 1; m <= 12; m++) {
    list.push({ label: `${CN_NUM[m - 1]}月`, value: m });
    if (leap === m) list.push({ label: `闰${CN_NUM[m - 1]}月`, value: -m });
  }
  return list;
}

function LunarYearLeap (year: number) {
  try {
    return LunarYear.fromYear(year).getLeapMonth();
  } catch (e) {
    return 0;
  }
}

/** 某农历月天数 → 日期选项 */
export function lunarDayOptions (year: number, monthValue: number) {
  let count = 30;
  try {
    const lm = LunarMonth.fromYm(year, monthValue);
    if (lm) count = lm.getDayCount();
  } catch (e) {
    count = 30;
  }
  const list: { label: string, value: number }[] = [];
  for (let d = 1; d <= count; d++) list.push({ label: CN_DAY[d - 1], value: d });
  return list;
}

/** 农历年月日 → 公历年月日 */
export function lunarToSolar (year: number, monthValue: number, day: number) {
  const solar = Lunar.fromYmd(year, monthValue, day).getSolar();
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
}

export function pad2 (n: number) {
  return n < 10 ? '0' + n : '' + n;
}

export function solarLabel (year: number, month: number, day: number) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  return `${year}年${month}月${day}日 · 农历${(lunar.getMonth() < 0 ? '闰' : '')}${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
}

export const HOUR_OPTIONS = [
  { label: '子时 23:00–00:59', hour: 0 },
  { label: '丑时 01:00–02:59', hour: 2 },
  { label: '寅时 03:00–04:59', hour: 4 },
  { label: '卯时 05:00–06:59', hour: 6 },
  { label: '辰时 07:00–08:59', hour: 8 },
  { label: '巳时 09:00–10:59', hour: 10 },
  { label: '午时 11:00–12:59', hour: 12 },
  { label: '未时 13:00–14:59', hour: 14 },
  { label: '申时 15:00–16:59', hour: 16 },
  { label: '酉时 17:00–18:59', hour: 18 },
  { label: '戌时 19:00–20:59', hour: 20 },
  { label: '亥时 21:00–22:59', hour: 22 },
  { label: '时辰不详（按午时）', hour: 12 }
];
