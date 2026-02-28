import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rooms } from '../data/mockData';
import { GlareCard } from '../components/ui/glare-card';

export default function CampusOverview() {
    const [viewMode, setViewMode] = useState('grid');
    const [filterType, setFilterType] = useState('all');

    const stats = {
        totalRooms: rooms.length,
        activeWaste: rooms.filter(r => r.status === 'waste').length,
        energySavedToday: 187,
        costSaved: 2805,
    };

    const filteredRooms = filterType === 'all'
        ? rooms
        : rooms.filter(r => r.type === filterType);

    const getStatusColor = (status) => {
        switch (status) {
            case 'efficient': return 'from-emerald-400 to-teal-500';
            case 'waste': return 'from-rose-400 to-pink-500';
            case 'review': return 'from-amber-400 to-orange-500';
            default: return 'from-sky-400 to-blue-500';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'efficient': return 'Efficient';
            case 'waste': return 'Empty but Active';
            case 'review': return 'Needs Review';
            default: return 'Unknown';
        }
    };

    const getMonitoringIcon = (method) => {
        switch (method) {
            case 'Camera': return '📹';
            case 'Smart Plug': return '🔌';
            case 'Sensor': return '📡';
            case 'Schedule-Based': return '📅';
            default: return '❓';
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-900 dark:via-purple-900 dark:to-fuchsia-900">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-8 py-16">
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">Campus Energy Dashboard</h1>
                    <p className="text-2xl text-purple-100 font-light">Real-time monitoring across {stats.totalRooms} campus locations</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 -mt-16 relative z-10">
                {/* Stats Grid with GlareCard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Rooms Monitored', value: stats.totalRooms, sub: '↑ All systems operational', color: 'border-indigo-500', subColor: 'text-emerald-400' },
                        { label: 'Active Waste Cases', value: stats.activeWaste, sub: '⚠️ Requires attention', color: 'border-rose-500', subColor: 'text-rose-400' },
                        { label: 'Energy Saved Today', value: `${stats.energySavedToday} kWh`, sub: '↑ 12% vs yesterday', color: 'border-amber-500', subColor: 'text-emerald-400' },
                        { label: 'Estimated Cost Saved', value: `₹${stats.costSaved.toLocaleString()}`, sub: '↑ ₹340 today', color: 'border-teal-500', subColor: 'text-emerald-400' },
                    ].map((card, i) => (
                        <GlareCard key={i} className={`!p-8 border-l-4 ${card.color}`}>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{card.label}</div>
                            <div className="text-4xl font-black text-white mb-3">{card.value}</div>
                            <div className={`${card.subColor} font-semibold text-sm`}>{card.sub}</div>
                        </GlareCard>
                    ))}
                </div>

                {/* Controls Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Filter:</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-slate-900 dark:text-slate-100 font-medium cursor-pointer">
                            <option value="all">All Rooms</option>
                            <option value="Classroom">Classrooms</option>
                            <option value="Computer Lab">Computer Labs</option>
                            <option value="Lab">Labs</option>
                            <option value="Office">Offices</option>
                            <option value="Hostel">Hostels</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        {['grid', 'list'].map(m => (
                            <button key={m} onClick={() => setViewMode(m)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${viewMode === m ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                {m === 'grid' ? '▦ Grid' : '☰ List'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rooms */}
                <div className={`grid gap-6 mb-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {filteredRooms.map(room => (
                        <div key={room.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-shadow duration-300">
                            <div className={`bg-gradient-to-r ${getStatusColor(room.status)} p-6 relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black opacity-10"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1">{room.name}</h3>
                                            <p className="text-white/80 font-medium">{room.type} • {room.building}</p>
                                        </div>
                                        <span className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase">{getStatusLabel(room.status)}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                                        <span>{getMonitoringIcon(room.monitoring)}</span>
                                        <span>{room.monitoring}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-4 mb-6">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1">
                                        <span className="text-2xl">👥</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{room.occupancy}/{room.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1">
                                        <span className="text-2xl">⚡</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{room.energyUsage} kWh</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[
                                        { emoji: '💡', label: 'Lights', on: room.appliances.lights },
                                        { emoji: '📽️', label: 'Projector', on: room.appliances.projector },
                                        { emoji: '❄️', label: 'AC', on: room.appliances.ac },
                                        ...(room.appliances.desktops > 0 ? [{ emoji: '💻', label: `${room.appliances.desktops} PCs`, on: true }] : []),
                                    ].map((a, i) => (
                                        <div key={i} className={`p-3 rounded-xl border-2 ${a.on ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl">{a.emoji}</span>
                                                <span className={`text-xs font-black uppercase ${a.on ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400'}`}>{a.on ? 'ON' : 'OFF'}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">{a.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <Link to={`/room/${room.id}`}
                                    className="block w-full text-center px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
