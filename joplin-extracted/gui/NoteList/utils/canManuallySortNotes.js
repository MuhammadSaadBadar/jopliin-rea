"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
const canManuallySortNotes = (notesParentType, noteSortOrder, selectedFolderInTrash) => {
    if (notesParentType !== 'Folder')
        return false;
    if (selectedFolderInTrash)
        return false;
    if (noteSortOrder !== 'order') {
        const doIt = (0, bridge_1.default)().showConfirmMessageBox((0, locale_1._)('To manually sort the notes, the sort order must be changed to "%s" in the menu "%s" > "%s"', (0, locale_1._)('Custom order'), (0, locale_1._)('View'), (0, locale_1._)('Sort notes by')), {
            buttons: [(0, locale_1._)('Do it now'), (0, locale_1._)('Cancel')],
        });
        if (!doIt)
            return false;
        Setting_1.default.setValue('notes.sortOrder.field', 'order');
        return false;
    }
    return true;
};
exports.default = canManuallySortNotes;
//# sourceMappingURL=canManuallySortNotes.js.map