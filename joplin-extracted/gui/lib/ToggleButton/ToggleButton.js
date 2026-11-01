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
exports.default = default_1;
const theme_1 = require("@joplin/lib/theme");
const React = __importStar(require("react"));
const react_1 = require("react");
const ReactToggleButton = require('react-toggle-button');
const Color = require('color');
function default_1(props) {
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const ariaLabel = props['aria-label'];
    const passThroughInputProps = (0, react_1.useMemo)(() => {
        return {
            'aria-label': ariaLabel,
            // Works around a bug in ReactToggleButton -- the hidden checkbox input associated
            // with the toggle is always read as "unchecked" by screen readers.
            checked: props.value,
            // Silences a ReactJS warning: "You provided a `checked` prop to a form field without an `onChange` handler."
            // Change events are handled by ReactToggleButton.
            onChange: () => { },
        };
    }, [ariaLabel, props.value]);
    return (React.createElement(ReactToggleButton, { value: props.value, onToggle: props.onToggle, colors: {
            activeThumb: {
                base: Color(theme.color5).rgb().string(),
            },
            active: {
                base: Color(theme.backgroundColor5).alpha(0.7).rgb().string(),
            },
        }, trackStyle: {
            opacity: props.value ? 1 : 0.3,
        }, thumbStyle: {
            opacity: props.value ? 1 : 0.5,
        }, inactiveLabel: "", activeLabel: "", passThroughInputProps: passThroughInputProps }));
}
//# sourceMappingURL=ToggleButton.js.map