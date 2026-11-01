"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const newNote_1 = require("./newNote");
exports.declaration = {
    name: 'newTodo',
    label: () => (0, locale_1._)('New to-do'),
    iconName: 'fa-check-square',
};
const runtime = () => {
    return {
        execute: async (_context, body = '') => {
            return CommandService_1.default.instance().execute('newNote', body, true);
        },
        enabledCondition: newNote_1.newNoteEnabledConditions,
    };
};
exports.runtime = runtime;
//# sourceMappingURL=newTodo.js.map