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
const Logger_1 = __importStar(require("@joplin/utils/Logger"));
const AutoUpdaterService_1 = __importStar(require("./services/autoUpdater/AutoUpdaterService"));
const shim = require('@joplin/lib/shim').default;
const callbackUrlUtils_1 = require("@joplin/lib/callbackUrlUtils");
const fs_1 = require("@joplin/utils/fs");
const ipc_1 = require("@joplin/utils/ipc");
const electron_1 = require("electron");
const bridge_1 = __importDefault(require("./bridge"));
const url = __importStar(require("url"));
const path = __importStar(require("path"));
const path_utils_1 = require("@joplin/lib/path-utils");
const fs = __importStar(require("fs-extra"));
const electron_2 = require("electron");
const locale_1 = require("@joplin/lib/locale");
const restartInSafeModeFromMain_1 = __importDefault(require("./utils/restartInSafeModeFromMain"));
const handleCustomProtocols_1 = __importDefault(require("./utils/customProtocols/handleCustomProtocols"));
const timers_1 = require("timers");
const reducer_1 = require("@joplin/lib/reducer");
const time_1 = require("@joplin/utils/time");
const determineBaseAppDirs_1 = __importDefault(require("@joplin/lib/determineBaseAppDirs"));
const getAppName_1 = __importDefault(require("@joplin/lib/getAppName"));
const utils_1 = require("@joplin/utils");
class ElectronAppWrapper {
    constructor(electronApp, { env, profilePath, isDebugMode, initialCallbackUrl, isEndToEndTesting }) {
        this.win_ = null;
        this.mainWindowHidden_ = true;
        this.pluginWindows_ = {};
        this.secondaryWindows_ = new Map();
        this.willQuitApp_ = false;
        this.enableUnresponsiveCheck_ = true;
        this.tray_ = null;
        this.buildDir_ = null;
        this.rendererProcessQuitReply_ = null;
        this.initialCallbackUrl_ = null;
        this.updaterService_ = null;
        this.customProtocolHandlers_ = null;
        this.updatePollInterval_ = null;
        this.joplinSession_ = null;
        this.profileLocker_ = null;
        this.ipcServer_ = null;
        this.ipcStartPort_ = 2658;
        this.startPeriodicUpdateCheck = (updateInterval = AutoUpdaterService_1.defaultUpdateInterval) => {
            this.stopPeriodicUpdateCheck();
            this.updatePollInterval_ = setInterval(() => {
                void this.updaterService_.checkForUpdates(false);
            }, updateInterval);
            (0, timers_1.setTimeout)(this.updaterService_.checkForUpdates, AutoUpdaterService_1.initialUpdateStartup);
        };
        this.stopPeriodicUpdateCheck = () => {
            if (this.updatePollInterval_) {
                clearInterval(this.updatePollInterval_);
                this.updatePollInterval_ = null;
                this.updaterService_ = null;
            }
        };
        this.electronApp_ = electronApp;
        this.env_ = env;
        this.isDebugMode_ = isDebugMode;
        this.profilePath_ = profilePath;
        this.initialCallbackUrl_ = initialCallbackUrl;
        this.isEndToEndTesting_ = isEndToEndTesting;
        this.profileLocker_ = new fs_1.FileLocker(`${this.profilePath_}/lock`);
        const mainProcessLogger = new Logger_1.default();
        this.mainProcessLoggerFilePath_ = `${profilePath}/log-main-process.txt`;
        mainProcessLogger.addTarget(Logger_1.TargetType.File, {
            path: this.mainProcessLoggerFilePath_,
        });
        this.ipcLogger_ = Logger_1.default.create('IPC', mainProcessLogger);
        this.appLogger_ = Logger_1.default.create('App', mainProcessLogger);
    }
    electronApp() {
        return this.electronApp_;
    }
    mainWindow() {
        return this.win_;
    }
    activeWindow() {
        var _a;
        return (_a = electron_1.BrowserWindow.getFocusedWindow()) !== null && _a !== void 0 ? _a : this.win_;
    }
    ipcServerStarted() {
        return !!this.ipcServer_;
    }
    mainProcessLogFilePath() {
        return this.mainProcessLoggerFilePath_;
    }
    windowById(joplinId) {
        if (joplinId === reducer_1.defaultWindowId) {
            return this.mainWindow();
        }
        const windowData = this.secondaryWindows_.get(joplinId);
        if (windowData !== undefined) {
            return electron_1.BrowserWindow.fromId(windowData.electronId);
        }
        return null;
    }
    windowIdFromWebContents(webContents) {
        var _a;
        const browserWindow = electron_1.BrowserWindow.fromWebContents(webContents);
        // Convert from electron IDs to Joplin IDs.
        const targetElectronId = browserWindow.id;
        if (((_a = this.win_) === null || _a === void 0 ? void 0 : _a.id) === targetElectronId) {
            return 'default';
        }
        for (const [joplinId, { electronId }] of this.secondaryWindows_) {
            if (electronId === targetElectronId) {
                return joplinId;
            }
        }
        return null;
    }
    allAppWindows() {
        const allWindowIds = [...this.secondaryWindows_.keys(), reducer_1.defaultWindowId];
        return allWindowIds.map(id => this.windowById(id));
    }
    env() {
        return this.env_;
    }
    initialCallbackUrl() {
        return this.initialCallbackUrl_;
    }
    // Call when the app fails in a significant way.
    //
    // Assumes that the renderer process may be in an invalid state and so cannot
    // be accessed.
    async handleAppFailure(errorMessage, canIgnore, isTesting) {
        await (0, bridge_1.default)().captureException(new Error(errorMessage));
        if (this.win_ && this.win_.isDestroyed()) {
            return;
        }
        const buttons = [];
        buttons.push((0, locale_1._)('Quit'));
        const exitIndex = 0;
        if (canIgnore) {
            buttons.push((0, locale_1._)('Ignore'));
        }
        const restartIndex = buttons.length;
        buttons.push((0, locale_1._)('Restart in safe mode'));
        const { response } = await electron_2.dialog.showMessageBox({
            message: (0, locale_1._)('An error occurred: %s', errorMessage),
            buttons,
        });
        if (response === restartIndex) {
            await (0, restartInSafeModeFromMain_1.default)();
            // A hung renderer seems to prevent the process from exiting completely.
            // In this case, crashing the renderer allows the window to close.
            //
            // Also only run this if not testing (crashing the renderer breaks automated
            // tests).
            if (this.win_ && !this.win_.isDestroyed() && !this.win_.webContents.isCrashed() && !isTesting) {
                this.win_.webContents.forcefullyCrashRenderer();
            }
        }
        else if (response === exitIndex) {
            process.exit(1);
        }
    }
    createJoplinSession_() {
        const sessionPath = path.join(this.profilePath_, 'internal');
        const joplinSession = electron_1.session.fromPath(sessionPath, { cache: false });
        // One-time migration: copy existing dictionary words from the old Electron userData location into the new session.
        const migrationFlagPath = path.join(this.profilePath_, 'spell-checker-migration-done');
        if (!fs.existsSync(migrationFlagPath)) {
            try {
                const wordsToMigrate = new Set();
                const oldElectronDictPath = path.join(this.electronApp_.getPath('userData'), 'Custom Dictionary.txt');
                if (fs.existsSync(oldElectronDictPath)) {
                    const content = fs.readFileSync(oldElectronDictPath, 'utf8');
                    const words = content.split('\n')
                        .map((w) => w.trim())
                        .filter((w) => w.length > 0 && !/^checksum_v1\s*=/.test(w));
                    for (const word of words) {
                        wordsToMigrate.add(word);
                    }
                }
                for (const word of wordsToMigrate) {
                    joplinSession.addWordToSpellCheckerDictionary(word);
                }
                fs.writeFileSync(migrationFlagPath, '', 'utf8');
            }
            catch (error) {
                console.warn('Failed to migrate spell-check dictionary:', error);
            }
        }
        return joplinSession;
    }
    createWindow() {
        // Set to true to view errors if the application does not start
        const debugEarlyBugs = this.env_ === 'dev' || this.isDebugMode_;
        const windowStateKeeper = require('electron-window-state');
        const stateOptions = {
            defaultWidth: Math.round(0.8 * electron_1.screen.getPrimaryDisplay().workArea.width),
            defaultHeight: Math.round(0.8 * electron_1.screen.getPrimaryDisplay().workArea.height),
            file: `window-state-${this.env_}.json`,
        };
        if (this.profilePath_)
            stateOptions.path = this.profilePath_;
        // Load the previous state with fallback to defaults
        const windowState = windowStateKeeper(stateOptions);
        const windowOptions = {
            x: windowState.x,
            y: windowState.y,
            width: windowState.width,
            height: windowState.height,
            minWidth: 100,
            minHeight: 100,
            // A backgroundColor is needed to enable sub-pixel rendering.
            // Based on https://www.electronjs.org/docs/latest/faq#the-font-looks-blurry-what-is-this-and-what-can-i-do,
            // this needs to be a non-transparent color:
            backgroundColor: electron_1.nativeTheme.shouldUseDarkColors ? '#333' : '#fff',
            webPreferences: {
                session: this.joplinSession_,
                nodeIntegration: true,
                contextIsolation: false,
                spellcheck: true,
                // enableRemoteModule was removed from Electron's published types but @electron/remote still relies on it at runtime
                enableRemoteModule: true,
            },
            // We start with a hidden window, which is then made visible depending on the showTrayIcon setting
            // https://github.com/laurent22/joplin/issues/2031
            //
            // On Linux/GNOME, however, the window doesn't show correctly if show is false initially:
            // https://github.com/laurent22/joplin/issues/8256
            show: debugEarlyBugs || shim.isGNOME(),
        };
        // Linux icon workaround for bug https://github.com/electron-userland/electron-builder/issues/2098
        // Fix: https://github.com/electron-userland/electron-builder/issues/2269
        if (shim.isLinux())
            windowOptions.icon = path.join(__dirname, '..', 'build/icons/128x128.png');
        this.win_ = new electron_1.BrowserWindow(windowOptions);
        require('@electron/remote/main').enable(this.win_.webContents);
        // Add Referer header for YouTube embeds to fix Error 153
        this.win_.webContents.session.webRequest.onBeforeSendHeaders({ urls: ['*://*.youtube.com/*', '*://*.youtube-nocookie.com/*'] }, (details, callback) => {
            details.requestHeaders['Referer'] = 'https://joplinapp.org/';
            callback({ requestHeaders: details.requestHeaders });
        });
        if (!electron_1.screen.getDisplayMatching(this.win_.getBounds())) {
            const { width: windowWidth, height: windowHeight } = this.win_.getBounds();
            const { width: primaryDisplayWidth, height: primaryDisplayHeight } = electron_1.screen.getPrimaryDisplay().workArea;
            this.win_.setPosition(primaryDisplayWidth / 2 - windowWidth, primaryDisplayHeight / 2 - windowHeight);
        }
        let unresponsiveTimeout = null;
        this.win_.webContents.on('unresponsive', () => {
            if (!this.enableUnresponsiveCheck_)
                return;
            // Don't show the "unresponsive" dialog immediately -- the "unresponsive" event
            // can be fired when showing a dialog or modal (e.g. the update dialog).
            //
            // This gives us an opportunity to cancel it.
            if (unresponsiveTimeout === null) {
                const delayMs = 1000;
                unresponsiveTimeout = (0, timers_1.setTimeout)(() => {
                    unresponsiveTimeout = null;
                    void this.handleAppFailure((0, locale_1._)('Window unresponsive.'), true);
                }, delayMs);
            }
        });
        this.win_.webContents.on('responsive', () => {
            if (unresponsiveTimeout !== null) {
                (0, timers_1.clearTimeout)(unresponsiveTimeout);
                unresponsiveTimeout = null;
            }
        });
        this.win_.webContents.on('render-process-gone', async (_event) => {
            await this.handleAppFailure('Renderer process gone.', false);
        });
        this.win_.webContents.on('did-fail-load', async (event) => {
            if (event.isMainFrame) {
                await this.handleAppFailure('Renderer process failed to load', false);
            }
        });
        this.mainWindowHidden_ = !windowOptions.show;
        this.win_.on('hide', () => {
            this.mainWindowHidden_ = true;
        });
        this.win_.on('show', () => {
            this.mainWindowHidden_ = false;
        });
        void this.win_.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        }));
        // Note that on Windows, calling openDevTools() too early results in a white window with no error message.
        // Waiting for one of the ready events might work but they might not be triggered if there's an error, so
        // the easiest is to use a timeout. Keep in mind that if you get a white window on Windows it might be due
        // to this line though.
        //
        // Don't show the dev tools while end-to-end testing to simplify the logic that finds the main window.
        if (debugEarlyBugs && !this.isEndToEndTesting_) {
            // Since a recent release of Electron (v34?), calling openDevTools() here does nothing
            // if a plugin devtool window is already opened. Maybe because they do a check on
            // `isDevToolsOpened` which indeed returns `true` (but shouldn't since it's for a
            // different window). However, if you open the dev tools twice from the Help menu it
            // works. So instead we do that here and call openDevTool() three times.
            let openDevToolCount = 0;
            const openDevToolInterval = setInterval(() => {
                try {
                    this.win_.webContents.openDevTools();
                    openDevToolCount++;
                    if (openDevToolCount >= 3) {
                        clearInterval(openDevToolInterval);
                    }
                }
                catch (error) {
                    // This will throw an exception "Object has been destroyed" if the app is closed
                    // in less that the timeout interval. It can be ignored.
                    this.appLogger_.warn('Error opening dev tools', error);
                }
            }, 1000);
        }
        const sendWindowFocused = (focusedWebContents) => {
            const joplinId = this.windowIdFromWebContents(focusedWebContents);
            if (joplinId !== null) {
                this.win_.webContents.send('window-focused', joplinId);
            }
        };
        const addWindowEventHandlers = (webContents) => {
            // will-frame-navigate is fired by clicking on a link within the BrowserWindow.
            webContents.on('will-frame-navigate', event => {
                // If the link changes the URL of the browser window,
                if (event.isMainFrame) {
                    event.preventDefault();
                    void (0, bridge_1.default)().openExternal(event.url);
                }
            });
            // Override calls to window.open and links with target="_blank": Open most in a browser instead
            // of Electron:
            webContents.setWindowOpenHandler((event) => {
                if (event.url === 'about:blank') {
                    // Script-controlled pages: Used for opening notes in new windows
                    return {
                        action: 'allow',
                        overrideBrowserWindowOptions: {
                            webPreferences: {
                                nodeIntegration: false,
                                preload: path.resolve(__dirname, './utils/window/secondaryWindowPreload.js'),
                            },
                        },
                    };
                }
                else if (event.url.match(/^https?:\/\//)) {
                    void (0, bridge_1.default)().openExternal(event.url);
                }
                return { action: 'deny' };
            });
            webContents.on('did-create-window', (event) => {
                addWindowEventHandlers(event.webContents);
            });
            const onFocus = () => {
                sendWindowFocused(webContents);
            };
            webContents.on('focus', onFocus);
        };
        addWindowEventHandlers(this.win_.webContents);
        this.win_.on('close', (event) => {
            // If it's on macOS, the app is completely closed only if the user chooses to close the app (willQuitApp_ will be true)
            // otherwise the window is simply hidden, and will be re-open once the app is "activated" (which happens when the
            // user clicks on the icon in the task bar).
            // On Windows and Linux, the app is closed when the window is closed *except* if the tray icon is used. In which
            // case the app must be explicitly closed with Ctrl+Q or by right-clicking on the tray icon and selecting "Exit".
            this.appLogger_.info('[appClose] Window close event - willQuitApp_:', this.willQuitApp_, 'rendererProcessQuitReply_:', this.rendererProcessQuitReply_, 'secondaryWindows:', this.secondaryWindows_.size, 'trayShown:', this.trayShown());
            let isGoingToExit = false;
            if (process.platform === 'darwin') {
                if (this.willQuitApp_) {
                    isGoingToExit = true;
                }
                else {
                    this.appLogger_.info('[appClose] macOS: willQuitApp_ is false, hiding window instead of closing');
                    event.preventDefault();
                    const w = this.win_;
                    if (!w)
                        return;
                    if (w.isFullScreen()) {
                        // leave fullscreen, then hide
                        w.once('leave-full-screen', () => w.hide());
                        w.setFullScreen(false);
                    }
                    else {
                        w.hide();
                    }
                }
            }
            else {
                const hasBackgroundWindows = this.secondaryWindows_.size > 0;
                if ((hasBackgroundWindows || this.trayShown()) && !this.willQuitApp_) {
                    event.preventDefault();
                    this.win_.hide();
                }
                else {
                    isGoingToExit = true;
                }
            }
            this.appLogger_.info('[appClose] isGoingToExit:', isGoingToExit);
            if (isGoingToExit) {
                if (!this.rendererProcessQuitReply_) {
                    // If we haven't notified the renderer process yet, do it now
                    // so that it can tell us if we can really close the app or not.
                    // Search for "appClose" event for closing logic on renderer side.
                    this.appLogger_.info('[appClose] Sending appClose to renderer, waiting for reply...');
                    event.preventDefault();
                    if (this.win_)
                        this.win_.webContents.send('appClose');
                }
                else {
                    // If the renderer process has responded, check if we can close or not
                    this.appLogger_.info('[appClose] Got renderer reply - canClose:', this.rendererProcessQuitReply_.canClose);
                    if (this.rendererProcessQuitReply_.canClose) {
                        // Really quit the app
                        this.appLogger_.info('[appClose] Closing app now');
                        this.rendererProcessQuitReply_ = null;
                        this.win_ = null;
                    }
                    else {
                        // Wait for renderer to finish task
                        this.appLogger_.info('[appClose] Renderer says cannot close yet, waiting...');
                        event.preventDefault();
                        this.rendererProcessQuitReply_ = null;
                    }
                }
            }
        });
        electron_2.ipcMain.on('secondary-window-added', (event, windowId) => {
            const window = electron_1.BrowserWindow.fromWebContents(event.sender);
            const electronWindowId = window === null || window === void 0 ? void 0 : window.id;
            this.secondaryWindows_.set(windowId, { electronId: electronWindowId });
            // Match the main window's zoom:
            window.webContents.setZoomFactor(this.mainWindow().webContents.getZoomFactor());
            window.once('close', (event) => {
                // Check both: BrowserWindow and webContents can be destroyed independently
                if (this.win_ && !this.win_.isDestroyed() && !this.win_.webContents.isDestroyed()) {
                    this.win_.webContents.send('secondary-window-closing', windowId);
                }
                if (this.secondaryWindows_.has(windowId)) {
                    this.secondaryWindows_.delete(windowId);
                    // Avoid closing a destroyed window. Closing a destroyed window results in the following error:
                    //   Error: Render frame was disposed before WebFrameMain could be accessed
                    const stillOpen = !window.isDestroyed();
                    if (stillOpen) {
                        event.preventDefault();
                        // As of March 2026, Electron crashes with "Assertion failed: (Environment::GetCurrent(isolate)) == (env)" if the native 'close'
                        // event is allowed to close a secondary window. As a workaround, briefly hide the window and .close() it later.
                        // See https://github.com/laurent22/joplin/issues/14628.
                        window.hide();
                        (0, timers_1.setTimeout)(() => {
                            if (!window.isDestroyed()) {
                                window.close();
                            }
                        }, 100);
                    }
                }
                const allSecondaryWindowsClosed = this.secondaryWindows_.size === 0;
                const mainWindowVisuallyClosed = this.mainWindowHidden_;
                if (allSecondaryWindowsClosed && mainWindowVisuallyClosed && !this.trayShown()) {
                    // Gracefully quit the app if the user has closed all windows
                    this.win_.close();
                }
            });
            if (window.isFocused()) {
                sendWindowFocused(window.webContents);
            }
        });
        electron_2.ipcMain.on('asynchronous-message', (_event, message, args) => {
            if (message === 'appCloseReply') {
                // We got the response from the renderer process:
                // save the response and try quit again.
                this.rendererProcessQuitReply_ = args;
                this.quit();
            }
        });
        // This handler receives IPC messages from a plugin or from the main window,
        // and forwards it to the main window or the plugin window.
        electron_2.ipcMain.on('pluginMessage', (_event, message) => {
            try {
                if (message.target === 'mainWindow') {
                    this.win_.webContents.send('pluginMessage', message);
                }
                if (message.target === 'plugin') {
                    const win = this.pluginWindows_[message.pluginId];
                    if (!win) {
                        this.ipcLogger_.error(`Trying to send IPC message to non-existing plugin window: ${message.pluginId}`);
                        return;
                    }
                    win.webContents.send('pluginMessage', message);
                }
            }
            catch (error) {
                // An error might happen when the app is closing and a plugin
                // sends a message. In which case, the above code would try to
                // access a destroyed webview.
                // https://github.com/laurent22/joplin/issues/4570
                this.appLogger_.error('Could not process plugin message:', message);
                this.appLogger_.error(error);
            }
        });
        electron_2.ipcMain.on('apply-update-now', () => {
            this.updaterService_.updateApp();
        });
        electron_2.ipcMain.on('check-for-updates', () => {
            void this.updaterService_.checkForUpdates(true);
        });
        // Let us register listeners on the window, so we can update the state
        // automatically (the listeners will be removed when the window is closed)
        // and restore the maximized or full screen state
        windowState.manage(this.win_);
        // HACK: Ensure the window is hidden, as `windowState.manage` may make the window
        // visible with isMaximized set to true in window-state-${this.env_}.json.
        // https://github.com/laurent22/joplin/issues/2365
        if (!windowOptions.show) {
            this.win_.hide();
        }
    }
    registerPluginWindow(pluginId, window) {
        this.pluginWindows_[pluginId] = window;
    }
    async waitForElectronAppReady() {
        if (this.electronApp().isReady())
            return Promise.resolve();
        return new Promise((resolve) => {
            const iid = setInterval(() => {
                if (this.electronApp().isReady()) {
                    clearInterval(iid);
                    resolve(null);
                }
            }, 10);
        });
    }
    onExit() {
        this.stopPeriodicUpdateCheck();
        this.profileLocker_.unlockSync();
        // Probably doesn't matter if the server is not closed cleanly? Thus the lack of `await`
        // eslint-disable-next-line promise/prefer-await-to-then -- Needed here because onExit() is not async
        void (0, ipc_1.stopServer)(this.ipcServer_).catch(_error => {
            // Ignore it since we're stopping, and to prevent unnecessary messages.
        });
    }
    quit() {
        this.appLogger_.info('[appClose] quit() called');
        this.onExit();
        this.electronApp_.quit();
    }
    quitWithSyncCheck(dispatch, syncPending) {
        this.appLogger_.info('[appClose] quitWithSyncCheck() called - syncPending:', syncPending);
        if (syncPending) {
            dispatch({ type: 'QUIT_SYNC_DIALOG_OPEN' });
        }
        else {
            this.quit();
        }
    }
    exit(errorCode = 0) {
        this.onExit();
        this.electronApp_.exit(errorCode);
    }
    trayShown() {
        return !!this.tray_;
    }
    // This method is used in macOS only to hide the whole app (and not just the main window)
    // including the menu bar. This follows the macOS way of hiding an app.
    hide() {
        this.electronApp_.hide();
    }
    buildDir() {
        if (this.buildDir_)
            return this.buildDir_;
        let dir = `${__dirname}/build`;
        if (!fs.pathExistsSync(dir)) {
            dir = `${(0, path_utils_1.dirname)(__dirname)}/build`;
            if (!fs.pathExistsSync(dir))
                throw new Error('Cannot find build dir');
        }
        this.buildDir_ = dir;
        return dir;
    }
    trayIconFilename_() {
        let output = '';
        if (process.platform === 'darwin') {
            output = 'macos-16x16Template.png'; // Electron Template Image format
        }
        else {
            output = '16x16.png';
        }
        if (this.env_ === 'dev')
            output = '16x16-dev.png';
        return output;
    }
    // Note: this must be called only after the "ready" event of the app has been dispatched
    createTray(contextMenu) {
        try {
            this.tray_ = new electron_1.Tray(`${this.buildDir()}/icons/${this.trayIconFilename_()}`);
            this.tray_.setToolTip(this.electronApp_.name);
            this.tray_.setContextMenu(contextMenu);
            this.tray_.on('click', () => {
                if (!this.mainWindow()) {
                    this.appLogger_.warn('The window object was not available during the click event from tray icon');
                    return;
                }
                if (!this.mainWindow().isVisible()) {
                    this.mainWindow().show();
                }
                else {
                    this.mainWindow().hide();
                }
            });
        }
        catch (error) {
            this.appLogger_.error('Cannot create tray', error);
        }
    }
    destroyTray() {
        if (!this.tray_)
            return;
        this.tray_.destroy();
        this.tray_ = null;
    }
    async sendCrossAppIpcMessage(message, port = null, options = null) {
        this.ipcLogger_.info('Sending message:', message);
        if (port === null)
            port = this.ipcStartPort_;
        if (this.ipcServer_) {
            return await (0, ipc_1.sendMessage)(port, Object.assign(Object.assign({}, message), { sourcePort: this.ipcServer_.port, secretKey: this.ipcServer_.secretKey }), Object.assign({ logger: this.ipcLogger_ }, options));
        }
        else {
            return [];
        }
    }
    async ensureSingleInstance() {
        // When end-to-end testing, multiple instances of Joplin are intentionally created at the same time,
        // or very close to one another. The single instance handling logic can interfere with this, so disable it.
        if (this.isEndToEndTesting_)
            return false;
        const activateWindow = (argv) => {
            const win = this.mainWindow();
            if (!win)
                return;
            if (win.isMinimized())
                win.restore();
            win.show();
            // eslint-disable-next-line no-restricted-properties
            win.focus();
            if (process.platform !== 'darwin') {
                const url = argv.find((arg) => (0, callbackUrlUtils_1.isCallbackUrl)(arg));
                if (url) {
                    void this.openCallbackUrl(url);
                }
            }
        };
        const messageHandlers = {
            'onSecondInstance': async (message) => {
                const data = message.data;
                if (data.profilePath === this.profilePath_)
                    activateWindow(data.argv);
            },
            'restartAltInstance': async (message) => {
                if ((0, bridge_1.default)().altInstanceId())
                    return false;
                // We do this in a timeout after a short interval because we need this call to
                // return the response immediately, so that the caller can call `quit()`
                (0, timers_1.setTimeout)(async () => {
                    const maxWait = 10000;
                    const interval = 300;
                    const loopCount = Math.ceil(maxWait / interval);
                    let callingAppGone = false;
                    for (let i = 0; i < loopCount; i++) {
                        const response = await this.sendCrossAppIpcMessage({
                            action: 'ping',
                            data: null,
                            secretKey: this.ipcServer_.secretKey,
                        }, message.sourcePort, {
                            sendToSpecificPortOnly: true,
                        });
                        if (!response.length) {
                            callingAppGone = true;
                            break;
                        }
                        await (0, time_1.msleep)(interval);
                    }
                    if (callingAppGone) {
                        // Wait a bit more because even if the app is not responding, the process
                        // might still be there for a short while.
                        await (0, time_1.msleep)(1000);
                        this.ipcLogger_.warn('restartAltInstance: App is gone - restarting it');
                        void (0, bridge_1.default)().launchAltAppInstance(this.env());
                    }
                    else {
                        this.ipcLogger_.warn('restartAltInstance: Could not restart calling app because it was still open');
                    }
                }, 100);
                return true;
            },
            'ping': async (_message) => {
                return true;
            },
        };
        const defaultProfileDir = (0, determineBaseAppDirs_1.default)('', (0, getAppName_1.default)(true, this.env() === 'dev'), '').rootProfileDir;
        const secretKeyFilePath = `${defaultProfileDir}/ipc_secret_key.txt`;
        this.ipcLogger_.info('Starting server using secret key:', secretKeyFilePath);
        try {
            this.ipcServer_ = await (0, ipc_1.startServer)(this.ipcStartPort_, secretKeyFilePath, async (message) => {
                if (messageHandlers[message.action]) {
                    this.ipcLogger_.info('Got message:', message);
                    return messageHandlers[message.action](message);
                }
                throw (0, ipc_1.newHttpError)(404);
            }, {
                logger: this.ipcLogger_,
            });
        }
        catch (error) {
            this.ipcLogger_.error('Could not start server:', error);
            this.ipcServer_ = null;
        }
        // First check that no other app is running from that profile folder
        const gotAppLock = await this.profileLocker_.lock();
        if (gotAppLock)
            return false;
        if (this.ipcServer_) {
            const message = {
                action: 'onSecondInstance',
                data: {
                    senderPort: this.ipcServer_.port,
                    profilePath: this.profilePath_,
                    argv: process.argv,
                },
                secretKey: this.ipcServer_.secretKey,
            };
            await this.sendCrossAppIpcMessage(message);
        }
        this.quit();
        if (this.env() === 'dev')
            this.appLogger_.warn(`Closing the application because another instance is already running, or the previous instance was force-quit within the last ${Math.round(this.profileLocker_.options.interval / time_1.Second)} seconds.`);
        return true;
    }
    // Electron's autoUpdater has to be init from the main process
    initializeAutoUpdaterService(logger, devMode, includePreReleases) {
        if (shim.isWindows() || shim.isMac()) {
            if (!this.updaterService_) {
                this.updaterService_ = new AutoUpdaterService_1.default(this.win_, logger, devMode, includePreReleases);
                this.startPeriodicUpdateCheck();
            }
        }
    }
    getContentProtocolHandler() {
        return this.customProtocolHandlers_.appContent;
    }
    getPluginProtocolHandler() {
        return this.customProtocolHandlers_.pluginContent;
    }
    setEnableUnresponsiveCheck(enabled) {
        this.enableUnresponsiveCheck_ = enabled;
    }
    async fixLinuxAccessibility_() {
        if (this.electronApp().accessibilitySupportEnabled)
            return;
        const isOrcaRunning = async () => {
            if (!shim.isLinux())
                return false;
            try {
                const matchingProcesses = await (0, utils_1.execCommand)(['ps', '--no-headers', '-C', 'orca'], { quiet: true });
                return matchingProcesses.trim().length > 0;
            }
            catch (error) {
                if (error.stderr || error.exitCode !== 1) {
                    this.appLogger_.error('Failed to check for and enable accessibility support:', error.stderr);
                }
                return false;
            }
        };
        // Work around https://issues.chromium.org/issues/431257156 by force-enabling accessibility
        // when Orca (a screen reader) is running:
        if (await isOrcaRunning()) {
            this.appLogger_.info('Linux accessibility: Enabling full accessibility support.');
            this.electronApp().setAccessibilitySupportEnabled(true);
        }
    }
    async start() {
        // Since we are doing other async things before creating the window, we might miss
        // the "ready" event. So we use the function below to make sure that the app is ready.
        await this.waitForElectronAppReady();
        const alreadyRunning = await this.ensureSingleInstance();
        if (alreadyRunning)
            return;
        await this.fixLinuxAccessibility_();
        // Session must be created before handleCustomProtocols() so both use the same object.
        this.joplinSession_ = this.createJoplinSession_();
        this.customProtocolHandlers_ = (0, handleCustomProtocols_1.default)(this.joplinSession_);
        this.createWindow();
        this.electronApp_.on('before-quit', () => {
            this.appLogger_.info('[appClose] before-quit event fired, setting willQuitApp_ = true');
            this.willQuitApp_ = true;
            (0, bridge_1.default)().unregisterGlobalHotkey();
        });
        this.electronApp_.on('window-all-closed', () => {
            this.appLogger_.info('[appClose] window-all-closed event fired');
            this.quit();
        });
        this.electronApp_.on('activate', () => {
            this.win_.show();
        });
        this.electronApp_.on('open-url', (event, url) => {
            event.preventDefault();
            void this.openCallbackUrl(url);
        });
    }
    async openCallbackUrl(url) {
        this.win_.webContents.send('asynchronous-message', 'openCallbackUrl', {
            url: url,
        });
    }
}
exports.default = ElectronAppWrapper;
//# sourceMappingURL=ElectronAppWrapper.js.map