"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'pasteAsText',
    label: () => (0, locale_1._)('Paste as text'),
};
const runtime = (comp) => {
    return {
        execute: async () => {
            void comp.editorRef.current.execCommand({ name: 'pasteAsText' });
        },
        enabledCondition: 'oneNoteSelected && richTextEditorVisible',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=pasteAsText.js.map