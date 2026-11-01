"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'openTag',
};
const runtime = () => {
    return {
        execute: async (context, tagId) => {
            context.dispatch({
                type: 'TAG_SELECT',
                id: tagId,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openTag.js.map