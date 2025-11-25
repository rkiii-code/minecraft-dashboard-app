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
function formatShort(date) {
    return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(new Date(date));
}
export function PlaytimeChart(_a) {
    var samples = _a.samples, _b = _a.height, height = _b === void 0 ? 140 : _b, loading = _a.loading;
    if (loading) {
        return _jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    if (!samples || samples.length === 0) {
        return _jsx("div", { className: "muted", children: "\u307E\u3060\u30D7\u30EC\u30A4\u6642\u9593\u306E\u5C65\u6B74\u304C\u3042\u308A\u307E\u305B\u3093" });
    }
    var max = Math.max.apply(Math, __spreadArray(__spreadArray([], samples.map(function (s) { return s.minutes; }), false), [1], false));
    var last = samples[samples.length - 1];
    var avg = Math.round(samples.reduce(function (sum, s) { return sum + s.minutes; }, 0) / samples.length);
    var points = samples.map(function (s, idx) {
        var x = samples.length === 1 ? 100 : (idx / (samples.length - 1)) * 100;
        var y = 100 - (s.minutes / max) * 90;
        return "".concat(x, ",").concat(y);
    });
    var areaPath = "M0,100 L ".concat(points.join(' '), " L100,100 Z");
    return (_jsxs("div", { className: "playtime-chart", children: [_jsxs("div", { className: "chart-meta", children: [_jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u6700\u65B0" }), _jsxs("div", { className: "chart-value", children: [last.minutes, " min"] }), _jsx("div", { className: "hint", children: formatShort(last.date) })] }), _jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u5E73\u5747" }), _jsxs("div", { className: "chart-value", children: [avg, " min"] }), _jsx("div", { className: "hint", children: "\u671F\u9593\u5185\u306E1\u65E5\u3042\u305F\u308A" })] }), _jsxs("div", { children: [_jsx("div", { className: "muted label", children: "\u6700\u5927" }), _jsxs("div", { className: "chart-value", children: [max, " min"] }), _jsx("div", { className: "hint", children: "\u3053\u306E\u671F\u9593\u5185" })] })] }), _jsxs("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", style: { width: '100%', height: height }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "playtimeFill", x1: "0", x2: "0", y1: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#8ac7f6", stopOpacity: "0.8" }), _jsx("stop", { offset: "100%", stopColor: "#b7e1ff", stopOpacity: "0.2" })] }) }), _jsx("path", { d: areaPath, fill: "url(#playtimeFill)", opacity: 0.9 }), _jsx("polyline", { points: points.join(' '), fill: "none", stroke: "#2c7be5", strokeWidth: 1.4, strokeLinejoin: "round" }), samples.map(function (s, idx) {
                        var x = samples.length === 1 ? 100 : (idx / (samples.length - 1)) * 100;
                        var y = 100 - (s.minutes / max) * 90;
                        return _jsx("circle", { cx: x, cy: y, r: 1.6, fill: "#114b8b", opacity: 0.9 }, s.date);
                    })] }), _jsxs("div", { className: "chart-footer", children: [_jsx("span", { children: formatShort(samples[0].date) }), _jsx("span", { children: formatShort(last.date) })] })] }));
}
