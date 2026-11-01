"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const InteropServiceHelper_1 = __importDefault(require("../../../InteropServiceHelper"));
const locale_1 = require("@joplin/lib/locale");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'exportPdf',
    label: () => `PDF - ${(0, locale_1._)('PDF File')}`,
};
const runtime = (comp) => {
    return {
        execute: async (context, noteIds = null) => {
            try {
                noteIds = noteIds || context.state.selectedNoteIds;
                if (!noteIds.length)
                    throw new Error('No notes selected for pdf export');
                let path = null;
                if (noteIds.length === 1) {
                    path = await (0, bridge_1.default)().showSaveDialog({
                        filters: [{ name: (0, locale_1._)('PDF File'), extensions: ['pdf'] }],
                        defaultPath: await InteropServiceHelper_1.default.defaultFilename(noteIds[0], 'pdf'),
                    });
                }
                else {
                    path = await (0, bridge_1.default)().showOpenDialog({
                        properties: ['openDirectory', 'createDirectory'],
                    });
                }
                if (Array.isArray(path)) {
                    if (path.length > 1) {
                        throw new Error('Only one output directory can be selected');
                    }
                    path = path[0];
                }
                if (!path)
                    return;
                for (let i = 0; i < noteIds.length; i++) {
                    const note = await Note_1.default.load(noteIds[i]);
                    let pdfPath = '';
                    if (noteIds.length === 1) {
                        pdfPath = path;
                    }
                    else {
                        const n = await InteropServiceHelper_1.default.defaultFilename(note.id, 'pdf');
                        pdfPath = await shim_1.default.fsDriver().findUniqueFilename(`${path}/${n}`);
                    }
                    await comp.printTo('pdf', { path: pdfPath, noteId: note.id });
                }
            }
            catch (error) {
                console.error(error);
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        },
        enabledCondition: 'someNotesSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=exportPdf.js.map