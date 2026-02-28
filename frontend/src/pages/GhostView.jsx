import { useEffect, useMemo, useRef, useState } from 'react';
import { Spotlight } from '../components/ui/spotlight';
import { useRooms } from '../hooks/useRooms';

export default function GhostView() {
    const { rooms } = useRooms();
    const [selectedRoom, setSelectedRoom] = useState('');
    const [ghostMode, setGhostMode] = useState(true);
    const [dataOnlyMode, setDataOnlyMode] = useState(false);
    const [feedError, setFeedError] = useState('');
    const [timeNow, setTimeNow] = useState(Date.now());
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const cameraRooms = useMemo(
        () => rooms.filter((room) => room.camera_source),
        [rooms]
    );

    useEffect(() => {
        if (!selectedRoom && cameraRooms.length) {
            setSelectedRoom(cameraRooms[0].id);
        }
    }, [cameraRooms, selectedRoom]);

    useEffect(() => {
        const timer = setInterval(() => setTimeNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function openCamera() {
            if (dataOnlyMode) {
                setFeedError('');
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user',
                    },
                    audio: false,
                });

                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setFeedError('');
            } catch (error) {
                setFeedError('Camera access denied or unavailable. Allow webcam permission in browser.');
            }
        }

        openCamera();
        return () => {
            cancelled = true;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, [dataOnlyMode]);

    const currentRoom = cameraRooms.find((room) => room.id === selectedRoom);
    const isWaste = currentRoom?.waste_detected;
    const statusText = isWaste ? 'WASTE' : 'CLEAR';
    const statusClass = isWaste ? 'text-red-400' : 'text-emerald-400';

    return (
        <Spotlight className="min-h-full">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span className="hud-label">PRIVACY MODE</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--ww-text-1)] tracking-tight mb-1">Ghost View</h1>
                    <p className="text-xs font-mono text-[var(--ww-text-3)]">Anonymized surveillance feed · No PII stored</p>
                </div>

                <div className="hud-card p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="hud-label mb-2">SELECT FEED</div>
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent border border-[var(--ww-border)] rounded-md text-[var(--ww-text-2)] text-xs font-mono focus:border-cyan-500/30 focus:outline-none"
                            >
                                {cameraRooms.map((room) => (
                                    <option key={room.id} value={room.id} className="bg-slate-900">{room.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 px-3 py-2 border border-[var(--ww-border)] rounded-md cursor-pointer hover:border-purple-500/20 transition-colors w-full">
                                <input
                                    type="checkbox"
                                    checked={ghostMode}
                                    onChange={(e) => setGhostMode(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-purple-400"
                                />
                                <span className="text-xs font-mono text-[var(--ww-text-2)]">GHOST MODE</span>
                            </label>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 px-3 py-2 border border-[var(--ww-border)] rounded-md cursor-pointer hover:border-cyan-500/20 transition-colors w-full">
                                <input
                                    type="checkbox"
                                    checked={dataOnlyMode}
                                    onChange={(e) => setDataOnlyMode(e.target.checked)}
                                    className="w-3.5 h-3.5 accent-cyan-400"
                                />
                                <span className="text-xs font-mono text-[var(--ww-text-2)]">DATA ONLY</span>
                            </label>
                        </div>
                    </div>
                </div>

                {currentRoom && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="hud-card overflow-hidden" style={{ minHeight: '420px' }}>
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.03]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                        <span className="text-[9px] font-mono text-red-400 tracking-wider">REC</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-[var(--ww-text-muted)]">
                                        {new Date(timeNow).toLocaleTimeString('en-US', { hour12: false })}
                                    </span>
                                    <span className="text-[9px] font-mono text-[var(--ww-text-muted)]">{currentRoom.name.toUpperCase()}</span>
                                </div>

                                {dataOnlyMode ? (
                                    <div className="flex items-center justify-center p-12" style={{ minHeight: '360px' }}>
                                        <div className="text-center">
                                            <div className="text-[var(--ww-text-muted)] text-5xl font-mono mb-4">◉</div>
                                            <p className="text-xs font-mono text-[var(--ww-text-3)] mb-6">VISUAL FEED DISABLED</p>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { label: 'PEOPLE', val: currentRoom.person_count, accent: 'text-cyan-400' },
                                                    { label: 'STATUS', val: statusText, accent: statusClass },
                                                    { label: 'WASTE', val: currentRoom.waste_duration ? `${Math.floor(currentRoom.waste_duration / 60)}m` : '0m', accent: 'text-amber-400' },
                                                ].map((s, i) => (
                                                    <div key={i} className="bg-white/[0.02] rounded-md p-3">
                                                        <div className="text-[8px] font-mono text-[var(--ww-text-muted)] mb-1">{s.label}</div>
                                                        <div className={`text-lg font-mono font-bold ${s.accent}`}>{s.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative" style={{ minHeight: '360px' }}>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className={`w-full h-[360px] object-cover ${ghostMode ? 'blur-[10px] saturate-[0.7] brightness-[0.8]' : ''}`}
                                        />
                                        {ghostMode && (
                                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,rgba(88,28,135,0.20),transparent_50%)]" />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <div className="text-[9px] font-mono text-purple-400 tracking-wider">
                                                {ghostMode ? 'GHOST MODE' : 'LIVE MODE'}
                                            </div>
                                            <div className="text-xs font-mono text-[var(--ww-text-1)] mt-1">{currentRoom.person_count} detected</div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="h-px bg-gradient-to-r from-purple-500/20 via-transparent to-transparent mb-2" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-purple-400" />
                                                <span className="text-[8px] font-mono text-[var(--ww-text-3)]">
                                                    {feedError || 'Anonymized preview · No raw video stored · Local processing'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-purple-500/20" />
                                        <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-purple-500/20" />
                                        <div className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-purple-500/20" />
                                        <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-purple-500/20" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">FEED STATUS</div>
                                {[
                                    { label: 'Occupancy', val: `${currentRoom.person_count}` },
                                    { label: 'Power Draw', val: currentRoom.waste_detected ? 'High' : 'Normal' },
                                    { label: 'Status', val: statusText, accent: statusClass },
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0">
                                        <span className="text-[10px] font-mono text-[var(--ww-text-muted)]">{s.label}</span>
                                        <span className={`text-xs font-mono font-bold ${s.accent || 'text-[var(--ww-text-1)]'}`}>{s.val}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">PRIVACY LAYER</div>
                                {['No raw video stored', 'Local processing only', 'Face/body blur in Ghost Mode', 'Audit-logged access'].map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 py-1.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                                        <span className="text-[10px] font-mono text-[var(--ww-text-2)]">{s}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">APPLIANCES</div>
                                {[
                                    { l: 'Lights', on: currentRoom.appliances?.lights },
                                    { l: 'Projector', on: currentRoom.appliances?.projector },
                                    { l: 'Monitors', on: currentRoom.appliances?.monitors },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                                        <span className="text-[10px] font-mono text-[var(--ww-text-3)]">{a.l}</span>
                                        <span className={`text-[9px] font-mono font-bold tracking-wider ${a.on ? 'text-amber-400' : 'text-[var(--ww-text-muted)]'}`}>
                                            {a.on ? 'ON' : 'OFF'}
                                        </span>
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
