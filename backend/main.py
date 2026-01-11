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
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",  # All Vercel preview deployments
        "https://your-app-name.vercel.app",  # Replace with your actual Vercel domain
        "*"  # Allow all origins (less secure, but works for development)
    ],
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
    """Response from damage prediction"""
    families: float
    persons: float
    barangays: float
    dead: float
    injured_ill: float
    missing: float
    cost: float
    partially_damaged: float
    totally_damaged: float
    message: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    clustering_model_loaded: bool
    prediction_model_loaded: bool
    version: str


# ==================== Model Loading ====================

# Global model storage
models = {
    'clustering': None,
    'scaler': None,
    'feature_columns': None,
    'prediction': None
}


def load_clustering_models():
    """Load clustering models from the models/clustering directory"""
    # Try local models folder first (for Render deployment)
    clustering_dir = os.path.join(os.path.dirname(__file__), 'models', 'clustering')
    
    # If not found, try parent directory (for local development)
    if not os.path.exists(clustering_dir):
        clustering_dir = os.path.join(os.path.dirname(__file__), '..', 'models', 'clustering')
    
    try:
        models['clustering'] = joblib.load(os.path.join(clustering_dir, 'clustering_model.joblib'))
        models['scaler'] = joblib.load(os.path.join(clustering_dir, 'scaler.joblib'))
        models['feature_columns'] = joblib.load(os.path.join(clustering_dir, 'feature_columns.joblib'))
        print(f"✓ Clustering models loaded successfully from {clustering_dir}")
        return True
    except FileNotFoundError as e:
        print(f"⚠ Clustering models not found: {e}")
        print(f"  Searched in: {clustering_dir}")
        print("  Please run the notebook to export the models first.")
        return False
    except Exception as e:
        print(f"⚠ Error loading clustering models: {e}")
        return False


def load_prediction_models():
    """Load prediction models from the models/prediction directory"""
    # Try local models folder first (for Render deployment)
    prediction_dir = os.path.join(os.path.dirname(__file__), 'models', 'prediction')
    
    # If not found, try parent directory (for local development)
    if not os.path.exists(prediction_dir):
        prediction_dir = os.path.join(os.path.dirname(__file__), '..', 'models', 'prediction')
    
    try:
        models['prediction'] = joblib.load(os.path.join(prediction_dir, 'prediction_model.joblib'))
        print(f"✓ Prediction models loaded successfully from {prediction_dir}")
        return True
    except FileNotFoundError:
        print("⚠ Prediction models not found (not yet implemented)")
        return False
    except Exception as e:
        print(f"⚠ Error loading prediction models: {e}")
        return False


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


@app.post("/forecast", response_model=ForecastResponse, tags=["Prediction"])
async def predict_damage(input_data: ForecastInput):
    """
    Predict damage metrics based on weather features.
    
    Note: This endpoint is not yet implemented. The prediction model needs to be trained first.
    """
    if models['prediction'] is None:
        # Return placeholder response indicating feature is not ready
        return ForecastResponse(
            families=0,
            persons=0,
            barangays=0,
            dead=0,
            injured_ill=0,
            missing=0,
            cost=0,
            partially_damaged=0,
            totally_damaged=0,
            message="Prediction model not yet available. This feature is coming soon."
        )
    
    try:
        # Build feature array for prediction
        features = np.array([[
            input_data.max_sustained_wind,
            input_data.typhoon_type if input_data.typhoon_type is not None else 0,
            input_data.max_24hr_rainfall,
            input_data.total_storm_rainfall,
            input_data.min_pressure,
            input_data.duration
        ]])
        
        # Make predictions
        predictions = models['prediction'].predict(features)
        
        return ForecastResponse(
            families=float(predictions[0][0]),
            persons=float(predictions[0][1]),
            barangays=float(predictions[0][2]),
            dead=float(predictions[0][3]),
            injured_ill=float(predictions[0][4]),
            missing=float(predictions[0][5]),
            cost=float(predictions[0][6]),
            partially_damaged=float(predictions[0][7]),
            totally_damaged=float(predictions[0][8]),
            message="Prediction successful"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


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