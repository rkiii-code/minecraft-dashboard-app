import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { AdminMetricsPage } from './pages/AdminMetricsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { PlayersPage } from './pages/PlayersPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PlaytimeOverviewPage } from './pages/PlaytimeOverviewPage';
import { MetricHistoryPage } from './pages/MetricHistoryPage';
import { MetricsOverviewPage } from './pages/MetricsOverviewPage';
function Shell() {
    return (_jsx(AppLayout, { children: _jsx(Outlet, {}) }));
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsxs(Route, { element: _jsx(Shell, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/players", element: _jsx(PlayersPage, {}) }), _jsx(Route, { path: "/players/:id", element: _jsx(PlayerDetailPage, {}) }), _jsx(Route, { path: "/admin/metrics", element: _jsx(AdminMetricsPage, {}) }), _jsx(Route, { path: "/metrics", element: _jsx(MetricsOverviewPage, {}) }), _jsx(Route, { path: "/metrics/playtime", element: _jsx(PlaytimeOverviewPage, {}) }), _jsx(Route, { path: "/metrics/:id/history", element: _jsx(MetricHistoryPage, {}) }), _jsx(Route, { path: "/metrics/play_time/history", element: _jsx(MetricHistoryPage, { objectiveName: "play_time" }) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/users/:id", element: _jsx(UserProfilePage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }));
}
