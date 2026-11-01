"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const trash_1 = require("@joplin/lib/services/trash");
const string_utils_1 = require("@joplin/lib/string-utils");
exports.declaration = {
    name: 'deleteFolder',
    label: () => (0, locale_1._)('Delete notebook'),
};
const runtime = () => {
    return {
        execute: async (context, folderIds = null) => {
            if (folderIds === null) {
                folderIds = context.state.selectedFolderIds;
            }
            if (!Array.isArray(folderIds)) {
                folderIds = [folderIds];
            }
            folderIds = folderIds.filter(id => id !== (0, trash_1.getTrashFolderId)());
            if (folderIds.length === 0) {
                throw new Error('Nothing to do: At least one valid folder must be specified.');
            }
            const folders = await Folder_1.default.loadItemsByIdsOrFail(folderIds);
            const deleteMessage = [];
            if (folders.length === 1) {
                deleteMessage.push((0, locale_1._)('Move notebook "%s" to the trash?\n\nAll notes and sub-notebooks within this notebook will also be moved to the trash.', (0, string_utils_1.substrWithEllipsis)(folders[0].title, 0, 32)));
            }
            else {
                deleteMessage.push((0, locale_1._)('Move %d notebooks to the trash?\n\nAll notes and sub-notebooks within these notebooks will also be moved to the trash.', folders.length));
            }
            if (folders.some(folder => folder.id === context.state.settings['sync.10.inboxId'])) {
                deleteMessage.push((0, locale_1._)('Delete the Inbox notebook?\n\nIf you delete the inbox notebook, any email that\'s recently been sent to it may be lost.'));
            }
            const ok = (0, bridge_1.default)().showConfirmMessageBox(deleteMessage.join('\n\n'));
            if (!ok)
                return;
            await Folder_1.default.batchDelete(folderIds, { toTrash: true, sourceDescription: 'deleteFolder command' });
        },
        enabledCondition: '!foldersIncludeReadOnly',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=deleteFolder.js.map