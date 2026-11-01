"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
exports.declaration = {
    name: 'focusElementNoteTitle',
    label: () => (0, locale_1._)('Note title'),
    parentLabel: () => (0, locale_1._)('Focus'),
};
const runtime = (comp) => {
    return {
        execute: async () => {
            if (!comp.titleInputRef.current)
                return;
            (0, focusHandler_1.focus)('focusElementNoteTitle', comp.titleInputRef.current);
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElementNoteTitle.js.map