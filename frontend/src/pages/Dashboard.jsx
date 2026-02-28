import {
    Zap, Users, AlertTriangle, Shield, TrendingDown, Clock, Activity,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import { useEnergy } from '../hooks/useEnergy';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import RoomCard from '../components/RoomCard';
import EnergyChart from '../components/EnergyChart';
import { GlareCard } from '../components/ui/glare-card';
import { Tabs } from '../components/ui/tabs';
import { CanvasText } from '../components/ui/canvas-text';
import GlowingEffectDemo from '../components/GlowingEffectDemo';

export default function Dashboard() {
    const { rooms, secureCount, wasteCount, totalPeople } = useRooms();
    const { energyWasted, costWasted, totalWasteDuration, hourlyData } = useEnergy();
    const { alerts } = useApp();
    const { isDark } = useTheme();

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
        <div className="space-y-6 animate-fade-in">
            {/* ── Hero heading with animated text ─────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                        <h1 className="font-display text-2xl text-[var(--ww-text-1)] tracking-wide">
                            <CanvasText
                                text="WATT·WATCH"
                                backgroundClassName={isDark ? 'bg-[#030711]' : 'bg-[#e7edf6]'}
                                colors={[
                                    "rgba(34, 211, 238, 1)",
                                    "rgba(34, 211, 238, 0.8)",
                                    "rgba(14, 165, 233, 1)",
                                    "rgba(14, 165, 233, 0.7)",
                                    "rgba(56, 189, 248, 0.9)",
                                    "rgba(125, 211, 252, 0.6)",
                                ]}
                                lineGap={3}
                                animationDuration={12}
                            />
                        </h1>
                    </div>
                    <p className="text-[11px] font-mono text-[var(--ww-text-muted)] tracking-[0.2em] uppercase ml-3.5">
                        Real-time campus energy surveillance
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--ww-border)] bg-[var(--ww-accent-dim)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--ww-accent)] animate-pulse shadow-[0_0_6px_var(--ww-accent-glow)]" />
                    <span className="text-[10px] font-mono text-[var(--ww-accent)] tracking-widest">SYSTEM ACTIVE</span>
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

            {/* ── Glowing-effect feature cards ───────────────────── */}
            <div>
                <SectionHeader label="System Capabilities" />
                <div className="mt-3">
                    <GlowingEffectDemo />
                </div>
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
                <div className="w-0.5 h-4 bg-[var(--ww-accent)] opacity-50 rounded-full" />
                <h2 className="text-sm font-semibold text-[var(--ww-text-2)] tracking-wide">{label}</h2>
                {count != null && (
                    <span className="text-[9px] font-mono text-[var(--ww-accent)] tracking-widest px-1.5 py-0.5 rounded border border-[var(--ww-border)]">
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
                    <p className={`hud-value ${pulse ? 'text-red-400' : 'text-[var(--ww-text-1)]'}`}>
                        {value}
                    </p>
                </div>
            </div>
            {sub && (
                <p className="text-[10px] font-mono text-[var(--ww-text-muted)] tracking-wide">{sub}</p>
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
                <span className="text-[10px] font-mono text-[var(--ww-text-3)] tracking-widest uppercase">
                    Recent Alerts — {alerts.length} total
                </span>
            </div>
            {alerts.slice(0, 8).map(alert => (
                <div
                    key={alert.id}
                    className={`px-3 py-2.5 rounded-lg text-xs transition-colors hover:bg-[var(--ww-accent-dim)] ${alert.severity === 'high'
                        ? 'border-l-2 border-red-500/40 bg-red-500/5'
                        : alert.severity === 'medium'
                            ? 'border-l-2 border-amber-500/30 bg-amber-500/5'
                            : 'border-l-2 border-cyan-500/15'
                        }`}
                >
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono font-medium text-[var(--ww-text-1)]">{alert.room_name}</span>
                        <span className="text-[9px] font-mono text-[var(--ww-text-muted)]">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--ww-text-3)] leading-snug">{alert.message}</p>
                </div>
            ))}
        </div>
    );
}
