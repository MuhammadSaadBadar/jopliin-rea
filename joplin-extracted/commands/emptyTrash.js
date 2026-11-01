"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const emptyTrash_1 = __importDefault(require("@joplin/lib/services/trash/emptyTrash"));
const bridge_1 = __importDefault(require("../services/bridge"));
exports.declaration = {
    name: 'emptyTrash',
    label: () => (0, locale_1._)('Empty trash'),
};
const runtime = () => {
    return {
        execute: async () => {
            const ok = await (0, bridge_1.default)().showConfirmMessageBox((0, locale_1._)('This will permanently delete all items in the trash. Continue?'), {
                buttons: [
                    (0, locale_1._)('Empty trash'),
                    (0, locale_1._)('Cancel'),
                ],
            });
            if (ok)
                await (0, emptyTrash_1.default)();
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=emptyTrash.js.map