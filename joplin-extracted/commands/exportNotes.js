"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const types_1 = require("@joplin/lib/services/interop/types");
exports.declaration = {
    name: 'exportNotes',
};
const runtime = () => {
    return {
        execute: async (_context, noteIds, format, targetDirectoryPath) => {
            const exportOptions = {
                path: targetDirectoryPath,
                format: format,
                target: types_1.FileSystemItem.Directory,
                sourceNoteIds: noteIds,
            };
            return InteropService_1.default.instance().export(exportOptions);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=exportNotes.js.map