import React, { useState, useEffect } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { EmergencyResource } from '../../types';
import { OFFICIAL_INDIAN_SERVICES, OFFICIAL_DISCLAIMER } from '../../data/emergencyServicesIndia';
import { HelpMap } from '../../components/common/HelpMap';
import { 
  Phone, 
  MapPin, 
  Navigation, 
  Search, 
  AlertTriangle,
  ExternalLink,
  X,
  Layers
} from 'lucide-react';

export const FindHelpPage: React.FC = () => {
  const { emergencyResources, currentLocation, refreshLocation } = useSafety();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResourceDetail, setActiveResourceDetail] = useState<EmergencyResource | null>(null);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  const categories = [
    'All',
    'Police',
    'Hospital',
    'Ambulance',
    'Women Helpline',
    'Shelter',
    'Pharmacy'
  ];

  const filtered = (emergencyResources || []).filter((res) => {
    const catLower = (res.category || '').toLowerCase();
    const selLower = selectedCategory.toLowerCase();
    const matchesCategory = 
      selectedCategory === 'All' || 
      catLower === selLower ||
      (selectedCategory === 'Women Helpline' && (catLower.includes('help') || catLower.includes('women'))) ||
      (selectedCategory === 'Police' && catLower.includes('police')) ||
      (selectedCategory === 'Hospital' && (catLower.includes('hospital') || catLower.includes('clinic'))) ||
      catLower.includes(selLower);
    const matchesSearch = 
      (res.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header with Official Emergency Dialers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-wider">
            Verified Emergency Directory & Live Physical Resources
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Find Nearby Help & Safe Havens
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1 max-w-2xl">
            Access official national emergency lines and nearby verified police precincts, hospitals, and pharmacies based on your real coordinates.
          </p>
        </div>

        {/* Official Emergency Lines */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <a
            href="tel:112"
            className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-[#FF6B6B] hover:bg-rose-500/25 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 112 (Emergency)</span>
          </a>

          <a
            href="tel:181"
            className="px-4 py-2 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] hover:bg-[#A78BFA]/25 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 181 (Women Helpline)</span>
          </a>
        </div>
      </div>

      {/* Official Emergency Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">
          {OFFICIAL_DISCLAIMER}
        </p>
      </div>

      {/* Official Emergency Hotlines Card Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {OFFICIAL_INDIAN_SERVICES.slice(0, 4).map((service) => (
          <div key={service.id} className="p-3.5 rounded-2xl bg-[#1A1028] border border-[#30263D] flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#2DD4BF] block">{service.badge}</span>
              <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{service.name}</h4>
              <p className="text-[11px] text-[#B8B5C9] mt-0.5">{service.availability}</p>
            </div>
            <a
              href={`tel:${service.number}`}
              className="mt-3 py-1.5 px-3 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-[11px] font-bold text-[#2DD4BF] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Dial {service.number}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#B8B5C9] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, category, or address..."
              className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#2DD4BF] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2DD4BF] text-[#0B1020] font-bold'
                  : 'bg-[#0B1020] text-[#B8B5C9] hover:text-white border border-[#30263D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2DD4BF]" />
            <h2 className="text-base font-bold text-white tracking-tight">Interactive Emergency Map</h2>
          </div>
          <span className="text-xs text-[#B8B5C9]">
            {filtered.length} place{filtered.length === 1 ? '' : 's'} displayed
          </span>
        </div>
        <div className="h-[380px] w-full">
          <HelpMap
            userLocation={currentLocation}
            resources={filtered}
            onSelectResource={(res) => setActiveResourceDetail(res)}
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => {
          const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(res.address || res.name)}`;
          return (
            <div
              key={res.id}
              className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-[#2DD4BF]/50 transition-colors"
            >
              <div className="space-y-3">
                
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#2DD4BF] bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                    {res.category}
                  </span>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    res.isOpen 
                      ? 'text-teal-400 bg-teal-500/10' 
                      : 'text-amber-400 bg-amber-500/10'
                  }`}>
                    {res.isOpen ? 'Open (24/7 Service)' : 'Check Hours'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{res.name}</h3>

                {/* Details list */}
                <div className="space-y-1.5 text-xs text-[#B8B5C9] pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F43F6F] shrink-0 mt-0.5" />
                    <span className="truncate">{res.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                    <span>{res.distance}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                    <span className="font-mono text-white">{res.phone}</span>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#30263D] grid grid-cols-3 gap-2">
                <a
                  href={`tel:${res.phone}`}
                  className="py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-xs font-bold text-[#2DD4BF] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>

                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#30263D] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Route</span>
                </a>

                <button
                  onClick={() => setActiveResourceDetail(res)}
                  className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#30263D] text-xs font-semibold text-[#B8B5C9] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {activeResourceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#30263D]">
              <div>
                <span className="text-xs uppercase font-bold text-[#2DD4BF]">
                  {activeResourceDetail.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {activeResourceDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveResourceDetail(null)}
                className="p-1.5 text-[#B8B5C9] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#B8B5C9]">
              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D] space-y-1">
                <span className="font-bold text-white block">Street Address</span>
                <p>{activeResourceDetail.address}</p>
                <p className="text-[11px] text-[#A78BFA]">{activeResourceDetail.distance}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D] space-y-1">
                <span className="font-bold text-white block">Emergency Telephone Line</span>
                <p className="font-mono text-white text-sm">{activeResourceDetail.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#30263D] space-y-1">
                <span className="font-bold text-white block">Operation Hours & Support</span>
                <p className="text-teal-400 font-semibold">{activeResourceDetail.hours}</p>
                <p className="text-[11px] leading-relaxed mt-1">
                  {activeResourceDetail.description || 'Verified facility for rapid emergency assistance and crisis support.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeResourceDetail.address || activeResourceDetail.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/15 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </a>
              <a
                href={`tel:${activeResourceDetail.phone}`}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-[#0B1020] bg-[#2DD4BF] hover:bg-[#26b8a3] transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Direct Now</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
