"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'toggleLayoutMoveMode',
    label: () => (0, locale_1._)('Change application layout'),
};
const runtime = () => {
    return {
        execute: async (context, value = null) => {
            const newValue = value !== null ? value : !context.state.layoutMoveMode;
            context.dispatch({
                type: 'LAYOUT_MOVE_MODE_SET',
                value: newValue,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=toggleLayoutMoveMode.js.map