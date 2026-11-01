"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = exports.createNoteInActiveFolder = exports.newNoteEnabledConditions = void 0;
const CommandService_1 = require("@joplin/lib/services/CommandService");
const locale_1 = require("@joplin/lib/locale");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.newNoteEnabledConditions = 'oneFolderSelected && selectedFolderIsValid && !inConflictFolder && !folderIsReadOnly && !folderIsTrash';
// Shared helper used by both `newNote` and any sibling commands that create
// a fresh, provisional note in the currently-active folder (e.g. the
// whiteboard "New whiteboard" command). Returns null if there's no valid
// active folder. Caller is responsible for telling the user the command
// was a no-op in that case (it's already gated by `newNoteEnabledConditions`
// in practice).
const createNoteInActiveFolder = async (options = {}) => {
    var _a;
    const folder = await Folder_1.default.getValidActiveFolder();
    if (!folder)
        return null;
    const defaultValues = Note_1.default.previewFieldsWithDefaultValues({ includeTimestamps: false });
    let order;
    if (Setting_1.default.value('notes.sortOrder.field') === 'order') {
        order = await Note_1.default.getNextOrderValue(folder.id);
    }
    const note = await Note_1.default.save(Object.assign(Object.assign(Object.assign(Object.assign({}, defaultValues), { parent_id: folder.id, is_todo: options.isTodo ? 1 : 0, body: (_a = options.body) !== null && _a !== void 0 ? _a : '' }), (options.title ? { title: options.title } : {})), (order !== undefined ? { order } : {})), { provisional: true });
    if (options.updateGeolocation !== false) {
        void Note_1.default.updateGeolocation(note.id);
    }
    CommandService_1.utils.store.dispatch({ type: 'NOTE_SELECT', id: note.id });
    // Immediately sort the note list so that the new note is positioned
    // correctly before scrolling to it.
    CommandService_1.utils.store.dispatch({ type: 'NOTE_SORT' });
    return note;
};
exports.createNoteInActiveFolder = createNoteInActiveFolder;
exports.declaration = {
    name: 'newNote',
    label: () => (0, locale_1._)('New note'),
    iconName: 'fa-file',
};
const runtime = () => {
    return {
        execute: async (_context, body = '', isTodo = false) => {
            await (0, exports.createNoteInActiveFolder)({ body, isTodo });
        },
        enabledCondition: exports.newNoteEnabledConditions,
    };
};
exports.runtime = runtime;
//# sourceMappingURL=newNote.js.map