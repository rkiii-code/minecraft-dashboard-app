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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
import { mockMetrics, mockPlayers, mockPlaytimeDaily, mockProfileMe, mockProfiles, mockScores, mockServerStatus } from '../data/mock';
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
var USE_MOCK = ((_a = import.meta.env.VITE_USE_MOCK) !== null && _a !== void 0 ? _a : 'true') !== 'false';
function fetchJson(path) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(API_BASE_URL).concat(path))];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        throw new Error("API error: ".concat(res.status));
                    }
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
function delay(value, ms) {
    if (ms === void 0) { ms = 150; }
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(value); }, ms); });
}
function buildRangeSamples(samples, days) {
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
}
function buildHistorySeries(baseValue, days, varianceSeed) {
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
}
export function getServerStatus() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockServerStatus)];
            return [2 /*return*/, fetchJson('/server/status')];
        });
    });
}
export function getPlayers() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockPlayers)];
            return [2 /*return*/, fetchJson('/players')];
        });
    });
}
export function getPlayer(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockPlayers.find(function (p) { return p.id === id; }))];
            return [2 /*return*/, fetchJson("/players/".concat(id))];
        });
    });
}
export function getPlayerScores(playerId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockScores.filter(function (s) { return s.playerId === playerId; }))];
            return [2 /*return*/, fetchJson("/players/".concat(playerId, "/scores"))];
        });
    });
}
export function getPlayerPlaytimeDaily(playerId_1) {
    return __awaiter(this, arguments, void 0, function (playerId, days) {
        var item, samples;
        if (days === void 0) { days = 14; }
        return __generator(this, function (_a) {
            if (USE_MOCK) {
                item = mockPlaytimeDaily.find(function (p) { return p.playerId === playerId; });
                if (!item)
                    return [2 /*return*/, delay(null)];
                samples = buildRangeSamples(item.samples, days);
                return [2 /*return*/, delay(__assign(__assign({}, item), { rangeDays: days, samples: samples }))];
            }
            return [2 /*return*/, fetchJson("/players/".concat(playerId, "/playtime/daily?days=").concat(days))];
        });
    });
}
export function getPlaytimeDailyAll() {
    return __awaiter(this, arguments, void 0, function (days) {
        var series;
        if (days === void 0) { days = 14; }
        return __generator(this, function (_a) {
            if (USE_MOCK) {
                series = mockPlaytimeDaily
                    .map(function (entry) {
                    var player = mockPlayers.find(function (p) { return p.id === entry.playerId; });
                    if (!player)
                        return null;
                    return {
                        player: player,
                        samples: buildRangeSamples(entry.samples, days),
                    };
                })
                    .filter(function (v) { return Boolean(v); });
                return [2 /*return*/, delay(series)];
            }
            return [2 /*return*/, fetchJson("/playtime/daily?days=".concat(days))];
        });
    });
}
export function getMetricHistory(metricId_1) {
    return __awaiter(this, arguments, void 0, function (metricId, days) {
        var rows;
        if (days === void 0) { days = 30; }
        return __generator(this, function (_a) {
            if (!USE_MOCK) {
                return [2 /*return*/, fetchJson("/metrics/".concat(metricId, "/history?days=").concat(days))];
            }
            rows = mockScores.filter(function (s) { return s.metricId === metricId; });
            return [2 /*return*/, delay(rows
                    .map(function (score, idx) {
                    var player = mockPlayers.find(function (p) { return p.id === score.playerId; });
                    if (!player)
                        return null;
                    var samples = buildHistorySeries(score.value, days, idx + score.playerId + metricId);
                    return { player: player, samples: samples };
                })
                    .filter(function (v) { return Boolean(v); }))];
        });
    });
}
export function getMetrics() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockMetrics)];
            return [2 /*return*/, fetchJson('/metrics')];
        });
    });
}
export function getProfileMe() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockProfileMe)];
            return [2 /*return*/, fetchJson('/profile/me')];
        });
    });
}
export function getUserProfile(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (USE_MOCK)
                return [2 /*return*/, delay(mockProfiles.find(function (p) { return p.id === id; }))];
            return [2 /*return*/, fetchJson("/users/".concat(id, "/profile"))];
        });
    });
}
export function getLeaderboard(metricId) {
    return __awaiter(this, void 0, void 0, function () {
        var metric;
        return __generator(this, function (_a) {
            if (!USE_MOCK) {
                return [2 /*return*/, fetchJson("/metrics/".concat(metricId, "/leaderboard"))];
            }
            metric = mockMetrics.find(function (m) { return m.id === metricId; });
            if (!metric)
                return [2 /*return*/, []];
            return [2 /*return*/, delay(mockScores
                    .filter(function (s) { return s.metricId === metricId; })
                    .sort(function (a, b) { return b.value - a.value; })
                    .map(function (score) { return ({
                    player: mockPlayers.find(function (p) { return p.id === score.playerId; }),
                    value: score.value,
                    collectedAt: score.collectedAt,
                    metric: metric,
                }); }), 80)];
        });
    });
}
