import { View, Text } from '@tarojs/components'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
  title: string
  extra?: string | ReactNode
}>

export default function Card ({ title, extra, children }: Props) {
  return (
    <View className='card'>
      <View className='card-hd'>
        <Text className='card-title'>{title}</Text>
        {!!extra && (typeof extra === 'string' ? <Text className='card-extra'>{extra}</Text> : extra)}
      </View>
      {children}
    </View>
  )
}
