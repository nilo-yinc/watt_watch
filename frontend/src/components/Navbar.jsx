import { Bell, Wifi, WifiOff, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWebSocketStatus } from '../context/WebSocketContext';
import { useState } from 'react';

export default function Navbar() {
    const { alerts } = useApp();
    const { connected } = useWebSocketStatus();
    const [showAlerts, setShowAlerts] = useState(false);

    const unreadCount = alerts.filter(a => a.severity === 'high').length;

    return (
        <header className="flex items-center justify-between h-16 px-6 border-b border-surface-700/40 bg-surface-900/50 backdrop-blur-md">
            {/* Search */}
            <div className="relative w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                    type="text"
                    placeholder="Search rooms, devices..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-800/60 border border-surface-700/40 text-sm text-surface-200 placeholder:text-surface-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all"
                />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
                {/* Connection status */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-light text-xs">
                    {connected ? (
                        <>
                            <Wifi size={14} className="text-secure" />
                            <span className="text-surface-300">Live</span>
                        </>
                    ) : (
                        <>
                            <WifiOff size={14} className="text-caution" />
                            <span className="text-surface-400">Demo</span>
                        </>
                    )}
                </div>

                {/* Notification bell */}
                <div className="relative">
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="relative p-2 rounded-xl hover:bg-surface-800/60 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell size={20} className="text-surface-400" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-waste text-[10px] font-bold text-white animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Alert dropdown */}
                    {showAlerts && (
                        <div className="absolute right-0 top-12 w-80 glass border border-surface-700/60 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up max-h-80 overflow-y-auto">
                            <p className="text-xs font-semibold text-surface-400 px-3 py-2 uppercase tracking-wide">Alerts</p>
                            {alerts.length === 0 ? (
                                <p className="text-sm text-surface-500 px-3 py-4 text-center">No alerts</p>
                            ) : (
                                alerts.slice(0, 8).map(alert => (
                                    <div
                                        key={alert.id}
                                        className={`px-3 py-2.5 rounded-xl mb-1 text-sm transition-colors hover:bg-surface-800/40 ${alert.severity === 'high' ? 'border-l-2 border-waste' : 'border-l-2 border-surface-600'
                                            }`}
                                    >
                                        <p className="font-medium text-surface-200">{alert.room_name}</p>
                                        <p className="text-xs text-surface-400 mt-0.5">{alert.message}</p>
                                        <p className="text-[10px] text-surface-500 mt-1">
                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* User avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-brand-500/20">
                    A
                </div>
            </div>
        </header>
    );
}
