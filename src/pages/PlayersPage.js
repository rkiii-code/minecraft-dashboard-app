import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { getMetrics, getPlayers } from '../lib/api';
function formatDateTime(value) {
    if (!value)
        return '--';
    return new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
export function PlayersPage() {
    var _a;
    var players = useAsync(getPlayers, []).data;
    var metrics = useAsync(getMetrics, []).data;
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { children: [_jsx("h1", { className: "page-title", children: "\u30D7\u30EC\u30A4\u30E4\u30FC\u4E00\u89A7" }), _jsx("p", { className: "page-subtitle", children: "\u30AA\u30F3\u30E9\u30A4\u30F3\u72B6\u6CC1\u3068\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3002\u30AB\u30FC\u30C9\u3092\u62BC\u3059\u3068\u8A73\u7D30\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u3078\u79FB\u52D5\u3057\u307E\u3059\u3002" })] }), _jsx(Card, { title: "\u4E00\u89A7", subtitle: "\u6709\u52B9\u30E1\u30C8\u30EA\u30AF\u30B9: ".concat((_a = metrics === null || metrics === void 0 ? void 0 : metrics.filter(function (m) { return m.isEnabled; }).length) !== null && _a !== void 0 ? _a : 0, " \u4EF6"), children: _jsxs("div", { className: "card-grid", children: [(players || []).map(function (player) { return (_jsxs(Link, { to: "/players/".concat(player.id), className: "glass-card", style: { display: 'grid', gap: 8, padding: 14 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx(Avatar, { name: player.name }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 800 }, children: player.name }), _jsx("div", { className: "hint", children: player.uuid })] }), _jsx(StatusBadge, { online: player.online })] }), _jsxs("div", { className: "grid", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }, children: [_jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "\u6700\u7D42\u30ED\u30B0\u30A4\u30F3" }), _jsx("div", { style: { fontWeight: 700 }, children: formatDateTime(player.lastSeenAt) })] }), _jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "\u521D\u56DE\u30ED\u30B0\u30A4\u30F3" }), _jsx("div", { style: { fontWeight: 700 }, children: formatDateTime(player.firstSeenAt) })] })] })] }, player.id)); }), (players || []).length === 0 && _jsx("div", { className: "muted", children: "\u307E\u3060\u30D7\u30EC\u30A4\u30E4\u30FC\u304C\u3044\u307E\u305B\u3093" })] }) })] }));
}
