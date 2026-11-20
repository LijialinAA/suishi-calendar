import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import BirthForm, { BirthValue } from '../../components/BirthForm'
import { buildBazi } from '../../engine/bazi'
import { buildTopic } from '../../engine/topic'
import { cityLon, DEFAULT_PLACE } from '../../engine/geo'
import './index.scss'

const initialForm = (): BirthValue => ({
  name: '', gender: '男', solar: true, leap: false,
  year: 1992, month: 2, day: 8, hour: 12,
  place: DEFAULT_PLACE, truesolar: true
})

export default function Topic () {
  const kind = (Taro.getCurrentInstance().router?.params?.kind as 'career' | 'study') || 'career'
  const isCareer = kind === 'career'
  const [form, setForm] = useState<BirthValue>(initialForm)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const lon = cityLon(form.place.province, form.place.city)
      const birthplace = `${form.place.province}${form.place.city}${form.place.district}`
      const bazi = buildBazi({ ...form, lon, city: form.place.city, birthplace })
      const r = buildTopic(kind, bazi)
      setError('')
      setResult(r)
    } catch (e: any) {
      setError(e && e.message ? `推演失败：${e.message}` : '推演失败，请检查日期')
      setResult(null)
    }
  }

  return (
    <View className='page'>
      <PageHead
        title={isCareer ? '事业参考' : '学业参考'}
        sub={isCareer ? '行业方向 · 优势定位 · 发展节奏 · 财路' : '学科方向 · 读书运 · 考试年份 · 阶段建议'}
        icon={isCareer ? 'career' : 'study'}
      />

      <Card title='生辰信息' extra='公历 / 农历均可'>
        <BirthForm value={form} onChange={setForm} />
        <View className='btn' onClick={run}>开始{isCareer ? '解析' : '推演'}</View>
        {!!error && <Text className='err'>{error}</Text>}
      </Card>

      {!result && (
        <Card title='说明'>
          <Text className='para'>依据四柱十神、五行强弱、神煞与大运综合推演，给出{isCareer ? '行业、能力、节奏、财路与人际' : '学科、读书运、考试年份与阶段建议'}。结论供参考取舍。</Text>
        </Card>
      )}

      {!!result && (
        <>
          <Card title='总览'>
            <Text className='para gold'>{result.summary}</Text>
            <View className='divider' />
            <View className='kv-grid'>
              <View className='kv'><Text className='kv-k'>四柱</Text><Text className='kv-v'>{result.meta.sizhu.join(' ')}</Text></View>
              <View className='kv'><Text className='kv-k'>日主</Text><Text className='kv-v'>{result.meta.day_gan}（{result.meta.tone}）</Text></View>
              <View className='kv'><Text className='kv-k'>传统所论</Text><Text className='kv-v jx-good'>{(result.meta.xi||[]).join('、')}</Text></View>
              <View className='kv'><Text className='kv-k'>忌神</Text><Text className='kv-v jx-bad'>{(result.meta.ji||[]).join('、')}</Text></View>
            </View>
          </Card>

          {(result.sections || []).map((s: any, si: number) => (
            <Card key={si} title={s.title}>
              {!!s.intro && <Text className='para'>{s.intro}</Text>}
              {(s.items || []).map((it: any, ii: number) => (
                <View key={ii} className='tp-item'>
                  <Text className='tp-t'>{it.t}</Text>
                  {!!it.b && <View className='tp-row'><Text className='tp-em tp-b'>依据</Text><Text className='tp-span'>{it.b}</Text></View>}
                  {!!it.p && <View className='tp-row'><Text className='tp-em'>白话</Text><Text className='tp-span'>{it.p}</Text></View>}
                  {!!it.a && <View className='tp-row'><Text className='tp-em tp-c'>建议</Text><Text className='tp-span'>{it.a}</Text></View>}
                </View>
              ))}
              {s.id === 'years' && (
                <View className='tp-table'>
                  {(result.years || []).map((y: any, yi: number) => (
                    <View key={yi} className='tp-tr tp-tr2'>
                      <View className='tp-hd'>
                        <Text className='tp-y'>{y.y}{y.focus ? ' ★' : ''}</Text>
                        <Text className='tp-gz'>{y.gz}</Text>
                        <Text className={'tp-tag jx-' + (y.level === '吉' ? 'good' : y.level === '慎' ? 'bad' : 'mid')}>{y.tag}</Text>
                      </View>
                      <Text className='tp-txt'>{y.text}</Text>
                    </View>
                  ))}
                </View>
              )}
              {s.id === 'rhythm' && (
                <View className='tp-table'>
                  {(result.dayun || []).map((d: any, di: number) => (
                    <View key={di} className='tp-tr tp-tr2'>
                      <View className='tp-hd'>
                        <Text className='tp-y'>{`${d.gz}运`}</Text>
                        <Text className='tp-gz'>{`${d.age}岁`}</Text>
                        <Text className={'tp-tag jx-' + (d.level === '吉' ? 'good' : 'mid')}>{d.level}</Text>
                      </View>
                      <Text className='tp-txt'>{d.text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          ))}

          <Text className='para muted'>{result.note}</Text>
        </>
      )}
    </View>
  )
}
