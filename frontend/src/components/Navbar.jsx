import { Bell, WifiOff, Search, Activity, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWebSocketStatus } from '../context/WebSocketContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
    '/':                 { label: 'DASHBOARD',        sub: 'Real-time overview' },
    '/campus':           { label: 'CAMPUS MAP',       sub: 'Campus overview' },
    '/heatmap':          { label: 'HEAT MAP',         sub: 'Thermal analysis' },
    '/rooms':            { label: 'ROOMS',             sub: 'Room monitoring' },
    '/ghost-view':       { label: 'GHOST VIEW',        sub: 'Vacant room detection' },
    '/computer-labs':    { label: 'LABS',              sub: 'Computer lab intelligence' },
    '/energy-analytics': { label: 'ENERGY ANALYTICS', sub: 'Consumption trends' },
    '/energy-alerts':    { label: 'ALERTS',            sub: 'Energy warnings' },
    '/manual-control':   { label: 'MANUAL CONTROL',   sub: 'Device override' },
    '/devices':          { label: 'DEVICES',           sub: 'Device registry' },
    '/audit-logs':       { label: 'AUDIT LOGS',        sub: 'System activity' },
    '/rules':            { label: 'RULES',             sub: 'Automation rules' },
    '/privacy':          { label: 'PRIVACY',           sub: 'Compliance & data' },
    '/settings':         { label: 'SETTINGS',          sub: 'System configuration' },
};

export default function Navbar() {
    const { alerts } = useApp();
    const { connected } = useWebSocketStatus();
    const [showAlerts, setShowAlerts] = useState(false);
    const [time, setTime] = useState(new Date());
    const location = useLocation();

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const page = PAGE_TITLES[location.pathname] ?? { label: 'WATT-WATCH', sub: '' };
    const unreadCount = alerts.filter(a => a.severity === 'high').length;
    const timeStr = time.toLocaleTimeString('en-US', { hour12: false });

    return (
        <header className="relative flex items-center justify-between h-[52px] px-5 border-b border-cyan-500/[0.08] bg-black/70 backdrop-blur-xl z-20">
            {/* Top glow line */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            {/* ── Left: page title ────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div>
                    <h2 className="brand-wordmark text-[11px] text-white tracking-[0.22em] leading-none">
                        {page.label}
                    </h2>
                    {page.sub && (
                        <p className="text-[9px] font-mono text-slate-600 tracking-wider mt-0.5 uppercase">
                            {page.sub}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Center: search ──────────────────────────────── */}
            <div className="absolute left-1/2 -translate-x-1/2 w-64 hidden md:block">
                <div className="relative">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                    <input
                        type="text"
                        placeholder="Search feeds, rooms..."
                        className="w-full pl-8 pr-4 py-1.5 rounded-md bg-white/[0.02] border border-cyan-500/[0.08] text-[11px] font-mono text-slate-400 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/25 transition-all"
                    />
                </div>
            </div>

            {/* ── Right: status indicators ────────────────────── */}
            <div className="flex items-center gap-3">
                {/* Clock */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-cyan-500/[0.08] bg-black/40">
                    <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-400 tracking-wider tabular-nums">
                        {timeStr}
                    </span>
                </div>

                <div className="w-px h-4 bg-cyan-500/10" />

                {/* Connection */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono border ${connected
                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                    : 'border-amber-500/20 bg-amber-500/5 text-amber-400'}`}>
                    {connected ? (
                        <>
                            <Activity size={11} />
                            <span className="tracking-widest">LIVE</span>
                        </>
                    ) : (
                        <>
                            <WifiOff size={11} />
                            <span className="tracking-widest">DEMO</span>
                        </>
                    )}
                </div>

                {/* Threat level */}
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono border ${unreadCount > 0
                    ? 'border-red-500/20 bg-red-500/5 text-red-400'
                    : 'border-cyan-500/10 bg-cyan-500/5 text-cyan-600'}`}>
                    <Shield size={11} />
                    <span className="tracking-widest">
                        {unreadCount > 0 ? `THREAT ${unreadCount}` : 'CLEAR'}
                    </span>
                </div>

                {/* Alerts bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="relative p-1.5 rounded-md border border-cyan-500/[0.08] hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
                        aria-label="Notifications"
                    >
                        <Bell size={14} className="text-slate-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-[8px] font-mono font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showAlerts && (
                        <div className="absolute right-0 top-11 w-80 bg-black/95 border border-cyan-500/10 rounded-xl shadow-2xl p-2 z-50 animate-slide-up max-h-80 overflow-y-auto">
                            <div className="flex items-center justify-between px-2.5 py-2 mb-1">
                                <p className="text-[9px] font-mono font-bold text-cyan-600 tracking-[0.2em]">// ACTIVE ALERTS</p>
                                <span className="text-[9px] font-mono text-slate-600">{alerts.length} TOTAL</span>
                            </div>
                            <div className="hud-divider mb-2" />
                            {alerts.length === 0 ? (
                                <p className="text-[11px] font-mono text-slate-700 px-3 py-6 text-center tracking-widest">NO ACTIVE ALERTS</p>
                            ) : (
                                alerts.slice(0, 8).map(alert => (
                                    <div
                                        key={alert.id}
                                        className={`px-3 py-2 rounded-lg mb-1 transition-colors hover:bg-white/[0.02] ${
                                            alert.severity === 'high'
                                                ? 'border-l-2 border-red-500/40 bg-red-500/5'
                                                : 'border-l-2 border-cyan-500/15 bg-white/[0.01]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className="text-[11px] font-mono text-slate-200 font-medium">{alert.room_name}</p>
                                            <p className="text-[9px] font-mono text-slate-600">
                                                {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                                            </p>
                                        </div>
                                        <p className="text-[10px] font-mono text-slate-500 leading-snug">{alert.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* User badge */}
                <div className="flex items-center gap-2 pl-1">
                    <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]">
                        OP
                    </div>
                </div>
            </div>
        </header>
    );
}
