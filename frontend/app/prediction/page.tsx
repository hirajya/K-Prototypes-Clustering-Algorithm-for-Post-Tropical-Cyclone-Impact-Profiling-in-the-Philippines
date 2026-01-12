'use client'

import { useState, useMemo } from 'react'

// Updated to match the FastAPI ForecastResponse model exactly
interface ForecastResult {
  families: number
  persons: number
  barangays: number
  dead: number
  injured: number // Backend returns 'injured', not 'injured_ill'
  missing: number
  partially_damaged: number
  totally_damaged: number
  // cost and message removed as they are not in the current prediction backend
}

interface FormData {
  max_sustained_wind: string
  max_24hr_rainfall: string
  total_storm_rainfall: string
  min_pressure: string
  duration: string
}

const initialFormData: FormData = {
  max_sustained_wind: '',
  max_24hr_rainfall: '',
  total_storm_rainfall: '',
  min_pressure: '',
  duration: '',
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

export default function PredictionPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [result, setResult] = useState<ForecastResult | null>(null)
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
      // 1. Prepare Payload matching ForecastInput in FastAPI
      const payload = {
        max_sustained_wind: parseFloat(formData.max_sustained_wind) || 0,
        max_24hr_rainfall: parseFloat(formData.max_24hr_rainfall) || 0,
        total_storm_rainfall: parseFloat(formData.total_storm_rainfall) || 0,
        min_pressure: parseFloat(formData.min_pressure) || 0,
        // Note: duration and typhoon_type are sent but might be ignored 
        // if your backend Pydantic model doesn't include them.
        duration: parseFloat(formData.duration) || 0,
        typhoon_type: typhoonClassification.type, 
      }

      // 2. Fetch from the /predict endpoint
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
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
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Future Prediction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predict damage severity and impact metrics based on weather features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Input Weather Features</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Sustained Wind (kph)</label>
                  <input
                    type="number"
                    name="max_sustained_wind"
                    value={formData.max_sustained_wind}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Typhoon Classification</label>
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                    {typhoonClassification.label}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Auto-detected based on max sustained wind</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max 24hr Rainfall (mm)</label>
                  <input
                    type="number"
                    name="max_24hr_rainfall"
                    value={formData.max_24hr_rainfall}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Storm Rainfall (mm)</label>
                  <input
                    type="number"
                    name="total_storm_rainfall"
                    value={formData.total_storm_rainfall}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 350"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Pressure (hPa)</label>
                  <input
                    type="number"
                    name="min_pressure"
                    value={formData.min_pressure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 950"
                    required
                  />
                </div>

                {/* Duration kept in form, but backend might ignore it if not in training features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 48"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:bg-cyan-300 transition-colors"
                >
                  {loading ? 'Processing...' : 'Predict Damage'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Prediction Results</h2>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {result ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Estimated Impact</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Families Affected</p>
                      <p className="text-xl font-bold text-gray-900">{result.families.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Persons Affected</p>
                      <p className="text-xl font-bold text-gray-900">{result.persons.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Barangays</p>
                      <p className="text-xl font-bold text-gray-900">{result.barangays.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600">Dead</p>
                      <p className="text-xl font-bold text-red-700">{result.dead.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600">Injured</p>
                      <p className="text-xl font-bold text-orange-700">{result.injured.toLocaleString()}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600">Missing</p>
                      <p className="text-xl font-bold text-yellow-700">{result.missing.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Partially Damaged</p>
                      <p className="text-xl font-bold text-blue-900">{result.partially_damaged.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Totally Damaged</p>
                      <p className="text-xl font-bold text-blue-900">{result.totally_damaged.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Enter weather data and click &quot;Predict Damage&quot; to see results</p>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-cyan-50 rounded-2xl p-6 mt-6 border border-cyan-100">
              <h3 className="font-semibold text-cyan-900 mb-3">Model Information</h3>
              <p className="text-cyan-800 text-sm mb-4">
                This tool uses machine learning models (Linear Regression & XGBoost) trained on historical typhoon data to forecast potential damages.
              </p>
              <p className="text-xs text-cyan-700">
                Note: Predictions are estimates based on weather inputs and should be used for planning purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}