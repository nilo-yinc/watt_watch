import { useState } from 'react';
import { Link } from 'react-router-dom';
import { rooms } from '../data/mockData';

export default function HeatmapView() {
    const [timeFilter, setTimeFilter] = useState('today');

    const getStatusColor = (status) => {
        switch (status) {
            case 'efficient': return '#10b981';
            case 'waste': return '#ef4444';
            case 'review': return '#f59e0b';
            default: return '#3b82f6';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'efficient': return 'Efficient';
            case 'waste': return 'High Waste';
            case 'review': return 'Needs Review';
            default: return 'Unknown';
        }
    };

    const buildings = {};
    rooms.forEach(room => {
        if (!buildings[room.building]) buildings[room.building] = [];
        buildings[room.building].push(room);
    });

    const stats = {
        efficient: rooms.filter(r => r.status === 'efficient').length,
        waste: rooms.filter(r => r.status === 'waste').length,
        review: rooms.filter(r => r.status === 'review').length,
    };

    return (
        <div className="min-h-screen bg-slate-900 dark:bg-black text-white p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <h1 className="text-6xl font-black mb-2 tracking-tighter">
                            <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">Campus Heatmap</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-light">Real-time energy efficiency across campus</p>
                    </div>
                    <div className="flex gap-3 mt-6 md:mt-0">
                        {['today', 'week'].map(f => (
                            <button key={f} onClick={() => setTimeFilter(f)}
                                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${timeFilter === f ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                {f === 'today' ? 'Today' : 'This Week'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 mb-12 p-6 bg-slate-800/50 rounded-3xl backdrop-blur-sm border border-slate-700">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-green-500 shadow-lg shadow-green-500/50"></div><span className="text-lg font-semibold">Efficient ({stats.efficient})</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-amber-500 shadow-lg shadow-amber-500/50"></div><span className="text-lg font-semibold">Needs Review ({stats.review})</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-red-500 shadow-lg shadow-red-500/50"></div><span className="text-lg font-semibold">High Waste ({stats.waste})</span></div>
                </div>

                <div className="space-y-12">
                    {Object.entries(buildings).map(([building, buildingRooms]) => (
                        <div key={building}>
                            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-700">
                                <h2 className="text-3xl font-black text-white">{building}</h2>
                                <span className="px-5 py-2 bg-slate-800 rounded-full text-slate-400 font-bold">{buildingRooms.length} rooms</span>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                {buildingRooms.map(room => (
                                    <Link key={room.id} to={`/room/${room.id}`}
                                        className="group relative aspect-square rounded-2xl overflow-hidden transform hover:scale-110 hover:z-10 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                        style={{ backgroundColor: getStatusColor(room.status), boxShadow: `0 10px 30px -10px ${getStatusColor(room.status)}80` }}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40"></div>
                                        <div className="relative h-full p-3 flex flex-col justify-between text-white">
                                            <div><div className="text-xl font-black mb-1">{room.name.split(' ').slice(-1)[0]}</div><div className="text-xs font-bold opacity-80 uppercase">{room.type.slice(0, 3)}</div></div>
                                            <div className="flex items-center justify-between"><span className="text-sm font-bold">{room.occupancy}/{room.capacity}</span><span className="text-xs">👥</span></div>
                                        </div>
                                        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                            <div className="text-center">
                                                <div className="text-lg font-black mb-2">{room.name}</div>
                                                <div className="text-sm font-semibold mb-3">{getStatusLabel(room.status)}</div>
                                                <div className="space-y-1 text-xs">
                                                    <div>👥 {room.occupancy}/{room.capacity}</div>
                                                    <div>⚡ {room.energyUsage} kWh</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700">
                    <h3 className="text-3xl font-black text-white mb-6">Quick Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4 p-6 bg-green-500/10 border-2 border-green-500/30 rounded-2xl">
                            <span className="text-4xl">✓</span>
                            <div><div className="text-2xl font-black text-green-400 mb-1">{stats.efficient}</div><div className="text-sm text-slate-300">rooms operating efficiently</div></div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl">
                            <span className="text-4xl">⚠️</span>
                            <div><div className="text-2xl font-black text-red-400 mb-1">{stats.waste}</div><div className="text-sm text-slate-300">rooms with active waste</div></div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl">
                            <span className="text-4xl">📊</span>
                            <div><div className="text-2xl font-black text-blue-400 mb-1">{((stats.efficient / rooms.length) * 100).toFixed(0)}%</div><div className="text-sm text-slate-300">overall efficiency rate</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
