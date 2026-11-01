"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'showShareNoteDialog',
    label: () => (0, locale_1._)('Publish note...'),
};
const runtime = (comp) => {
    return {
        execute: async (context, noteIds = null) => {
            noteIds = noteIds || context.state.selectedNoteIds;
            comp.setState({
                shareNoteDialogOptions: {
                    noteIds: noteIds,
                    visible: true,
                },
            });
        },
        enabledCondition: 'joplinServerConnected && someNotesSelected && !noteIsDeleted',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showShareNoteDialog.js.map