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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Auto-detect typhoon type based on max sustained wind
  const typhoonClassification = useMemo(() => {
    const wind = parseFloat(formData.max_sustained_wind) || 0
    return getTyphoonType(wind)
  }, [formData.max_sustained_wind])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedFormData = { ...formData, [name]: value }
    setFormData(updatedFormData)
    
    // Re-validate form in real-time
    validateFormData(updatedFormData)
  }

  const validateFormData = (data: FormData): boolean => {
    const errors: Record<string, string> = {}
    
    // Max Sustained Wind validation
    const wind = parseFloat(data.max_sustained_wind)
    if (!data.max_sustained_wind || isNaN(wind) || wind <= 0) {
      errors.max_sustained_wind = 'Wind speed is required and must be greater than 0'
    } else if (wind < 60) {
      errors.max_sustained_wind = 'Wind speed must be at least 60 kph'
    } else if (wind > 500) {
      errors.max_sustained_wind = 'Wind speed must not exceed 500 kph'
    }

    // Max 24hr Rainfall validation
    const rainfall24 = parseFloat(data.max_24hr_rainfall)
    if (!data.max_24hr_rainfall || isNaN(rainfall24) || rainfall24 < 0) {
      errors.max_24hr_rainfall = 'Max 24hr rainfall is required and cannot be negative'
    }

    // Total Storm Rainfall validation
    const rainfallTotal = parseFloat(data.total_storm_rainfall)
    if (!data.total_storm_rainfall || isNaN(rainfallTotal) || rainfallTotal < 0) {
      errors.total_storm_rainfall = 'Total storm rainfall is required and cannot be negative'
    }

    // Check that max 24hr rainfall is less than total rainfall
    if (!isNaN(rainfall24) && !isNaN(rainfallTotal) && rainfall24 >= 0 && rainfallTotal >= 0) {
      if (rainfall24 > rainfallTotal) {
        errors.max_24hr_rainfall = 'Max 24hr rainfall must be less than or equal to total rainfall'
      }
    }

    // Min Pressure validation
    const pressure = parseFloat(data.min_pressure)
    if (!data.min_pressure || isNaN(pressure) || pressure <= 0) {
      errors.min_pressure = 'Pressure is required and must be greater than 0'
    } else if (pressure < 870) {
      errors.min_pressure = 'Pressure must be at least 870 hPa'
    } else if (pressure > 1100) {
      errors.min_pressure = 'Pressure must not exceed 1100 hPa'
    }

    // Duration validation
    const duration = parseFloat(data.duration)
    if (data.duration && (!isNaN(duration) && duration < 0)) {
      errors.duration = 'Duration cannot be negative'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate before submitting
    if (!validateFormData(formData)) {
      setError('Please fix validation errors before submitting')
      return
    }
    
    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Prepare Payload matching ForecastInput in FastAPI
      const payload = {
        max_sustained_wind: parseFloat(formData.max_sustained_wind) || 0,
        max_24hr_rainfall: parseFloat(formData.max_24hr_rainfall) || 0,
        total_storm_rainfall: parseFloat(formData.total_storm_rainfall) || 0,
        min_pressure: parseFloat(formData.min_pressure) || 0,
        duration: parseFloat(formData.duration) || 0,
        typhoon_type: typhoonClassification.type, 
      }

      // Use the correct prediction endpoint
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
                    min="60"
                    max="500"
                    step="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      validationErrors.max_sustained_wind ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.max_sustained_wind && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.max_sustained_wind}</p>
                  )}
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
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      validationErrors.max_24hr_rainfall ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.max_24hr_rainfall && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.max_24hr_rainfall}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Storm Rainfall (mm)</label>
                  <input
                    type="number"
                    name="total_storm_rainfall"
                    value={formData.total_storm_rainfall}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      validationErrors.total_storm_rainfall ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.total_storm_rainfall && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.total_storm_rainfall}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Pressure (hPa)</label>
                  <input
                    type="number"
                    name="min_pressure"
                    value={formData.min_pressure}
                    onChange={handleInputChange}
                    min="870"
                    max="1100"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      validationErrors.min_pressure ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.min_pressure && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.min_pressure}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      validationErrors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.duration && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.duration}</p>
                  )}
                </div>
              </div>

              {Object.keys(validationErrors).length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-semibold">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-red-600 text-sm mt-2">
                    {Object.values(validationErrors).map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading || Object.keys(validationErrors).length > 0}
                  className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
                    loading || Object.keys(validationErrors).length > 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  }`}
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Prediction Results</h2>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-700 text-sm font-medium">⚠ Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {result ? (
                <div className="space-y-6">
                  {/* Display prediction results */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 text-sm">Estimated Impact Breakdown:</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
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
                  <p className="text-gray-500 text-sm">Enter weather data and click &quot;Predict Damage&quot; to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}