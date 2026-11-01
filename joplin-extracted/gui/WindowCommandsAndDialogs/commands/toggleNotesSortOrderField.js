"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const notesSortOrderUtils_1 = require("@joplin/lib/services/sortOrder/notesSortOrderUtils");
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'toggleNotesSortOrderField',
    label: () => (0, locale_1._)('Toggle sort order field'),
    parentLabel: () => (0, locale_1._)('Notes'),
};
const runtime = () => {
    return {
        execute: async (_context, field, reverse) => {
            // field: Sort order's field. undefined means switching a field.
            // reverse: whether the sort order is reversed or not. undefined means toggling.
            //
            // To support CommandService.scheduleExecute(), field accepts an size-two Array,
            // which means [field, reverse].
            if (typeof field !== 'object') {
                (0, notesSortOrderUtils_1.setNotesSortOrder)(field, reverse);
            }
            else {
                (0, notesSortOrderUtils_1.setNotesSortOrder)(field[0], field[1]);
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleNotesSortOrderField.js.map