"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'print',
    label: () => (0, locale_1._)('Print'),
    iconName: 'fa-file',
};
const runtime = (comp) => {
    return {
        execute: async (context, noteIds = null) => {
            noteIds = noteIds || context.state.selectedNoteIds;
            try {
                if (noteIds.length !== 1)
                    throw new Error((0, locale_1._)('Only one note can be printed at a time.'));
                await comp.printTo('printer', { noteId: noteIds[0] });
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        },
        enabledCondition: 'someNotesSelected && !noteLockContentUnavailable',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=print.js.map