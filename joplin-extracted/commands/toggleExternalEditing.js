"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
exports.declaration = {
    name: 'toggleExternalEditing',
    label: () => (0, locale_1._)('Toggle external editing'),
    iconName: 'icon-share',
};
const runtime = () => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            if (!noteId)
                return;
            if (context.state.watchedNoteFiles.includes(noteId)) {
                void CommandService_1.default.instance().execute('stopExternalEditing', noteId);
            }
            else {
                void CommandService_1.default.instance().execute('startExternalEditing', noteId);
            }
        },
        enabledCondition: 'oneNoteSelected && !noteIsReadOnly && !noteIsLocked && (!modalDialogVisible || gotoAnythingVisible)',
        mapStateToTitle: (state) => {
            const noteId = reducer_1.stateUtils.selectedNoteId(state);
            return state.watchedNoteFiles.includes(noteId) ? (0, locale_1._)('Stop') : '';
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleExternalEditing.js.map