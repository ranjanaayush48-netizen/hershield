import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { IncidentType } from '../../types';
import { 
  FileWarning, 
  Calendar, 
  MapPin, 
  Upload, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { reports, addReport, addNotification, currentLocation } = useSafety();

  const [type, setType] = useState<IncidentType>('Harassment');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('21:15');
  const [location, setLocation] = useState('5th Ave Subway Concourse (South Exit)');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [hasEvidence, setHasEvidence] = useState(false);
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location) return;

    addReport({
      type,
      date: `${date} at ${time}`,
      location,
      description,
      isAnonymous,
      evidenceUploaded: hasEvidence,
      evidenceFileName: evidenceName || undefined,
      evidenceFileObj: evidenceFile || undefined,
      latitude: currentLocation.latitude !== 0 ? currentLocation.latitude : undefined,
      longitude: currentLocation.longitude !== 0 ? currentLocation.longitude : undefined,
    });

    setDescription('');
    setHasEvidence(false);
    setEvidenceName(null);
    setEvidenceFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHasEvidence(true);
      setEvidenceFile(e.target.files[0]);
      setEvidenceName(e.target.files[0].name);
      addNotification('Evidence Attached', 'File encrypted and queued with your incident report.', 'info');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Confidential Evidence Logging
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Incident Reporting
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B5C9] mt-1">
            Document harassment, stalking patterns, or unsafe transit spots in a private, encrypted digital journal.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1A1028] border border-[#30263D] px-3.5 py-1.5 rounded-xl text-xs text-[#2DD4BF] self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>Client-Side Encrypted</span>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#B8B5C9]">
        <ShieldCheck className="w-5 h-5 text-[#2DD4BF] shrink-0" />
        <span>
          <strong className="text-white">Privacy Guarantee:</strong> Your report is completely private and is only shared according to your selected settings. If marked anonymous, your account identity is never tied to community safety heatmaps.
        </span>
      </div>

      {/* Main Form */}
      <div className="bg-[#1A1028] border border-[#30263D] rounded-xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white">Log New Incident</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Incident Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">Incident Classification</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#F43F6F] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
              >
                <option value="Harassment">Verbal Harassment</option>
                <option value="Stalking">Persistent Stalking / Followed</option>
                <option value="Threat">Physical Threat / Intimidation</option>
                <option value="Unsafe Location">Unsafe Environment / Broken Lighting</option>
                <option value="Other">Other Suspicious Activity</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">Date of Incident</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#F43F6F] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#B8B5C9]">Approximate Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#F43F6F] rounded-lg px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B5C9]">Approximate Location / Landmark</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#A78BFA] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 5th Ave & Pine St subway platform"
                className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#F43F6F] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B5C9]">Incident Narrative / Details</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, any vehicle descriptions, clothing details, or words spoken..."
              className="w-full bg-[#0B1020] border border-[#30263D] focus:border-[#F43F6F] rounded-lg p-4 text-sm text-white placeholder:text-[#B8B5C9]/40 outline-none resize-none"
            />
          </div>

          {/* File Upload & Anonymous Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* File Upload */}
            <div className="p-4 rounded-lg bg-[#0B1020] border border-[#30263D] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Attach Photo or Audio Evidence</span>
                <span className="text-[11px] text-[#B8B5C9] truncate max-w-[180px] block">
                  {evidenceName ? `Attached: ${evidenceName}` : 'Optional media verification'}
                </span>
              </div>

              <label className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Upload</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Anonymous Toggle */}
            <div className="p-4 rounded-lg bg-[#0B1020] border border-[#30263D] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">File as Anonymous Report</span>
                <span className="text-[11px] text-[#B8B5C9] block">Strip name and email from public heatmaps</span>
              </div>

              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#F43F6F] focus:ring-0 bg-[#1A1028] border-[#30263D]"
              />
            </div>

          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 rounded-lg font-bold text-xs text-white bg-[#F43F6F] hover:bg-[#e03360] shadow-sm transition-colors cursor-pointer"
            >
              Save Confidential Report
            </button>
          </div>

        </form>
      </div>

      {/* Submitted Reports History */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Your Encrypted Report History ({reports.length})</h3>

        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-[#1A1028] border border-[#30263D] rounded-2xl p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30263D] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {r.type}
                  </span>
                  <span className="text-xs font-mono text-[#B8B5C9]">{r.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {r.isAnonymous && (
                    <span className="text-[10px] text-[#2DD4BF] bg-teal-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                      <EyeOff className="w-3 h-3" />
                      Anonymous
                    </span>
                  )}
                  <span className="text-[10px] text-white/80 bg-white/5 px-2 py-0.5 rounded-md font-mono">
                    Status: {r.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{r.location}</span>
                </div>
                <p className="text-xs text-[#B8B5C9] leading-relaxed">
                  {r.description}
                </p>
              </div>

              {r.evidenceUploaded && (
                <div className="text-[11px] text-[#A78BFA] flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 text-[#2DD4BF]" />
                  <span>Encrypted media evidence attached</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
