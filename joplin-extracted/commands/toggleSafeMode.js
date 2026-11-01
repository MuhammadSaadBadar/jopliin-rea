"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const restart_1 = __importDefault(require("../services/restart"));
exports.declaration = {
    name: 'toggleSafeMode',
    label: () => (0, locale_1._)('Toggle safe mode'),
};
const runtime = () => {
    return {
        execute: async (_context, enabled = null) => {
            enabled = enabled !== null ? enabled : !Setting_1.default.value('isSafeMode');
            Setting_1.default.setValue('isSafeMode', enabled);
            await Setting_1.default.saveAll();
            await (0, restart_1.default)();
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleSafeMode.js.map