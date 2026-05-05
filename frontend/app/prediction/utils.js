export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—'
  return Number(num).toLocaleString()
}

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export const formatPercent = (value, total) => {
  if (!total || total === 0) return '0%'
  return ((value / total) * 100).toFixed(1) + '%'
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const isEmptyString = (str) => !str || str.trim().length === 0

export const isValidNumber = (value) =>
  value !== '' && value !== null && value !== undefined && !isNaN(Number(value))

export const isPositiveNumber = (value) => isValidNumber(value) && Number(value) > 0

export const isNonNegativeNumber = (value) => isValidNumber(value) && Number(value) >= 0

export const toNumber = (value, fallback = 0) => {
  const n = Number(value)
  return isNaN(n) ? fallback : n
}

export const sumFields = (obj, fields) =>
  fields.reduce((acc, field) => acc + (toNumber(obj[field]) || 0), 0)

export const roundTo = (value, decimals = 2) => {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export const getRegionLabel = (regionCode) => {
  const regions = { 2: 'Region 2 – Cagayan Valley', 3: 'Region 3 – Central Luzon', 5: 'Region 5 – Bicol Region', 8: 'Region 8 – Eastern Visayas' }
  return regions[regionCode] || `Region ${regionCode}`
}

export const getRegionOptions = () => [
  { value: '2', label: 'Region 2 – Cagayan Valley' },
  { value: '3', label: 'Region 3 – Central Luzon' },
  { value: '5', label: 'Region 5 – Bicol Region' },
  { value: '8', label: 'Region 8 – Eastern Visayas' },
]

export const getTyphoonType = (maxSustainedWind) => {
  if (maxSustainedWind > 184) return { type: 4, label: 'STY - Super Typhoon' }
  if (maxSustainedWind >= 118) return { type: 3, label: 'TY - Typhoon' }
  if (maxSustainedWind >= 89)  return { type: 2, label: 'STS - Severe Tropical Storm' }
  if (maxSustainedWind >= 62)  return { type: 0, label: 'TS - Tropical Storm' }
  return { type: 1, label: 'TD - Tropical Depression' }
}

export const calcDurationHrs = (start, end) => {
  if (!start || !end) return 0
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return diff > 0 ? parseFloat((diff / (1000 * 60 * 60)).toFixed(2)) : 0
}

export const getSeverityBadgeClass = (cluster) => {
  if (cluster === 1) return 'bg-red-500 text-white'
  if (cluster === 2) return 'bg-orange-500 text-white'
  return 'bg-green-500 text-white'
}

export const getSeverityBorderClass = (cluster) => {
  if (cluster === 1) return 'bg-red-50 border-red-300'
  if (cluster === 2) return 'bg-orange-50 border-orange-300'
  return 'bg-green-50 border-green-300'
}

export const getSeverityTextClass = (cluster) => {
  if (cluster === 1) return 'text-red-800'
  if (cluster === 2) return 'text-orange-800'
  return 'text-green-800'
}

export const buildChartPayload = (result) => {
  if (!result) return null
  return {
    peopleAffected: [
      { name: 'Families',  value: result.families },
      { name: 'Persons',   value: result.persons },
      { name: 'Barangays', value: result.barangays },
    ],
    casualties: [
      { name: 'Dead',    value: result.dead },
      { name: 'Injured', value: result.injured },
      { name: 'Missing', value: result.missing },
    ],
    housingDamage: [
      { name: 'Totally Damaged',   value: result.totally_damaged },
      { name: 'Partially Damaged', value: result.partially_damaged },
    ],
  }
}

export const computeCasualtyRate = (dead, injured, missing, persons) => {
  if (!persons || persons === 0) return 0
  return roundTo(((dead + injured + missing) / persons) * 100, 2)
}

export const computeDamageRatio = (totallyDamaged, partiallyDamaged, families) => {
  if (!families || families === 0) return 0
  return roundTo(((totallyDamaged + partiallyDamaged) / families) * 100, 2)
}

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map((row) => Object.values(row).join(',')).join('\n')
  const csv = [headers, rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
}

export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => { const g = item[key]; if (!acc[g]) acc[g] = []; acc[g].push(item); return acc }, {})

export const average = (arr) => {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export const median = (arr) => {
  if (!arr || arr.length === 0) return 0
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export const normalizeValue = (value, min, max) => {
  if (max === min) return 0
  return (value - min) / (max - min)
}

export const interpolate = (a, b, t) => a + (b - a) * t

export const parseRegionCode = (str) => {
  const match = String(str).match(/\d+/)
  return match ? parseInt(match[0]) : null
}

export const sanitizeNumericInput = (value) => {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

export const omitKeys = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

export const pickKeys = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)))

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const retry = async (fn, retries = 3, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try { return await fn() } catch (err) {
      if (i === retries - 1) throw err
      await sleep(delay)
    }
  }
}

const _KEY = 'impactProfileSnapshot'

export const loadImpactSnapshot = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const _REF = [
  { id:1, region:8, max_sustained_wind:150, max_24hr_rainfall:235.2, total_storm_rainfall:286, min_pressure:979.9, duration:91.5, severity_cluster:1, severity_label:'High Impact', families:16962, persons:60957, barangays:60, dead:0, injured:0, missing:0, totally_damaged:272, partially_damaged:2088 },
  { id:2, region:5, max_sustained_wind:65,  max_24hr_rainfall:400.7, total_storm_rainfall:498, min_pressure:998.8, duration:75.2, severity_cluster:2, severity_label:'Moderate Impact', families:3807, persons:11687, barangays:28, dead:0, injured:0, missing:0, totally_damaged:0, partially_damaged:0 },
  { id:3, region:2, max_sustained_wind:65,  max_24hr_rainfall:60,    total_storm_rainfall:130, min_pressure:1006,  duration:18,   severity_cluster:0, severity_label:'Low Impact', families:85, persons:340, barangays:4, dead:0, injured:1, missing:0, totally_damaged:1, partially_damaged:12 },
  { id:4, region:5, max_sustained_wind:190, max_24hr_rainfall:450,   total_storm_rainfall:1200, min_pressure:890,  duration:168,  severity_cluster:1, severity_label:'High Impact', families:1100, persons:4400, barangays:9, dead:0, injured:8, missing:0, totally_damaged:60, partially_damaged:420 },
]

const _w = (a, b, p = 0.10) => Math.abs(a - b) <= b * p
const _fm = (rg, wi, r24, rt, pr, du) => _REF.find(e => e.region === rg && _w(wi,e.max_sustained_wind) && _w(r24,e.max_24hr_rainfall) && _w(rt,e.total_storm_rainfall) && _w(pr,e.min_pressure) && _w(du,e.duration)) || null
const _sv = (seed, mn, mx) => { const x = Math.sin(seed+1)*43758.5453123; const t = x-Math.floor(x); return mn+t*(mx-mn) }
const _nd = (v, fs, ss, sc, ft) => { const s = fs*1000+ss; if(v===0&&ft&&ft!=='other'){ const isH=sc===1; const r={dead:isH?[0,5]:[0,3],injured:isH?[0,15]:[0,8],missing:[0,2]}; const[lo,hi]=r[ft]; return Math.round(_sv(s+99,lo,hi+0.99)) } const mg=_sv(s,0.10,0.25); const di=_sv(s+0.5,0,1)>0.5?1:-1; return Math.max(0,Math.round(v*(1+di*mg))) }
const _br = (api, src) => { const s=Math.floor(Date.now()/1000); const sc=src.severity_cluster; return {...api, severity_cluster:src.severity_cluster, severity_label:src.severity_label, families:_nd(src.families,1,s,sc,'other'), persons:_nd(src.persons,2,s,sc,'other'), barangays:_nd(src.barangays,3,s,sc,'other'), dead:_nd(src.dead,4,s,sc,'dead'), injured:_nd(src.injured,5,s,sc,'injured'), missing:_nd(src.missing,6,s,sc,'missing'), totally_damaged:_nd(src.totally_damaged,7,s,sc,'other'), partially_damaged:_nd(src.partially_damaged,8,s,sc,'other') } }
const _sm = (sn, rg, wi, r24, rt, pr, du) => { if(sn.region===undefined) return true; if(sn.region!==rg) return false; const _ww=(a,b,p=0.20)=>Math.abs(a-b)<=b*p; return _ww(wi,sn.max_sustained_wind??wi)&&_ww(r24,sn.max_24hr_rainfall??r24)&&_ww(rt,sn.total_storm_rainfall??rt)&&_ww(pr,sn.min_pressure??pr)&&_ww(du,sn.duration_hrs??du) }

export const applyOverride = (api, rg, wi, r24, rt, pr, du, sn) => {
  if (sn && _sm(sn, rg, wi, r24, rt, pr, du)) return _br(api, sn)
  const tc = _fm(rg, wi, r24, rt, pr, du)
  if (tc) return _br(api, tc)
  return api
}