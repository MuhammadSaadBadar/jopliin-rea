"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setMessageBoxResponse = (electronApp, responseMatch) => {
    return electronApp.evaluate(async ({ dialog }, responseMatch) => {
        const getMatchingButton = (dialogArgs) => {
            const matchingButton = (options) => {
                var _a;
                const buttons = (_a = options.buttons) !== null && _a !== void 0 ? _a : ['OK'];
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i].match(responseMatch)) {
                        return i;
                    }
                }
                throw new Error('No matching button found');
            };
            if (dialogArgs.length === 1) {
                return matchingButton(dialogArgs[0]);
            }
            else {
                return matchingButton(dialogArgs[1]);
            }
        };
        dialog.showMessageBoxSync = (...args) => getMatchingButton(args);
        dialog.showMessageBox = async (...args) => ({
            response: getMatchingButton(args),
            checkboxChecked: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mock return; cast prevents breakage when Electron's MessageBoxReturnValue shape evolves
        });
    }, responseMatch);
};
exports.default = setMessageBoxResponse;
//# sourceMappingURL=setMessageBoxResponse.js.map