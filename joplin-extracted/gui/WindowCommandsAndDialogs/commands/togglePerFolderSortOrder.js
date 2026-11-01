"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const PerFolderSortOrderService_1 = __importDefault(require("@joplin/lib/services/sortOrder/PerFolderSortOrderService"));
exports.declaration = {
    name: 'togglePerFolderSortOrder',
    label: () => (0, locale_1._)('Toggle own sort order'),
};
const runtime = () => {
    return {
        enabledCondition: 'oneFolderSelected',
        execute: async (_context, folderId, own) => {
            PerFolderSortOrderService_1.default.set(folderId, own);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=togglePerFolderSortOrder.js.map