import { useState } from 'react';
import { rooms } from '../data/mockData';

export default function GhostView() {
    const [selectedRoom, setSelectedRoom] = useState('r1');
    const [ghostMode, setGhostMode] = useState(true);
    const [dataOnlyMode, setDataOnlyMode] = useState(false);

    const cameraRooms = rooms.filter(r => r.monitoring === 'Camera');
    const currentRoom = cameraRooms.find(r => r.id === selectedRoom);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <h1 className="text-6xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">Ghost View</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-light">Privacy-first visual monitoring</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-8 border border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Select Camera Room</label>
                            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-purple-500 focus:outline-none text-slate-900 dark:text-slate-100 font-medium text-lg">
                                {cameraRooms.map(room => (
                                    <option key={room.id} value={room.id}>{room.name} ({room.building})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { label: 'Ghost View Mode', emoji: '👻', checked: ghostMode, onChange: (e) => setGhostMode(e.target.checked) },
                                { label: 'Data-Only Mode', emoji: '📊', checked: dataOnlyMode, onChange: (e) => setDataOnlyMode(e.target.checked) },
                            ].map((opt, i) => (
                                <label key={i} className="flex items-center gap-4 px-5 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <input type="checkbox" checked={opt.checked} onChange={opt.onChange} className="w-6 h-6 accent-purple-600 cursor-pointer" />
                                    <span className="flex-1 text-slate-900 dark:text-white font-semibold text-lg flex items-center gap-2"><span className="text-2xl">{opt.emoji}</span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {currentRoom && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {dataOnlyMode ? (
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-2xl border border-slate-200 dark:border-slate-800 min-h-[500px] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-8xl mb-6">📊</div>
                                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Data-Only Mode Active</h3>
                                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Monitoring without visual feed</p>
                                        <div className="grid grid-cols-3 gap-6">
                                            {[
                                                { val: currentRoom.occupancy, label: 'Occupants', color: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400' },
                                                { val: currentRoom.energyUsage, label: 'kWh Usage', color: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400' },
                                                { val: currentRoom.capacity - currentRoom.occupancy, label: 'Open Seats', color: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400' },
                                            ].map((s, i) => (
                                                <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-6`}>
                                                    <div className="text-4xl font-black mb-2">{s.val}</div>
                                                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-900 dark:bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 min-h-[500px]">
                                    {ghostMode ? (
                                        <div className="relative h-full min-h-[500px] bg-gradient-to-br from-purple-900/30 via-slate-900 to-indigo-900/30">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative w-full h-full">
                                                    {[...Array(currentRoom.occupancy)].map((_, i) => (
                                                        <div key={i} className="absolute" style={{ left: `${15 + (i % 4) * 22}%`, top: `${20 + Math.floor(i / 4) * 25}%` }}>
                                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-400/40 blur-2xl animate-pulse" style={{ animationDelay: `${i * 0.3}s`, animationDuration: '3s' }}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-4xl">👻</span>
                                                    <div>
                                                        <div className="text-2xl font-black text-white">{currentRoom.occupancy} people detected</div>
                                                        <div className="text-sm text-purple-300 font-semibold uppercase tracking-wider">Anonymized View</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-12">
                                            <div className="text-8xl mb-6">🎥</div>
                                            <p className="text-2xl text-slate-400 mb-8 font-medium">Camera feed disabled for privacy</p>
                                            <button onClick={() => setGhostMode(true)} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl">Enable Ghost View</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span>📍</span>Room Status</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Occupancy', value: `${currentRoom.occupancy}/${currentRoom.capacity}` },
                                        { label: 'Energy Usage', value: `${currentRoom.energyUsage} kWh` },
                                    ].map((s, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{s.label}</span>
                                            <span className="text-lg font-black text-slate-900 dark:text-white">{s.value}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentRoom.status === 'efficient' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                            {currentRoom.status === 'efficient' ? 'Efficient' : 'Review'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl p-6 shadow-xl border border-purple-200 dark:border-purple-800">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span>🔒</span>Privacy Settings</h3>
                                <div className="space-y-3">
                                    {['🔒 No raw video stored', '⚡ Local processing only', '👤 Face detection disabled'].map((s, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span>🔌</span>Active Appliances</h3>
                                <div className="space-y-3">
                                    {[
                                        { emoji: '💡', label: 'Lights', on: currentRoom.appliances.lights, onBg: 'bg-amber-100 dark:bg-amber-900/30', onText: 'text-amber-700 dark:text-amber-400' },
                                        { emoji: '📽️', label: 'Projector', on: currentRoom.appliances.projector, onBg: 'bg-purple-100 dark:bg-purple-900/30', onText: 'text-purple-700 dark:text-purple-400' },
                                        { emoji: '❄️', label: 'AC', on: currentRoom.appliances.ac, onBg: 'bg-cyan-100 dark:bg-cyan-900/30', onText: 'text-cyan-700 dark:text-cyan-400' },
                                    ].map((a, i) => (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${a.on ? a.onBg : 'bg-slate-100 dark:bg-slate-800'}`}>
                                            <span className="text-lg">{a.emoji} {a.label}</span>
                                            <span className={`text-sm font-bold ${a.on ? a.onText : 'text-slate-500 dark:text-slate-400'}`}>{a.on ? 'ON' : 'OFF'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-8 border-2 border-indigo-200 dark:border-indigo-800">
                    <div className="flex gap-6">
                        <div className="text-5xl">ℹ️</div>
                        <div>
                            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">About Ghost View</h4>
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                Ghost View provides privacy-first monitoring by displaying only anonymized representations of occupants. All processing happens locally on-device, and no identifiable information is stored or transmitted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
