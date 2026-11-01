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
const ButtonBar_1 = __importDefault(require("./ConfigScreen/ButtonBar"));
const locale_1 = require("@joplin/lib/locale");
const electron_1 = require("electron");
const Button_1 = __importStar(require("./Button/Button"));
const uuid_1 = require("@joplin/lib/uuid");
const joplinCloudUtils_1 = require("@joplin/lib/services/joplinCloudUtils");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const registry_1 = require("@joplin/lib/registry");
const JoplinCloudSignUpCallToAction_1 = __importDefault(require("./JoplinCloudSignUpCallToAction"));
const bridge_1 = __importDefault(require("../services/bridge"));
const logger = Logger_1.default.create('JoplinCloudLoginScreen');
const react_redux_1 = require("react-redux");
const JoplinCloudScreenComponent = (props) => {
    const confirmUrl = (applicationAuthId) => `${props.joplinCloudWebsite}/applications/${applicationAuthId}/confirm`;
    const applicationAuthUrl = (applicationAuthId) => `${props.joplinCloudApi}/api/application_auth/${applicationAuthId}`;
    const [intervalIdentifier, setIntervalIdentifier] = (0, react_1.useState)(undefined);
    const [state, dispatch] = (0, react_1.useReducer)(joplinCloudUtils_1.reducer, joplinCloudUtils_1.defaultState);
    const applicationAuthId = (0, react_1.useMemo)(() => (0, uuid_1.uuidgen)(), []);
    const periodicallyCheckForCredentials = () => {
        if (intervalIdentifier)
            return;
        const interval = setInterval(async () => {
            try {
                const response = await (0, joplinCloudUtils_1.checkIfLoginWasSuccessful)(applicationAuthUrl(applicationAuthId));
                if (response && response.success) {
                    dispatch({ type: 'COMPLETED' });
                    clearInterval(interval);
                    void registry_1.reg.scheduleSync(0);
                }
            }
            catch (error) {
                logger.error(error);
                dispatch({ type: 'ERROR', payload: error.message });
                clearInterval(interval);
            }
        }, 2 * 1000);
        setIntervalIdentifier(interval);
    };
    const onButtonUsed = async () => {
        if (state.next === 'LINK_USED') {
            dispatch({ type: 'LINK_USED' });
        }
        await (0, joplinCloudUtils_1.saveApplicationAuthId)(applicationAuthId);
        periodicallyCheckForCredentials();
    };
    const onAuthorizeClicked = async () => {
        const url = await (0, joplinCloudUtils_1.generateApplicationConfirmUrl)(confirmUrl(applicationAuthId));
        await onButtonUsed();
        void (0, bridge_1.default)().openExternal(url);
    };
    const onCopyToClipboardClicked = async () => {
        const url = await (0, joplinCloudUtils_1.generateApplicationConfirmUrl)(confirmUrl(applicationAuthId));
        await onButtonUsed();
        electron_1.clipboard.writeText(url);
    };
    (0, react_1.useEffect)(() => {
        return () => {
            clearInterval(intervalIdentifier);
        };
    }, [intervalIdentifier]);
    return (React.createElement("div", { className: "login-page" },
        React.createElement("div", { className: "page-container" },
            state.active !== 'COMPLETED' ? (React.createElement(React.Fragment, null,
                React.createElement("p", { className: "text" }, (0, locale_1._)('To allow Joplin to synchronise with Joplin Cloud, please login using this URL:')),
                React.createElement("div", { className: "buttons-container" },
                    React.createElement(Button_1.default, { onClick: onAuthorizeClicked, title: (0, locale_1._)('Authorise'), iconName: 'fa fa-external-link-alt', level: Button_1.ButtonLevel.Primary }),
                    React.createElement(Button_1.default, { onClick: onCopyToClipboardClicked, title: (0, locale_1._)('Copy link to website'), iconName: 'fa fa-clone', level: Button_1.ButtonLevel.Secondary })))) : null,
            React.createElement("p", { className: state.className },
                state.message(),
                state.active === 'ERROR' ? (React.createElement("span", { className: state.className }, state.errorMessage)) : null),
            state.active === 'LINK_USED' ? React.createElement("div", { className: "loading-animation" }) : null,
            state.active !== 'COMPLETED' ? React.createElement(JoplinCloudSignUpCallToAction_1.default, { source: 'desktop-login-screen', withLeadIn: true }) : null),
        React.createElement(ButtonBar_1.default, { onCancelClick: () => props.dispatch({ type: 'NAV_BACK' }) })));
};
const mapStateToProps = (state) => {
    return {
        joplinCloudWebsite: state.settings['sync.10.website'],
        joplinCloudApi: state.settings['sync.10.path'],
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(JoplinCloudScreenComponent);
//# sourceMappingURL=JoplinCloudLoginScreen.js.map