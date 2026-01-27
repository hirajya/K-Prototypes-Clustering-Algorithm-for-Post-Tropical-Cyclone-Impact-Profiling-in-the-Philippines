# An Explainable Machine Learning Framework for Post-Tropical Cyclone Impact Profiling and Damage Prediction in the Philippines using Optimized Clustering and Regression Models

A comprehensive full-stack machine learning system for profiling and predicting typhoon impacts in the Philippines using optimized clustering algorithms and regression models. This research project analyzes historical typhoon data (2010-2024) to provide actionable insights for disaster preparedness and post-disaster assessment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)](https://fastapi.tiangolo.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Machine Learning Models](#machine-learning-models)
- [MAACLI Framework](#maacli-framework)
- [Data Sources](#data-sources)
- [Research Methodology](#research-methodology)
- [Research Paper](#research-paper)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🌍 Overview

The Philippines faces an average of 20 typhoons annually, causing significant casualties and economic damage. This project implements a hybrid machine learning framework that:

- **Profiles** typhoon events into distinct impact severity levels (low, moderate, high) using optimized clustering algorithms
- **Predicts** future damage outcomes based on meteorological parameters using supervised regression models
- **Explains** cluster assignments through MAACLI (Model and Algorithm-Agnostic Clustering Interpretability)


---

## 🏗️ System Architecture

The proposed framework consists of two major components:

### 3.4.1 Impact Profiling Module

Categorizes tropical cyclone events into distinct impact severity levels (low, moderate, high) using:

**Input Features:**
- Socio-economic: Families affected, persons affected, barangays affected
- Casualties: Deaths, injured/ill individuals, missing persons
- Damage: Totally damaged houses, partially damaged houses, total relief cost
- Meteorological: Max sustained wind speed, max 24-hour rainfall, total storm rainfall, minimum pressure, duration in PAR (hours)
- Categorical: Typhoon type (TD, TS, STS, TY, STY) - label encoded (0-4)
- Spatial: Affected regions (Regions 2, 3, 5, 8) - one-hot encoded

**Process:**
1. Data preprocessing and feature scaling
2. Principal Component Analysis (PCA) for dimensionality reduction
3. Clustering algorithms evaluated: K-Means, Agglomerative Hierarchical Clustering, DBSCAN, Gaussian Mixture Models (GMM)
4. Hyperparameter optimization using Optuna framework
5. MAACLI interpretability analysis with surrogate decision trees

**Output:** Cluster levels 1-3 (low, moderate, high impact severity)

### 3.4.2 MAACLI Interpretability

Model and Algorithm-Agnostic Clustering Interpretability (MAACLI) provides explainable cluster assignments through:
- Surrogate decision tree models trained on cluster labels
- Feature importance rankings
- Rule-based explanations for cluster assignment
- Human-understandable decision rules

Based on methodology by Guilherme Sérgio de Oliveira and Fabrício A. Silva.

### 3.4.3 Future Damage Prediction Module

Predicts future typhoon damage using supervised regression models:

**Input Features (Meteorological):**
- Maximum sustained wind speed
- Maximum 24-hour rainfall
- Total storm rainfall
- Minimum atmospheric pressure
- Duration in PAR (hours)

**Target Variables:**
- Families affected
- Persons affected
- Barangays affected
- Deaths
- Injured/ill individuals
- Missing persons
- Totally damaged houses
- Partially damaged houses
- Total relief cost

**Algorithms:** Linear Regression and XGBoost Regressor, optimized using Optuna framework

---

## ✨ Key Features

### 🔮 Typhoon Impact Prediction
- Predict casualties (deaths, injuries, missing persons)
- Forecast affected populations (families, persons, barangays)
- Estimate infrastructure damage (totally/partially damaged houses)
- Input-based forecasting using meteorological data

### 🔬 Research Notebooks
- Complete data preprocessing pipeline
- Feature engineering workflows
- Model training and evaluation
- Reproducible analysis scripts

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18) with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3
- **Markdown**: react-markdown for content rendering

### Backend
- **Framework**: FastAPI 0.104
- **Server**: Uvicorn with hot-reload
- **Validation**: Pydantic 2.4
- **CORS**: Full cross-origin support

### Machine Learning
- **Core**: scikit-learn 1.4+
- **Boosting**: XGBoost 3.1
- **Data**: NumPy 2.0+, Pandas 2.2
- **Serialization**: joblib 1.3

### Development
- **Language**: Python 3.8+
- **Package Manager**: uv / pip
- **Version Control**: Git

---

## 📁 Project Structure

```
├── frontend/                      # Next.js web application
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── cluster/              # Cluster analysis page
│   │   └── prediction/           # Impact prediction page
│   ├── components/               # Reusable React components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── package.json
│
├── backend/                       # FastAPI REST API
│   ├── main.py                   # Main API application
│   ├── requirements.txt          # Python dependencies
│   ├── pyproject.toml           # Project configuration
│   └── uv.lock                  # UV lock file
│
├── notebooks/                     # Jupyter notebooks
│   ├── Level Clustering/         # Clustering experiments
│   ├── Outcome Prediction/       # Prediction model training
│   └── step-processing/          # Data preprocessing
│
├── models/                        # Exported ML models
│   ├── clustering/               # Clustering models & scalers
│   └── prediction/               # 9 prediction models (including cost)
│
├── data/                          # Datasets
│   ├── typhoon_impact_preprocessed.csv
│   └── final_output/
│       └── typhoon_impact_with_clusters_and_levels.csv
│
└── README.md                      # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ with pip or uv
- **Git** for version control
- **8GB RAM** minimum for model training

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Clustering-for-Post-Tropical-Cyclone-Impact-Profiling-in-the-Philippines.git
cd Clustering-for-Post-Tropical-Cyclone-Impact-Profiling-in-the-Philippines
```

### 2. Backend Setup (FastAPI)

#### Option A: Using uv (Recommended)

```bash
# Navigate to backend directory
cd backend

# Install uv if not already installed
# pip install uv

# Sync dependencies from uv.lock
uv sync

# Start the API server
uv run uvicorn main:app --reload
```

#### Option B: Using pip

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload
```

The backend API will be available at **http://127.0.0.1:8000**

📖 **API Documentation**: http://127.0.0.1:8000/docs

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at **http://localhost:3000**

### 4. Model Files Setup

⚠️ **Important**: The trained models are not included in the repository due to size constraints.

**Option A**: Train models yourself
```bash
# Open and run the notebooks in sequence:
# 1. notebooks/step-processing/ - Data preprocessing
# 2. notebooks/Level Clustering/ - Clustering models with PCA and Optuna
# 3. notebooks/Outcome Prediction/ - Prediction models with Optuna optimization
```

**Option B**: Request pre-trained models from the research team

---

## 📖 Usage Guide

### Typhoon Impact Prediction

1. Navigate to **http://localhost:3000/prediction**
2. Enter meteorological parameters:
   - **Max Sustained Wind** (kph): Wind speed during typhoon
   - **Max 24hr Rainfall** (mm): Maximum rainfall in 24 hours
   - **Total Storm Rainfall** (mm): Cumulative rainfall
   - **Min Pressure** (hPa): Minimum atmospheric pressure
   - **Duration in PAR** (hours): Time spent in Philippine Area of Responsibility
3. Click **"Get Prediction"**
4. View predicted impacts:
   - Affected families, persons, and barangays
   - Casualty estimates (deaths, injuries, missing)
   - Infrastructure damage (totally/partially damaged houses)
   - Estimated relief cost

### Cluster Analysis

1. Navigate to **http://localhost:3000/cluster**
2. Enter complete typhoon event data
3. System assigns event to one of three impact levels:
   - **Level 1**: Low-Impact
   - **Level 2**: Moderate-Impact
   - **Level 3**: High-Impact
4. Review MAACLI-generated explanations for cluster assignment

---

## 🔌 API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "clustering_model_loaded": true,
  "prediction_model_loaded": true,
  "version": "1.0.0"
}
```

#### 2. Predict Impact
```http
POST /predict
Content-Type: application/json
```

**Request Body:**
```json
{
  "max_sustained_wind": 175.0,
  "max_24hr_rainfall": 120.5,
  "total_storm_rainfall": 350.0,
  "min_pressure": 940.0,
  "duration": 96.0
}
```

**Response:**
```json
{
  "families": 8500,
  "persons": 35000,
  "barangays": 45,
  "dead": 12,
  "injured": 35,
  "missing": 3,
  "totally_damaged": 850,
  "partially_damaged": 3200,
  "cost": 4500000,
  "message": "Prediction successful"
}
```

#### 3. Cluster Assignment
```http
POST /cluster
Content-Type: application/json
```

**Request Body:**
```json
{
  "families": 9000,
  "persons": 37000,
  "barangays_affected": 50,
  "dead": 15,
  "injured_ill": 40,
  "missing": 5,
  "totally_damaged": 900,
  "partially_damaged": 3500,
  "cost": 4500000,
  "duration_hrs": 110,
  "max_sustained_wind": 180,
  "typhoon_type": 3,
  "max_24hr_rainfall": 130,
  "total_storm_rainfall": 380,
  "min_pressure": 935,
  "region": 8
}
```

**Typhoon Type Encoding (Label Encoding):**
- `0` = TS (Tropical Depression)
- `1` = TD (Tropical Storm)
- `2` = STS (Severe Tropical Storm)
- `3` = TY (Typhoon)
- `4` = STY (Super Typhoon)

**Region Encoding (One-Hot):**
- Valid regions: 2, 3, 5, 8

**Response:**
```json
{
  "cluster": 1,
  "level": "Low-Impact",
  "description": "Events with minimal casualties and limited infrastructure damage...",
  "explanation": "Decision rule: Region=8, Cost<3M, Persons<50000 → Low-Impact"
}
```

---

## 🤖 Machine Learning Models

### Clustering Models

**Algorithms Evaluated:**
- K-Means
- Agglomerative Hierarchical Clustering
- DBSCAN
- Gaussian Mixture Models (GMM)

**Optimization:** Hyperparameter tuning using Optuna framework

**Preprocessing:**
- Feature scaling (StandardScaler)
- Principal Component Analysis (PCA) for dimensionality reduction
- Label encoding for typhoon types
- One-hot encoding for regions

**Features:** 16 input features (socio-economic, meteorological, damage indicators)

**Output:** 3 cluster levels (Low, Moderate, High impact)

### Prediction Models

**Algorithms:**
- Linear Regression
- XGBoost Regressor

**Optimization:** Optuna framework for hyperparameter tuning

**Input Features:** 5 meteorological parameters
**Target Variables:** 9 damage indicators

**Cross-validation:** Used for model evaluation and generalizability

---

## 🧠 MAACLI Framework

**MAACLI** (Model-Agnostic Automated Clustering Interpretation) provides explainable AI insights through surrogate decision trees:

### Methodology
1. Train primary clustering model (K-Means/GMM/etc.)
2. Extract cluster labels from training data
3. Train surrogate decision tree using original features and cluster labels
4. Generate interpretable decision rules

### Outputs
- **Feature Importance Rankings**: Identify key drivers of cluster assignment
- **Decision Rules**: Human-readable conditions for each cluster
- **Cluster Percentiles**: Statistical summaries of each cluster

### Reference
Based on methodology by Guilherme Sérgio de Oliveira and Fabrício A. Silva in "Explainable Clustering: A Solution to Interpret and Describe Clusters"

---

## 📊 Data Sources

### Primary Data
- **NDRRMC** (National Disaster Risk Reduction and Management Council)
  - Situational reports
  - Casualty reports
  - Damage assessments
  - Affected population data

- **PAGASA** (Philippine Atmospheric, Geophysical and Astronomical Services Administration)
  - Typhoon tracks
  - Wind speed measurements
  - Rainfall data
  - Pressure readings
  - Duration in PAR

### Dataset Coverage
- **Time Period**: 2010-2024
- **Geographic Scope**: Regions 2, 3, 5, and 8
- **Events Analyzed**: Historical tropical cyclone occurrences
- **Features**: Socio-economic, meteorological, and damage indicators

---

## 🔬 Research Methodology

### 1. Data Preprocessing
- Missing value imputation
- Outlier detection and treatment
- Feature scaling and normalization
- Label encoding for typhoon types (TD=0, TS=1, STS=2, TY=3, STY=4)
- One-hot encoding for regional variables

### 2. Dimensionality Reduction
- Principal Component Analysis (PCA)
- Multicollinearity mitigation
- Visualization of cluster topologies

### 3. Impact Profiling (Clustering)
- Algorithm comparison: K-Means, Agglomerative, DBSCAN, GMM
- Optuna-based hyperparameter optimization
- Cluster validation metrics
- MAACLI interpretability analysis

### 4. Damage Prediction (Regression)
- Linear Regression and XGBoost comparison
- Optuna-based hyperparameter tuning
- Cross-validation for generalizability
- Multi-target prediction (9 damage indicators)

### 5. Model Evaluation
- **Clustering**: Silhouette Score, Calinski-Harabasz Index, Davies-Bouldin Index
- **Regression**: MAE, RMSE, R²
- **Interpretability**: MAACLI decision rules and feature importance

---

## 📄 Research Paper

**Full Thesis Document**: [View Thesis Paper](#) <!-- TODO: Add thesis paper link -->

**Title**: An Explainable Machine Learning Framework for Post-Tropical Cyclone Impact Profiling and Damage Prediction in the Philippines using Optimized Clustering and Regression Models

**Author**: Cailing, M.A., De Luna, M.R.A, Estrada, R.L, Racho, C.A., Tamayo, D.

**Year**: 2025

---

## 🤝 Contributing

We welcome contributions from the research community!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Areas for Contribution
- Model improvement and hyperparameter tuning
- Additional clustering algorithms evaluation
- Frontend UI/UX enhancements
- Documentation and tutorials
- Bug fixes and performance optimization

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License
Copyright (c) 2025 Rodney Lei Estrada
```

---

## 🙏 Acknowledgments

### Data Providers
- **PAGASA** - Philippine Atmospheric, Geophysical and Astronomical Services Administration
- **NDRRMC** - National Disaster Risk Reduction and Management Council

### Research References
- Guilherme Sérgio de Oliveira and Fabrício A. Silva - MAACLI Framework
- Optuna Development Team - Hyperparameter optimization
- scikit-learn and XGBoost communities

### Frameworks & Tools
- FastAPI and Next.js communities
- uv package manager
- Open-source contributors worldwide

---

## 📞 Contact & Support

### Research Team
- **Lead Researcher**: Rodney Lei Estrada
- **Email**: rodneyestrada2425@gmail.com

### Issues & Questions
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/repo/issues)
- **API Docs**: http://127.0.0.1:8000/docs

---

## 📈 Project Status

🚧 **Active Development** - Version 1.0.0

---

## 📚 Citations

If you use this work in your research, please cite:

```bibtex
@software{estrada2025typhoon,
  author = {Estrada, Rodney Lei},
  title = {An Explainable Machine Learning Framework for Post-Tropical Cyclone Impact Profiling and Damage Prediction in the Philippines using Optimized Clustering and Regression Models},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/yourusername/Clustering-for-Post-Tropical-Cyclone-Impact-Profiling-in-the-Philippines}
}
```

---

