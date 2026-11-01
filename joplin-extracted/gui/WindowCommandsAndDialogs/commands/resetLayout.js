"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
exports.declaration = {
    name: 'resetLayout',
    label: () => (0, locale_1._)('Reset application layout'),
};
const runtime = () => {
    return {
        execute: async (context) => {
            const message = (0, locale_1._)('Are you sure you want to return to the default layout? The current layout configuration will be lost.');
            const isConfirmed = await shim_1.default.showConfirmationDialog(message);
            if (!isConfirmed)
                return;
            context.dispatch({
                type: 'RESET_LAYOUT',
                value: true,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=resetLayout.js.map