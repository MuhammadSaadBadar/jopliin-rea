"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const NoteListUtils_1 = __importDefault(require("../../utils/NoteListUtils"));
const useOnContextMenu = (selectedNoteIds, selectedFolderId, notes, dispatch, watchedNoteFiles, plugins, customCss) => {
    return (0, react_1.useCallback)((event) => {
        var _a, _b;
        let currentNoteId = (_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.getAttribute('data-id');
        if ('itemId' in event) {
            currentNoteId = event.itemId;
        }
        if (!currentNoteId)
            return;
        (_b = event.preventDefault) === null || _b === void 0 ? void 0 : _b.call(event);
        let noteIds = [];
        if (selectedNoteIds.indexOf(currentNoteId) < 0) {
            noteIds = [currentNoteId];
        }
        else {
            noteIds = selectedNoteIds;
        }
        if (!noteIds.length)
            return;
        const menu = NoteListUtils_1.default.makeContextMenu(noteIds, {
            notes: notes,
            dispatch: dispatch,
            watchedNoteFiles: watchedNoteFiles,
            plugins: plugins,
            inConflictFolder: selectedFolderId === Folder_1.default.conflictFolderId(),
            customCss: customCss,
        });
        menu.popup({ window: (0, bridge_1.default)().mainWindow() });
    }, [selectedNoteIds, notes, dispatch, watchedNoteFiles, plugins, selectedFolderId, customCss]);
};
exports.default = useOnContextMenu;
//# sourceMappingURL=useOnContextMenu.js.map