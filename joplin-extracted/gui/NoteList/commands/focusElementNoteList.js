"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'focusElementNoteList',
    label: () => (0, locale_1._)('Note list'),
    parentLabel: () => (0, locale_1._)('Focus'),
};
const runtime = (focusNote) => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            focusNote(noteId);
            // The sidebar is only present in the main window. If a different window
            // is active, the main window needs to be shown.
            (0, bridge_1.default)().switchToMainWindow();
        },
        enabledCondition: 'noteListHasNotes',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElementNoteList.js.map