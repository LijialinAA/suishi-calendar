import { createElement, Fragment, PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import './app.scss'

// H5 端没有小程序的自定义 tabBar 机制，手动挂载同一个组件，保持两端体验一致
const H5TabBar: any =
  process.env.TARO_ENV === 'h5' ? require('./custom-tab-bar').default : null

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  if (!H5TabBar) return children
  return createElement(Fragment, null, children, createElement(H5TabBar))
}

export default App
