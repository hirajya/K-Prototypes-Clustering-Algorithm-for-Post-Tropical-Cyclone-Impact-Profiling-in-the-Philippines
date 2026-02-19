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
    max_sustained_wind: float = Field(..., description="Maximum sustained wind in kph")
    typhoon_type: Optional[int] = Field(None, description="Typhoon type (optional for LR)")
    max_24hr_rainfall: float = Field(..., description="Maximum 24hr rainfall in mm")
    total_storm_rainfall: float = Field(..., description="Total storm rainfall in mm")
    min_pressure: float = Field(..., description="Minimum pressure in hPa")
    duration: float = Field(..., description="Duration in hours")

class ForecastResponse(BaseModel):
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
    print(base_path)
    
    print(f"DEBUG: Looking for models in: {os.path.abspath(base_path)}")
    

    loaded_count = 0
    for target in prediction_targets:
        try:
            # Load the trio for each target
            model = joblib.load(os.path.join(base_path, f'{target}_model.joblib'))
            scaler = joblib.load(os.path.join(base_path, f'{target}_scaler.joblib'))
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

def get_weather_features(input_data: ForecastInput) -> Dict[str, float]:
    return {
        'max_sustained_wind_kph': input_data.max_sustained_wind,
        'max_24hr_rainfall_mm': input_data.max_24hr_rainfall,
        'total_storm_rainfall_mm': input_data.total_storm_rainfall,
        'min_pressure_hpa': input_data.min_pressure,
        'duration_in_PAR_hours': input_data.duration,
    }

def predict_target(target_name: str, assets: dict, weather_data: dict) -> int:
    try:
        model = assets['model']
        scaler = assets['scaler']
        required_features = assets['features']

        # Create DataFrame from input dictionary
        input_df = pd.DataFrame([weather_data])

        # Fill missing columns with 0.0 (Safety check)
        for feature in required_features:
            if feature not in input_df.columns:
                input_df[feature] = 0.0
        
        # Reorder columns to match training exactly
        input_df = input_df[required_features]

        # Scale and Predict
        scaled_input = scaler.transform(input_df)
        prediction = model.predict(scaled_input)[0]

        return int(max(0, prediction))

    except Exception as e:
        print(f"   ⚠️ Error predicting '{target_name}': {e}")
        return 0
    
def run_clustering_pipeline(
    families: float, persons: float, dead: float,
    injured: float, missing: float, totally: float,
    partially: float, duration: float,
    max_sustained_wind: float, typhoon_type: int,
    max_24hr_rainfall: float, total_storm_rainfall: float,
    min_pressure: float
) -> dict:
    if not models.get('clustering') or models.get('scaler') is None or models.get('feature_columns') is None:
        raise HTTPException(status_code=503, detail="Clustering model not loaded.")

    region_columns = {f'region_{i}': 0 for i in range(1, 18)}

    feature_dict = {
        'families':                families,
        'person':                  persons,
        'dead':                    dead,
        'injured/ill':             injured,
        'missing':                 missing,
        'totally':                 totally,
        'partially':               partially,
        'cost':                    0.0,
        'duration_in_par_hours':   duration,
        'max_sustained_wind_kph':  max_sustained_wind,
        'typhoon_type':            typhoon_type,
        'max_24hr_rainfall_mm':    max_24hr_rainfall,
        'total_storm_rainfall_mm': total_storm_rainfall,
        'min_pressure_hpa':        min_pressure,
    }
    feature_dict.update(region_columns)

    feature_df = pd.DataFrame([feature_dict])

    for col in models['feature_columns']:
        if col not in feature_df.columns:
            feature_df[col] = 0
    feature_df = feature_df[models['feature_columns']]

    scaled_features = models['scaler'].transform(feature_df.values)
    cluster = int(models['clustering'].predict(scaled_features)[0])

    descriptions = {
        0: "Lower severity events with minimal casualties and limited property damage requiring standard response protocols.",
        1: "Severe events with significant casualties, extensive property damage, and large affected populations requiring immediate response.",
        2: "Moderate severity events with noticeable damage concentrated in specific regions requiring coordinated response."
    }
    labels = {
        0: "Low Severity",
        1: "High Severity",
        2: "Moderate Severity"
    }

    return {
        "cluster":     cluster,
        "label":       labels.get(cluster, f"Cluster {cluster}"),
        "description": descriptions.get(cluster, f"Cluster {cluster}")
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
    """Root endpoint with API information"""
    return {
        "message": "Tropical Cyclone Impact Clustering & Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "clustering": "/cluster",
            "prediction": "/forecast",
            "health": "/api/health",
            "docs": "/docs"
        }
    }


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        clustering_model_loaded=models['clustering'] is not None,
        prediction_model_loaded=models['prediction'] is not None,
        version="1.0.0"
    )


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
    if models['clustering'] is None:
        raise HTTPException(
            status_code=503,
            detail="Clustering model not loaded. Please run the notebook to export models."
        )
    
    try:
        # Create one-hot encoded region columns (regions 1-17)
        region_columns = {f'region_{i}': 0 for i in range(1, 18)}
        if 1 <= input_data.region <= 17:
            region_columns[f'region_{input_data.region}'] = 1
        
        # Build feature dictionary matching the training data columns
        feature_dict = {
            'families': input_data.families,
            'person': input_data.persons,
            'dead': input_data.dead,
            'injured/ill': input_data.injured_ill,
            'missing': input_data.missing,
            'totally': input_data.totally_damaged,
            'partially': input_data.partially_damaged,
            'cost': input_data.cost,
            'duration_in_par_hours': input_data.duration_hrs,
            'max_sustained_wind_kph': input_data.max_sustained_wind,
            'typhoon_type': input_data.typhoon_type,
            'max_24hr_rainfall_mm': input_data.max_24hr_rainfall,
            'total_storm_rainfall_mm': input_data.total_storm_rainfall,
            'min_pressure_hpa': input_data.min_pressure,
        }
        
        # Add region one-hot columns
        feature_dict.update(region_columns)
        
        # Create DataFrame with proper column order
        feature_df = pd.DataFrame([feature_dict])
        
        # Ensure columns match the trained model's expected features
        expected_columns = models['feature_columns']
        
        # Add missing columns with 0 and reorder
        for col in expected_columns:
            if col not in feature_df.columns:
                feature_df[col] = 0
        
        feature_df = feature_df[expected_columns]
        
        # Scale the features
        scaled_features = models['scaler'].transform(feature_df.values)
        
        # Predict cluster
        cluster = int(models['clustering'].predict(scaled_features)[0])
        
        # Generate description
        descriptions = {
            0: """Lower severity events with minimal casualties and limited property damage requiring standard response protocols.

### Families Affected

Typically **13–610 families**, with around **90 families** affected in most cases.

### Persons Affected

Usually **50–2,300 people**, with a common impact of about **320 persons**.

### Deaths

Most events report **no deaths**, with **very rare cases** reaching up to **3 fatalities**.

### Injured / Ill

Generally **none**, though **isolated incidents** may involve injuries.

### Missing Persons

Typically **no missing persons**, with only **rare single cases** reported.

### Totally Damaged Houses

Most events report **no totally damaged houses**, with **limited damage** in rare cases.

### Partially Damaged Houses

Usually **none**, though **localized impacts** can affect **up to ~3,000 houses**.

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

Typically **5,000–16,000 families**, with around **9,000 families** affected in most events.

### Persons Affected

Usually **18,500–64,000 people**, with a typical impact of about **37,000 persons**.

### Deaths

Most events report **no deaths**, though **rare extreme cases** can reach up to **around 95 fatalities**.

### Injured / Ill

Generally **none to a few cases**, but injuries can rise to **several dozen** in more severe situations.

### Missing Persons

Typically **no missing persons**, with only **isolated cases** reported during extreme events.

### Totally Damaged Houses

Commonly **hundreds to over 1,000 houses**, with a typical value of around **500 totally damaged homes**.

### Partially Damaged Houses

Usually **2,000–4,700 houses**, indicating widespread but varying structural damage.

### Economic Cost (PHP)

Typically between **₱1.7 million and ₱5.8 million**, with severe cases exceeding **₱16 million**.

### Maximum Sustained Wind

Most events experience **155–195 kph winds**, consistent with strong typhoon conditions.

### 24-Hour Rainfall

Rainfall commonly ranges from **about 47–149 mm**, with extreme events producing much heavier totals.

### Duration of Impact

Impacts generally last **around 4–5 days**, with prolonged cases extending beyond this period.""",
            2: """Moderate severity events with noticeable damage concentrated in specific regions requiring coordinated response.

### Families Affected

Typically **16–840 families**, with around **235 families** affected in most events.

### Persons Affected

Usually **60–3,300 people**, with a common impact of about **930 persons**.

### Deaths

Most events report **no deaths**, with **rare cases** reaching up to **3 fatalities**.

### Injured / Ill

Generally **none**, but injuries can rise to **around a dozen cases** in some events.

### Missing Persons

Typically **no missing persons**, with only **isolated cases** reported.

### Totally Damaged Houses

Most events report **no totally damaged houses**, though **localized damage** can reach **up to ~2,000 homes**.

### Partially Damaged Houses

Usually **no recorded partial damage**, but **moderate events** may affect **up to ~3,000 houses**.

### Economic Cost (PHP)

Often **minimal or unreported**, but some events incur costs of **up to ₱2 million**.

### Maximum Sustained Wind

Commonly **110–155 kph**, indicating **strong tropical storm to typhoon** conditions.

### 24-Hour Rainfall

Typically **50–117 mm**, with heavier rainfall in more intense cases.

### Duration of Impact

Impacts generally last **around 4–6 days**, with prolonged events extending longer."""
        }
        
        return ClusteringResponse(
            cluster=cluster,
            description=descriptions.get(cluster, f"Cluster {cluster}: Impact pattern determined by clustering analysis.")
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering prediction error: {str(e)}")

@app.post("/predict", response_model=ForecastResponse, tags=["Prediction"])
async def predict_damage(input_data: ForecastInput):
    import sys
    print("=== /predict HIT ===", flush=True)
    print(f"Input: {input_data}", flush=True)
    print(f"Clustering loaded: {bool(models.get('clustering'))}", flush=True)
    sys.stdout.flush()

    if not models.get('prediction'):
        raise HTTPException(status_code=503, detail="Prediction models not loaded.")

    try:
        # Stage 1: Predict casualties from weather
        weather_features = get_weather_features(input_data)

        results = {}
        for target, assets in models['prediction'].items():
            results[target] = predict_target(target, assets, weather_features)

        print(f"DEBUG Stage 1 results: {results}", flush=True)

        # Stage 2: Feed casualties + weather into clustering
        severity = run_clustering_pipeline(
            families=             results.get('families', 0),
            persons=              results.get('person', 0),
            dead=                 results.get('dead', 0),
            injured=              results.get('injured', 0),
            missing=              results.get('missing', 0),
            totally=              results.get('totally', 0),
            partially=            results.get('partially', 0),
            duration=             input_data.duration,
            max_sustained_wind=   input_data.max_sustained_wind,
            typhoon_type=         input_data.typhoon_type or 0,
            max_24hr_rainfall=    input_data.max_24hr_rainfall,
            total_storm_rainfall= input_data.total_storm_rainfall,
            min_pressure=         input_data.min_pressure,
        )

        print(f"DEBUG severity: {severity}", flush=True)

        return {
            "families":             results.get('families', 0),
            "persons":              results.get('person', 0),
            "barangays":            results.get('brgy', 0),
            "dead":                 results.get('dead', 0),
            "injured":              results.get('injured', 0),
            "missing":              results.get('missing', 0),
            "totally_damaged":      results.get('totally', 0),
            "partially_damaged":    results.get('partially', 0),
            "severity_cluster":     severity['cluster'],
            "severity_label":       severity['label'],
            "severity_description": severity['description'],
            "message": f"Prediction successful."
        }

    except Exception as e:
        print(f"DEBUG ERROR: {type(e).__name__}: {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/api/maacli", tags=["MAACLI"])
async def get_maacli_insights():
    """Get MAACLI framework insights about the clustering model"""
    if models['clustering'] is None:
        raise HTTPException(
            status_code=503,
            detail="MAACLI insights not available. Please run the notebook first."
        )
    
    insights = {
        "n_clusters": 3,
        "feature_count": len(models['feature_columns']) if models['feature_columns'] else 0,
        "features": models['feature_columns'] if models['feature_columns'] else []
    }
    
    return insights


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)