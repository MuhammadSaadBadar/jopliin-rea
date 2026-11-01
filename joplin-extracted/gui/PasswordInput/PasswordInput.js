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
const react_1 = require("react");
const StyledInput_1 = __importDefault(require("../style/StyledInput"));
const locale_1 = require("@joplin/lib/locale");
const PasswordInput = (props) => {
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const inputType = showPassword ? 'text' : 'password';
    const icon = showPassword ? 'far fa-eye-slash' : 'far fa-eye';
    const title = showPassword ? (0, locale_1._)('Hide password') : (0, locale_1._)('Show password');
    const onShowPassword = (0, react_1.useCallback)(() => {
        setShowPassword(current => !current);
    }, []);
    return (React.createElement("div", { className: "password-input" },
        React.createElement(StyledInput_1.default, { id: props.inputId, "aria-errormessage": props['aria-errormessage'], "aria-invalid": props['aria-invalid'], className: "field", type: inputType, value: props.value, onChange: props.onChange }),
        React.createElement("button", { type: "button", onClick: onShowPassword, className: "showpasswordbutton" },
            React.createElement("i", { className: icon, role: 'img', "aria-label": title, title: title }))));
};
exports.default = PasswordInput;
//# sourceMappingURL=PasswordInput.js.map