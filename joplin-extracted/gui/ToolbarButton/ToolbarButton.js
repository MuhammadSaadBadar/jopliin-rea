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
exports.default = ToolbarButton;
const React = __importStar(require("react"));
function isFontAwesomeIcon(iconName) {
    const s = iconName.split(' ');
    return s.length === 2 && ['fa', 'fas'].includes(s[0]);
}
function getProp(props, name, defaultValue = null) {
    if (props.toolbarButtonInfo && (name in props.toolbarButtonInfo))
        return props.toolbarButtonInfo[name];
    if (!(name in props))
        return defaultValue;
    return props[name];
}
function ToolbarButton(props) {
    const title = getProp(props, 'title', '');
    const tooltip = getProp(props, 'tooltip', title);
    let icon = null;
    const iconName = getProp(props, 'iconName');
    if (iconName) {
        const iconProps = {
            'aria-hidden': true,
            role: 'img',
            className: `toolbar-icon ${title ? '-has-title' : ''} ${iconName}`,
        };
        icon = isFontAwesomeIcon(iconName) ? React.createElement("i", Object.assign({}, iconProps)) : React.createElement("span", Object.assign({}, iconProps));
    }
    // Keep this for legacy compatibility but for consistency we should use "disabled" prop
    let isEnabled = getProp(props, 'enabled', null);
    if (isEnabled === null)
        isEnabled = true;
    if (props.disabled)
        isEnabled = false;
    const classes = ['button', 'toolbar-button'];
    if (!isEnabled)
        classes.push('disabled');
    if (title)
        classes.push('-has-title');
    const onClick = getProp(props, 'onClick');
    const style = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    const disabled = !isEnabled;
    return (React.createElement("button", { className: classes.join(' '), title: tooltip, onClick: () => {
            if (isEnabled && onClick)
                onClick();
        }, ref: props.buttonRef, 
        // At least on MacOS, the disabled HTML prop isn't sufficient for the screen reader
        // to read the element as disable. For this, aria-disabled is necessary.
        disabled: disabled, "aria-label": !title ? tooltip : undefined, "aria-description": title ? tooltip : undefined, "aria-disabled": !isEnabled, tabIndex: props.tabIndex },
        icon,
        React.createElement("span", { style: style }, title)));
}
//# sourceMappingURL=ToolbarButton.js.map