"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'toggleVisiblePanes',
    label: () => (0, locale_1._)('Toggle editor layout'),
    iconName: 'icon-layout ',
};
const runtime = () => {
    return {
        execute: async (context) => {
            context.dispatch({
                type: 'NOTE_VISIBLE_PANES_TOGGLE',
            });
        },
        enabledCondition: 'markdownEditorVisible && oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleVisiblePanes.js.map