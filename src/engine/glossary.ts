/**
 * 传统命理名词释义库
 * 仅收录名词、古籍说法与白话解释，不接收任何个人出生信息，不生成任何针对个人的结论。
 */
export type Entry = { cat: string, name: string, classic: string, plain: string }

export const CATS = [
  { key: 'shishen', name: '十神' },
  { key: 'shensha', name: '神煞' },
  { key: 'star', name: '星曜' },
  { key: 'palace', name: '宫位' },
  { key: 'concept', name: '概念' }
]

export const ENTRIES: Entry[] = [
  /* ===== 十神 ===== */
  { cat: 'shishen', name: '正官', classic: '「官者，管也。」', plain: '克我而阴阳相异。传统以名分、规矩、责任论之，属四柱十神之一。' },
  { cat: 'shishen', name: '七杀', classic: '「杀者，攻身之神。」', plain: '克我而阴阳相同。传统以决断、压力、开创论之，又称偏官。' },
  { cat: 'shishen', name: '正财', classic: '「财者，我所胜之物。」', plain: '我克而阴阳相异。传统以稳健积累、实务经营论之。' },
  { cat: 'shishen', name: '偏财', classic: '「偏财者，众人之财。」', plain: '我克而阴阳相同。传统以流动之财、交际机遇论之。' },
  { cat: 'shishen', name: '食神', classic: '「食者，养命之源。」', plain: '我生而阴阳相异。传统以才艺、口福、温厚论之。' },
  { cat: 'shishen', name: '伤官', classic: '「伤官者，盗气之神。」', plain: '我生而阴阳相同。传统以表达、革新、锋芒论之。' },
  { cat: 'shishen', name: '比肩', classic: '「比者，同类也。」', plain: '与我同类而阴阳相同。传统以自立、同辈、竞争论之。' },
  { cat: 'shishen', name: '劫财', classic: '「劫者，夺也。」', plain: '与我同类而阴阳相异。传统以行动、协作、耗散论之。' },
  { cat: 'shishen', name: '正印', classic: '「印者，荫也。」', plain: '生我而阴阳相异。传统以学养、庇荫、文教论之。' },
  { cat: 'shishen', name: '偏印', classic: '「偏印者，枭神也。」', plain: '生我而阴阳相同。传统以专精、偏才、独思论之。' },

  /* ===== 神煞 ===== */
  { cat: 'shensha', name: '天乙贵人', classic: '「天乙者，乃天上之神。」', plain: '传统神煞之一，旧说为诸神煞之尊，取象于贵人扶助。' },
  { cat: 'shensha', name: '文昌', classic: '「文昌入命，聪明过人。」', plain: '传统神煞之一，取象于文思、著述、考试。' },
  { cat: 'shensha', name: '驿马', classic: '「马奔财乡，如发猛虎。」', plain: '传统神煞之一，取象于远行、迁动、奔波。' },
  { cat: 'shensha', name: '桃花（咸池）', classic: '「咸池主风流。」', plain: '传统神煞之一，取象于情感、人缘、才艺。' },
  { cat: 'shensha', name: '羊刃', classic: '「刃者，刚强之谓。」', plain: '传统神煞之一，取象于刚烈、果决，旧说亦主刑伤。' },
  { cat: 'shensha', name: '空亡', classic: '「空亡者，虚而不实。」', plain: '旬中所空之支，传统以虚、减力论之。' },
  { cat: 'shensha', name: '天德', classic: '「天德者，福神也。」', plain: '传统吉神之一，取象于福厚、平顺。' },
  { cat: 'shensha', name: '月德', classic: '「月德者，与天德同。」', plain: '传统吉神之一，旧说与天德并称，取象于和顺。' },
  { cat: 'shensha', name: '华盖', classic: '「华盖星，主孤。」', plain: '传统神煞之一，取象于孤高、艺术、宗教缘。' },
  { cat: 'shensha', name: '将星', classic: '「将星文武两相宜。」', plain: '传统神煞之一，取象于统御、掌权。' },

  /* ===== 星曜 ===== */
  { cat: 'star', name: '紫微', classic: '「紫微，帝座也。」', plain: '紫微斗数十四主星之一，取象于尊贵、统御。' },
  { cat: 'star', name: '天机', classic: '「天机，谋略之星。」', plain: '十四主星之一，取象于智谋、机变、筹划。' },
  { cat: 'star', name: '太阳', classic: '「太阳，光明之星。」', plain: '十四主星之一，取象于声名、外向、博施。' },
  { cat: 'star', name: '武曲', classic: '「武曲，财星也。」', plain: '十四主星之一，取象于刚毅、实务、财帛。' },
  { cat: 'star', name: '天同', classic: '「天同，福星也。」', plain: '十四主星之一，取象于福泽、安逸、温和。' },
  { cat: 'star', name: '廉贞', classic: '「廉贞，囚星也。」', plain: '十四主星之一，取象于纪律、才艺，旧说亦主情绪起伏。' },
  { cat: 'star', name: '天府', classic: '「天府，库藏之星。」', plain: '十四主星之一，取象于稳重、包容、蓄积。' },
  { cat: 'star', name: '太阴', classic: '「太阴，水之精也。」', plain: '十四主星之一，取象于内敛、田宅、细腻。' },
  { cat: 'star', name: '贪狼', classic: '「贪狼多才艺。」', plain: '十四主星之一，取象于欲望、才艺、交际。' },
  { cat: 'star', name: '巨门', classic: '「巨门，暗星也。」', plain: '十四主星之一，取象于言辞、思辨、口舌。' },
  { cat: 'star', name: '天相', classic: '「天相，印星也。」', plain: '十四主星之一，取象于辅佐、仪范、协调。' },
  { cat: 'star', name: '天梁', classic: '「天梁，荫星也。」', plain: '十四主星之一，取象于庇荫、长辈、医药。' },
  { cat: 'star', name: '七杀', classic: '「七杀有制化为权。」', plain: '十四主星之一，取象于肃杀、果决、开创。' },
  { cat: 'star', name: '破军', classic: '「破军，耗星也。」', plain: '十四主星之一，取象于变革、破旧立新。' },

  /* ===== 宫位 ===== */
  { cat: 'palace', name: '命宫', classic: '「命宫为一盘之主。」', plain: '紫微十二宫之首，传统以性情与格局所系论之。' },
  { cat: 'palace', name: '兄弟宫', classic: '「兄弟宫，论手足之情。」', plain: '十二宫之一，取象于手足、同辈、合作。' },
  { cat: 'palace', name: '夫妻宫', classic: '「夫妻宫，论配偶之位。」', plain: '十二宫之一，取象于配偶与婚姻形态。' },
  { cat: 'palace', name: '子女宫', classic: '「子女宫，论嗣续之事。」', plain: '十二宫之一，取象于子女、晚辈、创作。' },
  { cat: 'palace', name: '财帛宫', classic: '「财帛宫，论财之源。」', plain: '十二宫之一，取象于财源与理财方式。' },
  { cat: 'palace', name: '疾厄宫', classic: '「疾厄宫，论身体之疾。」', plain: '十二宫之一，取象于身体与健康倾向。' },
  { cat: 'palace', name: '迁移宫', classic: '「迁移宫，论出行之事。」', plain: '十二宫之一，取象于外出、远行、环境变动。' },
  { cat: 'palace', name: '交友宫', classic: '「交友宫，论朋辈之谊。」', plain: '十二宫之一，取象于朋友、部属、人际。' },
  { cat: 'palace', name: '官禄宫', classic: '「官禄宫，论事业之位。」', plain: '十二宫之一，取象于事业、职位、工作形态。' },
  { cat: 'palace', name: '田宅宫', classic: '「田宅宫，论居处之业。」', plain: '十二宫之一，取象于不动产与家庭环境。' },
  { cat: 'palace', name: '福德宫', classic: '「福德宫，论精神之享。」', plain: '十二宫之一，取象于精神、兴趣、享受。' },
  { cat: 'palace', name: '父母宫', classic: '「父母宫，论尊长之荫。」', plain: '十二宫之一，取象于父母、长辈、庇荫。' },

  /* ===== 概念 ===== */
  { cat: 'concept', name: '大运', classic: '「十年一运，名曰大运。」', plain: '以月柱为基准，按阴阳男女顺逆排布，每运管十年。' },
  { cat: 'concept', name: '流年', classic: '「流年者，逐年之干支也。」', plain: '以当年干支纪年，逐年推移，与大运并称。' },
  { cat: 'concept', name: '真太阳时', classic: '「时刻以日晷为准。」', plain: '按出生地经度与均时差校正后的时刻，用于定四柱时柱。' },
  { cat: 'concept', name: '纳音', classic: '「纳音者，六十甲子配五行。」', plain: '如「海中金」「炉中火」，为干支所配的五行名称。' },
  { cat: 'concept', name: '十二长生', classic: '「长生、沐浴、冠带……」', plain: '描述五行旺衰周期的十二个阶段，用于标注地支状态。' },
  { cat: 'concept', name: '庙旺落陷', classic: '「星居其位，各有强弱。」', plain: '紫微斗数中星曜所在宫位的力量分等，分庙、旺、得地、平、陷。' }
]

/** 按名称查词条（盘面里点击名词跳转用） */
export function findEntry (name: string): Entry | undefined {
  return ENTRIES.find((e) => e.name === name || e.name.indexOf(name) === 0)
}
