"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'focusElementNoteViewer',
    label: () => (0, locale_1._)('Note viewer'),
    parentLabel: () => (0, locale_1._)('Focus'),
};
const runtime = (dependencies) => {
    return {
        execute: async (_context, options) => {
            await dependencies.editorRef.current.execCommand({
                name: 'viewer.focus',
                value: options,
            });
        },
        enabledCondition: 'markdownEditorVisible',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElementNoteViewer.js.map