import {
    Zap, Users, AlertTriangle, Shield, TrendingDown, Clock, Activity,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import { useEnergy } from '../hooks/useEnergy';
import { useApp } from '../context/AppContext';
import RoomCard from '../components/RoomCard';
import EnergyChart from '../components/EnergyChart';
import { GlareCard } from '../components/ui/glare-card';
import { Tabs } from '../components/ui/tabs';

export default function Dashboard() {
    const { rooms, secureCount, wasteCount, totalPeople } = useRooms();
    const { energyWasted, costWasted, totalWasteDuration, hourlyData } = useEnergy();
    const { alerts } = useApp();

    const wasteMins = Math.floor(totalWasteDuration / 60);
    const wasteHrs  = Math.floor(wasteMins / 60);
    const wasteTimeStr = wasteHrs > 0 ? `${wasteHrs}h ${wasteMins % 60}m` : `${wasteMins}m`;

    const analyticsTabs = [
        {
            title: 'Energy Trend',
            value: 'energy',
            content: (
                <div className="w-full h-full rounded-xl overflow-hidden">
                    <EnergyChart data={hourlyData} variant="area" title="Energy Trend — Last 24 Hours" />
                </div>
            ),
        },
        {
            title: 'Alerts',
            value: 'alerts',
            content: (
                <div className="w-full h-full glass p-5 rounded-xl overflow-y-auto">
                    <AlertList alerts={alerts} />
                </div>
            ),
        },
        {
            title: 'Bar Chart',
            value: 'bar',
            content: (
                <div className="w-full h-full rounded-xl overflow-hidden">
                    <EnergyChart data={hourlyData} variant="bar" title="Hourly Energy Breakdown" />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ── Page header ───────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                        <h1 className="brand-wordmark text-xl text-white tracking-wide">
                            Overview
                        </h1>
                    </div>
                    <p className="text-[11px] font-mono text-slate-600 tracking-[0.2em] uppercase ml-3">
                        Real-time campus energy monitoring
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/10 bg-cyan-500/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    <span className="text-[10px] font-mono text-cyan-600 tracking-widest">SYSTEM ACTIVE</span>
                </div>
            </div>

            {/* ── Metric cards (GlareCard) ──────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlareCard className="p-5">
                    <MetricInner
                        icon={Shield} iconColor="text-emerald-400" iconBg="bg-emerald-500/10"
                        label="Secure Rooms" value={secureCount} sub={`of ${rooms.length} total`}
                        accent="#34d399"
                    />
                </GlareCard>
                <GlareCard className="p-5">
                    <MetricInner
                        icon={AlertTriangle} iconColor="text-red-400" iconBg="bg-red-500/10"
                        label="Waste Detected" value={wasteCount}
                        sub={wasteCount > 0 ? 'Action needed' : 'All clear'}
                        pulse={wasteCount > 0}
                        accent="#f87171"
                    />
                </GlareCard>
                <GlareCard className="p-5">
                    <MetricInner
                        icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-500/10"
                        label="Occupancy" value={totalPeople} sub="People on campus"
                        accent="#22d3ee"
                    />
                </GlareCard>
                <GlareCard className="p-5">
                    <MetricInner
                        icon={Zap} iconColor="text-amber-400" iconBg="bg-amber-500/10"
                        label="Energy Wasted" value={`${energyWasted} Wh`}
                        sub={`≈ ₹${costWasted}`}
                        accent="#fbbf24"
                    />
                </GlareCard>
            </div>

            {/* ── Analytics tabs ────────────────────────────────── */}
            <div>
                <SectionHeader label="Analytics" />
                <div className="h-[22rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start mt-3">
                    <Tabs tabs={analyticsTabs} contentClassName="mt-28" />
                </div>
            </div>

            {/* ── Room status grid ──────────────────────────────── */}
            <div className="mt-4">
                <SectionHeader label="Room Status" count={rooms.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Section header with accent bar */
function SectionHeader({ label, count }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 bg-cyan-500/50 rounded-full" />
                <h2 className="text-sm font-semibold text-slate-300 tracking-wide">{label}</h2>
                {count != null && (
                    <span className="text-[9px] font-mono text-cyan-700 tracking-widest px-1.5 py-0.5 rounded border border-cyan-500/15">
                        {count} UNITS
                    </span>
                )}
            </div>
            <div className="flex-1 hud-divider" />
        </div>
    );
}

/** Inner content of each GlareCard metric */
function MetricInner({ icon: Icon, iconColor, iconBg, label, value, sub, pulse, accent }) {
    return (
        <div className="flex flex-col gap-3">
            {/* Corner bracket decorations */}
            <span className="absolute top-0 left-0 w-3 h-3 border-l border-t" style={{ borderColor: `${accent}40` }} />
            <span className="absolute top-0 right-0 w-3 h-3 border-r border-t" style={{ borderColor: `${accent}40` }} />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b" style={{ borderColor: `${accent}40` }} />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b" style={{ borderColor: `${accent}40` }} />

            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} flex-shrink-0`}>
                    <Icon size={18} className={iconColor} />
                </div>
                <div>
                    <p className="hud-label">{label}</p>
                    <p className={`hud-value ${pulse ? 'text-red-400' : 'text-white'}`}>
                        {value}
                    </p>
                </div>
            </div>
            {sub && (
                <p className="text-[10px] font-mono text-slate-600 tracking-wide">{sub}</p>
            )}
        </div>
    );
}

/** Alert list for the alerts tab */
function AlertList({ alerts }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} className="text-amber-400" />
                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                    Recent Alerts — {alerts.length} total
                </span>
            </div>
            {alerts.slice(0, 8).map(alert => (
                <div
                    key={alert.id}
                    className={`px-3 py-2.5 rounded-lg text-xs transition-colors hover:bg-white/[0.02] ${
                        alert.severity === 'high'
                            ? 'border-l-2 border-red-500/40 bg-red-500/5'
                            : alert.severity === 'medium'
                                ? 'border-l-2 border-amber-500/30 bg-amber-500/5'
                                : 'border-l-2 border-cyan-500/15'
                    }`}
                >
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono font-medium text-slate-200">{alert.room_name}</span>
                        <span className="text-[9px] font-mono text-slate-600">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 leading-snug">{alert.message}</p>
                </div>
            ))}
        </div>
    );
}

