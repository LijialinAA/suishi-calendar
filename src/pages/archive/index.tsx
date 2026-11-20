import { View, Text } from '@tarojs/components'
import Card from '../../components/Card'
import PageHead from '../../components/PageHead'
import './index.scss'

const VERSION = '1.0.0'

export default function About () {
  return (
    <View className='page'>
      <PageHead title='关于' sub='我的岁时日历 · 使用说明' icon='archive' />

      <Card title='功能'>
        <Text className='para'>今日：查看当天公历与农历、干支纪年、二十四节气、传统节日、月相与物候；月历：按月浏览，点选任意日期查看当日信息；盘面：按生辰换算四柱干支、十神、大运与紫微十二宫等盘面数据；词典：查阅十神、神煞、星曜、宫位等传统名词的古籍释义。</Text>
      </Card>

      <Card title='数据说明'>
        <Text className='para'>全部内容由内置历法算法在手机本地换算生成，不联网、不上传、不下载在线数据。农历与节气依据公开天文历法数据推演，个别年份与官方历书可能存在一日以内误差。</Text>
      </Card>

      <Card title='隐私'>
        <Text className='para'>本应用无需登录，不收集、不存储任何个人信息，不获取通讯录、位置与相册权限。</Text>
      </Card>

      <Card title='内容声明'>
        <Text className='para'>本应用仅提供历法换算与传统文化常识的展示，所有结果均为干支、星曜等数据的对应呈现，不作任何评价或推断。内容仅供传统文化研究与参考，不构成任何建议。</Text>
      </Card>

      <View className='kv-grid'>
        <View className='kv'>
          <Text className='kv-k'>版本</Text>
          <Text className='kv-v'>{VERSION}</Text>
        </View>
        <View className='kv'>
          <Text className='kv-k'>数据来源</Text>
          <Text className='kv-v'>本地历法换算</Text>
        </View>
      </View>

      <Text className='foot-note'>我的岁时日历 · 传统历法查询工具</Text>
    </View>
  )
}
