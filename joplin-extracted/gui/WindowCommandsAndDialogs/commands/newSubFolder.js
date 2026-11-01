"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'newSubFolder',
    label: () => (0, locale_1._)('New sub-notebook'),
    iconName: 'fa-book',
};
const runtime = () => {
    return {
        execute: async (context, parentId = null) => {
            parentId = parentId || context.state.selectedFolderId;
            return CommandService_1.default.instance().execute('newFolder', parentId);
        },
        enabledCondition: '!folderIsReadOnly && !folderIsTrash',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=newSubFolder.js.map