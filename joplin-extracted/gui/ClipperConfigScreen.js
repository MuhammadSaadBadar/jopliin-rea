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
const react_redux_1 = require("react-redux");
const electron_1 = require("electron");
const ExtensionBadge_1 = __importDefault(require("./ExtensionBadge"));
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const ClipperServer_1 = __importDefault(require("@joplin/lib/ClipperServer"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const EncryptionService_1 = __importDefault(require("@joplin/lib/services/e2ee/EncryptionService"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
class ClipperConfigScreenComponent extends React.Component {
    constructor(props) {
        super(props);
        this.copyToken_click = this.copyToken_click.bind(this);
    }
    disableClipperServer_click() {
        Setting_1.default.setValue('clipperServer.autoStart', false);
        void ClipperServer_1.default.instance().stop();
    }
    enableClipperServer_click() {
        if (!ClipperServer_1.default.instance().enabled())
            return;
        Setting_1.default.setValue('clipperServer.autoStart', true);
        void ClipperServer_1.default.instance().start();
    }
    copyToken_click() {
        electron_1.clipboard.writeText(this.props.apiToken);
        void shim_1.default.showMessageBox((0, locale_1._)('Token has been copied to the clipboard!'), { type: shim_1.MessageBoxType.Info });
    }
    async renewToken_click() {
        if (await shim_1.default.showConfirmationDialog((0, locale_1._)('Are you sure you want to renew the authorisation token?'))) {
            void EncryptionService_1.default.instance()
                .generateApiToken()
                // eslint-disable-next-line promise/prefer-await-to-then -- Old code before rule was applied
                .then((token) => {
                Setting_1.default.setValue('api.token', token);
            });
        }
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const containerStyle = Object.assign(Object.assign({}, theme.containerStyle), { overflowY: 'scroll', 
            // padding: theme.configScreenPadding,
            backgroundColor: theme.backgroundColor3 });
        const buttonStyle = Object.assign(Object.assign({}, theme.buttonStyle), { marginRight: 10 });
        const stepBoxStyle = {
            border: '1px solid',
            borderColor: theme.dividerColor,
            padding: 15,
            paddingTop: 0,
            marginBottom: 15,
            backgroundColor: theme.backgroundColor,
        };
        const tokenStyle = {
            fontFamily: 'monospace',
        };
        const webClipperStatusComps = [];
        const clipperEnabled = ClipperServer_1.default.instance().enabled();
        if (this.props.clipperServerAutoStart) {
            webClipperStatusComps.push(React.createElement("p", { key: "text_1", style: theme.textStyle },
                React.createElement("b", null, (0, locale_1._)('The web clipper service is enabled and set to auto-start.'))));
            if (this.props.clipperServer.startState === 'started') {
                webClipperStatusComps.push(React.createElement("p", { key: "text_2", style: theme.textStyle }, (0, locale_1._)('Status: Started on port %d', this.props.clipperServer.port)));
            }
            else {
                webClipperStatusComps.push(React.createElement("p", { key: "text_3", style: theme.textStyle }, (0, locale_1._)('Status: %s', this.props.clipperServer.startState)));
            }
            webClipperStatusComps.push(React.createElement("button", { key: "disable_button", style: buttonStyle, onClick: this.disableClipperServer_click }, (0, locale_1._)('Disable Web Clipper Service')));
        }
        else {
            if (!clipperEnabled) {
                webClipperStatusComps.push(React.createElement("p", { key: "text_4", style: theme.textStyle }, (0, locale_1._)('The web clipper service cannot be enabled in this instance of Joplin.')));
            }
            else {
                webClipperStatusComps.push(React.createElement("p", { key: "text_4", style: theme.textStyle }, (0, locale_1._)('The web clipper service is not enabled.')));
            }
            webClipperStatusComps.push(React.createElement("button", { key: "enable_button", style: buttonStyle, onClick: this.enableClipperServer_click, disabled: !clipperEnabled }, (0, locale_1._)('Enable Web Clipper Service')));
        }
        const apiTokenStyle = Object.assign(Object.assign({}, theme.textStyle), { color: theme.colorFaded, wordBreak: 'break-all', paddingTop: 10, paddingBottom: 10 });
        return (React.createElement("div", null,
            React.createElement("div", { style: containerStyle },
                React.createElement("div", null,
                    React.createElement("p", { style: Object.assign(Object.assign({}, theme.textStyle), { marginTop: 0 }) }, (0, locale_1._)('Joplin Web Clipper allows saving web pages and screenshots from your browser to Joplin.')),
                    React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('In order to use the web clipper, you need to do the following:')),
                    React.createElement("div", { style: stepBoxStyle },
                        React.createElement("p", { style: theme.h1Style }, (0, locale_1._)('Step 1: Enable the clipper service')),
                        React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('This service allows the browser extension to communicate with Joplin. When enabling it your firewall may ask you to give permission to Joplin to listen to a particular port.')),
                        React.createElement("div", null, webClipperStatusComps)),
                    React.createElement("div", { style: stepBoxStyle },
                        React.createElement("p", { style: theme.h1Style }, (0, locale_1._)('Step 2: Install the extension')),
                        React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('Download and install the relevant extension for your browser:')),
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'row' } },
                            React.createElement(ExtensionBadge_1.default, { themeId: this.props.themeId, type: "firefox", url: "https://addons.mozilla.org/en-US/firefox/addon/joplin-web-clipper/" }),
                            React.createElement(ExtensionBadge_1.default, { style: { marginLeft: 10 }, themeId: this.props.themeId, type: "chrome", url: "https://chrome.google.com/webstore/detail/joplin-web-clipper/alofnhikmmkdbbbgpnglcpdollgjjfek" }))),
                    React.createElement("div", { style: stepBoxStyle },
                        React.createElement("p", { style: theme.h1Style }, (0, locale_1._)('Advanced options')),
                        React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('Authorisation token:')),
                        React.createElement("p", { style: apiTokenStyle },
                            React.createElement("span", { style: tokenStyle },
                                this.props.apiToken,
                                ' '),
                            React.createElement("a", { style: theme.urlStyle, href: "#", onClick: this.copyToken_click }, (0, locale_1._)('Copy token'))),
                        React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('This authorisation token is only needed to allow third-party applications to access Joplin.')),
                        React.createElement("div", null,
                            React.createElement("button", { key: "renew_button", style: buttonStyle, onClick: this.renewToken_click }, (0, locale_1._)('Renew token'))))))));
    }
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
        clipperServer: state.clipperServer,
        clipperServerAutoStart: state.settings['clipperServer.autoStart'],
        apiToken: state.settings['api.token'],
    };
};
const ClipperConfigScreen = (0, react_redux_1.connect)(mapStateToProps)(ClipperConfigScreenComponent);
exports.default = ClipperConfigScreen;
//# sourceMappingURL=ClipperConfigScreen.js.map