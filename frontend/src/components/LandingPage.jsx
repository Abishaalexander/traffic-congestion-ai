import React from 'react';
import { ArrowRight, Navigation, Cpu, Leaf, ShieldAlert, Clock } from 'lucide-react';
import GlassCard from './GlassCard';

export default function LandingPage({ onStart }) {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-traffic-blue" />,
      title: "Gemini AI Route Analysis",
      description: "Receive deep reasoning on traffic congestion, route details, and departure scheduling recommendations tailored for you."
    },
    {
      icon: <Navigation className="w-6 h-6 text-traffic-green" />,
      title: "Interactive OpenStreetMap",
      description: "Visualize routes and live geocoding between source and destination points on an interactive Leaflet map."
    },
    {
      icon: <Clock className="w-6 h-6 text-traffic-blue-light" />,
      title: "Accurate Duration Estimates",
      description: "Get real-world estimates on travel time for your exact transit mode, whether driving, biking, busing, or walking."
    },
    {
      icon: <Leaf className="w-6 h-6 text-traffic-green-light" />,
      title: "Eco & Fuel-Saving Tips",
      description: "Active tips on how to save fuel, minimize vehicle wear, conserve battery charge, or optimize personal energy during transit."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
      title: "Adaptive Safety Guidance",
      description: "Real-time safety tips tailored to the traffic level, travel mode, and roadway environment to secure your commute."
    }
  ];

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-12 md:py-24">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-traffic-blue/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-traffic-green/15 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 max-w-5xl text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-traffic-green animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Next-Gen Traffic Assistant</span>
        </div>

        {/* Main Hero Header */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Navigate Smarter with <br/>
            <span className="bg-gradient-to-r from-traffic-blue to-traffic-green bg-clip-text text-transparent">
              TrafficSense AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 font-light">
            An advanced AI-powered routing utility utilizing the Gemini API and interactive OpenStreetMap. Bypass gridlocks, reduce fuel costs, and ensure travel safety.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onStart}
            className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-traffic-blue-dark to-traffic-green hover:from-traffic-blue hover:to-traffic-green-light text-white font-bold rounded-full shadow-lg hover:shadow-traffic-blue/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Start Route Analysis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {features.slice(0, 3).map((f, i) => (
            <GlassCard key={i} hoverEffect={true} className="flex flex-col justify-between h-full bg-slate-900/30">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-slate-800/80 border border-slate-700/40">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-200">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{f.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
          {features.slice(3, 5).map((f, i) => (
            <GlassCard key={i} hoverEffect={true} className="flex flex-col justify-between h-full bg-slate-900/30">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-slate-800/80 border border-slate-700/40">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-200">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{f.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
