"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnNoteClick = (dispatch, focusNote) => {
    const onNoteClick = (0, react_1.useCallback)((event) => {
        const noteId = event.currentTarget.getAttribute('data-id');
        const targetTagName = event.target ? event.target.tagName : '';
        // If we are for example on a checkbox, don't process the click since it
        // should be handled by the checkbox onChange handler.
        if (['INPUT'].includes(targetTagName))
            return;
        focusNote(noteId);
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            dispatch({
                type: 'NOTE_SELECT_TOGGLE',
                id: noteId,
            });
        }
        else if (event.shiftKey) {
            event.preventDefault();
            dispatch({
                type: 'NOTE_SELECT_EXTEND',
                id: noteId,
            });
        }
        else {
            dispatch({
                type: 'NOTE_SELECT',
                id: noteId,
            });
        }
    }, [dispatch, focusNote]);
    return onNoteClick;
};
exports.default = useOnNoteClick;
//# sourceMappingURL=useOnNoteClick.js.map