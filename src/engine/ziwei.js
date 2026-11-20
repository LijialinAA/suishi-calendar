import { astro } from 'iztro';

const PALACE_MEANING = {
  命宫: '本性、格局与整体气质',
  兄弟: '手足、同辈与合作关系',
  夫妻: '婚配对象与相处模式',
  子女: '子女缘分与部属关系',
  财帛: '理财方式与现金流',
  疾厄: '体质与健康关注点',
  迁移: '外出、异地与环境变化',
  仆役: '朋友、人脉与团队',
  交友: '朋友、人脉与团队',
  官禄: '事业方向与社会角色',
  事业: '事业方向与社会角色',
  田宅: '家宅、不动产与积蓄',
  福德: '福分、兴趣与内在满足',
  父母: '长辈、上司与庇荫',
};

const GOOD_BRIGHTNESS = ['庙', '旺', '得'];
const BAD_BRIGHTNESS = ['平', '不', '陷'];

/** 由 0-23 小时推算 iztro 时辰序号（0=早子，12=晚子） */
export function toTimeIndex(hour) {
  if (hour === 23) return 12;
  return Math.floor((hour + 1) / 2);
}

/**
 * 紫微斗数十二宫
 * @param {object} p {year, month, day, hour, gender}
 */
export function buildZiwei(p) {
  const dateStr = `${p.year}-${p.month}-${p.day}`;
  const astrolabe = astro.bySolar(dateStr, toTimeIndex(p.hour), p.gender === '女' ? '女' : '男', true, 'zh-CN');
  const palaces = astrolabe.palaces.map((pp) => ({
    name: pp.name,
    stemBranch: pp.heavenlyStem + pp.earthlyBranch,
    major: pp.majorStars.map((s) => ({ name: s.name, brightness: s.brightness || '', mutagen: s.mutagen || '' })),
    minor: pp.minorStars.map((s) => ({ name: s.name, mutagen: s.mutagen || '' })),
    decadal: pp.decadal.range,
    isBody: !!pp.isBodyPalace,
  }));

  const comments = palaces.map((pp) => {
    const good = pp.major.some((s) => GOOD_BRIGHTNESS.includes(s.brightness));
    const bad = pp.major.length > 0 && pp.major.every((s) => BAD_BRIGHTNESS.includes(s.brightness));
    const ji = pp.major.concat(pp.minor).some((s) => s.mutagen === '忌');
    const lu = pp.major.concat(pp.minor).some((s) => s.mutagen === '禄');
    let level = '平';
    if (pp.major.length === 0) level = '空宫';
    else if (lu) level = '吉';
    else if (good && !ji) level = '吉';
    else if (bad || ji) level = '需留意';
    const main = pp.major.length ? pp.major.map((s) => `${s.name}${s.brightness ? `（${s.brightness}）` : ''}`).join('、') : '无主星';
    const text = `${main}坐${pp.name}，${PALACE_MEANING[pp.name] || ''}。${
      pp.major.length === 0
        ? '空宫借对宫之气，此领域宜借外力、宜后发。'
        : level === '吉'
          ? '星曜得地，此领域是本盘着力点，宜主动经营。'
          : level === '需留意'
            ? '星曜失地或带化忌，此领域宜稳、宜早做预案。'
            : '星气中平，按常规节奏推进即可。'
    }`;
    return { level, cls: level === '吉' ? 'jx-good' : level === '需留意' ? 'jx-bad' : 'jx-mid', text };
  });

  return {
    solarDate: astrolabe.solarDate,
    lunarDate: astrolabe.lunarDate,
    chineseDate: astrolabe.chineseDate,
    time: astrolabe.time,
    fiveElementsClass: astrolabe.fiveElementsClass,
    soul: astrolabe.soul,
    body: astrolabe.body,
    palaces,
    comments,
  };
}
