"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("@joplin/lib/BaseModel"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const react_1 = require("react");
const canManuallySortNotes_1 = __importDefault(require("./canManuallySortNotes"));
const useMoveNote = (notesParentType, noteSortOrder, selectedNoteIds, selectedFolderId, uncompletedTodosOnTop, showCompletedTodos, notes, selectedFolderInTrash, makeItemIndexVisible, focusNote, dispatch) => {
    const moveNote = (0, react_1.useCallback)((direction, inc) => {
        if (!(0, canManuallySortNotes_1.default)(notesParentType, noteSortOrder, selectedFolderInTrash))
            return;
        const noteId = selectedNoteIds[0];
        let targetNoteIndex = BaseModel_1.default.modelIndexById(notes, noteId);
        if ((direction === 1)) {
            targetNoteIndex += inc + 1;
        }
        if ((direction === -1)) {
            targetNoteIndex -= inc;
        }
        void Note_1.default.insertNotesAt(selectedFolderId, selectedNoteIds, targetNoteIndex, uncompletedTodosOnTop, showCompletedTodos);
        // The note will be moved to the target index, so we need to update the scroll amount to make it visible
        dispatch({
            type: 'NOTE_SELECT',
            id: noteId,
        });
        makeItemIndexVisible(targetNoteIndex);
        focusNote(noteId);
    }, [selectedFolderId, noteSortOrder, notes, notesParentType, selectedNoteIds, uncompletedTodosOnTop, showCompletedTodos, selectedFolderInTrash, makeItemIndexVisible, focusNote, dispatch]);
    return moveNote;
};
exports.default = useMoveNote;
//# sourceMappingURL=useMoveNote.js.map