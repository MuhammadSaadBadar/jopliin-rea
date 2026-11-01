"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const app_reducer_1 = require("../app.reducer");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.declaration = {
    name: 'openNoteInNewWindow',
    label: () => (0, locale_1._)('Open in new window'),
    iconName: 'icon-share',
};
let idCounter = 0;
const runtime = () => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            const note = await Note_1.default.load(noteId, { fields: ['parent_id'] });
            context.dispatch({
                type: 'WINDOW_OPEN',
                noteId,
                folderId: note.parent_id,
                windowId: `window-${noteId}-${idCounter++}`,
                defaultAppWindowState: Object.assign(Object.assign({}, (0, app_reducer_1.createAppDefaultWindowState)()), { noteVisiblePanes: Setting_1.default.value('noteVisiblePanes'), editorCodeView: Setting_1.default.value('editor.codeView') }),
            });
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openNoteInNewWindow.js.map