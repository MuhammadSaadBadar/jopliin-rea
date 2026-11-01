"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'showModalMessage',
};
const runtime = () => {
    return {
        execute: async (context, message) => {
            context.dispatch({
                type: 'SHOW_MODAL_MESSAGE',
                message,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showModalMessage.js.map