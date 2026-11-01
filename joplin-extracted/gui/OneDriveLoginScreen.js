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
const react_redux_1 = require("react-redux");
const registry_1 = require("@joplin/lib/registry");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const bridge_1 = __importDefault(require("../services/bridge"));
const theme_1 = require("@joplin/lib/theme");
const onedrive_api_node_utils_1 = require("@joplin/lib/onedrive-api-node-utils");
class OneDriveLoginScreenComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authLog: [],
        };
    }
    async componentDidMount() {
        const log = (s) => {
            this.setState((state) => {
                const authLog = state.authLog.slice();
                authLog.push({ key: (Date.now() + Math.random()).toString(), text: s });
                return { authLog: authLog };
            });
        };
        const syncTargetId = Setting_1.default.value('sync.target');
        const syncTarget = registry_1.reg.syncTarget(syncTargetId);
        const oneDriveApiUtils = new onedrive_api_node_utils_1.OneDriveApiNodeUtils(syncTarget.api());
        const auth = await oneDriveApiUtils.oauthDance({
            log: (s) => log(s),
        });
        Setting_1.default.setValue(`sync.${syncTargetId}.auth`, auth ? JSON.stringify(auth) : null);
        syncTarget.api().setAuth(auth);
        if (!auth) {
            log((0, locale_1._)('Authentication was not completed (did not receive an authentication token).'));
        }
        else {
            void registry_1.reg.scheduleSync(0);
        }
    }
    startUrl() {
        return registry_1.reg.syncTarget().api().authCodeUrl(this.redirectUrl());
    }
    redirectUrl() {
        return registry_1.reg.syncTarget().api().nativeClientRedirectUrl();
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const logComps = [];
        for (const l of this.state.authLog) {
            if (l.text.indexOf('http:') === 0) {
                logComps.push(React.createElement("a", { key: l.key, style: theme.urlStyle, href: "#", onClick: () => { void (0, bridge_1.default)().openExternal(l.text); } }, l.text));
            }
            else {
                logComps.push(React.createElement("p", { key: l.key, style: theme.textStyle }, l.text));
            }
        }
        return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: theme.backgroundColor } },
            React.createElement("div", { style: { padding: theme.configScreenPadding, flex: 1, color: theme.color } }, logComps),
            React.createElement(ButtonBar_1.default, { onCancelClick: () => this.props.dispatch({ type: 'NAV_BACK' }) })));
    }
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(OneDriveLoginScreenComponent);
//# sourceMappingURL=OneDriveLoginScreen.js.map