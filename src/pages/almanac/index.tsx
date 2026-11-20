import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import Card from '../../components/Card'
import Fold from '../../components/Fold'
import Lotus from '../../components/Lotus'
import { buildAlmanac } from '../../engine/almanac'
import { svgIcon, ICONS } from '../../utils/icons'
import './index.scss'

const WEEK_HEAD = ['一', '二', '三', '四', '五', '六', '日']

type Entry = { key: string, name: string, sub: string, ico: string, color: string, path?: string }

// 原版 1.0.31 的八宫格入口
const ENTRIES: Entry[] = [
  { key: 'almanac', name: '今日黄历', sub: '宜忌·时辰', ico: ICONS.almanac, color: '#8c3a2b' },
  { key: 'chart', name: '单人排盘', sub: '八字·紫微', ico: ICONS.chart, color: '#b8924a', path: '/pages/chart/index' },
  { key: 'hehun', name: '姻缘', sub: '婚俗对照', ico: ICONS.hehun, color: '#9b5b8a', path: '/pages/hehun/index' },
  { key: 'career', name: '事业', sub: '文化参考', ico: ICONS.career, color: '#3f6b5e', path: '/pages/topic/index?kind=career' },
  { key: 'study', name: '学业', sub: '文化参考', ico: ICONS.study, color: '#4a6b8c', path: '/pages/topic/index?kind=study' },
  { key: 'naming', name: '起名', sub: '五行用字', ico: ICONS.naming, color: '#8c5a2b', path: '/pages/naming/index' },
  { key: 'fengshui', name: '方位', sub: '居家参考', ico: ICONS.fengshui, color: '#6b5a8c', path: '/pages/fengshui/index' },
  { key: 'zodiac', name: '星座', sub: '四象五行', ico: ICONS.zodiac, color: '#5b7a4a', path: '/pages/zodiac/index' }
]

function todayYmd () {
  const n = new Date()
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() }
}

// 原版开运配色：五行 → 色名 / 数理
const WX_META: Record<string, { label: string, color: string, nums: string }> = {
  金: { label: '鎏金', color: '#d9a441', nums: '4 · 9' },
  木: { label: '竹青', color: '#5b8c5a', nums: '3 · 8' },
  水: { label: '玄青', color: '#4a7fb5', nums: '1 · 6' },
  火: { label: '朱赤', color: '#c05343', nums: '2 · 7' },
  土: { label: '缃黄', color: '#a0826b', nums: '5 · 0' }
}

export default function Almanac () {
  const [ymd, setYmd] = useState(todayYmd)

  const al = useMemo(() => buildAlmanac(ymd.y, ymd.m, ymd.d), [ymd])

  const wxSorted = useMemo(
    () => al.wuxing.slice().sort((a: any, b: any) => (b.value || 0) - (a.value || 0)),
    [al]
  )
  const wxMax = Math.max(...al.wuxing.map((w: any) => w.value || 0), 1)
  const topWx = WX_META[wxSorted[0]?.name] || { label: '—', color: '#b8924a', nums: '—' }

  const shiftDay = (delta: number) => {
    const t = new Date(ymd.y, ymd.m - 1, ymd.d)
    t.setDate(t.getDate() + delta)
    setYmd({ y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() })
  }

  const shiftMonth = (delta: number) => {
    const t = new Date(ymd.y, ymd.m - 1 + delta, 1)
    setYmd({ y: t.getFullYear(), m: t.getMonth() + 1, d: 1 })
  }

  return (
    <View className='page'>
      <View className='hdr'>
        <Text className='hdr-title'>干支历法排盘工具</Text>
        <Text className='hdr-sub'>传统历法 · 八字紫微 · 民俗文化整理</Text>
      </View>

      <View className='f-grid'>
        {ENTRIES.map((e) => (
          <View key={e.key} className='fcard' onClick={() => e.path && Taro.navigateTo({ url: e.path })}>
            <View className='fcard-in' style={{ borderTopColor: e.color }}>
              <View className='fcard-ico' style={{ backgroundImage: svgIcon(e.ico, e.color) }} />
              <Text className='fcard-name'>{e.name}</Text>
              <Text className='fcard-sub'>{e.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 日期主卡 */}
      <View className='almanac-hero'>
        <View className='hero-mark'>
          <Lotus intro size={46} />
          <Text className='hero-mark-t'>今日黄历</Text>
        </View>
        <View className='hero-top'>
          <View className='hero-date'>
            <Text className='hero-day'>{al.d}</Text>
            <View className='hero-side'>
              <Text className='hero-week'>{al.week}{al.isToday ? ' · 今天' : ''}</Text>
              <Text className='hero-lunar'>{al.lunar}</Text>
              <Text className='hero-gz'>{`${al.gzYear}年 ${al.gzMonth}月 ${al.gzDay}日`}</Text>
            </View>
          </View>
          <View className='hero-chips'>
            <Text className='chip chip-gold'>{al.sxYear}年</Text>
            {!!al.jieqi && <Text className='chip chip-green'>{al.jieqi}</Text>}
            {al.fest.map((f) => <Text key={f} className='chip chip-red'>{f}</Text>)}
          </View>
        </View>

        <View className='ly-bar'>
          <View className='ly-text'>
            <Text>农历{al.lyYear}年</Text>
            <Text className='muted'>{`已过 ${al.lyPassed} / ${al.lyTotal} 天`}</Text>
            <Text className='gold'>{`距除夕 ${al.lyRemainPct}%`}</Text>
          </View>
          <View className='bar-track'>
            <View className='bar-fill' style={{ width: `${Math.round((al.lyPassed / al.lyTotal) * 100)}%` }} />
          </View>
        </View>

        <View className='hero-nav'>
          <Text className='nav-btn' onClick={() => shiftDay(-1)}>前一日</Text>
          <Text className='nav-btn nav-mid' onClick={() => setYmd(todayYmd())}>回到今天</Text>
          <Text className='nav-btn' onClick={() => shiftDay(1)}>后一日</Text>
        </View>
      </View>

      {/* 今日锦囊：宜忌 / 吉时 / 方位 / 开运 */}
      <Card title='今日锦囊' extra={`${al.gzDay}日 · ${al.nyDay}`}>
        <View className='yj'>
          <View className='yj-side'>
            <Text className='yj-badge yi'>宜</Text>
          </View>
          <View className='yj-body'>
            <View className='chips'>
              {al.yi.slice(0, 4).map((x: string) => (
                <Text key={`yi-${x}`} className='chip chip-green'>{x}</Text>
              ))}
              {!al.yi.length && <Text className='muted'>诸事不宜</Text>}
            </View>
          </View>
        </View>

        <View className='yj'>
          <View className='yj-side'>
            <Text className='yj-badge ji'>忌</Text>
          </View>
          <View className='yj-body'>
            <View className='chips'>
              {al.ji.slice(0, 4).map((x: string) => (
                <Text key={`ji-${x}`} className='chip chip-red'>{x}</Text>
              ))}
              {!al.ji.length && <Text className='muted'>百无禁忌</Text>}
            </View>
          </View>
        </View>

        <View className='divider' />

        <View className='jn-line'>
          <Text className='jn-k'>吉时</Text>
          <View className='chips chips-gap'>
            {al.luckyHours.slice(0, 6).map((h: string) => (
              <Text key={h} className={`chip ${h === al.hourNow.name ? 'chip-gold' : ''}`}>{h}</Text>
            ))}
            {!al.luckyHours.length && <Text className='muted'>当日无吉时</Text>}
          </View>
        </View>
        <View className='jn-line'>
          <Text className='jn-k'>方位</Text>
          <Text className='jn-v'>{`财 ${al.posCai} · 喜 ${al.posXi} · 避 ${al.sha}`}</Text>
        </View>
        <View className='jn-line'>
          <Text className='jn-k'>开运</Text>
          <View className='jn-v jn-v-row'>
            <View className='jn-dot' style={{ background: topWx.color }} />
            <Text>{`${topWx.label} · ${topWx.nums}　${wxSorted[0]?.name || '—'}最旺 ${wxSorted[0]?.value || 0}`}</Text>
          </View>
        </View>
      </Card>

      {/* 月历 */}
      <Fold title={`${al.y} 年 ${al.m} 月`} extra='点击日期查看' open>
        <View className='cal-nav'>
          <Text className='nav-btn' onClick={() => shiftMonth(-1)}>上个月</Text>
          <Text className='nav-btn' onClick={() => setYmd(todayYmd())}>今天</Text>
          <Text className='nav-btn' onClick={() => shiftMonth(1)}>下个月</Text>
        </View>
        <View className='cal-week'>
          {WEEK_HEAD.map((w) => <Text key={w} className='cal-w'>{w}</Text>)}
        </View>
        <View className='cal-grid'>
          {al.cal.map((c) => (
            <View
              key={`${c.y}-${c.m}-${c.d}`}
              className={`cal-cell ${c.inMonth ? '' : 'cal-out'} ${c.today ? 'cal-today' : ''} ${c.sel ? 'cal-sel' : ''}`}
              onClick={() => setYmd({ y: c.y, m: c.m, d: c.d })}
            >
              <Text className='cal-d'>{c.d}</Text>
              <Text className={`cal-l ${c.jq ? 'cal-jq' : ''}`}>{c.lunar}</Text>
            </View>
          ))}
        </View>
      </Fold>

      {/* 当日概况 */}
      <Card title='当日概况' extra='干支 · 节气 · 物候'>
        <View className='kv-grid'>
          <View className='kv'>
            <Text className='kv-k'>年柱</Text>
            <Text className='kv-v serif'>{`${al.gzYear} · ${al.nyYear}`}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>月柱</Text>
            <Text className='kv-v serif'>{`${al.gzMonth} · ${al.nyMonth}`}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>日柱</Text>
            <Text className='kv-v serif gold'>{`${al.gzDay} · ${al.nyDay}`}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>生肖日</Text>
            <Text className='kv-v'>{al.sxDay}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>月相</Text>
            <Text className='kv-v'>{al.yuexiang}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>物候</Text>
            <Text className='kv-v'>{al.wuhou}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>值神</Text>
            <Text className='kv-v'>{`${al.tianshen}（${al.tianshenType}）`}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>十二神</Text>
            <Text className='kv-v'>{al.zhixing}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>日禄</Text>
            <Text className='kv-v'>{al.dayLu}</Text>
          </View>
          <View className='kv'>
            <Text className='kv-k'>冲煞</Text>
            <Text className='kv-v'>{`冲${al.chong} 煞${al.sha}`}</Text>
          </View>
          <View className='kv kv-full'>
            <Text className='kv-k'>彭祖百忌</Text>
            <Text className='kv-v'>{`${al.pengzuGan}；${al.pengzuZhi}`}</Text>
          </View>
        </View>
      </Card>

      {/* 时辰五行 */}
      <Fold title='时辰五行' extra={`${al.hourNow.name} ${al.hourNow.range}${al.hourNow.gz ? ` · ${al.hourNow.gz}` : ''}`}>
        {al.wuxing.map((w: any) => (
          <View key={w.name} className='bar-row'>
            <Text className='bar-name'>{w.name}</Text>
            <View className='bar-track'>
              <View className='bar-fill' style={{ width: `${Math.round(((w.value || 0) / wxMax) * 100)}%` }} />
            </View>
            <Text className='bar-val'>{w.value}</Text>
          </View>
        ))}
        <Text className='tip-line'>以当值时辰的干支藏干计权，仅作五行旺衰的历法对照。</Text>
      </Fold>

      {/* 十二时辰 */}
      <Fold title='十二时辰' extra='时间与干支对照'>
        {al.times.map((t: any) => (
          <View key={t.name} className='ts-row'>
            <View className='ts-left'>
              <Text className='ts-name serif'>{t.name}</Text>
              <Text className='ts-range'>{t.range}</Text>
            </View>
            <View className='ts-mid'>
              <Text className='ts-gz serif'>{t.gz}</Text>
              <Text className='ts-god'>{`${t.tianshen} · 冲${t.chong}`}</Text>
            </View>
            <Text className={`ts-luck ${t.luck === '吉' ? 'jx-good' : 'jx-bad'}`}>{t.luck}</Text>
          </View>
        ))}
        <Text className='tip-line'>时辰干支依当日日干起时推算，子时自 23:00 起算，仅作历法对照。</Text>
      </Fold>

      {/* 神煞与方位 */}
      <Card title='神煞与方位' extra='民俗对照'>
        <View className='kv-grid'>
          <View className='kv kv-full'>
            <Text className='kv-k'>吉神宜趋</Text>
            <Text className='kv-v'>{al.jishen.join(' · ') || '无'}</Text>
          </View>
          <View className='kv kv-full'>
            <Text className='kv-k'>凶煞宜忌</Text>
            <Text className='kv-v'>{al.xiongsha.join(' · ') || '无'}</Text>
          </View>
          <View className='kv kv-full'>
            <Text className='kv-k'>方位</Text>
            <Text className='kv-v'>{`财神 ${al.posCai}　喜神 ${al.posXi}　福神 ${al.posFu}`}</Text>
          </View>
        </View>
      </Card>

      <Text className='foot-note'>农历、节气与干支由公开历法算法在本地换算，属历法常识展示，仅供参考。</Text>
    </View>
  )
}
