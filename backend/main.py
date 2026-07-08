import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

app = FastAPI(
    title="TrafficSense AI API",
    description="Backend API for traffic analysis and routing recommendation powered by Gemini AI",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For deployment, restrict this to your Netlify URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini API
api_key = os.getenv("GEMINI_API_KEY")
gemini_active = False

if api_key and api_key != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=api_key)
        gemini_active = True
        print("Gemini AI API configured successfully.")
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
else:
    print("Warning: GEMINI_API_KEY not found or set to default. Running in Demo Simulation Mode.")

# Pydantic models for structured requests and responses
class RouteRequest(BaseModel):
    source: str
    destination: str
    traffic: str  # Low, Medium, High
    mode: str     # Car, Bike, Bus, Walk

class TrafficAnalysis(BaseModel):
    estimated_time: str = Field(description="Estimated travel time (e.g., '35 mins' or '1 hour 15 mins')")
    congestion: str = Field(description="Detailed explanation of the congestion levels and typical bottleneck causes along the route")
    alternative_route: str = Field(description="A suggested alternative route or navigation strategy to bypass current congestion")
    ai_recommendation: str = Field(description="Specific AI recommendation tailored to the chosen mode of travel and traffic conditions")
    fuel_saving_tip: str = Field(description="Actionable advice on saving fuel, battery power, or personal energy/effort")
    safety_tip: str = Field(description="Crucial safety advice for the trip based on travel mode, environment, and traffic levels")

# context-aware mockup responses for Demo Simulation Mode
def generate_mock_analysis(request: RouteRequest) -> dict:
    source = request.source.strip()
    dest = request.destination.strip()
    traffic = request.traffic.lower()
    mode = request.mode.lower()
    
    # Calculate mock times
    base_times = {
        "car": {"low": "15-20 mins", "medium": "35-45 mins", "high": "60-80 mins"},
        "bike": {"low": "20-25 mins", "medium": "25-30 mins", "high": "30-35 mins"},
        "bus": {"low": "25-30 mins", "medium": "50-65 mins", "high": "85-110 mins"},
        "walk": {"low": "60-70 mins", "medium": "60-70 mins", "high": "65-75 mins"}
    }
    
    est_time = base_times.get(mode, {}).get(traffic, "40 mins")
    
    # Congestion details
    congestion_templates = {
        "high": f"Heavy congestion detected between {source} and {dest}. Major bottlenecks observed at main junctions, traffic lights, and construction zones. Average speeds are reduced by 60%. Expect bumper-to-bumper delays.",
        "medium": f"Moderate delays expected. Traffic is moving but slow, particularly around commuter bottlenecks and intersections midway from {source} to {dest}. Flow is stable but sluggish.",
        "low": f"Traffic is free-flowing along the primary route from {source} to {dest}. Standard signal delays are the only anticipated stops. Roads are mostly clear."
    }
    congestion = congestion_templates.get(traffic, f"Standard traffic flow from {source} to {dest}.")
    
    # Alternative routes
    alt_routes = {
        "car": {
            "high": f"Bypass the main highway. Take the expressway link, turn right onto Elmwood Parkway, and use back roads to enter {dest} from the north.",
            "medium": f"Consider using the frontage road parallel to the main boulevard, bypassing the central business district lanes.",
            "low": f"The primary route is optimal. No alternative route is necessary at this time."
        },
        "bike": {
            "high": f"Avoid the congested main street. Detour through the Riverside bike path, which runs parallel and offers a safer, signal-free route.",
            "medium": f"Use the neighborhood collector lanes on 4th Avenue rather than the primary arterial road.",
            "low": "Stick to the direct bike lane on Main Avenue; it is clear and fast."
        },
        "bus": {
            "high": f"Since the bus does not have a dedicated lane on this route, consider taking the Light Rail Line B if available, or a bus route that operates on the dedicated transitway.",
            "medium": f"Look out for express buses which skip local stops and use HOV lanes to avoid bottlenecks.",
            "low": "Standard bus route is optimal. Safe travels!"
        },
        "walk": {
            "high": f"Sidewalks along the major arterial are busy and noisy. Detour through the pedestrian greenway corridor for a quieter, pollution-free route.",
            "medium": f"Utilize the pedestrian bridge rather than cross the multiple surface street junctions near the middle of the route.",
            "low": "Direct pedestrian pathways and sidewalks are clear. Enjoy the walk!"
        }
    }
    alt_route = alt_routes.get(mode, {}).get(traffic, "No alternative route suggestions required.")
    
    # AI recommendations
    ai_recs = {
        "car": {
            "high": "🔴 Delay departure by 25 minutes if possible, as traffic is expected to ease. Alternatively, consider using public transit or carpooling in HOV lanes.",
            "medium": "🟡 Depart now, but stay alert to navigation updates. Traffic is building up. Keep music calm to stay relaxed.",
            "low": "🟢 Excellent time to travel. Clean run expected. Enjoy your drive!"
        },
        "bike": {
            "high": "🟢 Cycling is highly recommended right now. You will bypass gridlocked cars entirely. Ensure your front/rear lights are active.",
            "medium": "🟢 Good time to bike. Be cautious of cars turning across bike lanes, as drivers may be distracted by sluggish traffic.",
            "low": "🟢 Great conditions for a ride. Direct sun might be warm, keep hydrated."
        },
        "bus": {
            "high": "🔴 Bus lines are experiencing heavy delays. Switch to a subway/metro if available, or wait for the peak hour to clear.",
            "medium": "🟡 Expect minor delays in bus arrival times. Keep track of live bus locations via your transit app.",
            "low": "🟢 Buses are running on schedule. Standard commute times apply."
        },
        "walk": {
            "high": "🟢 Walking will bypass all vehicular delays, making it highly reliable. Watch for frustrated drivers at pedestrian crossings.",
            "medium": "🟢 A pleasant walk. Good opportunity for daily steps.",
            "low": "🟢 Ideal walking conditions. Direct routing is recommended."
        }
    }
    ai_rec = ai_recs.get(mode, {}).get(traffic, "Depart with caution and stay updated.")
    
    # Fuel/energy savings
    fuel_tips = {
        "car": {
            "high": "Avoid rapid acceleration and braking in stop-and-go traffic. Turn off your engine if static for more than 60 seconds (unless auto-start-stop is active).",
            "medium": "Maintain a steady pace and buffer space to avoid stop-start cycles. Keep windows closed at higher speeds to minimize drag.",
            "low": "Use cruise control on highway stretches. Keep tires inflated to recommended levels to minimize rolling resistance."
        },
        "bike": {
            "high": "Maintain a steady cadence to conserve your stamina. Use lower gears during restarts to reduce muscle strain.",
            "medium": "Coast when approaching red lights to conserve physical energy. Avoid heavy sprints.",
            "low": "Enjoy a steady cruise. Keep tires pumped to maximum rating to reduce rolling resistance."
        },
        "bus": {
            "high": "By taking public transit instead of a private car during gridlock, you reduce carbon emissions per passenger by up to 75%.",
            "medium": "Bus travel represents a highly efficient use of road space, reducing overall congestion and fuel consumption.",
            "low": "Public transit usage significantly reduces your overall environmental footprint."
        },
        "walk": {
            "high": "Walk at a moderate pace (approx. 4-5 km/h) to maintain cardiovascular efficiency without over-exertion.",
            "medium": "Wear comfortable, supportive walking shoes to minimize energy loss and joint stress.",
            "low": "Enjoy the calorie burn! A brisk walk burns roughly 200-300 calories per hour while releasing endorphins."
        }
    }
    fuel_tip = fuel_tips.get(mode, {}).get(traffic, "Maintain a steady, efficient speed.")
    
    # Safety tips
    safety_tips = {
        "car": {
            "high": "Maintain extra safety distance from the vehicle ahead. Bumper-to-bumper traffic increases the likelihood of minor rear-end collisions.",
            "medium": "Watch for sudden braking. Check blind spots carefully before lane changes.",
            "low": "Do not exceed speed limits even if the roads are clear. Stay focused, avoid distractions like phones."
        },
        "bike": {
            "high": "Be extremely visible. Wear high-visibility clothing. Watch out for 'dooring' from parked or stopped vehicles in gridlock.",
            "medium": "Use designated bike lanes. Signal clearly before turning or changing lanes. Make eye contact with drivers.",
            "low": "Wear a helmet at all times. Obey all traffic signals and signs."
        },
        "bus": {
            "high": "Hold on to handrails while the bus is in motion, as sudden stops are common in heavy traffic.",
            "medium": "Stand clear of the doors when they are opening and closing. Watch your step when exiting onto busy curbs.",
            "low": "Wait for the bus to come to a complete stop before moving towards the exit doors."
        },
        "walk": {
            "high": "Ensure drivers see you before crossing lanes of gridlocked cars. Drivers under stress are less likely to spot pedestrians.",
            "medium": "Use marked crosswalks and pedestrian signals. Do not jaywalk through moving lanes of traffic.",
            "low": "Stay alert. Avoid looking down at your phone or wearing noise-canceling headphones near intersections."
        }
    }
    safety_tip = safety_tips.get(mode, {}).get(traffic, "Stay alert and follow standard traffic rules.")
    
    return {
        "estimated_time": est_time,
        "congestion": congestion,
        "alternative_route": alt_route,
        "ai_recommendation": f"[DEMO MODE - Simulated Output] {ai_rec}",
        "fuel_saving_tip": fuel_tip,
        "safety_tip": safety_tip
    }

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "gemini_active": gemini_active,
        "mode": "Live AI" if gemini_active else "Simulated Demo"
    }

@app.post("/analyze", response_model=TrafficAnalysis)
def analyze_traffic(request: RouteRequest):
    # Validate inputs
    if request.traffic not in ["Low", "Medium", "High"]:
        raise HTTPException(status_code=400, detail="Traffic must be 'Low', 'Medium', or 'High'")
    if request.mode not in ["Car", "Bike", "Bus", "Walk"]:
        raise HTTPException(status_code=400, detail="Mode must be 'Car', 'Bike', 'Bus', or 'Walk'")
        
    # Check if we can use Gemini
    if gemini_active:
        try:
            # We use gemini-1.5-flash which is fast, cost-efficient, and supports structured JSON outputs
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config={
                    "response_mime_type": "application/json",
                    "response_schema": TrafficAnalysis,
                }
            )
            
            prompt = f"""
            You are TrafficSense AI, a state-of-the-art traffic prediction and travel assistant.
            Analyze the following travel request:
            - Source: {request.source}
            - Destination: {request.destination}
            - Current Traffic level: {request.traffic}
            - Travel Mode: {request.mode}

            Based on these inputs, generate a response containing:
            1. estimated_time: A realistic estimated travel time (e.g. '25 mins' or '1 hour 15 mins') between the source and destination for this travel mode and traffic level.
            2. congestion: A detailed, clear, and engaging explanation of the current congestion, possible bottle-necks (e.g. intersections, constructions), and delays.
            3. alternative_route: A concrete and clear suggestion of a secondary route (e.g. using specific side roads or alternative avenues) that can bypass the main traffic.
            4. ai_recommendation: Highly tailored travel advice for this specific scenario (e.g. suggest changing travel time, switching to a subway if available, or shifting modes).
            5. fuel_saving_tip: Active, specific fuel or energy saving tips for this travel mode (e.g., eco-driving, avoiding idling, coasting, or energy conservation advice for walking/cycling).
            6. safety_tip: Concrete, relevant safety advice for the travel conditions, road status, mode, and traffic level.
            """
            
            response = model.generate_content(prompt)
            data = json.loads(response.text)
            return TrafficAnalysis(**data)
            
        except Exception as e:
            # If Gemini fails, log and fallback to simulated response
            print(f"Gemini API Error: {e}. Falling back to simulation mode.")
            mock_data = generate_mock_analysis(request)
            # Remove demo label from fallback to provide seamless experience
            mock_data["ai_recommendation"] = mock_data["ai_recommendation"].replace("[DEMO MODE - Simulated Output] ", "")
            return TrafficAnalysis(**mock_data)
    else:
        # Fall back to simulated response
        mock_data = generate_mock_analysis(request)
        return TrafficAnalysis(**mock_data)

if __name__ == "__main__":
    import uvicorn
    # Allow port selection from env (useful for Render deployment)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
