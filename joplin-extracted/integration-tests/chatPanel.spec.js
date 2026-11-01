"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
test_1.test.describe('chatPanel', () => {
    (0, test_1.test)('should not clear undo history when opening/closing the chat panel', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('test');
        const noteEditor = mainScreen.noteEditor;
        const markdownEditor = await noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('Testing');
        await noteEditor.expectToHaveText('Testing');
        await mainScreen.chatPanel.configure(electronApp);
        await mainScreen.chatPanel.open(electronApp);
        await mainScreen.chatPanel.close(electronApp);
        // Should still have the correct content
        await noteEditor.expectToHaveText('Testing');
        // Should be possible to undo everything
        for (let i = 0; i < 'Testing'.length; i++) {
            await noteEditor.undo(electronApp);
        }
        await noteEditor.expectToHaveText(/^[\n]?$/);
    });
});
//# sourceMappingURL=chatPanel.spec.js.map