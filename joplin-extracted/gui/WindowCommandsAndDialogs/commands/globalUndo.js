"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const canUseNativeUndo_1 = __importDefault(require("./utils/canUseNativeUndo"));
exports.declaration = {
    name: 'globalUndo',
    label: () => (0, locale_1._)('Undo'),
};
const runtime = (control) => {
    return {
        execute: async (_context) => {
            // As of January 2026, webContents.undo() doesn't work properly in more complex
            // edit controls (e.g. CodeMirror or TinyMCE). Only use it when a more simple input
            // has focus:
            if ((0, canUseNativeUndo_1.default)(control)) {
                (0, bridge_1.default)().activeWindow().webContents.undo();
            }
            else {
                await CommandService_1.default.instance().execute('editor.undo');
            }
        },
        enabledCondition: '',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=globalUndo.js.map