import React from 'react';
import { useSafety } from '../../context/SafetyContext';
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useSafety();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      {notifications.map((n) => {
        const isEmergency = n.type === 'emergency';
        const isSuccess = n.type === 'success';
        const isWarning = n.type === 'warning';

        return (
          <div
            key={n.id}
            className={`pointer-events-auto rounded-xl p-3.5 border shadow-2xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
              isEmergency
                ? 'bg-[#1A1028] border-[#FF6B6B] text-white shadow-rose-950/50'
                : isSuccess
                ? 'bg-[#1A1028] border-[#2DD4BF]/50 text-white shadow-teal-950/30'
                : isWarning
                ? 'bg-[#1A1028] border-amber-500/50 text-white'
                : 'bg-[#1A1028] border-[#30263D] text-[#B8B5C9]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isEmergency && <ShieldAlert className="w-5 h-5 text-[#FF6B6B] animate-pulse" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#2DD4BF]" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isEmergency && !isSuccess && !isWarning && <Info className="w-5 h-5 text-[#A78BFA]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white tracking-tight">{n.title}</div>
              <div className="text-xs text-[#B8B5C9] mt-0.5 leading-relaxed break-words">{n.message}</div>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-[#B8B5C9] hover:text-white p-1 transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
