import GEO from '../data/geo.json';

/** 省 / 市 / 区三级地名数据（取自桌面版内置 geo.json） */
export const PROVINCES = GEO.provinces.map((p) => p.n);

export function citiesOf(province) {
  const p = GEO.provinces.find((x) => x.n === province);
  return p ? p.c.map((c) => c.n) : [];
}

export function districtsOf(province, city) {
  const p = GEO.provinces.find((x) => x.n === province);
  if (!p) return [];
  const c = p.c.find((x) => x.n === city);
  return c ? c.a : [];
}

/** 取城市中心经度，用于真太阳时校正 */
export function cityLon(province, city) {
  const p = GEO.provinces.find((x) => x.n === province);
  if (!p) return null;
  const c = p.c.find((x) => x.n === city);
  if (c && c.cp) return c.cp[0];
  if (p.cp) return p.cp[0];
  return null;
}

export const DEFAULT_PLACE = { province: '北京市', city: '北京市', district: '东城区' };

/** 三级联动 picker 的候选列 */
export function placeColumns(province, city) {
  const provs = PROVINCES;
  const cities = citiesOf(province || provs[0]);
  const districts = districtsOf(province || provs[0], city || cities[0]);
  return [provs, cities, districts];
}

/** 由 picker 的 index 数组还原地名 */
export function placeFromIndex(idx) {
  const province = PROVINCES[idx[0]] || PROVINCES[0];
  const cities = citiesOf(province);
  const city = cities[idx[1]] || cities[0];
  const districts = districtsOf(province, city);
  const district = districts[idx[2]] || districts[0] || '';
  return { province, city, district };
}

/** 地名 → picker index */
export function indexFromPlace(place) {
  const province = place.province || PROVINCES[0];
  const pi = Math.max(0, PROVINCES.indexOf(province));
  const cities = citiesOf(province);
  const ci = Math.max(0, cities.indexOf(place.city));
  const districts = districtsOf(province, cities[ci] || cities[0]);
  const di = Math.max(0, districts.indexOf(place.district));
  return [pi, ci, di];
}
