"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import * as XLSX from "xlsx";

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

interface BulkDataRow {
  families: number;
  persons: number;
  barangays: number;
  dead: number;
  injured_ill: number;
  missing: number;
  totally_damaged: number;
  partially_damaged: number;
  cost: number;
  duration_hrs: number;
  max_sustained_wind: number;
  max_24hr_rainfall: number;
  total_storm_rainfall: number;
  min_pressure: number;
  region: number;
  impact_level?: string;
  cluster?: number;
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

  // Bulk prediction states
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkData, setBulkData] = useState<BulkDataRow[]>([]);
  const [bulkResults, setBulkResults] = useState<BulkDataRow[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");

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

    // Duration validation: must be > 0
    const duration = parseFloat(data.duration_hrs);
    if (!data.duration_hrs || isNaN(duration) || duration <= 0) {
      errors.duration_hrs = "Duration is required and must be greater than 0 hours";
    } else if (duration > 720) {
      // 30 days
      errors.duration_hrs =
        "Duration exceeds typical typhoon lifespan (30 days)";
    }

    // Pressure validation: must be > 0
    const pressure = parseFloat(data.min_pressure);
    if (!data.min_pressure || isNaN(pressure) || pressure <= 0) {
      errors.min_pressure = "Min Pressure is required and must be greater than 0 hPa";
    } else if (pressure < 870 || pressure > 1100) {
      errors.min_pressure =
        "Pressure must be between 870-1100 hPa (typical typhoon range)";
    }

    // Rainfall validation: must be > 0
    const rainfall24 = parseFloat(data.max_24hr_rainfall);
    if (!data.max_24hr_rainfall || isNaN(rainfall24) || rainfall24 <= 0) {
      errors.max_24hr_rainfall = "Max 24hr Rainfall is required and must be greater than 0 mm";
    } else if (rainfall24 > 2000) {
      errors.max_24hr_rainfall =
        "Daily rainfall exceeds world record (1,825mm)";
    }

    const rainfallTotal = parseFloat(data.total_storm_rainfall);
    if (!data.total_storm_rainfall || isNaN(rainfallTotal) || rainfallTotal <= 0) {
      errors.total_storm_rainfall = "Total Storm Rainfall is required and must be greater than 0 mm";
    } else if (rainfallTotal > 5000) {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet) as any[];

        // Map the Excel columns to our expected format
        const mappedData: BulkDataRow[] = jsonData.map((row) => ({
          families: Number(row.families || row.Families || 0),
          persons: Number(row.persons || row.Persons || 0),
          barangays: Number(row.barangays || row.Barangays || row.barangays_affected || 0),
          dead: Number(row.dead || row.Dead || 0),
          injured_ill: Number(row.injured_ill || row["Injured/Ill"] || row.injured || 0),
          missing: Number(row.missing || row.Missing || 0),
          totally_damaged: Number(row.totally_damaged || row["Totally Damaged"] || 0),
          partially_damaged: Number(row.partially_damaged || row["Partially Damaged"] || 0),
          cost: Number(row.cost || row.Cost || 0),
          duration_hrs: Number(row.duration_hrs || row["Duration (hrs)"] || row.duration || 0),
          max_sustained_wind: Number(row.max_sustained_wind || row["Max Wind"] || row.wind || 0),
          max_24hr_rainfall: Number(row.max_24hr_rainfall || row["24hr Rainfall"] || row.rainfall_24 || 0),
          total_storm_rainfall: Number(row.total_storm_rainfall || row["Total Rainfall"] || row.total_rainfall || 0),
          min_pressure: Number(row.min_pressure || row["Min Pressure"] || row.pressure || 0),
          region: Number(row.region || row.Region || 2),
        }));

        setBulkData(mappedData);
        setBulkResults([]);
        setBulkError("");
      } catch (err) {
        setBulkError("Failed to parse Excel file. Please check the format.");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkPredict = async () => {
    if (bulkData.length === 0) {
      setBulkError("Please upload a file first");
      return;
    }

    setBulkLoading(true);
    setBulkError("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://clustering-for-post-tropical-cyclone.onrender.com";

      const results: BulkDataRow[] = [];

      for (const row of bulkData) {
        const typhoonType = getTyphoonType(row.max_sustained_wind);
        
        const payload = {
          families: row.families,
          persons: row.persons,
          barangays: row.barangays,
          dead: row.dead,
          injured_ill: row.injured_ill,
          missing: row.missing,
          totally_damaged: row.totally_damaged,
          partially_damaged: row.partially_damaged,
          cost: row.cost,
          duration_hrs: row.duration_hrs,
          max_sustained_wind: row.max_sustained_wind,
          typhoon_type: typhoonType.type,
          max_24hr_rainfall: row.max_24hr_rainfall,
          total_storm_rainfall: row.total_storm_rainfall,
          min_pressure: row.min_pressure,
          region: row.region,
        };

        const response = await fetch(`${apiUrl}/cluster`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            ...row,
            cluster: data.cluster,
            impact_level: getClusterLabel(data.cluster),
          });
        } else {
          results.push({
            ...row,
            cluster: -1,
            impact_level: "Error",
          });
        }
      }

      setBulkResults(results);
    } catch (err) {
      setBulkError(
        err instanceof Error ? err.message : "Failed to process bulk predictions"
      );
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportResults = () => {
    if (bulkResults.length === 0) {
      setBulkError("No results to export");
      return;
    }

    const exportData = bulkResults.map((row) => ({
      Families: row.families,
      Persons: row.persons,
      Barangays: row.barangays,
      Dead: row.dead,
      "Injured/Ill": row.injured_ill,
      Missing: row.missing,
      "Totally Damaged": row.totally_damaged,
      "Partially Damaged": row.partially_damaged,
      "Cost (PHP)": row.cost,
      "Duration (hrs)": row.duration_hrs,
      "Max Sustained Wind (kph)": row.max_sustained_wind,
      "Max 24hr Rainfall (mm)": row.max_24hr_rainfall,
      "Total Storm Rainfall (mm)": row.total_storm_rainfall,
      "Min Pressure (hPa)": row.min_pressure,
      Region: row.region,
      Cluster: row.cluster,
      "Impact Level": row.impact_level,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Predictions");
    XLSX.writeFile(workbook, `cluster_predictions_${Date.now()}.xlsx`);
  };

  const clearBulkData = () => {
    setBulkData([]);
    setBulkResults([]);
    setBulkError("");
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
          
          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => {
                setBulkMode(false);
                clearBulkData();
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                !bulkMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Single Prediction
            </button>
            <button
              onClick={() => {
                setBulkMode(true);
                setResult(null);
                setError("");
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                bulkMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Bulk Prediction
            </button>
          </div>
        </div>

        {!bulkMode ? (
          // Existing Single Prediction Form
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
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {getClusterLabel(result.cluster)}
                        </h3>
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
                    Severity Levels
                  </h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Clustering analysis using interpretable patterns:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span>High Impact</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                      <span>Moderate Impact</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Low Impact</span>
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
        ) : (
          // Bulk Prediction Interface
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Bulk Prediction
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload Excel/CSV file
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Supports .xlsx, .xls, .csv
                    </span>
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Expected Columns:
                  </h4>
                  <p className="text-xs text-blue-800">
                    families, persons, barangays, dead, injured_ill, missing, 
                    totally_damaged, partially_damaged, cost, duration_hrs, 
                    max_sustained_wind, max_24hr_rainfall, total_storm_rainfall, 
                    min_pressure, region
                  </p>
                </div>

                {bulkData.length > 0 && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleBulkPredict}
                      disabled={bulkLoading}
                      className={`flex-1 px-6 py-3 font-semibold rounded-lg ${
                        bulkLoading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {bulkLoading ? "Processing..." : `Predict ${bulkData.length} Rows`}
                    </button>
                    {bulkResults.length > 0 && (
                      <button
                        onClick={handleExportResults}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                      >
                        Export Results
                      </button>
                    )}
                    <button
                      onClick={clearBulkData}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {bulkError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{bulkError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Data Preview */}
            {bulkData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Data Preview ({bulkData.length} rows)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Families</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Persons</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Barangays</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dead</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Wind (kph)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                        {bulkResults.length > 0 && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Impact Level</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(bulkResults.length > 0 ? bulkResults : bulkData).slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{row.families}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.persons}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.barangays}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.dead}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.max_sustained_wind}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{row.region}</td>
                          {bulkResults.length > 0 && (
                            <td className="px-3 py-2 text-sm">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  row.cluster === 0
                                    ? "bg-green-100 text-green-800"
                                    : row.cluster === 1
                                    ? "bg-red-100 text-red-800"
                                    : row.cluster === 2
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {row.impact_level}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bulkData.length > 10 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Showing 10 of {bulkData.length} rows
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
