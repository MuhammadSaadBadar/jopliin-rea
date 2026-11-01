"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'openFolder',
};
const runtime = () => {
    return {
        execute: async (context, folderId) => {
            context.dispatch({
                type: 'FOLDER_SELECT',
                id: folderId,
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openFolder.js.map