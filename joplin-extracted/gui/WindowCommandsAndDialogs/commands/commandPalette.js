"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const gotoAnything_1 = require("./gotoAnything");
exports.declaration = {
    name: 'commandPalette',
    label: () => (0, locale_1._)('Command palette...'),
};
const runtime = () => {
    return {
        execute: async (_context) => {
            void CommandService_1.default.instance().execute('gotoAnything', gotoAnything_1.UiType.CommandPalette);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=commandPalette.js.map