import { useState } from 'react';
import { rules as initialRules } from '../data/mockData';

export default function RuleConfiguration() {
    const [rules, setRules] = useState(initialRules);
    const [saved, setSaved] = useState(false);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
    const updateRule = (key, value) => setRules(prev => ({ ...prev, [key]: value }));
    const updateAppliance = (appliance, value) => setRules(prev => ({ ...prev, appliances: { ...prev.appliances, [appliance]: parseFloat(value) } }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Rule Configuration</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Configure system behavior and thresholds</p>
                    </div>
                    {saved && (
                        <div className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                            <span className="text-2xl">✓</span><span className="font-bold text-lg">Settings saved!</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Empty Room Detection */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl">⏱️</div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Empty Room Detection</h2>
                        </div>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">Empty Room Threshold (minutes)</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-3">Time before room is considered empty</span>
                            <input type="number" value={rules.emptyRoomThreshold} onChange={(e) => updateRule('emptyRoomThreshold', parseInt(e.target.value))} min="5" max="120"
                                className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 font-bold text-2xl text-center" />
                        </label>
                    </div>

                    {/* Automation */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl">⚙️</div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Automation Settings</h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Auto Power-Off', desc: 'Automatically turn off appliances in empty rooms', checked: rules.autoPowerOff, key: 'autoPowerOff', onColor: 'peer-checked:from-green-500 peer-checked:to-emerald-500' },
                                { label: 'Alert Only Mode', desc: 'Send alerts instead of automatic actions', checked: rules.alertOnly, key: 'alertOnly', onColor: 'peer-checked:from-amber-500 peer-checked:to-orange-500' },
                            ].map((toggle, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{toggle.label}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">{toggle.desc}</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={toggle.checked} onChange={(e) => updateRule(toggle.key, e.target.checked)} className="sr-only peer" />
                                        <div className={`w-16 h-8 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r ${toggle.onColor}`}></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Appliance Wattage */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-4xl">💡</div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Appliance Wattage Values</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Power consumption for energy calculations (kWh)</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '💡', label: 'Lights', key: 'lights' },
                            { icon: '📽️', label: 'Projector', key: 'projector' },
                            { icon: '💻', label: 'Desktop', key: 'desktop' },
                            { icon: '❄️', label: 'AC', key: 'ac' },
                        ].map(({ icon, label, key }) => (
                            <label key={key} className="block">
                                <div className="text-3xl mb-3">{icon}</div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">{label}</span>
                                <div className="relative">
                                    <input type="number" step="0.01" value={rules.appliances[key]} onChange={(e) => updateAppliance(key, e.target.value)}
                                        className="w-full px-4 py-4 pr-16 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 font-bold text-xl" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">kWh</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl">🕐</div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Operating Hours</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[{ label: 'Start Time', key: 'start' }, { label: 'End Time', key: 'end' }].map(({ label, key }) => (
                            <label key={key} className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 block">{label}</span>
                                <input type="time" value={rules.operatingHours[key]}
                                    onChange={(e) => setRules(prev => ({ ...prev, operatingHours: { ...prev.operatingHours, [key]: e.target.value } }))}
                                    className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 font-bold text-2xl" />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mb-8">
                    <button className="flex-1 px-8 py-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg rounded-2xl">Reset to Defaults</button>
                    <button onClick={handleSave} className="flex-1 px-8 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3">
                        <span className="text-2xl">💾</span><span>Save Configuration</span>
                    </button>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 border-2 border-blue-200 dark:border-blue-900">
                    <div className="flex gap-6">
                        <div className="text-5xl">ℹ️</div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Configuration Tips</h4>
                            <ul className="space-y-3">
                                {['Set threshold between 15-30 minutes for optimal detection', 'Enable Alert Only during initial testing', 'Update wattage values based on actual measurements', 'Operating hours optimize monitoring during active periods'].map((tip, i) => (
                                    <li key={i} className="flex items-start gap-3"><span className="text-blue-600 dark:text-blue-400 font-black mt-1">•</span><span className="text-lg text-slate-700 dark:text-slate-300">{tip}</span></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
