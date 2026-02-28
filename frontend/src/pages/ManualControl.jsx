import { useState } from 'react';
import { rooms } from '../data/mockData';

export default function ManualControl() {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    const selectedRoomData = rooms.find(r => r.id === selectedRoom);
    const canTakeAction = selectedRoomData && selectedRoomData.occupancy === 0;

    const handleAction = (action) => { setActionType(action); setShowModal(true); };
    const confirmAction = () => setShowModal(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-red-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-red-950/30 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            {['bg-red-500', 'bg-orange-500', 'bg-yellow-500'].map((c, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${c} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Manual Control & Safety Panel</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Direct control of room power systems</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl mt-6 md:mt-0">
                        <span className="text-3xl">🛡️</span><span className="text-white font-bold text-lg">Safety Protocols Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Room Selection */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl">📍</div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Room Selection</h2>
                        </div>
                        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}
                            className="w-full px-6 py-5 mb-6 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 font-bold text-lg">
                            <option value="">Choose a room...</option>
                            {rooms.map(room => (<option key={room.id} value={room.id}>{room.name} ({room.building})</option>))}
                        </select>
                        {selectedRoomData && (
                            <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-2 gap-4">
                                    {[{ l: 'Room Type', v: selectedRoomData.type }, { l: 'Building', v: selectedRoomData.building }].map((d, i) => (
                                        <div key={i}><div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{d.l}</div><div className="text-lg font-black text-slate-900 dark:text-white">{d.v}</div></div>
                                    ))}
                                </div>
                                <div className={`p-4 rounded-xl border-2 ${selectedRoomData.occupancy > 0 ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800' : 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800'}`}>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Occupancy</div>
                                    <div className={`text-3xl font-black ${selectedRoomData.occupancy > 0 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>{selectedRoomData.occupancy} people</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Power Control */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Power Control</h2>
                        </div>
                        {!selectedRoom ? (
                            <div className="flex flex-col items-center justify-center py-20"><div className="text-8xl mb-4">⚡</div><p className="text-xl text-slate-600 dark:text-slate-400 font-semibold">Select a room to view controls</p></div>
                        ) : !canTakeAction ? (
                            <div className="p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl border-4 border-red-300 dark:border-red-800">
                                <div className="flex gap-6">
                                    <div className="text-6xl">⚠️</div>
                                    <div>
                                        <h3 className="text-2xl font-black text-red-800 dark:text-red-400 mb-3">Safety Lock Engaged</h3>
                                        <p className="text-lg text-red-700 dark:text-red-300">Power controls disabled — <span className="font-black">{selectedRoomData.occupancy} occupants</span> detected.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {[
                                    { action: 'powerOff', emoji: '🔴', label: 'Turn Power OFF', sub: 'Disable all appliances', color: 'from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 border-red-400 dark:border-red-800' },
                                    { action: 'powerOn', emoji: '🟢', label: 'Restore Power', sub: 'Enable all appliances', color: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-green-400 dark:border-green-800' },
                                ].map((btn, i) => (
                                    <button key={i} onClick={() => handleAction(btn.action)}
                                        className={`w-full p-8 bg-gradient-to-br ${btn.color} rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border-4`}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-6xl">{btn.emoji}</div>
                                            <div className="text-left flex-1">
                                                <div className="text-3xl font-black text-white mb-1">{btn.label}</div>
                                                <div className="text-white/80 font-semibold">{btn.sub}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Appliance States */}
                {selectedRoomData && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-slate-200 dark:border-slate-800 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-2xl">🔌</div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Current Appliance States</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { emoji: '💡', label: 'Lights', on: selectedRoomData.appliances.lights, onColor: 'from-amber-100 to-yellow-100 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-400 dark:border-amber-700', textColor: 'text-amber-700 dark:text-amber-400' },
                                { emoji: '📽️', label: 'Projector', on: selectedRoomData.appliances.projector, onColor: 'from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-400 dark:border-purple-700', textColor: 'text-purple-700 dark:text-purple-400' },
                                { emoji: '❄️', label: 'AC', on: selectedRoomData.appliances.ac, onColor: 'from-cyan-100 to-blue-100 dark:from-cyan-950/50 dark:to-blue-950/50 border-cyan-400 dark:border-cyan-700', textColor: 'text-cyan-700 dark:text-cyan-400' },
                            ].map((a, i) => (
                                <div key={i} className={`p-6 rounded-2xl border-4 transition-all ${a.on ? `bg-gradient-to-br ${a.onColor}` : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                                    <div className="text-5xl mb-3">{a.emoji}</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white mb-1">{a.label}</div>
                                    <div className={`text-sm font-bold uppercase ${a.on ? a.textColor : 'text-slate-500 dark:text-slate-400'}`}>{a.on ? 'ON' : 'OFF'}</div>
                                </div>
                            ))}
                            {selectedRoomData.appliances.desktops > 0 && (
                                <div className="p-6 rounded-2xl border-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-400 dark:border-blue-700">
                                    <div className="text-5xl mb-3">💻</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white mb-1">Desktops</div>
                                    <div className="text-sm font-bold uppercase text-blue-700 dark:text-blue-400">{selectedRoomData.appliances.desktops} Active</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Safety */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-3"><span className="text-4xl">🛡️</span>Safety Protocols</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['Occupancy detection prevents accidental power-off', 'All actions logged with timestamp and operator', 'Confirmation required before power changes', 'Emergency restore from any admin terminal'].map((t, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
                                <span className="text-3xl">✓</span><span className="text-lg text-white font-semibold">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-slate-200 dark:border-slate-800">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Confirm Action</h2>
                        <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                            {actionType === 'powerOff' ? 'Turn OFF power' : 'Restore power'} in <span className="font-black">{selectedRoomData?.name}</span>?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl">Cancel</button>
                            <button onClick={confirmAction} className={`flex-1 px-6 py-4 text-white font-bold rounded-xl shadow-lg ${actionType === 'powerOff' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
