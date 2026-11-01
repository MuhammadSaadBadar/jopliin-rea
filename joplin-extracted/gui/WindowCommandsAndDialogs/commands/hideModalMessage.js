"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'hideModalMessage',
};
const runtime = () => {
    return {
        execute: async (context) => {
            context.dispatch({ type: 'HIDE_MODAL_MESSAGE' });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=hideModalMessage.js.map