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
exports.runtime = exports.declaration = void 0;
const RevisionService_1 = __importDefault(require("@joplin/lib/services/RevisionService"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
exports.declaration = {
    name: 'restoreNoteRevision',
    label: 'Restore a note from history',
};
const runtime = () => {
    return {
        execute: async (_context, noteId, reverseRevIndex = 0) => {
            try {
                const note = await RevisionService_1.default.instance().restoreNoteById(noteId, reverseRevIndex);
                await shim_1.default.showMessageBox(RevisionService_1.default.instance().restoreSuccessMessage(note), { type: shim_1.MessageBoxType.Info });
            }
            catch (error) {
                await shim_1.default.showErrorDialog(error.message);
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=restoreNoteRevision.js.map