# 我的岁时日历 · 排盘工具

以 Taro + React + TypeScript 编写的传统历法与盘面工具。全部数据在本地计算，无需登录、不联网、不收集任何用户信息。

> 源码可见（Source-Available）。**商业使用需获得书面授权**，详见 [LICENSE](LICENSE)。

## 功能

| 模块 | 内容 |
|---|---|
| 今日 | 公历农历、干支纪年、二十四节气、传统节日、月相物候、十二时辰干支 |
| 月历 | 按月浏览与快速跳转，点选日期查看当日信息 |
| 盘面 | 四柱（十神、藏干、纳音、十二长生、空亡）、五行个数统计、大运干支表；紫微十二宫星曜、庙旺、四化、大限 |
| 词典 | 52 条传统名词释义（十神 / 神煞 / 星曜 / 宫位 / 概念），含每日一词 |
| 关于 | 功能说明、数据来源、隐私声明、内容声明 |

设计要点：

- 排盘同时支持公历 / 农历输入，按出生地经度与均时差校正真太阳时
- 盘面只呈现历法换算结果，不输出吉凶判断
- 主题为杏色底 + 祥云纹，自定义底部导航带弹跳与朱砂横条动画
- 图标全部为内联 SVG data URI，不依赖外部图片资源

## 技术栈

- Taro 4.1.9（WeChat / H5 / 其他小程序可复用同一套代码）
- React 18 + TypeScript 5
- Sass
- [lunar-javascript](https://github.com/6tail/lunar-javascript) — 农历与干支换算
- [iztro](https://github.com/SylarLong/iztro) — 紫微斗数安星

## 目录结构

```
src/
├── app.config.ts          页面路由与自定义 tabBar 配置
├── app.scss               全局主题（杏色底 + 祥云纹）
├── components/            Card / PageHead / BirthForm / Fold
├── custom-tab-bar/        自定义底部导航（含动画）
├── engine/                排盘引擎（纯函数，无 UI 依赖）
│   ├── almanac.js         黄历、时辰、节气
│   ├── bazi.js            四柱、五行、大运
│   ├── ziwei.ts           紫微盘面
│   ├── glossary.ts        名词释义库
│   └── constants.*        干支、藏干、十神等常量表
├── pages/                 5 个页面
└── utils/                 图标、缓存等工具
```

## 本地运行

```bash
# 安装依赖
npm install

# 微信小程序：构建 + 监听
npm run dev:weapp

# 生产构建
npm run build:weapp
```

构建产物在 `dist/`。用微信开发者工具导入 `dist/` 目录即可预览；
上传前需在 `project.config.json` 中填入自己的小程序 AppID。

其他端复用同一套代码：

```bash
npm run build:h5     # H5 / 网页版
npm run build:rn     # React Native（需另行配置）
```

## 许可证与商业授权

- 本项目为**源码可见**，不是开源软件。个人学习、研究、非商业自用免费。
- 商业使用（含上架应用商店、嵌入商业产品、对外提供付费服务）需取得书面授权。
- 第三方组件（lunar-javascript、iztro、Taro、React、Sass）均为 MIT 许可，
  可商用，但须保留版权声明，详见 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)。
- 商业授权咨询：997147376@qq.com

## 免责声明

本项目为历法换算与传统文化名词的整理展示，所有结果均由内置算法在本地生成，
不含吉凶判断，不提供预测或建议，仅供传统文化研究与参考。
使用者应自行确认其使用方式符合所在地法律法规与平台规则。
