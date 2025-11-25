import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
var DEFAULT_AVATAR = '/assets/default.jpg';
function stringToHue(input) {
    var hash = 0;
    for (var i = 0; i < input.length; i += 1) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}
export function Avatar(_a) {
    var name = _a.name, url = _a.url, _b = _a.size, size = _b === void 0 ? 48 : _b, badge = _a.badge, _c = _a.bordered, bordered = _c === void 0 ? true : _c;
    var hue = stringToHue(name);
    var outline = "linear-gradient(135deg, hsl(".concat(hue, ", 65%, 78%), hsl(").concat((hue + 30) % 360, ", 70%, 68%))");
    var imageSize = size - 6;
    return (_jsxs("div", { className: clsx('avatar', bordered && 'avatar-bordered'), style: {
            position: 'relative',
            width: size,
            height: size,
            borderRadius: '18%',
            padding: bordered ? 3 : 0,
            background: bordered ? outline : undefined,
            boxShadow: bordered ? '0 6px 18px rgba(17, 24, 39, 0.12)' : undefined,
        }, children: [_jsx("img", { src: url || DEFAULT_AVATAR, alt: name, style: {
                    width: imageSize,
                    height: imageSize,
                    borderRadius: '16%',
                    objectFit: 'cover',
                    border: '1px solid rgba(226, 232, 240, 0.85)',
                    background: '#fff',
                } }), badge && (_jsx("span", { style: {
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    transform: 'translate(10%, 10%)',
                }, children: badge }))] }));
}
