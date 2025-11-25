var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
var COLORS = ['#2c7be5', '#8b6b4a', '#4fb3ff', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#f97316'];
function formatShort(date) {
    return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(new Date(date));
}
export function MultiPlaytimeChart(_a) {
    var series = _a.series, _b = _a.height, height = _b === void 0 ? 220 : _b, loading = _a.loading;
    var dates = useMemo(function () {
        var allDates = new Set();
        series.forEach(function (row) { return row.samples.forEach(function (s) { return allDates.add(s.date); }); });
        return Array.from(allDates).sort();
    }, [series]);
    var max = useMemo(function () {
        if (dates.length === 0)
            return 0;
        return Math.max.apply(Math, __spreadArray(__spreadArray([], series.flatMap(function (row) { return row.samples.map(function (s) { return s.minutes; }); }), false), [1], false));
    }, [dates.length, series]);
    if (loading)
        return _jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    if (!series || series.length === 0)
        return _jsx("div", { className: "muted", children: "\u307E\u3060\u30D7\u30EC\u30A4\u6642\u9593\u306E\u5C65\u6B74\u304C\u3042\u308A\u307E\u305B\u3093" });
    if (dates.length === 0)
        return _jsx("div", { className: "muted", children: "\u65E5\u4ED8\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093" });
    var renderLine = function (samples) {
        var points = dates.map(function (date, idx) {
            var _a;
            var value = (_a = samples[date]) !== null && _a !== void 0 ? _a : 0;
            var x = dates.length === 1 ? 100 : (idx / (dates.length - 1)) * 100;
            var y = 100 - (value / max) * 90;
            return "".concat(x, ",").concat(y);
        });
        return points;
    };
    return (_jsxs("div", { className: "playtime-chart", style: { gap: 12 }, children: [_jsxs("div", { className: "chart-meta", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }, children: [_jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u671F\u9593" }), _jsxs("div", { className: "chart-value", children: [formatShort(dates[0]), " \u2192 ", formatShort(dates[dates.length - 1])] }), _jsx("div", { className: "hint", children: "\u65E5\u6B21\u30D7\u30EC\u30A4\u5206\u6570" })] }), _jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u30D7\u30EC\u30A4\u30E4\u30FC" }), _jsxs("div", { className: "chart-value", children: [series.length, " \u4EBA"] }), _jsx("div", { className: "hint", children: "\u51E1\u4F8B\u3092\u53C2\u7167" })] }), _jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u6700\u5927\u5024" }), _jsxs("div", { className: "chart-value", children: [max.toLocaleString(), " min"] }), _jsx("div", { className: "hint", children: "\u671F\u9593\u5185\u306E 1 \u65E5\u3042\u305F\u308A" })] })] }), _jsxs("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", style: { width: '100%', height: height }, children: [_jsx("defs", { children: series.map(function (row, idx) { return (_jsxs("linearGradient", { id: "mp-fill-".concat(row.player.id), x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: COLORS[idx % COLORS.length], stopOpacity: "0.25" }), _jsx("stop", { offset: "100%", stopColor: COLORS[idx % COLORS.length], stopOpacity: "0.05" })] }, row.player.id)); }) }), series.map(function (row, idx) {
                        var samplesByDate = {};
                        row.samples.forEach(function (s) {
                            samplesByDate[s.date] = s.minutes;
                        });
                        var points = renderLine(samplesByDate);
                        var color = COLORS[idx % COLORS.length];
                        return (_jsxs("g", { children: [_jsx("path", { d: "M0,100 L ".concat(points.join(' '), " L100,100 Z"), fill: "url(#mp-fill-".concat(row.player.id, ")"), opacity: 0.8 }), _jsx("polyline", { points: points.join(' '), fill: "none", stroke: color, strokeWidth: 1.4, strokeLinejoin: "round" }), points.map(function (point, i) {
                                    var _a = point.split(',').map(Number), x = _a[0], y = _a[1];
                                    return _jsx("circle", { cx: x, cy: y, r: 1.5, fill: color, opacity: 0.9 }, "".concat(row.player.id, "-").concat(i));
                                })] }, row.player.id));
                    })] }), _jsx("div", { className: "inline-list", style: { flexWrap: 'wrap', rowGap: 6 }, children: series.map(function (row, idx) {
                    var latest = row.samples[row.samples.length - 1];
                    return (_jsxs("span", { className: "pill", style: { display: 'inline-flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { "aria-hidden": "true", style: {
                                    width: 10,
                                    height: 10,
                                    background: COLORS[idx % COLORS.length],
                                    borderRadius: 999,
                                    display: 'inline-block',
                                } }), row.player.name, " (", latest ? "".concat(latest.minutes, " min") : 'データなし', ")"] }, row.player.id));
                }) })] }));
}
