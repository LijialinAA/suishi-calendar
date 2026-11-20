import { View, Text, Picker, Switch } from '@tarojs/components'
import { useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import BirthForm, { BirthValue } from '../../components/BirthForm'
import { buildBazi } from '../../engine/bazi'
import { buildAlmanac } from '../../engine/almanac'
import { buildZodiac, ZODIAC } from '../../engine/zodiac'
import { cityLon, DEFAULT_PLACE } from '../../engine/geo'
import './index.scss'

const initialForm = (): BirthValue => ({
  name: '', gender: '男', solar: true, leap: false,
  year: 1992, month: 2, day: 8, hour: 12,
  place: DEFAULT_PLACE, truesolar: true
})

const FOCUS = [
  { label: '全览', value: 'all' },
  { label: '性格特质', value: 'trait' },
  { label: '今日参考', value: 'today' },
  { label: '配对速查', value: 'match' }
]

export default function Zodiac () {
  const [form, setForm] = useState<BirthValue>(initialForm)
  const [focus, setFocus] = useState('all')
  const [wxOn, setWxOn] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const now = new Date()
      const al = buildAlmanac(now.getFullYear(), now.getMonth() + 1, now.getDate(), now)
      let meta: any = null
      if (wxOn) {
        const lon = cityLon(form.place.province, form.place.city)
        const bazi = buildBazi({ ...form, lon, city: form.place.city, birthplace: `${form.place.province}${form.place.city}${form.place.district}` })
        meta = {
          day_gan: bazi.strength.dayGan,
          tone: bazi.strength.level,
          xi: bazi.strength.favor,
          ji: bazi.strength.avoid,
          sizhu: bazi.pillars.map(p => p.gan + p.zhi)
        }
      }
      const r = buildZodiac(form.month, form.day, al, meta, focus, wxOn)
      setError('')
      setResult(r)
    } catch (e: any) {
      setError(e && e.message ? `生成失败：${e.message}` : '生成失败')
      setResult(null)
    }
  }

  const z = result?.z
  const todayZ = result?.todayZ

  return (
    <View className='page'>
      <PageHead title='星座文化档案' sub='四象五行 · 传统意象参照' icon='zodiac' />

      <Card title='阳历生日' extra='星座按阳历分区'>
        <BirthForm value={form} onChange={setForm} showPlace={wxOn} />
        <View className='form-row'>
          <Text className='form-label'>档案侧重</Text>
          <Picker mode='selector' range={FOCUS.map(o => o.label)} value={FOCUS.findIndex(o => o.value === focus)} onChange={e => setFocus(FOCUS[+e.detail.value].value)}>
            <View className='form-value'>{FOCUS.find(o => o.value === focus)?.label}</View>
          </Picker>
        </View>
        <View className='form-row'>
          <Text className='form-label'>叠加八字</Text>
          <Switch checked={wxOn} onChange={e => setWxOn(e.detail.value)} color='#d9b46a' />
        </View>
        <View className='btn' onClick={run}>生成档案</View>
        {!!error && <Text className='err'>{error}</Text>}
      </Card>

      {!result && (
        <Card title='说明'>
          <Text className='para'>阳历生日定星座；生辰用于叠加八字喜用五行，今日喜神 / 财神 / 吉时取自本地黄历。四象与五行只作意象参照。</Text>
        </Card>
      )}

      {!!result && z && (
        <>
          <View className='zodiac-hero' style={{ borderColor: z.cval + '66' }}>
            <Text className='zodiac-sym'>{z.s}</Text>
            <Text className='zodiac-name'>{z.n}</Text>
            <Text className='zodiac-date'>{result.dateRange}</Text>
            <View className='zodiac-chips'>
              <Text className='chip chip-gold'>{z.el}象</Text>
              <Text className='chip'>{z.yy}</Text>
              <Text className='chip'>守护星 {z.star}</Text>
              <Text className='chip'>五行 {z.wx}</Text>
            </View>
            <Text className='zodiac-desc'>{z.desc}</Text>
          </View>

          {result.showTrait && (
            <Card title='性格特质'>
              <View className='kv-grid'>
                {z.keys.map((k: string, i: number) => (
                  <View key={i} className='kv'><Text className='kv-k'>关键词{i + 1}</Text><Text className='kv-v'>{k}</Text></View>
                ))}
                <View className='kv kv-full'><Text className='kv-k'>四象解读</Text><Text className='kv-v'>{result.elText}</Text></View>
              </View>
              <View className='divider' />
              <Text className='kv-k jx-good'>优势</Text>
              {z.good.map((g: string, i: number) => <Text key={i} className='para'>· {g}</Text>)}
              <Text className='kv-k jx-bad' style={{ marginTop: '12rpx' }}>留意</Text>
              {z.care.map((c: string, i: number) => <Text key={i} className='para'>· {c}</Text>)}
            </Card>
          )}

          {result.showToday && (
            <Card title='今日星象参考'>
              <Text className='para gold'>{result.todayLine}</Text>
              <View className='divider' />
              <View className='kv-grid'>
                <View className='kv'><Text className='kv-k'>今日星座</Text><Text className='kv-v'>{todayZ?.n || '—'}</Text></View>
                <View className='kv'><Text className='kv-k'>吉时</Text><Text className='kv-v'>{result.luckyHour}</Text></View>
                <View className='kv'><Text className='kv-k'>宜</Text><Text className='kv-v jx-good'>{result.yi}</Text></View>
                <View className='kv'><Text className='kv-k'>忌</Text><Text className='kv-v jx-bad'>{result.ji}</Text></View>
              </View>
              {result.metaOk && meta && (
                <>
                  <View className='divider' />
                  <Text className='kv-k'>八字五行参照</Text>
                  <Text className='para'>日主 {meta.day_gan}（{meta.tone}），传统所论宜 {(meta.xi||[]).join('、')}、不取 {(meta.ji||[]).join('、')}。星座四象与五行分属不同体系，此处只作民俗意象对照。</Text>
                </>
              )}
            </Card>
          )}

          {result.showMatch && (
            <Card title='配对速查'>
              <View className='kv-grid'>
                <View className='kv kv-full'><Text className='kv-k'>最佳配对</Text><Text className='kv-v jx-good'>{z.best.join('、')}</Text></View>
                <View className='kv kv-full'><Text className='kv-k'>需磨合</Text><Text className='kv-v jx-bad'>{z.careZ}</Text></View>
              </View>
              <View className='divider' />
              <Text className='kv-k'>十二星座一览</Text>
              <View className='zodiac-list'>
                {ZODIAC.map((zz, i) => (
                  <View key={i} className='zodiac-list-i' style={{ opacity: zz.n === z.n ? 1 : 0.6 }}>
                    <Text className='zodiac-list-sym'>{zz.s}</Text>
                    <Text className='zodiac-list-name'>{zz.n}</Text>
                    <Text className='zodiac-list-el'>{zz.el}象</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          <Text className='para muted'>{result.note}</Text>
        </>
      )}
    </View>
  )
}
