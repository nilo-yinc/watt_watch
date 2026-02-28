import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Analytics from './pages/Analytics';
import Devices from './pages/Devices';
import Settings from './pages/Settings';

export default function App() {
    return (
        <div className="flex h-screen overflow-hidden bg-surface-950">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/devices" element={<Devices />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
