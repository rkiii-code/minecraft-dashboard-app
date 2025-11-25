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
import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { useAsync } from '../hooks/useAsync';
import { getMetrics } from '../lib/api';
export function AdminMetricsPage() {
    var _a = useAsync(getMetrics, []), metrics = _a.data, loading = _a.loading;
    var _b = useState([]), rows = _b[0], setRows = _b[1];
    var _c = useState({
        objectiveName: 'new_objective',
        displayName: '新しいメトリクス',
        description: 'scoreboard に追加予定のメトリクス',
        unit: 'pt',
    }), form = _c[0], setForm = _c[1];
    useEffect(function () {
        if (metrics)
            setRows(metrics);
    }, [metrics]);
    var toggleEnabled = function (id) {
        setRows(function (current) { return current.map(function (row) { return (row.id === id ? __assign(__assign({}, row), { isEnabled: !row.isEnabled }) : row); }); });
    };
    var handleAdd = function (event) {
        event.preventDefault();
        setRows(function (current) { return __spreadArray(__spreadArray([], current, true), [
            {
                id: Date.now(),
                objectiveName: form.objectiveName,
                displayName: form.displayName,
                description: form.description || 'プレビュー用に追加されたモックメトリクス',
                unit: form.unit || 'pt',
                isEnabled: true,
                updatedAt: new Date().toISOString(),
                temporary: true,
            },
        ], false); });
    };
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { children: [_jsx("h1", { className: "page-title", children: "\u7BA1\u7406 / \u30E1\u30C8\u30EA\u30AF\u30B9" }), _jsx("p", { className: "page-subtitle", children: "scoreboard objective \u306E\u8FFD\u52A0\u30FB\u7121\u52B9\u5316\u3002\u30D0\u30C3\u30AF\u30A8\u30F3\u30C9\u63A5\u7D9A\u307E\u3067\u306F\u30E2\u30C3\u30AF\u64CD\u4F5C\u3067\u3059\u3002" })] }), _jsx(Card, { title: "\u8FFD\u52A0", subtitle: "objective \u306F\u82F1\u5C0F\u6587\u5B57\u3068\u30A2\u30F3\u30C0\u30FC\u30B9\u30B3\u30A2\u306E\u307F\u3092\u60F3\u5B9A", children: _jsxs("form", { onSubmit: handleAdd, className: "grid", style: { gap: 10 }, children: [_jsxs("div", { className: "grid", style: { gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }, children: [_jsxs("div", { className: "grid", style: { gap: 6 }, children: [_jsx("label", { className: "label", htmlFor: "objective", children: "objective_name" }), _jsx("input", { id: "objective", className: "input", value: form.objectiveName, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { objectiveName: e.target.value })); }); } })] }), _jsxs("div", { className: "grid", style: { gap: 6 }, children: [_jsx("label", { className: "label", htmlFor: "displayName", children: "\u8868\u793A\u540D" }), _jsx("input", { id: "displayName", className: "input", value: form.displayName, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { displayName: e.target.value })); }); } })] }), _jsxs("div", { className: "grid", style: { gap: 6 }, children: [_jsx("label", { className: "label", htmlFor: "unit", children: "\u5358\u4F4D" }), _jsx("input", { id: "unit", className: "input", value: form.unit, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { unit: e.target.value })); }); } })] }), _jsxs("div", { className: "grid", style: { gap: 6 }, children: [_jsx("label", { className: "label", htmlFor: "description", children: "\u8AAC\u660E" }), _jsx("input", { id: "description", className: "input", value: form.description, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { description: e.target.value })); }); } })] })] }), _jsx("button", { className: "btn btn-primary", type: "submit", children: "\u30E2\u30C3\u30AF\u8FFD\u52A0" }), _jsx("div", { className: "hint", children: "\u5B9F\u969B\u306E API \u306B\u3064\u306A\u3050\u524D\u306F\u30D7\u30EC\u30D3\u30E5\u30FC\u306E\u307F\u3002\u6700\u7D42\u7684\u306B\u306F POST /api/admin/metrics \u3092\u547C\u3073\u51FA\u3059\u60F3\u5B9A\u3067\u3059\u3002" })] }) }), _jsxs(Card, { title: "\u30E1\u30C8\u30EA\u30AF\u30B9\u4E00\u89A7", subtitle: loading ? '読み込み中...' : "".concat(rows.length, " \u4EF6"), children: [_jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "objective" }), _jsx("th", { children: "\u8868\u793A\u540D" }), _jsx("th", { children: "\u5358\u4F4D" }), _jsx("th", { children: "\u72B6\u614B" }), _jsx("th", { children: "\u6700\u7D42\u66F4\u65B0" }), _jsx("th", {})] }) }), _jsx("tbody", { children: rows.map(function (row) { return (_jsxs("tr", { children: [_jsx("td", { style: { fontWeight: 700 }, children: row.objectiveName }), _jsx("td", { children: row.displayName }), _jsx("td", { children: row.unit }), _jsx("td", { children: _jsx("span", { className: "pill ".concat(row.isEnabled ? 'status-online' : 'status-offline'), children: row.isEnabled ? '有効' : '無効' }) }), _jsx("td", { className: "muted", children: row.updatedAt ? new Date(row.updatedAt).toLocaleString('ja-JP') : '—' }), _jsx("td", { children: _jsx("button", { className: "btn btn-ghost", type: "button", onClick: function () { return toggleEnabled(row.id); }, children: row.isEnabled ? '無効化' : '有効化' }) })] }, row.id)); }) })] }), rows.length === 0 && _jsx("div", { className: "muted", children: "\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093" })] })] }));
}
