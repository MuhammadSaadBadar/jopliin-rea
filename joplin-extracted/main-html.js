"use strict";
// This is the initialization for the Electron RENDERER process
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
// Disable React message in console "Download the React DevTools for a better development experience"
// https://stackoverflow.com/questions/42196819/disable-hide-download-the-react-devtools#42196820
// eslint-disable-next-line no-undef, @typescript-eslint/no-explicit-any
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    inject: function () { },
    onCommitFiberRoot: function () { },
    onCommitFiberUnmount: function () { },
};
require("./utils/initReact");
require("./utils/sourceMapSetup");
const app_1 = __importDefault(require("./app"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const BaseItem_1 = __importDefault(require("@joplin/lib/models/BaseItem"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const NoteTag_1 = __importDefault(require("@joplin/lib/models/NoteTag"));
const MasterKey_1 = __importDefault(require("@joplin/lib/models/MasterKey"));
const Setting_1 = __importStar(require("@joplin/lib/models/Setting"));
const Revision_1 = __importDefault(require("@joplin/lib/models/Revision"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const fs_driver_node_1 = __importDefault(require("@joplin/lib/fs-driver-node"));
const bridge_1 = __importDefault(require("./services/bridge"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const shim_init_node_1 = require("@joplin/lib/shim-init-node");
const EncryptionService_1 = __importDefault(require("@joplin/lib/services/e2ee/EncryptionService"));
const file_api_driver_local_1 = __importDefault(require("@joplin/lib/file-api-driver-local"));
const React = __importStar(require("react"));
const nodeSqlite = require("sqlite3");
const sqliteVec = require("sqlite-vec");
const path = __importStar(require("path"));
const initLib_1 = __importDefault(require("@joplin/lib/initLib"));
const PerformanceLogger_1 = __importDefault(require("@joplin/lib/PerformanceLogger"));
const pdfJs = __importStar(require("pdfjs-dist"));
const is_apple_silicon_1 = require("is-apple-silicon");
require('@sentry/electron/renderer');
// Allows components to use React as a global
window.React = React;
const perfLogger = PerformanceLogger_1.default.create();
const main = async () => {
    // eslint-disable-next-line no-console
    console.info(`Environment: ${(0, bridge_1.default)().env()}`);
    const fsDriver = new fs_driver_node_1.default();
    Logger_1.default.fsDriver_ = fsDriver;
    Resource_1.default.fsDriver_ = fsDriver;
    EncryptionService_1.default.fsDriver_ = fsDriver;
    file_api_driver_local_1.default.fsDriver_ = fsDriver;
    // That's not good, but it's to avoid circular dependency issues
    // in the BaseItem class.
    BaseItem_1.default.loadClass('Note', Note_1.default);
    BaseItem_1.default.loadClass('Folder', Folder_1.default);
    BaseItem_1.default.loadClass('Resource', Resource_1.default);
    BaseItem_1.default.loadClass('Tag', Tag_1.default);
    BaseItem_1.default.loadClass('NoteTag', NoteTag_1.default);
    BaseItem_1.default.loadClass('MasterKey', MasterKey_1.default);
    BaseItem_1.default.loadClass('Revision', Revision_1.default);
    Setting_1.default.setConstant('appId', (0, bridge_1.default)().appId());
    Setting_1.default.setConstant('appType', Setting_1.AppType.Desktop);
    Setting_1.default.setConstant('pluginAssetDir', `${__dirname}/pluginAssets`);
    // eslint-disable-next-line no-console
    console.info(`appId: ${Setting_1.default.value('appId')}`);
    // eslint-disable-next-line no-console
    console.info(`appType: ${Setting_1.default.value('appType')}`);
    let keytar;
    try {
        keytar = shim_1.default.platformSupportsKeyChain() ? require('keytar') : null;
    }
    catch (error) {
        console.error('Cannot load keytar - keychain support will be disabled', error);
        keytar = null;
    }
    function appVersion() {
        const p = require('./packageInfo.js');
        return p.version;
    }
    pdfJs.GlobalWorkerOptions.workerSrc = `${(0, bridge_1.default)().electronApp().buildDir()}/pdf.worker.min.js`;
    // onnxruntime-node loads a native binding at require time. Wrap it so a missing or broken
    // prebuilt degrades to "embeddings unavailable" rather than crashing the whole app at startup.
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- onnxruntime-node has its own typings; we only need to forward the loaded module to the shim
    let onnxRuntime = null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports -- guarded require avoids a top-level import that would crash on a missing native binding
        onnxRuntime = require('onnxruntime-node');
    }
    catch (error) {
        // eslint-disable-next-line no-console -- main-html runs before the logger is initialised below
        console.warn('onnxruntime-node failed to load; AI embeddings will be unavailable:', error.message);
    }
    // sqlite-vec's wrapper resolves the native extension path via require.resolve,
    // which inside a packaged Electron app returns a path inside app.asar — but
    // dlopen(3) can't read out of asar archives. The per-platform packages are
    // listed in asarUnpack so the real file lives in app.asar.unpacked/, but the
    // wrapper doesn't know that. Rewrite the path here so loadExtension() points
    // at the unpacked copy.
    const sqliteVecUnpacked = Object.assign(Object.assign({}, sqliteVec), { getLoadablePath: () => sqliteVec.getLoadablePath().replace(`${path.sep}app.asar${path.sep}`, `${path.sep}app.asar.unpacked${path.sep}`) });
    (0, shim_init_node_1.shimInit)({
        keytar,
        React,
        appVersion,
        electronBridge: (0, bridge_1.default)(),
        nodeSqlite,
        sqliteVec: sqliteVecUnpacked,
        onnxRuntime,
        pdfJs: pdfJs,
        isAppleSilicon: is_apple_silicon_1.isAppleSilicon,
    });
    const logger = new Logger_1.default();
    Logger_1.default.initializeGlobalLogger(logger);
    (0, initLib_1.default)(logger);
    const startResult = await (0, app_1.default)().start((0, bridge_1.default)().processArgv());
    if (!startResult || !startResult.action) {
        require('./gui/Root');
    }
    else if (startResult.action === 'upgradeSyncTarget') {
        require('./gui/Root_UpgradeSyncTarget');
    }
};
perfLogger.track('main', main).catch((error) => {
    const env = (0, bridge_1.default)().env();
    console.error(error);
    let errorMessage;
    if (error.code === 'flagError') {
        errorMessage = error.message;
    }
    else {
        // If something goes wrong at this stage we don't have a console or a log file
        // so display the error in a message box.
        const msg = ['Fatal error:', error.message];
        if (error.fileName)
            msg.push(error.fileName);
        if (error.lineNumber)
            msg.push(error.lineNumber);
        if (error.stack)
            msg.push(error.stack);
        errorMessage = msg.join('\n\n');
    }
    // In dev, we give the option to leave the app open as debug statements in the
    // console can be useful
    const canIgnore = env === 'dev';
    void (0, bridge_1.default)().electronApp().handleAppFailure(errorMessage, canIgnore);
});
//# sourceMappingURL=main-html.js.map