"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionInput = exports.ActionSwatch = exports.ActionDivider = exports.ActionButton = exports.ActionPanel = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const ActionPanel = ({ position = 'bottom-center', caption, children }) => {
    return (React.createElement("div", { className: `whiteboard-action-panel -${position}` },
        caption ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "caption" }, caption),
            React.createElement("div", { className: "divider" }))) : null,
        children));
};
exports.ActionPanel = ActionPanel;
const ActionButton = ({ onClick, active, disabled, title, children }) => {
    const classes = ['button'];
    if (active)
        classes.push('-active');
    return (React.createElement("button", { type: "button", onClick: onClick, disabled: disabled, title: title, "aria-label": title, "aria-pressed": active, className: classes.join(' ') }, children));
};
exports.ActionButton = ActionButton;
const ActionDivider = () => React.createElement("div", { className: "divider" });
exports.ActionDivider = ActionDivider;
const ActionSwatch = ({ color, active, title, onClick }) => {
    const classes = ['swatch'];
    if (active)
        classes.push('-active');
    if (color === null)
        classes.push('-none');
    return (React.createElement("button", { type: "button", onClick: onClick, title: title, "aria-label": title, "aria-pressed": active, className: classes.join(' '), style: color ? { background: color } : undefined }));
};
exports.ActionSwatch = ActionSwatch;
const ActionInput = ({ value, placeholder, width = 140, focusToken, onChange }) => {
    const inputRef = (0, react_1.useRef)(null);
    // Skip the initial effect fire: we only want to grab focus when the caller
    // bumps the token, not on mount (single-clicking an edge would otherwise
    // steal focus and let stray keystrokes overwrite the label).
    const lastFocusTokenRef = (0, react_1.useRef)(focusToken);
    (0, react_1.useEffect)(() => {
        if (focusToken === undefined)
            return;
        if (focusToken === lastFocusTokenRef.current)
            return;
        lastFocusTokenRef.current = focusToken;
        const input = inputRef.current;
        if (!input)
            return;
        (0, focusHandler_1.focus)('ActionInput::focusToken', input);
        input.select();
    }, [focusToken]);
    return (React.createElement("input", { ref: inputRef, type: "text", value: value, placeholder: placeholder, "aria-label": placeholder, onChange: e => onChange(e.target.value), className: "input", style: { width } }));
};
exports.ActionInput = ActionInput;
//# sourceMappingURL=ActionPanel.js.map