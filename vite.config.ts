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

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.VITE_PORT) || 5173,
    /**
     * 開発時のみ Vite dev server 上で /api/* のスタブを返す。
     * フロントからは VITE_API_BASE_URL=/api を指すだけでモック API を叩ける。
     */
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
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
          const metricId = parseId(path.split('/')[2]);
          if (!metricId) return sendJson({ message: 'invalid metric id' }, 400);
          const metric = mockMetrics.find((m) => m.id === metricId);
          if (!metric) return sendJson({ message: 'metric not found' }, 404);
          const rows = mockScores
            .filter((s) => s.metricId === metricId)
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
          return sendJson({ ...item, rangeDays: days, samples: item.samples.slice(-days) });
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
  },
});
