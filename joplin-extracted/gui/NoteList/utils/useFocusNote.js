"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const useFocusNote = (containerRef, notes, makeItemIndexVisible, setActiveNoteId) => {
    const notesRef = (0, react_1.useRef)(notes);
    notesRef.current = notes;
    const focusNote = (0, react_1.useCallback)((noteId) => {
        if (noteId) {
            setActiveNoteId(noteId);
        }
        // The note list container should have focus even when a note list item is visibly selected.
        // The visibly focused item is determined by activeNoteId and is communicated to accessibility
        // tools using aria- attributes
        (0, focusHandler_1.focus)('useFocusNote', containerRef.current);
        const targetIndex = notesRef.current.findIndex(note => note.id === noteId);
        if (targetIndex > -1) {
            makeItemIndexVisible(targetIndex);
        }
    }, [containerRef, makeItemIndexVisible, setActiveNoteId]);
    return focusNote;
};
exports.default = useFocusNote;
//# sourceMappingURL=useFocusNote.js.map