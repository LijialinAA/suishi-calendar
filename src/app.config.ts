export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/almanac/index',
    'pages/chart/index',
    'pages/hehun/index',
    'pages/topic/index',
    'pages/naming/index',
    'pages/fengshui/index',
    'pages/zodiac/index',
    'pages/divination/index',
    'pages/calendar/index',
    'pages/glossary/index',
    'pages/archive/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    backgroundColor: '#140d33',
    navigationBarBackgroundColor: '#140d33',
    navigationBarTitleText: '干支历法排盘工具',
    navigationBarTextStyle: 'white'
  }
})
