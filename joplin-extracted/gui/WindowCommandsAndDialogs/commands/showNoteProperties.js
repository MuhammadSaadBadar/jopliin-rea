"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
exports.declaration = {
    name: 'showNoteProperties',
    label: () => (0, locale_1._)('Note properties'),
    iconName: 'icon-info',
};
const runtime = (comp) => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            comp.setState({
                notePropertiesDialogOptions: {
                    noteId: noteId,
                    visible: true,
                    onRevisionLinkClick: () => {
                        void CommandService_1.default.instance().execute('showRevisions');
                    },
                },
            });
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showNoteProperties.js.map