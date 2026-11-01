"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const NoteEditorScreen_1 = __importDefault(require("./models/NoteEditor/NoteEditorScreen"));
test_1.test.describe('multiWindow', () => {
    // Disabled: Playwright's page.close() triggers a different code path than
    // a user closing the window, causing the test to be unreliable.
    // The fix works correctly in manual testing (see https://github.com/laurent22/joplin/issues/14628).
    test_1.test.fixme('should not crash when closing a secondary window', async ({ mainWindow, electronApp }) => {
        const mainPage = await new MainScreen_1.default(mainWindow).setup();
        await mainPage.createNewNote('Test');
        const window = await mainPage.openNewWindow(electronApp);
        // Should load successfully
        const screen = new NoteEditorScreen_1.default(window);
        await screen.waitFor();
        // Close the secondary window
        await window.close();
        // Wait for the Portal cleanup to complete before checking main window stability
        await mainWindow.waitForTimeout(2000);
        // Main window should remain stable — no white screen or renderer crash
        await mainPage.noteEditor.waitFor();
    });
    test_1.test.fixme('should support quickly creating, then closing secondary windows', async ({ mainWindow, electronApp }) => {
        const mainPage = await new MainScreen_1.default(mainWindow).setup();
        await mainPage.createNewNote('Test');
        const windows = [];
        for (let i = 0; i < 4; i++) {
            const window = await mainPage.openNewWindow(electronApp);
            // Should load successfully
            const screen = new NoteEditorScreen_1.default(window);
            await screen.waitFor();
            windows.push(window);
        }
        // Close them all, very quickly.
        for (const window of windows) {
            await window.close();
        }
        // Should not have crashed
        await mainPage.noteEditor.waitFor();
    });
});
//# sourceMappingURL=multiWindow.spec.js.map