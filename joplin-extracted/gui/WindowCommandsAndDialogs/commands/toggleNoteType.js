"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const hasLockedNoteWhileSessionLocked_1 = __importDefault(require("@joplin/lib/services/noteLock/hasLockedNoteWhileSessionLocked"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'toggleNoteType',
    label: () => (0, locale_1._)('Switch between note and to-do type'),
};
const runtime = () => {
    return {
        execute: async (context, noteIds = null) => {
            if (noteIds === null)
                noteIds = context.state.selectedNoteIds;
            if (await (0, hasLockedNoteWhileSessionLocked_1.default)(noteIds)) {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Cannot change a locked note while the session is locked'));
                return;
            }
            for (let i = 0; i < noteIds.length; i++) {
                const note = await Note_1.default.load(noteIds[i]);
                await Note_1.default.save(Note_1.default.toggleIsTodo(note), { userSideValidation: true });
            }
        },
        enabledCondition: '!noteIsReadOnly',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleNoteType.js.map