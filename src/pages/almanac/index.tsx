import { View, Text } from '@tarojs/components'
import { useMemo, useState } from 'react'
import Card from '../../components/Card'
import Fold from '../../components/Fold'
import Lotus from '../../components/Lotus'
import { buildAlmanac } from '../../engine/almanac'
import './index.scss'

const WEEK_HEAD = ['一', '二', '三', '四', '五', '六', '日']

function todayYmd () {
  const n = new Date()
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() }
}

export default function Almanac () {
  const [ymd, setYmd] = useState(todayYmd)

  const al = useMemo(() => buildAlmanac(ymd.y, ymd.m, ymd.d), [ymd])

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
    <View className='page page-tab'>
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

      {/* 日期主卡 */}
      <View className='almanac-hero'>
        <View className='hero-mark'>
          <Lotus intro size={46} />
          <Text className='hero-mark-t'>我的岁时日历</Text>
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
        </View>
      </Card>

      <Fold title='十二时辰' extra='时间与干支对照'>
        {al.times.map((t) => (
          <View key={t.name} className='ts-row'>
            <View className='ts-left'>
              <Text className='ts-name serif'>{t.name}</Text>
              <Text className='ts-range'>{t.range}</Text>
            </View>
            <Text className='ts-gz serif'>{t.gz}</Text>
          </View>
        ))}
        <Text className='tip-line'>时辰干支依当日日干起时推算，子时自 23:00 起算，仅作历法对照。</Text>
      </Fold>

      <Text className='foot-note'>农历、节气与干支由公开历法算法在本地换算，属历法常识展示，仅供参考。</Text>
    </View>
  )
}
