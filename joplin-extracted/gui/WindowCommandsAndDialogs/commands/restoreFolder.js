"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const restoreItems_1 = __importDefault(require("@joplin/lib/services/trash/restoreItems"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
exports.declaration = {
    name: 'restoreFolder',
    label: () => (0, locale_1._)('Restore notebook'),
    iconName: 'fas fa-trash-restore',
};
const runtime = () => {
    return {
        execute: async (context, folderIds = null) => {
            if (folderIds === null)
                folderIds = context.state.selectedFolderIds;
            if (!Array.isArray(folderIds)) {
                folderIds = [folderIds];
            }
            const folders = await Folder_1.default.loadItemsByIdsOrFail(folderIds);
            await (0, restoreItems_1.default)(BaseModel_1.ModelType.Folder, folders);
        },
        enabledCondition: 'foldersAreDeleted',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=restoreFolder.js.map