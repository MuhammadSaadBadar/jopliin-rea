"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
exports.declaration = {
    name: 'showNoteContentProperties',
    label: () => (0, locale_1._)('Statistics...'),
};
const runtime = (comp) => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            const note = await Note_1.default.load(noteId);
            if (note) {
                comp.setState({
                    noteContentPropertiesDialogOptions: {
                        visible: true,
                        text: note.body,
                        markupLanguage: note.markup_language,
                    },
                });
            }
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showNoteContentProperties.js.map