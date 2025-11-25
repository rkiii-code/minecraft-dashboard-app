import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/LogoMark';
export function LoginPage() {
    var navigate = useNavigate();
    var _a = useState(''), username = _a[0], setUsername = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState(''), error = _c[0], setError = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var handleSubmit = function (event) {
        event.preventDefault();
        setLoading(true);
        setError('');
        setTimeout(function () {
            setLoading(false);
            if (!username || !password) {
                setError('ユーザー名とパスワードを入力してください');
                return;
            }
            navigate('/dashboard');
        }, 300);
    };
    return (_jsx("div", { style: {
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '32px 20px',
        }, children: _jsx("div", { className: "card", style: { width: 'min(960px, 100%)', padding: 0 }, children: _jsxs("div", { className: "hero", style: { gridTemplateColumns: '1.1fr 0.9fr' }, children: [_jsxs("div", { children: [_jsxs("div", { className: "nav-brand", style: { marginBottom: 14 }, children: [_jsx(LogoMark, { size: 52 }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 18, fontWeight: 800 }, children: "Shimaenaga Ops" }), _jsx("p", { className: "tagline", children: "Minecraft Server Monitor" })] })] }), _jsx("h1", { className: "page-title", children: "\u30D5\u30ED\u30F3\u30C8\u306E\u30C7\u30E2\u30ED\u30B0\u30A4\u30F3" }), _jsx("p", { className: "page-subtitle", children: "\u30ED\u30B0\u30A4\u30F3\u3059\u308B\u3068\u30B5\u30FC\u30D0\u30FC\u72B6\u6CC1\u3084\u30D7\u30EC\u30A4\u30E4\u30FC\u306E\u30B9\u30B3\u30A2\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002 Cloudflare Pages \u304B\u3089 Go API \u3092\u53E9\u304F\u30B7\u30F3\u30D7\u30EB\u69CB\u6210\u3067\u3059\u3002" }), _jsxs("ul", { className: "inline-list", style: { marginTop: 16 }, children: [_jsx("li", { className: "chip", children: "JWT / admin, user \u30ED\u30FC\u30EB" }), _jsx("li", { className: "chip", children: "RCON \u7D4C\u7531\u3067 scoreboard \u53D6\u5F97" }), _jsx("li", { className: "chip", children: "\u3057\u307E\u3048\u306A\u304C\u30C6\u30FC\u30DE" })] })] }), _jsx("div", { className: "glass-card", style: { padding: 18 }, children: _jsxs("form", { onSubmit: handleSubmit, className: "grid", style: { gap: 12 }, children: [_jsxs("div", { children: [_jsx("label", { className: "label", htmlFor: "username", children: "\u30E6\u30FC\u30B6\u30FC\u540D" }), _jsx("input", { id: "username", className: "input", placeholder: "sun5un", value: username, onChange: function (e) { return setUsername(e.target.value); }, autoComplete: "username" })] }), _jsxs("div", { children: [_jsx("label", { className: "label", htmlFor: "password", children: "\u30D1\u30B9\u30EF\u30FC\u30C9" }), _jsx("input", { id: "password", className: "input", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: function (e) { return setPassword(e.target.value); }, autoComplete: "current-password" })] }), error && (_jsx("div", { className: "surface-muted", style: { color: '#8b6b4a', fontWeight: 600 }, children: error })), _jsx("button", { className: "btn btn-primary", type: "submit", disabled: loading, children: loading ? '接続中...' : 'ログイン' }), _jsx("div", { className: "hint", children: "\u30E2\u30C3\u30AF\u30ED\u30B0\u30A4\u30F3\u3067\u3059\u3002\u4EFB\u610F\u306E\u30E6\u30FC\u30B6\u30FC\u540D\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3067\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u306B\u9077\u79FB\u3057\u307E\u3059\u3002" })] }) })] }) }) }));
}
