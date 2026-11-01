"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// Updates the editor's value as necessary
const useSyncEditorValue = ({ content, visiblePanes, onMessage, editorRef, noteId, initialCursorLocationRef }) => {
    const visiblePanesRef = (0, react_1.useRef)(visiblePanes);
    visiblePanesRef.current = visiblePanes;
    const onMessageRef = (0, react_1.useRef)(onMessage);
    onMessageRef.current = onMessage;
    const lastNoteIdRef = (0, react_1.useRef)(noteId);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        // Include the noteId in the update props to give plugins access
        // to the current note ID.
        const updateProps = { noteId: noteId };
        if ((_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.updateBody(content, updateProps)) {
            const noteChanged = lastNoteIdRef.current !== noteId;
            if (noteChanged) {
                // Only reset the cursor location when switching notes. If, for example,
                // the note is updated from a secondary window, the cursor location shouldn't
                // reset.
                const cursorLocation = initialCursorLocationRef.current;
                (_b = editorRef.current) === null || _b === void 0 ? void 0 : _b.select(cursorLocation, cursorLocation);
                // Only reset history when switching notes to allow, e.g., undoing changes made from another
                // window.
                (_c = editorRef.current) === null || _c === void 0 ? void 0 : _c.clearHistory();
            }
            lastNoteIdRef.current = noteId;
            // If the viewer isn't visible, the content should be considered rendered
            // after the editor has finished updating:
            if (!visiblePanesRef.current.includes('viewer')) {
                onMessageRef.current({ channel: 'noteRenderComplete' });
            }
        }
    }, [content, noteId, editorRef, initialCursorLocationRef]);
};
exports.default = useSyncEditorValue;
//# sourceMappingURL=useSyncEditorValue.js.map