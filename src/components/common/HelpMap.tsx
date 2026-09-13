import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EmergencyResource } from '../../types';

interface HelpMapProps {
  userLocation?: { latitude: number; longitude: number } | null;
  resources: EmergencyResource[];
  onSelectResource?: (resource: EmergencyResource) => void;
}

export const HelpMap: React.FC<HelpMapProps> = ({
  userLocation,
  resources,
  onSelectResource,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Default fallback center (e.g. New Delhi / India center if no GPS)
  const defaultLat = 28.6139;
  const defaultLon = 77.2090;

  const userLat = userLocation?.latitude;
  const userLon = userLocation?.longitude;

  const centerLat = userLat && !isNaN(userLat) && userLat !== 0 ? userLat : defaultLat;
  const centerLon = userLon && !isNaN(userLon) && userLon !== 0 ? userLon : defaultLon;

  // Icon generator per category
  const createCategoryIcon = (category: string) => {
    const cat = (category || '').toLowerCase();
    let bgColor = 'bg-teal-600';
    let borderColor = 'border-teal-300';
    let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

    if (cat.includes('police')) {
      bgColor = 'bg-rose-600';
      borderColor = 'border-rose-300';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    } else if (cat.includes('hospital') || cat.includes('ambulance') || cat.includes('clinic')) {
      bgColor = 'bg-emerald-600';
      borderColor = 'border-emerald-300';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`;
    } else if (cat.includes('pharmacy')) {
      bgColor = 'bg-purple-600';
      borderColor = 'border-purple-300';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>`;
    } else if (cat.includes('help') || cat.includes('women') || cat.includes('shelter')) {
      bgColor = 'bg-pink-600';
      borderColor = 'border-pink-300';
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    }

    return L.divIcon({
      className: 'custom-resource-marker bg-transparent border-none',
      html: `
        <div class="${bgColor} ${borderColor} border-2 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-md shadow-black/60 transform transition-transform hover:scale-110">
          ${svgIcon}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  };

  // User location marker icon
  const createUserIcon = () => {
    return L.divIcon({
      className: 'custom-user-marker bg-transparent border-none',
      html: `
        <div class="relative flex items-center justify-center w-9 h-9">
          <div class="absolute w-9 h-9 rounded-full bg-[#2DD4BF]/40 animate-ping"></div>
          <div class="w-5 h-5 rounded-full bg-[#2DD4BF] border-2 border-white shadow-lg shadow-teal-950/80"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: 13,
        zoomControl: true,
      });

      // OpenStreetMap Tiles (Dark/Standard responsive tile layer)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapRef.current = map;
    }

    // Invalidate map size to prevent gray missing tiles when container rendered
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update Center & Render Markers
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    // Add user marker if valid GPS available
    if (userLat && userLon && !isNaN(userLat) && !isNaN(userLon) && userLat !== 0 && userLon !== 0) {
      const userLatLng: [number, number] = [userLat, userLon];
      bounds.push(userLatLng);

      const userMarker = L.marker(userLatLng, { icon: createUserIcon() }).addTo(markersGroup);
      userMarker.bindPopup(`
        <div class="p-1 font-sans text-xs">
          <div class="font-bold text-[#2DD4BF] uppercase tracking-wider text-[10px]">Your Live GPS Location</div>
          <div class="text-slate-800 font-semibold mt-0.5">Accurate emergency coordinates active</div>
        </div>
      `);
    }

    // Add places markers
    resources.forEach((res) => {
      if (!res.latitude || !res.longitude || isNaN(res.latitude) || isNaN(res.longitude)) return;

      const placeLatLng: [number, number] = [res.latitude, res.longitude];
      bounds.push(placeLatLng);

      const marker = L.marker(placeLatLng, { icon: createCategoryIcon(res.category) }).addTo(markersGroup);

      const popupHtml = `
        <div class="p-2 font-sans text-xs space-y-1.5 min-w-[180px]">
          <span class="inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-teal-100 text-teal-800">
            ${res.category || 'Help Service'}
          </span>
          <h4 class="font-bold text-slate-900 text-sm leading-snug">${res.name}</h4>
          <p class="text-slate-600 text-[11px] leading-tight">${res.address || 'Address available'}</p>
          <div class="text-teal-700 font-semibold text-[11px]">Distance: ${res.distance || 'Nearby'}</div>
          ${res.phone ? `<div class="font-mono text-slate-800 text-[11px]">Tel: ${res.phone}</div>` : ''}
          <div class="pt-1 flex items-center gap-1.5">
            <a 
              href="tel:${res.phone}" 
              class="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded hover:bg-emerald-700 inline-block no-underline"
            >
              Call
            </a>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(res.address || res.name)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="px-2.5 py-1 bg-slate-800 text-white font-bold text-[10px] rounded hover:bg-slate-900 inline-block no-underline"
            >
              Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onSelectResource) {
        marker.on('click', () => {
          onSelectResource(res);
        });
      }
    });

    // Fit bounds or set view
    if (bounds.length > 1) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 15 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else {
      map.setView([centerLat, centerLon], 13);
    }
  }, [userLat, userLon, resources]);

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-2xl overflow-hidden border border-[#30263D] shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-10" />

      {/* Map Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] bg-[#1A1028]/90 backdrop-blur-md border border-[#30263D] rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse"></span>
          <span className="font-semibold text-[#2DD4BF]">Your GPS</span>
        </div>
        <div className="flex items-center gap-3 text-[#B8B5C9]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-white">Police</span></span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-white">Medical</span></span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-white">Pharmacy</span></span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500"></span><span className="text-white">Helpline/Shelter</span></span>
        </div>
      </div>
    </div>
  );
};
