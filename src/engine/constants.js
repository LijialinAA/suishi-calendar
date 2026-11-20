/**
 * 基础干支五行常量与十神/刑冲合害表。
 * 说明：所有判定均为传统子平、紫微的确定性规则，不含随机内容。
 */

export const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const GAN_WUXING = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

export const ZHI_WUXING = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

/** 地支藏干，按本气、中气、余气排列 */
export const HIDE_GAN = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '戊', '庚'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
};

/** 藏干权重：本气 / 中气 / 余气 */
export const HIDE_WEIGHT = [1, 0.4, 0.2];

export const WUXING_ORDER = ['金', '木', '水', '火', '土'];

export const YANG_GAN = ['甲', '丙', '戊', '庚', '壬'];

export const SHENG = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
export const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

/** 五行生我者 */
export function shengWo(wx) {
  return Object.keys(SHENG).find((k) => SHENG[k] === wx);
}
/** 五行克我者 */
export function keWo(wx) {
  return Object.keys(KE).find((k) => KE[k] === wx);
}

/** 十神：以日干为我，求他干（或地支藏干）对我的十神关系 */
export function shiShen(dayGan, otherGan) {
  if (!dayGan || !otherGan) return '';
  const me = GAN_WUXING[dayGan];
  const it = GAN_WUXING[otherGan];
  const samePolarity = YANG_GAN.includes(dayGan) === YANG_GAN.includes(otherGan);
  if (me === it) return samePolarity ? '比肩' : '劫财';
  if (SHENG[me] === it) return samePolarity ? '食神' : '伤官';
  if (KE[me] === it) return samePolarity ? '偏财' : '正财';
  if (KE[it] === me) return samePolarity ? '七杀' : '正官';
  if (SHENG[it] === me) return samePolarity ? '偏印' : '正印';
  return '';
}

/** 十神所属大类：比劫 / 食伤 / 财 / 官杀 / 印 */
export const SHISHEN_GROUP = {
  比肩: '比劫', 劫财: '比劫',
  食神: '食伤', 伤官: '食伤',
  偏财: '财', 正财: '财',
  七杀: '官杀', 正官: '官杀',
  偏印: '印', 正印: '印',
  日主: '日主',
};

export const SHISHEN_TEXT = {
  比肩: '同类帮扶，主自立、同辈、竞争。',
  劫财: '同类争夺，主合伙、耗财、变动。',
  食神: '我生之秀，主表达、福气、技艺。',
  伤官: '我生之锋，主才华、锋芒、逆反。',
  偏财: '我克之动财，主机遇、经营、人情。',
  正财: '我克之稳财，主薪俸、务实、持家。',
  七杀: '克我之烈，主压力、魄力、竞争。',
  正官: '克我之正，主规矩、职位、责任。',
  偏印: '生我之偏，主偏门学问、独特思路。',
  正印: '生我之正，主庇荫、学业、名誉。',
};

/** 六合 */
export const LIU_HE = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午',
};

/** 六冲 */
export const LIU_CHONG = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

/** 六害 */
export const LIU_HAI = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅',
  卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
};

/** 三合局 */
export const SAN_HE = [
  ['申', '子', '辰'],
  ['亥', '卯', '未'],
  ['寅', '午', '戌'],
  ['巳', '酉', '丑'],
];

/** 相刑：只列常用组合 */
export const XING_PAIRS = [
  ['寅', '巳'], ['巳', '申'], ['寅', '申'],
  ['丑', '戌'], ['戌', '未'], ['丑', '未'],
  ['子', '卯'],
];

export function isLiuHe(a, b) { return LIU_HE[a] === b; }
export function isChong(a, b) { return LIU_CHONG[a] === b; }
export function isHai(a, b) { return LIU_HAI[a] === b; }
export function isSanHe(a, b) { return SAN_HE.some((g) => g.includes(a) && g.includes(b)); }
export function isXing(a, b) { return XING_PAIRS.some((p) => p.includes(a) && p.includes(b)); }
export function isZiXing(a, b) { return a === b && ['辰', '午', '酉', '亥'].includes(a); }

/** 地支对应生肖 */
export const ZHI_SHENGXIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/** 地支方位 */
export const ZHI_DIRECTION = {
  子: '正北', 丑: '东北', 寅: '东北', 卯: '正东', 辰: '东南', 巳: '东南',
  午: '正南', 未: '西南', 申: '西南', 酉: '正西', 戌: '西北', 亥: '西北',
};

export const WUXING_COLOR = {
  金: '白 / 银', 木: '青 / 绿', 水: '黑 / 蓝', 火: '红 / 紫', 土: '黄 / 咖',
};

export const WUXING_NUMBER = {
  金: '4 · 9', 木: '3 · 8', 水: '1 · 6', 火: '2 · 7', 土: '5 · 0',
};

/** 时辰名 */
export const HOUR_NAMES = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];

/** 由 0-23 小时推算时辰序号 0-11 */
export function hourIndex(hour) {
  return Math.floor(((hour + 1) % 24) / 2);
}
