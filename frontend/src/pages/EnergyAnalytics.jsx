import { energyData } from '../data/mockData';

export default function EnergyAnalytics() {
    const { savedOverTime, wasteByRoom, kpis } = energyData;
    const maxSaved = Math.max(...savedOverTime.map(d => d.kwh));
    const maxWaste = Math.max(...wasteByRoom.map(d => d.waste));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Energy Analytics</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-light">Performance insights and trends</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { emoji: '⚡', label: 'Total Energy Saved', value: kpis.totalSaved.toLocaleString(), unit: 'kWh this month', color: 'from-green-400 to-emerald-500 dark:from-green-600 dark:to-emerald-700' },
                        { emoji: '🌍', label: 'CO₂ Reduction', value: kpis.co2Reduced.toLocaleString(), unit: 'kg this month', color: 'from-blue-400 to-cyan-500 dark:from-blue-600 dark:to-cyan-700' },
                        { emoji: '💰', label: 'Cost Saved', value: `₹${kpis.costSaved.toLocaleString()}`, unit: 'this month', color: 'from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700' },
                    ].map((kpi, i) => (
                        <div key={i} className={`bg-gradient-to-br ${kpi.color} rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                            <div className="flex items-start gap-4">
                                <div className="text-5xl">{kpi.emoji}</div>
                                <div>
                                    <div className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">{kpi.label}</div>
                                    <div className="text-4xl font-black text-white mb-1">{kpi.value}</div>
                                    <div className="text-lg text-white/80 font-semibold">{kpi.unit}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bar Chart - Energy Saved */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl mb-8 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Energy Saved Over Time</h2>
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Daily Savings (kWh)</span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-72">
                        {savedOverTime.map((data, i) => {
                            const height = (data.kwh / maxSaved) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                    <div className="flex-1 w-full flex items-end">
                                        <div className="w-full bg-gradient-to-t from-green-500 to-emerald-400 dark:from-green-600 dark:to-emerald-500 rounded-t-xl transition-all duration-300 hover:scale-105 cursor-pointer relative"
                                            style={{ height: `${height}%` }}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {data.kwh} kWh
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 -rotate-45 origin-top-left">
                                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Horizontal Bars - Waste by Room */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl mb-8 border border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Energy Waste by Room</h2>
                    <div className="space-y-6">
                        {wasteByRoom.map((data, i) => {
                            const width = (data.waste / maxWaste) * 100;
                            return (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{data.room}</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">{data.waste} kWh</span>
                                    </div>
                                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 group-hover:from-red-400 group-hover:to-orange-400"
                                            style={{ width: `${width}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: '↑', title: 'Peak Performance', desc: 'Thursday showed the highest energy savings at 178 kWh during peak hours.', color: 'from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200 dark:border-emerald-800', iconBg: 'bg-emerald-500' },
                        { icon: '⚠️', title: 'Lab Optimization', desc: 'Computer Lab B-204 accounts for 42% of total waste. Auto-shutdown could save 60 kWh/day.', color: 'from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800', iconBg: 'bg-amber-500' },
                        { icon: '📊', title: 'Weekend Pattern', desc: 'Energy savings drop 45% on weekends due to reduced monitoring coverage.', color: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-500' },
                    ].map((insight, i) => (
                        <div key={i} className={`bg-gradient-to-br ${insight.color} rounded-2xl p-6 border-2`}>
                            <div className={`inline-flex items-center justify-center w-14 h-14 ${insight.iconBg} text-white rounded-2xl text-2xl font-black mb-4`}>{insight.icon}</div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{insight.title}</h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{insight.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
