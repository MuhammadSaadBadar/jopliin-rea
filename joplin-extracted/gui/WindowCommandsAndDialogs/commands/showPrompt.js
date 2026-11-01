"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'showPrompt',
};
var PromptInputType;
(function (PromptInputType) {
    PromptInputType["Dropdown"] = "dropdown";
    PromptInputType["Datetime"] = "datetime";
    PromptInputType["Tags"] = "tags";
    PromptInputType["Text"] = "text";
})(PromptInputType || (PromptInputType = {}));
const runtime = (comp) => {
    return {
        execute: async (_context, config) => {
            return new Promise((resolve) => {
                comp.setState({
                    promptOptions: Object.assign(Object.assign({}, config), { onClose: async (answer, buttonType) => {
                            comp.setState({ promptOptions: null });
                            resolve({
                                answer: answer,
                                buttonType: buttonType,
                            });
                        } }),
                });
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showPrompt.js.map