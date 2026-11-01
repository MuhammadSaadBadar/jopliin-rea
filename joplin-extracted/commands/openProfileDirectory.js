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
    name: 'openProfileDirectory',
    label: () => (0, locale_1._)('Open profile directory'),
};
const runtime = () => {
    return {
        execute: async () => {
            void (0, bridge_1.default)().openItem(Setting_1.default.value('profileDir'));
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openProfileDirectory.js.map