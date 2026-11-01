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
const locale_1 = require("@joplin/lib/locale");
const ButtonBar_1 = __importDefault(require("../ConfigScreen/ButtonBar"));
const react_redux_1 = require("react-redux");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Button_1 = __importDefault(require("../Button/Button"));
const SsoLoginScreen = (props) => {
    const [code, setCode] = React.useState('');
    const back = () => props.dispatch({ type: 'NAV_BACK' });
    const submit = async () => {
        if (await props.shared.processLoginCode(code)) {
            await shim_1.default.showMessageBox((0, locale_1._)('You are now logged into your account.'), {
                buttons: [(0, locale_1._)('OK')],
            });
            back();
        }
        else {
            await shim_1.default.showErrorDialog((0, locale_1._)('Failed to connect to your account. Please try again.'));
        }
    };
    return (React.createElement("div", { className: 'sso-login-screen' },
        React.createElement("div", { className: 'container' },
            React.createElement("p", null, (0, locale_1._)('To allow Joplin to synchronise with your account, please follow these steps:')),
            React.createElement("ol", null,
                React.createElement("li", null,
                    React.createElement(Button_1.default, { onClick: props.shared.openLoginPage, title: (0, locale_1._)('Log in with your web browser') })),
                React.createElement("li", null,
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: 'sso-code' }, (0, locale_1._)('Enter the code:')),
                        React.createElement("input", { id: 'sso-code', type: 'text', value: code, onChange: e => setCode(e.target.value), placeholder: '###-###-###' }))),
                React.createElement("li", null,
                    React.createElement(Button_1.default, { type: 'submit', onClick: submit, disabled: !props.shared.isLoginCodeValid(code), title: (0, locale_1._)('Continue') })))),
        React.createElement(ButtonBar_1.default, { onCancelClick: back })));
};
const mapStateToProps = (state) => ({
    themeId: state.settings.theme,
});
// Allows reuse of this screen for other code-based login flow
exports.default = (shared) => (0, react_redux_1.connect)(mapStateToProps)((props) => React.createElement(SsoLoginScreen, Object.assign({}, props, { shared: shared })));
//# sourceMappingURL=SsoLoginScreen.js.map