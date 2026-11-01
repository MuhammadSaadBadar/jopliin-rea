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
const React = __importStar(require("react"));
const PasswordInput_1 = __importDefault(require("./PasswordInput"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const LabelledPasswordInput = props => {
    var _a;
    const inputId = (0, react_1.useId)();
    const statusIconId = (0, react_1.useId)();
    const canRenderStatusIcon = ((_a = props.valid) !== null && _a !== void 0 ? _a : null) !== null && props.value;
    const renderStatusIcon = () => {
        if (!canRenderStatusIcon)
            return null;
        let title, classNames;
        if (props.valid) {
            title = (0, locale_1._)('Valid');
            classNames = 'fas fa-check -valid';
        }
        else {
            title = (0, locale_1._)('Invalid');
            classNames = 'fas fa-times -invalid';
        }
        return React.createElement("i", { className: `password-status-icon ${classNames}`, id: statusIconId, role: 'img', "aria-label": title, title: title, "aria-live": 'polite' });
    };
    const rootClassName = `labelled-password-input form-input-group${props.reserveIconGutter ? ' -reserve-icon-gutter' : ''}`;
    return React.createElement("div", { className: rootClassName },
        React.createElement("label", { htmlFor: inputId }, props.labelText),
        React.createElement("div", { className: 'password' },
            React.createElement(PasswordInput_1.default, { inputId: inputId, "aria-invalid": canRenderStatusIcon ? !props.valid : undefined, "aria-errormessage": canRenderStatusIcon ? statusIconId : undefined, value: props.value, onChange: props.onChange }),
            renderStatusIcon()));
};
exports.default = LabelledPasswordInput;
//# sourceMappingURL=LabelledPasswordInput.js.map