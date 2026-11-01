"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const profileConfig_1 = require("@joplin/lib/services/profileConfig");
exports.declaration = {
    name: 'switchProfile2',
    label: () => (0, locale_1._)('Switch to profile %d', 2),
};
const runtime = () => {
    return {
        execute: async (context) => {
            await CommandService_1.default.instance().execute('switchProfile', (0, profileConfig_1.profileIdByIndex)(context.state.profileConfig, 1));
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=switchProfile2.js.map