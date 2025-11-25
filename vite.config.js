var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockMetrics, mockPlayers, mockPlaytimeDaily, mockProfileMe, mockProfiles, mockScores, mockServerStatus, } from './src/data/mock';
var buildRangeSamples = function (samples, days) {
    if (!samples || samples.length === 0)
        return [];
    var last = new Date(samples[samples.length - 1].date);
    var result = [];
    for (var i = 0; i < days; i += 1) {
        var date = new Date(last);
        date.setDate(last.getDate() - (days - 1 - i));
        var base = samples[i % samples.length];
        result.push({ date: date.toISOString().slice(0, 10), minutes: base.minutes });
    }
    return result;
};
var buildHistorySeries = function (baseValue, days, varianceSeed) {
    var last = new Date();
    var samples = [];
    for (var i = days - 1; i >= 0; i -= 1) {
        var date = new Date(last);
        date.setDate(last.getDate() - i);
        var wiggle = Math.round(((Math.sin((i + varianceSeed) / 5) + 1) / 2) * 0.2 * baseValue);
        var trend = Math.round((days - i) * (varianceSeed % 5));
        var value = Math.max(0, baseValue - wiggle + trend);
        samples.push({ date: date.toISOString().slice(0, 10), value: value });
    }
    return samples;
};
var mockApiPlugin = function () { return ({
    name: 'mock-api',
    configureServer: function (server) {
        server.middlewares.use(function (req, res, next) {
            var _a;
            if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api')))
                return next();
            var url = new URL(req.url, 'http://localhost');
            var path = url.pathname.replace(/^\/api/, '') || '/';
            var sendJson = function (data, status) {
                if (status === void 0) { status = 200; }
                res.statusCode = status;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify(data));
            };
            var parseId = function (value) {
                var id = Number(value);
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
                var metricKey_1 = path.split('/')[2];
                var metricId_1 = parseId(metricKey_1);
                var metric_1 = metricId_1 ? mockMetrics.find(function (m) { return m.id === metricId_1; }) : mockMetrics.find(function (m) { return m.objectiveName === metricKey_1; });
                if (!metric_1)
                    return sendJson({ message: 'metric not found' }, 404);
                var rows = mockScores
                    .filter(function (s) { return s.metricId === metric_1.id; })
                    .sort(function (a, b) { return b.value - a.value; })
                    .map(function (score) { return ({
                    player: mockPlayers.find(function (p) { return p.id === score.playerId; }),
                    value: score.value,
                    collectedAt: score.collectedAt,
                    metric: metric_1,
                }); })
                    .filter(function (row) { return row.player; });
                return sendJson(rows);
            }
            if (req.method === 'GET' && path.startsWith('/metrics/') && path.endsWith('/history')) {
                var metricKey_2 = path.split('/')[2];
                var metricId_2 = parseId(metricKey_2);
                var metric_2 = metricId_2 ? mockMetrics.find(function (m) { return m.id === metricId_2; }) : mockMetrics.find(function (m) { return m.objectiveName === metricKey_2; });
                var days_1 = Number(url.searchParams.get('days') || '30');
                if (!metric_2)
                    return sendJson({ message: 'metric not found' }, 404);
                var rows = mockScores.filter(function (s) { return s.metricId === metric_2.id; });
                var series = rows
                    .map(function (score, idx) {
                    var player = mockPlayers.find(function (p) { return p.id === score.playerId; });
                    if (!player)
                        return null;
                    return { player: player, samples: buildHistorySeries(score.value, days_1, idx + score.playerId + metric_2.id) };
                })
                    .filter(function (row) { return row !== null; });
                return sendJson(series);
            }
            if (req.method === 'GET' && path === '/players') {
                return sendJson(mockPlayers);
            }
            if (req.method === 'GET' && path.startsWith('/players/') && !path.includes('/scores') && !path.includes('/playtime')) {
                var playerId_1 = parseId(path.split('/')[2]);
                if (!playerId_1)
                    return sendJson({ message: 'invalid player id' }, 400);
                var player = mockPlayers.find(function (p) { return p.id === playerId_1; });
                if (!player)
                    return sendJson({ message: 'not found' }, 404);
                return sendJson(player);
            }
            if (req.method === 'GET' && path.endsWith('/scores')) {
                var playerId_2 = parseId(path.split('/')[2]);
                if (!playerId_2)
                    return sendJson({ message: 'invalid player id' }, 400);
                var scores = mockScores.filter(function (s) { return s.playerId === playerId_2; });
                return sendJson(scores);
            }
            if (req.method === 'GET' && path.endsWith('/playtime/daily')) {
                var playerId_3 = parseId(path.split('/')[2]);
                if (!playerId_3)
                    return sendJson({ message: 'invalid player id' }, 400);
                var days = Number(url.searchParams.get('days') || '14');
                var item = mockPlaytimeDaily.find(function (p) { return p.playerId === playerId_3; });
                if (!item)
                    return sendJson({ message: 'not found' }, 404);
                var samples = buildRangeSamples(item.samples, days);
                return sendJson(__assign(__assign({}, item), { rangeDays: days, samples: samples }));
            }
            if (req.method === 'GET' && path === '/playtime/daily') {
                var days_2 = Number(url.searchParams.get('days') || '14');
                var series = mockPlaytimeDaily
                    .map(function (entry) {
                    var player = mockPlayers.find(function (p) { return p.id === entry.playerId; });
                    if (!player)
                        return null;
                    return { player: player, samples: buildRangeSamples(entry.samples, days_2) };
                })
                    .filter(function (row) { return row !== null; });
                return sendJson(series);
            }
            if (req.method === 'GET' && path === '/profile/me') {
                return sendJson(mockProfileMe);
            }
            if (req.method === 'GET' && path.startsWith('/users/')) {
                var profileId_1 = parseId(path.split('/')[2]);
                if (!profileId_1)
                    return sendJson({ message: 'invalid user id' }, 400);
                var profile = mockProfiles.find(function (p) { return p.id === profileId_1; });
                if (!profile)
                    return sendJson({ message: 'not found' }, 404);
                return sendJson(profile);
            }
            return sendJson({ message: 'not found' }, 404);
        });
    },
}); };
export default defineConfig({
    plugins: [react(), mockApiPlugin()],
    server: {
        host: true,
        port: Number(process.env.VITE_PORT) || 5173,
    },
});
