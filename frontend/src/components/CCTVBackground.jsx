import { useEffect, useState } from 'react';

const FEEDS = [
    { id: 'CAM-01', label: 'MAIN LOBBY',   status: 'live'    },
    { id: 'CAM-02', label: 'CORRIDOR-B',   status: 'live'    },
    { id: 'CAM-03', label: 'SERVER ROOM',  status: 'offline' },
    { id: 'CAM-04', label: 'ROOF ACCESS',  status: 'live'    },
    { id: 'CAM-05', label: 'LAB WING',     status: 'alert'   },
    { id: 'CAM-06', label: 'PARKING LOT',  status: 'live'    },
];

const statusColor = {
    live:    '#22d3ee',
    alert:   '#fbbf24',
    offline: '#f87171',
};

const statusLabel = {
    live:    '◉ LIVE',
    alert:   '⚠ ALERT',
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
            {/* Ambient glow blobs */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-900/10 rounded-full blur-[100px]" />

            {/* 3 × 2 camera-feed grid */}
            <div className="grid grid-cols-3 grid-rows-2 w-full h-full p-3 gap-1.5 opacity-[0.065]">
                {FEEDS.map((feed, i) => {
                    const col = statusColor[feed.status];
                    return (
                        <div
                            key={feed.id}
                            className="relative overflow-hidden rounded-sm"
                            style={{ border: `1px solid ${col}30`, background: '#000' }}
                        >
                            {/* Corner brackets */}
                            {[
                                'top-2 left-2 border-l-2 border-t-2',
                                'top-2 right-2 border-r-2 border-t-2',
                                'bottom-2 left-2 border-l-2 border-b-2',
                                'bottom-2 right-2 border-r-2 border-b-2',
                            ].map((cls, ci) => (
                                <span key={ci} className={`absolute w-5 h-5 ${cls}`}
                                    style={{ borderColor: `${col}80` }} />
                            ))}

                            {/* Cam ID + status */}
                            <div className="absolute top-[18px] left-9 right-9 flex justify-between">
                                <span className="font-mono text-[9px] tracking-[0.18em]"
                                    style={{ color: `${col}90` }}>
                                    {feed.id} // {feed.label}
                                </span>
                                <span className="font-mono text-[9px] tracking-widest"
                                    style={{ color: col }}>
                                    {statusLabel[feed.status]}
                                </span>
                            </div>

                            {/* Horizontal mid-line */}
                            <div className="absolute left-0 right-0 top-1/2 h-px opacity-10"
                                style={{ background: col }} />

                            {/* Center cross-hair for offline */}
                            {feed.status === 'offline' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-mono text-[12px] tracking-widest text-red-400/30">
                                        — NO SIGNAL —
                                    </span>
                                </div>
                            )}

                            {/* Animated scanline per panel */}
                            {feed.status !== 'offline' && (
                                <div
                                    className="absolute left-0 right-0 h-[1px]"
                                    style={{
                                        background: `linear-gradient(90deg,transparent,${col}30,transparent)`,
                                        animation: `feedScan ${3.5 + i * 0.9}s linear infinite`,
                                    }}
                                />
                            )}

                            {/* REC indicator */}
                            {feed.status === 'live' && (
                                <div className="absolute top-[18px] left-[18px] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/70 animate-pulse" />
                                </div>
                            )}

                            {/* Bottom timestamp */}
                            <div className="absolute bottom-[14px] left-9 right-9 flex justify-between">
                                <span className="font-mono text-[8px] text-slate-600 tracking-wider">{dateStr}</span>
                                <span className="font-mono text-[8px] text-slate-600 tracking-wider">{timeStr}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

            {/* Top + bottom gradient fades so sidebar/navbar blend */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

            {/* Main sweep scanline */}
            <div className="main-scanline" />
        </div>
    );
}
