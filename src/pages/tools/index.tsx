import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageHead from '../../components/PageHead'
import { svgIcon, ICONS } from '../../utils/icons'
import './index.scss'

type Tool = { id: string, title: string, sub: string, path: string, tab?: boolean, ico: string }

const TOOLS: Tool[] = [
  { id: 'career', title: '事业', sub: '传统说法', path: '/pages/topic/index?kind=career', ico: svgIcon(ICONS.career, '#8c3a2b') },
  { id: 'study', title: '学业', sub: '传统说法', path: '/pages/topic/index?kind=study', ico: svgIcon(ICONS.study, '#8c3a2b') },
  { id: 'hehun', title: '合参', sub: '生肖参看', path: '/pages/hehun/index', ico: svgIcon(ICONS.hehun, '#8c3a2b') },
  { id: 'naming', title: '用字', sub: '五行参考', path: '/pages/naming/index', ico: svgIcon(ICONS.naming, '#8c3a2b') },
  { id: 'zodiac', title: '星座', sub: '文化档案', path: '/pages/zodiac/index', ico: svgIcon(ICONS.zodiac, '#8c3a2b') },
  { id: 'divination', title: '签文', sub: '娱乐参考', path: '/pages/divination/index', ico: svgIcon(ICONS.divination, '#8c3a2b') },
  { id: 'fengshui', title: '方位', sub: '居家参考', path: '/pages/fengshui/index', ico: svgIcon(ICONS.fengshui, '#8c3a2b') },
  { id: 'chart', title: '盘面', sub: '四柱紫微', path: '/pages/chart/index', tab: true, ico: svgIcon(ICONS.chart, '#8c3a2b') }
]

export default function Tools () {
  const go = (t: Tool) => {
    if (t.tab) Taro.switchTab({ url: t.path })
    else Taro.navigateTo({ url: t.path })
  }
  return (
    <View className='page page-tab'>
      <PageHead title='工具' sub='传统历法与民俗文化参考' icon='tools' />

      <View className='tools-grid'>
        {TOOLS.map((t, i) => (
          <View key={t.id} className='tool-card' style={{ animationDelay: `${i * 0.04}s` }} onClick={() => go(t)}>
            <View className='tool-ico' style={{ backgroundImage: t.ico }} />
            <Text className='tool-title'>{t.title}</Text>
            <Text className='tool-sub'>{t.sub}</Text>
          </View>
        ))}
      </View>

      <View className='card'>
        <Text className='para'>全部内容在手机本地换算生成，不联网、不上传任何输入。各条目均为传统民俗文化的整理与展示，不提供预测，不构成任何决策、医疗或投资建议。</Text>
      </View>
    </View>
  )
}
