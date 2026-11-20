export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/almanac/index',
    'pages/calendar/index',
    'pages/chart/index',
    'pages/glossary/index',
    'pages/archive/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    backgroundColor: '#efe9dc',
    navigationBarBackgroundColor: '#efe9dc',
    navigationBarTitleText: '我的岁时日历',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#b4a98f',
    selectedColor: '#8c3a2b',
    backgroundColor: '#f7f1e4',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/almanac/index',
        text: '今日'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '月历'
      },
      {
        pagePath: 'pages/chart/index',
        text: '盘面'
      },
      {
        pagePath: 'pages/glossary/index',
        text: '词典'
      },
      {
        pagePath: 'pages/archive/index',
        text: '关于'
      }
    ]
  }
})
