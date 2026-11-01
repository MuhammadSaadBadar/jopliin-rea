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
const ButtonBar_1 = __importDefault(require("./ConfigScreen/ButtonBar"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../services/bridge"));
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const dropbox_login_shared_1 = __importDefault(require("@joplin/lib/components/shared/dropbox-login-shared"));
class DropboxLoginScreenComponent extends React.Component {
    constructor(props) {
        super(props);
        this.shared_ = new dropbox_login_shared_1.default(this, (msg) => (0, bridge_1.default)().showInfoMessageBox(msg), (msg) => (0, bridge_1.default)().showErrorMessageBox(msg));
    }
    UNSAFE_componentWillMount() {
        void this.shared_.refreshUrl();
    }
    render() {
        const style = this.props.style;
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const containerStyle = Object.assign(Object.assign({}, theme.containerStyle), { padding: theme.configScreenPadding, height: style.height - theme.margin * 2, flex: 1 });
        const inputStyle = Object.assign(Object.assign({}, theme.inputStyle), { width: 500 });
        const buttonStyle = Object.assign(Object.assign({}, theme.buttonStyle), { marginRight: 10 });
        return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
            React.createElement("div", { style: containerStyle },
                React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('To allow Joplin to synchronise with Dropbox, please follow the steps below:')),
                React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('Step 1: Open this URL in your browser to authorise the application:')),
                React.createElement("a", { style: theme.textStyle, href: "#", onClick: this.shared_.loginUrl_click }, this.state.loginUrl),
                React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('Step 2: Enter the code provided by Dropbox:')),
                React.createElement("p", null,
                    React.createElement("input", { type: "text", value: this.state.authCode, onChange: this.shared_.authCodeInput_change, style: inputStyle })),
                React.createElement("button", { disabled: this.state.checkingAuthToken, style: buttonStyle, onClick: this.shared_.submit_click }, (0, locale_1._)('Submit'))),
            React.createElement(ButtonBar_1.default, { onCancelClick: () => this.props.dispatch({ type: 'NAV_BACK' }) })));
    }
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(DropboxLoginScreenComponent);
//# sourceMappingURL=DropboxLoginScreen.js.map