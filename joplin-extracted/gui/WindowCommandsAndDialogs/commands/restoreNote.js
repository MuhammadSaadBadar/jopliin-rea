"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const restoreItems_1 = __importDefault(require("@joplin/lib/services/trash/restoreItems"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
exports.declaration = {
    name: 'restoreNote',
    label: () => (0, locale_1._)('Restore note'),
    iconName: 'fas fa-trash-restore',
};
const runtime = () => {
    return {
        execute: async (context, noteIds = null) => {
            if (noteIds === null)
                noteIds = context.state.selectedNoteIds;
            const notes = await Note_1.default.byIds(noteIds, { fields: ['id', 'parent_id'] });
            await (0, restoreItems_1.default)(BaseModel_1.ModelType.Note, notes);
        },
        enabledCondition: 'allSelectedNotesAreDeleted',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=restoreNote.js.map