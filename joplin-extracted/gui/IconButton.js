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
const React = __importStar(require("react"));
const theme_1 = require("@joplin/lib/theme");
class IconButton extends React.Component {
    render() {
        const style = this.props.style;
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const iconStyle = {
            color: theme.color,
            fontSize: theme.fontSize * 1.4,
        };
        const icon = React.createElement("i", { style: iconStyle, className: `fas ${this.props.iconName}` });
        const rootStyle = Object.assign({ display: 'flex', textDecoration: 'none', padding: 10, width: theme.buttonMinHeight, height: theme.buttonMinHeight, boxSizing: 'border-box', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.backgroundColor, cursor: 'default' }, style);
        return (React.createElement("a", { href: "#", style: rootStyle, className: "icon-button", onClick: () => {
                if (this.props.onClick)
                    this.props.onClick();
            } }, icon));
    }
}
exports.default = IconButton;
//# sourceMappingURL=IconButton.js.map