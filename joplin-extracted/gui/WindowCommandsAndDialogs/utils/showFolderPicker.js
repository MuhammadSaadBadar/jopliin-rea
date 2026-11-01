"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const locale_1 = require("@joplin/lib/locale");
const showFolderPicker = async (control, { label, allowSelectNone, showFolder }) => {
    const folders = await Folder_1.default.sortFolderTree(null, { includeDeleted: false });
    const startFolders = [];
    const maxDepth = 15;
    if (allowSelectNone) {
        startFolders.push({
            key: '',
            value: '',
            label: (0, locale_1._)('None'),
            indentDepth: 0,
        });
    }
    const addOptions = (folders, depth) => {
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            if (!showFolder(folder)) {
                continue;
            }
            startFolders.push({ key: folder.id, value: folder.id, label: folder.title, indentDepth: depth });
            if (folder.children)
                addOptions(folder.children, (depth + 1) < maxDepth ? depth + 1 : maxDepth);
        }
    };
    addOptions(folders, 0);
    const folderId = await control.showPrompt({
        label,
        value: '',
        suggestions: startFolders,
    });
    return folderId;
};
exports.default = showFolderPicker;
//# sourceMappingURL=showFolderPicker.js.map