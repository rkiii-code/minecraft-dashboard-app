import React from 'react';
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
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Shell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />
        <Route path="/admin/metrics" element={<AdminMetricsPage />} />
        <Route path="/metrics" element={<MetricsOverviewPage />} />
        <Route path="/metrics/playtime" element={<PlaytimeOverviewPage />} />
        <Route path="/metrics/:id/history" element={<MetricHistoryPage />} />
        <Route path="/metrics/play_time/history" element={<MetricHistoryPage objectiveName="play_time" />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
