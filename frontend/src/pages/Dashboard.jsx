import {
    Zap, Users, AlertTriangle, Shield, TrendingDown, Clock,
} from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import { useEnergy } from '../hooks/useEnergy';
import { useApp } from '../context/AppContext';
import RoomCard from '../components/RoomCard';
import EnergyChart from '../components/EnergyChart';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
    const { rooms, secureCount, wasteCount, totalPeople } = useRooms();
    const { energyWasted, costWasted, totalWasteDuration, hourlyData } = useEnergy();
    const { alerts } = useApp();

    // Format total waste duration
    const wasteMins = Math.floor(totalWasteDuration / 60);
    const wasteHrs = Math.floor(wasteMins / 60);
    const wasteTimeStr = wasteHrs > 0 ? `${wasteHrs}h ${wasteMins % 60}m` : `${wasteMins}m`;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-surface-400 mt-1">Real-time campus energy monitoring</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-surface-400">
                    <div className="w-2 h-2 rounded-full bg-secure animate-pulse" />
                    System Active
                </div>
            </div>

            {/* ── Metric cards ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    icon={Shield} iconColor="text-secure" iconBg="bg-secure/10"
                    label="Secure Rooms" value={secureCount} subtitle={`of ${rooms.length} total`}
                />
                <MetricCard
                    icon={AlertTriangle} iconColor="text-waste" iconBg="bg-waste/10"
                    label="Waste Detected" value={wasteCount}
                    subtitle={wasteCount > 0 ? 'Action needed' : 'All clear'}
                    pulse={wasteCount > 0}
                />
                <MetricCard
                    icon={Users} iconColor="text-brand-400" iconBg="bg-brand-500/10"
                    label="Total Occupancy" value={totalPeople} subtitle="People on campus"
                />
                <MetricCard
                    icon={Zap} iconColor="text-caution" iconBg="bg-caution/10"
                    label="Energy Wasted" value={`${energyWasted} Wh`}
                    subtitle={`≈ ₹${costWasted}`}
                />
            </div>

            {/* ── Charts + Alerts row ──────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Energy chart (2 cols) */}
                <div className="lg:col-span-2">
                    <EnergyChart data={hourlyData} variant="area" title="Energy Trend — Last 24 Hours" />
                </div>

                {/* Recent alerts (1 col) */}
                <div className="glass p-5 max-h-[360px] overflow-y-auto">
                    <h3 className="text-sm font-semibold text-surface-200 mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-waste" />
                        Recent Alerts
                    </h3>
                    <div className="space-y-2">
                        {alerts.slice(0, 6).map(alert => (
                            <div
                                key={alert.id}
                                className={`px-3 py-2.5 rounded-xl text-xs transition-colors hover:bg-surface-800/40 ${alert.severity === 'high'
                                        ? 'border-l-2 border-waste bg-waste/5'
                                        : alert.severity === 'medium'
                                            ? 'border-l-2 border-caution bg-caution/5'
                                            : 'border-l-2 border-surface-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-medium text-surface-200">{alert.room_name}</span>
                                    <span className="text-[10px] text-surface-500">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-surface-400 leading-snug">{alert.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Room status grid ─────────────────────────────────────── */}
            <div>
                <h2 className="text-lg font-semibold text-surface-200 mb-3">Room Status</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Reusable metric card component with icon, value, and subtitle. */
function MetricCard({ icon: Icon, iconColor, iconBg, label, value, subtitle, pulse }) {
    return (
        <div className={`metric-card ${pulse ? 'border-waste/30' : ''}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <Icon size={20} className={iconColor} />
                </div>
                <div>
                    <p className="text-xs text-surface-400">{label}</p>
                    <p className={`text-xl font-bold text-white ${pulse ? 'text-waste' : ''}`}>{value}</p>
                </div>
            </div>
            {subtitle && <p className="text-[11px] text-surface-500 mt-1 ml-[52px]">{subtitle}</p>}
        </div>
    );
}
