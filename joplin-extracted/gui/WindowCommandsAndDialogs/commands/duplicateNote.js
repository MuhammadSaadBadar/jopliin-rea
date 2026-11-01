"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
exports.declaration = {
    name: 'duplicateNote',
    label: () => (0, locale_1._)('Duplicate'),
};
const runtime = () => {
    return {
        execute: async (context, noteIds = null) => {
            if (noteIds === null)
                noteIds = context.state.selectedNoteIds;
            for (let i = 0; i < noteIds.length; i++) {
                const note = await Note_1.default.load(noteIds[i]);
                await Note_1.default.duplicate(noteIds[i], {
                    uniqueTitle: (0, locale_1._)('%s - Copy', note.title),
                });
            }
        },
        enabledCondition: '!noteIsReadOnlyShare',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=duplicateNote.js.map