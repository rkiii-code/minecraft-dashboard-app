import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { MultiSeriesBarChart } from '../components/MultiSeriesBarChart';
import { useAsync } from '../hooks/useAsync';
import { getPlaytimeDailyAll } from '../lib/api';
var DAYS_BY_RESOLUTION = {
    day: 14, // 1日単位は約2週間
    week: 90, // 週単位で約3ヶ月分(12〜13週分の日数を取得)
    month: 365, // 月単位で約1年
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
            var diff = (day === 0 ? -6 : 1) - day; // Monday start
            monday.setDate(d.getDate() + diff);
            key = monday.toISOString().slice(0, 10);
        }
        else {
            // month
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
export function PlaytimeOverviewPage() {
    var _a = useState('day'), resolution = _a[0], setResolution = _a[1];
    var days = DAYS_BY_RESOLUTION[resolution];
    var _b = useAsync(function () { return getPlaytimeDailyAll(days); }, [days]), series = _b.data, loading = _b.loading;
    var handleResolutionChange = function (next) {
        if (next === resolution)
            return;
        setResolution(next);
    };
    var aggregated = useMemo(function () {
        return (series || []).map(function (row) { return ({
            name: row.player.name,
            samples: aggregate(row.samples.map(function (s) { return ({ date: s.date, value: s.minutes }); }), resolution),
        }); });
    }, [series, resolution]);
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("h1", { className: "page-title", children: "\u30D7\u30EC\u30A4\u6642\u9593\u306E\u8A73\u7D30" }), _jsx("p", { className: "page-subtitle", children: "scoreboard play_time \u3092\u65E5\u6B21\u96C6\u8A08\u3057\u3001\u5168\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u63A8\u79FB\u3092\u3072\u3068\u3064\u306E\u5927\u304D\u306A\u30B0\u30E9\u30D5\u3067\u8868\u793A\u3057\u307E\u3059\u3002" }), _jsx("div", { className: "inline-list", style: { marginTop: 10, justifyContent: 'center' }, children: _jsx(Link, { to: "/dashboard", className: "pill", children: "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u3078\u623B\u308B" }) })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'center' }, children: _jsx(Card, { title: "\u65E5\u6B21\u30D7\u30EC\u30A4\u6642\u9593\uFF08\u5168\u4F53\uFF09", subtitle: "".concat(resolution === 'day' ? '日' : resolution === 'week' ? '週' : '月', " \u5358\u4F4D / \u30E2\u30C3\u30AF\u30C7\u30FC\u30BF"), action: _jsx("div", { className: "inline-list", children: ['day', 'week', 'month'].map(function (value) { return (_jsx("button", { className: "btn ".concat(resolution === value ? 'btn-primary' : 'btn-ghost'), type: "button", onClick: function () { return handleResolutionChange(value); }, children: value === 'day' ? '日次 (2週)' : value === 'week' ? '週次 (3ヶ月)' : '月次 (1年)' }, value)); }) }), className: "glass-card", children: _jsx(MultiSeriesBarChart, { series: aggregated, loading: loading, height: 360, unit: "min" }) }) })] }));
}
