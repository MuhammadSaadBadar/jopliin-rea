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
const app_1 = __importDefault(require("../app"));
const MainScreen_1 = __importDefault(require("./MainScreen"));
const ConfigScreen_1 = __importDefault(require("./ConfigScreen/ConfigScreen"));
const StatusScreen_1 = __importDefault(require("./StatusScreen/StatusScreen"));
const OneDriveLoginScreen_1 = __importDefault(require("./OneDriveLoginScreen"));
const DropboxLoginScreen_1 = __importDefault(require("./DropboxLoginScreen"));
const ErrorBoundary_1 = __importDefault(require("./ErrorBoundary"));
const theme_1 = require("@joplin/lib/theme");
const MenuBar_1 = __importDefault(require("./MenuBar"));
const locale_1 = require("@joplin/lib/locale");
const client_1 = require("react-dom/client");
const react_redux_1 = require("react-redux");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const ClipperServer_1 = __importDefault(require("@joplin/lib/ClipperServer"));
const DialogTitle_1 = __importDefault(require("./DialogTitle"));
const DialogButtonRow_1 = __importDefault(require("./DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const StyleSheetContainer_1 = __importDefault(require("./StyleSheets/StyleSheetContainer"));
const ImportScreen_1 = __importDefault(require("./ImportScreen"));
const ResourceScreen_1 = __importDefault(require("./ResourceScreen"));
const ProfileEditor_1 = __importDefault(require("./ProfileEditor"));
const Navigator_1 = __importDefault(require("./Navigator"));
const WelcomeUtils_1 = __importDefault(require("@joplin/lib/WelcomeUtils"));
const JoplinCloudLoginScreen_1 = __importDefault(require("./JoplinCloudLoginScreen"));
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const WindowCommandsAndDialogs_1 = __importDefault(require("./WindowCommandsAndDialogs/WindowCommandsAndDialogs"));
const reducer_1 = require("@joplin/lib/reducer");
const EditorWindow_1 = __importDefault(require("./NoteEditor/EditorWindow"));
const SsoLoginScreen_1 = __importDefault(require("./SsoLoginScreen/SsoLoginScreen"));
const SamlShared_1 = __importDefault(require("@joplin/lib/components/shared/SamlShared"));
const PopupNotificationProvider_1 = __importDefault(require("./PopupNotification/PopupNotificationProvider"));
const styled_components_1 = require("styled-components");
const QuitSyncDialog_1 = __importDefault(require("./QuitSyncDialog"));
const GlobalStyle = (0, styled_components_1.createGlobalStyle) `
	* {
		box-sizing: border-box;
	}
`;
const navigatorStyle = { width: '100vw', height: '100vh' };
async function initialize() {
    store.dispatch({
        type: 'EDITOR_CODE_VIEW_CHANGE',
        value: Setting_1.default.value('editor.codeView'),
    });
    store.dispatch({
        type: 'NOTE_VISIBLE_PANES_SET',
        panes: Setting_1.default.value('noteVisiblePanes'),
    });
    InteropService_1.default.instance().domParser = new DOMParser();
    InteropService_1.default.instance().xmlSerializer = new XMLSerializer();
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old class component with implicit state shape; tightening requires structural change to the screen
class RootComponent extends React.Component {
    async componentDidMount() {
        if (this.props.appState === 'starting') {
            this.props.dispatch({
                type: 'APP_STATE_SET',
                state: 'initializing',
            });
            await initialize();
            this.props.dispatch({
                type: 'APP_STATE_SET',
                state: 'ready',
            });
        }
        await WelcomeUtils_1.default.install(Setting_1.default.value('locale'), this.props.dispatch);
    }
    renderModalMessage(props) {
        if (!props)
            return null;
        const renderContent = () => {
            return (React.createElement("div", null,
                React.createElement(DialogTitle_1.default, { title: (0, locale_1._)('Confirmation') }),
                React.createElement("p", null, props.message),
                React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: props.onClick, okButtonShow: false, cancelButtonShow: false, customButtons: props.buttonSpecs })));
        };
        return React.createElement(Dialog_1.default, null, renderContent());
    }
    modalDialogProps() {
        if (!this.props.needApiAuth)
            return null;
        let message = '';
        const buttonSpecs = [];
        let onClick = null;
        if (this.props.needApiAuth) {
            message = (0, locale_1._)('The Web Clipper needs your authorisation to access your data.');
            buttonSpecs.push({ name: 'ok', label: (0, locale_1._)('Grant authorisation') });
            buttonSpecs.push({ name: 'cancel', label: (0, locale_1._)('Reject') });
            onClick = (event) => {
                ClipperServer_1.default.instance().api.acceptAuthToken(event.buttonName === 'ok');
            };
        }
        else {
            return null;
        }
        return {
            themeId: this.props.themeId,
            buttonSpecs,
            message,
            onClick,
        };
    }
    renderSecondaryWindows() {
        return this.props.secondaryWindowStates.map((windowState) => {
            return React.createElement(EditorWindow_1.default, { key: `new-window-note-${windowState.windowId}`, windowId: windowState.windowId, newWindow: true });
        });
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const screens = {
            Main: { screen: MainScreen_1.default },
            OneDriveLogin: { screen: OneDriveLoginScreen_1.default, title: () => (0, locale_1._)('OneDrive Login') },
            DropboxLogin: { screen: DropboxLoginScreen_1.default, title: () => (0, locale_1._)('Dropbox Login') },
            JoplinCloudLogin: { screen: JoplinCloudLoginScreen_1.default, title: () => (0, locale_1._)('Joplin Cloud Login') },
            JoplinServerSamlLogin: { screen: (0, SsoLoginScreen_1.default)(new SamlShared_1.default()), title: () => (0, locale_1._)('Joplin Server Login') },
            Import: { screen: ImportScreen_1.default, title: () => (0, locale_1._)('Import') },
            Config: { screen: ConfigScreen_1.default, title: () => (0, locale_1._)('Options') },
            Resources: { screen: ResourceScreen_1.default, title: () => (0, locale_1._)('Note attachments') },
            ProfileEditor: { screen: ProfileEditor_1.default, title: () => (0, locale_1._)('Manage profiles') },
            Status: { screen: StatusScreen_1.default, title: () => (0, locale_1._)('Synchronisation Status') },
        };
        return (React.createElement(styled_components_1.StyleSheetManager, { disableVendorPrefixes: true },
            React.createElement(styled_components_1.ThemeProvider, { theme: theme },
                React.createElement(PopupNotificationProvider_1.default, null,
                    React.createElement(StyleSheetContainer_1.default, null),
                    React.createElement(MenuBar_1.default, null),
                    React.createElement(GlobalStyle, null),
                    React.createElement(WindowCommandsAndDialogs_1.default, { windowId: reducer_1.defaultWindowId }),
                    React.createElement(QuitSyncDialog_1.default, { themeId: this.props.themeId }),
                    React.createElement(Navigator_1.default, { style: navigatorStyle, screens: screens, className: `profile-${this.props.profileConfigCurrentProfileId}` }),
                    this.renderSecondaryWindows(),
                    this.renderModalMessage(this.modalDialogProps())))));
    }
}
const mapStateToProps = (state) => {
    return {
        zoomFactor: state.settings.windowContentZoomFactor / 100,
        appState: state.appState,
        themeId: state.settings.theme,
        needApiAuth: state.needApiAuth,
        dialogs: state.dialogs,
        profileConfigCurrentProfileId: state.profileConfig.currentProfileId,
        secondaryWindowStates: reducer_1.stateUtils.secondaryWindowStates(state),
    };
};
const Root = (0, react_redux_1.connect)(mapStateToProps)(RootComponent);
const store = (0, app_1.default)().store();
const root = (0, client_1.createRoot)(document.getElementById('react-root'));
root.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(ErrorBoundary_1.default, null,
        React.createElement(Root, null))));
//# sourceMappingURL=Root.js.map