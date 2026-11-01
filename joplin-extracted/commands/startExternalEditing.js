"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
const ExternalEditWatcher_1 = __importDefault(require("@joplin/lib/services/ExternalEditWatcher"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const bridge_1 = __importDefault(require("../services/bridge"));
exports.declaration = {
    name: 'startExternalEditing',
    label: () => (0, locale_1._)('Open in external editor'),
    iconName: 'icon-share',
};
const runtime = () => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            try {
                const note = await Note_1.default.load(noteId);
                // The enabled condition can be bypassed when the command is executed directly (e.g. via
                // toggleExternalEditing): the external editor would get ciphertext, or write plaintext to disk.
                if ((0, isNoteLockEnabled_1.default)() && note.is_locked)
                    throw new Error((0, locale_1._)('Locked notes cannot be opened in an external editor'));
                void ExternalEditWatcher_1.default.instance().openAndWatch(note);
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Error opening note in editor: %s', error.message));
            }
        },
        enabledCondition: 'oneNoteSelected && !noteIsReadOnly && !noteIsLocked',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=startExternalEditing.js.map