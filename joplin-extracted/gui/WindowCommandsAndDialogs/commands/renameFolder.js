"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'renameFolder',
    label: () => (0, locale_1._)('Rename'),
};
const runtime = (comp) => {
    return {
        execute: async (context, folderId = null) => {
            folderId = folderId || context.state.selectedFolderId;
            const folder = await Folder_1.default.load(folderId);
            if (folder) {
                comp.setState({
                    promptOptions: {
                        label: (0, locale_1._)('Rename notebook:'),
                        value: folder.title,
                        onClose: async (answer) => {
                            if (answer !== null) {
                                try {
                                    folder.title = answer;
                                    await Folder_1.default.save(folder, { fields: ['title'], userSideValidation: true });
                                }
                                catch (error) {
                                    (0, bridge_1.default)().showErrorMessageBox(error.message);
                                }
                            }
                            comp.setState({ promptOptions: null });
                        },
                    },
                });
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=renameFolder.js.map