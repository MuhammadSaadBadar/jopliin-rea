"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
exports.declaration = {
    name: 'focusElement',
};
const runtime = () => {
    return {
        execute: async (_context, target, options) => {
            if (target === 'noteBody')
                return CommandService_1.default.instance().execute('focusElementNoteBody', options);
            if (target === 'noteList')
                return CommandService_1.default.instance().execute('focusElementNoteList');
            if (target === 'sideBar')
                return CommandService_1.default.instance().execute('focusElementSideBar');
            if (target === 'noteTitle')
                return CommandService_1.default.instance().execute('focusElementNoteTitle', options);
            if (target === 'toolbar')
                return CommandService_1.default.instance().execute('focusElementToolbar', options);
            throw new Error(`Invalid focus target: ${target}`);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElement.js.map