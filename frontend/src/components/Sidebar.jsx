import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard,
    DoorOpen,
    Plug,
    Settings,
    ChevronLeft,
    ChevronRight,
    Map,
    Eye,
    Ghost,
    Power,
    TrendingUp,
    AlertTriangle,
    Monitor,
    FileText,
    Sliders,
    Shield,
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

function LogoMark({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16.5" stroke="var(--ww-accent)" strokeWidth="0.75" strokeOpacity="0.35" />
            <circle cx="18" cy="18" r="11" stroke="var(--ww-accent)" strokeWidth="0.75" strokeOpacity="0.55" />
            <circle cx="18" cy="18" r="6.5" stroke="var(--ww-accent)" strokeWidth="1" strokeOpacity="0.7" />
            <circle cx="18" cy="18" r="2.5" fill="var(--ww-accent)" fillOpacity="0.6" />
            <path d="M19.5 9.5 L14 18.5 H18.2 L16.5 26.5 L22 17.5 H17.8 Z" fill="var(--ww-accent)" fillOpacity="0.92" />
        </svg>
    );
}

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useApp();

    return (
        <aside
            className={`
                relative flex flex-col bg-[var(--ww-sidebar)] backdrop-blur-2xl
                border-r border-[var(--ww-border)] transition-all duration-300 z-20
                ${sidebarOpen ? 'w-64' : 'w-[68px]'}
            `}
        >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--ww-accent-glow)] to-transparent" />

            <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--ww-border)] min-h-[68px]">
                <div className="relative flex-shrink-0">
                    <LogoMark size={36} />
                    <span className="absolute inset-0 rounded-full border border-[var(--ww-border-strong)] animate-ping opacity-20" />
                </div>
                {sidebarOpen && (
                    <div className="animate-fade-in overflow-hidden">
                        <p className="brand-wordmark text-[14px] text-[var(--ww-text-1)] leading-none tracking-[0.16em]">
                            WATT-WATCH
                        </p>
                        <p className="text-[9px] font-mono text-[var(--ww-text-3)] tracking-[0.2em] uppercase mt-1">
                            Energy Surveillance
                        </p>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-2 py-3 space-y-3 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title}>
                        {sidebarOpen && (
                            <p className="px-3 mb-1.5 text-[9px] font-mono font-bold text-[var(--ww-text-muted)] tracking-[0.2em] uppercase">
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
                                    <Icon size={16} strokeWidth={1.6} />
                                    {sidebarOpen && (
                                        <span className="animate-fade-in text-[12px] font-medium tracking-wide">
                                            {label}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-[76px] w-6 h-6 rounded-full bg-[var(--ww-sidebar)] border border-[var(--ww-border)] flex items-center justify-center text-[var(--ww-text-3)] hover:text-[var(--ww-accent)] hover:border-[var(--ww-border-strong)] transition-all duration-200 z-10 shadow-lg"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
            </button>

            <div className="px-4 py-3 border-t border-[var(--ww-border)]">
                <div className="flex items-center gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--ww-accent)] shadow-[0_0_8px_var(--ww-accent-glow)] animate-pulse" />
                    {sidebarOpen && (
                        <p className="text-[9px] font-mono text-[var(--ww-text-3)] tracking-[0.18em] uppercase">
                            SYSTEM ONLINE
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}
