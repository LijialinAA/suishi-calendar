import { View, Text, Input, Picker } from '@tarojs/components'
import { useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import BirthForm, { BirthValue } from '../../components/BirthForm'
import { buildBazi } from '../../engine/bazi'
import { buildNaming, WUXING_COLOR } from '../../engine/naming'
import { cityLon, DEFAULT_PLACE } from '../../engine/geo'
import './index.scss'

const initialForm = (): BirthValue => ({
  name: '', gender: '男', solar: true, leap: false,
  year: 1992, month: 2, day: 8, hour: 12,
  place: DEFAULT_PLACE, truesolar: true
})

const LEN_OPTIONS = [
  { label: '双字名（姓+2字）', value: 2 },
  { label: '单字名（姓+1字）', value: 1 }
]

const MODE_OPTIONS = [
  { label: '按传统五行配字', value: 'auto' },
  { label: '温和补益', value: 'soft' },
  { label: '重点补偏', value: 'strong' }
]

export default function Naming () {
  const [form, setForm] = useState<BirthValue>(initialForm)
  const [surname, setSurname] = useState('李')
  const [len, setLen] = useState(2)
  const [mode, setMode] = useState('auto')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const s = surname.trim().replace(/[^\u4e00-\u9fa5]/g, '').slice(0, 1)
      if (!s) { setError('请先填写姓氏'); return }
      const lon = cityLon(form.place.province, form.place.city)
      const birthplace = `${form.place.province}${form.place.city}${form.place.district}`
      const bazi = buildBazi({ ...form, lon, city: form.place.city, birthplace })
      const meta = {
        day_gan: bazi.strength.dayGan,
        tone: bazi.strength.level,
        xi: bazi.strength.favor,
        ji: bazi.strength.avoid,
        sizhu: bazi.pillars.map(p => p.gan + p.zhi)
      }
      const r = buildNaming(meta, form.gender, len, mode, s)
      setError('')
      setResult(r)
    } catch (e: any) {
      setError(e && e.message ? `取名失败：${e.message}` : '取名失败，请检查日期')
      setResult(null)
    }
  }

  return (
    <View className='page'>
      <PageHead title='五行用字参考' sub='按传统五行配字，兼顾音韵与字义' icon='naming' />

      <Card title='生辰与姓氏' extra='公历 / 农历均可'>
        <BirthForm value={form} onChange={setForm} />
        <View className='form-row'>
          <Text className='form-label'>姓氏</Text>
          <Input className='form-input' value={surname} onInput={e => setSurname(e.detail.value)} maxlength={2} placeholder='如：李' />
        </View>
        <View className='form-row'>
          <Text className='form-label'>名字字数</Text>
          <Picker mode='selector' range={LEN_OPTIONS.map(o => o.label)} onChange={e => setLen(LEN_OPTIONS[+e.detail.value].value)}>
            <View className='form-value'>{LEN_OPTIONS.find(o => o.value === len)?.label}</View>
          </Picker>
        </View>
        <View className='form-row'>
          <Text className='form-label'>取名取向</Text>
          <Picker mode='selector' range={MODE_OPTIONS.map(o => o.label)} onChange={e => setMode(MODE_OPTIONS[+e.detail.value].value)}>
            <View className='form-value'>{MODE_OPTIONS.find(o => o.value === mode)?.label}</View>
          </Picker>
        </View>
        <View className='btn' onClick={run}>开始取名</View>
        {!!error && <Text className='err'>{error}</Text>}
      </Card>

      {!result && (
        <Card title='说明'>
          <Text className='para'>字库内置 100 字，按传统五行说法配字，兼顾声母错落、笔画均衡与字义。结果仅作民俗文化参考，最终定名仍由家人决定。</Text>
        </Card>
      )}

      {!!result && (
        <>
          <Card title='传统五行 · 用字依据'>
            <View className='kv-grid'>
              <View className='kv'><Text className='kv-k'>姓氏</Text><Text className='kv-v'>{result.surname} · {result.gender}命</Text></View>
              <View className='kv'><Text className='kv-k'>四柱</Text><Text className='kv-v'>{result.sizhu}</Text></View>
              <View className='kv'><Text className='kv-k'>日主</Text><Text className='kv-v'>{result.dayGan}（{result.tone}）</Text></View>
              <View className='kv'><Text className='kv-k'>传统所论</Text><Text className='kv-v jx-good'>{result.xi}</Text></View>
              <View className='kv'><Text className='kv-k'>忌神</Text><Text className='kv-v jx-bad'>{result.ji}</Text></View>
            </View>
            <Text className='para' style={{ marginTop: '12rpx' }}>取用思路：依古籍传统说法取对应五行之字，兼顾声母错落、笔画均衡与字义，避开不雅谐音。</Text>
          </Card>

          <View className='nm-grid'>
            {(result.names || []).map((n: any, i: number) => (
              <View key={i} className='nm-card'>
                <View className='nm-rank'>No.{i + 1}</View>
                <Text className='nm-word'>{n.text}</Text>
                <Text className='nm-py'>{n.pinyin}</Text>
                <View className='nm-tags'>
                  {n.cs.map((c: any, ci: number) => (
                    <Text key={ci} className='nm-tag' style={{ color: WUXING_COLOR[c.wuxing] }}>{c.wuxing}</Text>
                  ))}
                  <Text className='nm-tag nm-tag-sum'>{n.wxs}</Text>
                </View>
                <Text className='nm-mean'>{n.cs.map((c: any) => c.meaning).join('；')}</Text>
                <Text className='nm-why'>{n.why}。笔画 {n.stroke}，读来{n.fluent}。</Text>
              </View>
            ))}
          </View>

          <Text className='para muted'>{result.note}</Text>
        </>
      )}
    </View>
  )
}
