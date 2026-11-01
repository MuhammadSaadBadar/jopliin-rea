"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const time_1 = require("@joplin/utils/time");
test_1.test.describe('sidebar', () => {
    (0, test_1.test)('should be able to create new folders', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        for (let i = 0; i < 3; i++) {
            const title = `Test folder ${i}`;
            await sidebar.createNewFolder(title);
            await (0, test_1.expect)(sidebar.container.getByText(title)).toBeAttached();
        }
        // The first folder should still be visible
        await (0, test_1.expect)(sidebar.container.getByText('Test folder 0')).toBeAttached();
    });
    (0, test_1.test)('should allow changing the focused folder with the arrow keys', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const folderAHeader = await sidebar.createNewFolder('Folder A');
        await (0, test_1.expect)(folderAHeader).toBeVisible();
        const folderBHeader = await sidebar.createNewFolder('Folder B');
        await (0, test_1.expect)(folderBHeader).toBeVisible();
        await folderBHeader.click();
        await sidebar.forceUpdateSorting(electronApp);
        await folderBHeader.click();
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder A');
        await mainWindow.keyboard.press('ArrowDown');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder B');
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder A');
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('All notes');
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText(/NOTEBOOKS/i);
        await mainWindow.keyboard.press('ArrowDown');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('All notes');
    });
    // Regression test for https://github.com/laurent22/joplin/issues/15029
    (0, test_1.test)('should remain focused when navigating with the arrow keys', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        // Build the folder hierarchy: Navigating upwards through the list
        // should transition from a notebook with more notes to a notebook with
        // fewer notes.
        const folderAHeader = await sidebar.createNewFolder('Folder A');
        await mainScreen.createNewNote('Test');
        await (0, test_1.expect)(folderAHeader).toBeVisible();
        const folderBHeader = await sidebar.createNewFolder('Folder B');
        await mainScreen.createNewNote('Test 2');
        await mainScreen.createNewNote('Test 3');
        const folderCHeader = await sidebar.createNewFolder('Folder C');
        const folderDHeader = await sidebar.createNewFolder('Folder D');
        await folderBHeader.dragTo(folderAHeader);
        await folderCHeader.dragTo(folderAHeader);
        // Should have the correct initial state
        await sidebar.forceUpdateSorting(electronApp);
        await sidebar.expectToHaveDepths([
            [folderAHeader, 2],
            [folderBHeader, 3],
            [folderCHeader, 3],
            [folderDHeader, 2],
        ]);
        const assertFocused = async (title) => {
            await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText(title);
            // Pause to help check that focus is stable. This is present to help this test more reliably detect
            // timing-related issues.
            await mainWindow.waitForTimeout(time_1.Second);
            await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText(title);
        };
        await folderDHeader.click();
        // Focus should remain on the correct folder header while navigating
        await mainWindow.keyboard.press('ArrowUp');
        await assertFocused(/^Folder C/);
        await mainWindow.keyboard.press('ArrowUp');
        await assertFocused(/^Folder B/);
        await mainWindow.keyboard.press('ArrowUp');
        await assertFocused(/^Folder A/);
    });
    (0, test_1.test)('should allow changing the focused folder by pressing the first character of the title', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const folderAHeader = await sidebar.createNewFolder('1-Test A');
        await (0, test_1.expect)(folderAHeader).toBeVisible();
        const folderBHeader = await sidebar.createNewFolder('Folder b');
        await (0, test_1.expect)(folderBHeader).toBeVisible();
        await folderBHeader.click();
        await sidebar.forceUpdateSorting(electronApp);
        await folderBHeader.click();
        await mainWindow.keyboard.type('1');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('1-Test A');
        await mainWindow.keyboard.type('F');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder b');
        await mainWindow.keyboard.type('A');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('All notes');
        // Should be case-insensitive
        await mainWindow.keyboard.type('f');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder b');
    });
    (0, test_1.test)('left/right arrow keys should expand/collapse notebooks', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        // Build the folder hierarchy
        const folderAHeader = await sidebar.createNewFolder('Folder A');
        await (0, test_1.expect)(folderAHeader).toBeVisible();
        const folderBHeader = await sidebar.createNewFolder('Folder B');
        const folderCHeader = await sidebar.createNewFolder('Folder C');
        const folderDHeader = await sidebar.createNewFolder('Folder D');
        await folderBHeader.dragTo(folderAHeader);
        await folderCHeader.dragTo(folderAHeader);
        await folderDHeader.dragTo(folderCHeader);
        // Folders should have correct initial levels
        await sidebar.expectToHaveDepths([
            [folderAHeader, 2],
            [folderBHeader, 3],
            [folderCHeader, 3],
            [folderDHeader, 4],
        ]);
        await sidebar.forceUpdateSorting(electronApp);
        await folderBHeader.click();
        // Pressing [left] on a folder with no children should jump to its parent
        await mainWindow.keyboard.press('ArrowLeft');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder A');
        // Pressing [left] again should collapse the folder
        await (0, test_1.expect)(folderAHeader).toHaveJSProperty('ariaExpanded', 'true');
        await mainWindow.keyboard.press('ArrowLeft');
        await (0, test_1.expect)(folderAHeader).toHaveJSProperty('ariaExpanded', 'false');
        // Should still be focused
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder A');
        // Pressing [right] on a collapsed folder should expand it
        await mainWindow.keyboard.press('ArrowRight');
        await (0, test_1.expect)(folderAHeader).toHaveJSProperty('ariaExpanded', 'true');
        // Pressing [right] again should move to the next item
        await mainWindow.keyboard.press('ArrowRight');
        await (0, test_1.expect)(mainWindow.locator(':focus')).toHaveText('Folder B');
    });
    (0, test_1.test)('should allow changing the parent of a folder by drag-and-drop', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const parentFolderHeader = await sidebar.createNewFolder('Parent folder');
        await (0, test_1.expect)(parentFolderHeader).toBeVisible();
        const childFolderHeader = await sidebar.createNewFolder('Child folder');
        await (0, test_1.expect)(childFolderHeader).toBeVisible();
        await sidebar.forceUpdateSorting(electronApp);
        await (0, test_1.expect)(childFolderHeader).toBeVisible();
        await childFolderHeader.dragTo(parentFolderHeader);
        // Verify that it's now a child folder -- expand and collapse the parent
        await (0, test_1.expect)(parentFolderHeader).toHaveJSProperty('ariaExpanded', 'true');
        const toggleButton = parentFolderHeader.getByRole('button', { name: /^(Expand|Collapse)/ });
        await toggleButton.click();
        // Should be collapsed
        await (0, test_1.expect)(childFolderHeader).not.toBeAttached();
        await (0, test_1.expect)(parentFolderHeader).toHaveJSProperty('ariaExpanded', 'false');
        await toggleButton.click();
        // Should be possible to move back to the root
        const rootFolderHeader = sidebar.container.getByText('Notebooks');
        await childFolderHeader.dragTo(rootFolderHeader);
        await (0, test_1.expect)(toggleButton).not.toBeVisible();
    });
    (0, test_1.test)('all notes section should list all notes', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const testFolderA = await sidebar.createNewFolder('Folder A');
        await (0, test_1.expect)(testFolderA).toBeAttached();
        await sidebar.forceUpdateSorting(electronApp);
        await mainScreen.createNewNote('A note in Folder A');
        await (0, test_1.expect)(mainWindow.getByText('A note in Folder A')).toBeAttached();
        await mainScreen.createNewNote('Another note in Folder A');
        const testFolderB = await sidebar.createNewFolder('Folder B');
        await (0, test_1.expect)(testFolderB).toBeAttached();
        await mainScreen.createNewNote('A note in Folder B');
        const allNotesButton = sidebar.container.getByText('All notes');
        await allNotesButton.click();
        await (0, test_1.expect)(mainWindow.getByText('A note in Folder A')).toBeAttached();
        await (0, test_1.expect)(mainWindow.getByText('Another note in Folder A')).toBeAttached();
        await (0, test_1.expect)(mainWindow.getByText('A note in Folder B')).toBeAttached();
    });
    (0, test_1.test)('double-clicking should collapse/expand folders in the sidebar', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const testFolderA = await sidebar.createNewFolder('Folder A');
        const testFolderB = await sidebar.createNewFolder('Folder B');
        // Convert folder B to a subfolder
        await testFolderB.dragTo(testFolderA);
        await (0, test_1.expect)(testFolderB).toBeVisible();
        // Collapse
        await testFolderA.dblclick();
        await (0, test_1.expect)(testFolderB).not.toBeVisible();
        // Expand
        await testFolderA.dblclick();
        await (0, test_1.expect)(testFolderB).toBeVisible();
    });
    (0, test_1.test)('should be possible to select, then deselect, multiple folders with cmd-click', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const folderA = await sidebar.createNewFolder('Folder A');
        const folderB = await sidebar.createNewFolder('Folder B');
        const folderC = await sidebar.createNewFolder('Folder C');
        const folderD = await sidebar.createNewFolder('Folder D');
        await sidebar.forceUpdateSorting(electronApp);
        await folderA.click();
        await folderB.click({ modifiers: ['ControlOrMeta'] });
        await folderC.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(folderA).toBeSelected();
        await (0, test_1.expect)(folderB).toBeSelected();
        await (0, test_1.expect)(folderC).toBeSelected();
        await (0, test_1.expect)(folderD).toHaveJSProperty('ariaSelected', 'false');
        // Should be able to deselect up to two folders
        await folderA.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(folderA).toHaveJSProperty('ariaSelected', 'false');
        await folderB.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(folderB).toHaveJSProperty('ariaSelected', 'false');
        // Should not be possible to deselect the last folder
        await folderC.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(folderC).toBeSelected();
    });
    (0, test_1.test)('should be possible to move multiple folders at once with drag and drop', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const folderA = await sidebar.createNewFolder('Folder A');
        const folderB = await sidebar.createNewFolder('Folder B');
        const folderC = await sidebar.createNewFolder('Folder C');
        const folderD = await sidebar.createNewFolder('Folder D');
        await sidebar.forceUpdateSorting(electronApp);
        await folderB.click();
        await folderC.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(folderB).toBeSelected();
        await (0, test_1.expect)(folderC).toBeSelected();
        await folderB.dragTo(folderA);
        // Should have made folder B **and folder C** subfolders of testFolderA
        await sidebar.expectToHaveDepths([
            [folderA, 2],
            [folderB, 3],
            [folderC, 3],
            [folderD, 2],
        ]);
    });
    (0, test_1.test)('should not move selected folders when dragging an unselected folder', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const testFolderA = await sidebar.createNewFolder('Folder A');
        const testFolderB = await sidebar.createNewFolder('Folder B');
        const testFolderC = await sidebar.createNewFolder('Folder C');
        await sidebar.forceUpdateSorting(electronApp);
        await testFolderB.click();
        await testFolderC.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(testFolderB).toBeSelected();
        await (0, test_1.expect)(testFolderC).toBeSelected();
        await testFolderA.dragTo(testFolderB);
        await sidebar.expectToHaveDepths([
            [testFolderB, 2],
            [testFolderA, 3],
            [testFolderC, 2],
        ]);
    });
});
//# sourceMappingURL=sidebar.spec.js.map