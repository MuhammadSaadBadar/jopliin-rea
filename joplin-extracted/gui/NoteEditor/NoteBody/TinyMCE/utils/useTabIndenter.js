"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTabIndenter = (editor, enabled) => {
    (0, react_1.useEffect)(() => {
        if (!editor || !enabled)
            return () => { };
        const canChangeIndentation = () => {
            const selectionElement = editor.selection.getNode();
            // List items and tables have their own tab key handlers.
            return !selectionElement.closest('li, table') && !editor.readonly;
        };
        const getSpacesBeforeSelectionRange = (maxLength) => {
            const selectionRange = editor.selection.getRng();
            let rangeStart = selectionRange.startOffset;
            let outputRange = selectionRange.cloneRange();
            while (rangeStart >= 0) {
                rangeStart--;
                const lastRange = outputRange.cloneRange();
                outputRange.setStart(outputRange.startContainer, Math.max(rangeStart, 0));
                const rangeContent = outputRange.toString();
                const isWhitespace = rangeContent.match(/^\s*$/);
                if (!isWhitespace || rangeContent.length > maxLength) {
                    outputRange = lastRange;
                    break;
                }
            }
            return outputRange;
        };
        const indentLengthChars = 8;
        let indentHtml = '';
        for (let i = 0; i < indentLengthChars; i++) {
            indentHtml += '&nbsp;';
        }
        let lastKeyWasEscape = false;
        const eventHandler = (event) => {
            if (!event.isDefaultPrevented() && event.key === 'Tab' && canChangeIndentation() && !lastKeyWasEscape) {
                if (!event.shiftKey) {
                    editor.execCommand('mceInsertContent', false, indentHtml);
                    event.preventDefault();
                }
                else {
                    const selectionRange = editor.selection.getRng();
                    if (selectionRange.collapsed) {
                        const spacesRange = getSpacesBeforeSelectionRange(indentLengthChars);
                        const hasAtLeastOneSpace = spacesRange.toString().match(/^\s+$/);
                        if (hasAtLeastOneSpace) {
                            editor.selection.setRng(spacesRange);
                            editor.execCommand('Delete', false);
                            event.preventDefault();
                        }
                    }
                }
            }
            else if (event.key === 'Escape' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey) {
                // For accessibility, let Escape followed by tab escape the focus trap.
                lastKeyWasEscape = true;
            }
            else if (event.key !== 'Shift') { // Allows Esc->Shift+Tab to escape the focus trap.
                lastKeyWasEscape = false;
            }
        };
        editor.on('keydown', eventHandler);
        return () => {
            editor.off('keydown', eventHandler);
        };
    }, [editor, enabled]);
};
exports.default = useTabIndenter;
//# sourceMappingURL=useTabIndenter.js.map