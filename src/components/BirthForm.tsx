import { View, Text, Input, Picker, Switch } from '@tarojs/components'
import { useMemo } from 'react'
import {
  HOUR_OPTIONS, LUNAR_YEARS, lunarDayOptions, lunarMonthOptions, pad2, solarLabel
} from '../engine/calendar'
import { placeColumns, placeFromIndex, indexFromPlace } from '../engine/geo'
import './birth-form.scss'

export type Place = { province: string, city: string, district: string }

export type BirthValue = {
  name: string
  gender: '男' | '女'
  solar: boolean
  leap: boolean
  year: number
  month: number
  day: number
  hour: number
  place: Place
  truesolar: boolean
}

type Props = {
  value: BirthValue
  onChange: (next: BirthValue) => void
  showPlace?: boolean
}

const MONTH_CN = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']

export default function BirthForm ({ value, onChange, showPlace = true }: Props) {
  const patch = (p: Partial<BirthValue>) => onChange({ ...value, ...p })

  const monthOpts = useMemo(() => lunarMonthOptions(value.year), [value.year])
  const dayOpts = useMemo(() => lunarDayOptions(value.year, value.month), [value.year, value.month])

  const monthIdx = Math.max(0, monthOpts.findIndex((m) => m.value === value.month))
  const dayIdx = Math.max(0, Math.min(dayOpts.length - 1, value.day - 1))
  const yearIdx = Math.max(0, LUNAR_YEARS.indexOf(value.year))

  const lunarLabels = useMemo(() => {
    return [
      LUNAR_YEARS.map((y) => `${y}年`),
      monthOpts.map((m) => m.label),
      dayOpts.map((d) => d.label)
    ]
  }, [monthOpts, dayOpts])

  const hourIdx = Math.max(0, HOUR_OPTIONS.findIndex((h) => h.hour === value.hour))

  const cols = placeColumns(value.place.province, value.place.city)
  const placeIdx = indexFromPlace(value.place)
  const placeLabel = `${value.place.province} ${value.place.city} ${value.place.district}`

  const onLunarColumn = (e: any) => {
    const { column, value: v } = e.detail
    if (column === 0) {
      const year = LUNAR_YEARS[v]
      const opts = lunarMonthOptions(year)
      const month = opts.some((m) => m.value === value.month) ? value.month : opts[0].value
      patch({ year, month })
    } else if (column === 1) {
      const month = monthOpts[v] ? monthOpts[v].value : 1
      const days = lunarDayOptions(value.year, month)
      patch({ month, day: Math.min(value.day, days.length) })
    }
  }

  const onLunarChange = (e: any) => {
    const [yi, mi, di] = e.detail.value as number[]
    const year = LUNAR_YEARS[yi]
    const opts = lunarMonthOptions(year)
    const month = opts[mi] ? opts[mi].value : 1
    const days = lunarDayOptions(year, month)
    patch({ year, month, day: Math.min(di + 1, days.length), leap: month < 0 })
  }

  const solarStr = `${value.year}-${pad2(value.month)}-${pad2(value.day)}`

  return (
    <View className='birth-form'>
      <View className='form-row'>
        <Text className='form-label'>姓名</Text>
        <Input
          className='form-input'
          value={value.name}
          placeholder='可不填'
          placeholderStyle='color:#5f6678'
          onInput={(e) => patch({ name: e.detail.value })}
        />
      </View>

      <View className='form-row'>
        <Text className='form-label'>性别</Text>
        <View className='form-right'>
          <View className='seg'>
            {(['男', '女'] as const).map((g) => (
              <View
                key={g}
                className={`seg-item ${value.gender === g ? 'seg-item-on' : ''}`}
                onClick={() => patch({ gender: g })}
              >
                {g}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className='form-row'>
        <Text className='form-label'>历法</Text>
        <View className='form-right'>
          <View className='seg'>
            <View
              className={`seg-item ${value.solar ? 'seg-item-on' : ''}`}
              onClick={() => patch({ solar: true })}
            >
              公历
            </View>
            <View
              className={`seg-item ${!value.solar ? 'seg-item-on' : ''}`}
              onClick={() => patch({ solar: false })}
            >
              农历
            </View>
          </View>
        </View>
      </View>

      {value.solar ? (
        <Picker
          mode='date'
          start='1900-01-01'
          end='2100-12-31'
          value={solarStr}
          onChange={(e) => {
            const [y, m, d] = (e.detail.value as string).split('-').map((x) => Number(x))
            patch({ year: y, month: m, day: d })
          }}
        >
          <View className='form-row'>
            <Text className='form-label'>出生日期</Text>
            <Text className='form-value'>{solarLabel(value.year, value.month, value.day)}</Text>
          </View>
        </Picker>
      ) : (
        <Picker
          mode='multiSelector'
          range={lunarLabels}
          value={[yearIdx, monthIdx, dayIdx]}
          onColumnChange={onLunarColumn}
          onChange={onLunarChange}
        >
          <View className='form-row'>
            <Text className='form-label'>农历生日</Text>
            <Text className='form-value'>
              {`${value.year}年${value.month < 0 ? '闰' : ''}${MONTH_CN[Math.abs(value.month) - 1]}月${value.day}日`}
            </Text>
          </View>
        </Picker>
      )}

      <Picker
        mode='selector'
        range={HOUR_OPTIONS.map((h) => h.label)}
        value={hourIdx}
        onChange={(e) => patch({ hour: HOUR_OPTIONS[Number(e.detail.value)].hour })}
      >
        <View className='form-row'>
          <Text className='form-label'>出生时辰</Text>
          <Text className='form-value'>{HOUR_OPTIONS[hourIdx].label}</Text>
        </View>
      </Picker>

      {showPlace && (
        <Picker
          mode='multiSelector'
          range={cols}
          value={placeIdx}
          onColumnChange={(e) => {
            const idx = placeIdx.slice()
            idx[e.detail.column] = e.detail.value
            if (e.detail.column === 0) { idx[1] = 0; idx[2] = 0 }
            if (e.detail.column === 1) { idx[2] = 0 }
            patch({ place: placeFromIndex(idx) })
          }}
          onChange={(e) => patch({ place: placeFromIndex(e.detail.value as number[]) })}
        >
          <View className='form-row'>
            <Text className='form-label'>出生地</Text>
            <Text className='form-value'>{placeLabel}</Text>
          </View>
        </Picker>
      )}

      <View className='form-row'>
        <Text className='form-label'>真太阳时</Text>
        <View className='form-right'>
          <Switch
            checked={value.truesolar}
            color='#c99a4e'
            onChange={(e) => patch({ truesolar: e.detail.value })}
          />
        </View>
      </View>
      <Text className='bf-tip'>
        真太阳时按出生地经度与均时差校正；时辰表按东八区标准时，若出生在时辰交界处建议开启。
      </Text>
    </View>
  )
}
