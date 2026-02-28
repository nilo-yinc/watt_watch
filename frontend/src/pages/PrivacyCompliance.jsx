import { rooms } from '../data/mockData';

export default function PrivacyCompliance() {
    const cameraRooms = rooms.filter(r => r.monitoring === 'Camera');
    const nonCameraRooms = rooms.filter(r => r.monitoring !== 'Camera');

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900">
                <div className="relative max-w-7xl mx-auto px-8 py-20 text-center">
                    <div className="text-8xl mb-6">🔒</div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Privacy & Compliance</h1>
                    <p className="text-2xl text-blue-100 font-light max-w-3xl mx-auto">Transparent data collection and privacy practices</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-12 mb-16 text-center border-2 border-blue-200 dark:border-blue-900">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Privacy-First Approach</h2>
                    <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl mx-auto">Watt-Watch collects only the minimum data necessary for energy monitoring and never stores identifiable information.</p>
                </div>

                {/* Monitoring Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl">🎥</div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Camera Monitoring</h3>
                        </div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{cameraRooms.length}</div>
                        <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">Rooms with Cameras</div>
                        <div className="space-y-2">
                            {cameraRooms.map(room => (
                                <div key={room.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{room.name} ({room.building})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl">📡</div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Non-Camera Monitoring</h3>
                        </div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{nonCameraRooms.length}</div>
                        <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4">Alternative Methods</div>
                        <div className="space-y-3">
                            {['🔌 Smart Plug Monitoring', '📡 Sensor-Based Detection', '📅 Schedule-Based Analysis'].map((s, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Collection */}
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 text-center">Data Collection Practices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-3xl p-8 border-4 border-green-300 dark:border-green-800">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white">✓</div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">What We Collect</h4>
                            </div>
                            <ul className="space-y-3">
                                {['Occupancy count (anonymous)', 'Room temperature & lighting levels', 'Appliance power consumption', 'Entry/exit timestamps (no ID)', 'Energy usage metrics'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-lg"><span className="text-green-600 dark:text-green-400 font-black mt-1">•</span><span className="font-medium">{item}</span></li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-3xl p-8 border-4 border-red-300 dark:border-red-800">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white">✕</div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">What We Don't Collect</h4>
                            </div>
                            <ul className="space-y-3">
                                {['Facial recognition or biometrics', 'Individual identity information', 'Video recordings or images', 'Personal device tracking', 'Audio recordings'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-lg"><span className="text-red-600 dark:text-red-400 font-black mt-1">•</span><span className="font-medium">{item}</span></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Core Principles */}
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 text-center">Core Privacy Principles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { num: '1', title: 'No Raw Video Stored', desc: 'Camera feeds processed in real-time, immediately discarded.' },
                            { num: '2', title: 'Local Processing Only', desc: 'All video analysis on-device. No external transmission.' },
                            { num: '3', title: 'Minimal Data Retention', desc: '30-day max. Aggregated analytics anonymized separately.' },
                            { num: '4', title: 'Transparent Operations', desc: 'All activities logged and auditable on request.' },
                            { num: '5', title: 'Anonymous by Design', desc: 'Individual identification technically impossible.' },
                            { num: '6', title: 'User Control', desc: 'Ghost View and Data-Only modes for privacy layers.' },
                        ].map((p) => (
                            <div key={p.num} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center"><span className="text-2xl font-black text-white">{p.num}</span></div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white">{p.title}</h4>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance */}
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 text-center">Compliance Standards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[{ t: 'GDPR Compliant', s: 'EU Data Protection' }, { t: 'CCPA Compliant', s: 'California Privacy' }, { t: 'ISO 27001', s: 'Information Security' }, { t: 'SOC 2 Type II', s: 'Security & Availability' }].map((std, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-2xl font-black text-white">✓</span></div>
                                <div className="text-xl font-black text-slate-900 dark:text-white mb-1">{std.t}</div>
                                <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">{std.s}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
                    <h3 className="text-4xl font-black text-white mb-4">Questions About Privacy?</h3>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">Our privacy team is available to address any concerns.</p>
                    <button className="px-10 py-5 bg-white hover:bg-slate-100 text-indigo-600 font-black text-xl rounded-2xl shadow-xl">Contact Privacy Team</button>
                </div>
            </div>
        </div>
    );
}
