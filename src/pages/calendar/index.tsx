import { View, Text } from '@tarojs/components'
import { useMemo, useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import { buildAlmanac } from '../../engine/almanac'
import './index.scss'

const WEEK_HEAD = ['一', '二', '三', '四', '五', '六', '日']

function todayYmd () {
  const n = new Date()
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() }
}

export default function Calendar () {
  const [ymd, setYmd] = useState(todayYmd)
  const al = useMemo(() => buildAlmanac(ymd.y, ymd.m, ymd.d), [ymd])

  const shiftMonth = (delta: number) => {
    const t = new Date(ymd.y, ymd.m - 1 + delta, 1)
    setYmd({ y: t.getFullYear(), m: t.getMonth() + 1, d: 1 })
  }

  const shiftYear = (delta: number) => {
    setYmd({ y: ymd.y + delta, m: ymd.m, d: 1 })
  }

  return (
    <View className='page'>
      <PageHead title='月历' sub='按月浏览 · 点选日期查看农历与节气' icon='calendar' />

      <Card title={`${al.y} 年 ${al.m} 月`} extra={al.isToday ? '今日' : ''}>
        <View className='cal-nav'>
          <Text className='nav-btn' onClick={() => shiftYear(-1)}>上一年</Text>
          <Text className='nav-btn' onClick={() => shiftMonth(-1)}>上月</Text>
          <Text className='nav-btn nav-mid' onClick={() => setYmd(todayYmd())}>今天</Text>
          <Text className='nav-btn' onClick={() => shiftMonth(1)}>下月</Text>
          <Text className='nav-btn' onClick={() => shiftYear(1)}>下一年</Text>
        </View>
        <View className='cal-week'>
          {WEEK_HEAD.map((w) => <Text key={w} className='cal-w'>{w}</Text>)}
        </View>
        <View className='cal-grid'>
          {al.cal.map((c: any) => (
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
        <Text className='cal-tip'>金色为节气日；点击任意日期查看当天农历与节气。</Text>
      </Card>

      <View className='day-hero'>
        <View className='day-hero-l'>
          <Text className='day-num'>{al.d}</Text>
          <Text className='day-week'>{al.week}</Text>
        </View>
        <View className='day-hero-r'>
          <Text className='day-lunar'>{al.lunarFull}</Text>
          <View className='chips chips-gap'>
            {al.isToday && <Text className='chip chip-gold'>今天</Text>}
            <Text className='chip'>{`${al.sxYear}年`}</Text>
            {!!al.jieqi && <Text className='chip chip-gold'>{al.jieqi}</Text>}
            {al.fest.map((f: string) => <Text key={f} className='chip chip-red'>{f}</Text>)}
          </View>
        </View>
      </View>

      <Card title='当日概况' extra='干支 · 节气 · 物候'>
        <View className='kv-grid'>
          <View className='kv'><Text className='kv-k'>年柱</Text><Text className='kv-v serif'>{`${al.gzYear} · ${al.nyYear}`}</Text></View>
          <View className='kv'><Text className='kv-k'>月柱</Text><Text className='kv-v serif'>{`${al.gzMonth} · ${al.nyMonth}`}</Text></View>
          <View className='kv'><Text className='kv-k'>日柱</Text><Text className='kv-v serif gold'>{`${al.gzDay} · ${al.nyDay}`}</Text></View>
          <View className='kv'><Text className='kv-k'>生肖日</Text><Text className='kv-v'>{al.sxDay}</Text></View>
          <View className='kv'><Text className='kv-k'>月相</Text><Text className='kv-v'>{al.yuexiang}</Text></View>
          <View className='kv'><Text className='kv-k'>物候</Text><Text className='kv-v'>{al.wuhou}</Text></View>
        </View>
      </Card>

      <Text className='foot-note'>
        农历、节气与干支由公开历法算法在本地换算，属历法常识展示，仅供参考。
      </Text>
    </View>
  )
}
