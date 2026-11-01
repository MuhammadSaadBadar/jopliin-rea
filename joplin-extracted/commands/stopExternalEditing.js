"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
const ExternalEditWatcher_1 = __importDefault(require("@joplin/lib/services/ExternalEditWatcher"));
exports.declaration = {
    name: 'stopExternalEditing',
    label: () => (0, locale_1._)('Stop external editing'),
    iconName: 'fa-stop',
};
const runtime = () => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            void ExternalEditWatcher_1.default.instance().stopWatching(noteId);
        },
        enabledCondition: 'oneNoteSelected && !noteIsReadOnly',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=stopExternalEditing.js.map