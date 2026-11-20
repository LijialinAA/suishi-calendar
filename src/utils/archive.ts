import Taro from '@tarojs/taro'

const KEY = 'mingli_archive_v1'
const MAX = 50

export type ArchiveType = 'bazi' | 'hehun'

export type ArchiveRecord = {
  id: string
  type: ArchiveType
  title: string
  subtitle: string
  createdAt: number
  /** 单人：生辰表单；合婚：甲乙双方生辰表单 */
  form?: any
  formA?: any
  formB?: any
}

export function listArchives (): ArchiveRecord[] {
  try {
    const raw = Taro.getStorageSync(KEY)
    if (!raw || !raw.list) return []
    return raw.list as ArchiveRecord[]
  } catch (e) {
    return []
  }
}

function write (list: ArchiveRecord[]) {
  Taro.setStorageSync(KEY, { v: 1, list: list.slice(0, MAX) })
}

export function saveArchive (rec: Omit<ArchiveRecord, 'id' | 'createdAt'> & { createdAt?: number }) {
  const list = listArchives()
  const id = `${rec.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  const full: ArchiveRecord = { ...rec, id, createdAt: rec.createdAt || Date.now() }
  write([full, ...list])
  return full
}

export function removeArchive (id: string) {
  write(listArchives().filter((r) => r.id !== id))
}

export function renameArchive (id: string, title: string) {
  write(listArchives().map((r) => (r.id === id ? { ...r, title } : r)))
}

export function clearArchives () {
  write([])
}

export function formatTime (ts: number) {
  const d = new Date(ts)
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export const TYPE_TEXT: Record<ArchiveType, string> = {
  bazi: '排盘',
  hehun: '合婚'
}
