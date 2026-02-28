import { Users, MonitorSmartphone, Projector, Lightbulb, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';

/** Formats seconds into human-readable duration (e.g., "4m 05s"). */
function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 60) {
        const h = Math.floor(m / 60);
        return `${h}h ${m % 60}m`;
    }
    return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}

export default function RoomCard({ room }) {
    const { id, name, location, status, person_count, appliances, waste_detected, waste_duration } = room;

    const borderColor = waste_detected
        ? 'border-waste/40 shadow-waste/5'
        : status === 'recently_vacated'
            ? 'border-caution/30'
            : 'border-surface-700/40';

    return (
        <div
            className={`glass p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${borderColor} ${waste_detected ? 'animate-glow shadow-waste/10' : ''
                }`}
            id={`room-card-${id}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-white">{name}</h3>
                    <p className="text-xs text-surface-400 mt-0.5">{location}</p>
                </div>
                <StatusBadge status={status} />
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Person count */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-800/40">
                    <Users size={16} className={person_count > 0 ? 'text-brand-400' : 'text-surface-500'} />
                    <div>
                        <p className="text-lg font-bold text-white leading-none">{person_count}</p>
                        <p className="text-[10px] text-surface-500 mt-0.5">People</p>
                    </div>
                </div>

                {/* Waste duration */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-800/40">
                    <Clock size={16} className={waste_detected ? 'text-waste' : 'text-surface-500'} />
                    <div>
                        <p className={`text-lg font-bold leading-none ${waste_detected ? 'text-waste' : 'text-white'}`}>
                            {formatDuration(waste_duration)}
                        </p>
                        <p className="text-[10px] text-surface-500 mt-0.5">Waste Time</p>
                    </div>
                </div>
            </div>

            {/* Appliance status */}
            <div className="flex items-center gap-2">
                <ApplianceChip icon={Projector} label="Projector" on={appliances?.projector} />
                <ApplianceChip icon={MonitorSmartphone} label="Monitors" on={appliances?.monitors} />
                <ApplianceChip icon={Lightbulb} label="Lights" on={appliances?.lights} />
            </div>
        </div>
    );
}

function ApplianceChip({ icon: Icon, label, on }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${on
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'bg-surface-800/40 text-surface-500 border border-surface-700/20'
                }`}
            title={`${label}: ${on ? 'ON' : 'OFF'}`}
        >
            <Icon size={12} />
            {on ? 'ON' : 'OFF'}
        </span>
    );
}
