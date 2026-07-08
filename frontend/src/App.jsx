import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TrafficAssistant from './components/TrafficAssistant';
import { Cpu, Globe } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'assistant'

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-traffic-blue/30 selection:text-traffic-blue-light">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 w-full z-50 bg-[#0b0f19]/70 backdrop-blur-md border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-br from-traffic-blue to-traffic-green rounded-xl text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-350 bg-clip-text text-transparent">
                TrafficSense
              </span>
              <span className="ml-1 text-xs font-bold text-traffic-green px-1.5 py-0.5 rounded bg-traffic-green/10 border border-traffic-green/20">
                AI
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('landing')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'landing' ? 'text-traffic-blue-light' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('assistant')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'assistant' ? 'text-traffic-blue-light' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Traffic Assistant
            </button>

            <div className="w-[1px] h-4 bg-slate-800"></div>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          </nav>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage onStart={() => setCurrentView('assistant')} />
        ) : (
          <TrafficAssistant />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#070b13] border-t border-slate-900 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} TrafficSense AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Powered by OpenStreetMap & Gemini
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-traffic-green"></div>
            <span>Ready for Netlify & Render</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
