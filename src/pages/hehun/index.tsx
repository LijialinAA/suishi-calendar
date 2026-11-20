import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import BirthForm, { BirthValue } from '../../components/BirthForm'
import { buildBazi } from '../../engine/bazi'
import { buildHehun } from '../../engine/hehun'
import { cityLon, DEFAULT_PLACE } from '../../engine/geo'
import { saveArchive } from '../../utils/archive'
import './index.scss'

const boyForm = (): BirthValue => ({
  name: '甲方',
  gender: '男',
  solar: true,
  leap: false,
  year: 1992,
  month: 2,
  day: 8,
  hour: 12,
  place: DEFAULT_PLACE,
  truesolar: true
})

const girlForm = (): BirthValue => ({
  name: '乙方',
  gender: '女',
  solar: true,
  leap: false,
  year: 1995,
  month: 6,
  day: 18,
  hour: 12,
  place: DEFAULT_PLACE,
  truesolar: true
})

export default function Hehun () {
  const [a, setA] = useState<BirthValue>(boyForm)
  const [b, setB] = useState<BirthValue>(girlForm)
  const [res, setRes] = useState<any>(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const ba = buildBazi({ ...a, lon: cityLon(a.place.province, a.place.city), city: a.place.city, birthplace: '' })
      const bb = buildBazi({ ...b, lon: cityLon(b.place.province, b.place.city), city: b.place.city, birthplace: '' })
      setRes(buildHehun(ba, bb))
      setError('')
    } catch (e: any) {
      setError(e && e.message ? `参看失败：${e.message}` : '参看失败，请检查两位的生辰信息')
      setRes(null)
    }
  }

  const swap = () => {
    const t = a
    setA({ ...b, gender: '女' })
    setB({ ...t, gender: '男' })
    setRes(null)
  }

  const save = () => {
    if (!res) return
    saveArchive({
      type: 'hehun',
      title: `${a.name || '甲方'} × ${b.name || '乙方'}`,
      subtitle: `合参 ${res.score} 分 · ${res.level}`,
      formA: a,
      formB: b
    })
    Taro.showToast({ title: '已存入档案', icon: 'success' })
  }

  return (
    <View className='page page-tab'>
      <PageHead title='生肖合参' sub='生肖根基 · 夫妻宫 · 五行互补（传统说法）' icon='hehun' />

      <Card title='甲方' extra={`${a.gender}命`}>
        <BirthForm value={a} onChange={setA} showPlace={false} />
      </Card>

      <View className='swap-row'>
        <Text className='swap-btn' onClick={swap}>互换甲乙</Text>
      </View>

      <Card title='乙方' extra={`${b.gender}命`}>
        <BirthForm value={b} onChange={setB} showPlace={false} />
      </Card>

      <View className='btn' onClick={run}>开始合参</View>
      {!!res && <View className='btn btn-ghost' onClick={save}>存入档案</View>}
      {!!error && <Text className='err'>{error}</Text>}

      {!!res && (
        <>
          <View className='score-card'>
            <View className='score-left'>
              <Text className='score-num serif'>{res.score}</Text>
              <Text className='score-unit'>/ 100</Text>
            </View>
            <View className='score-right'>
              <Text className='score-level serif'>{res.level}</Text>
              <View className='bar-track'>
                <View className='bar-fill' style={{ width: `${res.score}%` }} />
              </View>
              <Text className='score-note'>基础 40 分起算，按生肖、夫妻宫、日干、五行、十神加减</Text>
            </View>
          </View>

          <Card title='五项对照'>
            <View className='items'>
              {res.items.map((it: any) => (
                <View key={it.title} className='item'>
                  <Text className='item-title'>{it.title}</Text>
                  <Text className='item-tag'>{it.tag}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card title='两人四柱'>
            <View className='pair'>
              <View className='pair-col'>
                <Text className='pair-name'>{res.a.name || '甲方'} · {res.a.gender}</Text>
                <Text className='pair-meta'>{`${res.a.shengxiao}年 · ${res.a.solar}`}</Text>
                <View className='pair-gz'>
                  {res.a.sizhu.map((g: string, i: number) => (
                    <Text key={i} className='pair-pillar'>{g}</Text>
                  ))}
                </View>
              </View>
              <View className='pair-col'>
                <Text className='pair-name'>{res.b.name || '乙方'} · {res.b.gender}</Text>
                <Text className='pair-meta'>{`${res.b.shengxiao}年 · ${res.b.solar}`}</Text>
                <View className='pair-gz'>
                  {res.b.sizhu.map((g: string, i: number) => (
                    <Text key={i} className='pair-pillar'>{g}</Text>
                  ))}
                </View>
              </View>
            </View>
            <Text className='note'>四柱依次为年、月、日、时；日柱地支即夫妻宫，是传统合参中分量最重的一项。</Text>
          </Card>

          <Card title='五段解析'>
            {res.sections.map((s: any) => (
              <View key={s.title} className='sec'>
                <View className='sec-hd'>
                  <Text className='sec-title serif'>{s.title}</Text>
                  <Text className='chip chip-gold'>{s.tag}</Text>
                </View>
                <View className='chips'>
                  {s.basis.map((x: string) => <Text key={x} className='chip'>{x}</Text>)}
                </View>
                <Text className='sec-plain'>{s.plain}</Text>
              </View>
            ))}
          </Card>

          <Card title='怎么处'>
            {res.advice.map((x: string, i: number) => (
              <View key={i} className='advice'>
                <Text className='advice-idx'>{i + 1}</Text>
                <Text className='advice-text'>{x}</Text>
              </View>
            ))}
          </Card>

          <Text className='foot-note'>
            合参照传统合参法五项规则加权，分数仅供民俗文化参考，不作婚姻决策依据。
          </Text>
        </>
      )}
    </View>
  )
}
