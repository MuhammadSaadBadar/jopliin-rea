"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./test");
const getMainWindow_1 = __importDefault(require("./getMainWindow"));
// Currently only supports mocking reading/writing text
const mockClipboard = async (electronApp, clipboardText) => {
    const mainWindow = await (0, getMainWindow_1.default)(electronApp);
    await mainWindow.evaluate(async (clipboardText) => {
        const { clipboard } = require('electron');
        clipboard.writeText = (text) => {
            clipboardText = text;
        };
        clipboard.readText = () => {
            return clipboardText;
        };
    }, clipboardText);
    return {
        expectClipboardToMatch: async (text) => {
            await test_1.expect.poll(async () => {
                return await mainWindow.evaluate(() => {
                    return require('electron').clipboard.readText();
                });
            }).toBe(text);
        },
    };
};
exports.default = mockClipboard;
//# sourceMappingURL=mockClipboard.js.map