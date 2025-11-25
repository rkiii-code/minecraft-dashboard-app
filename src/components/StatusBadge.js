import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
export function StatusBadge(_a) {
    var online = _a.online, label = _a.label;
    return (_jsxs("span", { className: clsx('pill', online ? 'status-online' : 'status-offline'), title: online ? 'オンライン' : 'オフライン', children: [_jsx("span", { className: "badge-dot", style: {
                    background: online ? '#12a150' : '#9ca3af',
                } }), label || (online ? 'オンライン' : 'オフライン')] }));
}
