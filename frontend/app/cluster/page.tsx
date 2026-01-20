"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface ClusteringResult {
  cluster: number;
  description: string;
}

interface FormData {
  families: string;
  persons: string;
  barangays: string;
  dead: string;
  injured_ill: string;
  missing: string;
  totally_damaged: string;
  partially_damaged: string;
  cost: string;
  duration_hrs: string;
  max_sustained_wind: string;
  max_24hr_rainfall: string;
  total_storm_rainfall: string;
  min_pressure: string;
  region: string;
}

const initialFormData: FormData = {
  families: "",
  persons: "",
  barangays: "",
  dead: "",
  injured_ill: "",
  missing: "",
  totally_damaged: "",
  partially_damaged: "",
  cost: "",
  duration_hrs: "",
  max_sustained_wind: "",
  max_24hr_rainfall: "",
  total_storm_rainfall: "",
  min_pressure: "",
  region: "2",
};

// Auto-classify typhoon type based on max sustained wind
const getTyphoonType = (
  maxSustainedWind: number
): { type: number; label: string } => {
  if (maxSustainedWind > 184) {
    return { type: 4, label: "STY - Super Typhoon" };
  } else if (maxSustainedWind >= 118) {
    return { type: 3, label: "TY - Typhoon" };
  } else if (maxSustainedWind >= 89) {
    return { type: 2, label: "STS - Severe Tropical Storm" };
  } else if (maxSustainedWind >= 62) {
    return { type: 0, label: "TS - Tropical Storm" };
  } else {
    return { type: 1, label: "TD - Tropical Depression" };
  }
};

const regions = [
  { value: "2", label: "Region 2" },
  { value: "3", label: "Region 3" },
  { value: "5", label: "Region 5" },
  { value: "8", label: "Region 8" },
];

export default function ClusterPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<ClusteringResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Auto-detect typhoon type based on max sustained wind
  const typhoonClassification = useMemo(() => {
    const wind = parseFloat(formData.max_sustained_wind) || 0;
    return getTyphoonType(wind);
  }, [formData.max_sustained_wind]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Re-validate form in real-time
    validateFormData(updatedFormData);
  };

  const validateFormData = (data: FormData): boolean => {
    const errors: Record<string, string> = {};

    // Check all required fields are filled
    const requiredFields = [
      { key: "families", label: "Families Affected" },
      { key: "persons", label: "Persons Affected" },
      { key: "barangays", label: "Barangays Affected" },
      { key: "dead", label: "Dead" },
      { key: "injured_ill", label: "Injured/Ill" },
      { key: "missing", label: "Missing" },
      { key: "totally_damaged", label: "Totally Damaged Houses" },
      { key: "partially_damaged", label: "Partially Damaged Houses" },
      { key: "cost", label: "Cost (PHP)" },
      { key: "duration_hrs", label: "Duration (hrs)" },
      { key: "max_sustained_wind", label: "Max Sustained Wind (kph)" },
      { key: "max_24hr_rainfall", label: "Max 24hr Rainfall (mm)" },
      { key: "total_storm_rainfall", label: "Total Storm Rainfall (mm)" },
      { key: "min_pressure", label: "Min Pressure (hPa)" },
    ];

    requiredFields.forEach((field) => {
      const value = data[field.key as keyof FormData];
      if (!value || value === "" || parseFloat(value) < 0) {
        errors[field.key] = `${field.label} is required`;
      }
    });

    // Wind speed validation: must be provided and > 0, with domain bounds
    const wind = parseFloat(data.max_sustained_wind);
    if (!data.max_sustained_wind || isNaN(wind) || wind <= 0) {
      errors.max_sustained_wind =
        "Max Sustained Wind is required and must be greater than 0 km/h";
    } else {
      if (wind > 500) {
        errors.max_sustained_wind =
          "Wind speed seems unrealistic (max recorded: ~500 km/h)";
      }
    }

    // Pressure validation
    const pressure = parseFloat(data.min_pressure);
    if (data.min_pressure && pressure > 0) {
      if (pressure < 870 || pressure > 1100) {
        errors.min_pressure =
          "Pressure must be between 870-1013 hPa (typical typhoon range)";
      }
    }

    // Rainfall validation
    const rainfall24 = parseFloat(data.max_24hr_rainfall);
    if (rainfall24 > 2000) {
      errors.max_24hr_rainfall =
        "Daily rainfall exceeds world record (1,825mm)";
    }

    const rainfallTotal = parseFloat(data.total_storm_rainfall);
    if (rainfallTotal > 5000) {
      errors.total_storm_rainfall = "Total rainfall seems unrealistic";
    }

    // Total storm rainfall should not be less than maximum 24-hour rainfall
    if (
      !isNaN(rainfall24) &&
      !isNaN(rainfallTotal) &&
      rainfall24 > 0 &&
      rainfallTotal > 0 &&
      rainfallTotal < rainfall24
    ) {
      errors.total_storm_rainfall =
        "Total Storm Rainfall cannot be less than Max 24hr Rainfall";
    }

    // Casualty validation (casualties should not exceed persons affected)
    const persons = parseFloat(data.persons) || 0;
    const dead = parseFloat(data.dead) || 0;
    const injured = parseFloat(data.injured_ill) || 0;
    const missing = parseFloat(data.missing) || 0;

    if (dead + injured + missing > persons && persons > 0) {
      errors.persons = "Total casualties cannot exceed persons affected";
    }

    // Duration validation
    const duration = parseFloat(data.duration_hrs);
    if (duration > 720) {
      // 30 days
      errors.duration_hrs =
        "Duration exceeds typical typhoon lifespan (30 days)";
    }

    // Houses validation
    const totallyDamaged = parseFloat(data.totally_damaged) || 0;
    const partiallyDamaged = parseFloat(data.partially_damaged) || 0;
    const families = parseFloat(data.families) || 0;

    if (totallyDamaged + partiallyDamaged > families * 2 && families > 0) {
      errors.totally_damaged =
        "Damaged houses seem disproportionate to families affected";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = (): boolean => {
    return validateFormData(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      setError("Please fix input before submitting");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

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
        max_sustained_wind: parseFloat(formData.max_sustained_wind),
        typhoon_type: typhoonClassification.type,
        max_24hr_rainfall: parseFloat(formData.max_24hr_rainfall) || 0,
        total_storm_rainfall: parseFloat(formData.total_storm_rainfall) || 0,
        min_pressure: parseFloat(formData.min_pressure) || 0,
        region: parseInt(formData.region),
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://clustering-for-post-tropical-cyclone.onrender.com";
      const response = await fetch(`${apiUrl}/cluster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to get clustering result");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setError("");
    setValidationErrors({});
  };

  const getClusterColor = (cluster: number) => {
    switch (cluster) {
      case 0:
        return "bg-green-500"; // Low Impact
      case 1:
        return "bg-red-500"; // High Impact
      case 2:
        return "bg-orange-500"; // Moderate Impact
      default:
        return "bg-gray-500";
    }
  };

  const getClusterBgColor = (cluster: number) => {
    switch (cluster) {
      case 0:
        return "bg-green-50 border-green-200"; // Low Impact
      case 1:
        return "bg-red-50 border-red-200"; // High Impact
      case 2:
        return "bg-orange-50 border-orange-200"; // Moderate Impact
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getClusterLabel = (cluster: number) => {
    switch (cluster) {
      case 0:
        return "Low Impact";
      case 1:
        return "High Impact";
      case 2:
        return "Moderate Impact";
      default:
        return "Unknown";
    }
  };

  const getClusterLevelNumber = (cluster: number) => {
    switch (cluster) {
      case 0:
        return "1";
      case 1:
        return "3";
      case 2:
        return "2";
      default:
        return "?";
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Impact Profiling
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter tropical cyclone impact data to identify the municipality
            impact profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Input Features
              </h2>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Impact Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Families Affected
                    </label>
                    <input
                      type="number"
                      name="families"
                      value={formData.families}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.families
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Persons Affected
                    </label>
                    <input
                      type="number"
                      name="persons"
                      value={formData.persons}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.persons
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Barangays Affected
                    </label>
                    <input
                      type="number"
                      name="barangays"
                      value={formData.barangays}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.barangays
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Casualty Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Fatalities
                    </label>
                    <input
                      type="number"
                      name="dead"
                      value={formData.dead}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.dead
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Injured/Ill
                    </label>
                    <input
                      type="number"
                      name="injured_ill"
                      value={formData.injured_ill}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.injured_ill
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Missing
                    </label>
                    <input
                      type="number"
                      name="missing"
                      value={formData.missing}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.missing
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Damage Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Totally Damaged Houses
                    </label>
                    <input
                      type="number"
                      name="totally_damaged"
                      value={formData.totally_damaged}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.totally_damaged
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Partially Damaged Houses
                    </label>
                    <input
                      type="number"
                      name="partially_damaged"
                      value={formData.partially_damaged}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.partially_damaged
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Relief Total
                      <br />
                      Cost (PHP)
                    </label>{" "}
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.cost
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Weather Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Duration (hrs)
                    </label>
                    <input
                      type="number"
                      name="duration_hrs"
                      value={formData.duration_hrs}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.duration_hrs
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Sustained Wind (kph)
                    </label>
                    <input
                      type="number"
                      name="max_sustained_wind"
                      value={formData.max_sustained_wind}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.max_sustained_wind
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter wind speed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      TC Classification
                    </label>
                    <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                      {typhoonClassification.label}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max 24hr Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      name="max_24hr_rainfall"
                      value={formData.max_24hr_rainfall}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.max_24hr_rainfall
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Total Storm Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      name="total_storm_rainfall"
                      value={formData.total_storm_rainfall}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.total_storm_rainfall
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Min Pressure (hPa)
                    </label>
                    <input
                      type="number"
                      name="min_pressure"
                      value={formData.min_pressure}
                      onChange={handleInputChange}
                      min="870"
                      max="1013"
                      step="0.1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.min_pressure
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="870-1100"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Region Affected
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {regions.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {Object.keys(validationErrors).length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-semibold">
                    Please fix errors before submitting:
                  </p>
                  <ul className="list-disc list-inside text-red-600 text-sm mt-2">
                    {Object.values(validationErrors).map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || Object.keys(validationErrors).length > 0}
                  className={`flex-1 px-6 py-3 font-semibold rounded-lg ${
                    loading || Object.keys(validationErrors).length > 0
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Processing..." : "Show Impact Profile"}
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

            {/* Result Display - Moved below form */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Impact Profiling Result
                </h2>
                <p className="text-sm text-gray-600 mb-6">Municipality Level</p>
                <div className="space-y-6">
                  <div
                    className={`p-6 rounded-xl border-2 ${getClusterBgColor(
                      result.cluster
                    )}`}
                  >
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getClusterColor(
                          result.cluster
                        )} text-white text-3xl font-bold mb-4`}
                      >
                        {getClusterLevelNumber(result.cluster)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {result.cluster === 0
                          ? "Level 1"
                          : result.cluster === 1
                          ? "Level 3"
                          : "Level 2"}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {getClusterLabel(result.cluster)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">
                      Description
                    </h4>
                    <div className="space-y-4">
                      <ReactMarkdown
                        components={{
                          h3: ({ children }) => (
                            <h3 className="text-sm font-bold text-gray-900 mt-4 mb-2 first:mt-0 border-t border-gray-200 pt-3 first:border-t-0 first:pt-0">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {result.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-3">
                  MAACLI Framework
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  Clustering analysis using interpretable patterns:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Level 3 - High Impact</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                    <span>Level 2 - Moderate Impact</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Level 1 - Low Impact</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  (TC) Tropical Cyclone Classification
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Auto-detected based on max sustained wind:
                </p>
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
    </div>
  );
}
