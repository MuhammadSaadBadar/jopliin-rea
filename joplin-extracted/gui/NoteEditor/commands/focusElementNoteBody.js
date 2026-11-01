"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'focusElementNoteBody',
    label: () => (0, locale_1._)('Note body'),
    parentLabel: () => (0, locale_1._)('Focus'),
};
const runtime = (comp) => {
    return {
        execute: async (_context, options) => {
            void comp.editorRef.current.execCommand({ name: 'editor.focus', value: options });
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElementNoteBody.js.map