import { useEffect, useState } from 'react';

const FEEDS = [
    { id: 'CAM-01', label: 'MAIN LOBBY', status: 'live' },
    { id: 'CAM-02', label: 'CORRIDOR-B', status: 'live' },
    { id: 'CAM-03', label: 'SERVER ROOM', status: 'offline' },
    { id: 'CAM-04', label: 'ROOF ACCESS', status: 'live' },
    { id: 'CAM-05', label: 'LAB WING', status: 'alert' },
    { id: 'CAM-06', label: 'PARKING LOT', status: 'live' },
    { id: 'CAM-07', label: 'LECTURE HALL', status: 'live' },
    { id: 'CAM-08', label: 'CAFETERIA', status: 'live' },
    { id: 'CAM-09', label: 'LIBRARY', status: 'alert' },
];

const statusColor = {
    live: '#22d3ee',
    alert: '#fbbf24',
    offline: '#f87171',
};

const statusLabel = {
    live: '◉ LIVE',
    alert: '⚠ ALERT',
    offline: '✕ NO SIGNAL',
};

export default function CCTVBackground() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = time.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    }).toUpperCase();

    return (
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
            {/* ── Dramatic ambient glow blobs ─────────────────── */}
            <div className="absolute top-[-10%] left-[15%] w-[800px] h-[600px] bg-cyan-900/15 rounded-full blur-[160px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[500px] bg-blue-900/15 rounded-full blur-[140px]" />
            <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px]" />
            <div className="absolute top-[10%] right-[30%] w-[300px] h-[300px] bg-purple-900/8 rounded-full blur-[100px] animate-pulse-slow" />

            {/* ── 3 × 3 camera-feed grid ──────────────────────── */}
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 gap-1 opacity-[0.08]">
                {FEEDS.map((feed, i) => {
                    const col = statusColor[feed.status];
                    return (
                        <div
                            key={feed.id}
                            className="relative overflow-hidden rounded-sm"
                            style={{ border: `1px solid ${col}40`, background: '#000' }}
                        >
                            {/* Corner brackets — thicker for drama */}
                            {[
                                'top-1.5 left-1.5 border-l-2 border-t-2',
                                'top-1.5 right-1.5 border-r-2 border-t-2',
                                'bottom-1.5 left-1.5 border-l-2 border-b-2',
                                'bottom-1.5 right-1.5 border-r-2 border-b-2',
                            ].map((cls, ci) => (
                                <span key={ci} className={`absolute w-6 h-6 ${cls}`}
                                    style={{ borderColor: `${col}99` }} />
                            ))}

                            {/* Crosshair center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-px opacity-30" style={{ background: col }} />
                                <div className="absolute w-px h-8 opacity-30" style={{ background: col }} />
                                <div className="absolute w-3 h-3 rounded-full border opacity-20" style={{ borderColor: col }} />
                            </div>

                            {/* Cam ID + status */}
                            <div className="absolute top-[14px] left-8 right-8 flex justify-between">
                                <span className="font-mono text-[8px] tracking-[0.18em]"
                                    style={{ color: `${col}99` }}>
                                    {feed.id} // {feed.label}
                                </span>
                                <span className="font-mono text-[8px] tracking-widest"
                                    style={{ color: col }}>
                                    {statusLabel[feed.status]}
                                </span>
                            </div>

                            {/* Horizontal scan guidelines */}
                            <div className="absolute left-0 right-0 top-1/3 h-px opacity-5" style={{ background: col }} />
                            <div className="absolute left-0 right-0 top-2/3 h-px opacity-5" style={{ background: col }} />

                            {/* No signal for offline */}
                            {feed.status === 'offline' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-mono text-[11px] tracking-widest text-red-400/30">
                                        — NO SIGNAL —
                                    </span>
                                </div>
                            )}

                            {/* Animated scanline per panel */}
                            {feed.status !== 'offline' && (
                                <div
                                    className="absolute left-0 right-0 h-[1px]"
                                    style={{
                                        background: `linear-gradient(90deg,transparent,${col}40,transparent)`,
                                        animation: `feedScan ${3 + i * 0.7}s linear infinite`,
                                    }}
                                />
                            )}

                            {/* REC indicator */}
                            {feed.status === 'live' && (
                                <div className="absolute top-[14px] left-[10px] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/80 animate-pulse" />
                                </div>
                            )}

                            {/* Bottom timestamp */}
                            <div className="absolute bottom-[10px] left-8 right-8 flex justify-between">
                                <span className="font-mono text-[7px] text-slate-600 tracking-wider">{dateStr}</span>
                                <span className="font-mono text-[7px] text-slate-600 tracking-wider">{timeStr}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Vignette — darker edges ─────────────────────── */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_30%,rgba(0,0,0,0.92)_100%)]" />

            {/* ── Edge gradient fades for sidebar/navbar blend ── */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />

            {/* ── Moving scan lines ──────────────────────────── */}
            <div className="main-scanline" />
            <div className="scanline-secondary" />

            {/* ── Static noise grain ─────────────────────────── */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
