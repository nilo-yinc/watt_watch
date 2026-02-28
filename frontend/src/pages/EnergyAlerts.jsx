import { useState } from 'react';
import { Link } from 'react-router-dom';
import { alerts } from '../data/mockData';

export default function EnergyAlerts() {
    const [filterBuilding, setFilterBuilding] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');

    const buildings = ['all', ...new Set(alerts.map(a => a.building))];
    const types = ['all', ...new Set(alerts.map(a => a.roomType))];

    const filteredAlerts = alerts.filter(a => {
        if (filterBuilding !== 'all' && a.building !== filterBuilding) return false;
        if (filterType !== 'all' && a.roomType !== filterType) return false;
        if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
        return true;
    });

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return { bg: 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30', border: 'border-red-400 dark:border-red-700', text: 'text-red-700 dark:text-red-400', badge: 'bg-red-500' };
            case 'medium': return { bg: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30', border: 'border-amber-400 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-500' };
            case 'low': return { bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30', border: 'border-blue-400 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-500' };
            default: return { bg: 'from-slate-50 dark:from-slate-950/30', border: 'border-slate-400 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-400', badge: 'bg-slate-500' };
        }
    };

    const formatTime = (ts) => {
        const diff = Math.floor((Date.now() - ts) / 60000);
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return new Date(ts).toLocaleDateString();
    };

    const totalWaste = filteredAlerts.reduce((sum, a) => sum + a.estimatedWaste, 0);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-700 dark:via-red-700 dark:to-pink-700 px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Energy Waste Alerts</h1>
                            <p className="text-red-100 text-lg font-medium">Active alerts requiring attention</p>
                        </div>
                        <div className="flex gap-6">
                            {[{ val: filteredAlerts.length, label: 'Active Alerts' }, { val: totalWaste.toFixed(1), label: 'kWh Wasted' }].map((s, i) => (
                                <div key={i} className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                                    <div className="text-4xl font-black text-white">{s.val}</div>
                                    <div className="text-sm font-semibold text-red-100 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Building', value: filterBuilding, onChange: setFilterBuilding, options: buildings.map(b => ({ v: b, l: b === 'all' ? 'All Buildings' : b })) },
                        { label: 'Room Type', value: filterType, onChange: setFilterType, options: types.map(t => ({ v: t, l: t === 'all' ? 'All Types' : t })) },
                        { label: 'Severity', value: filterSeverity, onChange: setFilterSeverity, options: [{ v: 'all', l: 'All Severities' }, { v: 'high', l: 'High' }, { v: 'medium', l: 'Medium' }, { v: 'low', l: 'Low' }] },
                    ].map((f, i) => (
                        <div key={i}>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">{f.label}</label>
                            <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-orange-500 focus:outline-none text-slate-900 dark:text-slate-100 font-medium">
                                {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    {filteredAlerts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-8xl mb-4">✓</div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">No Alerts Found</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">All rooms operating efficiently</p>
                        </div>
                    ) : filteredAlerts.map(alert => {
                        const colors = getSeverityColor(alert.severity);
                        return (
                            <div key={alert.id} className={`bg-gradient-to-br ${colors.bg} border-l-8 ${colors.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-start gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{alert.roomName}</h3>
                                            <span className={`${colors.badge} text-white px-3 py-1 rounded-full text-xs font-black uppercase`}>{alert.severity}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">{alert.roomType} • {alert.building}</p>
                                    </div>
                                </div>
                                <div className={`flex items-start gap-3 p-4 bg-white/50 dark:bg-black/20 rounded-xl mb-4 border ${colors.border}`}>
                                    <span className="text-3xl">⚠️</span>
                                    <span className={`text-lg font-semibold ${colors.text}`}>{alert.issue}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    {[
                                        { emoji: '⏱️', val: alert.duration, label: 'Duration' },
                                        { emoji: '⚡', val: alert.estimatedWaste, label: 'kWh Wasted' },
                                        { emoji: '🕐', val: formatTime(alert.timestamp), label: 'Detected' },
                                    ].map((m, i) => (
                                        <div key={i} className="bg-white/70 dark:bg-slate-900/50 rounded-xl p-4 text-center">
                                            <div className="text-2xl mb-1">{m.emoji}</div>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{m.val}</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <Link to={`/room/${alert.roomId}`} className="flex-1 text-center px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors">View Room</Link>
                                    <Link to="/manual-control" className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg">Take Action</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
