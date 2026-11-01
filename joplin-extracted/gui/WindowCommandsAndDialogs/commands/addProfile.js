"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const profileConfig_1 = require("@joplin/lib/services/profileConfig");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const restart_1 = __importDefault(require("../../../services/restart"));
exports.declaration = {
    name: 'addProfile',
    label: () => (0, locale_1._)('Create new profile...'),
};
const runtime = (comp) => {
    return {
        execute: async (context) => {
            comp.setState({
                promptOptions: {
                    label: (0, locale_1._)('Profile name:'),
                    buttons: ['create', 'cancel'],
                    value: '',
                    onClose: async (answer) => {
                        if (answer) {
                            const { newConfig, newProfile } = (0, profileConfig_1.createNewProfile)(context.state.profileConfig, answer);
                            newConfig.currentProfileId = newProfile.id;
                            await (0, profileConfig_1.saveProfileConfig)(`${Setting_1.default.value('rootProfileDir')}/profiles.json`, newConfig);
                            await (0, restart_1.default)();
                        }
                        comp.setState({ promptOptions: null });
                    },
                },
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=addProfile.js.map