import { View, Text, Picker } from '@tarojs/components'
import { useState } from 'react'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import { buildFengshui, DIRS } from '../../engine/fengshui'
import { buildAlmanac } from '../../engine/almanac'
import './index.scss'

export default function Fengshui () {
  const [year, setYear] = useState(1992)
  const [gender, setGender] = useState('男')
  const [doorIdx, setDoorIdx] = useState(4) // 南
  const [bedIdx, setBedIdx] = useState(-1)
  const [deskIdx, setDeskIdx] = useState(-1)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const run = () => {
    try {
      if (year < 1900 || year > 2100) { setError('请填写 1900–2100 之间的出生年'); return }
      const now = new Date()
      const al = buildAlmanac(now.getFullYear(), now.getMonth() + 1, now.getDate(), now)
      const r = buildFengshui(year, gender, DIRS[doorIdx], bedIdx >= 0 ? DIRS[bedIdx] : '', deskIdx >= 0 ? DIRS[deskIdx] : '', al)
      setError('')
      setResult(r)
    } catch (e: any) {
      setError(e && e.message ? `推演失败：${e.message}` : '推演失败')
      setResult(null)
    }
  }

  const dirRange = [...DIRS.map(d => d), '不指定']

  return (
    <View className='page'>
      <PageHead title='居家方位参考' sub='传统八宅 · 八方说法 · 民俗参考' icon='fengshui' />

      <Card title='基本信息'>
        <View className='form-row'>
          <Text className='form-label'>出生年</Text>
          <Picker mode='number' value={String(year)} onChange={e => setYear(+e.detail.value)}>
            <View className='form-value'>{year} 年</View>
          </Picker>
        </View>
        <View className='form-row'>
          <Text className='form-label'>性别</Text>
          <View className='seg'>
            <View className={'seg-item ' + (gender === '男' ? 'seg-item-on' : '')} onClick={() => setGender('男')}>男</View>
            <View className={'seg-item ' + (gender === '女' ? 'seg-item-on' : '')} onClick={() => setGender('女')}>女</View>
          </View>
        </View>
        <View className='form-row'>
          <Text className='form-label'>大门朝向</Text>
          <Picker mode='selector' range={DIRS} value={doorIdx} onChange={e => setDoorIdx(+e.detail.value)}>
            <View className='form-value'>{DIRS[doorIdx]}</View>
          </Picker>
        </View>
        <View className='form-row'>
          <Text className='form-label'>主卧方位</Text>
          <Picker mode='selector' range={dirRange} value={bedIdx + 1} onChange={e => setBedIdx(+e.detail.value - 1)}>
            <View className='form-value'>{bedIdx >= 0 ? DIRS[bedIdx] : '不指定'}</View>
          </Picker>
        </View>
        <View className='form-row'>
          <Text className='form-label'>书房/办公</Text>
          <Picker mode='selector' range={dirRange} value={deskIdx + 1} onChange={e => setDeskIdx(+e.detail.value - 1)}>
            <View className='form-value'>{deskIdx >= 0 ? DIRS[deskIdx] : '不指定'}</View>
          </Picker>
        </View>
        <View className='btn' onClick={run}>开始布局</View>
        {!!error && <Text className='err'>{error}</Text>}
      </Card>

      {!result && (
        <Card title='说明'>
          <Text className='para'>按传统八宅命卦（出生年 + 性别）列出八方星名，并附当日历书所载方位。以下均为古籍传统说法，属民俗文化内容，不构成任何指引。</Text>
        </Card>
      )}

      {!!result && (
        <>
          <Card title={result.guaText}>
            <Text className='para'>{result.guaDesc}</Text>
          </Card>

          <Card title='当日方位'>
            <View className='fs-today'>
              <View className='fs-today-i'><Text className='fs-today-v'>{result.today.cai}</Text><Text className='fs-today-k'>财神位</Text></View>
              <View className='fs-today-i'><Text className='fs-today-v'>{result.today.xi}</Text><Text className='fs-today-k'>喜神位</Text></View>
              <View className='fs-today-i'><Text className='fs-today-v'>{result.today.fu}</Text><Text className='fs-today-k'>福神位</Text></View>
              <View className='fs-today-i'><Text className='fs-today-v jx-bad'>{result.today.sha}</Text><Text className='fs-today-k'>煞方宜避</Text></View>
            </View>
            <Text className='para muted' style={{ marginTop: '12rpx' }}>{result.today.gzYear}年 {result.today.gzDay}日</Text>
          </Card>

          <Card title='八方星名与古籍说法'>
            <View className='fs-table'>
              <View className='fs-tr fs-th'><Text>方位</Text><Text>传统星名</Text><Text>传统说法</Text><Text>说明</Text></View>
              {(result.dirs || []).map((d: any, i: number) => (
                <View key={i} className='fs-tr'>
                  <Text>{d.dir}{d.marks.map((m: string) => ` · ${m}`).join('')}</Text>
                  <Text className={'jx-' + (d.good ? 'good' : 'bad')}>{d.star}</Text>
                  <Text className='fs-yi'>{d.yi}</Text>
                  <Text className='fs-ji'>{d.ji}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card title='针对本宅的建议'>
            {(result.notes || []).map((t: string, i: number) => (
              <View key={i} className='tp-row'>
                <Text className='tp-em'>{i + 1}</Text>
                <Text className='tp-span'>{t}</Text>
              </View>
            ))}
          </Card>

          <Text className='para muted'>{result.note}</Text>
        </>
      )}
    </View>
  )
}
