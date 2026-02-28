import { useParams, Link } from 'react-router-dom';
import { rooms, timeline } from '../data/mockData';

export default function RoomDetail() {
    const { roomId } = useParams();
    const room = rooms.find(r => r.id === roomId);
    const roomTimeline = timeline[roomId] || [];

    if (!room) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Room Not Found</h1>
                    <Link to="/campus" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg inline-block">← Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'efficient': return { bg: 'from-emerald-500 to-green-600', badge: 'bg-emerald-500' };
            case 'waste': return { bg: 'from-rose-500 to-red-600', badge: 'bg-rose-500' };
            case 'review': return { bg: 'from-amber-500 to-orange-600', badge: 'bg-amber-500' };
            default: return { bg: 'from-slate-500 to-slate-600', badge: 'bg-slate-500' };
        }
    };

    const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formatDateTime = (ts) => new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const colors = getStatusColor(room.status);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className={`bg-gradient-to-r ${colors.bg} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-8 py-12">
                    <Link to="/campus" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold mb-6 transition-colors">
                        <span className="text-2xl">←</span><span>Back to Dashboard</span>
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">{room.name}</h1>
                            <p className="text-xl text-white/90 font-medium">{room.type} • {room.building}</p>
                        </div>
                        <span className={`${colors.badge} text-white px-6 py-3 rounded-2xl text-lg font-bold shadow-xl`}>
                            {room.status === 'efficient' ? 'Efficient' : room.status === 'waste' ? 'Empty but Active' : 'Needs Review'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-slate-200 dark:border-slate-800">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><span className="text-4xl">📋</span>Room Metadata</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Room Type', value: room.type, icon: '🏫' },
                                { label: 'Building', value: room.building, icon: '🏢' },
                                { label: 'Monitoring', value: room.monitoring, icon: '📡' },
                                { label: 'Capacity', value: `${room.capacity} people`, icon: '👥' },
                                { label: 'Occupancy', value: `${room.occupancy} people`, icon: '📊', highlight: true },
                                { label: 'Energy Usage', value: `${room.energyUsage} kWh`, icon: '⚡', highlight: true },
                            ].map((item, i) => (
                                <div key={i} className={`p-5 rounded-2xl ${item.highlight ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-2 border-indigo-300 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'}`}>
                                    <div className="text-3xl mb-2">{item.icon}</div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                                    <div className={`text-xl font-black ${item.highlight ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900 rounded-3xl p-8 shadow-xl text-white">
                        <h2 className="text-2xl font-black mb-6">Quick Stats</h2>
                        <div className="space-y-4">
                            {[
                                { val: `${room.occupancy}/${room.capacity}`, label: 'Current Occupancy' },
                                { val: room.energyUsage, label: 'kWh Usage' },
                                { val: `${((room.occupancy / room.capacity) * 100).toFixed(0)}%`, label: 'Utilization' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <div className="text-4xl font-black mb-1">{s.val}</div>
                                    <div className="text-sm font-semibold text-indigo-100 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Appliances */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-slate-200 dark:border-slate-800 mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><span className="text-4xl">🔌</span>Appliance States</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { emoji: '💡', label: 'Lights', on: room.appliances.lights, onColor: 'from-amber-100 to-yellow-100 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-400 dark:border-amber-700', textColor: 'text-amber-700 dark:text-amber-400' },
                            { emoji: '📽️', label: 'Projector', on: room.appliances.projector, onColor: 'from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-400 dark:border-purple-700', textColor: 'text-purple-700 dark:text-purple-400' },
                            { emoji: '❄️', label: 'Air Conditioning', on: room.appliances.ac, onColor: 'from-cyan-100 to-blue-100 dark:from-cyan-950/50 dark:to-blue-950/50 border-cyan-400 dark:border-cyan-700', textColor: 'text-cyan-700 dark:text-cyan-400' },
                        ].map((a, i) => (
                            <div key={i} className={`rounded-2xl p-6 border-4 transition-all ${a.on ? `bg-gradient-to-br ${a.onColor}` : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-5xl">{a.emoji}</div>
                                    <div className={`w-4 h-4 rounded-full ${a.on ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{a.label}</div>
                                <div className={`text-sm font-bold uppercase tracking-wider ${a.on ? a.textColor : 'text-slate-500 dark:text-slate-400'}`}>{a.on ? 'ON' : 'OFF'}</div>
                            </div>
                        ))}
                        {room.appliances.desktops > 0 && (
                            <div className="rounded-2xl p-6 border-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-400 dark:border-blue-700">
                                <div className="flex justify-between items-start mb-4"><div className="text-5xl">💻</div><div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div></div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">Desktops</div>
                                <div className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">{room.appliances.desktops} Active</div>
                                {room.desktopDetails && (
                                    <div className="mt-3 pt-3 border-t-2 border-blue-300 dark:border-blue-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        Monitor OFF: {room.desktopDetails.monitorsOff} • CPU Active: {room.desktopDetails.cpuActive}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3"><span className="text-4xl">📅</span>Activity Timeline</h2>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Last: {formatDateTime(room.lastActivity)}</span>
                    </div>
                    <div className="space-y-4">
                        {roomTimeline.length > 0 ? roomTimeline.map((event, i) => (
                            <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <div className="text-3xl">{event.icon}</div>
                                <div className="flex-1">
                                    <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{event.message}</div>
                                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{formatTime(event.time)}</div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No recent activity recorded</p>
                        )}
                    </div>
                </div>

                {room.monitoring === 'Camera' && (
                    <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-900 rounded-3xl p-8 text-center">
                        <h2 className="text-3xl font-black text-white mb-4">Privacy Controls Available</h2>
                        <p className="text-xl text-purple-100 mb-6">Camera monitoring with privacy features enabled</p>
                        <Link to="/ghost-view" className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 text-purple-600 font-bold rounded-2xl shadow-xl transition-all">
                            <span className="text-2xl">👻</span><span>View Ghost Mode →</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
