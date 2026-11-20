import { View, Text } from '@tarojs/components'
import { PropsWithChildren, ReactNode, useState } from 'react'
import Lotus from './Lotus'
import './fold.scss'

type Props = PropsWithChildren<{
  title: string
  extra?: string | ReactNode
  open?: boolean
}>

/** 可折叠卡片：默认收起，减少首屏纵向长度；右侧为原版莲花图标（花苞 ↔ 绽放） */
export default function Fold ({ title, extra, open = false, children }: Props) {
  const [on, setOn] = useState(open)
  return (
    <View className={`card fold${on ? ' fold-on' : ''}`}>
      <View className='fold-hd' onClick={() => setOn(!on)}>
        <Text className='card-title'>{title}</Text>
        <View className='fold-meta'>
          {!!extra && (typeof extra === 'string' ? <Text className='card-extra'>{extra}</Text> : extra)}
          <Lotus open={on} size={42} />
        </View>
      </View>
      {on && <View className='fold-body'>{children}</View>}
    </View>
  )
}
