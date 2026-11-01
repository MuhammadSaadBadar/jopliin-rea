"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const locale_1 = require("@joplin/lib/locale");
const notesSortOrderUtils_1 = require("@joplin/lib/services/sortOrder/notesSortOrderUtils");
exports.declaration = {
    name: 'toggleNotesSortOrderReverse',
    label: () => (0, locale_1._)('Reverse sort order'),
    parentLabel: () => (0, locale_1._)('Notes'),
};
const runtime = () => {
    return {
        execute: async (_context) => {
            const reverse = Setting_1.default.value('notes.sortOrder.reverse');
            (0, notesSortOrderUtils_1.setNotesSortOrder)(undefined, !reverse);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleNotesSortOrderReverse.js.map