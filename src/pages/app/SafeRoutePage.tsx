import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Loader2,
  HeartPulse,
  Phone
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { apiRequest } from '../../services/api';

export const SafeRoutePage: React.FC = () => {
  const { currentLocation, emergencyResources } = useSafety();
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    if (currentLocation.latitude !== 0 && currentLocation.longitude !== 0) {
      if (!startPoint) {
        setStartPoint(`${currentLocation.latitude}, ${currentLocation.longitude}`);
      }
    }
  }, [currentLocation, startPoint]);

  const presets = [
    { start: 'Market St & 4th', end: 'Powell St Metro Station' },
    { start: 'University Campus Gate', end: 'Highland Student Apartments' },
    { start: 'Tech Innovation Park', end: 'Crosstown Bus Depot' }
  ];

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const origin = startPoint || (currentLocation.latitude !== 0 ? `${currentLocation.latitude},${currentLocation.longitude}` : '');
      if (!origin) throw new Error("Starting point is required.");
      const res = await apiRequest(`/api/location/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(endPoint)}`);
      setRouteData(res);
      setIsCalculated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch directions.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (start: string, end: string) => {
    setStartPoint(start);
    setEndPoint(end);
    setIsCalculated(false);
    setRouteData(null);
  };

  // Derive nearby summary statistics from the actual emergency resources currently cached
  const policeCount = emergencyResources.filter(r => r.category === 'police').length;
  const hospitalCount = emergencyResources.filter(r => r.category === 'hospital' || r.category === 'ambulance').length;
  const helplineCount = emergencyResources.filter(r => r.category === 'helpline').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">
            Intelligent Navigation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Safe Route Check
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
            Evaluate walking and transit corridors based on proximity to verified emergency services.
          </p>
        </div>
      </div>

      {/* Route Inputs Form */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6">
        
        {/* Presets */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#B8B5C9] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            Quick Route Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(p.start, p.end)}
                className="px-3 py-1.5 rounded-xl bg-[#0B1020] hover:bg-[#151D33] border border-[#30263D] text-xs text-[#B8B5C9] hover:text-white transition-colors cursor-pointer"
              >
                {p.start.split(' ')[0]} → {p.end.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B5C9] block">Starting Point</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#2DD4BF] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="Origin address or landmark"
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B5C9] block">Destination</label>
            <div className="relative">
              <Navigation className="w-4 h-4 text-[#F43F6F] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="Destination address or landmark"
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#A78BFA] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg font-bold text-xs text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
              <span>{isLoading ? 'Calculating...' : 'Evaluate'}</span>
            </button>
          </div>
        </form>
        {error && (
          <div className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
      </div>

      {/* Evaluation Results Card */}
      {isCalculated && routeData && (
        <div className="space-y-6">
          
          {/* Main Score Banner */}
          <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#30263D]">
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center shrink-0">
                  <Navigation className="w-7 h-7 text-[#2DD4BF]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Route Calculated</h3>
                  </div>
                  <p className="text-xs text-[#B8B5C9] mt-1">
                    {routeData.startAddress} <ArrowRight className="inline w-3 h-3 mx-1" /> {routeData.endAddress}
                  </p>
                </div>
              </div>

              {/* ETA and Distance */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                  <span className="text-[#B8B5C9] text-[10px] block">Distance</span>
                  <span className="text-white font-bold text-sm">{routeData.distance}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                  <span className="text-[#B8B5C9] text-[10px] block">Estimated Time</span>
                  <span className="text-[#2DD4BF] font-bold text-sm">{routeData.duration}</span>
                </div>
              </div>

            </div>

            {/* Nearby Emergency Resources Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-[#A78BFA] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono text-[#2DD4BF]">
                    {policeCount} Found
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Police Stations</h4>
                <p className="text-[11px] text-[#B8B5C9] leading-relaxed">
                  Active nearby police dispatch nodes.
                </p>
              </div>

              <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-[#F43F6F] flex items-center justify-center">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono text-[#2DD4BF]">
                    {hospitalCount} Found
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Medical / Hospitals</h4>
                <p className="text-[11px] text-[#B8B5C9] leading-relaxed">
                  Nearby verified trauma or emergency clinics.
                </p>
              </div>

              <div className="bg-[#0B1020] border border-[#30263D] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono text-[#2DD4BF]">
                    {helplineCount} Found
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">Women's Helplines</h4>
                <p className="text-[11px] text-[#B8B5C9] leading-relaxed">
                  National or state designated support lines.
                </p>
              </div>
            </div>

          </div>

          {/* Turn-by-Turn Safety Guidance */}
          <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
              Safe Path Waypoints
            </h3>

            <div className="space-y-3 text-xs">
              {routeData.steps.map((step: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#0B1020] border border-[#30263D]">
                  <span className="font-mono text-teal-400 font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <span className="text-white font-semibold block">{step.instruction}</span>
                    <span className="text-[#B8B5C9] text-[11px] font-mono">Distance: {step.distance} • Time: {step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
