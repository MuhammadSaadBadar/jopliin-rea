"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const types_1 = require("@joplin/lib/services/interop/types");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
exports.declaration = {
    name: 'exportFolders',
};
const runtime = () => {
    return {
        // "targetPath" should be a file for JEX export (because the format can
        // contain multiple folders) or a directory otherwise.
        execute: async (_context, folderIds, format, targetPath) => {
            const exportOptions = {
                sourceFolderIds: folderIds,
                path: targetPath,
                format: format,
                target: types_1.FileSystemItem.Directory,
            };
            const targetMustBeFile = format === 'jex';
            const targetIsDir = await shim_1.default.fsDriver().isDirectory(targetPath);
            if (targetMustBeFile && targetIsDir) {
                throw new Error(`Format "${format}" can only be exported to a file`);
            }
            if (format === 'jex' || !targetIsDir) {
                exportOptions.target = types_1.FileSystemItem.File;
            }
            return InteropService_1.default.instance().export(exportOptions);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=exportFolders.js.map