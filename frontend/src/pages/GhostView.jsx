import { useState } from 'react';
import { rooms } from '../data/mockData';
import { Spotlight } from '../components/ui/spotlight';

export default function GhostView() {
    const [selectedRoom, setSelectedRoom] = useState('r1');
    const [ghostMode, setGhostMode] = useState(true);
    const [dataOnlyMode, setDataOnlyMode] = useState(false);

    const cameraRooms = rooms.filter(r => r.monitoring === 'Camera');
    const currentRoom = cameraRooms.find(r => r.id === selectedRoom);

    return (
        <Spotlight className="min-h-full">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span className="hud-label">PRIVACY MODE</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Ghost View</h1>
                    <p className="text-xs font-mono text-slate-500">Anonymized surveillance feed · No PII stored</p>
                </div>

                {/* Controls */}
                <div className="hud-card p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="hud-label mb-2">SELECT FEED</div>
                            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent border border-white/[0.06] rounded-md text-slate-300 text-xs font-mono focus:border-cyan-500/30 focus:outline-none">
                                {cameraRooms.map(room => (
                                    <option key={room.id} value={room.id} className="bg-slate-900">{room.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 px-3 py-2 border border-white/[0.06] rounded-md cursor-pointer hover:border-purple-500/20 transition-colors w-full">
                                <input type="checkbox" checked={ghostMode} onChange={(e) => setGhostMode(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-purple-400" />
                                <span className="text-xs font-mono text-slate-400">GHOST MODE</span>
                            </label>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 px-3 py-2 border border-white/[0.06] rounded-md cursor-pointer hover:border-cyan-500/20 transition-colors w-full">
                                <input type="checkbox" checked={dataOnlyMode} onChange={(e) => setDataOnlyMode(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-cyan-400" />
                                <span className="text-xs font-mono text-slate-400">DATA ONLY</span>
                            </label>
                        </div>
                    </div>
                </div>

                {currentRoom && (
                    <div className="grid grid-cols-3 gap-4">
                        {/* Feed viewport */}
                        <div className="col-span-2">
                            <div className="hud-card overflow-hidden" style={{ minHeight: '420px' }}>
                                {/* HUD overlay header */}
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.03]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                        <span className="text-[9px] font-mono text-red-400 tracking-wider">REC</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-600">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                                    <span className="text-[9px] font-mono text-slate-600">{currentRoom.name.toUpperCase()}</span>
                                </div>

                                {dataOnlyMode ? (
                                    <div className="flex items-center justify-center p-12" style={{ minHeight: '360px' }}>
                                        <div className="text-center">
                                            <div className="text-slate-700 text-5xl font-mono mb-4">◉</div>
                                            <p className="text-xs font-mono text-slate-500 mb-6">VISUAL FEED DISABLED</p>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { label: 'OCCUPANTS', val: currentRoom.occupancy, accent: 'text-cyan-400' },
                                                    { label: 'POWER', val: `${currentRoom.energyUsage}kW`, accent: 'text-amber-400' },
                                                    { label: 'OPEN', val: currentRoom.capacity - currentRoom.occupancy, accent: 'text-emerald-400' },
                                                ].map((s, i) => (
                                                    <div key={i} className="bg-white/[0.02] rounded-md p-3">
                                                        <div className="text-[8px] font-mono text-slate-600 mb-1">{s.label}</div>
                                                        <div className={`text-lg font-mono font-bold ${s.accent}`}>{s.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : ghostMode ? (
                                    <div className="relative" style={{ minHeight: '360px' }}>
                                        {/* Ghost view — heat blobs */}
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(88,28,135,0.08),transparent_50%)]" />
                                        <div className="absolute inset-0">
                                            {[...Array(Math.min(currentRoom.occupancy, 8))].map((_, i) => (
                                                <div key={i} className="absolute" style={{ left: `${12 + (i % 4) * 22}%`, top: `${15 + Math.floor(i / 4) * 35}%` }}>
                                                    <div className="w-12 h-12 rounded-full bg-purple-500/15 blur-xl animate-pulse" style={{ animationDelay: `${i * 0.5}s`, animationDuration: '4s' }} />
                                                    <div className="absolute inset-2 rounded-full border border-purple-500/20" />
                                                </div>
                                            ))}
                                        </div>
                                        {/* HUD overlay */}
                                        <div className="absolute top-4 left-4">
                                            <div className="text-[9px] font-mono text-purple-400 tracking-wider">GHOST MODE</div>
                                            <div className="text-xs font-mono text-white mt-1">{currentRoom.occupancy} detected</div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="h-px bg-gradient-to-r from-purple-500/20 via-transparent to-transparent mb-2" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-purple-400" />
                                                <span className="text-[8px] font-mono text-slate-500">Anonymized · No video stored · Local processing</span>
                                            </div>
                                        </div>
                                        {/* Corner brackets */}
                                        <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-purple-500/20" />
                                        <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-purple-500/20" />
                                        <div className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-purple-500/20" />
                                        <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-purple-500/20" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center" style={{ minHeight: '360px' }}>
                                        <div className="text-center">
                                            <div className="text-3xl text-slate-700 mb-3">⊘</div>
                                            <p className="text-xs font-mono text-slate-600 mb-4">FEED OFFLINE</p>
                                            <button onClick={() => setGhostMode(true)} className="text-[10px] font-mono text-cyan-400 px-3 py-1.5 border border-cyan-500/20 rounded-md hover:bg-cyan-500/5 transition-colors">
                                                ENABLE GHOST VIEW
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Side panel */}
                        <div className="space-y-4">
                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">FEED STATUS</div>
                                {[
                                    { label: 'Occupancy', val: `${currentRoom.occupancy}/${currentRoom.capacity}` },
                                    { label: 'Power Draw', val: `${currentRoom.energyUsage} kWh` },
                                    { label: 'Status', val: currentRoom.status === 'efficient' ? 'CLEAR' : 'REVIEW', accent: currentRoom.status === 'efficient' ? 'text-emerald-400' : 'text-amber-400' },
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0">
                                        <span className="text-[10px] font-mono text-slate-600">{s.label}</span>
                                        <span className={`text-xs font-mono font-bold ${s.accent || 'text-white'}`}>{s.val}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">PRIVACY LAYER</div>
                                {['No raw video stored', 'Local processing only', 'Face detection disabled', 'Audit-logged access'].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 py-1.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                        <span className="text-[10px] font-mono text-slate-400">{s}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">APPLIANCES</div>
                                {[
                                    { l: 'Lights', on: currentRoom.appliances.lights },
                                    { l: 'Projector', on: currentRoom.appliances.projector },
                                    { l: 'AC', on: currentRoom.appliances.ac },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                                        <span className="text-[10px] font-mono text-slate-500">{a.l}</span>
                                        <span className={`text-[9px] font-mono font-bold tracking-wider ${a.on ? 'text-amber-400' : 'text-slate-700'}`}>{a.on ? 'ON' : 'OFF'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Spotlight>
    );
}
