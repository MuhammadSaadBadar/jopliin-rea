"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
exports.declaration = {
    name: 'openNote',
};
const runtime = () => {
    return {
        execute: async (context, noteId, hash = null) => {
            const note = await Note_1.default.load(noteId);
            if (!note)
                throw new Error(`No such note: ${noteId}`);
            const folder = await Folder_1.default.load(note.parent_id);
            if (!folder)
                throw new Error(`Note parent notebook does not exist: ${JSON.stringify(note)}`);
            context.dispatch({
                type: 'FOLDER_AND_NOTE_SELECT',
                folderId: folder.id,
                noteId: note.id,
                hash,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openNote.js.map