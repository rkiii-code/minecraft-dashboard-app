import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MetricBar(_a) {
    var label = _a.label, value = _a.value, unit = _a.unit, percent = _a.percent, caption = _a.caption;
    var clamped = Math.min(100, Math.max(0, percent));
    return (_jsxs("div", { style: { display: 'grid', gap: 6 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, children: [_jsx("div", { style: { fontWeight: 700 }, children: label }), _jsxs("div", { style: { color: '#0f172a', fontWeight: 800 }, children: [value.toLocaleString(), unit ? " ".concat(unit) : ''] })] }), _jsx("div", { className: "meter", "aria-hidden": "true", children: _jsx("div", { className: "meter-fill", style: { width: "".concat(clamped, "%") } }) }), caption && _jsx("div", { className: "hint", children: caption })] }));
}
