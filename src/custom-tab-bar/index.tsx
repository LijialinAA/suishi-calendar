import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { svgIcon, ICONS } from '../utils/icons'
import './index.scss'

const INFO =
  '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.2"/><path d="M12 7.8v.02"/>'

type Item = { path: string; text: string; body: string }

const LIST: Item[] = [
  { path: 'pages/almanac/index', text: '今日', body: ICONS.almanac },
  { path: 'pages/calendar/index', text: '月历', body: ICONS.calendar },
  { path: 'pages/chart/index', text: '盘面', body: ICONS.chart },
  { path: 'pages/glossary/index', text: '词典', body: ICONS.study },
  { path: 'pages/archive/index', text: '关于', body: INFO }
]

function currentRoute () {
  const pages = Taro.getCurrentPages()
  const page = pages[pages.length - 1]
  return page ? page.route : LIST[0].path
}

export default function CustomTabBar () {
  const [active, setActive] = useState(currentRoute)

  // 冷启动直达某个 tab 时，页面栈可能尚未就绪，稍后再校正一次
  useEffect(() => {
    const t = setTimeout(() => setActive(currentRoute()), 60)
    return () => clearTimeout(t)
  }, [])

  const go = (path: string) => {
    if (path === active) return
    Taro.switchTab({ url: `/${path}` })
  }

  return (
    <View className='tb'>
      {LIST.map((it) => {
        const on = it.path === active
        return (
          <View
            key={it.path}
            className={`tb-item${on ? ' tb-item-on' : ''}`}
            onClick={() => go(it.path)}
          >
            <View className='tb-ico-wrap'>
              <View
                className='tb-ico'
                style={{ backgroundImage: svgIcon(it.body, on ? '#8c3a2b' : '#b4a98f', on ? 1.95 : 1.6) }}
              />
            </View>
            <Text className='tb-txt'>{it.text}</Text>
            <View className='tb-bar' />
          </View>
        )
      })}
    </View>
  )
}
