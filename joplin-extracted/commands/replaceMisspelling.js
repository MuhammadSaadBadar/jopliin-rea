"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const bridge_1 = __importDefault(require("../services/bridge"));
const dom_1 = require("@joplin/lib/dom");
exports.declaration = {
    name: 'replaceMisspelling',
};
const runtime = () => {
    return {
        execute: async (context, suggestion) => {
            const state = context.state;
            const modalDialogVisible = !!Object.keys(state.visibleDialogs).length;
            // If we're inside one of the editors, we need to use their own
            // replaceSelection command to set the suggested word. Outside of
            // it, we can use the Chrome built-in replaceMisspelling function,
            // which will work in any standard text input.
            const activeElement = document.activeElement;
            if (!modalDialogVisible && ((0, dom_1.isInsideContainer)(activeElement, 'codeMirrorEditor') || (0, dom_1.isInsideContainer)(activeElement, 'tox-edit-area__iframe'))) {
                await CommandService_1.default.instance().execute('replaceSelection', suggestion);
            }
            else {
                (0, bridge_1.default)().activeWindow().webContents.replaceMisspelling(suggestion);
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=replaceMisspelling.js.map