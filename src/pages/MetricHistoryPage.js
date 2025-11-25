import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { MultiSeriesBarChart } from '../components/MultiSeriesBarChart';
import { useAsync } from '../hooks/useAsync';
import { getMetricHistory, getMetrics } from '../lib/api';
var DAYS_BY_RESOLUTION = {
    day: 14,
    week: 90,
    month: 365,
};
function aggregate(samples, resolution) {
    if (resolution === 'day')
        return samples;
    var buckets = new Map();
    samples.forEach(function (s) {
        var _a;
        var d = new Date(s.date);
        var key;
        if (resolution === 'week') {
            var monday = new Date(d);
            var day = monday.getDay();
            var diff = (day === 0 ? -6 : 1) - day;
            monday.setDate(d.getDate() + diff);
            key = monday.toISOString().slice(0, 10);
        }
        else {
            key = "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-01");
        }
        buckets.set(key, ((_a = buckets.get(key)) !== null && _a !== void 0 ? _a : 0) + s.value);
    });
    return Array.from(buckets.entries())
        .map(function (_a) {
        var date = _a[0], value = _a[1];
        return ({ date: date, value: value });
    })
        .sort(function (a, b) { return a.date.localeCompare(b.date); });
}
export function MetricHistoryPage(_a) {
    var objectiveName = _a.objectiveName;
    var params = useParams();
    var metricKey = params.id;
    var _b = useState('day'), resolution = _b[0], setResolution = _b[1];
    var metrics = useAsync(getMetrics, []).data;
    var targetMetric = useMemo(function () {
        if (!metrics)
            return undefined;
        var key = objectiveName || metricKey;
        if (!key)
            return undefined;
        var numeric = Number(key);
        if (Number.isFinite(numeric)) {
            return metrics.find(function (m) { return m.id === numeric; });
        }
        return metrics.find(function (m) { return m.objectiveName === key; });
    }, [metrics, metricKey, objectiveName]);
    var metricId = targetMetric === null || targetMetric === void 0 ? void 0 : targetMetric.id;
    var days = DAYS_BY_RESOLUTION[resolution];
    var _c = useAsync(function () { return (metricId ? getMetricHistory(metricId, days) : Promise.resolve([])); }, [metricId, days]), series = _c.data, loading = _c.loading;
    var handleResolutionChange = function (next) {
        if (next === resolution)
            return;
        setResolution(next);
    };
    var aggregated = useMemo(function () {
        return (series || []).map(function (row) { return ({
            name: row.player.name,
            samples: aggregate(row.samples.map(function (s) { return ({ date: s.date, value: s.value }); }), resolution),
        }); });
    }, [series, resolution]);
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("h1", { className: "page-title", children: targetMetric ? "".concat(targetMetric.displayName, " \u306E\u5C65\u6B74") : 'メトリクス履歴' }), _jsx("p", { className: "page-subtitle", children: "scoreboard \u306E\u5024\u3092\u65E5\u6B21\u3067\u7A4D\u307F\u4E0A\u3052\u3001\u30D7\u30EC\u30A4\u30E4\u30FC\u3054\u3068\u306E\u63A8\u79FB\u3092\u307E\u3068\u3081\u3066\u8868\u793A\u3057\u307E\u3059\u3002" }), _jsxs("div", { className: "inline-list", style: { marginTop: 10, justifyContent: 'center' }, children: [_jsx(Link, { to: "/dashboard", className: "pill", children: "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u3078\u623B\u308B" }), _jsx(Link, { to: "/metrics/playtime", className: "pill", children: "\u30D7\u30EC\u30A4\u6642\u9593\u5168\u4F53" })] })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'center' }, children: _jsx(Card, { title: targetMetric ? "".concat(targetMetric.displayName, " / ").concat(targetMetric.unit) : 'メトリクス履歴', subtitle: "".concat(resolution === 'day' ? '日次(2週)' : resolution === 'week' ? '週次(3ヶ月)' : '月次(1年)', " / \u30E2\u30C3\u30AF\u30C7\u30FC\u30BF"), action: _jsx("div", { className: "inline-list", children: ['day', 'week', 'month'].map(function (value) { return (_jsx("button", { className: "btn ".concat(resolution === value ? 'btn-primary' : 'btn-ghost'), type: "button", onClick: function () { return handleResolutionChange(value); }, children: value === 'day' ? '日次' : value === 'week' ? '週次' : '月次' }, value)); }) }), className: "glass-card", children: _jsx(MultiSeriesBarChart, { series: aggregated, loading: loading, height: 360, unit: targetMetric === null || targetMetric === void 0 ? void 0 : targetMetric.unit }) }) })] }));
}
