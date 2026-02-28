import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard, DoorOpen, BarChart3, Plug, Settings,
    Zap, ChevronLeft, ChevronRight
} from 'lucide-react';

const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rooms', label: 'Rooms', icon: DoorOpen },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/devices', label: 'Devices', icon: Plug },
    { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const { sidebarOpen, toggleSidebar } = useApp();

    return (
        <aside
            className={`
        relative flex flex-col bg-surface-900/80 backdrop-blur-xl
        border-r border-surface-700/40 transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-surface-700/40">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
                    <Zap size={22} className="text-white" />
                </div>
                {sidebarOpen && (
                    <div className="animate-fade-in">
                        <h1 className="text-lg font-bold text-white leading-tight">Watt-Watch</h1>
                        <p className="text-[10px] text-surface-400 uppercase tracking-widest">Energy Auditor</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'nav-link-active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
                        }
                    >
                        <Icon size={20} />
                        {sidebarOpen && <span className="animate-fade-in">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse toggle */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-800 border border-surface-600 flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition-all duration-200 z-10"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* Footer */}
            {sidebarOpen && (
                <div className="px-5 py-4 border-t border-surface-700/40">
                    <p className="text-[10px] text-surface-500 text-center">
                        v1.0.0 · Privacy-First
                    </p>
                </div>
            )}
        </aside>
    );
}
