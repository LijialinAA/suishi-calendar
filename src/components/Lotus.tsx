import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { LOTUS_BUD_URI, LOTUS_BLOOM_URI } from '../utils/icons'
import './lotus.scss'

type Props = {
  /** 展开态：花苞绽放 */
  open?: boolean
  /** 入场时先持苞、稍后自动绽放一次 */
  intro?: boolean
  size?: number
}

/** 桌面版原版莲花图标：花苞 ↔ 绽放，带轻微摇曳 */
export default function Lotus ({ open = false, intro = false, size = 40 }: Props) {
  const [bloom, setBloom] = useState(!intro)

  useEffect(() => {
    if (!intro) return
    const t = setTimeout(() => setBloom(true), 480)
    return () => clearTimeout(t)
  }, [intro])

  const on = intro ? bloom : open

  return (
    <View
      className={`lotus${on ? ' lotus-on' : ''}`}
      style={{ width: `${size}rpx`, height: `${size}rpx` }}
    >
      <View className='lotus-layer lotus-bud' style={{ backgroundImage: LOTUS_BUD_URI }} />
      <View className='lotus-layer lotus-bloom' style={{ backgroundImage: LOTUS_BLOOM_URI }} />
    </View>
  )
}
