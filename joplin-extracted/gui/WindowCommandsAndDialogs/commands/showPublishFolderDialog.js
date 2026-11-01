"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'showPublishFolderDialog',
    label: () => (0, locale_1._)('Publish notebook...'),
};
const runtime = (comp) => {
    return {
        execute: async (context, folderId = null) => {
            folderId = folderId || context.state.selectedFolderId;
            comp.setState({
                publishFolderDialogOptions: {
                    folderId,
                    visible: true,
                },
            });
        },
        enabledCondition: 'joplinServerConnected && (folderIsShareRootAndOwnedByUser || !folderIsShared)',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showPublishFolderDialog.js.map