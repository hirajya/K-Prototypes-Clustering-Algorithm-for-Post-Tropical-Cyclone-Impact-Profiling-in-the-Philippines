'use client'

import { useState, useMemo } from 'react'

interface ClusteringResult {
  cluster: number
  level: number
  severity_label: string
  severity_score: number
  description: string
}

interface FormData {
  families: string
  persons: string
  barangays: string
  dead: string
  injured_ill: string
  missing: string
  totally_damaged: string
  partially_damaged: string
  cost: string
  duration_hrs: string
  max_sustained_wind: string
  max_24hr_rainfall: string
  total_storm_rainfall: string
  min_pressure: string
  region: string
}

const initialFormData: FormData = {
  families: '',
  persons: '',
  barangays: '',
  dead: '',
  injured_ill: '',
  missing: '',
  totally_damaged: '',
  partially_damaged: '',
  cost: '',
  duration_hrs: '',
  max_sustained_wind: '',
  max_24hr_rainfall: '',
  total_storm_rainfall: '',
  min_pressure: '',
  region: '2',
}

// Auto-classify typhoon type based on max sustained wind
const getTyphoonType = (maxSustainedWind: number): { type: number; label: string } => {
  if (maxSustainedWind > 184) {
    return { type: 4, label: 'STY - Super Typhoon' }
  } else if (maxSustainedWind >= 118) {
    return { type: 3, label: 'TY - Typhoon' }
  } else if (maxSustainedWind >= 89) {
    return { type: 2, label: 'STS - Severe Tropical Storm' }
  } else if (maxSustainedWind >= 62) {
    return { type: 0, label: 'TS - Tropical Storm' }
  } else {
    return { type: 1, label: 'TD - Tropical Depression' }
  }
}

// Map cluster to level: cluster 0 → Level 3 (High), cluster 1 → Level 2 (Moderate), cluster 2 → Level 1 (Low)
const getDisplayLevel = (cluster: number): number => {
  switch (cluster) {
    case 0: return 3 // High Impact
    case 1: return 2 // Moderate Impact
    case 2: return 1 // Low Impact
    default: return 1
  }
}

const getSeverityLabel = (level: number): string => {
  switch (level) {
    case 3: return 'High-Impact'
    case 2: return 'Moderate-Impact'
    case 1: return 'Low-Impact'
    default: return 'Unknown'
  }
}

const regions = [
  { value: '2', label: 'Region 2' },
  { value: '3', label: 'Region 3' },
  { value: '5', label: 'Region 5' },
  { value: '8', label: 'Region 8' },
]

export default function ClusterPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [result, setResult] = useState<ClusteringResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-detect typhoon type based on max sustained wind
  const typhoonClassification = useMemo(() => {
    const wind = parseFloat(formData.max_sustained_wind) || 0
    return getTyphoonType(wind)
  }, [formData.max_sustained_wind])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const payload = {
        families: parseFloat(formData.families) || 0,
        persons: parseFloat(formData.persons) || 0,
        barangays: parseFloat(formData.barangays) || 0,
        dead: parseFloat(formData.dead) || 0,
        injured_ill: parseFloat(formData.injured_ill) || 0,
        missing: parseFloat(formData.missing) || 0,
        totally_damaged: parseFloat(formData.totally_damaged) || 0,
        partially_damaged: parseFloat(formData.partially_damaged) || 0,
        cost: parseFloat(formData.cost) || 0,
        duration_hrs: parseFloat(formData.duration_hrs) || 0,
        max_sustained_wind: parseFloat(formData.max_sustained_wind) || 0,
        typhoon_type: typhoonClassification.type,
        max_24hr_rainfall: parseFloat(formData.max_24hr_rainfall) || 0,
        total_storm_rainfall: parseFloat(formData.total_storm_rainfall) || 0,
        min_pressure: parseFloat(formData.min_pressure) || 0,
        region: parseInt(formData.region),
      }

      const response = await fetch('http://127.0.0.1:8000/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get clustering result')
      }

      const data = await response.json()
      
      // Map the cluster to the correct display level
      const displayLevel = getDisplayLevel(data.cluster)
      const mappedResult: ClusteringResult = {
        ...data,
        level: displayLevel,
        severity_label: getSeverityLabel(displayLevel),
      }
      
      setResult(mappedResult)
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
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 3: return 'bg-red-500'
      case 2: return 'bg-yellow-500'
      case 1: return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelBgColor = (level: number) => {
    switch (level) {
      case 3: return 'bg-red-50 border-red-200'
      case 2: return 'bg-yellow-50 border-yellow-200'
      case 1: return 'bg-green-50 border-green-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Clustering Level Prediction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter typhoon impact data to classify the event into Level 1, 2, or 3
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Input Features</h2>
              
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Impact Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Families Affected</label>
                    <input type="number" name="families" value={formData.families} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Persons Affected</label>
                    <input type="number" name="persons" value={formData.persons} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangays Affected</label>
                    <input type="number" name="barangays" value={formData.barangays} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Casualty Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dead</label>
                    <input type="number" name="dead" value={formData.dead} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Injured/Ill</label>
                    <input type="number" name="injured_ill" value={formData.injured_ill} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Missing</label>
                    <input type="number" name="missing" value={formData.missing} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Damage Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Totally Damaged Houses</label>
                    <input type="number" name="totally_damaged" value={formData.totally_damaged} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partially Damaged Houses</label>
                    <input type="number" name="partially_damaged" value={formData.partially_damaged} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost (PHP)</label>
                    <input type="number" name="cost" value={formData.cost} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Weather Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hrs)</label>
                    <input type="number" name="duration_hrs" value={formData.duration_hrs} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Sustained Wind (kph)</label>
                    <input type="number" name="max_sustained_wind" value={formData.max_sustained_wind} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Typhoon Classification</label>
                    <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                      {typhoonClassification.label}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max 24hr Rainfall (mm)</label>
                    <input type="number" name="max_24hr_rainfall" value={formData.max_24hr_rainfall} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Storm Rainfall (mm)</label>
                    <input type="number" name="total_storm_rainfall" value={formData.total_storm_rainfall} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Pressure (hPa)</label>
                    <input type="number" name="min_pressure" value={formData.min_pressure} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region Affected</label>
                    <select name="region" value={formData.region} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>{region.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                  {loading ? 'Processing...' : 'Predict Cluster Level'}
                </button>
                <button type="button" onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">
                  Reset
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Clustering Result</h2>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {result ? (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl border-2 ${getLevelBgColor(result.level)}`}>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getLevelColor(result.level)} text-white text-3xl font-bold mb-4`}>
                        {result.level}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{result.severity_label}</h3>
                      <p className="text-sm text-gray-600 mt-2">Cluster {result.cluster}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Description</h4>
                    <p className="text-gray-700 text-sm">{result.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Severity Score</h4>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div className={`h-3 rounded-full ${getLevelColor(result.level)}`}
                          style={{ width: `${Math.min(result.severity_score / 100, 100)}%` }}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">{result.severity_score.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Enter data and click Predict to see results</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mt-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-3">MAACLI Framework</h3>
              <p className="text-blue-800 text-sm mb-4">Clustering interpretability levels:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span>Level 3: High-Impact</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span>Level 2: Moderate-Impact</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span>Level 1: Low-Impact</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mt-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Typhoon Classification</h3>
              <p className="text-gray-600 text-sm mb-4">Auto-detected based on max sustained wind:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div>TD - Tropical Depression: ≤61 km/h</div>
                <div>TS - Tropical Storm: 62-88 km/h</div>
                <div>STS - Severe Tropical Storm: 89-117 km/h</div>
                <div>TY - Typhoon: 118-184 km/h</div>
                <div>STY - Super Typhoon: &gt;184 km/h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}