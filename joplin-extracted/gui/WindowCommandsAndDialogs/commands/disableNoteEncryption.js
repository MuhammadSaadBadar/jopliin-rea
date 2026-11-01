"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const setNoteLockState_1 = require("@joplin/lib/services/noteLock/setNoteLockState");
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'disableNoteEncryption',
    label: () => (0, locale_1._)('Disable encryption'),
};
const runtime = () => {
    return {
        execute: async (context, noteId = null) => {
            if (!(0, isNoteLockEnabled_1.default)())
                return;
            if (noteId === null) {
                if (context.state.selectedNoteIds.length !== 1)
                    return;
                noteId = context.state.selectedNoteIds[0];
            }
            // Same pending-save guard as enableNoteEncryption.
            if (context.state.editorNoteStatuses[noteId] === 'saving') {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('This note is currently being saved. Please try again in a moment.'));
                return;
            }
            try {
                await (0, setNoteLockState_1.disableNoteLock)(noteId);
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        },
        enabledCondition: 'oneNoteSelected && noteIsLocked && noteLockSessionUnlocked && !noteIsReadOnly && !noteIsDeleted && !inTrash && !inConflictFolder',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=disableNoteEncryption.js.map