import { useState } from 'react';
import { auditLogs } from '../data/mockData';

export default function AuditLogs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('all');

    const actions = ['all', ...new Set(auditLogs.map(l => l.action))];

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.room.toLowerCase().includes(searchTerm.toLowerCase()) || log.reason.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'all' || log.action === filterAction;
        return matchesSearch && matchesAction;
    });

    const formatTimestamp = (ts) => new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const getConfidenceColor = (c) => c >= 95 ? 'high' : c >= 80 ? 'medium' : 'low';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">Audit Logs</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-light">Complete system activity history</p>
                    </div>
                    <button onClick={() => alert('Export logs as CSV/JSON')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">📥 Export Logs</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="relative">
                        <input type="text" placeholder="Search by room or reason..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-4 pl-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100" />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    </div>
                    <div className="relative">
                        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 appearance-none cursor-pointer">
                            {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { val: filteredLogs.length, label: 'Total Entries', color: 'from-blue-500 to-cyan-500' },
                        { val: auditLogs.filter(l => l.user === 'System').length, label: 'System Actions', color: 'from-purple-500 to-pink-500' },
                        { val: auditLogs.filter(l => l.user !== 'System').length, label: 'Manual Actions', color: 'from-orange-500 to-red-500' },
                    ].map((s, i) => (
                        <div key={i} className={`bg-gradient-to-br ${s.color} p-6 rounded-3xl shadow-xl`}>
                            <div className="text-5xl font-black text-white mb-2">{s.val}</div>
                            <div className="text-white/80 font-medium text-sm uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                                    {['Timestamp', 'Room', 'Action', 'Reason', 'Confidence', 'User'].map(h => (
                                        <th key={h} className="px-6 py-5 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredLogs.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-20 text-center"><span className="text-6xl block mb-3">📋</span><span className="text-slate-500 dark:text-slate-400 text-lg">No logs found</span></td></tr>
                                ) : filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-6 py-5"><div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm"><span>🕐</span>{formatTimestamp(log.timestamp)}</div></td>
                                        <td className="px-6 py-5"><div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-medium"><span>🚪</span>{log.room}</div></td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${log.action.includes('Lights') ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                                    log.action.includes('AC') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                        log.action.includes('Projector') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                }`}>{log.action}</span>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-sm max-w-xs truncate">{log.reason}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                    <div className={`h-full rounded-full ${getConfidenceColor(log.confidence) === 'high' ? 'bg-green-500' : getConfidenceColor(log.confidence) === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${log.confidence}%` }}></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 min-w-[3rem]">{log.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${log.user === 'System' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>
                                                <span>{log.user === 'System' ? '🤖' : '👤'}</span>{log.user}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                        { emoji: '📊', title: 'Log Retention', desc: '90-day retention. Older logs archived and retrievable via admin portal.' },
                        { emoji: '🔒', title: 'Security & Integrity', desc: 'Cryptographically signed, tamper-proof entries. Modifications flagged for review.' },
                        { emoji: '📥', title: 'Export Formats', desc: 'CSV, JSON, PDF with metadata, filterable by date, room, or action type.' },
                    ].map((info, i) => (
                        <div key={i} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2"><span>{info.emoji}</span>{info.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{info.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
