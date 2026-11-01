"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useCursorPositioning = ({ initialCursorLocation, editor, onCursorUpdate }) => {
    const initialCursorLocationRef = (0, react_1.useRef)(initialCursorLocation);
    initialCursorLocationRef.current = initialCursorLocation;
    const appliedInitialCursorLocationRef = (0, react_1.useRef)(false);
    const onRestoreCursorPosition = (0, react_1.useCallback)(() => {
        if (editor) {
            if (initialCursorLocationRef.current) {
                editor.selection.moveToBookmark(initialCursorLocationRef.current);
            }
            appliedInitialCursorLocationRef.current = true;
        }
    }, [editor]);
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        const onSelectionChange = () => {
            // Wait until the initial cursor position has been set. This avoids resetting
            // the initial cursor position to zero when the editor first loads.
            if (!appliedInitialCursorLocationRef.current)
                return;
            // Use an offset bookmark -- the default bookmark type is not preserved after unloading
            // and reloading the editor.
            const offsetBookmarkId = 2;
            onCursorUpdate({
                richText: editor.selection.getBookmark(offsetBookmarkId, true),
            });
        };
        editor.on('SelectionChange', onSelectionChange);
        return () => {
            editor.off('SelectionChange', onSelectionChange);
        };
    }, [editor, onCursorUpdate, onRestoreCursorPosition]);
    return { onRestoreCursorPosition };
};
exports.default = useCursorPositioning;
//# sourceMappingURL=useCursorPositioning.js.map