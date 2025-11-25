import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
export function Card(_a) {
    var title = _a.title, subtitle = _a.subtitle, action = _a.action, children = _a.children, className = _a.className;
    return (_jsxs("section", { className: clsx('card', className), children: [(title || subtitle || action) && (_jsxs("header", { className: "card-header", children: [_jsxs("div", { children: [title && _jsx("h3", { className: "card-title", children: title }), subtitle && _jsx("p", { className: "card-meta", children: subtitle })] }), action && _jsx("div", { children: action })] })), _jsx("div", { children: children })] }));
}
