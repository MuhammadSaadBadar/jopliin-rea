"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getMainWindow = async (electronApp) => {
    return await electronApp.firstWindow();
};
exports.default = getMainWindow;
//# sourceMappingURL=getMainWindow.js.map