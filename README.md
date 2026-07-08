# TrafficSense AI 🚦🧠

TrafficSense AI is a modern, AI-powered traffic prediction, routing assistant, and eco-navigation dashboard. It combines a React (Vite + Tailwind CSS) frontend with a FastAPI (Python) backend to analyze travel plans, provide geocoded routing on an interactive OpenStreetMap (using Leaflet), and generate detailed travel advice using the Gemini AI API.

## Features

- 🏎️ **Multi-modal Navigation**: Supports Car, Bike, Bus, and Walk modes.
- 🗺️ **Interactive Maps**: Uses OpenStreetMap + Leaflet for live location geocoding (Nominatim API) and road routing (OSRM API).
- 🎨 **Glassmorphism UI**: Beautiful, premium dark mode styling with blue/green traffic gradients.
- 🧠 **Gemini AI Integration**: Analyzes traffic levels (Low, Medium, High) to generate:
  - Congestion explanations and possible bottlenecks
  - Smart alternative route advice
  - Eco-driving & energy conservation tips
  - Travel mode-specific safety advice
- 🔄 **Resilient Demo Mode**: Seamlessly falls back to rich, context-aware mockup data if no Gemini API key is provided, allowing instant testing.

---

## Project Structure

```text
traffic-congestion/
├── README.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── App.css
    │   └── components/
    │       ├── GlassCard.jsx
    │       ├── LandingPage.jsx
    │       ├── TrafficAssistant.jsx
    │       └── TrafficMap.jsx
    └── vite.config.js
```

---

## Local Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher

### 1. Backend Setup (FastAPI)

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your **Gemini API Key**:
     ```env
     GEMINI_API_KEY=AIzaSy...
     ```
     *(You can get a free key from [Google AI Studio](https://aistudio.google.com/))*
4. Start the backend server:
   ```bash
   python main.py
   ```
   The API will run locally at: `http://localhost:8000`

### 2. Frontend Setup (React + Vite)

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `frontend` directory:
     ```env
     VITE_API_URL=http://localhost:8000
     ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open the browser at the local address printed (typically `http://localhost:5173`).

---

## Deployment Guide

This project is fully structured and pre-configured for direct deployment.

### Frontend Deployment (Netlify)

1. **Build Settings**:
   - **Repository Subdirectory**: `frontend` (if deploying from monorepo) or deploy just the folder.
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/dist` (or `dist` if building from within the subdirectory)
2. **Environment Variables**:
   - Set `VITE_API_URL` to your live backend Render URL (e.g. `https://trafficsense-api.onrender.com`).

### Backend Deployment (Render)

1. **Service Type**: Web Service
2. **Environment**: Python
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `python main.py` or `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   - Add `GEMINI_API_KEY` with your live Google AI API Key.
   - Render automatically injects the `PORT` variable, which `main.py` detects.

---

## Technology Stack & APIs

- **Backend**: FastAPI, Uvicorn, Python-dotenv, Pydantic, HTTPX, `google-generativeai` SDK.
- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Leaflet.
- **Mapping APIs**:
  - **OpenStreetMap Nominatim**: For geocoding source and destination addresses to latitude/longitude.
  - **OSRM (Open Source Routing Machine)**: For calculating the actual road network path between locations.
  - **CartoDB Dark Matter Tiles**: For the premium dark mode map tiles.
