import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard, DoorOpen, BarChart3, Plug, Settings,
    Zap, ChevronLeft, ChevronRight, Map, Eye, Ghost,
    Power, TrendingUp, AlertTriangle, Monitor, FileText,
    Sliders, Shield
} from 'lucide-react';

const sections = [
    {
        title: 'OVERVIEW',
        links: [
            { to: '/', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/campus', label: 'Campus', icon: Map },
            { to: '/heatmap', label: 'Heatmap', icon: Eye },
        ],
    },
    {
        title: 'MONITOR',
        links: [
            { to: '/rooms', label: 'Rooms', icon: DoorOpen },
            { to: '/ghost-view', label: 'Ghost View', icon: Ghost },
            { to: '/computer-labs', label: 'Labs', icon: Monitor },
        ],
    },
    {
        title: 'ENERGY',
        links: [
            { to: '/energy-analytics', label: 'Analytics', icon: TrendingUp },
            { to: '/energy-alerts', label: 'Alerts', icon: AlertTriangle },
            { to: '/manual-control', label: 'Control', icon: Power },
        ],
    },
    {
        title: 'SYSTEM',
        links: [
            { to: '/devices', label: 'Devices', icon: Plug },
            { to: '/audit-logs', label: 'Logs', icon: FileText },
            { to: '/rules', label: 'Rules', icon: Sliders },
            { to: '/privacy', label: 'Privacy', icon: Shield },
            { to: '/settings', label: 'Settings', icon: Settings },
        ],
    },
];

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useApp();

    return (
        <aside
            className={`
                relative flex flex-col bg-[#060a10]/90 backdrop-blur-xl
                border-r border-white/[0.04] transition-all duration-300 z-20
                ${sidebarOpen ? 'w-56' : 'w-16'}
            `}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[0.04]">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Zap size={16} className="text-cyan-400" />
                </div>
                {sidebarOpen && (
                    <div className="animate-fade-in">
                        <h1 className="text-sm font-semibold text-white tracking-wide">WATT-WATCH</h1>
                        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.15em]">surveillance</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 space-y-3 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title}>
                        {sidebarOpen && (
                            <p className="px-3 mb-1.5 text-[9px] font-mono font-bold text-slate-600 tracking-[0.2em]">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.links.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={to === '/'}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
                                    }
                                    title={!sidebarOpen ? label : undefined}
                                >
                                    <Icon size={16} strokeWidth={1.5} />
                                    {sidebarOpen && <span className="animate-fade-in text-xs font-medium">{label}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Toggle */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-16 w-5 h-5 rounded-full bg-[#0a1018] border border-cyan-500/20 flex items-center justify-center text-slate-600 hover:text-cyan-400 transition-all duration-200 z-10"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
            </button>

            {/* Footer */}
            {sidebarOpen && (
                <div className="px-4 py-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <p className="text-[9px] font-mono text-slate-600 tracking-wider">
                            SYSTEM ONLINE
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
