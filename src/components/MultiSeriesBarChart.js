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
export function MultiSeriesBarChart(_a) {
    var series = _a.series, _b = _a.height, height = _b === void 0 ? 260 : _b, loading = _a.loading, _c = _a.unit, unit = _c === void 0 ? '' : _c;
    var dates = useMemo(function () {
        var allDates = new Set();
        series.forEach(function (row) { return row.samples.forEach(function (s) { return allDates.add(s.date); }); });
        return Array.from(allDates).sort();
    }, [series]);
    var max = useMemo(function () {
        if (dates.length === 0)
            return 0;
        return Math.max.apply(Math, __spreadArray(__spreadArray([], series.flatMap(function (row) { return row.samples.map(function (s) { return s.value; }); }), false), [1], false));
    }, [dates.length, series]);
    var yTicks = useMemo(function () {
        var tickCount = 5;
        return Array.from({ length: tickCount }, function (_, i) {
            var ratio = i / Math.max(1, tickCount - 1);
            var value = Math.round(max * ratio);
            var y = 100 - ratio * 90;
            return { value: value, y: y };
        });
    }, [max]);
    var xLabels = useMemo(function () {
        var labelCount = Math.min(5, dates.length);
        if (labelCount === 0)
            return [];
        return Array.from({ length: labelCount }, function (_, i) {
            var idx = labelCount === 1 ? 0 : Math.round((dates.length - 1) * (i / (labelCount - 1)));
            return { date: dates[idx], label: formatShort(dates[idx]) };
        });
    }, [dates]);
    if (loading)
        return _jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    if (!series || series.length === 0)
        return _jsx("div", { className: "muted", children: "\u307E\u3060\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093" });
    if (dates.length === 0)
        return _jsx("div", { className: "muted", children: "\u65E5\u4ED8\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093" });
    var bandWidth = 100 / dates.length;
    var barWidth = bandWidth / (series.length + 1);
    var bars = dates.flatMap(function (date, dateIdx) {
        return series.map(function (row, seriesIdx) {
            var _a, _b;
            var value = (_b = (_a = row.samples.find(function (s) { return s.date === date; })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
            var x = dateIdx * bandWidth + seriesIdx * barWidth + barWidth * 0.2;
            var heightPct = (value / max) * 90;
            var y = 100 - heightPct;
            return {
                key: "".concat(row.name, "-").concat(date),
                x: x,
                y: y,
                width: barWidth * 0.6,
                height: heightPct,
                color: COLORS[seriesIdx % COLORS.length],
                value: value,
                date: date,
            };
        });
    });
    return (_jsxs("div", { className: "playtime-chart", style: { gap: 12 }, children: [_jsxs("div", { className: "chart-meta", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }, children: [_jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u671F\u9593" }), _jsxs("div", { className: "chart-value", children: [formatShort(dates[0]), " \u2192 ", formatShort(dates[dates.length - 1])] }), _jsx("div", { className: "hint", children: "\u65E5\u6B21\u30B5\u30F3\u30D7\u30EB" })] }), _jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u30B7\u30EA\u30FC\u30BA" }), _jsxs("div", { className: "chart-value", children: [series.length, " \u4EF6"] }), _jsx("div", { className: "hint", children: "\u51E1\u4F8B\u3092\u53C2\u7167" })] }), _jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u6700\u5927\u5024" }), _jsxs("div", { className: "chart-value", children: [max.toLocaleString(), " ", unit] }), _jsx("div", { className: "hint", children: "\u671F\u9593\u5185\u306E 1 \u65E5\u3042\u305F\u308A" })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '64px 1fr', gap: 8, alignItems: 'stretch' }, children: [_jsx("div", { style: {
                            display: 'grid',
                            alignContent: 'space-between',
                            height: height,
                            fontSize: 12,
                            color: '#6b7280',
                        }, children: yTicks
                            .slice()
                            .reverse()
                            .map(function (tick) { return (_jsxs("div", { style: { textAlign: 'right' }, children: [tick.value.toLocaleString(), unit ? " ".concat(unit) : ''] }, tick.value)); }) }), _jsxs("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", style: { width: '100%', height: height }, children: [_jsx("line", { x1: "0", y1: "100", x2: "100", y2: "100", stroke: "#e5e7eb", strokeWidth: "0.6" }), yTicks.map(function (tick) { return (_jsx("line", { x1: "0", y1: tick.y, x2: "100", y2: tick.y, stroke: "#e5e7eb", strokeWidth: "0.3", opacity: 0.6 }, "grid-".concat(tick.value))); }), bars.map(function (bar) { return (_jsx("g", { children: _jsx("rect", { x: bar.x, y: bar.y, width: bar.width, height: bar.height, fill: bar.color, opacity: 0.82, rx: "0.8" }) }, bar.key)); })] })] }), xLabels.length > 0 && (_jsx("div", { className: "chart-footer", style: { justifyContent: 'space-between' }, children: xLabels.map(function (label) { return (_jsx("span", { children: label.label }, label.date)); }) })), _jsx("div", { className: "inline-list", style: { flexWrap: 'wrap', rowGap: 6 }, children: series.map(function (row, idx) {
                    var latest = row.samples[row.samples.length - 1];
                    return (_jsxs("span", { className: "pill", style: { display: 'inline-flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { "aria-hidden": "true", style: {
                                    width: 10,
                                    height: 10,
                                    background: COLORS[idx % COLORS.length],
                                    borderRadius: 999,
                                    display: 'inline-block',
                                } }), row.name, " ", latest ? "(".concat(latest.value.toLocaleString()).concat(unit ? " ".concat(unit) : '', ")") : ''] }, row.name));
                }) })] }));
}
