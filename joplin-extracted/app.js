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
const index_1 = __importDefault(require("@joplin/lib/services/ResourceEditWatcher/index"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const reducer_1 = __importStar(require("@joplin/lib/services/ResourceEditWatcher/reducer"));
const PluginRunner_1 = __importDefault(require("./services/plugins/PluginRunner"));
const PlatformImplementation_1 = __importDefault(require("./services/plugins/PlatformImplementation"));
const shim = require('@joplin/lib/shim').default;
const AlarmService_1 = __importDefault(require("@joplin/lib/services/AlarmService"));
const AlarmServiceDriverNode_1 = __importDefault(require("@joplin/lib/services/AlarmServiceDriverNode"));
const Logger_1 = __importStar(require("@joplin/utils/Logger"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const actionApi_desktop_1 = __importDefault(require("@joplin/lib/services/rest/actionApi.desktop"));
const BaseApplication_1 = __importDefault(require("@joplin/lib/BaseApplication"));
const DebugService_1 = __importDefault(require("@joplin/lib/debug/DebugService"));
const locale_1 = require("@joplin/lib/locale");
const SpellCheckerService_1 = __importDefault(require("@joplin/lib/services/spellChecker/SpellCheckerService"));
const SpellCheckerServiceDriverNative_1 = __importDefault(require("./services/spellChecker/SpellCheckerServiceDriverNative"));
const bridge_1 = __importDefault(require("./services/bridge"));
const menuCommandNames_1 = __importDefault(require("./gui/menuCommandNames"));
const ResourceService_1 = __importDefault(require("@joplin/lib/services/ResourceService"));
const ExternalEditWatcher_1 = __importDefault(require("@joplin/lib/services/ExternalEditWatcher"));
const app_reducer_1 = __importStar(require("./app.reducer"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const registry_1 = require("@joplin/lib/registry");
const packageInfo = require('./packageInfo.js');
const DecryptionWorker_1 = __importDefault(require("@joplin/lib/services/DecryptionWorker"));
const ClipperServer_1 = __importDefault(require("@joplin/lib/ClipperServer"));
const electron_1 = require("electron");
const Menu = (0, bridge_1.default)().Menu;
const PluginManager_1 = __importDefault(require("@joplin/lib/services/PluginManager"));
const RevisionService_1 = __importDefault(require("@joplin/lib/services/RevisionService"));
const MigrationService_1 = __importDefault(require("@joplin/lib/services/MigrationService"));
const CssUtils_1 = require("@joplin/lib/CssUtils");
const os_1 = require("os");
const desktopDefaultPluginsInfo_1 = __importDefault(require("@joplin/lib/services/plugins/defaultPlugins/desktopDefaultPluginsInfo"));
const electronContextMenu = require('./services/electron-context-menu');
// import  populateDatabase from '@joplin/lib/services/debug/populateDatabase';
// Commands that are not tied to any particular component.
// The runtime for these commands can be loaded when the app starts.
const PerFolderSortOrderService_1 = __importDefault(require("@joplin/lib/services/sortOrder/PerFolderSortOrderService"));
const ShareService_1 = __importDefault(require("@joplin/lib/services/share/ShareService"));
const checkForUpdates_1 = __importDefault(require("./checkForUpdates"));
const syncDebugLog_1 = __importDefault(require("@joplin/lib/services/synchronizer/syncDebugLog"));
const joplinCloudUtils_1 = require("@joplin/lib/services/joplinCloudUtils");
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const path = require("path");
const defaultPluginsUtils_1 = require("@joplin/lib/services/plugins/defaultPlugins/defaultPluginsUtils");
const userFetcher_1 = __importStar(require("@joplin/lib/utils/userFetcher"));
const reducer_2 = require("@joplin/lib/reducer");
const OcrService_1 = __importDefault(require("@joplin/lib/services/ocr/OcrService"));
const OcrDriverTesseract_1 = __importDefault(require("@joplin/lib/services/ocr/drivers/OcrDriverTesseract"));
const OcrDriverTranscribe_1 = __importDefault(require("@joplin/lib/services/ocr/drivers/OcrDriverTranscribe"));
const SearchEngine_1 = __importDefault(require("@joplin/lib/services/search/SearchEngine"));
const folders_screen_utils_1 = require("@joplin/lib/folders-screen-utils");
const initializeCommandService_1 = __importDefault(require("./utils/initializeCommandService"));
const PerformanceLogger_1 = __importDefault(require("@joplin/lib/PerformanceLogger"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const AiService_1 = __importDefault(require("@joplin/lib/services/ai/AiService"));
const LocalEmbeddingProvider_1 = __importDefault(require("@joplin/lib/services/ai/LocalEmbeddingProvider"));
const aiStatusBridge_1 = require("./services/aiStatusBridge");
const perfLogger = PerformanceLogger_1.default.create();
const pluginClasses = [
    require('./plugins/GotoAnything').default,
];
const appDefaultState = (0, app_reducer_1.createAppDefaultState)(reducer_1.defaultState);
class Application extends BaseApplication_1.default {
    constructor() {
        super();
        this.checkAllPluginStartedIID_ = null;
        this.initPluginServiceDone_ = false;
        this.bridge_nativeThemeUpdated = this.bridge_nativeThemeUpdated.bind(this);
    }
    hasGui() {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux actions are heterogeneous; typing would require an action-type union and base class signature change
    reducer(state = appDefaultState, action) {
        let newState = (0, app_reducer_1.default)(state, action);
        newState = (0, reducer_1.default)(newState, action);
        newState = super.reducer(newState, action);
        return newState;
    }
    toggleDevTools(visible) {
        if (visible) {
            (0, bridge_1.default)().openDevTools();
        }
        else {
            (0, bridge_1.default)().closeDevTools();
        }
    }
    updateLanguage() {
        (0, locale_1.setLocale)(Setting_1.default.value('locale'));
        // The bridge runs within the main process, with its own instance of locale.js
        // so it needs to be set too here.
        (0, bridge_1.default)().setLocale(Setting_1.default.value('locale'));
        const htmlContainer = document.querySelector('html');
        // HTML expects the lang attribute to be in BCP47 format, with a dash rather than
        // an underscore:
        const htmlLang = Setting_1.default.value('locale').replace(/_/g, '-');
        htmlContainer.setAttribute('lang', htmlLang);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux middleware signature; matches the base class which takes heterogeneous action types
    async generalMiddleware(store, next, action) {
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'locale' || action.type === 'SETTING_UPDATE_ALL') {
            this.updateLanguage();
        }
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'renderer.fileUrls' || action.type === 'SETTING_UPDATE_ALL') {
            (0, bridge_1.default)().electronApp().getContentProtocolHandler().setMediaAccessEnabled(Setting_1.default.value('renderer.fileUrls'));
        }
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'showTrayIcon' || action.type === 'SETTING_UPDATE_ALL') {
            this.updateTray();
        }
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'ocr.enabled' || action.type === 'SETTING_UPDATE_ALL') {
            void this.setupOcrService();
        }
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'windowContentZoomFactor' || action.type === 'SETTING_UPDATE_ALL') {
            (0, bridge_1.default)().setZoomFactor(Setting_1.default.value('windowContentZoomFactor') / 100);
        }
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'linking.extraAllowedExtensions' || action.type === 'SETTING_UPDATE_ALL') {
            (0, bridge_1.default)().extraAllowedOpenExtensions = Setting_1.default.value('linking.extraAllowedExtensions');
        }
        if ((action.type === 'SETTING_UPDATE_ONE' && action.key === 'globalHotkey') || action.type === 'SETTING_UPDATE_ALL') {
            (0, bridge_1.default)().updateGlobalHotkey(Setting_1.default.value('globalHotkey'));
        }
        if (['EVENT_NOTE_ALARM_FIELD_CHANGE', 'NOTE_DELETE'].indexOf(action.type) >= 0) {
            await AlarmService_1.default.updateNoteNotification(action.id, action.type === 'NOTE_DELETE');
        }
        if (action.type === 'SETTING_UPDATE_ONE' && action.key === 'featureFlag.autoUpdaterServiceEnabled' || action.type === 'SETTING_UPDATE_ALL') {
            if (Setting_1.default.value('featureFlag.autoUpdaterServiceEnabled'))
                this.setupAutoUpdaterService();
        }
        const result = await super.generalMiddleware(store, next, action);
        const newState = store.getState();
        if (['NOTE_VISIBLE_PANES_TOGGLE', 'NOTE_VISIBLE_PANES_SET'].indexOf(action.type) >= 0) {
            Setting_1.default.setValue('noteVisiblePanes', newState.noteVisiblePanes);
        }
        if (['NOTE_DEVTOOLS_TOGGLE', 'NOTE_DEVTOOLS_SET'].indexOf(action.type) >= 0) {
            this.toggleDevTools(newState.devToolsVisible);
        }
        if (action.type === 'FOLDER_AND_NOTE_SELECT') {
            await Folder_1.default.expandTree(newState.folders, action.folderId);
        }
        if (this.hasGui() && ((action.type === 'SETTING_UPDATE_ONE' && ['themeAutoDetect', 'theme', 'preferredLightTheme', 'preferredDarkTheme'].includes(action.key)) || action.type === 'SETTING_UPDATE_ALL')) {
            this.handleThemeAutoDetect();
        }
        if (action.type === 'PLUGIN_ADD') {
            const plugin = PluginService_1.default.instance().pluginById(action.plugin.id);
            this.protocolHandler_.allowReadAccessToDirectory(plugin.baseDir);
            this.protocolHandler_.allowReadAccessToDirectory(plugin.dataDir);
        }
        return result;
    }
    handleThemeAutoDetect() {
        if (!Setting_1.default.value('themeAutoDetect'))
            return;
        if ((0, bridge_1.default)().shouldUseDarkColors()) {
            Setting_1.default.setValue('theme', Setting_1.default.value('preferredDarkTheme'));
        }
        else {
            Setting_1.default.setValue('theme', Setting_1.default.value('preferredLightTheme'));
        }
    }
    bridge_nativeThemeUpdated() {
        this.handleThemeAutoDetect();
    }
    updateTray() {
        const app = (0, bridge_1.default)().electronApp();
        if (app.trayShown() === Setting_1.default.value('showTrayIcon'))
            return;
        if (!Setting_1.default.value('showTrayIcon')) {
            app.destroyTray();
        }
        else {
            const contextMenu = Menu.buildFromTemplate([
                { label: (0, locale_1._)('Open %s', app.electronApp().name), click: () => { app.mainWindow().show(); } },
                { type: 'separator' },
                { label: (0, locale_1._)('Quit'), click: () => {
                        app.quitWithSyncCheck((action) => this.store().dispatch(action), this.store().getState().syncPending);
                    } },
            ]);
            app.createTray(contextMenu);
        }
    }
    setupContextMenu() {
        // bridge().setupContextMenu((misspelledWord: string, dictionarySuggestions: string[]) => {
        // 	let output = SpellCheckerService.instance().contextMenuItems(misspelledWord, dictionarySuggestions);
        // 	console.info(misspelledWord, dictionarySuggestions);
        // 	console.info(output);
        // 	output = output.map(o => {
        // 		delete o.click;
        // 		return o;
        // 	});
        // 	return output;
        // });
        const MenuItem = (0, bridge_1.default)().MenuItem;
        // The context menu must be setup in renderer process because that's where
        // the spell checker service lives.
        electronContextMenu({
            shouldShowMenu: (_event, params) => {
                // params.inputFieldType === 'none' when right-clicking the text editor. This is a bit of a hack to detect it because in this
                // case we don't want to use the built-in context menu but a custom one.
                return params.isEditable && params.inputFieldType !== 'none';
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- electron-context-menu's actions/props don't have public types in this version
            menu: (actions, props) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- contextMenuItems returns a heterogeneous menu shape that doesn't satisfy Electron's MenuItemConstructorOptions structurally
                const spellCheckerMenuItems = SpellCheckerService_1.default.instance().contextMenuItems(props.misspelledWord, props.dictionarySuggestions).map((item) => new MenuItem(item));
                const output = [
                    actions.cut(),
                    actions.copy(),
                    actions.paste(),
                    ...spellCheckerMenuItems,
                ];
                return output;
            },
        });
    }
    async initPluginService() {
        if (this.initPluginServiceDone_)
            return;
        this.initPluginServiceDone_ = true;
        const service = PluginService_1.default.instance();
        const pluginRunner = new PluginRunner_1.default();
        service.initialize(packageInfo.version, PlatformImplementation_1.default.instance(), pluginRunner, this.store());
        service.isSafeMode = Setting_1.default.value('isSafeMode');
        let pluginSettings = service.unserializePluginSettings(Setting_1.default.value('plugins.states'));
        {
            // Users can add and remove plugins from the config screen at any
            // time, however we only effectively uninstall the plugin the next
            // time the app is started. What plugin should be uninstalled is
            // stored in the settings.
            pluginSettings = service.clearUpdateState(await service.uninstallPlugins(pluginSettings));
            Setting_1.default.setValue('plugins.states', pluginSettings);
        }
        // As of Joplin 3.5.7, the ABC rendering is part of the app so we automatically disable the plugin
        if (pluginSettings['org.joplinapp.plugins.AbcSheetMusic']) {
            pluginSettings = Object.assign(Object.assign({}, pluginSettings), { ['org.joplinapp.plugins.AbcSheetMusic']: {
                    enabled: false,
                    deleted: false,
                    hasBeenUpdated: false,
                } });
        }
        try {
            if (await shim.fsDriver().exists(Setting_1.default.value('pluginDir'))) {
                await service.loadAndRunPlugins(Setting_1.default.value('pluginDir'), pluginSettings);
            }
        }
        catch (error) {
            this.logger().error(`There was an error loading plugins from ${Setting_1.default.value('pluginDir')}:`, error);
        }
        try {
            await service.loadAndRunDevPlugins(pluginSettings);
        }
        catch (error) {
            this.logger().error(`There was an error loading plugins from ${Setting_1.default.value('plugins.devPluginPaths')}:`, error);
        }
        // Load default plugins after loading other plugins -- this allows users
        // to override built-in plugins with development versions with the same
        // ID.
        const defaultPluginsDir = path.join((0, bridge_1.default)().buildDir(), 'defaultPlugins');
        try {
            pluginSettings = await (0, defaultPluginsUtils_1.loadAndRunDefaultPlugins)(service, defaultPluginsDir, (0, desktopDefaultPluginsInfo_1.default)(), pluginSettings);
        }
        catch (error) {
            this.logger().error(`There was an error loading plugins from ${defaultPluginsDir}:`, error);
        }
        {
            // Users can potentially delete files from /plugins or even delete
            // the complete folder. When that happens, we still have the plugin
            // info in the state, which can cause various issues, so to sort it
            // out we remove from the state any plugin that has *not* been loaded
            // above (meaning the file was missing).
            // https://github.com/laurent22/joplin/issues/5253
            const oldSettings = pluginSettings;
            const newSettings = {};
            for (const pluginId of Object.keys(oldSettings)) {
                if (!service.pluginIds.includes(pluginId)) {
                    this.logger().warn('Found a plugin in the state that has not been loaded, which means the plugin might have been deleted outside Joplin - removing it from the state:', pluginId);
                    continue;
                }
                newSettings[pluginId] = oldSettings[pluginId];
            }
            Setting_1.default.setValue('plugins.states', newSettings);
            pluginSettings = newSettings;
        }
        this.checkAllPluginStartedIID_ = setInterval(() => {
            if (service.allPluginsStarted) {
                clearInterval(this.checkAllPluginStartedIID_);
                this.dispatch({
                    type: 'STARTUP_PLUGINS_LOADED',
                    value: true,
                });
                // Sends an event to the main process -- this is used by the Playwright
                // tests to wait for plugins to load.
                electron_1.ipcRenderer.send('startup-plugins-loaded');
                void (0, defaultPluginsUtils_1.afterDefaultPluginsLoaded)(service.plugins, (0, desktopDefaultPluginsInfo_1.default)(), pluginSettings);
            }
        }, 500);
    }
    async setupOcrService() {
        if (Setting_1.default.value('ocr.clearLanguageDataCache')) {
            Setting_1.default.setValue('ocr.clearLanguageDataCache', false);
            try {
                await OcrDriverTesseract_1.default.clearLanguageDataCache();
            }
            catch (error) {
                this.logger().warn('OCR: Failed to clear language data cache.', error);
            }
        }
        if (Setting_1.default.value('ocr.enabled')) {
            if (!this.ocrService_) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- tesseract.js is loaded via <script> onto window; the published createWorker type is stricter than the runtime accepts
                const Tesseract = window.Tesseract;
                const drivers = [];
                drivers.push(new OcrDriverTesseract_1.default({ createWorker: Tesseract.createWorker }, {
                    workerPath: `${(0, bridge_1.default)().buildDir()}/tesseract.js/worker.min.js`,
                    corePath: `${(0, bridge_1.default)().buildDir()}/tesseract.js-core`,
                    languageDataPath: Setting_1.default.value('ocr.languageDataPath') || null,
                }));
                drivers.push(new OcrDriverTranscribe_1.default());
                this.ocrService_ = new OcrService_1.default(drivers);
            }
            void this.ocrService_.runInBackground();
        }
        else {
            if (!this.ocrService_)
                return;
            void this.ocrService_.stopRunInBackground();
        }
        const handleResourceChange = () => {
            void this.ocrService_.maintenance();
        };
        eventManager_1.default.on(eventManager_1.EventName.ResourceCreate, handleResourceChange);
        eventManager_1.default.on(eventManager_1.EventName.ResourceChange, handleResourceChange);
    }
    setupAutoUpdaterService() {
        this.logger().info('Setting up auto-updater service...');
        if (Setting_1.default.value('featureFlag.autoUpdaterServiceEnabled')) {
            (0, bridge_1.default)().electronApp().initializeAutoUpdaterService(Logger_1.default.create('AutoUpdaterService'), Setting_1.default.value('env') === 'dev', Setting_1.default.value('autoUpdate.includePreReleases'));
        }
    }
    async setupCustomCss() {
        const chromeCssPath = Setting_1.default.customCssFilePath(Setting_1.default.customCssFilenames.JOPLIN_APP);
        if (await shim.fsDriver().exists(chromeCssPath)) {
            this.store().dispatch({
                // Main window custom CSS
                type: 'CUSTOM_CHROME_CSS_ADD',
                filePath: chromeCssPath,
            });
        }
        this.store().dispatch({
            // Markdown preview pane
            type: 'CUSTOM_VIEWER_CSS_APPEND',
            css: await (0, CssUtils_1.loadCustomCss)(Setting_1.default.customCssFilePath(Setting_1.default.customCssFilenames.RENDERED_MARKDOWN)),
        });
    }
    async setupIntegrationTestUtils() {
        // Events used by Playwright tests to quickly change the value of a setting.
        electron_1.ipcRenderer.on('testing--setSetting', (_event, key, value) => {
            this.logger().info('Updating setting using testing API: %s = %s', key, JSON.stringify(value));
            Setting_1.default.setValue(key, value);
        });
    }
    buildStartupTasks_() {
        const tasks = [];
        const addTask = (label, task) => {
            tasks.push({ label, task });
        };
        addTask('app/set up extra debug logging', () => {
            registry_1.reg.logger().info('app.start: doing regular boot');
            const dir = Setting_1.default.value('profileDir');
            syncDebugLog_1.default.enabled = false;
            if (dir.endsWith('dev-desktop-2')) {
                syncDebugLog_1.default.addTarget(Logger_1.TargetType.File, {
                    path: `${(0, os_1.homedir)()}/synclog.txt`,
                });
                syncDebugLog_1.default.enabled = true;
                syncDebugLog_1.default.info(`Profile dir: ${dir}`);
            }
        });
        addTask('app/set up registry', () => {
            registry_1.reg.setDispatch(this.dispatch.bind(this));
            registry_1.reg.setShowErrorMessageBoxHandler((message) => { (0, bridge_1.default)().showErrorMessageBox(message); });
        });
        addTask('app/set up auto updater', () => {
            this.setupAutoUpdaterService();
        });
        addTask('app/set up AlarmService', () => {
            AlarmService_1.default.setDriver(new AlarmServiceDriverNode_1.default({ appName: packageInfo.build.appId }));
            AlarmService_1.default.setLogger(registry_1.reg.logger());
        });
        if (Setting_1.default.value('flagOpenDevTools')) {
            addTask('app/openDevTools', () => {
                (0, bridge_1.default)().openDevTools();
            });
        }
        addTask('app/set up custom protocol handler', async () => {
            this.protocolHandler_ = (0, bridge_1.default)().electronApp().getContentProtocolHandler();
            this.protocolHandler_.allowReadAccessToDirectory(__dirname); // App bundle directory
            this.protocolHandler_.allowReadAccessToDirectory(Setting_1.default.value('cacheDir'));
            this.protocolHandler_.allowReadAccessToDirectory(Setting_1.default.value('resourceDir'));
        });
        // this.protocolHandler_.allowReadAccessTo(Setting.value('tempDir'));
        // For now, this doesn't seem necessary:
        //  this.protocolHandler_.allowReadAccessTo(Setting.value('profileDir'));
        // If it is needed, note that they decrease the security of the protcol
        // handler, and, as such, it may make sense to also limit permissions of
        // allowed pages with a Content Security Policy.
        addTask('app/initialize PluginManager, redux, CommandService, and KeymapService', async () => {
            PluginManager_1.default.instance().dispatch_ = this.dispatch.bind(this);
            PluginManager_1.default.instance().setLogger(registry_1.reg.logger());
            PluginManager_1.default.instance().register(pluginClasses);
            this.initRedux();
            // BaseApplication.store() is typed against the shared State; the
            // runtime store carries AppState. The bridge only needs dispatch and
            // getState, so narrow through unknown.
            (0, aiStatusBridge_1.installAiStatusBridge)(this.store());
            (0, initializeCommandService_1.default)(this.store(), Setting_1.default.value('env') === 'dev');
            const keymapService = KeymapService_1.default.instance();
            // We only add the commands that appear in the menu because only
            // those can have a shortcut associated with them.
            keymapService.initialize((0, menuCommandNames_1.default)());
            try {
                await keymapService.loadCustomKeymap(`${Setting_1.default.value('profileDir')}/keymap-desktop.json`);
            }
            catch (error) {
                registry_1.reg.logger().error(error);
            }
        });
        addTask('app/initialize PerFolderSortOrderService', () => {
            PerFolderSortOrderService_1.default.initialize();
        });
        addTask('app/dispatch initial settings', () => {
            // Since the settings need to be loaded before the store is
            // created, it will never receive the SETTING_UPDATE_ALL even,
            // which mean state.settings will not be initialised. So we
            // manually call dispatchUpdateAll() to force an update.
            Setting_1.default.dispatchUpdateAll();
        });
        addTask('app/update folders and tags', async () => {
            await (0, folders_screen_utils_1.refreshFolders)((action) => this.dispatch(action), '');
            const tags = await Tag_1.default.allWithNotes();
            this.dispatch({
                type: 'TAG_UPDATE_ALL',
                items: tags,
            });
        });
        addTask('app/set up custom CSS', async () => {
            await this.setupCustomCss();
        });
        // const masterKeys = await MasterKey.all();
        // this.dispatch({
        // 	type: 'MASTERKEY_UPDATE_ALL',
        // 	items: masterKeys,
        // });
        addTask('app/send initial selection to redux', async () => {
            const getNotesParent = async () => {
                let notesParent = (0, reducer_2.parseNotesParent)(Setting_1.default.value('notesParent'), Setting_1.default.value('activeFolderId'));
                if (notesParent.type === 'Tag' && !(await Tag_1.default.load(notesParent.selectedItemId))) {
                    notesParent = {
                        type: 'Folder',
                        selectedItemId: Setting_1.default.value('activeFolderId'),
                    };
                }
                return notesParent;
            };
            const notesParent = await getNotesParent();
            if (notesParent.type === 'SmartFilter') {
                this.store().dispatch({
                    type: 'SMART_FILTER_SELECT',
                    id: notesParent.selectedItemId,
                });
            }
            else if (notesParent.type === 'Tag') {
                this.store().dispatch({
                    type: 'TAG_SELECT',
                    id: notesParent.selectedItemId,
                });
            }
            else {
                this.store().dispatch({
                    type: 'FOLDER_SELECT',
                    id: notesParent.selectedItemId,
                });
            }
            this.store().dispatch({
                type: 'FOLDER_SET_COLLAPSED_ALL',
                ids: Setting_1.default.value('collapsedFolderIds'),
            });
            this.store().dispatch({
                type: 'NOTE_DEVTOOLS_SET',
                value: Setting_1.default.value('flagOpenDevTools'),
            });
        });
        addTask('app/initializeUserFetcher', async () => {
            (0, userFetcher_1.initializeUserFetcher)();
            shim.setInterval(() => { void (0, userFetcher_1.default)(); }, 1000 * 60 * 60);
        });
        addTask('app/updateTray', () => this.updateTray());
        addTask('app/set main window state', () => {
            if (Setting_1.default.value('startMinimized') && Setting_1.default.value('showTrayIcon')) {
                (0, bridge_1.default)().mainWindow().hide();
            }
            else {
                (0, bridge_1.default)().mainWindow().show();
            }
        });
        addTask('app/complete pending Joplin Cloud auth', async () => {
            await (0, joplinCloudUtils_1.completePendingAuthentication)();
        });
        addTask('app/start maintenance tasks', () => {
            // Always disable on Mac for now - and disable too for the few apps that may have the flag enabled.
            // At present, it only seems to work on Windows.
            if (shim.isMac()) {
                Setting_1.default.setValue('featureFlag.autoUpdaterServiceEnabled', false);
            }
            // Note: Auto-update is a misnomer in the code.
            // The code below only checks, if a new version is available.
            // We only allow Windows and macOS users to automatically check for updates
            if (!Setting_1.default.value('featureFlag.autoUpdaterServiceEnabled')) {
                if (shim.isWindows() || shim.isMac()) {
                    const runAutoUpdateCheck = () => {
                        if (Setting_1.default.value('autoUpdateEnabled')) {
                            void (0, checkForUpdates_1.default)(true, (0, bridge_1.default)().mainWindow(), { includePreReleases: Setting_1.default.value('autoUpdate.includePreReleases') });
                        }
                    };
                    // Initial check on startup
                    shim.setTimeout(() => { runAutoUpdateCheck(); }, 5000);
                    // Then every x hours
                    shim.setInterval(() => { runAutoUpdateCheck(); }, 12 * 60 * 60 * 1000);
                }
            }
            shim.setTimeout(() => {
                void AlarmService_1.default.garbageCollect();
            }, 1000 * 60 * 60);
            void ShareService_1.default.instance().maintenance();
            ResourceService_1.default.runInBackground();
            if (Setting_1.default.value('env') === 'dev') {
                void AlarmService_1.default.updateAllNotifications();
                RevisionService_1.default.instance().runInBackground();
            }
            else {
                setTimeout(() => {
                    // Schedule sync with a delay of 0 and wrap with the desired timeout, as shim.setTimeout may not fire on first run or after an upgrade
                    // eslint-disable-next-line promise/prefer-await-to-then -- Old code before rule was applied
                    void registry_1.reg.scheduleSync(0).then(() => {
                        // Wait for the first sync before updating the notifications, since synchronisation
                        // might change the notifications.
                        void AlarmService_1.default.updateAllNotifications();
                        void DecryptionWorker_1.default.instance().scheduleStart();
                        RevisionService_1.default.instance().runInBackground();
                    });
                }, 1000);
            }
            this.startRotatingLogMaintenance(Setting_1.default.value('profileDir'));
        });
        addTask('app/set up ClipperServer', () => {
            const clipperLogger = new Logger_1.default();
            clipperLogger.addTarget(Logger_1.TargetType.File, { path: `${Setting_1.default.value('profileDir')}/log-clipper.txt` });
            clipperLogger.addTarget(Logger_1.TargetType.Console);
            ClipperServer_1.default.instance().initialize(actionApi_desktop_1.default);
            ClipperServer_1.default.instance().setEnabled(!Setting_1.default.value('altInstanceId'));
            ClipperServer_1.default.instance().setLogger(clipperLogger);
            ClipperServer_1.default.instance().setDispatch(this.store().dispatch);
            if (ClipperServer_1.default.instance().enabled() && Setting_1.default.value('clipperServer.autoStart')) {
                void ClipperServer_1.default.instance().start();
            }
        });
        addTask('app/set up external edit watchers', () => {
            ExternalEditWatcher_1.default.instance().setLogger(registry_1.reg.logger());
            ExternalEditWatcher_1.default.instance().initialize(bridge_1.default, this.store().dispatch);
            index_1.default.instance().initialize(registry_1.reg.logger(), 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux action — heterogeneous; tightening would require a typed action union shared with the store
            (action) => { this.store().dispatch(action); }, (path) => (0, bridge_1.default)().openItem(path), () => this.store().getState().windowId);
            // Forwards the local event to the global event manager, so that it can
            // be picked up by the plugin manager.
            index_1.default.instance().on('resourceChange', (event) => {
                eventManager_1.default.emit(eventManager_1.EventName.ResourceChange, event);
            });
        });
        // Make it available to the console window - useful to call revisionService.collectRevisions()
        if (Setting_1.default.value('env') === 'dev') {
            addTask('app/add debug variables', () => {
                window.joplin = {
                    revisionService: RevisionService_1.default.instance(),
                    migrationService: MigrationService_1.default.instance(),
                    decryptionWorker: DecryptionWorker_1.default.instance(),
                    commandService: CommandService_1.default.instance(),
                    pluginService: PluginService_1.default.instance(),
                    bridge: (0, bridge_1.default)(),
                    debug: new DebugService_1.default(registry_1.reg.db()),
                    resourceService: ResourceService_1.default.instance(),
                    searchEngine: SearchEngine_1.default.instance(),
                    shim,
                    Note: Note_1.default,
                    Folder: Folder_1.default,
                    Resource: Resource_1.default,
                    Setting: Setting_1.default,
                    ocrService: () => this.ocrService_,
                };
            });
        }
        addTask('app/listen for main process events', () => {
            (0, bridge_1.default)().addEventListener('nativeThemeUpdated', this.bridge_nativeThemeUpdated);
            (0, bridge_1.default)().setOnAllowedExtensionsChangeListener((newExtensions) => {
                Setting_1.default.setValue('linking.extraAllowedExtensions', newExtensions);
            });
            electron_1.ipcRenderer.on('window-focused', (_event, newWindowId) => {
                const currentWindowId = this.store().getState().windowId;
                if (newWindowId !== currentWindowId) {
                    this.dispatch({
                        type: 'WINDOW_FOCUS',
                        windowId: newWindowId,
                        lastWindowId: currentWindowId,
                    });
                }
            });
            electron_1.ipcRenderer.on('secondary-window-closing', (_event, windowId) => {
                this.dispatch({ type: 'WINDOW_CLOSE', windowId });
            });
        });
        addTask('app/initPluginService', () => this.initPluginService());
        addTask('app/setupContextMenu', () => {
            this.setupContextMenu();
        });
        addTask('app/set up SpellCheckerService', async () => {
            await SpellCheckerService_1.default.instance().initialize(new SpellCheckerServiceDriverNative_1.default());
        });
        addTask('app/listen for resource events', () => {
            eventManager_1.default.on(eventManager_1.EventName.OcrServiceResourcesProcessed, async () => {
                await ResourceService_1.default.instance().indexNoteResources();
            });
            eventManager_1.default.on(eventManager_1.EventName.NoteResourceIndexed, async () => {
                SearchEngine_1.default.instance().scheduleSyncTables();
            });
        });
        addTask('app/listen for note lock session events', () => {
            eventManager_1.default.on(eventManager_1.EventName.NoteLockSessionChange, (event) => {
                this.dispatch({
                    type: 'SET_NOTE_LOCK_SESSION_UNLOCKED',
                    value: event.unlocked,
                });
            });
        });
        addTask('app/setupOcrService', () => this.setupOcrService());
        return tasks;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Matches the base class signature (BaseApplication.start returns Promise<any>)
    async start(argv, startOptions = null) {
        const startupTask = perfLogger.taskStart('app/start');
        // If running inside a package, the command line, instead of being "node.exe <path> <flags>" is "joplin.exe <flags>" so
        // insert an extra argument so that they can be processed in a consistent way everywhere.
        if (!(0, bridge_1.default)().electronIsDev())
            argv.splice(1, 0, '.');
        argv = await super.start(argv, startOptions);
        await this.setupIntegrationTestUtils();
        (0, bridge_1.default)().setLogFilePath(Logger_1.default.globalLogger.logFilePath());
        // Install the local embedding provider before applySettingsSideEffects()
        // — applyEmbeddingIndexerState() consults AiService for an active
        // provider, so the indexer will silently sit idle if we wire it up after.
        // Only install when ONNX is actually available; otherwise embeddings
        // remain unavailable and the indexer stays off.
        if (shim.onnxRuntime()) {
            AiService_1.default.instance().setEmbeddingProvider(new LocalEmbeddingProvider_1.default());
        }
        await this.applySettingsSideEffects();
        if (Setting_1.default.value('sync.upgradeState') === Setting_1.default.SYNC_UPGRADE_STATE_MUST_DO) {
            registry_1.reg.logger().info('app.start: doing upgradeSyncTarget action');
            (0, bridge_1.default)().mainWindow().show();
            startupTask.onEnd();
            return { action: 'upgradeSyncTarget' };
        }
        const startupTasks = this.buildStartupTasks_();
        for (const task of startupTasks) {
            await perfLogger.track(task.label, async () => task.task());
        }
        // setTimeout(() => {
        // 	void populateDatabase(reg.db(), {
        // 		clearDatabase: true,
        // 		folderCount: 200,
        // 		noteCount: 3000,
        // 		tagCount: 2000,
        // 		tagsPerNote: 10,
        // 		rootFolderCount: 20,
        // 		subFolderDepth: 3,
        // 	});
        // }, 5000);
        // setTimeout(() => {
        // 	console.info(CommandService.instance().commandsToMarkdownTable(this.store().getState()));
        // }, 2000);
        // setTimeout(() => {
        // 	this.dispatch({
        // 		type: 'NAV_GO',
        // 		routeName: 'Config',
        // 		props: {
        // 			defaultSection: 'encryption',
        // 		},
        // 	});
        // }, 2000);
        // setTimeout(() => {
        // 	this.dispatch({
        // 		type: 'DIALOG_OPEN',
        // 		name: 'syncWizard',
        // 	});
        // }, 2000);
        // setTimeout(() => {
        // 	this.dispatch({
        // 		type: 'DIALOG_OPEN',
        // 		name: 'editFolder',
        // 	});
        // }, 3000);
        // setTimeout(() => {
        // 	this.dispatch({
        // 		type: 'NAV_GO',
        // 		routeName: 'Config',
        // 		props: {
        // 			defaultSection: 'plugins',
        // 		},
        // 	});
        // }, 2000);
        // await runIntegrationTests();
        // Used by tests
        electron_1.ipcRenderer.send('startup-finished');
        startupTask.onEnd();
        return null;
    }
}
let application_ = null;
function app() {
    if (!application_)
        application_ = new Application();
    return application_;
}
exports.default = app;
//# sourceMappingURL=app.js.map