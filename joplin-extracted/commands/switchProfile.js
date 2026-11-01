"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const profileConfig_1 = require("@joplin/lib/services/profileConfig");
const restart_1 = __importDefault(require("../services/restart"));
exports.declaration = {
    name: 'switchProfile',
};
const runtime = () => {
    return {
        execute: async (context, profileId) => {
            const currentConfig = context.state.profileConfig;
            if (currentConfig.currentProfileId === profileId)
                return;
            const newConfig = Object.assign(Object.assign({}, currentConfig), { currentProfileId: profileId });
            await (0, profileConfig_1.saveProfileConfig)(`${Setting_1.default.value('rootProfileDir')}/profiles.json`, newConfig);
            await (0, restart_1.default)();
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=switchProfile.js.map