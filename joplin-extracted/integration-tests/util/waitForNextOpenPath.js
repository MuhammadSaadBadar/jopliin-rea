"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waitForNextOpenPath = (electronApp) => {
    return electronApp.evaluate(async ({ shell }) => {
        return new Promise(resolve => {
            const originalOpenPath = shell.openPath;
            shell.openPath = async (path) => {
                shell.openPath = originalOpenPath;
                resolve(path);
                return '';
            };
        });
    });
};
exports.default = waitForNextOpenPath;
//# sourceMappingURL=waitForNextOpenPath.js.map