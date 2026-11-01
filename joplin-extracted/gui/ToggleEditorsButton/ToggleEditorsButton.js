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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = void 0;
exports.default = ToggleEditorsButton;
const React = __importStar(require("react"));
const styles_1 = __importDefault(require("./styles"));
const locale_1 = require("@joplin/lib/locale");
var Value;
(function (Value) {
    Value["Markdown"] = "markdown";
    Value["RichText"] = "richText";
})(Value || (exports.Value = Value = {}));
function ToggleEditorsButton(props) {
    const style = (0, styles_1.default)(props);
    return (React.createElement("button", { ref: props.buttonRef, style: style.button, disabled: !props.toolbarButtonInfo.enabled, "aria-label": props.toolbarButtonInfo.tooltip, "aria-description": (0, locale_1._)('Switch to the %s Editor', props.value !== Value.Markdown ? (0, locale_1._)('Markdown') : (0, locale_1._)('Rich Text')), title: props.toolbarButtonInfo.tooltip, type: "button", className: `tox-tbtn ${props.value}-active`, "aria-pressed": "false", onClick: props.toolbarButtonInfo.onClick, tabIndex: props.tabIndex },
        React.createElement("div", { style: style.leftInnerButton },
            React.createElement("i", { style: style.leftIcon, className: "fab fa-markdown" })),
        React.createElement("div", { style: style.rightInnerButton },
            React.createElement("i", { style: style.rightIcon, className: "fas fa-edit" }))));
}
//# sourceMappingURL=ToggleEditorsButton.js.map