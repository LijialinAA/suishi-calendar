import { View, Text } from '@tarojs/components'
import { useMemo, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import PageHead from '../../components/PageHead'
import { CATS, ENTRIES, Entry, findEntry } from '../../engine/glossary'
import './index.scss'

/** 今日词条：按日期轮换，与任何个人输入无关 */
function todayEntry (): Entry {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1
  return ENTRIES[day % ENTRIES.length] as Entry
}

export default function Glossary () {
  const router = useRouter()
  const q = (router.params && router.params.q) || ''
  const hit = q ? findEntry(decodeURIComponent(q)) : undefined

  const [cat, setCat] = useState(hit ? hit.cat : 'shishen')
  const daily = useMemo(todayEntry, [])
  const list = useMemo(() => (ENTRIES as Entry[]).filter((e) => e.cat === cat), [cat])

  return (
    <View className='page page-tab'>
      <PageHead title='名词释义' sub='传统术数用语 · 古籍说法整理' icon='study' />

      <View className='card'>
        <View className='gl-today-hd'>
          <Text className='card-title'>今日词条</Text>
          <Text className='card-extra'>每日一词</Text>
        </View>
        <Text className='gl-name'>{daily.name}</Text>
        <Text className='gl-classic'>{daily.classic}</Text>
        <Text className='gl-plain'>{daily.plain}</Text>
      </View>

      {!!hit && (
        <View className='card gl-hit'>
          <View className='gl-today-hd'>
            <Text className='card-title'>盘面名词</Text>
            <Text className='card-extra'>来自盘面跳转</Text>
          </View>
          <Text className='gl-name'>{hit.name}</Text>
          <Text className='gl-classic'>{hit.classic}</Text>
          <Text className='gl-plain'>{hit.plain}</Text>
        </View>
      )}

      <View className='gl-tabs'>
        {CATS.map((c) => (
          <View key={c.key} className={`gl-tab ${cat === c.key ? 'gl-tab-on' : ''}`} onClick={() => setCat(c.key)}>
            {c.name}
          </View>
        ))}
      </View>

      <View className='card'>
        {list.map((e) => (
          <View key={e.name} className='gl-item'>
            <Text className='gl-name'>{e.name}</Text>
            <Text className='gl-classic'>{e.classic}</Text>
            <Text className='gl-plain'>{e.plain}</Text>
          </View>
        ))}
        <Text className='gl-tip'>以上为传统古籍与民俗用语的释义整理，仅说明名词含义，不涉及任何个人推断，也不构成任何建议。</Text>
      </View>
    </View>
  )
}
