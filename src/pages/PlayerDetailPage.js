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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { MetricBar } from '../components/MetricBar';
import { PlaytimeChart } from '../components/PlaytimeChart';
import { StatusBadge } from '../components/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { getMetrics, getPlayer, getPlayerPlaytimeDaily, getPlayerScores } from '../lib/api';
function formatDateTime(value) {
    if (!value)
        return '--';
    return new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}
function buildSpark(value) {
    var parts = 9;
    var base = Math.max(2, Math.min(18, Math.round((value / 20) % 18)));
    var items = [];
    for (var i = 0; i < parts; i += 1) {
        var variance = (i % 2 === 0 ? 1 : -1) * (i + 1);
        items.push(Math.max(3, Math.min(32, base + variance)));
    }
    return items;
}
export function PlayerDetailPage() {
    var _a;
    var id = useParams().id;
    var playerId = Number(id);
    var player = useAsync(function () { return getPlayer(playerId); }, [playerId]).data;
    var scores = useAsync(function () { return getPlayerScores(playerId); }, [playerId]).data;
    var metrics = useAsync(getMetrics, []).data;
    var _b = useAsync(function () { return (Number.isFinite(playerId) ? getPlayerPlaytimeDaily(playerId, 14) : Promise.resolve(null)); }, [playerId]), playtime = _b.data, playtimeLoading = _b.loading;
    var scoreCards = useMemo(function () {
        var metricById = {};
        (metrics || []).forEach(function (metric) {
            metricById[metric.id] = metric;
        });
        return (scores || []).map(function (s) { return (__assign(__assign({}, s), { metric: metricById[s.metricId] })); });
    }, [metrics, scores]);
    if (!Number.isFinite(playerId)) {
        return _jsx("div", { className: "muted", children: "\u7121\u52B9\u306A\u30D7\u30EC\u30A4\u30E4\u30FC ID" });
    }
    if (!player) {
        return _jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { className: "card", style: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center' }, children: [_jsx(Avatar, { name: player.name, size: 72 }), _jsxs("div", { children: [_jsx("h1", { className: "page-title", style: { margin: 0 }, children: player.name }), _jsx("p", { className: "page-subtitle", children: player.uuid })] }), _jsx(StatusBadge, { online: player.online })] }), _jsxs("div", { className: "card-grid", children: [_jsx(Card, { title: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB", subtitle: "\u30ED\u30B0\u30A4\u30F3\u5C65\u6B74 / \u57FA\u672C\u60C5\u5831", children: _jsxs("div", { className: "grid", style: { gap: 10 }, children: [_jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "\u6700\u7D42\u30ED\u30B0\u30A4\u30F3" }), _jsx("div", { style: { fontWeight: 700 }, children: formatDateTime(player.lastSeenAt) })] }), _jsxs("div", { className: "surface-muted", children: [_jsx("div", { className: "muted", children: "\u521D\u56DE\u30ED\u30B0\u30A4\u30F3" }), _jsx("div", { style: { fontWeight: 700 }, children: formatDateTime(player.firstSeenAt) })] })] }) }), _jsx(Card, { title: "\u30B9\u30B3\u30A2", subtitle: "scoreboard \u306E\u6700\u65B0\u5024", children: _jsxs("div", { className: "grid", style: { gap: 12 }, children: [scoreCards.map(function (score) {
                                    return score.metric ? (_jsx("div", { className: "glass-card", style: { padding: 12 }, children: _jsx(MetricBar, { label: score.metric.displayName, value: score.value, unit: score.metric.unit, percent: Math.min(100, (score.value / 1500) * 100), caption: "\u66F4\u65B0: ".concat(formatDateTime(score.collectedAt)) }) }, "".concat(score.metricId, "-").concat(score.playerId))) : null;
                                }), scoreCards.length === 0 && _jsx("div", { className: "muted", children: "scoreboard \u30C7\u30FC\u30BF\u304C\u307E\u3060\u3042\u308A\u307E\u305B\u3093" })] }) }), _jsx(Card, { title: "\u7C21\u6613\u5C65\u6B74", subtitle: "\u30B9\u30D1\u30FC\u30AF\u30D0\u30FC\u3067\u3056\u3063\u304F\u308A\u50BE\u5411", children: _jsx("div", { className: "grid", style: { gap: 10 }, children: scoreCards.map(function (score) {
                                return score.metric ? (_jsxs("div", { className: "glass-card", style: { padding: 10 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("div", { style: { fontWeight: 700 }, children: score.metric.displayName }), _jsx("div", { className: "muted", children: score.value.toLocaleString() })] }), _jsx("div", { className: "spark-bars", children: buildSpark(score.value).map(function (height, idx) { return (_jsx("div", { className: "spark-bar", style: {
                                                    height: height,
                                                    opacity: 0.8 - idx * 0.04,
                                                } }, idx)); }) })] }, "spark-".concat(score.metric.id))) : null;
                            }) }) }), _jsx(Card, { title: "\u30D7\u30EC\u30A4\u6642\u9593\u306E\u63A8\u79FB", subtitle: "scoreboard play_time \u304B\u3089\u65E5\u6B21\u96C6\u8A08 (14 \u65E5\u9593)", children: _jsx(PlaytimeChart, { samples: (_a = playtime === null || playtime === void 0 ? void 0 : playtime.samples) !== null && _a !== void 0 ? _a : [], loading: playtimeLoading }) })] })] }));
}
