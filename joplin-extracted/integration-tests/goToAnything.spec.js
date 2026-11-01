"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
test_1.test.describe('goToAnything', () => {
    (0, test_1.test)('clicking outside of go to anything should close it', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Test');
        await mainScreen.noteEditor.waitFor();
        const goToAnything = mainScreen.goToAnything;
        await goToAnything.open(electronApp);
        await goToAnything.expectToBeOpen();
        // Click outside of the dialog
        await goToAnything.containerLocator.click({ position: { x: 0, y: 0 } });
        await goToAnything.expectToBeClosed();
    });
    (0, test_1.test)('pressing escape in go to anything should close it ', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const goToAnything = mainScreen.goToAnything;
        // Pressing Escape to close the dialog should work even if opened multiple times in a row.
        for (let i = 0; i < 3; i++) {
            await goToAnything.open(electronApp);
            await goToAnything.expectToBeOpen();
            await goToAnything.inputLocator.press('Escape');
            await goToAnything.expectToBeClosed();
        }
    });
    (0, test_1.test)('closing go to anything should restore the original keyboard focus', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('');
        const markdownEditor = await mainScreen.noteEditor.showMarkdownEditor();
        const initialFocusLocators = [
            [mainScreen.noteEditor.noteTitleInput, true],
            [markdownEditor.container, false],
        ];
        // Focus and start to fill the editor
        for (const [originalFocusLocator, isInput] of initialFocusLocators) {
            await originalFocusLocator.click();
            await mainWindow.keyboard.type('Test');
            const goToAnything = mainScreen.goToAnything;
            await goToAnything.open(electronApp);
            await goToAnything.expectToBeOpen();
            await goToAnything.inputLocator.press('Escape');
            await goToAnything.expectToBeClosed();
            // Keyboard focus should have returned to the editor
            await mainWindow.keyboard.type('ing...');
            if (isInput) {
                await (0, test_1.expect)(originalFocusLocator).toBeFocused();
                await (0, test_1.expect)(originalFocusLocator).toHaveValue('Testing...');
            }
            else {
                await (0, test_1.expect)(originalFocusLocator).toHaveText('Testing...');
            }
        }
    });
    for (const activateWithClick of [true, false]) {
        (0, test_1.test)(`should be possible to show the set tags dialog from goToAnything (activate with click: ${activateWithClick})`, async ({ electronApp, mainWindow }) => {
            const mainScreen = await new MainScreen_1.default(mainWindow).setup();
            await mainScreen.createNewNote('Test note');
            const goToAnything = mainScreen.goToAnything;
            await goToAnything.open(electronApp);
            await goToAnything.inputLocator.fill(':setTags');
            // Should show a matching command
            const result = goToAnything.resultLocator('Tags (setTags)');
            await (0, test_1.expect)(result).toBeAttached();
            if (activateWithClick) {
                await result.click();
            }
            else {
                await mainWindow.keyboard.press('Enter');
            }
            await goToAnything.expectToBeClosed();
            // Should show the "set tags" dialog
            const setTagsLabel = mainWindow.getByText('Add or remove tags:');
            await (0, test_1.expect)(setTagsLabel).toBeVisible();
        });
        // The note link dialog internally uses the same component as GotoAnything
        (0, test_1.test)(`should be possible to attach note links (activate with click: ${activateWithClick})`, async ({ electronApp, mainWindow }) => {
            const mainScreen = await new MainScreen_1.default(mainWindow).setup();
            await mainScreen.createNewNote('Target note');
            await mainScreen.createNewNote('Test note');
            const goToAnything = mainScreen.goToAnything;
            await goToAnything.openLinkToNote(electronApp);
            const result = goToAnything.resultLocator('Target note');
            await goToAnything.searchForWithRetry('Target not', result);
            // Should show a matching command
            await (0, test_1.expect)(result).toBeAttached();
            if (activateWithClick) {
                await result.click();
            }
            else {
                await mainWindow.keyboard.press('Enter');
            }
            await goToAnything.expectToBeClosed();
            // Should have added the link
            await mainScreen.noteEditor.expectToHaveText(/\[Target note\]/);
        });
    }
});
//# sourceMappingURL=goToAnything.spec.js.map