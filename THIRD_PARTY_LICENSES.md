# 第三方组件许可

本项目（「我的岁时日历」）在运行与构建中使用了下列第三方组件。
各组件的版权归其作者所有，许可条款如下。

| 组件 | 版本 | 许可 | 用途 | 许可原文 |
|---|---|---|---|---|
| lunar-javascript | ^1.7.8 | MIT | 农历、节气、干支、四柱换算 | [THIRD_PARTY/lunar-javascript.LICENSE](THIRD_PARTY/lunar-javascript.LICENSE) |
| iztro | ^2.6.5 | MIT | 紫微斗数安星、十二宫、四化 | [THIRD_PARTY/iztro.LICENSE](THIRD_PARTY/iztro.LICENSE) |
| Taro (4.1.9) | 4.1.9 | MIT | 小程序跨端框架与构建工具链 | 见 node_modules/@tarojs/*/LICENSE |
| React / React DOM | ^18 | MIT | 视图层运行时 | 见 node_modules/react/LICENSE |
| Sass | ^1.75 | MIT | 样式编译 | 见 node_modules/sass/LICENSE |

## MIT 许可要点

MIT 许可允许自由使用、复制、修改、合并、发布、分发、再许可及销售，
但要求在软件的所有副本或主要部分中保留上述版权声明与许可声明。

因此，任何基于本仓库的发布物（包括编译后的小程序包、APK、网页），
都必须同时保留本文件与 `THIRD_PARTY/` 下的许可原文。

## 说明

- 上述 MIT 组件允许商业使用，与本仓库自身的商业授权要求互不影响；
  即：第三方代码可以商用，但**本仓库自研代码的商用仍需获得作者授权**（见 LICENSE）。
- 若替换或升级依赖，请同步更新本表与 `THIRD_PARTY/` 下的许可原文。
