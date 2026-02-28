import { Users, MonitorSmartphone, Projector, Lightbulb, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { GlareCard } from './ui/glare-card';

function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 60) { const h = Math.floor(m / 60); return `${h}h ${m % 60}m`; }
    return m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
}

export default function RoomCard({ room }) {
    const { id, name, location, status, person_count, appliances, waste_detected, waste_duration } = room;

    return (
        <GlareCard
            className={`p-5 transition-all duration-300 ${waste_detected ? 'border-red-500/30' : ''}`}
            id={`room-card-${id}`}
        >
            {/* Corner brackets */}
            <span className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${waste_detected ? 'border-red-500/40' : 'border-cyan-500/30'}`} />
            <span className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${waste_detected ? 'border-red-500/40' : 'border-cyan-500/30'}`} />
            <span className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${waste_detected ? 'border-red-500/40' : 'border-cyan-500/30'}`} />
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${waste_detected ? 'border-red-500/40' : 'border-cyan-500/30'}`} />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--ww-text-1)] tracking-wide">{name}</h3>
                    <p className="text-[10px] font-mono text-[var(--ww-text-muted)] mt-0.5 tracking-wider uppercase">{location}</p>
                </div>
                <StatusBadge status={status} />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--ww-card-2)] border border-[var(--ww-border)]">
                    <Users size={14} className={person_count > 0 ? 'text-cyan-400' : 'text-[var(--ww-text-muted)]'} />
                    <div>
                        <p className="text-base font-bold text-[var(--ww-text-1)] font-mono leading-none">{person_count}</p>
                        <p className="text-[9px] font-mono text-[var(--ww-text-muted)] mt-0.5 tracking-wider">PEOPLE</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--ww-card-2)] border border-[var(--ww-border)]">
                    <Clock size={14} className={waste_detected ? 'text-red-400' : 'text-[var(--ww-text-muted)]'} />
                    <div>
                        <p className={`text-base font-bold font-mono leading-none ${waste_detected ? 'text-red-400' : 'text-[var(--ww-text-1)]'}`}>
                            {formatDuration(waste_duration)}
                        </p>
                        <p className="text-[9px] font-mono text-[var(--ww-text-muted)] mt-0.5 tracking-wider">WASTE</p>
                    </div>
                </div>
            </div>

            {/* Appliances */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <ApplianceChip icon={Projector}        label="Projector" on={appliances?.projector} />
                <ApplianceChip icon={MonitorSmartphone} label="Monitors" on={appliances?.monitors} />
                <ApplianceChip icon={Lightbulb}         label="Lights"  on={appliances?.lights} />
            </div>
        </GlareCard>
    );
}

function ApplianceChip({ icon: Icon, label, on }) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-mono font-medium tracking-wider transition-colors ${
                on
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-[var(--ww-card-2)] text-[var(--ww-text-muted)] border border-[var(--ww-border)]'
            }`}
            title={`${label}: ${on ? 'ON' : 'OFF'}`}
        >
            <Icon size={11} />
            {on ? 'ON' : 'OFF'}
        </span>
    );
}
