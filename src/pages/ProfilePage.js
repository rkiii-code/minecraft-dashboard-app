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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { PlaytimeChart } from '../components/PlaytimeChart';
import { useAsync } from '../hooks/useAsync';
import { getPlayerPlaytimeDaily, getProfileMe } from '../lib/api';
export function ProfilePage() {
    var _a;
    var _b = useAsync(getProfileMe, []), profile = _b.data, profileLoading = _b.loading;
    var _c = useAsync(function () { return (profile ? getPlayerPlaytimeDaily(profile.id, 14) : Promise.resolve(null)); }, [profile === null || profile === void 0 ? void 0 : profile.id]), playtime = _c.data, playtimeLoading = _c.loading;
    var navigate = useNavigate();
    var _d = useState({ displayName: '', bio: '', avatarUrl: '' }), form = _d[0], setForm = _d[1];
    var _e = useState(false), saved = _e[0], setSaved = _e[1];
    useEffect(function () {
        if (profile) {
            setForm({
                displayName: profile.displayName,
                bio: profile.bio || '',
                avatarUrl: profile.avatarUrl || '',
            });
        }
    }, [profile]);
    var handleSubmit = function (event) {
        event.preventDefault();
        // API wiring is mocked in this demo.
        setSaved(true);
        setTimeout(function () { return setSaved(false); }, 2000);
    };
    if (profileLoading || !profile)
        return _jsx("div", { className: "muted", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { children: [_jsx("h1", { className: "page-title", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB" }), _jsx("p", { className: "page-subtitle", children: "\u8868\u793A\u540D\u30FB\u3072\u3068\u3053\u3068\u30FB\u30A2\u30D0\u30BF\u30FC\u3092\u66F4\u65B0\u3067\u304D\u307E\u3059\u3002\u30D7\u30EC\u30A4\u6642\u9593\u306E\u63A8\u79FB\u306F scoreboard \u306E play_time \u304B\u3089\u81EA\u52D5\u96C6\u8A08\u3055\u308C\u307E\u3059\u3002" })] }), _jsxs("div", { className: "card-grid", children: [_jsx(Card, { title: "\u7DE8\u96C6", subtitle: "\u8868\u793A\u540D / \u3072\u3068\u3053\u3068 / \u30A2\u30D0\u30BF\u30FC URL", children: _jsxs("form", { onSubmit: handleSubmit, className: "grid", style: { gap: 12 }, children: [_jsxs("div", { children: [_jsx("label", { className: "label", htmlFor: "displayName", children: "\u8868\u793A\u540D" }), _jsx("input", { id: "displayName", className: "input", value: form.displayName, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { displayName: e.target.value })); }); } })] }), _jsxs("div", { children: [_jsx("label", { className: "label", htmlFor: "bio", children: "\u3072\u3068\u3053\u3068 (140 \u6587\u5B57\u307E\u3067)" }), _jsx("textarea", { id: "bio", className: "input", maxLength: 140, rows: 3, value: form.bio, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { bio: e.target.value })); }); } }), _jsxs("div", { className: "hint", children: [form.bio.length, " / 140"] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", htmlFor: "avatar", children: "\u30A2\u30D0\u30BF\u30FC URL (\u7A7A\u306A\u3089\u30C7\u30D5\u30A9\u30EB\u30C8\u3092\u4F7F\u7528)" }), _jsx("input", { id: "avatar", className: "input", placeholder: "https://example.com/avatar.png", value: form.avatarUrl, onChange: function (e) { return setForm(function (f) { return (__assign(__assign({}, f), { avatarUrl: e.target.value })); }); } })] }), saved && _jsx("div", { className: "surface-muted", children: "\u4FDD\u5B58\u3057\u307E\u3057\u305F (mock)" }), _jsx("button", { className: "btn btn-primary", type: "submit", children: "\u4FDD\u5B58\u3059\u308B" })] }) }), _jsx(Card, { title: "\u30D7\u30EC\u30D3\u30E5\u30FC", subtitle: "\u516C\u958B\u6642\u306E\u898B\u3048\u65B9", children: _jsxs("div", { className: "glass-card", style: { padding: 16, display: 'grid', gap: 10 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx(Avatar, { name: form.displayName || profile.username, url: form.avatarUrl, size: 70 }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 800 }, children: form.displayName || profile.username }), _jsxs("div", { className: "hint", children: ["@", profile.username] })] })] }), _jsx("div", { className: "surface-muted", children: form.bio || 'ひとこと未設定' }), _jsxs("div", { className: "chip", children: ["role: ", profile.role] }), _jsx("button", { className: "btn btn-primary", type: "button", onClick: function () { return navigate("/players/".concat(profile.id)); }, children: "\u81EA\u5206\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u3078" })] }) }), _jsx(Card, { title: "\u30D7\u30EC\u30A4\u6642\u9593\u306E\u63A8\u79FB", subtitle: "scoreboard play_time \u304B\u3089\u65E5\u6B21\u96C6\u8A08 (14 \u65E5\u9593)", children: _jsx(PlaytimeChart, { samples: (_a = playtime === null || playtime === void 0 ? void 0 : playtime.samples) !== null && _a !== void 0 ? _a : [], loading: playtimeLoading }) })] })] }));
}
