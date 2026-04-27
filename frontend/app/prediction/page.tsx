'use client'

import { useState, useMemo, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

interface ForecastResult {
  families: number
  persons: number
  barangays: number
  dead: number
  injured: number
  missing: number
  partially_damaged: number
  totally_damaged: number
  severity_cluster: number
  severity_label: string
  severity_description: string
  message: string
}

interface BulkRow {
  input: Record<string, string>
  result?: ForecastResult
  error?: string
}

interface FormData {
  max_sustained_wind: string
  max_24hr_rainfall: string
  total_storm_rainfall: string
  min_pressure: string
  duration: string
  region: string
  start_datetime: string
  end_datetime: string
}

const initialFormData: FormData = {
  max_sustained_wind: '',
  max_24hr_rainfall: '',
  total_storm_rainfall: '',
  min_pressure: '',
  duration: '',
  region: '',
  start_datetime: '',
  end_datetime: '',
}

const VALID_REGIONS = [
  { value: '2', label: 'Region 2 – Cagayan Valley' },
  { value: '3', label: 'Region 3 – Central Luzon' },
  { value: '5', label: 'Region 5 – Bicol Region' },
  { value: '8', label: 'Region 8 – Eastern Visayas' },
]

const getTyphoonType = (maxSustainedWind: number): { type: number; label: string } => {
  if (maxSustainedWind > 184) return { type: 4, label: 'STY - Super Typhoon' }
  else if (maxSustainedWind >= 118) return { type: 3, label: 'TY - Typhoon' }
  else if (maxSustainedWind >= 89)  return { type: 2, label: 'STS - Severe Tropical Storm' }
  else if (maxSustainedWind >= 62)  return { type: 0, label: 'TS - Tropical Storm' }
  else return { type: 1, label: 'TD - Tropical Depression' }
}

const calcDurationHrs = (start: string, end: string): number => {
  if (!start || !end) return 0
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return diff > 0 ? parseFloat((diff / (1000 * 60 * 60)).toFixed(2)) : 0
}

const getSeverityBorder = (cluster: number) => {
  if (cluster === 1) return 'bg-red-50 border-red-300'
  if (cluster === 2) return 'bg-orange-50 border-orange-300'
  return 'bg-green-50 border-green-300'
}

const getSeverityBadge = (cluster: number) => {
  if (cluster === 1) return 'bg-red-500 text-white'
  if (cluster === 2) return 'bg-orange-500 text-white'
  return 'bg-green-500 text-white'
}

const getSeverityText = (cluster: number) => {
  if (cluster === 1) return 'text-red-800'
  if (cluster === 2) return 'text-orange-800'
  return 'text-green-800'
}

const getSeverityDesc = (cluster: number) => {
  if (cluster === 1) return 'text-red-700'
  if (cluster === 2) return 'text-orange-700'
  return 'text-green-700'
}

const BarLabel = (props: { x?: number; y?: number; width?: number; value?: number }) => {
  const { x = 0, y = 0, width = 0, value = 0 } = props
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#374151"
      textAnchor="middle"
      fontSize={11}
      fontWeight={600}
    >
      {value.toLocaleString()}
    </text>
  )
}

export default function PredictionPage() {
  const [activeTab, setActiveTab] = useState<'instance' | 'batch'>('instance')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [result, setResult] = useState<ForecastResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [bulkRows, setBulkRows] = useState<BulkRow[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkError, setBulkError] = useState('')
  const [bulkProgress, setBulkProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const typhoonClassification = useMemo(() => {
    const wind = parseFloat(formData.max_sustained_wind) || 0
    return getTyphoonType(wind)
  }, [formData.max_sustained_wind])

  const computedDuration = useMemo(() => {
    return calcDurationHrs(formData.start_datetime, formData.end_datetime)
  }, [formData.start_datetime, formData.end_datetime])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)
    validateFormData(updated)
  }

  const validateFormData = (data: FormData): boolean => {
    const errors: Record<string, string> = {}

    const wind = parseFloat(data.max_sustained_wind)
    if (!data.max_sustained_wind || isNaN(wind) || wind <= 0) {
      errors.max_sustained_wind = 'Wind speed is required and must be greater than 0'
    } else if (wind < 60) {
      errors.max_sustained_wind = 'Wind speed must be at least 60 kph'
    } else if (wind > 500) {
      errors.max_sustained_wind = 'Wind speed must not exceed 500 kph'
    }

    const rainfall24 = parseFloat(data.max_24hr_rainfall)
    if (!data.max_24hr_rainfall || isNaN(rainfall24) || rainfall24 < 0) {
      errors.max_24hr_rainfall = 'Max 24hr rainfall is required and cannot be negative'
    }

    const rainfallTotal = parseFloat(data.total_storm_rainfall)
    if (!data.total_storm_rainfall || isNaN(rainfallTotal) || rainfallTotal < 0) {
      errors.total_storm_rainfall = 'Total storm rainfall is required and cannot be negative'
    }

    if (!isNaN(rainfall24) && !isNaN(rainfallTotal) && rainfall24 >= 0 && rainfallTotal >= 0) {
      if (rainfall24 > rainfallTotal) {
        errors.max_24hr_rainfall = 'Max 24hr rainfall must be less than or equal to total rainfall'
      }
    }

    const pressure = parseFloat(data.min_pressure)
    if (!data.min_pressure || isNaN(pressure) || pressure <= 0) {
      errors.min_pressure = 'Pressure is required and must be greater than 0'
    } else if (pressure < 870) {
      errors.min_pressure = 'Pressure must be at least 870 hPa'
    } else if (pressure > 1100) {
      errors.min_pressure = 'Pressure must not exceed 1100 hPa'
    }

    if (data.start_datetime && data.end_datetime) {
      const start = new Date(data.start_datetime)
      const end = new Date(data.end_datetime)
      if (end <= start) {
        errors.end_datetime = 'End datetime must be after start datetime'
      } else if (calcDurationHrs(data.start_datetime, data.end_datetime) > 720) {
        errors.end_datetime = 'Duration exceeds typical typhoon lifespan (30 days)'
      }
    } else {
      if (!data.start_datetime) errors.start_datetime = 'Start datetime is required'
      if (!data.end_datetime) errors.end_datetime = 'End datetime is required'
    }

    if (!data.region) {
      errors.region = 'Region is required for accurate severity prediction'
    }

    if (!data.region) {
      errors.region = 'Region is required for accurate severity prediction'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateFormData(formData)) {
      setError('Please fix validation errors before submitting')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const payload = {
        max_sustained_wind:   parseFloat(formData.max_sustained_wind) || 0,
        max_24hr_rainfall:    parseFloat(formData.max_24hr_rainfall) || 0,
        total_storm_rainfall: parseFloat(formData.total_storm_rainfall) || 0,
        min_pressure:         parseFloat(formData.min_pressure) || 0,
        duration:             computedDuration,
        typhoon_type:         typhoonClassification.type,
        region:               formData.region ? parseInt(formData.region) : null,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clustering-for-post-tropical-cyclone.onrender.com'
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to get prediction' }))
        throw new Error(errorData.detail || 'Failed to get prediction')
      }

      const data: ForecastResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setResult(null)
    setError('')
    setValidationErrors({})
  }

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map(h => h.trim())
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: Record<string, string> = {}
      headers.forEach((h, i) => { row[h] = values[i] || '' })
      return row
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBulkError('')
    setBulkRows([])
    setBulkProgress(0)

    const text = await file.text()
    const rows = parseCSV(text)

    const requiredCols = ['max_sustained_wind', 'max_24hr_rainfall', 'total_storm_rainfall', 'min_pressure', 'duration']
    const headers = Object.keys(rows[0] || {})
    const missing = requiredCols.filter(c => !headers.includes(c))

    if (missing.length > 0) {
      setBulkError(`CSV is missing required columns: ${missing.join(', ')}`)
      return
    }

    if (rows.length > 100) {
      setBulkError('Maximum 100 rows allowed per upload.')
      return
    }

    setBulkLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://clustering-for-post-tropical-cyclone.onrender.com'
    const results: BulkRow[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const wind = parseFloat(row.max_sustained_wind) || 0
      const tc = getTyphoonType(wind)
      const regionVal = row.region ? parseInt(row.region) : null

      try {
        const payload = {
          max_sustained_wind:   wind,
          max_24hr_rainfall:    parseFloat(row.max_24hr_rainfall) || 0,
          total_storm_rainfall: parseFloat(row.total_storm_rainfall) || 0,
          min_pressure:         parseFloat(row.min_pressure) || 0,
          duration:             parseFloat(row.duration) || 0,
          typhoon_type:         tc.type,
          region:               regionVal,
        }

        const response = await fetch(`${apiUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          results.push({ input: row, error: `Row ${i + 1}: API error` })
        } else {
          const data: ForecastResult = await response.json()
          results.push({ input: row, result: data })
        }
      } catch {
        results.push({ input: row, error: `Row ${i + 1}: Failed to connect` })
      }

      setBulkProgress(Math.round(((i + 1) / rows.length) * 100))
    }

    setBulkRows(results)
    setBulkLoading(false)
  }

  const downloadCSV = () => {
    if (bulkRows.length === 0) return

    const headers = [
      'max_sustained_wind', 'max_24hr_rainfall', 'total_storm_rainfall', 'min_pressure', 'duration', 'region',
      'families', 'persons', 'barangays', 'dead', 'injured', 'missing',
      'totally_damaged', 'partially_damaged', 'severity_cluster', 'severity_label'
    ]

    const rows = bulkRows.map(row => {
      const r = row.result
      return [
        row.input.max_sustained_wind, row.input.max_24hr_rainfall,
        row.input.total_storm_rainfall, row.input.min_pressure, row.input.duration,
        row.input.region ?? '',
        r?.families ?? '', r?.persons ?? '', r?.barangays ?? '',
        r?.dead ?? '', r?.injured ?? '', r?.missing ?? '',
        r?.totally_damaged ?? '', r?.partially_damaged ?? '',
        r?.severity_cluster ?? '', r?.severity_label ?? (row.error || 'Error')
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prediction_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadTemplate = () => {
    const headers = ['max_sustained_wind', 'max_24hr_rainfall', 'total_storm_rainfall', 'min_pressure', 'duration', 'region']
    const exampleRow = ['150', '100', '200', '970', '24', '5']
    const csv = [headers.join(','), exampleRow.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prediction_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleBulkReset = () => {
    setBulkRows([])
    setBulkError('')
    setBulkProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Future Prediction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predict municipality damage metrics based on tropical cyclone weather features from your nearest weather station.
          </p>
        </div>

        {/* Data Disclaimer */}
        <div className="mt-6 max-w-5xl mx-auto bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Data Scope &amp; Limitations</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                The system&rsquo;s predictive outputs are <strong>spatially limited to the catchment areas of reporting meteorological stations</strong>, providing only <strong>municipality- or zone-level forecasts</strong>. It assumes <strong>uniform exposure</strong> within each coverage area and does not account for <strong>micro-topographical differences</strong> such as coastal, mountainous, or low-lying barangays. Since the model relies on <strong>station-level data without GIS elevation inputs</strong>, localized terrain-specific impacts cannot be assessed.
              </p>
              <p className="text-xs text-amber-800 leading-relaxed mt-2">
                The model is trained on <strong>historical data from 2020&ndash;2024</strong> across selected regions in the Philippines (Regions 2, 3, 5, and 8). Therefore, predictions may vary depending on <strong>regional geography, vulnerability, infrastructure, and preparedness</strong>. Results should be interpreted within the <strong>municipality-level scope and regional context</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('instance')}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${activeTab === 'instance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Instance Prediction
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${activeTab === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Batch Prediction (CSV)
          </button>
        </div>

        {/* ── Instance Prediction Tab ── */}
        {activeTab === 'instance' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Input Weather Features</h2>

                  <div className="space-y-6">

                    {/* Region */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 ${validationErrors.region ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      >
                        <option value="">Select a region...</option>
                        {VALID_REGIONS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      {validationErrors.region && <p className="text-red-500 text-xs mt-1">{validationErrors.region}</p>}
                    </div>

                    {/* Max Sustained Wind */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Max Sustained Wind (kph)</label>
                      <input
                        type="number" name="max_sustained_wind" value={formData.max_sustained_wind}
                        onChange={handleInputChange} min="60" max="500" step="1"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${validationErrors.max_sustained_wind ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {validationErrors.max_sustained_wind && <p className="text-red-500 text-xs mt-1">{validationErrors.max_sustained_wind}</p>}
                    </div>

                    {/* Typhoon Classification */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Typhoon Classification</label>
                      <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">{typhoonClassification.label}</div>
                      <p className="text-xs text-gray-500 mt-1">Auto-detected based on max sustained wind</p>
                    </div>

                    {/* Max 24hr Rainfall */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Max 24hr Rainfall (mm)</label>
                      <input
                        type="number" name="max_24hr_rainfall" value={formData.max_24hr_rainfall}
                        onChange={handleInputChange} min="0" step="0.1"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${validationErrors.max_24hr_rainfall ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {validationErrors.max_24hr_rainfall && <p className="text-red-500 text-xs mt-1">{validationErrors.max_24hr_rainfall}</p>}
                    </div>

                    {/* Total Storm Rainfall */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Total Storm Rainfall (mm)</label>
                      <input
                        type="number" name="total_storm_rainfall" value={formData.total_storm_rainfall}
                        onChange={handleInputChange} min="0" step="0.1"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${validationErrors.total_storm_rainfall ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {validationErrors.total_storm_rainfall && <p className="text-red-500 text-xs mt-1">{validationErrors.total_storm_rainfall}</p>}
                    </div>

                    {/* Min Pressure */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Min Pressure (hPa)</label>
                      <input
                        type="number" name="min_pressure" value={formData.min_pressure}
                        onChange={handleInputChange} min="870" max="1100" step="0.1"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${validationErrors.min_pressure ? 'border-red-500' : 'border-gray-300'}`}
                        required
                      />
                      {validationErrors.min_pressure && <p className="text-red-500 text-xs mt-1">{validationErrors.min_pressure}</p>}
                    </div>

                    {/* Start & End Datetime */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Datetime</label>
                        <input
                          type="datetime-local"
                          name="start_datetime"
                          value={formData.start_datetime}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${validationErrors.start_datetime ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors.start_datetime && <p className="text-red-500 text-xs mt-1">{validationErrors.start_datetime}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Datetime</label>
                        <input
                          type="datetime-local"
                          name="end_datetime"
                          value={formData.end_datetime}
                          min={formData.start_datetime || undefined}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${validationErrors.end_datetime ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {validationErrors.end_datetime && <p className="text-red-500 text-xs mt-1">{validationErrors.end_datetime}</p>}
                      </div>
                    </div>

                    {/* Duration — always read-only, driven by datetimes */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Duration (hours)
                        {formData.start_datetime && formData.end_datetime && (
                          <span className="ml-1 text-blue-500 font-normal">(auto-calculated)</span>
                        )}
                      </label>
                      <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                        {computedDuration > 0 ? `${computedDuration} hrs` : '—'}
                      </div>
                    </div>

                  </div>

                  {Object.keys(validationErrors).length > 0 && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm font-semibold">Please fix the following errors:</p>
                      <ul className="list-disc list-inside text-red-600 text-sm mt-2">
                        {Object.values(validationErrors).map((err, idx) => <li key={idx}>{err}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      type="submit"
                      disabled={loading || Object.keys(validationErrors).length > 0}
                      className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${loading || Object.keys(validationErrors).length > 0 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {loading ? 'Processing...' : 'Predict Damage'}
                    </button>
                    <button type="button" onClick={handleReset} className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              {/* Results */}
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Prediction Results</h2>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-red-700 text-sm font-medium">⚠ Error</p>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  )}

                  {result ? (
                    <div className="space-y-6">
                      <div className={`p-5 rounded-xl border-2 ${getSeverityBorder(result.severity_cluster)}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <p className={`text-lg font-bold ${getSeverityText(result.severity_cluster)}`}>
                            {result.severity_label}
                          </p>
                        </div>
                        <p className={`text-sm ${getSeverityDesc(result.severity_cluster)}`}>
                          {result.severity_description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`col-span-2 p-4 rounded-lg border-2 ${getSeverityBorder(result.severity_cluster)}`}>
                          <p className="text-xs font-medium mb-2" style={{ color: result.severity_cluster === 1 ? '#991b1b' : result.severity_cluster === 2 ? '#9a3412' : '#14532d' }}>Predicted Severity Level</p>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getSeverityBadge(result.severity_cluster)}`}>
                              Cluster {result.severity_cluster}
                            </span>
                            <p className={`text-xl font-bold ${getSeverityText(result.severity_cluster)}`}>
                              {result.severity_label}
                            </p>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium mb-1">Families Affected</p>
                          <p className="text-2xl font-bold text-blue-900">{result.families.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-xs text-blue-600 font-medium mb-1">Persons Affected</p>
                          <p className="text-2xl font-bold text-blue-900">{result.persons.toLocaleString()}</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                          <p className="text-xs text-indigo-600 font-medium mb-1">Barangays</p>
                          <p className="text-2xl font-bold text-indigo-900">{result.barangays.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <p className="text-xs text-red-600 font-medium mb-1">Deaths</p>
                          <p className="text-2xl font-bold text-red-900">{result.dead.toLocaleString()}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                          <p className="text-xs text-orange-600 font-medium mb-1">Injured</p>
                          <p className="text-2xl font-bold text-orange-900">{result.injured.toLocaleString()}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                          <p className="text-xs text-yellow-600 font-medium mb-1">Missing</p>
                          <p className="text-2xl font-bold text-yellow-900">{result.missing.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-600 font-medium mb-1">Totally Damaged</p>
                          <p className="text-2xl font-bold text-purple-900">{result.totally_damaged.toLocaleString()}</p>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                          <p className="text-xs text-pink-600 font-medium mb-1">Partially Damaged</p>
                          <p className="text-2xl font-bold text-pink-900">{result.partially_damaged.toLocaleString()}</p>
                        </div>
                      </div>

                      {result.message && (
                        <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                          ✓ {result.message}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">Select a region, enter weather data, and click &quot;Predict Damage&quot; to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Charts */}
            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">People Affected</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={[
                        { name: 'Families',  value: result.families },
                        { name: 'Persons',   value: result.persons },
                        { name: 'Barangays', value: result.barangays },
                      ]}
                      margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: unknown) => (value as number).toLocaleString()} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="value" content={<BarLabel />} />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#6366f1" />
                        <Cell fill="#8b5cf6" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Casualties</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={[
                        { name: 'Dead',    value: result.dead },
                        { name: 'Injured', value: result.injured },
                        { name: 'Missing', value: result.missing },
                      ]}
                      margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: unknown) => (value as number).toLocaleString()} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="value" content={<BarLabel />} />
                        <Cell fill="#ef4444" />
                        <Cell fill="#f97316" />
                        <Cell fill="#eab308" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Housing Damage</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={[
                        { name: 'Totally Damaged',   value: result.totally_damaged },
                        { name: 'Partially Damaged', value: result.partially_damaged },
                      ]}
                      margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: unknown) => (value as number).toLocaleString()} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="value" content={<BarLabel />} />
                        <Cell fill="#7c3aed" />
                        <Cell fill="#ec4899" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
            )}
          </>
        )}

        {/* ── Batch Prediction Tab ── */}
        {activeTab === 'batch' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Batch Prediction</h2>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Template
                </button>
              </div>

              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors mb-6"
              >
                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload CSV file</p>
                <p className="text-xs text-gray-400">Supports .csv</p>
                <input
                  id="csv-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                <p className="text-sm font-semibold text-blue-900 mb-1">Required Columns:</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  max_sustained_wind, max_24hr_rainfall, total_storm_rainfall, min_pressure, duration
                </p>
                <p className="text-sm font-semibold text-blue-900 mt-3 mb-1">Optional Column:</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  region — accepted values: <strong>2, 3, 5, 8</strong>. Strongly recommended for accurate severity prediction.
                </p>
              </div>

              {bulkRows.length > 0 && !bulkLoading && (
                <div className="flex justify-end mt-4">
                  <button onClick={handleBulkReset} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                    Clear
                  </button>
                </div>
              )}

              {bulkError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">⚠ {bulkError}</p>
                </div>
              )}

              {bulkLoading && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Processing rows...</span>
                    <span>{bulkProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {bulkRows.length > 0 && !bulkLoading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Results</h2>
                    <p className="text-sm text-gray-500 mt-1">{bulkRows.length} rows processed</p>
                  </div>
                  <button
                    onClick={downloadCSV}
                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">#</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Wind (kph)</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Pressure (hPa)</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Duration (hrs)</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Region</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Severity</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Families</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Persons</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Dead</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Injured</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Missing</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Totally Dmg</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">Partially Dmg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3 text-gray-500 text-xs">{idx + 1}</td>
                          <td className="py-3 px-3 font-medium">{row.input.max_sustained_wind}</td>
                          <td className="py-3 px-3">{row.input.min_pressure}</td>
                          <td className="py-3 px-3">{row.input.duration}</td>
                          <td className="py-3 px-3 text-gray-600">{row.input.region ? `Region ${row.input.region}` : '—'}</td>
                          <td className="py-3 px-3">
                            {row.result ? (
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${getSeverityBadge(row.result.severity_cluster)}`}>
                                {row.result.severity_label}
                              </span>
                            ) : (
                              <span className="text-xs text-red-500">{row.error || 'Error'}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">{row.result?.families.toLocaleString() ?? '—'}</td>
                          <td className="py-3 px-3">{row.result?.persons.toLocaleString() ?? '—'}</td>
                          <td className="py-3 px-3">{row.result?.dead.toLocaleString() ?? '—'}</td>
                          <td className="py-3 px-3">{row.result?.injured.toLocaleString() ?? '—'}</td>
                          <td className="py-3 px-3">{row.result?.missing.toLocaleString() ?? '—'}</td>
                          <td className="py-3 px-3">{row.result?.totally_damaged.toLocaleString() ?? '—'}</td>
                          <td className="py-3 px-3">{row.result?.partially_damaged.toLocaleString() ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}