"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'newFolder',
    label: () => (0, locale_1._)('New notebook'),
    iconName: 'fa-book',
};
const runtime = () => {
    return {
        execute: async (_context, parentId = null) => {
            const options = {
                isNew: true,
                parentId: parentId,
            };
            void CommandService_1.default.instance().execute('openFolderDialog', options);
        },
        enabledCondition: '!folderIsReadOnly',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=newFolder.js.map