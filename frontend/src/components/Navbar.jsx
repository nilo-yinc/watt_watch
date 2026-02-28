import { Bell, Wifi, WifiOff, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWebSocketStatus } from '../context/WebSocketContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { alerts } = useApp();
    const { connected } = useWebSocketStatus();
    const [showAlerts, setShowAlerts] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const unreadCount = alerts.filter(a => a.severity === 'high').length;

    return (
        <header className="flex items-center justify-between h-12 px-5 border-b border-white/[0.04] bg-[#060a10]/80 backdrop-blur-md z-20 relative">
            {/* Search */}
            <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                <input
                    type="text"
                    placeholder="Search feeds..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-md bg-transparent border border-white/[0.04] text-xs font-mono text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/20 transition-all"
                />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Time */}
                <span className="text-[10px] font-mono text-slate-600 tracking-wider">
                    {time.toLocaleTimeString('en-US', { hour12: false })}
                </span>

                <div className="w-px h-4 bg-white/[0.06]" />

                {/* Connection status */}
                <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono">
                    {connected ? (
                        <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-slate-500">LIVE</span>
                        </>
                    ) : (
                        <>
                            <WifiOff size={12} className="text-amber-400" />
                            <span className="text-amber-400">DEMO</span>
                        </>
                    )}
                </div>

                {/* Notification bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="relative p-1.5 rounded-md hover:bg-white/[0.03] transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell size={16} className="text-slate-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-400 text-[8px] font-mono font-bold text-black">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Alert dropdown */}
                    {showAlerts && (
                        <div className="absolute right-0 top-10 w-72 bg-[#0a1018] border border-white/[0.06] rounded-lg shadow-2xl p-1.5 z-50 animate-slide-up max-h-72 overflow-y-auto">
                            <p className="text-[9px] font-mono font-bold text-slate-600 px-2.5 py-1.5 tracking-wider">ALERTS</p>
                            {alerts.length === 0 ? (
                                <p className="text-xs font-mono text-slate-700 px-3 py-4 text-center">NO ALERTS</p>
                            ) : (
                                alerts.slice(0, 8).map(alert => (
                                    <div
                                        key={alert.id}
                                        className={`px-2.5 py-2 rounded-md mb-0.5 transition-colors hover:bg-white/[0.02] ${alert.severity === 'high' ? 'border-l-2 border-red-500/30' : 'border-l-2 border-white/[0.04]'}`}
                                    >
                                        <p className="text-xs font-mono text-slate-300">{alert.room_name}</p>
                                        <p className="text-[10px] font-mono text-slate-600 mt-0.5">{alert.message}</p>
                                        <p className="text-[8px] font-mono text-slate-700 mt-1">{new Date(alert.timestamp).toLocaleTimeString('en-US', { hour12: false })}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* User indicator */}
                <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400">
                    OP
                </div>
            </div>
        </header>
    );
}
