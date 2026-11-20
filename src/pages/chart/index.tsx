import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import BirthForm, { BirthValue } from '../../components/BirthForm'
import { buildBazi } from '../../engine/bazi'
import { buildZiwei } from '../../engine/ziwei'
import { cityLon, DEFAULT_PLACE } from '../../engine/geo'
import './index.scss'

type Tab = 'bazi' | 'ziwei'

const initialForm = (): BirthValue => ({
  name: '',
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

export default function Chart () {
  const [form, setForm] = useState<BirthValue>(initialForm)
  const [tab, setTab] = useState<Tab>('bazi')
  const [result, setResult] = useState<{ bazi: any, ziwei: any } | null>(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      const lon = cityLon(form.place.province, form.place.city)
      const birthplace = `${form.place.province}${form.place.city}${form.place.district}`
      const bazi = buildBazi({
        ...form,
        lon,
        city: form.place.city,
        birthplace
      })
      const ziwei = buildZiwei({
        year: bazi.solar.getYear(),
        month: bazi.solar.getMonth(),
        day: bazi.solar.getDay(),
        hour: bazi.solar.getHour(),
        gender: form.gender
      })
      setError('')
      setResult({ bazi, ziwei })
      setTab('bazi')
    } catch (e: any) {
      setError(e && e.message ? `换算失败：${e.message}` : '换算失败，请检查日期是否在 1900–2100 年之间')
      setResult(null)
    }
  }

  const maxWuXing = useMemo(() => {
    if (!result) return 1
    return Math.max(1, ...result.bazi.wuxing.map((x: any) => x.value))
  }, [result])

  return (
    <View className='page'>
      <PageHead title='四柱盘面' sub='干支换算 · 大运纪年 · 星曜落宫' icon='chart' />

      <Card title='生辰信息' extra='公历 / 农历均可'>
        <BirthForm value={form} onChange={setForm} />
        <View className='btn' onClick={run}>生成盘面</View>
        {!!error && <Text className='err'>{error}</Text>}
      </Card>

      {!result && (
        <Card title='换算说明'>
          <Text className='para'>四柱与十神依子平法换算，紫微依《紫微斗数全书》安星，真太阳时按出生地经度与均时差校正。本页仅呈现历法换算所得的盘面数据，不含任何推断；十神、神煞、星曜等名词的释义可在「词典」中查阅。</Text>
        </Card>
      )}

      {!!result && (
        <>
          <View className='tabs'>
            <View className={`tab ${tab === 'bazi' ? 'tab-on' : ''}`} onClick={() => setTab('bazi')}>四柱盘面</View>
            <View className={`tab ${tab === 'ziwei' ? 'tab-on' : ''}`} onClick={() => setTab('ziwei')}>紫微盘面</View>
          </View>

          {tab === 'bazi' && (
            <>
              <Card
                title={result.bazi.name ? `${result.bazi.name} · ${result.bazi.gender}` : `命主 · ${result.bazi.gender}`}
                extra={`${result.bazi.header.shengxiao}年 · ${result.bazi.header.xingzuo}`}
              >
                <View className='kv-grid'>
                  <View className='kv kv-full'>
                    <Text className='kv-k'>公历</Text>
                    <Text className='kv-v'>{result.bazi.header.solar}</Text>
                  </View>
                  <View className='kv kv-full'>
                    <Text className='kv-k'>农历</Text>
                    <Text className='kv-v'>{result.bazi.header.lunar}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>命宫</Text>
                    <Text className='kv-v'>{result.bazi.header.minggong}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>身宫</Text>
                    <Text className='kv-v'>{result.bazi.header.shengong}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>胎元</Text>
                    <Text className='kv-v'>{result.bazi.header.taiyuan}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>起运</Text>
                    <Text className='kv-v'>{result.bazi.header.start}</Text>
                  </View>
                  <View className='kv kv-full'>
                    <Text className='kv-k'>出生地</Text>
                    <Text className='kv-v'>{result.bazi.birthplace || '未填写'}</Text>
                  </View>
                </View>
                {!!result.bazi.correction && (
                  <Text className='note'>{`真太阳时校正：${result.bazi.correction.note}`}</Text>
                )}
              </Card>

              <Card title='四柱' extra='天干 · 地支 · 藏干'>
                <View className='pillars'>
                  {result.bazi.pillars.map((p: any) => (
                    <View key={p.label} className='pillar'>
                      <Text className='p-label'>{p.label}</Text>
                      <Text className='p-gan serif'>{p.gan}</Text>
                      <Text className='p-deity'>{p.ganDeity}</Text>
                      <Text className='p-zhi serif'>{p.zhi}</Text>
                      <Text className='p-deity'>{p.zhiDeity}</Text>
                      <View className='p-hide'>
                        {p.hideGan.map((h: any) => (
                          <Text key={h.gan} className='p-hide-item'>{`${h.gan}${h.deity}`}</Text>
                        ))}
                      </View>
                      <Text className='p-meta'>{p.naYin}</Text>
                      <Text className='p-meta'>{`${p.diShi} · 空${p.xunKong}`}</Text>
                    </View>
                  ))}
                </View>
                <Text className='note'>
                  日主 {result.bazi.strength.dayGan}（{result.bazi.strength.dayWuXing}）。十神仅标示各干支与日主的生克关系，不含任何结论。
                </Text>
              </Card>

              <Card title='五行分布' extra='按四柱干支统计'>
                {result.bazi.wuxing.map((w: any) => (
                  <View key={w.name} className='bar-row'>
                    <Text className='bar-name'>{w.name}</Text>
                    <View className='bar-track'>
                      <View className='bar-fill' style={{ width: `${Math.round((w.value / maxWuXing) * 100)}%` }} />
                    </View>
                    <Text className='bar-val'>{w.value}</Text>
                  </View>
                ))}
                <Text className='note'>按年、月、日、时四柱的天干地支及藏干计数，仅作五行个数统计。</Text>
              </Card>

              <Card title='大运' extra={result.bazi.header.start}>
                <ScrollView scrollX className='dayun-scroll'>
                  <View className='dayun-row'>
                    {result.bazi.dayun.list.map((d: any) => (
                      <View key={d.gz + d.startAge} className={`dayun-item ${d.current ? 'dayun-on' : ''}`}>
                        <Text className='dy-gz serif'>{d.gz}</Text>
                        <Text className='dy-age'>{`${d.startAge}–${d.endAge}岁`}</Text>
                        <Text className='dy-year'>{`${d.startYear}`}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </Card>

              <View className='gl-link' onClick={() => Taro.navigateTo({ url: '/pages/glossary/index' })}>
                查看十神、神煞、星曜的释义 →
              </View>

              <Text className='foot-note'>
                四柱、十神与大运依 lunar 历法算法本地换算，为干支对应关系的客观呈现，不含任何推断，仅供传统文化研究与参考。
              </Text>
            </>
          )}

          {tab === 'ziwei' && (
            <>
              <Card title='紫微盘面' extra={`${result.ziwei.fiveElementsClass} · 命主${result.ziwei.soul}`}>
                <View className='kv-grid'>
                  <View className='kv'>
                    <Text className='kv-k'>公历</Text>
                    <Text className='kv-v'>{result.ziwei.solarDate}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>农历</Text>
                    <Text className='kv-v'>{result.ziwei.lunarDate}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>四柱</Text>
                    <Text className='kv-v'>{result.ziwei.chineseDate}</Text>
                  </View>
                  <View className='kv'>
                    <Text className='kv-k'>身主</Text>
                    <Text className='kv-v'>{result.ziwei.body}</Text>
                  </View>
                </View>
              </Card>

              <Card title='十二宫'>
                <View className='palace-grid'>
                  {result.ziwei.palaces.map((p: any) => (
                    <View key={p.name} className={`palace ${p.isBody ? 'palace-body' : ''}`}>
                      <Text className='pl-name'>{p.name}</Text>
                      <Text className='pl-branch'>{p.stemBranch}</Text>
                      <View className='pl-stars'>
                        {p.major.length
                          ? p.major.map((s: any) => (
                            <Text key={s.name} className='pl-major'>{`${s.name}${s.brightness ? `(${s.brightness})` : ''}${s.mutagen ? `·${s.mutagen}` : ''}`}</Text>
                          ))
                          : <Text className='pl-empty'>空宫</Text>}
                        {p.minor.slice(0, 4).map((s: any) => (
                          <Text key={s.name} className='pl-minor'>{`${s.name}${s.mutagen ? `·${s.mutagen}` : ''}`}</Text>
                        ))}
                      </View>
                      <Text className='pl-decadal'>{`${p.decadal[0]}–${p.decadal[1]}`}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              <View className='gl-link' onClick={() => Taro.navigateTo({ url: '/pages/glossary/index' })}>
                查看星曜与宫位的释义 →
              </View>

              <Text className='foot-note'>
                紫微斗数由 iztro 安星引擎本地换算，呈现主星庙旺、四化与十二宫大限等盘面数据，不含任何推断，仅供传统文化研究与参考。
              </Text>
            </>
          )}
        </>
      )}
    </View>
  )
}
