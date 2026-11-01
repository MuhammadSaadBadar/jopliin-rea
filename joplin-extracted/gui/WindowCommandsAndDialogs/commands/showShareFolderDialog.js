"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'showShareFolderDialog',
    label: () => (0, locale_1._)('Share notebook...'),
};
const runtime = (comp) => {
    return {
        execute: async (context, folderId = null) => {
            folderId = folderId || context.state.selectedFolderId;
            comp.setState({
                shareFolderDialogOptions: {
                    folderId,
                    visible: true,
                },
            });
        },
        enabledCondition: 'joplinServerConnected && joplinCloudAccountType != 1 && (folderIsShareRootAndOwnedByUser || !folderIsShared)',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showShareFolderDialog.js.map