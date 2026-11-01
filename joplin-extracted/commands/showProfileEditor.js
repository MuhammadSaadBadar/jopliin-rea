"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'showProfileEditor',
    label: () => (0, locale_1._)('Manage profiles'),
};
const runtime = () => {
    return {
        execute: async (context) => {
            context.dispatch({
                type: 'NAV_GO',
                routeName: 'ProfileEditor',
            });
        },
        enabledCondition: 'hasMultiProfiles',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showProfileEditor.js.map