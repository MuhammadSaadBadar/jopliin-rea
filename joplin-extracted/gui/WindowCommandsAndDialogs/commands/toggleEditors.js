"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const reducer_1 = require("@joplin/lib/reducer");
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.declaration = {
    name: 'toggleEditors',
    label: () => (0, locale_1._)('Toggle editors'),
    iconName: 'fa-columns',
};
const runtime = () => {
    return {
        execute: async (context) => {
            // A bit of a hack, but for now don't allow changing code view
            // while a note is being saved as it will cause a problem with
            // TinyMCE because it won't have time to send its content before
            // being switch to Ace Editor.
            if (reducer_1.stateUtils.hasNotesBeingSaved(context.state))
                return;
            const newValue = !Setting_1.default.value('editor.codeView');
            Setting_1.default.setValue('editor.codeView', newValue);
            context.dispatch({ type: 'EDITOR_CODE_VIEW_CHANGE', value: newValue });
        },
        enabledCondition: '!notesAreBeingSaved && oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleEditors.js.map