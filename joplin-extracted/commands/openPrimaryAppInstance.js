"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../services/bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.declaration = {
    name: 'openPrimaryAppInstance',
    label: () => (0, locale_1._)('Open primary app instance...'),
};
const runtime = () => {
    return {
        execute: async (_context) => {
            await (0, bridge_1.default)().launchMainAppInstance(Setting_1.default.value('env'));
        },
        enabledCondition: 'isAltInstance',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openPrimaryAppInstance.js.map