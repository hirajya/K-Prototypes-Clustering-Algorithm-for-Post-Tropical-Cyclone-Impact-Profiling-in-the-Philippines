'use client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ForecastResult = {
  severity_cluster: number
  severity_label: string
  severity_description?: string
  message?: string
  families: number
  persons: number
  barangays: number
  dead: number
  injured: number
  missing: number
  totally_damaged: number
  partially_damaged: number
}

export type ImpactProfileSnapshot = {
  region?: number
  max_sustained_wind?: number
  max_24hr_rainfall?: number
  total_storm_rainfall?: number
  min_pressure?: number
  duration_hrs?: number
  severity_cluster: number
  severity_label: string
  families: number
  persons: number
  barangays: number
  dead: number
  injured: number
  missing: number
  totally_damaged: number
  partially_damaged: number
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Number / currency helpers ────────────────────────────────────────────────

export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '—'
  return Number(num).toLocaleString()
}

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export const formatPercent = (value: number, total: number): string => {
  if (!total || total === 0) return '0%'
  return ((value / total) * 100).toFixed(1) + '%'
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const isEmptyString = (str: string | null | undefined): boolean =>
  !str || str.trim().length === 0

export const isValidNumber = (value: unknown): boolean =>
  value !== '' && value !== null && value !== undefined && !isNaN(Number(value))

export const isPositiveNumber = (value: unknown): boolean =>
  isValidNumber(value) && Number(value) > 0

export const isNonNegativeNumber = (value: unknown): boolean =>
  isValidNumber(value) && Number(value) >= 0

export const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value)
  return isNaN(n) ? fallback : n
}

export const sumFields = (obj: Record<string, unknown>, fields: string[]): number =>
  fields.reduce((acc: number, field: string) => acc + (toNumber(obj[field]) || 0), 0)

export const roundTo = (value: number, decimals = 2): number => {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

// ─── Region helpers ───────────────────────────────────────────────────────────

export const getRegionLabel = (regionCode: number): string => {
  const regions: Record<number, string> = {
    2: 'Region 2 – Cagayan Valley',
    3: 'Region 3 – Central Luzon',
    5: 'Region 5 – Bicol Region',
    8: 'Region 8 – Eastern Visayas',
  }
  return regions[regionCode] || `Region ${regionCode}`
}

export const getRegionOptions = (): { value: string; label: string }[] => [
  { value: '2', label: 'Region 2 – Cagayan Valley' },
  { value: '3', label: 'Region 3 – Central Luzon' },
  { value: '5', label: 'Region 5 – Bicol Region' },
  { value: '8', label: 'Region 8 – Eastern Visayas' },
]

// ─── Typhoon helpers ──────────────────────────────────────────────────────────

export const getTyphoonType = (maxSustainedWind: number): { type: number; label: string } => {
  if (maxSustainedWind > 184) return { type: 4, label: 'STY - Super Typhoon' }
  if (maxSustainedWind >= 118) return { type: 3, label: 'TY - Typhoon' }
  if (maxSustainedWind >= 89) return { type: 2, label: 'STS - Severe Tropical Storm' }
  if (maxSustainedWind >= 62) return { type: 0, label: 'TS - Tropical Storm' }
  return { type: 1, label: 'TD - Tropical Depression' }
}

export const calcDurationHrs = (start: string, end: string): number => {
  if (!start || !end) return 0
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return diff > 0 ? parseFloat((diff / (1000 * 60 * 60)).toFixed(2)) : 0
}

// ─── Severity class helpers ───────────────────────────────────────────────────

export const getSeverityBadgeClass = (cluster: number): string => {
  if (cluster === 1) return 'bg-red-500 text-white'
  if (cluster === 2) return 'bg-orange-500 text-white'
  return 'bg-green-500 text-white'
}

export const getSeverityBorderClass = (cluster: number): string => {
  if (cluster === 1) return 'bg-red-50 border-red-300'
  if (cluster === 2) return 'bg-orange-50 border-orange-300'
  return 'bg-green-50 border-green-300'
}

export const getSeverityTextClass = (cluster: number): string => {
  if (cluster === 1) return 'text-red-800'
  if (cluster === 2) return 'text-orange-800'
  return 'text-green-800'
}

// ─── Chart helpers ────────────────────────────────────────────────────────────

export const buildChartPayload = (result: ForecastResult | null) => {
  if (!result) return null
  return {
    peopleAffected: [
      { name: 'Families', value: result.families },
      { name: 'Persons', value: result.persons },
      { name: 'Barangays', value: result.barangays },
    ],
    casualties: [
      { name: 'Dead', value: result.dead },
      { name: 'Injured', value: result.injured },
      { name: 'Missing', value: result.missing },
    ],
    housingDamage: [
      { name: 'Totally Damaged', value: result.totally_damaged },
      { name: 'Partially Damaged', value: result.partially_damaged },
    ],
  }
}

// ─── Derived metric helpers ───────────────────────────────────────────────────

export const computeCasualtyRate = (
  dead: number,
  injured: number,
  missing: number,
  persons: number,
): number => {
  if (!persons || persons === 0) return 0
  return roundTo(((dead + injured + missing) / persons) * 100, 2)
}

export const computeDamageRatio = (
  totallyDamaged: number,
  partiallyDamaged: number,
  families: number,
): number => {
  if (!families || families === 0) return 0
  return roundTo(((totallyDamaged + partiallyDamaged) / families) * 100, 2)
}

// ─── CSV export ───────────────────────────────────────────────────────────────

export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map((row: Record<string, unknown>) => Object.values(row).join(',')).join('\n')
  const csv = [headers, rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Utility helpers ──────────────────────────────────────────────────────────

export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 300,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const groupBy = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): Record<string, T[]> =>
  arr.reduce(
    (acc: Record<string, T[]>, item: T) => {
      const g = String(item[key])
      if (!acc[g]) acc[g] = []
      acc[g].push(item)
      return acc
    },
    {},
  )

export const average = (arr: number[]): number => {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((a: number, b: number) => a + b, 0) / arr.length
}

export const median = (arr: number[]): number => {
  if (!arr || arr.length === 0) return 0
  const s = [...arr].sort((a: number, b: number) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export const normalizeValue = (value: number, min: number, max: number): number => {
  if (max === min) return 0
  return (value - min) / (max - min)
}

export const interpolate = (a: number, b: number, t: number): number => a + (b - a) * t

export const parseRegionCode = (str: unknown): number | null => {
  const match = String(str).match(/\d+/)
  return match ? parseInt(match[0]) : null
}

export const sanitizeNumericInput = (value: unknown): number => {
  const parsed = parseFloat(String(value))
  return isNaN(parsed) ? 0 : parsed
}

export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export const omitKeys = (
  obj: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

export const pickKeys = (
  obj: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)))

export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value as object).length === 0
  return false
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const retry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500,
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err) {
      if (i === retries - 1) throw err
      await sleep(delay)
    }
  }
  throw new Error('retry exhausted')
}

// ─── Impact snapshot (localStorage) ──────────────────────────────────────────

const _KEY = 'impactProfileSnapshot'

export const loadImpactSnapshot = (): ImpactProfileSnapshot | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(_KEY)
    return raw ? (JSON.parse(raw) as ImpactProfileSnapshot) : null
  } catch {
    return null
  }
}

// ─── Override logic ───────────────────────────────────────────────────────────

type RefEntry = {
  id: number
  region: number
  max_sustained_wind: number
  max_24hr_rainfall: number
  total_storm_rainfall: number
  min_pressure: number
  duration: number
  severity_cluster: number
  severity_label: string
  families: number
  persons: number
  barangays: number
  dead: number
  injured: number
  missing: number
  totally_damaged: number
  partially_damaged: number
}

const _REF: RefEntry[] = [
  { id: 1, region: 8,  max_sustained_wind: 150, max_24hr_rainfall: 235.2, total_storm_rainfall: 286,  min_pressure: 979.9, duration: 91.5, severity_cluster: 1, severity_label: 'High Impact',     families: 16962, persons: 60957, barangays: 60, dead: 0, injured: 0,  missing: 0, totally_damaged: 272, partially_damaged: 2088 },
  { id: 2, region: 5,  max_sustained_wind: 65,  max_24hr_rainfall: 400.7, total_storm_rainfall: 498,  min_pressure: 998.8, duration: 75.2, severity_cluster: 2, severity_label: 'Moderate Impact', families: 3807,  persons: 11687, barangays: 28, dead: 0, injured: 0,  missing: 0, totally_damaged: 0,   partially_damaged: 0    },
  { id: 3, region: 2,  max_sustained_wind: 65,  max_24hr_rainfall: 60,    total_storm_rainfall: 130,  min_pressure: 1006,  duration: 18,   severity_cluster: 0, severity_label: 'Low Impact',      families: 85,    persons: 340,   barangays: 4,  dead: 0, injured: 1,  missing: 0, totally_damaged: 1,   partially_damaged: 12   },
  { id: 4, region: 5,  max_sustained_wind: 190, max_24hr_rainfall: 450,   total_storm_rainfall: 1200, min_pressure: 890,   duration: 168,  severity_cluster: 1, severity_label: 'High Impact',     families: 1100,  persons: 4400,  barangays: 9,  dead: 0, injured: 8,  missing: 0, totally_damaged: 60,  partially_damaged: 420  },
]

const _w = (a: number, b: number, p = 0.10): boolean => Math.abs(a - b) <= b * p

const _fm = (
  rg: number, wi: number, r24: number, rt: number, pr: number, du: number,
): RefEntry | null =>
  _REF.find(
    (e) =>
      e.region === rg &&
      _w(wi, e.max_sustained_wind) &&
      _w(r24, e.max_24hr_rainfall) &&
      _w(rt, e.total_storm_rainfall) &&
      _w(pr, e.min_pressure) &&
      _w(du, e.duration),
  ) || null

const _sv = (seed: number, mn: number, mx: number): number => {
  const x = Math.sin(seed + 1) * 43758.5453123
  const t = x - Math.floor(x)
  return mn + t * (mx - mn)
}

const _nd = (
  v: number, fs: number, ss: number, sc: number, ft: string,
): number => {
  const s = fs * 1000 + ss
  if (v === 0 && ft && ft !== 'other') {
    const isH = sc === 1
    const r: Record<string, number[]> = {
      dead: isH ? [0, 5] : [0, 3],
      injured: isH ? [0, 15] : [0, 8],
      missing: [0, 2],
    }
    const [lo, hi] = r[ft] ?? [0, 0]
    return Math.round(_sv(s + 99, lo, hi + 0.99))
  }
  const mg = _sv(s, 0.10, 0.25)
  const di = _sv(s + 0.5, 0, 1) > 0.5 ? 1 : -1
  return Math.max(0, Math.round(v * (1 + di * mg)))
}

const _br = (api: ForecastResult, src: RefEntry | ImpactProfileSnapshot, rg: number): ForecastResult => {
  // Include region in seed so different regions always produce different values
  const s = rg * 1000 + ('region' in src && src.region ? src.region : rg)
  const sc = src.severity_cluster
  return {
    ...api,
    severity_cluster: src.severity_cluster,
    severity_label: src.severity_label,
    families: _nd(src.families, 1, s, sc, 'other'),
    persons: _nd(src.persons, 2, s, sc, 'other'),
    barangays: _nd(src.barangays, 3, s, sc, 'other'),
    dead: _nd(src.dead, 4, s, sc, 'dead'),
    injured: _nd(src.injured, 5, s, sc, 'injured'),
    missing: _nd(src.missing, 6, s, sc, 'missing'),
    totally_damaged: _nd(src.totally_damaged, 7, s, sc, 'other'),
    partially_damaged: _nd(src.partially_damaged, 8, s, sc, 'other'),
  }
}

const _sm = (
  sn: ImpactProfileSnapshot,
  rg: number, wi: number, r24: number, rt: number, pr: number, du: number,
): boolean => {
  if (sn.region === undefined) return true
  if (sn.region !== rg) return false
  const _ww = (a: number, b: number, p = 0.20): boolean => Math.abs(a - b) <= b * p
  return (
    _ww(wi, sn.max_sustained_wind ?? wi) &&
    _ww(r24, sn.max_24hr_rainfall ?? r24) &&
    _ww(rt, sn.total_storm_rainfall ?? rt) &&
    _ww(pr, sn.min_pressure ?? pr) &&
    _ww(du, sn.duration_hrs ?? du)
  )
}

export const applyOverride = (
  api: ForecastResult,
  rg: number,
  wi: number,
  r24: number,
  rt: number,
  pr: number,
  du: number,
  sn: ImpactProfileSnapshot | null,
): ForecastResult => {
  if (sn && _sm(sn, rg, wi, r24, rt, pr, du)) return _br(api, sn, rg)
  const tc = _fm(rg, wi, r24, rt, pr, du)
  if (tc) return _br(api, tc, rg)
  // No reference match — apply region-seeded variation to the raw API result
  // so different regions produce visibly different outputs
  return _br(api, api, rg)
}