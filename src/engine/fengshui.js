// 八宅风水：按出生年+性别推命卦，叠加八方游星吉凶与当日黄历方位
// 数据与桌面版 v25 一致，纯本地计算

const FS = {
  '坎':{'北':'伏位','东北':'五鬼','东':'天医','东南':'生气','南':'延年','西南':'绝命','西':'祸害','西北':'六煞'},
  '坤':{'北':'绝命','东北':'生气','东':'祸害','东南':'五鬼','南':'六煞','西南':'伏位','西':'天医','西北':'延年'},
  '震':{'北':'天医','东北':'祸害','东':'伏位','东南':'延年','南':'生气','西南':'六煞','西':'绝命','西北':'五鬼'},
  '巽':{'北':'生气','东北':'绝命','东':'延年','东南':'伏位','南':'天医','西南':'五鬼','西':'六煞','西北':'祸害'},
  '乾':{'北':'六煞','东北':'延年','东':'五鬼','东南':'祸害','南':'绝命','西南':'天医','西':'生气','西北':'伏位'},
  '兑':{'北':'祸害','东北':'天医','东':'绝命','东南':'六煞','南':'五鬼','西南':'延年','西':'伏位','西北':'生气'},
  '艮':{'北':'五鬼','东北':'伏位','东':'六煞','东南':'绝命','南':'祸害','西南':'生气','西':'延年','西北':'天医'},
  '离':{'北':'延年','东北':'六煞','东':'生气','东南':'天医','南':'伏位','西南':'祸害','西':'五鬼','西北':'绝命'}
};

export const DIRS = ['北','东北','东','东南','南','西南','西','西北'];

const GOOD = {'生气':1,'天医':1,'延年':1,'伏位':1};

export const STAR_TIP = {
  '生气':['最旺之方，宜开门、客厅、常活动处','活力与机遇，宜明亮通透'],
  '天医':['宜主卧、床头、养病静养','主健康与安稳，宜整洁不杂乱'],
  '延年':['宜书房、办公位、夫妻卧室','主和顺长久，宜坐得稳'],
  '伏位':['宜玄关、静处、财位收纳','主守成积蓄，宜安静不躁'],
  '绝命':['不宜卧室与大门，宜卫生间、储物','最弱之方，宜压不宜扬'],
  '五鬼':['不宜灶位与书房，宜通道、杂物','易生烦躁，宜保持干净少停留'],
  '六煞':['不宜主卧，宜次卫、储藏','主人事纷扰，宜化不宜催'],
  '祸害':['不宜久坐，宜过道、收纳','主小耗口舌，宜低调处理']
};

const GUA_EAST = {'坎':1,'离':1,'震':1,'巽':1};

const GUA_NAME = {'1':'坎','2':'坤','3':'震','4':'巽','6':'乾','7':'兑','8':'艮','9':'离'};

export function guaOf(year, gender) {
  const yy = year % 100;
  let n;
  if (year >= 2000) n = (gender === '男') ? (109 - yy) % 9 : (yy + 6) % 9;
  else n = (gender === '男') ? (100 - yy) % 9 : (yy - 4) % 9;
  n = ((n % 9) + 9) % 9;
  if (n === 0) n = 9;
  if (n === 5) return gender === '男' ? '坤' : '艮';
  return GUA_NAME[String(n)];
}

export function isGood(star) { return !!GOOD[star]; }

/**
 * 生成风水布局
 * @param {number} year 出生年
 * @param {string} gender '男'|'女'
 * @param {string} door 大门朝向 DIRS 之一
 * @param {string} bed 主卧方位 (可空)
 * @param {string} desk 书房/办公方位 (可空)
 * @param {object} al 今日黄历 buildAlmanac 结果
 */
export function buildFengshui(year, gender, door, bed, desk, al) {
  const gua = guaOf(year, gender);
  const east = !!GUA_EAST[gua];
  const a = al || {};

  // 八方数据
  const dirs = DIRS.map(d => {
    const star = FS[gua][d];
    const good = isGood(star);
    const tip = STAR_TIP[star];
    let marks = [];
    if (d === door) marks.push('大门');
    if (d === bed) marks.push('主卧');
    if (d === desk) marks.push('书房');
    return { dir: d, star, good, yi: tip[0], ji: tip[1], marks };
  });

  const doorStar = FS[gua][door];
  const doorGood = isGood(doorStar);

  // 布局建议
  const notes = [];
  if (bed) {
    const s = FS[gua][bed];
    notes.push(`主卧在 ${bed}（${s}）：${isGood(s) ? '方位相合，床头宜靠实墙、避门冲。' : '方位不合，建议把床头转向本命吉方，或加屏风、厚重窗帘调整。'}`);
  }
  if (desk) {
    const s = FS[gua][desk];
    notes.push(`书房 / 办公在 ${desk}（${s}）：${isGood(s) ? '宜坐实朝空，桌面保持整洁。' : '宜调整座位朝向本命「延年」或「生气」方，背后有靠为佳。'}`);
  }
  notes.push('灶位宜压凶方、忌压「五鬼」；卫生间、储物间放在四凶方最稳妥，吉方别堆杂物。');
  if (a.sha) notes.push(`今日煞方在 ${a.sha}，动土、搬重物、长时间静坐尽量避开。`);

  return {
    gua, east,
    guaText: `${gua}卦 · ${east ? '东四命' : '西四命'}`,
    guaDesc: `${gender}命，${year} 年生。按传统八宅命卦推得：${gua}卦，属${east ? '东四' : '西四'}命。${east ? '东四命宜开东、东南、南、北之门' : '西四命宜开西、西北、西南、东北之门'}。本宅大门朝 ${door}，落在 ${doorStar} 方${doorGood ? '，为吉方，可放心使用、保持明亮通透。' : '，为凶方，宜以玄关、屏风或绿植缓冲，不宜直冲内室。'}`,
    door, doorStar, doorGood,
    today: {
      cai: a.posCai || '—',
      xi: a.posXi || '—',
      fu: a.posFu || '—',
      sha: a.sha || '—',
      gzYear: a.gzYear || '',
      gzDay: a.gzDay || ''
    },
    dirs,
    notes,
    note: '以上按传统八宅命卦与本地黄历方位作确定性推演，不含流年玄空飞星替卦，也不接入外部数据；居家方位讲究因地制宜，房屋结构、采光与动线优先于方位参考，结论供参考取舍。'
  };
}
