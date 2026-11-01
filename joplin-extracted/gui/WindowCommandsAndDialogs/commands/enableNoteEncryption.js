"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const NoteLockKey_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockKey"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const setNoteLockState_1 = require("@joplin/lib/services/noteLock/setNoteLockState");
const ExternalEditWatcher_1 = __importDefault(require("@joplin/lib/services/ExternalEditWatcher"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'enableNoteEncryption',
    label: () => (0, locale_1._)('Enable encryption'),
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
            // An open editor's pending save still has the old lock state and would fail against
            // the note once its lock state changes underneath it.
            if (context.state.editorNoteStatuses[noteId] === 'saving') {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('This note is currently being saved. Please try again in a moment.'));
                return;
            }
            if (!NoteLockKey_1.default.instance().load()) {
                const setUpNow = (0, bridge_1.default)().showConfirmMessageBox((0, locale_1._)('Encrypting a note requires a note lock password, which has not yet been set. Set it up now?'), {
                    buttons: [(0, locale_1._)('Yes'), (0, locale_1._)('No')],
                });
                if (setUpNow) {
                    context.dispatch({
                        type: 'NAV_GO',
                        routeName: 'Config',
                        props: { defaultSection: 'noteLock' },
                    });
                }
                return;
            }
            // A note that is not yet encrypted has no unlock overlay, so the session unlock has to
            // happen through the dialog here.
            if (!NoteLockSession_1.default.instance().isUnlocked()) {
                context.dispatch({
                    type: 'DIALOG_OPEN',
                    name: 'noteLockUnlock',
                    props: { successCommand: { name: 'enableNoteEncryption', args: [noteId] } },
                });
                return;
            }
            // An externally edited note has a plaintext file on disk; flush and delete it before locking.
            if (context.state.watchedNoteFiles.includes(noteId)) {
                await ExternalEditWatcher_1.default.instance().stopWatching(noteId);
            }
            try {
                await (0, setNoteLockState_1.enableNoteLock)(noteId);
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        },
        enabledCondition: 'oneNoteSelected && !noteIsLocked && !noteIsReadOnly && !noteIsDeleted && !inTrash && !inConflictFolder',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=enableNoteEncryption.js.map