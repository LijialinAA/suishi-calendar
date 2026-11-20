import { View, Text, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useMemo } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import BirthForm, { BirthValue } from '../../components/BirthForm'
import { buildBazi } from '../../engine/bazi'
import { buildAlmanac } from '../../engine/almanac'
import { draw, jieSections, wenSections, LV, LV_CLS, SUBJECT, SPAN, SITU } from '../../engine/divination'
import { cityLon, DEFAULT_PLACE } from '../../engine/geo'
import './index.scss'

const SUBJECTS = Object.keys(SUBJECT)
const SPANS = Object.keys(SPAN)
const SITUS = Object.keys(SITU)

const initialForm = (): BirthValue => ({
  name: '', gender: '男', solar: true, leap: false,
  year: 1992, month: 2, day: 8, hour: 12,
  place: DEFAULT_PLACE, truesolar: true
})

type Tab = 'draw' | 'jie' | 'wen'

export default function Divination () {
  const [tab, setTab] = useState<Tab>('draw')
  const [gua, setGua] = useState<any>(null)
  const [subject, setSubject] = useState('情感')
  const [span, setSpan] = useState('一月')
  const [situ, setSitu] = useState('平')
  const [form, setForm] = useState<BirthValue>(initialForm)
  const [meta, setMeta] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])

  const al = useMemo(() => {
    const now = new Date()
    return buildAlmanac(now.getFullYear(), now.getMonth() + 1, now.getDate(), now)
  }, [])

  const doDraw = (mode: 'day' | 'random') => {
    const g = draw(mode, al)
    setGua(g)
    const recs = [g, ...records].slice(0, 10)
    setRecords(recs)
    try { Taro.setStorageSync('mingli_qian_v1', { v: 1, list: recs.map(r => ({ name: r.name, lv: r.lv, mode: r.mode, at: new Date().toLocaleString() })) }) } catch {}
    setTab('jie')
  }

  const loadMeta = () => {
    try {
      const lon = cityLon(form.place.province, form.place.city)
      const bazi = buildBazi({ ...form, lon, city: form.place.city, birthplace: `${form.place.province}${form.place.city}${form.place.district}` })
      setMeta({
        day_gan: bazi.strength.dayGan,
        tone: bazi.strength.level,
        xi: bazi.strength.favor,
        ji: bazi.strength.avoid,
        sizhu: bazi.pillars.map(p => p.gan + p.zhi)
      })
    } catch {}
  }

  const jie = gua ? jieSections(gua, al, meta) : []
  const wen = wenSections(gua, subject, span, situ)

  return (
    <View className='page'>
      <PageHead title='趣味签文' sub='六十四卦 · 本地生成 · 仅供娱乐' icon='divination' />

      <View className='q-tabs'>
        {(['draw', 'jie', 'wen'] as Tab[]).map(t => (
          <View key={t} className={'q-tab ' + (tab === t ? 'q-tab-on' : '')} onClick={() => setTab(t)}>
            {t === 'draw' ? '摇签' : t === 'jie' ? '解读' : '提问'}
          </View>
        ))}
      </View>

      {tab === 'draw' && (
        <>
          <Card title='生辰（带入八字用，可选）'>
            <BirthForm value={form} onChange={setForm} />
          </Card>
          <Card title='起签'>
            <View className='q-draw'>
              <Text className='q-draw-tip'>签文为本地编写的白话简释，不引古籍原文</Text>
              <View className='btn' onClick={() => doDraw('day')}>按日辰定签</View>
              <View className='btn btn-ghost' onClick={() => doDraw('random')}>随手一抽</View>
            </View>
            <View className='divider' />
            <Text className='para muted'>带入生辰后，签文会附传统五行参照</Text>
            <View className='btn btn-ghost' onClick={loadMeta}>{meta ? '重新带入八字' : '带入八字档案'}</View>
          {!!gua && (
            <View className='q-card'>
              <Text className='q-no'>第 {gua.i + 1} 卦 · 六十四卦</Text>
              <Text className='q-name'>{gua.name}</Text>
              <Text className={'q-lv q-lv-' + LV_CLS[gua.lv]}>{LV[gua.lv]}</Text>
              <Text className='q-tag'>{gua.mode === 'day' ? '按日辰定签' : '随手一抽'}</Text>
              <Text className='q-brief'>{gua.brief}</Text>
            </View>
          )}
        </Card>
        </>
      )}

      {tab === 'jie' && (
        <Card title='解读'>
          {!gua ? (
            <Text className='para'>请先在「摇签」页起一签，再回来解读。</Text>
          ) : (
            <>
              {jie.map((s, i) => (
                <View key={i} className='q-sec'>
                  <Text className='q-sec-t'>{s.title}</Text>
                  <Text className='para'>{s.text}</Text>
                </View>
              ))}
              <View className='divider' />
              <Text className='para muted'>民俗参考 · 签文与解读均由本地规则生成，不构成决策、医疗、投资建议。</Text>
            </>
          )}
        </Card>
      )}

      {tab === 'wen' && (
        <>
          <Card title='提问设定'>
            <View className='form-row'>
              <Text className='form-label'>所问</Text>
              <Picker mode='selector' range={SUBJECTS} value={SUBJECTS.indexOf(subject)} onChange={e => setSubject(SUBJECTS[+e.detail.value])}>
                <View className='form-value'>{subject}</View>
              </Picker>
            </View>
            <View className='form-row'>
              <Text className='form-label'>时间尺度</Text>
              <Picker mode='selector' range={SPANS} value={SPANS.indexOf(span)} onChange={e => setSpan(SPANS[+e.detail.value])}>
                <View className='form-value'>{span}</View>
              </Picker>
            </View>
            <View className='form-row'>
              <Text className='form-label'>当前处境</Text>
              <Picker mode='selector' range={SITUS} value={SITUS.indexOf(situ)} onChange={e => setSitu(SITUS[+e.detail.value])}>
                <View className='form-value'>{situ}</View>
              </Picker>
            </View>
          </Card>
          <Card title='结构化提问解读'>
            {wen.map((s, i) => (
              <View key={i} className='q-sec'>
                <Text className='q-sec-t'>{s.title}</Text>
                <Text className='para'>{s.text}</Text>
              </View>
            ))}
            <View className='divider' />
            <Text className='para muted'>民俗参考 · 本页为结构化提问的本地规则解读，不是人工智能问答，不联网、不上传任何内容。</Text>
          </Card>
        </>
      )}

      {meta && (
        <Card title='已带入八字档案'>
          <View className='kv-grid'>
            <View className='kv'><Text className='kv-k'>日主</Text><Text className='kv-v'>{meta.day_gan}（{meta.tone}）</Text></View>
            <View className='kv'><Text className='kv-k'>传统所论</Text><Text className='kv-v jx-good'>{(meta.xi||[]).join('、')}</Text></View>
            <View className='kv'><Text className='kv-k'>忌</Text><Text className='kv-v jx-bad'>{(meta.ji||[]).join('、')}</Text></View>
          </View>
        </Card>
      )}

      <Card title='签文记录（仅存本机）' extra={`${records.length}/10`}>
        {records.length === 0 ? (
          <Text className='para muted'>暂无记录。</Text>
        ) : (
          records.slice(0, 5).map((r, i) => (
            <View key={i} className='q-rec'>
              <Text className='q-rec-name'>{r.name}</Text>
              <Text className={'q-rec-lv ' + LV_CLS[r.lv]}>{LV[r.lv]}</Text>
              <Text className='q-rec-mode'>{r.mode === 'day' ? '日辰签' : '随手机'}</Text>
            </View>
          ))
        )}
      </Card>
    </View>
  )
}
