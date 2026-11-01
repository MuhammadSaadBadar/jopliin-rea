"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setSettingValue = async (app, mainWindow, key, value) => {
    const browserWindow = await app.browserWindow(mainWindow);
    await browserWindow.evaluateHandle((browserWindow, { key, value }) => {
        browserWindow.webContents.send('testing--setSetting', key, value);
    }, { key, value });
};
exports.default = setSettingValue;
//# sourceMappingURL=setSettingValue.js.map