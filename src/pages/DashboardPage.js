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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Avatar } from '../components/Avatar';
import { LogoMark } from '../components/LogoMark';
import { useAsync } from '../hooks/useAsync';
import { getLeaderboard, getMetrics, getPlayers, getServerStatus } from '../lib/api';
function formatDateTime(value) {
    if (!value)
        return '?';
    return new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}
export function DashboardPage() {
    var _this = this;
    var status = useAsync(getServerStatus, []).data;
    var players = useAsync(getPlayers, []).data;
    var metrics = useAsync(getMetrics, []).data;
    var _a = useState({}), leaders = _a[0], setLeaders = _a[1];
    useEffect(function () {
        if (!metrics || metrics.length === 0)
            return;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var entries, mapped;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(metrics
                            .filter(function (m) { return m.isEnabled; })
                            .slice(0, 3)
                            .map(function (metric) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = [metric.id];
                                    return [4 /*yield*/, getLeaderboard(metric.id)];
                                case 1: return [2 /*return*/, _a.concat([_b.sent()])];
                            }
                        }); }); }))];
                    case 1:
                        entries = _a.sent();
                        mapped = {};
                        entries.forEach(function (_a) {
                            var metricId = _a[0], rows = _a[1];
                            mapped[metricId] = rows;
                        });
                        setLeaders(mapped);
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [metrics]);
    var onlinePlayers = useMemo(function () { return (players || []).filter(function (p) { return p.online; }).sort(function (a, b) { return a.name.localeCompare(b.name); }); }, [players]);
    var offlinePlayers = useMemo(function () { return (players || []).filter(function (p) { return !p.online; }).sort(function (a, b) { return a.name.localeCompare(b.name); }); }, [players]);
    return (_jsxs("div", { className: "grid", style: { gap: 18 }, children: [_jsxs("section", { className: "hero", children: [_jsxs("div", { children: [_jsxs("p", { className: "pill ".concat((status === null || status === void 0 ? void 0 : status.online) ? 'status-online' : 'status-offline'), style: { width: 'fit-content', marginBottom: 10 }, children: [_jsx("span", { className: "badge-dot", style: { background: (status === null || status === void 0 ? void 0 : status.online) ? '#12a150' : '#6b7280' } }), (status === null || status === void 0 ? void 0 : status.online) ? 'オンライン' : 'オフライン'] }), _jsx("h1", { className: "page-title", children: "\u30B5\u30FC\u30D0\u30FC\u306E\u3088\u3046\u3059" }), _jsx("p", { className: "page-subtitle", children: "RCON \u304B\u3089 scoreboard \u3092\u53D6\u5F97\u3057\u3001Cloudflare Pages \u3067\u53EF\u8996\u5316\u3002\u8EFD\u91CF\u306A\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u3067\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u6D3B\u52D5\u3092\u30C1\u30A7\u30C3\u30AF\u3067\u304D\u307E\u3059\u3002" }), _jsxs("ul", { className: "inline-list", style: { marginTop: 14 }, children: [_jsx("li", { className: "chip", children: "\u30DD\u30FC\u30EA\u30F3\u30B0 30 \u79D2" }), _jsx("li", { className: "chip", children: "JWT \u30ED\u30B0\u30A4\u30F3 (admin / user)" }), _jsx("li", { className: "chip", children: "\u30D7\u30EC\u30A4\u30E4\u30FC\u30FB\u30E1\u30C8\u30EA\u30AF\u30B9\u53EF\u8996\u5316" })] })] }), _jsxs("div", { className: "hero-illustration", children: [_jsx(LogoMark, { size: 80 }), _jsx("div", { className: "hint", style: { marginTop: 10 }, children: "Cloudflare Pages \u2192 /api \u2192 Go API \u2192 RCON" })] })] }), _jsxs("div", { className: "card-grid", children: [_jsx(Card, { title: "\u30B5\u30FC\u30D0\u30FC\u30B9\u30C6\u30FC\u30BF\u30B9", subtitle: status ? "\u6700\u7D42\u66F4\u65B0: ".concat(formatDateTime(status.lastCheckedAt)) : undefined, children: status ? (_jsxs("div", { className: "grid", style: { gap: 10 }, children: [_jsxs("div", { className: "grid", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }, children: [_jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "MOTD" }), _jsx("div", { style: { fontWeight: 700 }, children: status.motd })] }), _jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "\u30D0\u30FC\u30B8\u30E7\u30F3" }), _jsx("div", { style: { fontWeight: 700 }, children: status.version })] }), _jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "\u30D7\u30EC\u30A4\u30E4\u30FC\u6570" }), _jsxs("div", { style: { fontWeight: 800 }, children: [status.playersOnline, " / ", status.maxPlayers] })] })] }), _jsx("div", { className: "meter", "aria-hidden": "true", children: _jsx("div", { className: "meter-fill", style: { width: "".concat(Math.min(100, (status.playersOnline / status.maxPlayers) * 100), "%") } }) })] })) : (_jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." })) }), _jsx(Card, { title: "\u30AA\u30F3\u30E9\u30A4\u30F3\u30D7\u30EC\u30A4\u30E4\u30FC", subtitle: "\u73FE\u5728\u30AA\u30F3\u30E9\u30A4\u30F3\u306E\u30E1\u30F3\u30D0\u30FC", children: _jsxs("div", { className: "grid", style: { gap: 10 }, children: [onlinePlayers.map(function (player) { return (_jsxs("div", { className: "glass-card", style: { display: 'flex', alignItems: 'center', gap: 12, padding: 12 }, children: [_jsx(Avatar, { name: player.name }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 700 }, children: player.name }), _jsx("div", { className: "hint", children: player.uuid })] }), _jsx(StatusBadge, { online: true, label: "\u30AA\u30F3\u30E9\u30A4\u30F3" })] }, player.id)); }), onlinePlayers.length === 0 && _jsx("div", { className: "muted", children: "\u30AA\u30F3\u30E9\u30A4\u30F3\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u306F\u3044\u307E\u305B\u3093" }), offlinePlayers.length > 0 && (_jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", style: { marginBottom: 6 }, children: "\u30AA\u30D5\u30E9\u30A4\u30F3" }), _jsx("div", { className: "inline-list", children: offlinePlayers.map(function (player) { return (_jsx("span", { className: "pill", children: player.name }, player.id)); }) })] }))] }) }), _jsx(Card, { title: "\u30E1\u30C8\u30EA\u30AF\u30B9\u30E9\u30F3\u30AD\u30F3\u30B0", subtitle: "scoreboard \u306E\u4E0A\u4F4D\u30D7\u30EC\u30A4\u30E4\u30FC\uFF08\u30AB\u30FC\u30C9\u3092\u62BC\u3059\u3068\u5C65\u6B74\u3078\uFF09", children: metrics ? (_jsx("div", { className: "grid", style: { gap: 12 }, children: metrics
                                .filter(function (m) { return m.isEnabled; })
                                .slice(0, 3)
                                .map(function (metric) {
                                var content = (_jsxs(_Fragment, { children: [_jsxs("div", { className: "card-header", style: { marginBottom: 6 }, children: [_jsxs("div", { children: [_jsx("div", { className: "label", style: { marginBottom: 2 }, children: metric.displayName }), _jsx("div", { className: "hint", children: metric.description })] }), _jsxs("span", { className: "pill", children: ["\u5358\u4F4D: ", metric.unit] })] }), _jsxs("div", { className: "grid", style: { gap: 8 }, children: [(leaders[metric.id] || []).map(function (row) { return (_jsx("div", { className: "surface-muted", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx(Avatar, { name: row.player.name, size: 42 }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 700 }, children: row.player.name }), _jsxs("div", { className: "hint", children: ["\u66F4\u65B0: ", formatDateTime(row.collectedAt)] })] }), _jsxs("div", { style: { fontWeight: 800 }, children: [row.value.toLocaleString(), " ", metric.unit] })] }) }, "".concat(metric.id, "-").concat(row.player.id))); }), (leaders[metric.id] || []).length === 0 && _jsx("div", { className: "muted", children: "\u30C7\u30FC\u30BF\u306A\u3057" })] })] }));
                                return (_jsxs(Link, { to: "/metrics/".concat(metric.objectiveName, "/history"), className: "glass-card", style: { padding: 12, textDecoration: 'none' }, children: [_jsx("div", { className: "muted", style: { fontSize: 12, marginBottom: 4 }, children: "\u30AF\u30EA\u30C3\u30AF\u3067\u65E5\u6B21\u63A8\u79FB\u3092\u898B\u308B" }), content] }, metric.id));
                            }) })) : (_jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." })) })] })] }));
}
