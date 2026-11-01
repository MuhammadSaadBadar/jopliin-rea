"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'renameTag',
    label: () => (0, locale_1._)('Rename'),
};
const runtime = (comp) => {
    return {
        execute: async (context, tagId = null) => {
            tagId = tagId || context.state.selectedTagId;
            if (!tagId)
                return;
            const tag = await Tag_1.default.load(tagId);
            if (tag) {
                comp.setState({
                    promptOptions: {
                        label: (0, locale_1._)('Rename tag:'),
                        value: tag.title,
                        onClose: async (answer) => {
                            if (answer !== null) {
                                try {
                                    tag.title = answer;
                                    await Tag_1.default.save(tag, { fields: ['title'], userSideValidation: true });
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
//# sourceMappingURL=renameTag.js.map