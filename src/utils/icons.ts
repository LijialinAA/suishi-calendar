/** 内联 SVG 图标：转 data URI，供 WXSS background-image 使用（小程序 <image> 不支持 svg） */
export const svgIcon = (body: string, color = '#b8924a', width = 1.7) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  )}")`

/* ===== 桌面版原版莲花图标：花苞 / 绽放 两态 ===== */
const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const LOTUS_LEAF =
  '<g><path d="M12 15.5 12 21.5" stroke="#7d9b76" stroke-width="1.1" fill="none"/>' +
  '<path d="M2.8 16.8c3.2-1.9 6.6-1.7 8.6 0-2.4 1.9-6.2 1.8-8.6 0z" fill="#b9cfb2" stroke="#7d9b76" stroke-width=".9"/>' +
  '<path d="M21.2 16.8c-3.2-1.9-6.6-1.7-8.6 0 2.4 1.9 6.2 1.8 8.6 0z" fill="#b9cfb2" stroke="#7d9b76" stroke-width=".9"/></g>'

const LOTUS_BUD =
  '<path d="M12 3.4c2 2.3 2.9 4.6 2.9 6.9 0 2.1-1.2 3.5-2.9 3.5s-2.9-1.4-2.9-3.5c0-2.3.9-4.6 2.9-6.9z" fill="#eec4c8" stroke="#8c3a2b" stroke-width="1"/>'

const LOTUS_BLOOM =
  '<g fill="#f2cfd3" stroke="#8c3a2b" stroke-width=".8">' +
  '<ellipse cx="12" cy="10.6" rx="1.9" ry="3.9" transform="rotate(-66 12 14.8)"/>' +
  '<ellipse cx="12" cy="10.6" rx="1.9" ry="3.9" transform="rotate(66 12 14.8)"/>' +
  '<ellipse cx="12" cy="10.2" rx="2" ry="4.4" transform="rotate(-34 12 14.8)"/>' +
  '<ellipse cx="12" cy="10.2" rx="2" ry="4.4" transform="rotate(34 12 14.8)"/>' +
  '<ellipse cx="12" cy="9.8" rx="2.1" ry="4.8"/></g>'

const wrapSvg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`

export const LOTUS_BUD_URI = dataUri(wrapSvg(LOTUS_LEAF + LOTUS_BUD))
export const LOTUS_BLOOM_URI = dataUri(wrapSvg(LOTUS_LEAF + LOTUS_BLOOM))

export const ICONS: Record<string, string> = {
  almanac: '<rect x="3.5" y="4.8" width="17" height="15.6" rx="2"/><path d="M3.5 9.4h17"/><path d="M8 2.8v4"/><path d="M16 2.8v4"/><path d="M8 13.2h3"/><path d="M13 13.2h3"/><path d="M8 16.4h3"/>',
  chart: '<circle cx="12" cy="12" r="8.6"/><path d="M12 3.4v17.2"/><path d="M3.4 12h17.2"/><circle cx="12" cy="12" r="3.1"/>',
  hehun: '<path d="M12 20.4S4.6 15.8 4.6 10.7A4.15 4.15 0 0 1 12 8.1a4.15 4.15 0 0 1 7.4 2.6c0 5.1-7.4 9.7-7.4 9.7z"/>',
  tools: '<rect x="3" y="3" width="7.2" height="7.2" rx="2"/><rect x="13.8" y="3" width="7.2" height="7.2" rx="2"/><rect x="3" y="13.8" width="7.2" height="7.2" rx="2"/><rect x="13.8" y="13.8" width="7.2" height="7.2" rx="2"/>',
  career: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18"/>',
  study: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5z"/><path d="M8 3v18"/><path d="M11.5 8h4.5"/>',
  naming: '<path d="M4 20l4.2-1L19 8.2 15.8 5 5 15.8z"/><path d="M13.5 7.3l3.2 3.2"/>',
  fengshui: '<circle cx="12" cy="12" r="8.6"/><path d="M12 6.8l2.6 5.2 5.2 2.6-5.2 2.6L12 22.4 9.4 17.2 4.2 14.6l5.2-2.6z"/>',
  zodiac: '<path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.85-5.38 2.85 1.03-6L3.3 9.6l6-.9z"/>',
  divination: '<path d="M4 6.5h16"/><path d="M4 12h6.5"/><path d="M13.5 12H20"/><path d="M4 17.5h16"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  archive: '<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.6l2 2H18.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>'
}
