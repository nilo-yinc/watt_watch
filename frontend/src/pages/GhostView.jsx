import { useEffect, useMemo, useRef, useState } from 'react';
import { Spotlight } from '../components/ui/spotlight';
import { useRooms } from '../hooks/useRooms';
import { useApp } from '../context/AppContext';

export default function GhostView() {
    const { rooms } = useRooms();
    const { ghostFrames, backendOnline } = useApp();
    const [selectedRoom, setSelectedRoom] = useState('');
    const [ghostMode, setGhostMode] = useState(true);
    const [dataOnlyMode, setDataOnlyMode] = useState(false);
    const [feedError, setFeedError] = useState('');
    const [timeNow, setTimeNow] = useState(Date.now());
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const cameraRooms = useMemo(() => rooms.filter((room) => room.camera_source), [rooms]);
    const ghostFrameRoomIds = useMemo(() => Object.keys(ghostFrames || {}), [ghostFrames]);

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
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
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
            } catch {
                setFeedError('Camera permission denied or no camera found.');
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

    const selected = cameraRooms.find((room) => room.id === selectedRoom);
    const activeGhostRoomId =
        (selected?.id && ghostFrames[selected.id] ? selected.id : null) || ghostFrameRoomIds[0] || null;
    const activeRoom = cameraRooms.find((room) => room.id === activeGhostRoomId) || selected;
    const activeGhostFrame = activeGhostRoomId ? ghostFrames[activeGhostRoomId] : null;
    const activeGhostSrc = activeGhostFrame?.image_b64
        ? `data:image/jpeg;base64,${activeGhostFrame.image_b64}`
        : '';
    const usingYoloStream = ghostMode && !!activeGhostSrc;
    const isWaste = activeRoom?.waste_detected;
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
                    <p className="text-xs font-mono text-[var(--ww-text-3)]">
                        Anonymized surveillance feed · No PII stored
                    </p>
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
                                    <option key={room.id} value={room.id} className="bg-slate-900">
                                        {room.name}
                                    </option>
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

                {activeRoom && (
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
                                    <span className="text-[9px] font-mono text-[var(--ww-text-muted)]">
                                        {activeRoom.name.toUpperCase()}
                                    </span>
                                </div>

                                {dataOnlyMode ? (
                                    <div className="flex items-center justify-center p-12" style={{ minHeight: '360px' }}>
                                        <div className="text-center">
                                            <div className="text-[var(--ww-text-muted)] text-5xl font-mono mb-4">◉</div>
                                            <p className="text-xs font-mono text-[var(--ww-text-3)] mb-6">VISUAL FEED DISABLED</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative" style={{ minHeight: '360px' }}>
                                        {usingYoloStream ? (
                                            <img src={activeGhostSrc} alt="Ghost feed" className="w-full h-[360px] object-cover" />
                                        ) : ghostMode ? (
                                            <div className="w-full h-[360px] flex items-center justify-center text-center bg-black/80 px-6">
                                                <div>
                                                    <div className="text-sm font-mono text-red-400 mb-2">PRIVACY LOCK</div>
                                                    <div className="text-xs font-mono text-[var(--ww-text-3)]">
                                                        Ghost Mode needs YOLO stream.
                                                    </div>
                                                    <div className="text-xs font-mono text-[var(--ww-text-3)] mt-1">
                                                        Start `computer_vision` service for person-only blur.
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="w-full h-[360px] object-cover"
                                            />
                                        )}
                                        {ghostMode && (
                                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_50%,rgba(88,28,135,0.20),transparent_50%)]" />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <div className="text-[9px] font-mono text-purple-400 tracking-wider">
                                                {ghostMode ? 'GHOST MODE' : 'LIVE MODE'}
                                            </div>
                                            <div className="text-xs font-mono text-[var(--ww-text-1)] mt-1">
                                                {usingYoloStream ? `${activeRoom.person_count} detected` : 'N/A (CV stream required)'}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="h-px bg-gradient-to-r from-purple-500/20 via-transparent to-transparent mb-2" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-purple-400" />
                                                <span className="text-[8px] font-mono text-[var(--ww-text-3)]">
                                                    {feedError
                                                        || (!backendOnline
                                                            ? 'Backend offline: showing local fallback only'
                                                            : usingYoloStream
                                                                ? 'YOLO blur stream active'
                                                                : 'YOLO stream unavailable: privacy lock active')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="hud-card p-4">
                                <div className="hud-label mb-3">FEED STATUS</div>
                                {[
                                    { label: 'Occupancy', val: usingYoloStream ? `${activeRoom.person_count}` : 'N/A' },
                                    { label: 'Power Draw', val: activeRoom.waste_detected ? 'High' : 'Normal' },
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
                                    { l: 'Lights', on: activeRoom.appliances?.lights },
                                    { l: 'Fan', on: activeRoom.appliances?.fan },
                                    { l: 'Projector', on: activeRoom.appliances?.projector },
                                    { l: 'AC', on: activeRoom.appliances?.ac },
                                    { l: 'Monitors', on: activeRoom.appliances?.monitors },
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
