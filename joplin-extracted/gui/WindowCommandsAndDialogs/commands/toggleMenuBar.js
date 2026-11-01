"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'toggleMenuBar',
    label: () => (0, locale_1._)('Toggle menu bar'),
};
const runtime = () => {
    return {
        execute: async () => {
            Setting_1.default.toggle('showMenuBar');
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleMenuBar.js.map