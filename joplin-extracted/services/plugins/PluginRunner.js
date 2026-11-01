"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasePluginRunner_1 = __importDefault(require("@joplin/lib/services/plugins/BasePluginRunner"));
const executeSandboxCall_1 = __importDefault(require("@joplin/lib/services/plugins/utils/executeSandboxCall"));
const bridge_1 = __importDefault(require("../bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const getPathToExecutable7Zip_1 = __importDefault(require("../../utils/7zip/getPathToExecutable7Zip"));
const getAssetPath_1 = __importDefault(require("../../utils/getAssetPath"));
// import BackOffHandler from './BackOffHandler';
const electron_1 = require("electron");
const logger = Logger_1.default.create('PluginRunner');
// Electron error messages are useless so wrap the renderer call and print
// additional information when an error occurs.
function ipcRendererSend(message, args) {
    try {
        return electron_1.ipcRenderer.send(message, args);
    }
    catch (error) {
        logger.error('Could not send IPC message:', message, ': ', args, error);
        throw error;
    }
}
var PluginMessageTarget;
(function (PluginMessageTarget) {
    PluginMessageTarget["MainWindow"] = "mainWindow";
    PluginMessageTarget["Plugin"] = "plugin";
})(PluginMessageTarget || (PluginMessageTarget = {}));
let callbackIndex = 1;
const callbackPromises = {};
function mapEventIdsToHandlers(pluginId, arg) {
    if (Array.isArray(arg)) {
        for (let i = 0; i < arg.length; i++) {
            arg[i] = mapEventIdsToHandlers(pluginId, arg[i]);
        }
        return arg;
    }
    else if (typeof arg === 'string' && arg.indexOf('___plugin_event_') === 0) {
        const eventId = arg;
        return async (...args) => {
            const callbackId = `cb_${pluginId}_${Date.now()}_${callbackIndex++}`;
            const promise = new Promise((resolve, reject) => {
                callbackPromises[callbackId] = { resolve, reject };
            });
            ipcRendererSend('pluginMessage', {
                callbackId: callbackId,
                target: PluginMessageTarget.Plugin,
                pluginId: pluginId,
                eventId: eventId,
                args: args,
            });
            return promise;
        };
    }
    else if (arg === null) {
        return null;
    }
    else if (arg === undefined) {
        return undefined;
    }
    else if (typeof arg === 'object') {
        const argAsRecord = arg;
        for (const n in argAsRecord) {
            argAsRecord[n] = mapEventIdsToHandlers(pluginId, argAsRecord[n]);
        }
    }
    return arg;
}
class PluginRunner extends BasePluginRunner_1.default {
    // private backOffHandlers_: Record<string, BackOffHandler> = {};
    constructor() {
        super();
        this.eventHandlers_ = {};
        this.eventHandler = this.eventHandler.bind(this);
    }
    async eventHandler(eventHandlerId, args) {
        const cb = this.eventHandlers_[eventHandlerId];
        return cb(...args);
    }
    // private backOffHandler(pluginId: string): BackOffHandler {
    // 	if (!this.backOffHandlers_[pluginId]) {
    // 		this.backOffHandlers_[pluginId] = new BackOffHandler(pluginId);
    // 	}
    // 	return this.backOffHandlers_[pluginId];
    // }
    async run(plugin, pluginApi) {
        const scriptPath = `${Setting_1.default.value('tempDir')}/plugin_${plugin.id}.js`;
        await shim_1.default.fsDriver().writeFile(scriptPath, plugin.scriptText, 'utf8');
        const pluginWindow = (0, bridge_1.default)().newBrowserWindow({
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        require('@electron/remote/main').enable(pluginWindow.webContents);
        (0, bridge_1.default)().electronApp().registerPluginWindow(plugin.id, pluginWindow);
        const libraryData = {
            pathTo7za: await (0, getPathToExecutable7Zip_1.default)(),
        };
        void pluginWindow.loadURL(`${require('url').format({
            pathname: (0, getAssetPath_1.default)('services/plugins/plugin_index.html'),
            protocol: 'file:',
            slashes: true,
        })}?pluginId=${encodeURIComponent(plugin.id)}&pluginScript=${encodeURIComponent(`file://${scriptPath}`)}&libraryData=${encodeURIComponent(JSON.stringify(libraryData))}`);
        if (plugin.devMode) {
            pluginWindow.webContents.once('dom-ready', () => {
                // Need to open with a delay, otherwise it doesn't show up
                setTimeout(() => {
                    pluginWindow.webContents.openDevTools({ mode: 'detach' });
                }, 3000);
            });
        }
        electron_1.ipcRenderer.on('pluginMessage', async (_event, message) => {
            var _a;
            if (message.target !== PluginMessageTarget.MainWindow)
                return;
            if (message.pluginId !== plugin.id)
                return;
            if (message.mainWindowCallbackId) {
                const callbackId = message.mainWindowCallbackId;
                const promise = callbackPromises[callbackId];
                if (!promise) {
                    console.error('Got a callback without matching promise: ', message);
                    return;
                }
                delete callbackPromises[callbackId];
                if (message.error) {
                    promise.reject(message.error);
                }
                else {
                    promise.resolve(message.result);
                }
            }
            else {
                // Handle notification that a plugin failed to start before
                // calling register(). Emit 'started' so allPluginsStarted
                // is not blocked. See: https://github.com/laurent22/joplin/issues/12793
                if (message.path === '__pluginFailedToStart__') {
                    logger.error(`Plugin "${plugin.id}" failed to start:`, (_a = message.args) === null || _a === void 0 ? void 0 : _a[0]);
                    plugin.running = false;
                    plugin.emit('started');
                    return;
                }
                const mappedArgs = mapEventIdsToHandlers(plugin.id, message.args);
                const fullPath = `joplin.${message.path}`;
                // Don't log complete HTML code, which can be long, for setHtml calls
                const debugMappedArgs = fullPath.includes('setHtml') || fullPath.includes('imaging') ? '<hidden>' : mappedArgs;
                logger.debug(`Got message (3): ${fullPath}`, debugMappedArgs);
                this.recordCallStat(plugin.id);
                // try {
                // 	await this.backOffHandler(plugin.id).wait(fullPath, debugMappedArgs);
                // } catch (error) {
                // 	logger.error(error);
                // 	return;
                // }
                let result = null;
                let error = null;
                try {
                    result = await (0, executeSandboxCall_1.default)(plugin.id, pluginApi, fullPath, mappedArgs, this.eventHandler);
                }
                catch (e) {
                    error = e ? e : new Error('Unknown error');
                }
                ipcRendererSend('pluginMessage', {
                    target: PluginMessageTarget.Plugin,
                    pluginId: plugin.id,
                    pluginCallbackId: message.callbackId,
                    result: result,
                    error: error,
                });
            }
        });
    }
}
exports.default = PluginRunner;
//# sourceMappingURL=PluginRunner.js.map