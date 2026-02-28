import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard, DoorOpen, BarChart3, Plug, Settings,
    ChevronLeft, ChevronRight, Map, Eye, Ghost,
    Power, TrendingUp, AlertTriangle, Monitor, FileText,
    Sliders, Shield
} from 'lucide-react';

const sections = [
    {
        title: 'OVERVIEW',
        links: [
            { to: '/',        label: 'Dashboard', icon: LayoutDashboard },
            { to: '/campus',  label: 'Campus',    icon: Map },
            { to: '/heatmap', label: 'Heatmap',   icon: Eye },
        ],
    },
    {
        title: 'MONITOR',
        links: [
            { to: '/rooms',         label: 'Rooms',     icon: DoorOpen },
            { to: '/ghost-view',    label: 'Ghost View', icon: Ghost },
            { to: '/computer-labs', label: 'Labs',      icon: Monitor },
        ],
    },
    {
        title: 'ENERGY',
        links: [
            { to: '/energy-analytics', label: 'Analytics', icon: TrendingUp },
            { to: '/energy-alerts',    label: 'Alerts',    icon: AlertTriangle },
            { to: '/manual-control',   label: 'Control',   icon: Power },
        ],
    },
    {
        title: 'SYSTEM',
        links: [
            { to: '/devices',  label: 'Devices',  icon: Plug },
            { to: '/audit-logs', label: 'Logs',   icon: FileText },
            { to: '/rules',    label: 'Rules',    icon: Sliders },
            { to: '/privacy',  label: 'Privacy',  icon: Shield },
            { to: '/settings', label: 'Settings', icon: Settings },
        ],
    },
];

/** Camera-lens + lightning logo mark */
function LogoMark({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* outer ring */}
            <circle cx="18" cy="18" r="16.5" stroke="#22d3ee" strokeWidth="0.75" strokeOpacity="0.25" />
            {/* mid ring */}
            <circle cx="18" cy="18" r="11"   stroke="#22d3ee" strokeWidth="0.75" strokeOpacity="0.45" />
            {/* iris ring */}
            <circle cx="18" cy="18" r="6.5"  stroke="#22d3ee" strokeWidth="1"    strokeOpacity="0.6"  />
            {/* pupil */}
            <circle cx="18" cy="18" r="2.5"  fill="#22d3ee"   fillOpacity="0.5" />
            {/* lightning bolt */}
            <path d="M19.5 9.5 L14 18.5 H18.2 L16.5 26.5 L22 17.5 H17.8 Z"
                fill="#22d3ee" fillOpacity="0.9" />
        </svg>
    );
}

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useApp();

    return (
        <aside
            className={`
                relative flex flex-col
                bg-black/80 backdrop-blur-2xl
                border-r border-cyan-500/10
                transition-all duration-300 z-20
                ${sidebarOpen ? 'w-60' : 'w-[60px]'}
            `}
        >
            {/* Top-edge glow line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            {/* ── Logo ─────────────────────────────────────────── */}
            <div className={`flex items-center gap-3 px-4 py-4 border-b border-cyan-500/[0.07] min-h-[64px]`}>
                <div className="relative flex-shrink-0">
                    <LogoMark size={36} />
                    {/* Subtle outer pulse */}
                    <span className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-20" />
                </div>
                {sidebarOpen && (
                    <div className="animate-fade-in overflow-hidden">
                        <p className="brand-wordmark text-[13px] text-white leading-none tracking-[0.18em]">
                            WATT·WATCH
                        </p>
                        <p className="text-[8px] font-mono text-cyan-500/40 tracking-[0.3em] uppercase mt-1">
                            Energy Surveillance
                        </p>
                    </div>
                )}
            </div>

            {/* ── Navigation ───────────────────────────────────── */}
            <nav className="flex-1 px-2 py-3 space-y-3 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title}>
                        {sidebarOpen && (
                            <p className="px-3 mb-1.5 text-[8px] font-mono font-bold text-cyan-900/80 tracking-[0.28em] uppercase">
                                {section.title}
                            </p>
                        )}
                        {!sidebarOpen && <div className="hud-divider my-2 mx-2" />}
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
                                    <Icon size={15} strokeWidth={1.5} />
                                    {sidebarOpen && (
                                        <span className="animate-fade-in text-[11px] font-medium tracking-wide">
                                            {label}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ── Toggle button ────────────────────────────────── */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-black border border-cyan-500/20 flex items-center justify-center text-slate-600 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 z-10 shadow-lg"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
            </button>

            {/* ── Footer status ────────────────────────────────── */}
            <div className="px-4 py-3 border-t border-cyan-500/[0.07]">
                <div className="flex items-center gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" />
                    {sidebarOpen && (
                        <p className="text-[8px] font-mono text-cyan-500/50 tracking-[0.22em] uppercase">
                            SYSTEM ONLINE
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}

