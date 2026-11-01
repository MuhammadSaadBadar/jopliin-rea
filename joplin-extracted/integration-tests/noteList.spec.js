"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const setMessageBoxResponse_1 = __importDefault(require("./util/setMessageBoxResponse"));
test_1.test.describe('noteList', () => {
    (0, test_1.test)('should be possible to edit notes in a different notebook when searching', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const folderAHeader = await sidebar.createNewFolder('Folder A');
        await (0, test_1.expect)(folderAHeader).toBeVisible();
        const folderBHeader = await sidebar.createNewFolder('Folder B');
        await (0, test_1.expect)(folderBHeader).toBeVisible();
        await folderBHeader.click();
        await mainScreen.createNewNote('note-1');
        await folderAHeader.click();
        await mainScreen.createNewNote('note-2');
        // Search for and focus a note different from the folder we were in before searching.
        await mainScreen.search('/note-1');
        await mainScreen.noteList.focusContent(electronApp);
        const note1Result = mainScreen.noteList.getNoteItemByTitle('note-1');
        await (0, test_1.expect)(note1Result).toBeAttached();
        await note1Result.click();
        // Typing should not cause the note to disappear
        const editor = mainScreen.noteEditor;
        const markdownEditor = await editor.showMarkdownEditor();
        await markdownEditor.typeText('[Testing...](http://example.com/)');
        // Wait to render
        const noteViewer = await editor.showNoteViewer();
        await (0, test_1.expect)(noteViewer.content.locator('a', { hasText: 'Testing...' })).toBeVisible();
        // Updating the title should force the sidebar to update sooner
        await (0, test_1.expect)(editor.noteTitleInput).toHaveValue('note-1');
    });
    (0, test_1.test)('shift-delete should ask to permanently delete notes, but only when the note list is focused', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        const folderBHeader = await sidebar.createNewFolder('Folder B');
        const folderAHeader = await sidebar.createNewFolder('Folder A');
        await (0, test_1.expect)(folderAHeader).toBeVisible();
        await mainScreen.createNewNote('test note 1');
        await mainScreen.createNewNote('test note 2');
        const noteList = mainScreen.noteList;
        await noteList.focusContent(electronApp);
        await (0, test_1.expect)(noteList.getNoteItemByTitle('test note 1')).toBeVisible();
        await (0, test_1.expect)(noteList.getNoteItemByTitle('test note 2')).toBeVisible();
        await (0, setMessageBoxResponse_1.default)(electronApp, /^Delete/i);
        const pressShiftDelete = async () => {
            await mainWindow.keyboard.press('Shift');
            await mainWindow.keyboard.press('Delete');
            await mainWindow.keyboard.up('Delete');
            await mainWindow.keyboard.up('Shift');
        };
        await pressShiftDelete();
        await (0, test_1.expect)(noteList.getNoteItemByTitle('test note 2')).not.toBeVisible();
        // Should not delete when the editor is focused
        const markdownEditor = await mainScreen.noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('test');
        await pressShiftDelete();
        await folderBHeader.click();
        await folderAHeader.click();
        await (0, test_1.expect)(noteList.getNoteItemByTitle('test note 1')).toBeVisible();
    });
    (0, test_1.test)('deleting a note to the trash should show a notification', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('test note 1');
        const noteList = mainScreen.noteList;
        await noteList.focusContent(electronApp);
        const testNoteItem = noteList.getNoteItemByTitle('test note 1');
        await (0, test_1.expect)(testNoteItem).toBeVisible();
        // Should be removed after deleting
        await testNoteItem.press('Delete');
        await (0, test_1.expect)(testNoteItem).not.toBeVisible();
        // Should show a deleted notification
        const notification = mainWindow.locator('[role=alert]', {
            hasText: /The note was successfully moved to the trash./i,
        });
        await (0, test_1.expect)(notification).toBeVisible();
        // Should be possible to un-delete
        const undeleteButton = notification.getByRole('button', { name: 'Cancel' });
        await undeleteButton.click();
        await (0, test_1.expect)(testNoteItem).toBeVisible();
    });
    (0, test_1.test)('should remain focused after deleting a note to the trash', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('test note 1');
        await mainScreen.createNewNote('test note 2');
        await mainScreen.createNewNote('test note 3');
        const noteList = mainScreen.noteList;
        await noteList.sortByTitle(electronApp);
        await noteList.focusContent(electronApp);
        // The most-recently created note should be selected
        await noteList.expectNoteToBeSelected('test note 3');
        // All three notes should be visible
        const getNote = (i) => noteList.getNoteItemByTitle(`test note ${i}`);
        await (0, test_1.expect)(getNote(1)).toBeVisible();
        await (0, test_1.expect)(getNote(2)).toBeVisible();
        await (0, test_1.expect)(getNote(3)).toBeVisible();
        await getNote(3).press('Delete');
        await (0, test_1.expect)(getNote(3)).not.toBeVisible();
        // Pressing the up arrow should change the selection
        // (Regression test for https://github.com/laurent22/joplin/issues/10753)
        await noteList.expectNoteToBeSelected('test note 2');
        await noteList.container.press('ArrowUp');
        await noteList.expectNoteToBeSelected('test note 1');
    });
    (0, test_1.test)('arrow keys should navigate the note list', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const sidebar = mainScreen.sidebar;
        await sidebar.createNewFolder('Folder');
        await mainScreen.createNewNote('note_1');
        await mainScreen.createNewNote('note_2');
        await mainScreen.createNewNote('note_3');
        await mainScreen.createNewNote('note_4');
        const noteList = mainScreen.noteList;
        await noteList.sortByTitle(electronApp);
        await noteList.focusContent(electronApp);
        // The most recently-created note should be visible
        const note4Item = noteList.getNoteItemByTitle('note_4');
        const note3Item = noteList.getNoteItemByTitle('note_3');
        const note2Item = noteList.getNoteItemByTitle('note_2');
        const note1Item = noteList.getNoteItemByTitle('note_1');
        await (0, test_1.expect)(note4Item).toBeVisible();
        await (0, test_1.expect)(note3Item).toBeVisible();
        await (0, test_1.expect)(note2Item).toBeVisible();
        await (0, test_1.expect)(note1Item).toBeVisible();
        await noteList.expectNoteToBeSelected('note_4');
        await noteList.container.press('ArrowUp');
        await noteList.expectNoteToBeSelected('note_3');
        await noteList.container.press('ArrowUp');
        await noteList.expectNoteToBeSelected('note_2');
        await noteList.container.press('ArrowDown');
        await noteList.expectNoteToBeSelected('note_3');
    });
});
//# sourceMappingURL=noteList.spec.js.map