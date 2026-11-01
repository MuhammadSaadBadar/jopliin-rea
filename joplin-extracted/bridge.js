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
exports.Bridge = void 0;
exports.initBridge = initBridge;
exports.default = bridge;
const shim_1 = __importStar(require("@joplin/lib/shim"));
const locale_1 = require("@joplin/lib/locale");
const electron_1 = require("electron");
const path_utils_1 = require("@joplin/lib/path-utils");
const url_1 = require("@joplin/utils/url");
const string_utils_1 = require("@joplin/lib/string-utils");
const Sentry = __importStar(require("@sentry/electron/main"));
const os_1 = require("os");
const time_1 = require("@joplin/utils/time");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const isSafeToOpen_1 = __importDefault(require("./utils/isSafeToOpen"));
const fs_1 = require("fs");
const bytes_1 = require("@joplin/utils/bytes");
const reducer_1 = require("@joplin/lib/reducer");
const utils_1 = require("@joplin/utils");
class Bridge {
    constructor(electronWrapper, appId, appName, rootProfileDir, autoUploadCrashDumps, altInstanceId) {
        this.autoUploadCrashDumps_ = false;
        this.logFilePath_ = '';
        this.altInstanceId_ = '';
        this.extraAllowedExtensions_ = [];
        this.onAllowedExtensionsChangeListener_ = () => { };
        this.registeredGlobalHotkey_ = '';
        this.getLocale = () => {
            return this.electronApp().electronApp().getLocale();
        };
        this.safeStorage = {
            isEncryptionAvailable() {
                return electron_1.safeStorage.isEncryptionAvailable();
            },
            encryptString(data) {
                return electron_1.safeStorage.encryptString(data).toString('base64');
            },
            decryptString(base64Data) {
                return electron_1.safeStorage.decryptString(Buffer.from(base64Data, 'base64'));
            },
            getSelectedStorageBackend() {
                return electron_1.safeStorage.getSelectedStorageBackend();
            },
        };
        this.electronWrapper_ = electronWrapper;
        this.appId_ = appId;
        this.appName_ = appName;
        this.rootProfileDir_ = rootProfileDir;
        this.autoUploadCrashDumps_ = autoUploadCrashDumps;
        this.altInstanceId_ = altInstanceId;
        this.lastSelectedPaths_ = {
            file: null,
            directory: null,
        };
        this.sentryInit();
    }
    setLogFilePath(v) {
        this.logFilePath_ = v;
    }
    getCrashDumpDirectory() {
        try {
            const platformName = shim_1.default.platformName();
            switch (platformName) {
                case 'win32':
                    // Windows: Use %LOCALAPPDATA%\CrashDumps
                    return (0, path_1.join)(process.env.LOCALAPPDATA || (0, path_1.join)((0, os_1.homedir)(), 'AppData', 'Local'), 'CrashDumps');
                case 'darwin':
                    // macOS: Use ~/Library/Logs/DiagnosticReports
                    return (0, path_1.join)((0, os_1.homedir)(), 'Library', 'Logs', 'DiagnosticReports');
                case 'linux':
                    // Linux: Use XDG_STATE_HOME (for logs) or fallback to ~/.local/state
                    return (0, path_1.join)(process.env.XDG_STATE_HOME || (0, path_1.join)((0, os_1.homedir)(), '.local', 'state'), 'joplin');
                default:
                    // For unknown platforms, default to the home directory
                    return (0, os_1.homedir)();
            }
        }
        catch (error) {
            // If we can't get the platform name, fallback to the home directory
            return (0, os_1.homedir)();
        }
    }
    sentryInit() {
        const getLogLines = () => {
            try {
                if (!this.logFilePath_ || !(0, fs_extra_1.pathExistsSync)(this.logFilePath_))
                    return '';
                const { size } = (0, fs_1.statSync)(this.logFilePath_);
                if (!size)
                    return '';
                const bytesToRead = Math.min(size, 100 * bytes_1.KB);
                const handle = (0, fs_1.openSync)(this.logFilePath_, 'r');
                const position = size - bytesToRead;
                const buffer = Buffer.alloc(bytesToRead);
                (0, fs_1.readSync)(handle, buffer, 0, bytesToRead, position);
                (0, fs_1.closeSync)(handle);
                return buffer.toString('utf-8');
            }
            catch (error) {
                // Can't do anything in this context
                return '';
            }
        };
        const getLogAttachment = () => {
            const lines = getLogLines();
            if (!lines)
                return null;
            return { filename: 'joplin-log.txt', data: lines };
        };
        const options = {
            beforeSend: (event, hint) => {
                try {
                    const logAttachment = getLogAttachment();
                    if (logAttachment)
                        hint.attachments = [logAttachment];
                    const date = (new Date()).toISOString().replace(/[:-]/g, '').split('.')[0];
                    const errorEventWithLog = Object.assign(Object.assign({}, event), { log: logAttachment ? logAttachment.data.trim().split('\n') : [] });
                    const crashDumpDir = this.getCrashDumpDirectory();
                    (0, fs_extra_1.ensureDirSync)(crashDumpDir);
                    const crashDumpPath = (0, path_1.join)(crashDumpDir, `joplin_crash_dump_${date}.json`);
                    (0, fs_extra_1.writeFileSync)(crashDumpPath, JSON.stringify(errorEventWithLog, null, '\t'), 'utf-8');
                }
                catch (error) {
                    // Ignore the error since we can't handle it here
                }
                if (!this.autoUploadCrashDumps_) {
                    return null;
                }
                else {
                    return event;
                }
            },
            integrations: [Sentry.electronMinidumpIntegration()],
            // Using the default ipcMode value causes <iframe>s that use custom protocols to
            // have isSecureOrigin: false, limiting which browser APIs are available.
            ipcMode: Sentry.IPCMode.Classic,
        };
        if (this.autoUploadCrashDumps_)
            options.dsn = 'https://cceec550871b1e8a10fee4c7a28d5cf2@o4506576757522432.ingest.sentry.io/4506594281783296';
        // eslint-disable-next-line no-console
        console.info('Sentry: Initialized with autoUploadCrashDumps:', this.autoUploadCrashDumps_);
        Sentry.init(options);
    }
    appId() {
        return this.appId_;
    }
    appName() {
        return this.appName_;
    }
    rootProfileDir() {
        return this.rootProfileDir_;
    }
    electronApp() {
        return this.electronWrapper_;
    }
    electronIsDev() {
        return !this.electronApp().electronApp().isPackaged;
    }
    get autoUploadCrashDumps() {
        return this.autoUploadCrashDumps_;
    }
    set autoUploadCrashDumps(v) {
        this.autoUploadCrashDumps_ = v;
    }
    get extraAllowedOpenExtensions() {
        return this.extraAllowedExtensions_;
    }
    set extraAllowedOpenExtensions(newValue) {
        var _a;
        const oldValue = this.extraAllowedExtensions_;
        const changed = newValue.length !== oldValue.length || newValue.some((v, idx) => v !== oldValue[idx]);
        if (changed) {
            this.extraAllowedExtensions_ = newValue;
            (_a = this.onAllowedExtensionsChangeListener_) === null || _a === void 0 ? void 0 : _a.call(this, this.extraAllowedExtensions_);
        }
    }
    setOnAllowedExtensionsChangeListener(listener) {
        this.onAllowedExtensionsChangeListener_ = listener;
    }
    updateGlobalHotkey(accelerator) {
        // Skip if the accelerator hasn't changed
        if (accelerator === this.registeredGlobalHotkey_)
            return;
        // Unregister the previous shortcut (only Joplin's own)
        this.unregisterGlobalHotkey();
        if (!accelerator)
            return;
        try {
            const registered = electron_1.globalShortcut.register(accelerator, () => {
                const win = this.mainWindow();
                if (!win)
                    return;
                if (win.isVisible() && win.isFocused()) {
                    win.hide();
                }
                else {
                    if (win.isMinimized())
                        win.restore();
                    win.show();
                    // eslint-disable-next-line no-restricted-properties
                    win.focus();
                }
            });
            if (registered) {
                this.registeredGlobalHotkey_ = accelerator;
            }
            else {
                console.warn(`Bridge: Failed to register global shortcut: ${accelerator}`);
            }
        }
        catch (error) {
            console.error(`Bridge: Error registering global shortcut "${accelerator}":`, error);
        }
    }
    unregisterGlobalHotkey() {
        if (this.registeredGlobalHotkey_) {
            try {
                electron_1.globalShortcut.unregister(this.registeredGlobalHotkey_);
            }
            catch (error) {
                console.warn('Bridge: Error removing global shortcut:', error);
            }
            this.registeredGlobalHotkey_ = '';
        }
    }
    async captureException(error) {
        Sentry.captureException(error);
        // We wait to give the "beforeSend" event handler time to process the crash dump and write
        // it to file.
        await (0, time_1.msleep)(10);
    }
    // The build directory contains additional external files that are going to
    // be packaged by Electron Builder. This is for files that need to be
    // accessed outside of the Electron app (for example the application icon).
    //
    // Any static file that's accessed from within the app such as CSS or fonts
    // should go in /vendor.
    //
    // The build folder location is dynamic, depending on whether we're running
    // in dev or prod, which makes it hard to access it from static files (for
    // example from plain HTML files that load CSS or JS files). For this reason
    // it should be avoided as much as possible.
    buildDir() {
        return this.electronApp().buildDir();
    }
    // The vendor directory and its content is dynamically created from other
    // dir (usually by pulling files from node_modules). It can also be accessed
    // using a relative path such as "../../vendor/lib/file.js" because it will
    // be at the same location in both prod and dev mode (unlike the build dir).
    vendorDir() {
        return `${__dirname}/vendor`;
    }
    env() {
        return this.electronWrapper_.env();
    }
    processArgv() {
        return process.argv;
    }
    altInstanceId() {
        return this.altInstanceId_;
    }
    // Applies to electron-context-menu@3:
    //
    // For now we have to disable spell checking in non-editor text
    // areas (such as the note title) because the context menu lives in
    // the main process, and the spell checker service is in the
    // renderer process. To get the word suggestions, we need to call
    // the spellchecker service but that can only be done in an async
    // way, and the menu is built synchronously.
    //
    // Moving the spellchecker to the main process would be hard because
    // it depends on models and various other classes which are all in
    // the renderer process.
    //
    // Perhaps the easiest would be to patch electron-context-menu to
    // support the renderer process again. Or possibly revert to an old
    // version of electron-context-menu.
    setupContextMenu(_spellCheckerMenuItemsHandler) {
        require('./services/electron-context-menu')({
            allWindows: [this.mainWindow()],
            electronApp: this.electronApp(),
            shouldShowMenu: (_event, params) => {
                return params.isEditable;
            },
            // menu: (actions: any, props: any) => {
            // 	const items = spellCheckerMenuItemsHandler(props.misspelledWord, props.dictionarySuggestions);
            // 	const spellCheckerMenuItems = items.map((item: any) => new MenuItem(item)); //SpellCheckerService.instance().contextMenuItems(props.misspelledWord, props.dictionarySuggestions).map((item: any) => new MenuItem(item));
            // 	const output = [
            // 		actions.cut(),
            // 		actions.copy(),
            // 		actions.paste(),
            // 		...spellCheckerMenuItems,
            // 	];
            // 	return output;
            // },
        });
    }
    mainWindow() {
        return this.electronWrapper_.mainWindow();
    }
    activeWindow() {
        return this.electronWrapper_.activeWindow();
    }
    windowById(id) {
        return this.electronWrapper_.windowById(id);
    }
    // Switches to the window with the given ID, but only if that window was not the
    // last focused window
    switchToWindow(windowId) {
        const targetWindow = this.windowById(windowId);
        if (this.activeWindow() !== this.windowById(windowId)) {
            targetWindow.show();
        }
    }
    switchToMainWindow() {
        this.switchToWindow(reducer_1.defaultWindowId);
    }
    // zoom should be in the range [0..1]
    setZoomFactor(zoom) {
        for (const window of this.electronWrapper_.allAppWindows()) {
            window.webContents.setZoomFactor(zoom);
        }
    }
    showItemInFolder(fullPath) {
        return require('electron').shell.showItemInFolder((0, path_utils_1.toSystemSlashes)(fullPath));
    }
    newBrowserWindow(options) {
        return new electron_1.BrowserWindow(options);
    }
    windowSetSize(width, height) {
        if (!this.mainWindow())
            return;
        return this.mainWindow().setSize(width, height);
    }
    openDevTools() {
        return this.activeWindow().webContents.openDevTools();
    }
    closeDevTools() {
        return this.activeWindow().webContents.closeDevTools();
    }
    async showSaveDialog(options) {
        if (!options)
            options = {};
        if (!('defaultPath' in options) && this.lastSelectedPaths_.file)
            options.defaultPath = this.lastSelectedPaths_.file;
        const { filePath } = await electron_1.dialog.showSaveDialog(this.activeWindow(), options);
        if (filePath) {
            this.lastSelectedPaths_.file = filePath;
        }
        return filePath;
    }
    async showOpenDialog(options = null) {
        if (!options)
            options = {};
        let fileType = 'file';
        if (options.properties && options.properties.includes('openDirectory'))
            fileType = 'directory';
        if (!('defaultPath' in options) && this.lastSelectedPaths_[fileType])
            options.defaultPath = this.lastSelectedPaths_[fileType];
        if (!('createDirectory' in options))
            options.createDirectory = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- App-internal OpenDialogOptions.properties is string[]; Electron's is a stricter union
        const { filePaths } = await electron_1.dialog.showOpenDialog(this.activeWindow(), options);
        if (filePaths && filePaths.length) {
            this.lastSelectedPaths_[fileType] = (0, path_utils_1.dirname)(filePaths[0]);
        }
        return filePaths;
    }
    // Don't use this directly - call one of the showXxxxxxxMessageBox() instead
    showMessageBox_(window, options) {
        if (!window)
            window = this.activeWindow();
        return electron_1.dialog.showMessageBoxSync(window, Object.assign({ message: '' }, options));
    }
    showErrorMessageBox(message, options = null) {
        options = Object.assign({ buttons: [(0, locale_1._)('OK')] }, options);
        return this.showMessageBox_(this.activeWindow(), {
            type: 'error',
            message: message,
            buttons: options.buttons,
        });
    }
    showConfirmMessageBox(message, options = null) {
        options = Object.assign({ buttons: [(0, locale_1._)('OK'), (0, locale_1._)('Cancel')] }, options);
        const result = this.showMessageBox_(this.activeWindow(), Object.assign({ type: 'question', message: message, cancelId: 1, buttons: options.buttons }, options));
        return result === 0;
    }
    /* returns the index of the clicked button */
    showMessageBox(message, options = {}) {
        const defaultButtons = [(0, locale_1._)('OK')];
        if (options.type !== shim_1.MessageBoxType.Error && options.type !== shim_1.MessageBoxType.Info) {
            defaultButtons.push((0, locale_1._)('Cancel'));
        }
        const result = this.showMessageBox_(this.activeWindow(), Object.assign({ type: 'question', message: message, buttons: defaultButtons }, options));
        return result;
    }
    showInfoMessageBox(message, options = {}) {
        const result = this.showMessageBox_(this.activeWindow(), Object.assign({ type: 'info', message: message, buttons: [(0, locale_1._)('OK')] }, options));
        return result === 0;
    }
    setLocale(locale) {
        (0, locale_1.setLocale)(locale);
    }
    setEnableUnresponsiveCheck(enabled) {
        this.electronWrapper_.setEnableUnresponsiveCheck(enabled);
    }
    get Menu() {
        return electron_1.Menu;
    }
    get MenuItem() {
        return electron_1.MenuItem;
    }
    async openExternal(url) {
        const protocol = new URL(url).protocol;
        if (protocol === 'file:') {
            await this.openItem(url);
        }
        else {
            return electron_1.shell.openExternal(url);
        }
    }
    async openItem(fullPath) {
        if (fullPath.startsWith('file:/')) {
            fullPath = (0, url_1.fileUriToPath)((0, string_utils_1.urlDecode)(fullPath), shim_1.default.platformName());
        }
        fullPath = (0, path_1.normalize)(fullPath);
        // Note: pathExists is intended to mitigate a security issue related to network drives
        //       on Windows.
        if (await (0, fs_extra_1.pathExists)(fullPath)) {
            const fileExtension = (0, path_1.extname)(fullPath);
            const userAllowedExtension = this.extraAllowedOpenExtensions.includes(fileExtension);
            if (userAllowedExtension || await (0, isSafeToOpen_1.default)(fullPath)) {
                return electron_1.shell.openPath(fullPath);
            }
            else {
                const allowOpenId = 2;
                const learnMoreId = 1;
                const fileExtensionDescription = JSON.stringify(fileExtension);
                const result = await electron_1.dialog.showMessageBox(this.activeWindow(), {
                    title: (0, locale_1._)('Unknown file type'),
                    message: (0, locale_1._)('Joplin doesn\'t recognise the %s extension. Opening this file could be dangerous. What would you like to do?', fileExtensionDescription),
                    type: 'warning',
                    checkboxLabel: (0, locale_1._)('Always open %s files without asking.', fileExtensionDescription),
                    buttons: [
                        (0, locale_1._)('Cancel'),
                        (0, locale_1._)('Learn more'),
                        (0, locale_1._)('Open it'),
                    ],
                });
                if (result.response === learnMoreId) {
                    void this.openExternal('https://joplinapp.org/help/apps/attachments#unknown-filetype-warning');
                    return 'Learn more shown';
                }
                else if (result.response !== allowOpenId) {
                    return 'Cancelled by user';
                }
                if (result.checkboxChecked) {
                    this.extraAllowedOpenExtensions = this.extraAllowedOpenExtensions.concat(fileExtension);
                }
                return electron_1.shell.openPath(fullPath);
            }
        }
        else {
            return 'Path does not exist.';
        }
    }
    screen() {
        return require('electron').screen;
    }
    shouldUseDarkColors() {
        return electron_1.nativeTheme.shouldUseDarkColors;
    }
    addEventListener(name, fn) {
        if (name === 'nativeThemeUpdated') {
            electron_1.nativeTheme.on('updated', fn);
        }
        else {
            throw new Error(`Unsupported event: ${name}`);
        }
    }
    appLaunchCommand(env, altInstanceId = '') {
        const altInstanceArgs = altInstanceId ? ['--alt-instance-id', altInstanceId] : [];
        if (env === 'dev') {
            // This is convenient to quickly test on dev, but the path needs to be adjusted
            // depending on how things are setup.
            return {
                execPath: `${(0, os_1.homedir)()}/.npm-global/bin/electron`,
                args: [
                    `${(0, os_1.homedir)()}/src/joplin/packages/app-desktop`,
                    '--env', 'dev',
                    '--log-level', 'debug',
                    '--open-dev-tools',
                    '--no-welcome',
                ].concat(altInstanceArgs),
            };
        }
        else {
            return {
                execPath: bridge().electronApp().electronApp().getPath('exe'),
                args: [].concat(altInstanceArgs),
            };
        }
    }
    async launchAppInstanceById(env, altInstanceId) {
        if (this.electronApp().ipcServerStarted()) {
            const cmd = this.appLaunchCommand(env, altInstanceId);
            await (0, utils_1.execCommand)([cmd.execPath].concat(cmd.args), { detached: true });
        }
        else {
            const buttonIndex = this.showErrorMessageBox('Cannot launch another instance because IPC server could not start.', {
                buttons: [
                    (0, locale_1._)('OK'),
                    (0, locale_1._)('Open log'),
                ],
            });
            if (buttonIndex === 1) {
                void this.openItem(this.electronApp().mainProcessLogFilePath());
            }
        }
    }
    async launchAltAppInstance(env) {
        await this.launchAppInstanceById(env, 'alt1');
    }
    async launchMainAppInstance(env) {
        await this.launchAppInstanceById(env, '');
    }
    async restart() {
        // Note that in this case we are not sending the "appClose" event
        // to notify services and component that the app is about to close
        // but for the current use-case it's not really needed.
        const { app } = require('electron');
        if (shim_1.default.isPortable()) {
            const options = {
                execPath: process.env.PORTABLE_EXECUTABLE_FILE,
            };
            app.relaunch(options);
        }
        else if (process.env.APPIMAGE && !this.altInstanceId_) {
            app.relaunch({
                execPath: process.env.APPIMAGE,
                args: ['--appimage-extract-and-run'],
            });
        }
        else if (this.altInstanceId_) {
            // Couldn't get it to work using relaunch() - it would just "close" the app, but it
            // would still be open in the tray except unusable. Or maybe it reopens it quickly but
            // in a broken state. It might be due to the way it is launched from the main instance.
            // So here we ask the main instance to relaunch this app after a short delay.
            const responses = await this.electronApp().sendCrossAppIpcMessage({
                action: 'restartAltInstance',
                data: null,
            });
            // However is the main instance is not running, we're stuck, so the user needs to
            // manually restart. `relaunch()` doesn't appear to work even when the main instance is
            // not running.
            const r = responses.find(r => !!r.response);
            if (!r || !r.response) {
                this.showInfoMessageBox((0, locale_1._)('The app is now going to close. Please relaunch it to complete the process.'));
                // Note: this should work, but doesn't:
                // const cmd = this.appLaunchCommand(this.env(), this.altInstanceId_);
                // app.relaunch({
                // 	execPath: cmd.execPath,
                // 	args: cmd.args,
                // });
            }
        }
        else {
            app.relaunch();
        }
        this.electronApp().exit();
    }
    createImageFromPath(path) {
        return electron_1.nativeImage.createFromPath(path);
    }
    menuPopupFromTemplate(template) {
        const menu = electron_1.Menu.buildFromTemplate(template);
        return menu.popup({ window: this.mainWindow() });
    }
}
exports.Bridge = Bridge;
let bridge_ = null;
function initBridge(wrapper, appId, appName, rootProfileDir, autoUploadCrashDumps, altInstanceId) {
    if (bridge_)
        throw new Error('Bridge already initialized');
    bridge_ = new Bridge(wrapper, appId, appName, rootProfileDir, autoUploadCrashDumps, altInstanceId);
    return bridge_;
}
function bridge() {
    if (!bridge_)
        throw new Error('Bridge not initialized');
    return bridge_;
}
//# sourceMappingURL=bridge.js.map