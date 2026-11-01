"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'openFolderDialog',
    label: () => (0, locale_1._)('Edit'),
};
const runtime = () => {
    return {
        execute: async (context, options = null) => {
            options = Object.assign({ isNew: false }, options);
            if (options.isNew && !('parentId' in options))
                throw new Error('parentId mst be specified when creating a new folder');
            if (!options.isNew && !('folderId' in options))
                throw new Error('folderId property is required');
            context.dispatch({
                type: 'DIALOG_OPEN',
                name: 'editFolder',
                isOpen: true,
                props: {
                    folderId: options.folderId,
                    parentId: options.parentId,
                },
            });
        },
        enabledCondition: '!folderIsReadOnly',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openFolderDialog.js.map