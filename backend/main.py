from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
import os

app = FastAPI(
    title="Typhoon Impact Clustering & Prediction API",
    description="API for clustering typhoon impact levels and predicting damage severity",
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
    typhoon_type: int = Field(..., description="Typhoon type (TS=0, TD=1, STS=2, TY=3, STY=4)")
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

class ForecastResponse(BaseModel):
    """Response containing predictions for all impact categories"""
    families: float
    persons: float
    barangays: float
    dead: float
    injured: float 
    missing: float
    totally_damaged: float
    partially_damaged: float
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
    
# Load models at startup
@app.on_event("startup")
async def startup_event():
    """Load all models when the application starts"""
    print("=" * 60)
    print("Starting Typhoon Impact API...")
    print("=" * 60)
    load_clustering_models()
    load_prediction_models()
    print("=" * 60)


# ==================== API Endpoints ====================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Typhoon Impact Clustering & Prediction API",
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
    Predict the cluster assignment for typhoon impact data.
    
    Typhoon Type Encoding:
    - TS (Tropical Storm) = 0
    - TD (Tropical Depression) = 1
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
            0: "Cluster 0: Typhoon impact pattern identified by the clustering algorithm.",
            1: "Cluster 1: Typhoon impact pattern identified by the clustering algorithm.",
            2: "Cluster 2: Typhoon impact pattern identified by the clustering algorithm."
        }
        
        return ClusteringResponse(
            cluster=cluster,
            description=descriptions.get(cluster, f"Cluster {cluster}: Impact pattern determined by clustering analysis.")
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering prediction error: {str(e)}")

@app.post("/predict", response_model=ForecastResponse, tags=["Prediction"])
async def predict_damage(input_data: ForecastInput):
    """
    Main Endpoint: Predicts ALL targets at once.
    """
    # 1. Validation
    if not models.get('prediction'):
        raise HTTPException(status_code=503, detail="Prediction models not loaded")

    try:
        # 2. Prepare Data
        weather_features = get_weather_features(input_data)
        
        # 3. Run Predictions Loop (Predicts all of it at once)
        results = {}
        for target, assets in models['prediction'].items():
            results[target] = predict_target(target, assets, weather_features)

        # 4. Construct Response
        return {
            "families": results.get('families', 0),
            "persons": results.get('person', 0),
            "barangays": results.get('brgy', 0),
            "dead": results.get('dead', 0),
            "injured": results.get('injured', 0),
            "missing": results.get('missing', 0),
            "totally_damaged": results.get('totally', 0),
            "partially_damaged": results.get('partially', 0),
            "message": "Prediction successful"
        }

    except Exception as e:
        print(f"Server Error: {e}")
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