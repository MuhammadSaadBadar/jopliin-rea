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
exports.default = DialogButtonRow;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const theme_1 = require("@joplin/lib/theme");
const useKeyboardHandler_1 = __importDefault(require("./DialogButtonRow/useKeyboardHandler"));
function DialogButtonRow(props) {
    var _a, _b;
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const buttonStyle = (0, react_1.useMemo)(() => {
        return Object.assign(Object.assign({}, theme.buttonStyle), { marginLeft: 10 });
    }, [theme.buttonStyle]);
    const onOkButtonClick = (0, react_1.useCallback)(() => {
        if (props.onClick && !props.okButtonDisabled)
            props.onClick({ buttonName: 'ok' });
    }, [props.onClick, props.okButtonDisabled]);
    const onCancelButtonClick = (0, react_1.useCallback)(() => {
        if (props.onClick && !props.cancelButtonDisabled)
            props.onClick({ buttonName: 'cancel' });
    }, [props.onClick, props.cancelButtonDisabled]);
    const onCustomButtonClick = (0, react_1.useCallback)((event) => {
        if (props.onClick)
            props.onClick(event);
    }, [props.onClick]);
    const okButtonShow = (_a = props.okButtonShow) !== null && _a !== void 0 ? _a : true;
    const cancelButtonShow = (_b = props.cancelButtonShow) !== null && _b !== void 0 ? _b : true;
    const canClickOk = okButtonShow && !props.okButtonDisabled;
    const canClickCancel = cancelButtonShow && !props.cancelButtonDisabled;
    const onKeyDown = (0, useKeyboardHandler_1.default)({
        onOkButtonClick: canClickOk ? onOkButtonClick : null,
        onCancelButtonClick: canClickCancel ? onCancelButtonClick : null,
    });
    const buttonComps = [];
    if (props.customButtons) {
        for (const b of props.customButtons) {
            buttonComps.push(React.createElement("button", { key: b.name, style: buttonStyle, onClick: () => onCustomButtonClick({ buttonName: b.name }), disabled: b.disabled, onKeyDown: onKeyDown }, b.label));
        }
    }
    if (okButtonShow) {
        buttonComps.push(React.createElement("button", { disabled: props.okButtonDisabled, key: "ok", style: buttonStyle, onClick: onOkButtonClick, ref: props.okButtonRef, onKeyDown: onKeyDown }, props.okButtonLabel ? props.okButtonLabel : (0, locale_1._)('OK')));
    }
    if (cancelButtonShow) {
        buttonComps.push(React.createElement("button", { disabled: props.cancelButtonDisabled, key: "cancel", style: Object.assign({}, buttonStyle), onClick: onCancelButtonClick }, props.cancelButtonLabel ? props.cancelButtonLabel : (0, locale_1._)('Cancel')));
    }
    return React.createElement("div", { style: { textAlign: 'right', marginTop: 10 } }, buttonComps);
}
//# sourceMappingURL=DialogButtonRow.js.map