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
const bridge_1 = __importDefault(require("../bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const registry_1 = require("@joplin/lib/registry");
const BasePlatformImplementation_1 = __importDefault(require("@joplin/lib/services/plugins/BasePlatformImplementation"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const path_1 = require("path");
const uuid_1 = __importStar(require("@joplin/lib/uuid"));
const url_1 = require("@joplin/utils/url");
const path_2 = require("@joplin/utils/path");
const electron_1 = require("electron");
const packageInfo = require('../../packageInfo');
// PlatformImplementation provides access to platform specific dependencies,
// such as the clipboard, message dialog, etc. It allows having the same plugin
// API for all platforms, but with different implementations.
class PlatformImplementation extends BasePlatformImplementation_1.default {
    static instance() {
        if (!this.instance_)
            this.instance_ = new PlatformImplementation();
        return this.instance_;
    }
    get versionInfo() {
        return {
            version: packageInfo.version,
            syncVersion: Setting_1.default.value('syncVersion'),
            profileVersion: registry_1.reg.db().version(),
            platform: 'desktop',
        };
    }
    get clipboard() {
        return electron_1.clipboard;
    }
    get nativeImage() {
        return electron_1.nativeImage;
    }
    constructor() {
        super();
        this.components_ = {};
        this.joplin_ = {
            views: {
                dialogs: {
                    showMessageBox: async (message) => {
                        return (0, bridge_1.default)().showMessageBox(message);
                    },
                    showOpenDialog: async (options) => {
                        return (0, bridge_1.default)().showOpenDialog(options);
                    },
                },
            },
        };
    }
    registerComponent(name, component) {
        this.components_[name] = component;
    }
    unregisterComponent(name) {
        delete this.components_[name];
    }
    get joplin() {
        return this.joplin_;
    }
    get imaging() {
        const createFromPdf = async (path, options) => {
            const tempDir = (0, path_1.join)(Setting_1.default.value('tempDir'), uuid_1.default.createNano());
            await shim_1.default.fsDriver().mkdir(tempDir);
            try {
                const paths = await shim_1.default.pdfToImages(path, tempDir, options);
                return paths.map(path => electron_1.nativeImage.createFromPath(path));
            }
            finally {
                await shim_1.default.fsDriver().remove(tempDir);
            }
        };
        return {
            createFromPath: async (path) => {
                let pathToProcess = path;
                let ext = (0, path_2.fileExtension)(path).toLowerCase();
                if ((0, url_1.hasProtocol)(path, ['http', 'https', 'file'])) {
                    ext = (0, path_2.fileExtension)((new URL(path)).pathname);
                    const tempFilePath = `${Setting_1.default.value('tempDir')}/${(0, uuid_1.uuidgen)()}${ext ? `.${ext}` : ''}`;
                    await shim_1.default.fetchBlob(path, { path: tempFilePath });
                    pathToProcess = tempFilePath;
                }
                if (ext === 'pdf') {
                    const images = await createFromPdf(pathToProcess, { minPage: 1, maxPage: 1 });
                    if (images.length === 0) {
                        // Match the behavior or Electron's nativeImage when reading an invalid image.
                        return electron_1.nativeImage.createEmpty();
                    }
                    return images[0];
                }
                else {
                    return electron_1.nativeImage.createFromPath(pathToProcess);
                }
            },
            createFromPdf,
            getPdfInfo(path) {
                return shim_1.default.pdfInfo(path);
            },
        };
    }
}
exports.default = PlatformImplementation;
//# sourceMappingURL=PlatformImplementation.js.map