"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const canManuallySortNotes_1 = __importDefault(require("./canManuallySortNotes"));
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const useDragAndDrop = (parentFolderIsReadOnly, selectedNoteIds, selectedFolderId, listRef, scrollTop, itemSize, notesParentType, noteSortOrder, uncompletedTodosOnTop, showCompletedTodos, flow, itemsPerLine, selectedFolderInTrash) => {
    const [dragOverTargetNoteIndex, setDragOverTargetNoteIndex] = (0, react_1.useState)(null);
    const onGlobalDrop = (0, react_1.useCallback)(() => {
        setDragOverTargetNoteIndex(null);
    }, []);
    (0, react_1.useEffect)(() => {
        document.addEventListener('dragend', onGlobalDrop);
        return () => {
            document.removeEventListener('dragend', onGlobalDrop);
        };
    }, [onGlobalDrop]);
    const onDragStart = (0, react_1.useCallback)(event => {
        if (parentFolderIsReadOnly)
            return false;
        let noteIds = [];
        // Here there is two cases:
        // - If multiple notes are selected, we drag the group
        // - If only one note is selected, we drag the note that was clicked on
        //   (which might be different from the currently selected note)
        if (selectedNoteIds.length >= 2) {
            noteIds = selectedNoteIds;
        }
        else {
            const clickedNoteId = event.currentTarget.getAttribute('data-id');
            if (clickedNoteId)
                noteIds.push(clickedNoteId);
        }
        if (!noteIds.length)
            return false;
        event.dataTransfer.setDragImage(new Image(), 1, 1);
        event.dataTransfer.clearData();
        event.dataTransfer.setData('text/x-jop-note-ids', JSON.stringify(noteIds));
        return true;
    }, [parentFolderIsReadOnly, selectedNoteIds]);
    const dragTargetNoteIndex = (0, react_1.useCallback)((event) => {
        const rect = listRef.current.getBoundingClientRect();
        const lineIndexFloat = (event.clientY - rect.top + scrollTop) / itemSize.height;
        if (flow === noteListType_1.ItemFlow.TopToBottom) {
            return Math.abs(Math.round(lineIndexFloat));
        }
        else {
            const lineIndex = Math.floor(lineIndexFloat);
            const rowIndexFloat = (event.clientX - rect.left) / itemSize.width;
            const rowIndex = Math.round(rowIndexFloat);
            return lineIndex * itemsPerLine + rowIndex;
        }
    }, [listRef, itemSize, scrollTop, flow, itemsPerLine]);
    const onDragOver = (0, react_1.useCallback)(event => {
        if (notesParentType !== 'Folder')
            return;
        if (selectedFolderInTrash)
            return;
        const dt = event.dataTransfer;
        if (dt.types.indexOf('text/x-jop-note-ids') >= 0) {
            event.preventDefault();
            const newIndex = dragTargetNoteIndex(event);
            if (dragOverTargetNoteIndex === newIndex)
                return;
            setDragOverTargetNoteIndex(newIndex);
        }
    }, [notesParentType, dragTargetNoteIndex, dragOverTargetNoteIndex, selectedFolderInTrash]);
    const onDrop = (0, react_1.useCallback)(async (event) => {
        const dt = event.dataTransfer;
        if (!dt.types.includes('text/x-jop-note-ids'))
            return;
        // TODO: check that parent type is folder
        if (!(0, canManuallySortNotes_1.default)(notesParentType, noteSortOrder, selectedFolderInTrash))
            return;
        setDragOverTargetNoteIndex(null);
        const targetNoteIndex = dragTargetNoteIndex(event);
        const noteIds = JSON.parse(dt.getData('text/x-jop-note-ids'));
        await Note_1.default.insertNotesAt(selectedFolderId, noteIds, targetNoteIndex, uncompletedTodosOnTop, showCompletedTodos);
    }, [notesParentType, dragTargetNoteIndex, noteSortOrder, selectedFolderId, uncompletedTodosOnTop, showCompletedTodos, selectedFolderInTrash]);
    return { onDragStart, onDragOver, onDrop, dragOverTargetNoteIndex };
};
exports.default = useDragAndDrop;
//# sourceMappingURL=useDragAndDrop.js.map