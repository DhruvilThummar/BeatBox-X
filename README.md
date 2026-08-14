# 🌾 AgricastAI: Enterprise Agritech Intelligence & Price Forecasting Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=github)
![Python Version](https://img.shields.io/badge/python-3.11%2B-blue?style=for-the-badge&logo=python)
![Django Version](https://img.shields.io/badge/django-5.0-092E20?style=for-the-badge&logo=django)
![React Version](https://img.shields.io/badge/react-18.2-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

> **Predictive Agricultural Intelligence Engine & Market Telemetry Platform for Indian Farmers & Supply Chains.**

---

## 📌 Executive Overview

**AgricastAI** is an enterprise-grade Agritech forecasting and intelligence platform engineered to bridge the critical information gap in Indian agricultural supply chains. By synthesizing high-frequency mandi price data, real-time localized weather telemetry, and minimum support price (MSP) metrics, AgricastAI delivers actionable price trend forecasts and crop market risk indicators.

### Key Pain Points Solved
* **Asymmetric Mandi Pricing**: Equips farmers with real-time APMC Mandi commodity rates extracted via automated scrapers.
* **Weather-Induced Price Shock**: Quantifies climate severity (heatwaves, unexpected rainfall, frost) into a weighted `weather_impact_score`.
* **Sub-Optimal Harvesting Timelines**: Predicts target prices and price movement directions (Bullish / Bearish / Neutral) over 7-to-30 day horizons using a 10-feature GBDT model.

---

## 🏗 System Architecture

AgricastAI follows a decoupled, resilient architecture engineered for high availability and fault tolerance in outdoor, low-bandwidth environments.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REACT / VITE FRONTEND                                 │
│  - Native Mobile App Layout (Fixed Bottom Nav, 48px Touch Targets, Safe Areas)  │
│  - High-Contrast Outdoor Sunlight Mode & Skeleton Shimmer Loaders                │
│  - Interactive AgriChatbot Floating Widget                                     │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ HTTPS / REST JSON
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DJANGO REST BACKEND                                  │
│  - API Router & Request Sanitization                                            │
│  - In-Memory Cache (Redis) & Telemetry Controller                               │
└───────────────────┬────────────────────┬────────────────────┬───────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────────┐
│   WEATHER PIPELINE    │  │   LIVE SCRAPER ENGINE │  │    AI / ML INFERENCE      │
│  - OpenWeather API    │  │  - BeautifulSoup /    │  │  - 10-Feature Scikit GBDT │
│  - Climate Risk Score │  │    Yahoo Finance      │  │  - Hot-Reload .joblib     │
│    (Heatwave/Frost)   │  │  - Rupee (₹) Regex    │  │  - Heuristic Math Fallback│
└───────────────────────┘  └───────────────────────┘  └───────────────────────────┘
```

---

## ✨ Key Technical Features

### 🌟 AI/ML Engine & Predictive Analytics
* **10-Feature GBDT Pipeline**: Built with Scikit-Learn `HistGradientBoostingRegressor` and `HistGradientBoostingClassifier` trained on 100,000+ historical agricultural dataset samples.
* **Engineered Domain Features**: Includes computed ratios such as `weather_impact_score` and `msp_difference_pct` (percentage divergence from government MSP).
* **Hot-Reloadable Model Lifecycle**: Listens for `.joblib` binary updates and reloads weights in memory without restarting the production Django web worker processes.
* **Mathematical Heuristic Fallback Engine**: If ML model inference fails due to missing features or memory constraints, execution gracefully degrades to a deterministic mathematical model based on moving averages and climate index multipliers.

### ⚡ Data Engineering & Real-Time Scrapers
* **OpenWeather Telemetry**: Computes environmental severity scores penalizing extreme heatwaves or frost conditions while boosting optimal crop growth conditions.
* **Live Mandi Scraper**: Uses `BeautifulSoup4` and regex parsers to scrape and normalize APMC Mandi rates across Indian regional markets into clean float values.

### 📱 Mobile-First Native UI/UX
* **App-Like Navigation**: Features sticky Top App Bar, fixed Bottom Navigation Bar, and independently scrollable content containers (`overflow-y: auto`, `height: 100dvh`).
* **Ergonomics & Touch Feedback**: Enforces 48x48px minimum touch targets, zero tap highlight (`-webkit-tap-highlight-color: transparent`), and active touch scale effects.
* **Outdoor Sunlight Mode**: High-contrast theme toggle designed specifically for high-glare field environments.
* **Zero CLS Skeleton Loaders**: Layout-matched Skeleton shimmer loading states preventing layout shifts while data fetches asynchronously.
* **AgriChatbot Widget**: Embedded conversational assistant offering real-time guidance on crop diseases, optimal fertilizers, and mandi prices.

---

## 🛠 Tech Stack

| Category | Technology | Usage Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 / Vite | Single Page Application framework with modular component structure |
| **Styling** | Vanilla CSS3 / CSS Modules | Safe area variables, mobile-first flex/grid, smooth keyframes |
| **Backend** | Python 3.11 / Django 5.0 | High-performance REST API router and orchestration service |
| **Machine Learning** | Scikit-Learn / Joblib / NumPy | 10-feature GBDT regression & classification pipelines |
| **Data Pipelines** | BeautifulSoup4 / Requests | APMC Mandi web scraping & OpenWeather API integration |
| **Icons & Fonts** | Google Fonts (Cinzel, Quicksand) | Typography tuned for readability and aesthetic precision |

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Python**: `3.11` or higher
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 1. Backend Setup (Django)
```bash
# Clone repository
git clone https://github.com/DhruvilThummar/AgricastAI.git
cd AgricastAI/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Run database migrations
python manage.py migrate

# Start Django development server
python manage.py runserver 8000
```

### 2. Frontend Setup (React / Vite)
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in the root of the backend folder using the format below:

```ini
# ==========================================
# 🌿 AGRICAST AI - ENVIRONMENT CONFIGURATION
# ==========================================

# Django Configuration
DJANGO_SECRET_KEY=django-insecure-agricast-ai-super-secret-key-change-in-prod
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,.vercel.app

# External API Integrations
OPENWEATHER_API_KEY=your_openweather_api_key_here
MANDI_SCRAPER_TIMEOUT=10

# ML Model Configuration
MODEL_PATH=ml_models/crop_price_gbdt.joblib
HOT_RELOAD_INTERVAL=60

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 📡 API Reference

### 1. Crop Price Prediction Endpoint
`POST /api/predict/`

**Request Payload**:
```json
{
  "crop_name": "Wheat",
  "state": "Punjab",
  "mandi_id": "APMC-AMRITSAR-01",
  "rainfall_mm": 120.5,
  "temp_celsius": 31.2,
  "current_mandi_price": 2250.00,
  "msp_price": 2125.00
}
```

**Response**:
```json
{
  "status": "success",
  "crop": "Wheat",
  "predicted_target_price": 2380.50,
  "price_trend": "BULLISH",
  "confidence_score": 0.92,
  "features_used": {
    "weather_impact_score": 0.85,
    "msp_difference_pct": 5.88
  },
  "inference_mode": "ML_MODEL_GBDT"
}
```

### 2. Live Mandi Commodity Prices
`GET /api/commodity-prices/?crop=Rice&state=Haryana`

**Response**:
```json
{
  "crop": "Rice",
  "state": "Haryana",
  "timestamp": "2026-08-14T17:48:22Z",
  "prices": [
    { "mandi": "Karnal", "min_price": 3100, "max_price": 3450, "modal_price": 3300 },
    { "mandi": "Kurukshetra", "min_price": 3050, "max_price": 3400, "modal_price": 3250 }
  ]
}
```

### 3. AgriChatbot Query Endpoint
`POST /api/chatbot/`

**Request Payload**:
```json
{
  "message": "What is the best harvesting time for Mustard in Rajasthan during dry spells?"
}
```

---

## 🛡 License & Acknowledgments

This project is open-source under the **MIT License**.

Designed and developed with ❤️ for the Indian agricultural ecosystem by **Dhruvil Thummar** & the AgricastAI Engineering Team.