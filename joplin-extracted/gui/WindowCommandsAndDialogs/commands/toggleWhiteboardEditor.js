"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'toggleWhiteboardEditor',
    label: () => (0, locale_1._)('Toggle whiteboard / Markdown view'),
    iconName: 'fas fa-eye',
};
const runtime = () => {
    return {
        execute: async (context, noteId) => {
            var _a;
            const id = noteId || ((_a = context.state.selectedNoteIds) === null || _a === void 0 ? void 0 : _a[0]);
            if (!id)
                return;
            context.dispatch({ type: 'WHITEBOARD_FORCE_MARKDOWN_TOGGLE', noteId: id });
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleWhiteboardEditor.js.map