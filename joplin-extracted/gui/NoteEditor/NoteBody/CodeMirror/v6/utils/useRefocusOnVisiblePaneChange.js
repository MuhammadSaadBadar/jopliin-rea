"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const useRefocusOnVisiblePaneChange = ({ editorRef, webviewRef, visiblePanes }) => {
    const lastVisiblePanes = (0, react_1.useRef)(visiblePanes);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c;
        const cm6Dom = (_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.cm6) === null || _b === void 0 ? void 0 : _b.dom;
        const doc = cm6Dom === null || cm6Dom === void 0 ? void 0 : cm6Dom.getRootNode();
        const editorHasFocus = cm6Dom === null || cm6Dom === void 0 ? void 0 : cm6Dom.contains(doc === null || doc === void 0 ? void 0 : doc.activeElement);
        const viewerHasFocus = (_c = webviewRef.current) === null || _c === void 0 ? void 0 : _c.hasFocus();
        const lastHadViewer = lastVisiblePanes.current.includes('viewer');
        const hasViewer = visiblePanes.includes('viewer');
        const lastHadEditor = lastVisiblePanes.current.includes('editor');
        const hasEditor = visiblePanes.includes('editor');
        const viewerJustHidden = lastHadViewer && !hasViewer;
        if (viewerJustHidden && viewerHasFocus) {
            (0, focusHandler_1.focus)('CodeMirror/refocusEditor1', editorRef.current);
        }
        // Jump focus to the editor just after showing it -- this assumes that the user
        // shows the editor to start editing the note.
        const editorJustShown = !lastHadEditor && hasEditor;
        if (editorJustShown && viewerHasFocus) {
            (0, focusHandler_1.focus)('CodeMirror/refocusEditor2', editorRef.current);
        }
        const editorJustHidden = lastHadEditor && !hasEditor;
        if (editorJustHidden && editorHasFocus) {
            (0, focusHandler_1.focus)('CodeMirror/refocusViewer', webviewRef.current);
        }
        lastVisiblePanes.current = visiblePanes;
    }, [visiblePanes, editorRef, webviewRef]);
};
exports.default = useRefocusOnVisiblePaneChange;
//# sourceMappingURL=useRefocusOnVisiblePaneChange.js.map