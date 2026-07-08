import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons path resolution in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function TrafficMap({ source, destination, trafficLevel, isAnalyzing }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef([]);
  
  const [mapError, setMapError] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Create map instance centered on a default location (e.g., London / global view)
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([20, 0], 2); // Global default zoom

    // Use a beautiful dark-themed OpenStreetMap style tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when source, destination or traffic level changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !source || !destination) return;

    const fetchRoute = async () => {
      setLoadingRoute(true);
      setMapError(null);
      
      // Clear previous routes and markers
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];

      try {
        // Step 1: Geocode Source and Destination using OpenStreetMap Nominatim API
        // nominatim requests require custom user-agent to avoid blocking
        const headers = { 'User-Agent': 'TrafficSenseAI-Client/1.0' };
        
        const sourceUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(source)}&limit=1`;
        const destUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`;

        const [sourceRes, destRes] = await Promise.all([
          fetch(sourceUrl, { headers }),
          fetch(destUrl, { headers })
        ]);

        const sourceData = await sourceRes.json();
        const destData = await destRes.json();

        if (sourceData.length === 0) {
          throw new Error(`Could not locate source address: "${source}"`);
        }
        if (destData.length === 0) {
          throw new Error(`Could not locate destination address: "${destination}"`);
        }

        const sourceLatLng = [parseFloat(sourceData[0].lat), parseFloat(sourceData[0].lon)];
        const destLatLng = [parseFloat(destData[0].lat), parseFloat(destData[0].lon)];

        // Step 2: Create Custom HTML Icons for Source and Destination
        const sourceIcon = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-5 h-5 rounded-full bg-traffic-blue opacity-50 animate-ping"></div>
                   <div class="w-4 h-4 rounded-full bg-traffic-blue border-2 border-white shadow-md z-10"></div>
                 </div>`,
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const destIcon = L.divIcon({
          html: `<div class="relative flex items-center justify-center">
                   <div class="absolute w-5 h-5 rounded-full bg-traffic-green opacity-50 animate-ping"></div>
                   <div class="w-4 h-4 rounded-full bg-traffic-green border-2 border-white shadow-md z-10"></div>
                 </div>`,
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        // Add markers
        const sourceMarker = L.marker(sourceLatLng, { icon: sourceIcon })
          .bindPopup(`<b>Start:</b> ${sourceData[0].display_name.split(',')[0]}`)
          .addTo(map);
          
        const destMarker = L.marker(destLatLng, { icon: destIcon })
          .bindPopup(`<b>End:</b> ${destData[0].display_name.split(',')[0]}`)
          .addTo(map);

        markersRef.current = [sourceMarker, destMarker];

        // Step 3: Fetch Road Network Route via OSRM (Open Source Routing Machine) API
        // API URL format: driving/lon1,lat1;lon2,lat2
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${sourceLatLng[1]},${sourceLatLng[0]};${destLatLng[1]},${destLatLng[0]}?overview=full&geometries=geojson`;
        
        let pathCoords = [sourceLatLng, destLatLng]; // Fallback to straight line
        let usingRoads = false;

        try {
          const routeRes = await fetch(osrmUrl);
          const routeData = await routeRes.json();
          if (routeData.code === 'Ok' && routeData.routes && routeData.routes.length > 0) {
            // Convert OSRM coordinates [lon, lat] back to Leaflet [lat, lon]
            const geojsonCoords = routeData.routes[0].geometry.coordinates;
            pathCoords = geojsonCoords.map(coord => [coord[1], coord[0]]);
            usingRoads = true;
          }
        } catch (routeErr) {
          console.warn("OSRM routing failed, falling back to straight-line path.", routeErr);
        }

        // Step 4: Determine route color based on traffic level
        let pathColor = '#0ea5e9'; // Traffic Low: Blue
        if (trafficLevel === 'Medium') {
          pathColor = '#eab308'; // Traffic Medium: Yellow/Orange
        } else if (trafficLevel === 'High') {
          pathColor = '#ef4444'; // Traffic High: Red
        }

        // Draw polyline
        const polyline = L.polyline(pathCoords, {
          color: pathColor,
          weight: 5,
          opacity: 0.85,
          dashArray: usingRoads ? null : '10, 10', // dashed if straight line fallback
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        routeLayerRef.current = polyline;

        // Auto-zoom the map to fit both markers
        const bounds = L.latLngBounds([sourceLatLng, destLatLng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });

      } catch (err) {
        console.error("Geocoding or map drawing failed:", err);
        setMapError(err.message || "Failed to update routing map.");
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [source, destination, trafficLevel]);

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[500px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-inner">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Overlay: Loader */}
      {(loadingRoute || isAnalyzing) && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3 transition-opacity">
          <div className="w-8 h-8 rounded-full border-2 border-traffic-blue border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-300 font-light tracking-wide">
            {isAnalyzing ? "AI Analyzing Route..." : "Updating Map Routing..."}
          </p>
        </div>
      )}

      {/* Overlay: Error Panel */}
      {mapError && (
        <div className="absolute top-4 left-4 right-4 bg-red-950/80 border border-red-800/50 backdrop-blur-md px-4 py-3 rounded-xl z-10 text-sm text-red-300 flex items-center justify-between">
          <span>{mapError}</span>
          <button 
            onClick={() => setMapError(null)} 
            className="text-red-400 hover:text-red-200 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
