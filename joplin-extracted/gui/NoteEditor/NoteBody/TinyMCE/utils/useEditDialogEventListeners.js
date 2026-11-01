"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const types_1 = require("./types");
const useEditDialogEventListeners = (editor, editDialog) => {
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        const dblClickHandler = (event) => {
            editDialog.editExisting(event.target);
        };
        const keyDownHandler = (event) => {
            const hasModifiers = event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
            if (event.code === 'Enter' && !event.isComposing && !hasModifiers) {
                const selection = editor.selection.getNode();
                if (editDialog.isEditable(selection)) {
                    editDialog.editExisting(selection);
                    event.preventDefault();
                }
            }
        };
        editor.on(types_1.TinyMceEditorEvents.KeyDown, keyDownHandler);
        editor.on('DblClick', dblClickHandler);
        return () => {
            editor.off(types_1.TinyMceEditorEvents.KeyDown, keyDownHandler);
            editor.off('DblClick', dblClickHandler);
        };
    }, [editor, editDialog]);
};
exports.default = useEditDialogEventListeners;
//# sourceMappingURL=useEditDialogEventListeners.js.map