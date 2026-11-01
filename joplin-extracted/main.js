"use strict";
// This is the basic initialization for the Electron MAIN process
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils/sourceMapSetup");
const electron_1 = require("electron");
require('@electron/remote/main').initialize();
const ElectronAppWrapper_1 = __importDefault(require("./ElectronAppWrapper"));
const fs_extra_1 = require("fs-extra");
const bridge_1 = require("./bridge");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const fs_driver_node_1 = __importDefault(require("@joplin/lib/fs-driver-node"));
const envFromArgs_1 = __importDefault(require("@joplin/lib/envFromArgs"));
const packageInfo = require('./packageInfo.js');
const callbackUrlUtils_1 = require("@joplin/lib/callbackUrlUtils");
const determineBaseAppDirs_1 = __importDefault(require("@joplin/lib/determineBaseAppDirs"));
const registerCustomProtocols_1 = __importDefault(require("./utils/customProtocols/registerCustomProtocols"));
// Electron takes the application name from package.json `name` and
// displays this in the tray icon toolip and message box titles, however in
// our case it's a string like "@joplin/app-desktop". It's also supposed to
// check the productName key but is not doing it, so here set the
// application name to the right string.
electron_1.app.setName(packageInfo.name);
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled promise rejection', p, 'reason:', reason);
    process.exit(1);
});
const getFlagValueFromArgs = (args, flag, defaultValue) => {
    if (!args)
        return null;
    const index = args.indexOf(flag);
    if (index <= 0 || index >= args.length - 1)
        return defaultValue;
    const value = args[index + 1];
    return value ? value : defaultValue;
};
Logger_1.default.fsDriver_ = new fs_driver_node_1.default();
const env = (0, envFromArgs_1.default)(process.argv);
const profileFromArgs = getFlagValueFromArgs(process.argv, '--profile', null);
const isDebugMode = !!process.argv && process.argv.indexOf('--debug') >= 0;
const isEndToEndTesting = !!((_a = process.argv) === null || _a === void 0 ? void 0 : _a.includes('--running-tests'));
const altInstanceId = getFlagValueFromArgs(process.argv, '--alt-instance-id', '');
// We initialize all these variables here because they are needed from the main process. They are
// then passed to the renderer process via the bridge.
const appId = `net.cozic.joplin${env === 'dev' ? 'dev' : ''}-desktop`;
let appName = env === 'dev' ? 'joplindev' : 'joplin';
if (appId.indexOf('-desktop') >= 0)
    appName += '-desktop';
const { rootProfileDir } = (0, determineBaseAppDirs_1.default)(profileFromArgs, appName, altInstanceId);
// We create the profile dir as soon as we know where it's going to be located since it's used in
// various places early in the initialisation code.
(0, fs_extra_1.mkdirpSync)(rootProfileDir);
// Required for correct display of Windows notifications. Should be done near the beginning of startup. See
// https://www.electron.build/nsis.html#guid-vs-application-name
electron_1.app.setAppUserModelId(appId);
const settingsPath = `${rootProfileDir}/settings.json`;
let autoUploadCrashDumps = false;
if ((0, fs_extra_1.pathExistsSync)(settingsPath)) {
    const settingsContent = (0, fs_extra_1.readFileSync)(settingsPath, 'utf8');
    try {
        const settings = JSON.parse(settingsContent);
        autoUploadCrashDumps = !!settings && !!settings.autoUploadCrashDumps;
    }
    catch (error) {
        console.error(`Could not load settings: ${settingsPath}:`, error);
    }
}
electron_1.app.setAsDefaultProtocolClient('joplin');
void (0, registerCustomProtocols_1.default)();
const initialCallbackUrl = process.argv.find((arg) => (0, callbackUrlUtils_1.isCallbackUrl)(arg));
const wrapper = new ElectronAppWrapper_1.default(electron_1.app, {
    env, profilePath: rootProfileDir, isDebugMode, initialCallbackUrl, isEndToEndTesting,
});
globalThis.joplinBridge = ((0, bridge_1.initBridge)(wrapper, appId, appName, rootProfileDir, autoUploadCrashDumps, altInstanceId));
wrapper.start().catch((error) => {
    console.error('Electron App fatal error:');
    console.error(error);
});
//# sourceMappingURL=main.js.map