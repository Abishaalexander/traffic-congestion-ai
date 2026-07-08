import React, { useState, useEffect } from 'react';
import { 
  Car, Bike, Bus, Footprints, 
  Search, RefreshCw, Clock, AlertTriangle, 
  MapPin, Brain, Leaf, Shield, AlertCircle
} from 'lucide-react';
import GlassCard from './GlassCard';
import TrafficMap from './TrafficMap';

// Configurable API base URL (uses Render env-defined port or local default 8000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TrafficAssistant() {
  // Input states
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [traffic, setTraffic] = useState('Medium'); // Default
  const [mode, setMode] = useState('Car'); // Default

  // Map state (triggers geocoding & route drawing)
  const [mapSource, setMapSource] = useState('');
  const [mapDest, setMapDest] = useState('');

  // Result and Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('AI is initializing analysis...');

  // Cycling loading messages to keep user engaged
  useEffect(() => {
    if (!loading) return;
    
    const messages = [
      'Contacting TrafficSense AI Engine...',
      'Geocoding source and destination coordinates...',
      'Running spatial analysis on routing paths...',
      'Querying Gemini AI for congestion explanation...',
      'Synthesizing personalized energy-saving tips...',
      'Generating custom safety recommendations...',
      'Assembling final route intelligence dashboard...'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingMessage(messages[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) {
      setError("Please enter both Source and Destination addresses.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    // Update map locations first so map shows geocoding loader
    setMapSource(source);
    setMapDest(destination);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: source.trim(),
          destination: destination.trim(),
          traffic,
          mode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned ${response.status} error.`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error("Analysis API failed:", err);
      setError(err.message || "Failed to contact backend API. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSource('');
    setDestination('');
    setTraffic('Medium');
    setMode('Car');
    setMapSource('');
    setMapDest('');
    setAnalysis(null);
    setError(null);
  };

  // Travel Mode configurations
  const travelModes = [
    { name: 'Car', icon: <Car className="w-5 h-5" />, desc: 'Personal Drive' },
    { name: 'Bike', icon: <Bike className="w-5 h-5" />, desc: 'Cycle Route' },
    { name: 'Bus', icon: <Bus className="w-5 h-5" />, desc: 'Public Transit' },
    { name: 'Walk', icon: <Footprints className="w-5 h-5" />, desc: 'Footpath' },
  ];

  // Traffic Level configurations
  const trafficLevels = [
    { name: 'Low', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' },
    { name: 'Medium', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' },
    { name: 'High', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' },
  ];

  return (
    <div className="relative min-h-[90vh] py-8 px-4 max-w-7xl mx-auto space-y-8 z-10">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-traffic-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-traffic-green/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          AI-Powered Traffic Assistant
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl">
          Enter route details below to fetch optimal pathways, Gemini AI routing advice, and local road forecasts.
        </p>
      </div>

      {/* Main Grid: Form, Results & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Inputs & Results (7 columns on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Input Form Panel */}
          <GlassCard className="bg-slate-900/20">
            <form onSubmit={handleAnalyze} className="space-y-6">
              
              {/* Source & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Source Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-traffic-blue" />
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="e.g. Times Square, NY"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Destination Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-traffic-green" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Brooklyn Bridge, NY"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Traffic Level Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Current Traffic Density
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {trafficLevels.map((level) => (
                    <button
                      key={level.name}
                      type="button"
                      onClick={() => setTraffic(level.name)}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-300 cursor-pointer ${
                        traffic === level.name
                          ? level.name === 'Low'
                            ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                            : level.name === 'Medium'
                            ? 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                            : 'bg-rose-500/25 border-rose-500 text-rose-300 ring-2 ring-rose-500/20'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {level.name} Density
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Travel Mode
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {travelModes.map((tMode) => (
                    <button
                      key={tMode.name}
                      type="button"
                      onClick={() => setMode(tMode.name)}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        mode === tMode.name
                          ? 'bg-traffic-blue/20 border-traffic-blue text-traffic-blue-light shadow-md shadow-traffic-blue/10 ring-2 ring-traffic-blue/20'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700/50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/30">
                        {tMode.icon}
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold block">{tMode.name}</span>
                        <span className="text-[10px] text-slate-500 block">{tMode.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-traffic-blue to-traffic-green hover:from-traffic-blue-light hover:to-traffic-green-light text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span>Analyze Traffic</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-300 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  Clear
                </button>
              </div>

            </form>
          </GlassCard>

          {/* Error Message Panel */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-900/40 rounded-2xl text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              <GlassCard className="bg-slate-900/10 py-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-traffic-blue animate-spin"></div>
                  <div className="absolute inset-1.5 rounded-full border-4 border-t-traffic-green animate-spin-reverse opacity-70"></div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-base font-bold text-slate-200 animate-pulse">Running Analysis...</p>
                  <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">{loadingMessage}</p>
                </div>
              </GlassCard>

              {/* Shimmer skeleton cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(idx => (
                  <GlassCard key={idx} className="bg-slate-900/10 space-y-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent -translate-x-full animate-shimmer"></div>
                    <div className="w-24 h-4 bg-slate-800 rounded"></div>
                    <div className="w-full h-8 bg-slate-800/60 rounded"></div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysis && !loading && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Primary Highlights: Travel Time and Traffic Alert */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Travel Time Card */}
                <GlassCard className="bg-gradient-to-br from-traffic-blue/10 to-slate-900/20 border-traffic-blue/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-traffic-blue/5 rounded-full blur-2xl"></div>
                  <div className="flex gap-4">
                    <div className="p-3.5 rounded-xl bg-traffic-blue/10 border border-traffic-blue/20 text-traffic-blue-light h-fit">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                        Estimated Travel Time
                      </span>
                      <p className="text-3xl font-extrabold text-white tracking-tight">
                        {analysis.estimated_time}
                      </p>
                      <p className="text-xs text-slate-400 font-light">
                        Calculated for {mode.toLowerCase()} travel.
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Congestion Level Alert Card */}
                <GlassCard className={`relative overflow-hidden border-opacity-35 ${
                  traffic === 'Low' 
                    ? 'bg-emerald-950/15 border-emerald-500/20' 
                    : traffic === 'Medium' 
                    ? 'bg-amber-950/15 border-amber-500/20' 
                    : 'bg-rose-950/15 border-rose-500/20'
                }`}>
                  <div className="flex gap-4">
                    <div className={`p-3.5 rounded-xl border h-fit ${
                      traffic === 'Low' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : traffic === 'Medium' 
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                        Congestion Level
                      </span>
                      <p className={`text-3xl font-extrabold tracking-tight ${
                        traffic === 'Low' ? 'text-emerald-400' : traffic === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {traffic} Density
                      </p>
                      <p className="text-xs text-slate-400 font-light">
                        Current road congestion factor.
                      </p>
                    </div>
                  </div>
                </GlassCard>

              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Congestion Explanation */}
                <GlassCard className="bg-slate-900/30 flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-slate-200">Congestion Summary</h4>
                  </div>
                  <p className="text-sm text-slate-350 leading-relaxed font-light flex-1">
                    {analysis.congestion}
                  </p>
                </GlassCard>

                {/* Alternative Route Suggestion */}
                <GlassCard className="bg-slate-900/30 flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <MapPin className="w-5 h-5 text-traffic-blue" />
                    <h4 className="font-bold text-slate-200">Suggested Alternative</h4>
                  </div>
                  <p className="text-sm text-slate-350 leading-relaxed font-light flex-1">
                    {analysis.alternative_route}
                  </p>
                </GlassCard>

                {/* AI Recommendation */}
                <GlassCard className="bg-slate-900/30 md:col-span-2 flex flex-col gap-4 border-l-2 border-l-traffic-blue">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-slate-200">AI Recommendation</h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal italic">
                    {analysis.ai_recommendation}
                  </p>
                </GlassCard>

                {/* Fuel Saving Tips */}
                <GlassCard className="bg-slate-900/30 flex flex-col gap-4 border-l-2 border-l-traffic-green">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <Leaf className="w-5 h-5 text-traffic-green" />
                    <h4 className="font-bold text-slate-200">Energy & Fuel Saving</h4>
                  </div>
                  <p className="text-sm text-slate-350 leading-relaxed font-light flex-1">
                    {analysis.fuel_saving_tip}
                  </p>
                </GlassCard>

                {/* Safety Advice */}
                <GlassCard className="bg-slate-900/30 flex flex-col gap-4 border-l-2 border-l-rose-500">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <Shield className="w-5 h-5 text-rose-400" />
                    <h4 className="font-bold text-slate-200">Safety Guidelines</h4>
                  </div>
                  <p className="text-sm text-slate-350 leading-relaxed font-light flex-1">
                    {analysis.safety_tip}
                  </p>
                </GlassCard>

              </div>

            </div>
          )}

        </div>

        {/* Right Side: Map Display (5 columns on desktop) */}
        <div className="lg:col-span-5 h-full">
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Interactive Routing Map
              </label>
              {mapSource && mapDest && (
                <span className="text-[10px] text-slate-500 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded-full">
                  OSM + OSRM Live
                </span>
              )}
            </div>
            
            <TrafficMap 
              source={mapSource}
              destination={mapDest}
              trafficLevel={traffic}
              isAnalyzing={loading}
            />

            <div className="p-3 bg-slate-950/40 border border-slate-900/80 rounded-xl text-[10px] text-slate-500 font-light leading-relaxed">
              💡 <b>Tip:</b> Try typing full cities or specific street names (e.g. "Paris, France" or "JFK Airport, New York"). The map utilizes Nominatim geocoding to resolve locations and OSRM to render coordinates.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
