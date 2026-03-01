import {
    Zap, Users, AlertTriangle, Shield, TrendingDown, Clock, Activity,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import { useEnergy } from '../hooks/useEnergy';
import { useApp } from '../context/AppContext';
import RoomCard from '../components/RoomCard';
import EnergyChart from '../components/EnergyChart';
import { Tabs } from '../components/ui/tabs';
import { CanvasText } from '../components/ui/canvas-text';

export default function Dashboard() {
    const { rooms, secureCount, wasteCount, totalPeople } = useRooms();
    const { energyWasted, costWasted, totalWasteDuration, hourlyData } = useEnergy();
    const { alerts } = useApp();

    const wasteMins = Math.floor(totalWasteDuration / 60);
    const wasteHrs = Math.floor(wasteMins / 60);
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
        <div className="space-y-10 animate-fade-in pb-8">
            {/* ── Hero heading with animated text ─────────────── */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.03]">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                        <h1 className="font-display text-2xl text-white tracking-wide">
                            CAMPUS ENERGY DASHBOARD
                        </h1>
                    </div>
                    <p className="text-[11px] font-mono text-slate-600 tracking-[0.2em] uppercase ml-3.5">
                        Real-time campus energy surveillance
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/10 bg-cyan-500/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    <span className="text-[10px] font-mono text-cyan-600 tracking-widest">SYSTEM ACTIVE</span>
                </div>
            </div>

            {/* ── Metric cards ──────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="hud-card p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl transition-all hover:border-white/[0.1]">
                    <MetricInner
                        icon={Shield} iconColor="text-emerald-400" iconBg="bg-emerald-500/10"
                        label="Secure Rooms" value={secureCount} sub={`of ${rooms.length} total`}
                        accent="#34d399"
                    />
                </div>
                <div className="hud-card p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl transition-all hover:border-white/[0.1]">
                    <MetricInner
                        icon={AlertTriangle} iconColor="text-red-400" iconBg="bg-red-500/10"
                        label="Waste Detected" value={wasteCount}
                        sub={wasteCount > 0 ? 'Action needed' : 'All clear'}
                        pulse={wasteCount > 0}
                        accent="#f87171"
                    />
                </div>
                <div className="hud-card p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl transition-all hover:border-white/[0.1]">
                    <MetricInner
                        icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-500/10"
                        label="Occupancy" value={totalPeople} sub="People on campus"
                        accent="#22d3ee"
                    />
                </div>
                <div className="hud-card p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl transition-all hover:border-white/[0.1]">
                    <MetricInner
                        icon={Zap} iconColor="text-amber-400" iconBg="bg-amber-500/10"
                        label="Energy Wasted" value={`${energyWasted} Wh`}
                        sub={`≈ ₹${costWasted}`}
                        accent="#fbbf24"
                    />
                </div>
            </div>

            {/* ── Analytics tabs ────────────────────────────────── */}
            <div className="pt-8 px-4 py-6 rounded-xl bg-gradient-to-br from-white/[0.01] to-transparent border border-white/[0.02]">
                <SectionHeader label="Analytics" />
                <div className="h-[24rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start mt-5 rounded-xl">
                    <Tabs tabs={analyticsTabs} contentClassName="mt-28" />
                </div>
            </div>

            {/* ── Room status grid ──────────────────────────────── */}
            <div className="pt-8 px-4 py-6 rounded-xl bg-gradient-to-br from-white/[0.01] to-transparent border border-white/[0.02]">
                <SectionHeader label="Room Status" count={rooms.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
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
        <div className="relative">
            <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <h2 className="text-base font-bold text-slate-200 tracking-wide uppercase">{label}</h2>
                    {count != null && (
                        <span className="text-[9px] font-mono text-cyan-400 tracking-widest px-2 py-1 rounded-md border border-cyan-500/20 bg-cyan-500/5">
                            {count} UNITS
                        </span>
                    )}
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />
        </div>
    );
}

/** Inner content of each GlareCard metric */
function MetricInner({ icon: Icon, iconColor, iconBg, label, value, sub, pulse, accent }) {
    return (
        <div className="flex flex-col gap-4 relative">
            {/* Corner bracket decorations */}
            <span className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 rounded-tl" style={{ borderColor: `${accent}40` }} />
            <span className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 rounded-tr" style={{ borderColor: `${accent}40` }} />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 rounded-bl" style={{ borderColor: `${accent}40` }} />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 rounded-br" style={{ borderColor: `${accent}40` }} />

            <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} flex-shrink-0 border border-white/[0.05]`}>
                    <Icon size={20} className={iconColor} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="hud-label mb-1.5">{label}</p>
                    <p className={`hud-value text-2xl ${pulse ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {value}
                    </p>
                </div>
            </div>
            {sub && (
                <div className="pt-2 border-t border-white/[0.03]">
                    <p className="text-[10px] font-mono text-slate-500 tracking-wide">{sub}</p>
                </div>
            )}
        </div>
    );
}

/** Alert list for the alerts tab */
function AlertList({ alerts }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.05]">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <AlertTriangle size={14} className="text-amber-400" strokeWidth={2.5} />
                </div>
                <div>
                    <span className="text-xs font-semibold text-slate-300 block">Recent Alerts</span>
                    <span className="text-[9px] font-mono text-slate-600 tracking-wider">
                        {alerts.length} active notifications
                    </span>
                </div>
            </div>
            {alerts.slice(0, 8).map(alert => (
                <div
                    key={alert.id}
                    className={`px-4 py-3 rounded-lg text-xs transition-all hover:bg-white/[0.03] hover:translate-x-1 border ${alert.severity === 'high'
                            ? 'border-l-4 border-red-500/50 bg-red-500/[0.07] border-r border-t border-b border-red-500/20'
                            : alert.severity === 'medium'
                                ? 'border-l-4 border-amber-500/50 bg-amber-500/[0.07] border-r border-t border-b border-amber-500/20'
                                : 'border-l-4 border-cyan-500/30 bg-cyan-500/[0.05] border-r border-t border-b border-cyan-500/10'
                        }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-semibold text-slate-200">{alert.room_name}</span>
                        <span className={`text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded ${
                            alert.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                            alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-cyan-500/20 text-cyan-300'
                        }`}>
                            {alert.severity.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 leading-relaxed mb-1">{alert.message}</p>
                    <span className="text-[9px] font-mono text-slate-600">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            ))}
        </div>
    );
}
