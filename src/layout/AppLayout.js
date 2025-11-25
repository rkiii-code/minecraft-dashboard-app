import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Link } from 'react-router-dom';
import { LogoMark } from '../components/LogoMark';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
var NAV_LINKS = [
    { to: '/dashboard', label: 'ダッシュボード' },
    { to: '/players', label: 'プレイヤー' },
    { to: '/metrics', label: 'メトリクス' },
    { to: '/admin/metrics', label: '管理' },
    { to: '/profile', label: 'プロフィール' },
];
export function AppLayout(_a) {
    var children = _a.children;
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("nav", { className: "navbar", children: [_jsxs(Link, { className: "nav-brand", to: "/dashboard", "aria-label": "Minecraft dashboard home", children: [_jsx(LogoMark, { size: 40 }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 15, lineHeight: 1.1 }, children: "Shimaenaga Ops" }), _jsx("div", { className: "tagline", children: "Minecraft monitoring" })] })] }), _jsx("div", { className: "nav-links", children: NAV_LINKS.map(function (item) { return (_jsx(NavLink, { className: function (_a) {
                                var isActive = _a.isActive;
                                return "nav-link ".concat(isActive ? 'active' : '');
                            }, to: item.to, children: item.label }, item.to)); }) }), _jsxs(Link, { to: "/profile", style: { display: 'inline-flex', alignItems: 'center', gap: 8 }, children: [_jsx(StatusBadge, { online: true, label: "\u30AA\u30F3\u30E9\u30A4\u30F3" }), _jsx(Avatar, { name: "admin", size: 42 })] })] }), children] }));
}
