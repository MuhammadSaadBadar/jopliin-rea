"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.declaration = {
    name: 'toggleTabMovesFocus',
    label: () => (0, locale_1._)('Toggle editor tab key navigation'),
    iconName: 'fas fa-keyboard',
};
const runtime = () => {
    return {
        execute: async (_context, enabled = null) => {
            const newValue = enabled !== null && enabled !== void 0 ? enabled : !Setting_1.default.value('editor.tabMovesFocus');
            Setting_1.default.setValue('editor.tabMovesFocus', newValue);
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleTabMovesFocus.js.map