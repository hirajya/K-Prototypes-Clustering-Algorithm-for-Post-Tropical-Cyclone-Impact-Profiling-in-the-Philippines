'use client'

import { useState, useMemo } from 'react'

interface ForecastResult {
  families: number
  persons: number
  barangays: number
  dead: number
  injured_ill: number
  missing: number
  cost: number
  partially_damaged: number
  totally_damaged: number
  message: string
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
      const payload = {
        max_sustained_wind: parseFloat(formData.max_sustained_wind) || 0,
        typhoon_type: typhoonClassification.type,
        max_24hr_rainfall: parseFloat(formData.max_24hr_rainfall) || 0,
        total_storm_rainfall: parseFloat(formData.total_storm_rainfall) || 0,
        min_pressure: parseFloat(formData.min_pressure) || 0,
        duration: parseFloat(formData.duration) || 0,
      }

      const response = await fetch('https://clustering-for-post-tropical-cyclone.onrender.com/forecast', {
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

  const isModelNotReady = result?.message?.includes('not yet available')

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Future Prediction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predict damage severity and impact metrics based on weather features
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800">Feature Coming Soon</h3>
              <p className="text-yellow-700 mt-1">
                The prediction model is currently under development. The form below is ready for when the model is deployed.
              </p>
            </div>
          </div>
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
                  />
                </div>

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
                  className="flex-1 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:bg-cyan-300"
                >
                  {loading ? 'Processing...' : 'Predict Damage'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Typhoon Classification Info */}
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
                isModelNotReady ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Model Not Ready</h3>
                    <p className="text-gray-600">{result.message}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 border-b pb-2">Predicted Output Targets</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Families</p>
                        <p className="text-xl font-bold text-gray-900">{result.families.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Persons</p>
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
                        <p className="text-sm text-orange-600">Injured/Ill</p>
                        <p className="text-xl font-bold text-orange-700">{result.injured_ill.toLocaleString()}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600">Missing</p>
                        <p className="text-xl font-bold text-yellow-700">{result.missing.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Partially Damaged</p>
                        <p className="text-xl font-bold text-gray-900">{result.partially_damaged.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Totally Damaged</p>
                        <p className="text-xl font-bold text-gray-900">{result.totally_damaged.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <p className="text-sm text-blue-600">Estimated Cost (PHP)</p>
                      <p className="text-2xl font-bold text-blue-700">₱{result.cost.toLocaleString()}</p>
                    </div>
                  </div>
                )
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
              <h3 className="font-semibold text-cyan-900 mb-3">Output Targets</h3>
              <p className="text-cyan-800 text-sm mb-4">
                The prediction model estimates the following metrics:
              </p>
              <ul className="text-sm text-cyan-700 space-y-1">
                <li>• Families affected</li>
                <li>• Persons affected</li>
                <li>• Barangays affected</li>
                <li>• Casualties (Dead, Injured/Ill, Missing)</li>
                <li>• Property damage (Partially/Totally damaged)</li>
                <li>• Cost estimate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}