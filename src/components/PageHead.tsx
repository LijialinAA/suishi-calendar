import { View, Text } from '@tarojs/components'
import { svgIcon, ICONS } from '../utils/icons'

type Props = {
  title: string
  sub?: string
  icon: string
}

export default function PageHead ({ title, sub, icon }: Props) {
  return (
    <View className='page-hd'>
      <View className='page-hd-row'>
        <View className='page-ico' style={{ backgroundImage: svgIcon(ICONS[icon] || ICONS.tools) }} />
        <Text className='page-title'>{title}</Text>
      </View>
      {!!sub && <Text className='page-sub'>{sub}</Text>}
    </View>
  )
}
