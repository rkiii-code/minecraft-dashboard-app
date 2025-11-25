import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { useAsync } from '../hooks/useAsync';
import { getUserProfile } from '../lib/api';
export function UserProfilePage() {
    var id = useParams().id;
    var profileId = Number(id);
    var _a = useAsync(function () { return getUserProfile(profileId); }, [profileId]), profile = _a.data, loading = _a.loading;
    if (!Number.isFinite(profileId))
        return _jsx("div", { className: "muted", children: "\u7121\u52B9\u306A ID" });
    if (loading)
        return _jsx("div", { className: "muted", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    if (!profile)
        return _jsx("div", { className: "muted", children: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093" });
    return (_jsxs("div", { className: "grid", style: { gap: 16 }, children: [_jsxs("div", { children: [_jsx("h1", { className: "page-title", children: profile.displayName || profile.username }), _jsx("p", { className: "page-subtitle", children: "\u516C\u958B\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\uFF08\u4ED6\u30E6\u30FC\u30B6\u30FC\u8996\u70B9\uFF09" })] }), _jsxs(Card, { title: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 14 }, children: [_jsx(Avatar, { name: profile.displayName || profile.username, url: profile.avatarUrl, size: 70 }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 800 }, children: profile.displayName || profile.username }), _jsxs("div", { className: "hint", children: ["@", profile.username] })] })] }), _jsx("div", { className: "divider" }), _jsx("div", { className: "surface-muted", children: profile.bio || 'ひとこと未設定' }), _jsx("div", { className: "hint", style: { marginTop: 8 }, children: "\u30E1\u30FC\u30EB\u306A\u3069\u306E\u6A5F\u5FAE\u60C5\u5831\u306F\u8868\u793A\u3057\u307E\u305B\u3093\u3002\u30ED\u30FC\u30EB\u306F\u975E\u8868\u793A\u3067\u3059\u3002" })] })] }));
}
