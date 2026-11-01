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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const shim_1 = __importStar(require("@joplin/lib/shim"));
const remote_1 = require("@electron/remote");
const electron_1 = require("electron");
exports.declaration = {
    name: 'copyDevCommand',
    label: () => (0, locale_1._)('Copy dev mode command to clipboard'),
};
const runtime = () => {
    return {
        execute: async () => {
            const appPath = remote_1.app.getPath('exe');
            // Quote the path so it works when it contains spaces (e.g. "C:\Program Files\Joplin\Joplin.exe" on Windows)
            const cmd = `"${appPath}" --env dev`;
            electron_1.clipboard.writeText(cmd);
            await shim_1.default.showMessageBox(`The dev mode command has been copied to clipboard:\n\n${cmd}`, { type: shim_1.MessageBoxType.Info });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=copyDevCommand.js.map