"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const BaseItem_1 = __importDefault(require("@joplin/lib/models/BaseItem"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const showFolderPicker_1 = __importDefault(require("../utils/showFolderPicker"));
const logger = Logger_1.default.create('commands/moveToFolder');
exports.declaration = {
    name: 'moveToFolder',
    label: () => (0, locale_1._)('Move to notebook'),
};
const runtime = (comp) => {
    return {
        execute: async (context, itemIds = null) => {
            itemIds = itemIds || context.state.selectedNoteIds;
            let allAreFolders = true;
            const itemIdToType = new Map();
            for (const id of itemIds) {
                const item = await BaseItem_1.default.loadItemById(id);
                itemIdToType.set(id, item.type_);
                if (item.type_ !== BaseModel_1.ModelType.Folder) {
                    allAreFolders = false;
                }
            }
            const targetFolderId = await (0, showFolderPicker_1.default)(comp, {
                label: (0, locale_1._)('Move to notebook:'),
                // It's okay for folders (but not notes) to have no parent folder:
                allowSelectNone: allAreFolders,
                // Don't allow setting a folder as its own parent
                showFolder: (folder) => !itemIdToType.has(folder.id),
            });
            // It's important to allow the case where targetFolderId is the empty string,
            // since that corresponds to the toplevel notebook.
            if (targetFolderId !== null) {
                try {
                    for (const id of itemIds) {
                        if (id === targetFolderId) {
                            continue;
                        }
                        const itemType = itemIdToType.get(id);
                        if (itemType === BaseModel_1.ModelType.Note) {
                            await Note_1.default.moveToFolder(id, targetFolderId);
                        }
                        else if (itemType === BaseModel_1.ModelType.Folder) {
                            await Folder_1.default.moveToFolder(id, targetFolderId);
                        }
                        else {
                            throw new Error(`Cannot move item with type ${itemType}`);
                        }
                    }
                }
                catch (error) {
                    logger.error('Error moving items', error);
                    void shim_1.default.showMessageBox(`Error: ${error}`);
                }
            }
        },
        enabledCondition: 'someNotesSelected && !noteIsReadOnlyShare',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=moveToFolder.js.map