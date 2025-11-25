import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {
  mockMetrics,
  mockPlayers,
  mockPlaytimeDaily,
  mockProfileMe,
  mockProfiles,
  mockScores,
  mockServerStatus,
} from './src/data/mock';

const buildRangeSamples = (samples: { date: string; minutes: number }[], days: number) => {
  if (!samples || samples.length === 0) return [];
  const last = new Date(samples[samples.length - 1].date);
  const result: { date: string; minutes: number }[] = [];
  for (let i = 0; i < days; i += 1) {
    const date = new Date(last);
    date.setDate(last.getDate() - (days - 1 - i));
    const base = samples[i % samples.length];
    result.push({ date: date.toISOString().slice(0, 10), minutes: base.minutes });
  }
  return result;
};

const buildHistorySeries = (baseValue: number, days: number, varianceSeed: number) => {
  const last = new Date();
  const samples: { date: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(last);
    date.setDate(last.getDate() - i);
    const wiggle = Math.round(((Math.sin((i + varianceSeed) / 5) + 1) / 2) * 0.2 * baseValue);
    const trend = Math.round((days - i) * (varianceSeed % 5));
    const value = Math.max(0, baseValue - wiggle + trend);
    samples.push({ date: date.toISOString().slice(0, 10), value });
  }
  return samples;
};

const mockApiPlugin = () => ({
  name: 'mock-api',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (!req.url?.startsWith('/api')) return next();

      const url = new URL(req.url, 'http://localhost');
      const path = url.pathname.replace(/^\/api/, '') || '/';

      const sendJson = (data: unknown, status = 200) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
      };

      const parseId = (value?: string | null) => {
        const id = Number(value);
        return Number.isFinite(id) ? id : null;
      };

      // Routes
      if (req.method === 'GET' && path === '/server/status') {
        return sendJson(mockServerStatus);
      }

      if (req.method === 'GET' && path === '/metrics') {
        return sendJson(mockMetrics);
      }

      if (req.method === 'GET' && path.startsWith('/metrics/') && path.endsWith('/leaderboard')) {
        const metricKey = path.split('/')[2];
        const metricId = parseId(metricKey);
        const metric = metricId ? mockMetrics.find((m) => m.id === metricId) : mockMetrics.find((m) => m.objectiveName === metricKey);
        if (!metric) return sendJson({ message: 'metric not found' }, 404);
        const rows = mockScores
          .filter((s) => s.metricId === metric.id)
          .sort((a, b) => b.value - a.value)
          .map((score) => ({
            player: mockPlayers.find((p) => p.id === score.playerId),
            value: score.value,
            collectedAt: score.collectedAt,
            metric,
          }))
          .filter((row) => row.player);
        return sendJson(rows);
      }

      if (req.method === 'GET' && path.startsWith('/metrics/') && path.endsWith('/history')) {
        const metricKey = path.split('/')[2];
        const metricId = parseId(metricKey);
        const metric = metricId ? mockMetrics.find((m) => m.id === metricId) : mockMetrics.find((m) => m.objectiveName === metricKey);
        const days = Number(url.searchParams.get('days') || '30');
        if (!metric) return sendJson({ message: 'metric not found' }, 404);
        const rows = mockScores.filter((s) => s.metricId === metric.id);
        const series = rows
          .map((score, idx) => {
            const player = mockPlayers.find((p) => p.id === score.playerId);
            if (!player) return null;
            return { player, samples: buildHistorySeries(score.value, days, idx + score.playerId + metric.id) };
          })
          .filter((row) => row !== null);
        return sendJson(series);
      }

      if (req.method === 'GET' && path === '/players') {
        return sendJson(mockPlayers);
      }

      if (req.method === 'GET' && path.startsWith('/players/') && !path.includes('/scores') && !path.includes('/playtime')) {
        const playerId = parseId(path.split('/')[2]);
        if (!playerId) return sendJson({ message: 'invalid player id' }, 400);
        const player = mockPlayers.find((p) => p.id === playerId);
        if (!player) return sendJson({ message: 'not found' }, 404);
        return sendJson(player);
      }

      if (req.method === 'GET' && path.endsWith('/scores')) {
        const playerId = parseId(path.split('/')[2]);
        if (!playerId) return sendJson({ message: 'invalid player id' }, 400);
        const scores = mockScores.filter((s) => s.playerId === playerId);
        return sendJson(scores);
      }

      if (req.method === 'GET' && path.endsWith('/playtime/daily')) {
        const playerId = parseId(path.split('/')[2]);
        if (!playerId) return sendJson({ message: 'invalid player id' }, 400);
        const days = Number(url.searchParams.get('days') || '14');
        const item = mockPlaytimeDaily.find((p) => p.playerId === playerId);
        if (!item) return sendJson({ message: 'not found' }, 404);
        const samples = buildRangeSamples(item.samples, days);
        return sendJson({ ...item, rangeDays: days, samples });
      }

      if (req.method === 'GET' && path === '/playtime/daily') {
        const days = Number(url.searchParams.get('days') || '14');
        const series = mockPlaytimeDaily
          .map((entry) => {
            const player = mockPlayers.find((p) => p.id === entry.playerId);
            if (!player) return null;
            return { player, samples: buildRangeSamples(entry.samples, days) };
          })
          .filter((row) => row !== null);
        return sendJson(series);
      }

      if (req.method === 'GET' && path === '/profile/me') {
        return sendJson(mockProfileMe);
      }

      if (req.method === 'GET' && path.startsWith('/users/')) {
        const profileId = parseId(path.split('/')[2]);
        if (!profileId) return sendJson({ message: 'invalid user id' }, 400);
        const profile = mockProfiles.find((p) => p.id === profileId);
        if (!profile) return sendJson({ message: 'not found' }, 404);
        return sendJson(profile);
      }

      return sendJson({ message: 'not found' }, 404);
    });
  },
});

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: {
    host: true,
    port: Number(process.env.VITE_PORT) || 5173,
  },
});
