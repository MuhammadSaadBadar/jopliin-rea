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
    name: 'globalRedo',
    label: () => (0, locale_1._)('Redo'),
};
const runtime = (control) => {
    return {
        execute: async (_context) => {
            if ((0, canUseNativeUndo_1.default)(control)) {
                (0, bridge_1.default)().activeWindow().webContents.redo();
            }
            else {
                await CommandService_1.default.instance().execute('editor.redo');
            }
        },
        enabledCondition: '',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=globalRedo.js.map