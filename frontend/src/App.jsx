import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CCTVBackground from './components/CCTVBackground';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Analytics from './pages/Analytics';
import Devices from './pages/Devices';
import Settings from './pages/Settings';
import CampusOverview from './pages/CampusOverview';
import RoomDetail from './pages/RoomDetail';
import HeatmapView from './pages/HeatmapView';
import GhostView from './pages/GhostView';
import ManualControl from './pages/ManualControl';
import EnergyAnalytics from './pages/EnergyAnalytics';
import EnergyAlerts from './pages/EnergyAlerts';
import ComputerLabIntelligence from './pages/ComputerLabIntelligence';
import AuditLogs from './pages/AuditLogs';
import RuleConfiguration from './pages/RuleConfiguration';
import PrivacyCompliance from './pages/PrivacyCompliance';

export default function App() {
    return (
        <div className="flex h-screen overflow-hidden bg-[var(--ww-bg)] cctv-bg">
            <CCTVBackground />

            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-5 relative z-10">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/devices" element={<Devices />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/campus" element={<CampusOverview />} />
                        <Route path="/room/:roomId" element={<RoomDetail />} />
                        <Route path="/heatmap" element={<HeatmapView />} />
                        <Route path="/ghost-view" element={<GhostView />} />
                        <Route path="/manual-control" element={<ManualControl />} />
                        <Route path="/energy-analytics" element={<EnergyAnalytics />} />
                        <Route path="/energy-alerts" element={<EnergyAlerts />} />
                        <Route path="/computer-labs" element={<ComputerLabIntelligence />} />
                        <Route path="/audit-logs" element={<AuditLogs />} />
                        <Route path="/rules" element={<RuleConfiguration />} />
                        <Route path="/privacy" element={<PrivacyCompliance />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

