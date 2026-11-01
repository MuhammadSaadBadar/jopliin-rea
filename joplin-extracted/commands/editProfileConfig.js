"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const utils_1 = require("@joplin/lib/services/ExternalEditWatcher/utils");
const bridge_1 = __importDefault(require("../services/bridge"));
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'editProfileConfig',
    label: () => (0, locale_1._)('Edit profile configuration...'),
};
const runtime = () => {
    return {
        execute: async (_context) => {
            await (0, utils_1.openFileWithExternalEditor)(`${Setting_1.default.value('rootProfileDir')}/profiles.json`, (0, bridge_1.default)());
        },
        enabledCondition: 'hasMultiProfiles',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=editProfileConfig.js.map