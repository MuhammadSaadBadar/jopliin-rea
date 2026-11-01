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
const ResizableLayout_1 = __importDefault(require("./ResizableLayout/ResizableLayout"));
const findItemByKey_1 = __importDefault(require("./ResizableLayout/utils/findItemByKey"));
const movements_1 = require("./ResizableLayout/utils/movements");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const reducer_1 = require("@joplin/lib/services/plugins/reducer");
const UserWebviewDialog_1 = __importDefault(require("../services/plugins/UserWebviewDialog"));
const WebviewController_1 = require("@joplin/lib/services/plugins/WebviewController");
const reducer_2 = require("@joplin/lib/reducer");
const locale_1 = require("@joplin/lib/locale");
const persist_1 = require("./ResizableLayout/utils/persist");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shouldShowMissingPasswordWarning_1 = __importDefault(require("@joplin/lib/components/shared/config/shouldShowMissingPasswordWarning"));
const immer_1 = require("immer");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const bridge_1 = __importDefault(require("../services/bridge"));
const styled_components_1 = __importDefault(require("styled-components"));
const theme_1 = require("@joplin/lib/theme");
const validateLayout_1 = __importDefault(require("./ResizableLayout/utils/validateLayout"));
const iterateItems_1 = __importDefault(require("./ResizableLayout/utils/iterateItems"));
const removeItem_1 = __importDefault(require("./ResizableLayout/utils/removeItem"));
const EncryptionService_1 = __importDefault(require("@joplin/lib/services/e2ee/EncryptionService"));
const removeKeylessItems_1 = __importDefault(require("./ResizableLayout/utils/removeKeylessItems"));
const syncInfoUtils_1 = require("@joplin/lib/services/synchronizer/syncInfoUtils");
const callbackUrlUtils_1 = require("@joplin/lib/callbackUrlUtils");
const handleCallbackUrl_1 = __importDefault(require("./MainScreen/handleCallbackUrl"));
const utils_1 = require("@joplin/lib/services/e2ee/utils");
const invitationRespond_1 = __importDefault(require("@joplin/lib/services/share/invitationRespond"));
const restart_1 = __importDefault(require("../services/restart"));
const react_redux_1 = require("react-redux");
const TrashNotification_1 = __importDefault(require("./TrashNotification/TrashNotification"));
const UpdateNotification_1 = __importDefault(require("./UpdateNotification/UpdateNotification"));
const PluginNotification_1 = __importDefault(require("./PluginNotification/PluginNotification"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const checkForUpdates_1 = __importStar(require("../checkForUpdates"));
const logger = Logger_1.default.create('MainScreen');
const electron_1 = require("electron");
const layoutKeyToLabel_1 = __importDefault(require("../utils/layout/layoutKeyToLabel"));
const MainLayoutPane_1 = __importDefault(require("./MainLayoutPane"));
const StyledUserWebviewDialogContainer = styled_components_1.default.div `
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	box-sizing: border-box;
`;
const defaultLayout = {
    key: 'root',
    children: [
        { key: 'sideBar', width: 250 },
        { key: 'noteList', width: 250 },
        { key: 'editor', flexible: true },
        { key: 'chatPanel', width: 340, visible: false },
    ],
};
class MainScreenComponent extends React.Component {
    constructor(props) {
        super(props);
        this.layoutKeyToLabel = (key) => {
            return (0, layoutKeyToLabel_1.default)(key, this.props.plugins);
        };
        this.state = {
            promptOptions: null,
            notePropertiesDialogOptions: {},
            noteContentPropertiesDialogOptions: {},
            shareNoteDialogOptions: {},
            shareFolderDialogOptions: {
                visible: false,
                folderId: '',
            },
            syncTargetAppMinVersionIsRelease: null,
            didSyncTargetAppMinVersionReleaseLoadFail: false,
        };
        this.updateMainLayout(this.buildLayout(props.plugins));
        this.setupAppCloseHandling();
        this.resizableLayout_resize = this.resizableLayout_resize.bind(this);
        this.resizableLayout_renderItem = this.resizableLayout_renderItem.bind(this);
        this.resizableLayout_moveButtonClick = this.resizableLayout_moveButtonClick.bind(this);
        this.window_resize = this.window_resize.bind(this);
        this.rowHeight = this.rowHeight.bind(this);
        this.layoutModeListenerKeyDown = this.layoutModeListenerKeyDown.bind(this);
        window.addEventListener('resize', this.window_resize);
        electron_1.ipcRenderer.on('asynchronous-message', (_event, message, args) => {
            if (message === 'openCallbackUrl') {
                void this.openCallbackUrl(args.url);
            }
        });
        const initialCallbackUrl = (0, bridge_1.default)().electronApp().initialCallbackUrl();
        if (initialCallbackUrl) {
            void this.openCallbackUrl(initialCallbackUrl);
        }
    }
    async openCallbackUrl(url) {
        try {
            if (!(0, callbackUrlUtils_1.isCallbackUrl)(url))
                throw new Error(`Invalid callback URL: ${url}`);
            await (0, handleCallbackUrl_1.default)(url);
        }
        catch (error) {
            logger.error('Error handling callback URL:', error);
        }
    }
    updateLayoutPluginViews(layout, plugins) {
        const infos = reducer_1.utils.viewInfosByType(plugins, 'webview');
        let newLayout = (0, immer_1.produce)(layout, (draftLayout) => {
            for (const info of infos) {
                if (info.view.containerType !== WebviewController_1.ContainerType.Panel)
                    continue;
                const viewId = info.view.id;
                const existingItem = (0, findItemByKey_1.default)(draftLayout, viewId);
                if (!existingItem) {
                    draftLayout.children.push({
                        key: viewId,
                        visible: info.view.opened,
                        context: {
                            pluginId: info.plugin.id,
                        },
                    });
                }
            }
        });
        // Remove layout items that belong to plugins that are no longer
        // active.
        const pluginIds = Object.keys(plugins);
        const itemsToRemove = [];
        (0, iterateItems_1.default)(newLayout, (_itemIndex, item, _parent) => {
            if (item.context && item.context.pluginId && !pluginIds.includes(item.context.pluginId)) {
                itemsToRemove.push(item.key);
            }
            return true;
        });
        for (const itemKey of itemsToRemove) {
            newLayout = (0, removeItem_1.default)(newLayout, itemKey);
        }
        return newLayout !== layout ? (0, validateLayout_1.default)(newLayout) : layout;
    }
    showShareInvitationNotification(props) {
        if (props.processingShareInvitationResponse)
            return false;
        return !!props.shareInvitations.find(i => i.status === 0);
    }
    buildLayout(plugins) {
        const rootLayoutSize = this.rootLayoutSize();
        let userLayout = Setting_1.default.value('ui.layout');
        let output = null;
        try {
            // Migration: stamp the flexible flag on the editor and clear any
            // stale width before validateLayout's first pass.
            if (userLayout && Object.keys(userLayout).length) {
                userLayout = (0, immer_1.produce)(userLayout, (draft) => {
                    const editor = (0, findItemByKey_1.default)(draft, 'editor');
                    if (editor && !editor.flexible) {
                        editor.flexible = true;
                        delete editor.width;
                    }
                });
            }
            output = (0, persist_1.loadLayout)(Object.keys(userLayout).length ? userLayout : null, defaultLayout, rootLayoutSize);
            // For unclear reasons, layout items sometimes end up without a key.
            // In that case, we can't do anything with them, so remove them
            // here. It could be due to the deprecated plugin API, which allowed
            // creating panel without a key, although in this case it should
            // have been set automatically.
            // https://github.com/laurent22/joplin/issues/4926
            output = (0, removeKeylessItems_1.default)(output);
            if (!(0, findItemByKey_1.default)(output, 'sideBar') || !(0, findItemByKey_1.default)(output, 'noteList') || !(0, findItemByKey_1.default)(output, 'editor')) {
                throw new Error('"sideBar", "noteList" and "editor" must be present in the layout');
            }
            // Migration: existing users have layouts saved before chatPanel
            // existed. Add it (hidden) so the toggle works.
            if (!(0, findItemByKey_1.default)(output, 'chatPanel')) {
                output = (0, immer_1.produce)(output, (draft) => {
                    draft.children.push({ key: 'chatPanel', width: 340, visible: false });
                });
            }
        }
        catch (error) {
            console.warn('Could not load layout - restoring default layout:', error);
            console.warn('Layout was:', userLayout);
            output = (0, persist_1.loadLayout)(null, defaultLayout, rootLayoutSize);
        }
        return this.updateLayoutPluginViews(output, plugins);
    }
    window_resize() {
        this.updateRootLayoutSize();
    }
    setupAppCloseHandling() {
        this.waitForNotesSavedIID_ = null;
        // This event is dispatched from the main process when the app is about
        // to close. The renderer process must respond with the "appCloseReply"
        // and tell the main process whether the app can really be closed or not.
        // For example, it cannot be closed right away if a note is being saved.
        // If a note is being saved, we wait till it is saved and then call
        // "appCloseReply" again.
        electron_1.ipcRenderer.on('appClose', async () => {
            logger.info('[appClose] Received appClose event - hasNotesBeingSaved:', this.props.hasNotesBeingSaved);
            if (this.waitForNotesSavedIID_)
                shim_1.default.clearInterval(this.waitForNotesSavedIID_);
            this.waitForNotesSavedIID_ = null;
            const sendCanClose = async (canClose) => {
                logger.info('[appClose] Sending appCloseReply - canClose:', canClose);
                if (canClose) {
                    Setting_1.default.setValue('wasClosedSuccessfully', true);
                    await Setting_1.default.saveAll();
                }
                electron_1.ipcRenderer.send('asynchronous-message', 'appCloseReply', { canClose });
            };
            await sendCanClose(!this.props.hasNotesBeingSaved);
            if (this.props.hasNotesBeingSaved) {
                logger.info('[appClose] Notes are being saved, waiting...');
                this.waitForNotesSavedIID_ = shim_1.default.setInterval(() => {
                    if (!this.props.hasNotesBeingSaved) {
                        logger.info('[appClose] Notes saved, now sending canClose: true');
                        shim_1.default.clearInterval(this.waitForNotesSavedIID_);
                        this.waitForNotesSavedIID_ = null;
                        void sendCanClose(true);
                    }
                }, 50);
            }
        });
    }
    updateMainLayout(layout) {
        this.props.dispatch({
            type: 'MAIN_LAYOUT_SET',
            value: layout,
        });
    }
    updateRootLayoutSize() {
        this.updateMainLayout((0, immer_1.produce)(this.props.mainLayout, (draft) => {
            const s = this.rootLayoutSize();
            draft.width = s.width;
            draft.height = s.height;
        }));
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.style.width !== this.props.style.width ||
            prevProps.style.height !== this.props.style.height ||
            this.messageBoxVisible(prevProps) !== this.messageBoxVisible(this.props)) {
            this.updateRootLayoutSize();
        }
        if (prevProps.plugins !== this.props.plugins) {
            this.updateMainLayout(this.updateLayoutPluginViews(this.props.mainLayout, this.props.plugins));
            // this.setState({ layout: this.buildLayout(this.props.plugins) });
        }
        if (this.props.mainLayout !== prevProps.mainLayout) {
            const toSave = (0, persist_1.saveLayout)(this.props.mainLayout);
            Setting_1.default.setValue('ui.layout', toSave);
        }
        if (prevState.promptOptions !== this.state.promptOptions) {
            this.props.dispatch({
                type: !prevState.promptOptions ? 'VISIBLE_DIALOGS_ADD' : 'VISIBLE_DIALOGS_REMOVE',
                name: 'promptDialog',
            });
        }
        if (this.props.isResettingLayout) {
            Setting_1.default.setValue('ui.layout', null);
            this.updateMainLayout(this.buildLayout(this.props.plugins));
            this.props.dispatch({
                type: 'RESET_LAYOUT',
                value: false,
            });
        }
        if (this.props.mustUpgradeAppMessage !== prevProps.mustUpgradeAppMessage ||
            this.props.syncTargetAppMinVersion !== prevProps.syncTargetAppMinVersion) {
            void this.loadSyncTargetAppMinVersionIsRelease();
        }
    }
    layoutModeListenerKeyDown(event) {
        if (event.key !== 'Escape')
            return;
        if (!this.props.layoutMoveMode)
            return;
        void CommandService_1.default.instance().execute('toggleLayoutMoveMode');
    }
    componentDidMount() {
        window.addEventListener('keydown', this.layoutModeListenerKeyDown);
        void this.loadSyncTargetAppMinVersionIsRelease();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.window_resize);
        window.removeEventListener('keydown', this.layoutModeListenerKeyDown);
    }
    async loadSyncTargetAppMinVersionIsRelease() {
        const version = this.props.syncTargetAppMinVersion;
        this.setState({
            syncTargetAppMinVersionIsRelease: null,
            didSyncTargetAppMinVersionReleaseLoadFail: false,
        });
        if (!this.props.mustUpgradeAppMessage || !version)
            return;
        try {
            const syncTargetAppMinVersionIsRelease = await (0, checkForUpdates_1.isReleaseVersion)(version);
            if (!this.props.mustUpgradeAppMessage || this.props.syncTargetAppMinVersion !== version)
                return;
            this.setState({
                syncTargetAppMinVersionIsRelease,
                didSyncTargetAppMinVersionReleaseLoadFail: syncTargetAppMinVersionIsRelease === null,
            });
        }
        catch (error) {
            logger.error(error);
            if (!this.props.mustUpgradeAppMessage || this.props.syncTargetAppMinVersion !== version)
                return;
            this.setState({ didSyncTargetAppMinVersionReleaseLoadFail: true });
        }
    }
    rootLayoutSize() {
        return {
            width: window.innerWidth,
            height: this.rowHeight(),
        };
    }
    rowHeight() {
        if (!this.props)
            return 0;
        return this.props.style.height - (this.messageBoxVisible() ? this.messageBoxHeight() : 0);
    }
    messageBoxHeight() {
        return 50;
    }
    styles(themeId, width, height, messageBoxVisible) {
        const styleKey = [themeId, width, height, messageBoxVisible].join('_');
        if (styleKey === this.styleKey_)
            return this.styles_;
        const theme = (0, theme_1.themeStyle)(themeId);
        this.styleKey_ = styleKey;
        this.styles_ = {};
        this.styles_.header = {
            width: width,
        };
        this.styles_.messageBox = {
            width: width,
            height: this.messageBoxHeight(),
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 10,
            backgroundColor: theme.warningBackgroundColor,
        };
        const rowHeight = height - (messageBoxVisible ? this.styles_.messageBox.height : 0);
        this.styles_.rowHeight = rowHeight;
        this.styles_.resizableLayout = {
            height: rowHeight,
        };
        this.styles_.prompt = {
            width: width,
            height: height,
        };
        return this.styles_;
    }
    renderNotificationMessage(message, callForAction = null, callForActionHandler = null, callForAction2 = null, callForActionHandler2 = null) {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const urlStyle = { color: theme.colorWarnUrl, textDecoration: 'underline' };
        if (!callForAction)
            return React.createElement("span", null, message);
        const cfa = (React.createElement("a", { href: "#", style: urlStyle, onClick: () => callForActionHandler() }, callForAction));
        const cfa2 = !callForAction2 ? null : (React.createElement("a", { href: "#", style: urlStyle, onClick: () => callForActionHandler2() }, callForAction2));
        if (!callForAction2 && message.includes(callForAction)) {
            const actionIndex = message.indexOf(callForAction);
            return (React.createElement("span", null,
                message.substring(0, actionIndex),
                cfa,
                message.substring(actionIndex + callForAction.length)));
        }
        return (React.createElement("span", null,
            message,
            callForAction ? ' ' : '',
            cfa,
            callForAction2 ? ' / ' : '',
            cfa2));
    }
    renderNotification(theme, styles) {
        if (!this.messageBoxVisible())
            return null;
        const onViewStatusScreen = () => {
            this.props.dispatch({
                type: 'NAV_GO',
                routeName: 'Status',
            });
        };
        const onViewEncryptionConfigScreen = () => {
            this.props.dispatch({
                type: 'NAV_GO',
                routeName: 'Config',
                props: {
                    defaultSection: 'encryption',
                },
            });
        };
        const onViewJoplinCloudLoginScreen = () => {
            this.props.dispatch({
                type: 'NAV_GO',
                routeName: 'JoplinCloudLogin',
            });
        };
        const onDisableSync = () => {
            Setting_1.default.setValue('sync.target', null);
        };
        const onViewSyncSettingsScreen = () => {
            this.props.dispatch({
                type: 'NAV_GO',
                routeName: 'Config',
                props: {
                    defaultSection: 'sync',
                },
            });
        };
        const onDownloadAppleSiliconVersion = () => {
            // The website should redirect to the correct version
            shim_1.default.openUrl('https://joplinapp.org/download/');
        };
        const onCheckForUpdates = () => {
            void (0, checkForUpdates_1.default)(false, (0, bridge_1.default)().mainWindow(), { includePreReleases: false });
        };
        const onRestartAndUpgrade = async () => {
            Setting_1.default.setValue('sync.upgradeState', Setting_1.default.SYNC_UPGRADE_STATE_MUST_DO);
            await Setting_1.default.saveAll();
            await (0, restart_1.default)();
        };
        const onDisableSafeModeAndRestart = async () => {
            Setting_1.default.setValue('isSafeMode', false);
            await Setting_1.default.saveAll();
            await (0, restart_1.default)();
        };
        const onInvitationRespond = async (shareUserId, folderId, masterKey, accept) => {
            await (0, invitationRespond_1.default)(shareUserId, folderId, masterKey, accept);
        };
        let msg = null;
        // When adding something here, don't forget to update the condition in
        // this.messageBoxVisible()
        if (this.props.isSafeMode) {
            msg = this.renderNotificationMessage((0, locale_1._)('Safe mode is currently active. Note rendering and all plugins are temporarily disabled.'), (0, locale_1._)('Disable safe mode and restart'), onDisableSafeModeAndRestart);
        }
        else if (this.props.hasMissingSyncCredentials) {
            msg = this.renderNotificationMessage((0, locale_1._)('The synchronisation password is missing.'), (0, locale_1._)('Set the password'), onViewSyncSettingsScreen);
        }
        else if (this.props.shouldUpgradeSyncTarget) {
            msg = this.renderNotificationMessage((0, locale_1._)('The sync target needs to be upgraded before Joplin can sync. The operation may take a few minutes to complete and the app needs to be restarted. To proceed please click on the link.'), (0, locale_1._)('Restart and upgrade'), onRestartAndUpgrade);
        }
        else if (this.props.hasDisabledEncryptionItems) {
            msg = this.renderNotificationMessage((0, locale_1._)('Some items cannot be decrypted.'), (0, locale_1._)('View them now'), onViewStatusScreen);
        }
        else if (this.props.showNeedUpgradingMasterKeyMessage) {
            msg = this.renderNotificationMessage((0, locale_1._)('One of your master keys use an obsolete encryption method.'), (0, locale_1._)('View them now'), onViewEncryptionConfigScreen);
        }
        else if (this.props.showShouldReencryptMessage) {
            msg = this.renderNotificationMessage((0, locale_1._)('The default encryption method has been changed, you should re-encrypt your data.'), (0, locale_1._)('More info'), onViewEncryptionConfigScreen);
        }
        else if (this.showShareInvitationNotification(this.props)) {
            const invitation = this.props.shareInvitations.find(inv => inv.status === 0);
            const sharer = invitation.share.user;
            msg = this.renderNotificationMessage((0, locale_1._)('%s (%s) would like to share a notebook with you.', sharer.full_name, sharer.email), (0, locale_1._)('Accept'), () => onInvitationRespond(invitation.id, invitation.share.folder_id, invitation.master_key, true), (0, locale_1._)('Reject'), () => onInvitationRespond(invitation.id, invitation.share.folder_id, invitation.master_key, false));
        }
        else if (this.props.hasDisabledSyncItems) {
            msg = this.renderNotificationMessage((0, locale_1._)('Some items cannot be synchronised.'), (0, locale_1._)('View them now'), onViewStatusScreen);
        }
        else if (this.props.showMissingMasterKeyMessage) {
            msg = this.renderNotificationMessage((0, locale_1._)('One or more master keys need a password.'), (0, locale_1._)('Set the password'), onViewEncryptionConfigScreen);
        }
        else if (this.props.mustUpgradeAppMessage) {
            if (!this.props.syncTargetAppMinVersion) {
                msg = this.renderNotificationMessage(this.props.mustUpgradeAppMessage);
            }
            else if (this.state.didSyncTargetAppMinVersionReleaseLoadFail) {
                msg = this.renderNotificationMessage((0, locale_1._)('In order to synchronise, Please upgrade your application to version %s. Joplin could not check update information.', this.props.syncTargetAppMinVersion));
            }
            else if (this.state.syncTargetAppMinVersionIsRelease === false && shim_1.default.isLinux()) {
                const callForAction = (0, locale_1._)('Download it from GitHub Releases');
                msg = this.renderNotificationMessage((0, locale_1._)('In order to synchronise, Please upgrade your application to version %s: %s or update it using your package manager', this.props.syncTargetAppMinVersion, callForAction), callForAction, () => shim_1.default.openUrl('https://github.com/laurent22/joplin/releases'));
            }
            else if (this.state.syncTargetAppMinVersionIsRelease !== null) {
                const isTargetPreRelease = this.state.syncTargetAppMinVersionIsRelease === false;
                const callForAction = isTargetPreRelease ? (0, locale_1._)('Download it from GitHub Releases') : (0, locale_1._)('Check for updates');
                msg = this.renderNotificationMessage((0, locale_1._)('In order to synchronise, Please upgrade your application to version %s: %s', this.props.syncTargetAppMinVersion, callForAction), callForAction, isTargetPreRelease ? () => shim_1.default.openUrl('https://github.com/laurent22/joplin/releases') : onCheckForUpdates);
            }
            else {
                msg = this.renderNotificationMessage(this.props.mustUpgradeAppMessage);
            }
        }
        else if (this.props.shouldSwitchToAppleSiliconVersion) {
            msg = this.renderNotificationMessage((0, locale_1._)('You are running the Intel version of Joplin on an Apple Silicon processor. Download the Apple Silicon one for better performance.'), (0, locale_1._)('Download it now'), onDownloadAppleSiliconVersion);
        }
        else if (this.props.showInvalidJoplinCloudCredential) {
            msg = this.renderNotificationMessage((0, locale_1._)('Your Joplin Cloud credentials are invalid, please login.'), (0, locale_1._)('Login to Joplin Cloud.'), onViewJoplinCloudLoginScreen, (0, locale_1._)('Disable synchronisation'), onDisableSync);
        }
        return (React.createElement("div", { style: styles.messageBox },
            React.createElement("span", { style: theme.textStyle, role: 'alert', "aria-live": 'polite' }, msg)));
    }
    messageBoxVisible(props = null) {
        if (!props)
            props = this.props;
        return props.hasDisabledSyncItems ||
            props.showMissingMasterKeyMessage ||
            props.hasMissingSyncCredentials ||
            props.showNeedUpgradingMasterKeyMessage ||
            props.showShouldReencryptMessage ||
            props.hasDisabledEncryptionItems ||
            this.props.shouldUpgradeSyncTarget ||
            props.isSafeMode ||
            this.showShareInvitationNotification(props) ||
            this.props.needApiAuth ||
            !!this.props.mustUpgradeAppMessage ||
            props.showInvalidJoplinCloudCredential ||
            props.shouldSwitchToAppleSiliconVersion;
    }
    resizableLayout_resize(event) {
        this.updateMainLayout(event.layout);
    }
    resizableLayout_moveButtonClick(event) {
        const newLayout = (0, movements_1.move)(this.props.mainLayout, event.itemKey, event.direction);
        this.updateMainLayout(newLayout);
    }
    resizableLayout_renderItem(key, event) {
        return React.createElement(MainLayoutPane_1.default, { key: key, contentKey: key, event: event, windowId: reducer_2.defaultWindowId, onUpdateLayout: this.updateMainLayout, layout: this.props.mainLayout });
    }
    renderPluginDialogs() {
        var _a, _b;
        const output = [];
        const infos = reducer_1.utils.viewInfosByType(this.props.plugins, 'webview');
        for (const info of infos) {
            const { plugin, view } = info;
            if (view.containerType !== WebviewController_1.ContainerType.Dialog)
                continue;
            if (!view.opened)
                continue;
            const html = (_b = (_a = this.props.pluginHtmlContents[plugin.id]) === null || _a === void 0 ? void 0 : _a[view.id]) !== null && _b !== void 0 ? _b : '';
            output.push(React.createElement(UserWebviewDialog_1.default, { key: view.id, viewId: view.id, themeId: this.props.themeId, html: html, scripts: view.scripts, pluginId: plugin.id, buttons: view.buttons, fitToContent: view.fitToContent }));
        }
        if (!output.length)
            return null;
        return (React.createElement(StyledUserWebviewDialogContainer, null, output));
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const style = Object.assign({ color: theme.color, backgroundColor: theme.backgroundColor }, this.props.style);
        const styles = this.styles(this.props.themeId, style.width, style.height, this.messageBoxVisible());
        const messageComp = this.renderNotification(theme, styles);
        const layoutComp = this.props.mainLayout ? (React.createElement(ResizableLayout_1.default, { height: styles.rowHeight, layout: this.props.mainLayout, onResize: this.resizableLayout_resize, onMoveButtonClick: this.resizableLayout_moveButtonClick, renderItem: this.resizableLayout_renderItem, layoutKeyToLabel: this.layoutKeyToLabel, moveMode: this.props.layoutMoveMode, moveModeMessage: (0, locale_1._)('Use the arrows to move the layout items. Press "Escape" to exit.') })) : null;
        return (React.createElement("div", { style: style },
            React.createElement(TrashNotification_1.default, { lastDeletion: this.props.lastDeletion, lastDeletionNotificationTime: this.props.lastDeletionNotificationTime, themeId: this.props.themeId, dispatch: this.props.dispatch }),
            React.createElement(UpdateNotification_1.default, null),
            React.createElement(PluginNotification_1.default, { themeId: this.props.themeId, toast: this.props.toast }),
            messageComp,
            layoutComp));
    }
}
const mapStateToProps = (state) => {
    const syncInfo = (0, syncInfoUtils_1.localSyncInfoFromState)(state);
    const showNeedUpgradingEnabledMasterKeyMessage = !!EncryptionService_1.default.instance().masterKeysThatNeedUpgrading(syncInfo.masterKeys.filter((k) => !!k.enabled)).length;
    return {
        themeId: state.settings.theme,
        hasDisabledSyncItems: state.hasDisabledSyncItems,
        hasDisabledEncryptionItems: state.hasDisabledEncryptionItems,
        showMissingMasterKeyMessage: (0, utils_1.showMissingMasterKeyMessage)(syncInfo, state.notLoadedMasterKeys),
        showNeedUpgradingMasterKeyMessage: showNeedUpgradingEnabledMasterKeyMessage,
        showShouldReencryptMessage: state.settings['encryption.shouldReencrypt'] >= Setting_1.default.SHOULD_REENCRYPT_YES,
        shouldUpgradeSyncTarget: state.settings['sync.upgradeState'] === Setting_1.default.SYNC_UPGRADE_STATE_SHOULD_DO,
        hasMissingSyncCredentials: (0, shouldShowMissingPasswordWarning_1.default)(state.settings['sync.target'], state.settings),
        plugins: state.pluginService.plugins,
        pluginHtmlContents: state.pluginService.pluginHtmlContents,
        hasNotesBeingSaved: reducer_2.stateUtils.hasNotesBeingSaved(state),
        layoutMoveMode: state.layoutMoveMode,
        mainLayout: state.mainLayout,
        shareInvitations: state.shareService.shareInvitations,
        processingShareInvitationResponse: state.shareService.processingShareInvitationResponse,
        isSafeMode: state.settings.isSafeMode,
        enableLegacyMarkdownEditor: state.settings['editor.legacyMarkdown'],
        needApiAuth: state.needApiAuth,
        isResettingLayout: state.isResettingLayout,
        lastDeletion: state.lastDeletion,
        lastDeletionNotificationTime: state.lastDeletionNotificationTime,
        mustUpgradeAppMessage: state.mustUpgradeAppMessage,
        syncTargetAppMinVersion: state.mustUpgradeAppMinVersion,
        showInvalidJoplinCloudCredential: state.settings['sync.target'] === 10 && state.mustAuthenticate,
        toast: state.toast,
        shouldSwitchToAppleSiliconVersion: shim_1.default.isAppleSilicon() && shim_1.default.isMac() && process.arch !== 'arm64',
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(MainScreenComponent);
//# sourceMappingURL=MainScreen.js.map