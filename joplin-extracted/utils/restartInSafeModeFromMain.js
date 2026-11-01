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
const Setting_1 = __importStar(require("@joplin/lib/models/Setting"));
const bridge_1 = __importDefault(require("../bridge"));
const processStartFlags_1 = __importDefault(require("@joplin/lib/utils/processStartFlags"));
const BaseApplication_1 = require("@joplin/lib/BaseApplication");
const initProfile_1 = __importDefault(require("@joplin/lib/services/profileConfig/initProfile"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const determineBaseAppDirs_1 = __importDefault(require("@joplin/lib/determineBaseAppDirs"));
const restartInSafeModeFromMain = async () => {
    // Only set constants here -- the main process doesn't have easy access (without loading
    // a large amount of other code) to the database.
    const appName = (0, bridge_1.default)().appName();
    Setting_1.default.setConstant('appId', `net.cozic.${appName}`);
    Setting_1.default.setConstant('appType', Setting_1.AppType.Desktop);
    Setting_1.default.setConstant('appName', appName);
    // Load just enough for us to write a file in the profile directory
    const { shimInit } = require('@joplin/lib/shim-init-node.js');
    shimInit({});
    const startFlags = await (0, processStartFlags_1.default)((0, bridge_1.default)().processArgv());
    const { rootProfileDir } = (0, determineBaseAppDirs_1.default)(startFlags.matched.profileDir, appName, Setting_1.default.value('altInstanceId'));
    const { profileDir } = await (0, initProfile_1.default)(rootProfileDir);
    // We can't access the database, so write to a file instead.
    const safeModeFlagFile = (0, path_1.join)(profileDir, BaseApplication_1.safeModeFlagFilename);
    await (0, fs_extra_1.writeFile)(safeModeFlagFile, 'true', 'utf8');
    await (0, bridge_1.default)().restart();
};
exports.default = restartInSafeModeFromMain;
//# sourceMappingURL=restartInSafeModeFromMain.js.map