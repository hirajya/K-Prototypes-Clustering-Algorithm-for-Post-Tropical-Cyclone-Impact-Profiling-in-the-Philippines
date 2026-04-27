from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
import os

app = FastAPI(
    title="Tropical Cyclone Impact Clustering & Prediction API",
    description="API for clustering tropical cyclone impact levels and predicting damage severity",
    version="1.0.0"
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Pydantic Models ====================

class ClusteringInput(BaseModel):
    """Input features for clustering prediction"""
    families: float = Field(..., description="Number of families affected")
    persons: float = Field(..., description="Number of persons affected")
    barangays: float = Field(..., description="Number of barangays affected", alias="barangays_affected")
    dead: float = Field(..., description="Number of deaths")
    injured_ill: float = Field(..., description="Number of injured/ill")
    missing: float = Field(..., description="Number of missing persons")
    totally_damaged: float = Field(..., description="Totally damaged houses")
    partially_damaged: float = Field(..., description="Partially damaged houses")
    cost: float = Field(..., description="Cost of damage in PHP")
    duration_hrs: float = Field(..., description="Duration in hours")
    max_sustained_wind: float = Field(..., description="Maximum sustained wind in kph")
    typhoon_type: int = Field(..., description="Tropical cyclone type (TD=0, TS=1, STS=2, TY=3, STY=4)")
    max_24hr_rainfall: float = Field(..., description="Maximum 24hr rainfall in mm")
    total_storm_rainfall: float = Field(..., description="Total storm rainfall in mm")
    min_pressure: float = Field(..., description="Minimum pressure in hPa")
    region: int = Field(..., description="Region number (1-17)")

    class Config:
        populate_by_name = True


class ClusteringResponse(BaseModel):
    """Response from clustering prediction"""
    cluster: int
    description: str


class ForecastInput(BaseModel):
    """Input features for damage prediction (Future Prediction)"""
    max_sustained_wind: float = Field(..., description="Maximum sustained wind in kph")
    typhoon_type: Optional[int] = Field(None, description="Typhoon type (optional for LR)")
    max_24hr_rainfall: float = Field(..., description="Maximum 24hr rainfall in mm")
    total_storm_rainfall: float = Field(..., description="Total storm rainfall in mm")
    min_pressure: float = Field(..., description="Minimum pressure in hPa")
    duration: float = Field(..., description="Duration in hours")
    region: Optional[int] = Field(None, description="Region number (2, 3, 5, or 8). Leave blank if unknown.")


class ForecastResponse(BaseModel):
    """Response containing predictions + severity from clustering pipeline"""
    families: float
    persons: float
    barangays: float
    dead: float
    injured: float
    missing: float
    totally_damaged: float
    partially_damaged: float
    severity_cluster: int
    severity_label: str
    severity_description: str
    message: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    clustering_model_loaded: bool
    prediction_model_loaded: bool
    version: str


# ==================== Model Loading ====================

prediction_targets = [
    'families', 'person', 'brgy', 'totally', 'partially',
    'dead', 'missing', 'injured'
]

# Global model storage
models = {
    'clustering': {},
    'scaler': None,
    'feature_columns': None,
    'prediction': {}
}


def load_clustering_models():
    """Load clustering models from the models/clustering directory"""
    clustering_dir = os.path.join(os.path.dirname(__file__), '..', 'models', 'clustering')

    try:
        models['clustering'] = joblib.load(os.path.join(clustering_dir, 'clustering_model.joblib'))
        models['scaler'] = joblib.load(os.path.join(clustering_dir, 'scaler.joblib'))
        models['feature_columns'] = joblib.load(os.path.join(clustering_dir, 'feature_columns.joblib'))
        print("✓ Clustering models loaded successfully")
        return True
    except FileNotFoundError as e:
        print(f"⚠ Clustering models not found: {e}")
        print("  Please run the notebook to export the models first.")
        return False
    except Exception as e:
        print(f"⚠ Error loading clustering models: {e}")
        return False


def load_prediction_models():
    """Load all prediction models dynamically"""
    base_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'prediction')
    print(f"DEBUG: Looking for models in: {os.path.abspath(base_path)}")

    loaded_count = 0
    for target in prediction_targets:
        try:
            model    = joblib.load(os.path.join(base_path, f'{target}_model.joblib'))
            scaler   = joblib.load(os.path.join(base_path, f'{target}_scaler.joblib'))
            features = joblib.load(os.path.join(base_path, f'{target}_features.joblib'))

            models['prediction'][target] = {
                'model': model,
                'scaler': scaler,
                'features': features
            }
            loaded_count += 1
        except FileNotFoundError:
            print(f"  ⚠ Missing files for target: {target}")
        except Exception as e:
            print(f"  ⚠ Error loading {target}: {e}")

    print(f"✓ Prediction models loaded: {loaded_count}/{len(prediction_targets)} targets ready")
    return loaded_count > 0


# ==================== Cluster Label Mapping ====================
#
# VERIFIED from notebook (type_clustering_Kmeans_FINAL.ipynb) MAACLI output:
#
#   Cluster 0 → Low Severity     (1043 samples, 58.7%) — Regions 2, 3, 8
#   Cluster 1 → High Severity    (78 samples,   4.4%)  — Regions 2, 3, 5, 8
#   Cluster 2 → Moderate Severity(655 samples,  36.9%) — Region 5 ONLY (100%)
#
# IMPORTANT: Cluster 2 (Moderate) is dominated entirely by Region 5 data.
# When region is unknown (all region flags = 0), the model will almost never
# predict Cluster 2. To get Moderate predictions, region=5 must be passed in.

CLUSTER_LABELS = {
    0: "Low Severity",
    1: "High Severity",
    2: "Moderate Severity"
}

CLUSTER_DESCRIPTIONS = {
    0: "Lower severity events with minimal casualties and limited property damage requiring standard response protocols.",
    1: "Severe events with significant casualties, extensive property damage, and large affected populations requiring immediate response.",
    2: "Moderate severity events with noticeable damage concentrated in specific regions requiring coordinated response."
}

CLUSTER_DESCRIPTIONS_LONG = {
    0: """Lower severity events with minimal casualties and limited property damage requiring standard response protocols.

### Families Affected

Typically **13–612 families**, with around **91 families** affected in most cases.

### Persons Affected

Usually **49–2,285 people**, with a common impact of about **319 persons**.

### Deaths

Most events report **no deaths**, with **very rare cases** reaching up to **3 fatalities**.

### Injured / Ill

Generally **none**, though **isolated incidents** may involve injuries.

### Missing Persons

Typically **no missing persons**, with only **rare single cases** reported.

### Totally Damaged Houses

Most events report **no totally damaged houses**, with **limited damage** in rare cases.

### Partially Damaged Houses

Usually **none**, though **localized impacts** can affect **up to ~3,095 houses**.

### Economic Cost (PHP)

Often **zero or minimal**, but **isolated events** can result in **higher reported losses**.

### Maximum Sustained Wind

Commonly **110–195 kph**, reflecting **weak to moderate typhoon** conditions.

### 24-Hour Rainfall

Typically **56–136 mm**, with extreme rainfall occurring only in rare cases.

### Duration of Impact

Impacts generally last **around 4–5 days**, consistent with short-lived events.""",

    1: """Severe events with significant casualties, extensive property damage, and large affected populations requiring immediate response.

### Families Affected

Typically **5,000–16,000 families**, with around **12,015 families** affected on average.

### Persons Affected

Usually **18,500–64,000 people**, with a typical impact of about **37,000 persons**.

### Deaths

Average of **~2 deaths**, with extreme cases reaching higher fatalities.

### Injured / Ill

Average of **~5 injured**, with severe cases reaching higher numbers.

### Missing Persons

Typically **no missing persons**, with only **isolated cases** reported during extreme events.

### Totally Damaged Houses

Average of **~1,044 totally damaged homes**, with widespread structural damage.

### Partially Damaged Houses

Average of **~3,150 partially damaged houses**, indicating widespread but varying structural damage.

### Economic Cost (PHP)

Typically between **₱1.7 million and ₱5.8 million**, with severe cases exceeding **₱16 million**.

### Maximum Sustained Wind

Most events experience **155–195 kph winds**, consistent with strong typhoon conditions (STY most common at 68%).

### 24-Hour Rainfall

Rainfall commonly ranges from **about 47–149 mm**, with extreme events producing much heavier totals.

### Duration of Impact

Impacts generally last **around 4–5 days**, with prolonged cases extending beyond this period.""",

    2: """Moderate severity events with noticeable damage concentrated in specific regions (primarily Region 5) requiring coordinated response.

### Families Affected

Typically **16–840 families**, with around **648 families** affected on average.

### Persons Affected

Usually **60–3,300 people**, with a common impact of about **930 persons**.

### Deaths

Average of **~0.02 deaths** — most events report no fatalities.

### Injured / Ill

Generally **none**, but injuries can rise to **around a dozen cases** in some events.

### Missing Persons

Typically **no missing persons**, with only **isolated cases** reported.

### Totally Damaged Houses

Average of **~23 totally damaged houses**, though localized damage can reach higher in some events.

### Partially Damaged Houses

Average of **~119 partially damaged houses**, with moderate structural impact.

### Economic Cost (PHP)

Often **minimal or unreported**, but some events incur costs of **up to ₱2 million**.

### Maximum Sustained Wind

Commonly **110–155 kph**, indicating **strong tropical storm to typhoon** conditions (TY most common at 39%).

### 24-Hour Rainfall

Typically **50–117 mm**, with heavier rainfall in more intense cases.

### Duration of Impact

Impacts generally last **around 4–6 days**, with prolonged events extending longer."""
}


# ==================== Pipeline Helpers ====================

def get_weather_features(input_data: ForecastInput) -> Dict[str, float]:
    """
    Stage 1 — Build the weather feature dict that each regression
    model expects. Key names must match what the models were trained on.
    """
    return {
        'max_sustained_wind_kph':  input_data.max_sustained_wind,
        'max_24hr_rainfall_mm':    input_data.max_24hr_rainfall,
        'total_storm_rainfall_mm': input_data.total_storm_rainfall,
        'min_pressure_hpa':        input_data.min_pressure,
        'duration_in_par_hours':   input_data.duration,
    }


def predict_target(target_name: str, assets: dict, weather_data: dict) -> int:
    """
    Stage 2 — Run one regression model for a single target.
    Returns 0 on any error so the pipeline never crashes.
    """
    try:
        model             = assets['model']
        scaler            = assets['scaler']
        required_features = assets['features']

        input_df = pd.DataFrame([weather_data])

        # Fill any features the model expects but aren't in weather_data with 0
        for feature in required_features:
            if feature not in input_df.columns:
                input_df[feature] = 0.0

        input_df     = input_df[required_features]
        scaled_input = scaler.transform(input_df)
        prediction   = model.predict(scaled_input)[0]

        result = int(max(0, prediction))
        print(f"   → {target_name}: {result}", flush=True)
        return result

    except Exception as e:
        print(f"   ⚠️ Error predicting '{target_name}': {e}")
        return 0


def run_severity_clustering(
    families: float, persons: float, brgy: float,
    dead: float, injured: float, missing: float,
    totally: float, partially: float,
    duration: float, max_sustained_wind: float,
    typhoon_type: int, max_24hr_rainfall: float,
    total_storm_rainfall: float, min_pressure: float,
    region: Optional[int] = None
) -> dict:
    """
    Stage 3 — Feed the predicted casualty/damage values (from Stage 2)
    plus the original weather inputs into the clustering model to get
    a severity level.

    VERIFIED cluster mapping (from notebook MAACLI output):
      0 → Low Severity      (58.7% of training data, Regions 2, 3, 8)
      1 → High Severity     (4.4%  of training data, all regions)
      2 → Moderate Severity (36.9% of training data, Region 5 ONLY)

    NOTE: Cluster 2 (Moderate) will only appear when region=5 is passed in,
    because 100% of its training data came from Region 5.
    """
    if not models.get('clustering') or models.get('scaler') is None or models.get('feature_columns') is None:
        raise HTTPException(status_code=503, detail="Clustering model not loaded.")

    # Build region one-hot columns
    region_columns = {f'region_{i}': 0 for i in range(1, 18)}
    if region and 1 <= region <= 17:
        region_columns[f'region_{region}'] = 1
        print(f"DEBUG: region_{region} set to 1", flush=True)
    else:
        print("DEBUG: No region specified — all region flags = 0", flush=True)

    feature_dict = {
        'families':                families,
        'person':                  persons,
        'brgy':                    brgy,
        'dead':                    dead,
        'injured/ill':             injured,
        'missing':                 missing,
        'totally':                 totally,
        'partially':               partially,
        'cost':                    0,
        'duration_in_par_hours':   duration,
        'max_sustained_wind_kph':  max_sustained_wind,
        'typhoon_type':            typhoon_type,
        'max_24hr_rainfall_mm':    max_24hr_rainfall,
        'total_storm_rainfall_mm': total_storm_rainfall,
        'min_pressure_hpa':        min_pressure,
    }
    feature_dict.update(region_columns)

    feature_df = pd.DataFrame([feature_dict])

    # Align columns to exactly what the clustering model was trained on
    for col in models['feature_columns']:
        if col not in feature_df.columns:
            feature_df[col] = 0
    feature_df = feature_df[models['feature_columns']]

    print(f"DEBUG clustering input:\n{feature_df.to_dict(orient='records')[0]}", flush=True)

    scaled  = models['scaler'].transform(feature_df.values)
    cluster = int(models['clustering'].predict(scaled)[0])

    print(f"DEBUG cluster result: {cluster} → {CLUSTER_LABELS.get(cluster)}", flush=True)

    return {
        "cluster":     cluster,
        "label":       CLUSTER_LABELS.get(cluster, f"Cluster {cluster}"),
        "description": CLUSTER_DESCRIPTIONS.get(cluster, f"Cluster {cluster}")
    }


# Load models at startup
@app.on_event("startup")
async def startup_event():
    """Load all models when the application starts"""
    print("=" * 60)
    print("Starting Tropical Cyclone Impact API...")
    print("=" * 60)
    load_clustering_models()
    load_prediction_models()
    print("=" * 60)


# ==================== API Endpoints ====================

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Tropical Cyclone Impact Clustering & Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "clustering": "/cluster",
            "prediction": "/predict",
            "health": "/api/health",
            "docs": "/docs"
        }
    }


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="healthy",
        clustering_model_loaded=bool(models['clustering']),
        prediction_model_loaded=bool(models['prediction']),
        version="1.0.0"
    )


# ── /cluster ──────────────────────────────────────────────────────────────────

@app.post("/cluster", response_model=ClusteringResponse, tags=["Clustering"])
async def predict_cluster(input_data: ClusteringInput):
    """
    Predict the cluster assignment for tropical cyclone impact data.

    Tropical Cyclone Type Encoding:
    - TD (Tropical Depression) = 0
    - TS (Tropical Storm) = 1
    - STS (Severe Tropical Storm) = 2
    - TY (Typhoon) = 3
    - STY (Super Typhoon) = 4
    """
    if not models['clustering']:
        raise HTTPException(
            status_code=503,
            detail="Clustering model not loaded. Please run the notebook to export models."
        )

    try:
        region_columns = {f'region_{i}': 0 for i in range(1, 18)}
        if 1 <= input_data.region <= 17:
            region_columns[f'region_{input_data.region}'] = 1

        feature_dict = {
            'families':                input_data.families,
            'person':                  input_data.persons,
            'brgy':                    input_data.barangays,
            'dead':                    input_data.dead,
            'injured/ill':             input_data.injured_ill,
            'missing':                 input_data.missing,
            'totally':                 input_data.totally_damaged,
            'partially':               input_data.partially_damaged,
            'cost':                    input_data.cost,
            'duration_in_par_hours':   input_data.duration_hrs,
            'max_sustained_wind_kph':  input_data.max_sustained_wind,
            'typhoon_type':            input_data.typhoon_type,
            'max_24hr_rainfall_mm':    input_data.max_24hr_rainfall,
            'total_storm_rainfall_mm': input_data.total_storm_rainfall,
            'min_pressure_hpa':        input_data.min_pressure,
        }
        feature_dict.update(region_columns)

        feature_df = pd.DataFrame([feature_dict])
        expected_columns = models['feature_columns']

        for col in expected_columns:
            if col not in feature_df.columns:
                feature_df[col] = 0
        feature_df = feature_df[expected_columns]

        scaled_features = models['scaler'].transform(feature_df.values)
        cluster = int(models['clustering'].predict(scaled_features)[0])

        return ClusteringResponse(
            cluster=cluster,
            description=CLUSTER_DESCRIPTIONS_LONG.get(cluster, f"Cluster {cluster}: Impact pattern determined by clustering analysis.")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering prediction error: {str(e)}")


# ── /predict — full pipeline ───────────────────────────────────────────────────

@app.post("/predict", response_model=ForecastResponse, tags=["Prediction"])
async def predict_damage(input_data: ForecastInput):
    """
    Full prediction pipeline:

    Stage 1 — Accept weather inputs (wind, rainfall, pressure, duration, optional region)
    Stage 2 — Run regression models to predict casualties & damage
    Stage 3 — Feed predicted values into clustering model for severity
    Stage 4 — Return predictions + severity level to frontend

    IMPORTANT: Pass region=5 to get Moderate Severity predictions.
    Without a region, only Low or High Severity will be returned because
    the clustering model learned Moderate Severity exclusively from Region 5 data.
    """
    if not models.get('prediction'):
        raise HTTPException(status_code=503, detail="Prediction models not loaded.")

    try:
        # ── Stage 1: Build weather feature dict ──────────────────────────────
        print("=== PIPELINE START ===", flush=True)
        print(f"Stage 1 — Weather inputs: {input_data}", flush=True)

        weather_features = get_weather_features(input_data)
        print(f"Stage 1 — Feature dict: {weather_features}", flush=True)

        # ── Stage 2: Predict casualties & damage from weather ─────────────────
        print("Stage 2 — Running regression models...", flush=True)

        predicted = {}
        for target, assets in models['prediction'].items():
            predicted[target] = predict_target(target, assets, weather_features)

        print(f"Stage 2 — All predicted values: {predicted}", flush=True)

        # ── Stage 3: Use predicted values as input to clustering ──────────────
        print("Stage 3 — Running clustering for severity...", flush=True)

        severity = run_severity_clustering(
            families=             predicted.get('families', 0),
            persons=              predicted.get('person',   0),
            brgy=                 predicted.get('brgy',     0),
            dead=                 predicted.get('dead',     0),
            injured=              predicted.get('injured',  0),
            missing=              predicted.get('missing',  0),
            totally=              predicted.get('totally',  0),
            partially=            predicted.get('partially',0),
            duration=             input_data.duration,
            max_sustained_wind=   input_data.max_sustained_wind,
            typhoon_type=         input_data.typhoon_type or 0,
            max_24hr_rainfall=    input_data.max_24hr_rainfall,
            total_storm_rainfall= input_data.total_storm_rainfall,
            min_pressure=         input_data.min_pressure,
            region=               input_data.region,
        )

        print(f"Stage 3 — Severity result: {severity}", flush=True)

        # ── Stage 4: Return everything to frontend ────────────────────────────
        print("Stage 4 — Sending response.", flush=True)

        return {
            "families":             predicted.get('families', 0),
            "persons":              predicted.get('person',   0),
            "barangays":            predicted.get('brgy',     0),
            "dead":                 predicted.get('dead',     0),
            "injured":              predicted.get('injured',  0),
            "missing":              predicted.get('missing',  0),
            "totally_damaged":      predicted.get('totally',  0),
            "partially_damaged":    predicted.get('partially',0),
            "severity_cluster":     severity['cluster'],
            "severity_label":       severity['label'],
            "severity_description": severity['description'],
            "message":              "Prediction successful."
        }

    except Exception as e:
        print(f"PIPELINE ERROR: {type(e).__name__}: {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/api/maacli", tags=["MAACLI"])
async def get_maacli_insights():
    """Get MAACLI framework insights about the clustering model"""
    if not models['clustering']:
        raise HTTPException(
            status_code=503,
            detail="MAACLI insights not available. Please run the notebook first."
        )

    insights = {
        "n_clusters": 3,
        "feature_count": len(models['feature_columns']) if models['feature_columns'] else 0,
        "features": models['feature_columns'] if models['feature_columns'] else [],
        "cluster_mapping": {
            "0": "Low Severity (58.7% of data — Regions 2, 3, 8)",
            "1": "High Severity (4.4% of data — all regions)",
            "2": "Moderate Severity (36.9% of data — Region 5 only)"
        }
    }

    return insights


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)