import { Link } from 'react-router-dom';
import { computerLabs } from '../data/mockData';

export default function ComputerLabIntelligence() {
    const totalDesktops = computerLabs.reduce((s, l) => s + l.totalDesktops, 0);
    const totalOn = computerLabs.reduce((s, l) => s + l.desktopsOn, 0);
    const totalHiddenWaste = computerLabs.filter(l => l.hiddenWaste).length;
    const totalWaste = computerLabs.reduce((s, l) => s + l.energyWaste, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 dark:from-black dark:via-indigo-950 dark:to-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl"></div>
                    <div className="relative">
                        <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Computer Lab Intelligence</h1>
                        <p className="text-xl text-slate-400 font-light">Advanced monitoring for computer lab efficiency</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Desktops', val: totalDesktops, color: 'border-cyan-500/50', accent: 'text-cyan-400', glow: 'from-blue-500 to-cyan-500' },
                        { label: 'Currently Active', val: totalOn, sub: `${((totalOn / totalDesktops) * 100).toFixed(1)}% utilization`, color: 'border-emerald-500/50', accent: 'text-emerald-400', glow: 'from-green-500 to-emerald-500' },
                        { label: 'Hidden Waste', val: totalHiddenWaste, sub: 'Labs with monitor-off CPUs', color: 'border-red-500/50', accent: 'text-red-400', glow: 'from-red-500 to-orange-500' },
                        { label: 'Energy Waste', val: `${totalWaste.toFixed(1)} kWh`, color: 'border-purple-500/50', accent: 'text-purple-400', glow: 'from-purple-500 to-pink-500' },
                    ].map((s, i) => (
                        <div key={i} className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r ${s.glow} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                            <div className={`relative bg-slate-800/80 dark:bg-slate-950/80 backdrop-blur-sm border-2 ${s.color} rounded-2xl p-6`}>
                                <div className={`text-sm font-bold ${s.accent} uppercase tracking-widest mb-2`}>{s.label}</div>
                                <div className="text-4xl font-black text-white mb-1">{s.val}</div>
                                {s.sub && <div className={`${s.accent} text-sm font-semibold`}>{s.sub}</div>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {computerLabs.map(lab => (
                        <div key={lab.id} className="relative group">
                            {lab.hiddenWaste && <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-3xl blur-xl"></div>}
                            <div className="relative bg-slate-800/90 dark:bg-slate-950/90 backdrop-blur-sm border-2 border-slate-700 rounded-3xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-1">{lab.name}</h3>
                                        <p className="text-slate-400 font-medium">{lab.building}</p>
                                    </div>
                                    {lab.hiddenWaste && <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-xs font-black uppercase shadow-lg">⚠️ Hidden Waste</span>}
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { val: lab.occupancy, label: 'Occupants', accent: 'text-cyan-400' },
                                        { val: `${lab.desktopsOn}/${lab.totalDesktops}`, label: 'PCs On', accent: 'text-green-400' },
                                        { val: lab.energyWaste, label: 'kWh Waste', accent: 'text-red-400' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                                            <div className={`text-2xl font-black ${s.accent} mb-1`}>{s.val}</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-900/50 rounded-2xl p-5 border border-slate-700 mb-6">
                                    <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Desktop Analysis</div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        {[
                                            { emoji: '💻', val: lab.desktopsOn, label: 'ON' },
                                            { emoji: '🖥️', val: lab.monitorsOff, label: 'Monitors OFF', accent: 'text-orange-400' },
                                            { emoji: '⚙️', val: lab.cpuActive, label: 'CPU Active', accent: 'text-green-400' },
                                        ].map((d, i) => (
                                            <div key={i}>
                                                <div className="text-3xl mb-2">{d.emoji}</div>
                                                <div className={`text-2xl font-black ${d.accent || 'text-white'}`}>{d.val}</div>
                                                <div className="text-xs text-slate-400 uppercase mt-1">{d.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {lab.monitorsOff > 5 && (
                                        <div className="mt-4 p-4 bg-red-500/20 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
                                            <span className="text-xl">⚠️</span>
                                            <span className="text-sm font-semibold text-red-300">{lab.monitorsOff} desktops running with monitors off</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-slate-400 uppercase">Efficiency</span>
                                        <span className="text-sm font-black text-cyan-400">{((lab.occupancy / lab.desktopsOn) * 100 || 0).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700">
                                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${(lab.occupancy / lab.desktopsOn) * 100 || 0}%` }}></div>
                                    </div>
                                </div>

                                <Link to={`/room/${lab.id}`} className="block w-full text-center px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg">View Details →</Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/50 backdrop-blur-sm border-2 border-slate-700 rounded-3xl p-8">
                    <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3"><span className="text-4xl">💡</span>Optimization Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Monitor-Off Detection', desc: 'CPUs with monitors off consume 60% power. Auto-shutdown after 15 min idle.', accent: 'text-cyan-400', border: 'border-cyan-500/30 hover:border-cyan-500/60' },
                            { title: 'Group Power Mgmt', desc: 'Auto-sleep inactive desktops during lab hours — save up to 45 kWh daily.', accent: 'text-purple-400', border: 'border-purple-500/30 hover:border-purple-500/60' },
                            { title: 'Occupancy Control', desc: 'Below 20% occupancy: reduce AC and dim lights for optimal efficiency.', accent: 'text-pink-400', border: 'border-pink-500/30 hover:border-pink-500/60' },
                        ].map((tip, i) => (
                            <div key={i} className={`bg-slate-900/50 rounded-2xl p-6 border ${tip.border} transition-colors`}>
                                <h4 className={`text-xl font-bold ${tip.accent} mb-3`}>{tip.title}</h4>
                                <p className="text-slate-300 leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
