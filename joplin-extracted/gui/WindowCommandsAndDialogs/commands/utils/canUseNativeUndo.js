"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// CodeMirror and TinyMCE both have trouble with native Electron
// undo/redo.
// See https://github.com/laurent22/joplin/issues/14216
const canUseNativeUndo = (control) => {
    const dom = control.getFocusedDocument();
    return !dom.activeElement.closest('.CodeMirror, div.joplin-tinymce');
};
exports.default = canUseNativeUndo;
//# sourceMappingURL=canUseNativeUndo.js.map