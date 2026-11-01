"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const setFilePickerResponse_1 = __importDefault(require("./util/setFilePickerResponse"));
const waitForNextOpenPath_1 = __importDefault(require("./util/waitForNextOpenPath"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
test_1.test.describe('richTextEditor', () => {
    (0, test_1.test)('should preserve text size in OneNote outlines with and without ink', async ({ electronApp, mainWindow, profileDirectory }) => {
        const htmlPath = (0, path_1.join)(profileDirectory, 'onenote-text.html');
        await (0, fs_extra_1.writeFile)(htmlPath, `<!DOCTYPE html>
			<html><body>
				<p>Outside outline</p>
				<div class="container-outline">
					<p>Inside outline</p>
				</div>
				<div class="container-outline">
					<div class="outline-element"><p>Text beside ink</p></div>
					<div class="outline-element"><p><span class="ink-text" style="width: 40px; height: 30px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=" width="40" height="30"></span></p></div>
				</div>
			</body></html>
		`);
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.importHtmlFile(electronApp, htmlPath);
        await mainScreen.noteList.getNoteItemByTitle('onenote-text').click();
        const richTextEditor = await mainScreen.noteEditor.showRichTextEditor();
        const outsideText = richTextEditor.body.getByText('Outside outline');
        await (0, test_1.expect)(outsideText).toBeVisible();
        const fontSize = await outsideText.evaluate(element => getComputedStyle(element).fontSize);
        await (0, test_1.expect)(richTextEditor.body.locator('.container-outline').getByText('Inside outline')).toHaveCSS('font-size', fontSize);
        const mixedOutline = richTextEditor.body.locator('.container-outline').filter({ hasText: 'Text beside ink' });
        await (0, test_1.expect)(mixedOutline.locator('.ink-text img')).toHaveCount(1);
        await (0, test_1.expect)(mixedOutline.getByText('Text beside ink')).toHaveCSS('font-size', fontSize);
        const inkFontSize = '8px';
        await (0, test_1.expect)(mixedOutline.locator('p:has(.ink-text)')).toHaveCSS('font-size', inkFontSize);
    });
    (0, test_1.test)('HTML links should be preserved when editing a note', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing!');
        const editor = mainScreen.noteEditor;
        // Set the note's content
        await editor.showMarkdownEditor();
        // Attach this file to the note (create a resource ID)
        await (0, setFilePickerResponse_1.default)(electronApp, [__filename]);
        await editor.attachFileButton.click();
        // Wait to render
        const viewerFrame = await editor.showNoteViewer();
        await viewerFrame.content.locator('a[data-from-md]').waitFor();
        // Should have an attached resource
        let markdownEditor = await editor.showMarkdownEditor();
        const codeMirrorContent = await markdownEditor.innerText();
        const resourceUrlExpression = /\[.*\]\(:\/(\w+)\)/;
        (0, test_1.expect)(codeMirrorContent).toMatch(resourceUrlExpression);
        const resourceId = codeMirrorContent.match(resourceUrlExpression)[1];
        // Create a new note with just an HTML link
        await mainScreen.createNewNote('Another test');
        await markdownEditor.typeText(`<a href=":/${resourceId}">HTML Link</a>`);
        // Switch to the RTE
        const richTextEditor = await editor.showRichTextEditor();
        // Edit the note to cause the original content to update
        await richTextEditor.body.locator('a').click();
        await mainWindow.keyboard.type('Test...');
        markdownEditor = await editor.showMarkdownEditor();
        // Note should still contain the resource ID and note title
        const finalCodeMirrorContent = await markdownEditor.innerText();
        (0, test_1.expect)(finalCodeMirrorContent).toContain(`:/${resourceId}`);
    });
    (0, test_1.test)('should watch resources for changes when opened with ctrl+click', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing!');
        const editor = mainScreen.noteEditor;
        // Set the note's content
        await editor.showMarkdownEditor();
        // Attach this file to the note (create a resource ID)
        const pathToAttach = (0, path_1.join)(__dirname, 'resources', 'test-file.txt');
        await (0, setFilePickerResponse_1.default)(electronApp, [pathToAttach]);
        await editor.attachFileButton.click();
        // Wait for it to render
        const noteViewer = await editor.showNoteViewer();
        await (0, test_1.expect)(noteViewer.content.getByText('test-file.txt')).toBeVisible();
        // Switch to the RTE
        const richTextEditor = await editor.showRichTextEditor();
        await richTextEditor.body.click();
        // Click on the attached file URL
        const openPathResult = (0, waitForNextOpenPath_1.default)(electronApp);
        const targetLink = richTextEditor.body.getByRole('link', { name: (0, path_1.basename)(pathToAttach) });
        if (process.platform === 'darwin') {
            await targetLink.click({ modifiers: ['Meta'] });
        }
        else {
            await targetLink.click({ modifiers: ['Control'] });
        }
        // Should watch the file
        await mainWindow.getByText(/^The following attachments are being watched for changes/i).waitFor();
        (0, test_1.expect)(await openPathResult).toContain((0, path_1.basename)(pathToAttach));
    });
    (0, test_1.test)('should not remove text when pressing [enter] at the end of a line with an image', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing pressing enter!');
        const editor = mainScreen.noteEditor;
        // Set the initial content
        const markdownEditor = await editor.showMarkdownEditor();
        await markdownEditor.typeText([
            '<img',
            ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAEklEQVQIW2P8z8AARBDAiJMDAIzoBf635fcVAAAAAElFTkSuQmCC"',
            ' width="200"',
            ' height="200"',
            ' alt="test image"',
            '/>',
        ].join(' '));
        await markdownEditor.pressKey('Enter');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.typeText('Test secondary paragraph.');
        // Switch to the RTE
        const richTextEditor = await editor.showRichTextEditor();
        const testParagraph = richTextEditor.content.getByText('Test secondary paragraph.');
        await (0, test_1.expect)(testParagraph).toBeAttached();
        // Move the cursor just after the image, then press enter.
        const testImage = richTextEditor.content.getByRole('img', { name: 'test image' });
        await testImage.click();
        await mainWindow.keyboard.press('ArrowRight');
        await mainWindow.keyboard.press('Enter');
        // Should not have removed the image or the test paragraph.
        await (0, test_1.expect)(testImage).toBeAttached();
        await (0, test_1.expect)(testParagraph).toBeAttached();
    });
    (0, test_1.test)('pressing Tab should indent', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing tabs!');
        const editor = mainScreen.noteEditor;
        const richTextEditor = await editor.showRichTextEditor();
        await richTextEditor.body.click();
        await mainWindow.keyboard.type('This is a');
        // Tab should add spaces
        await mainWindow.keyboard.press('Tab');
        await mainWindow.keyboard.type('test.');
        // Shift-tab should remove spaces
        await mainWindow.keyboard.press('Tab');
        await mainWindow.keyboard.press('Tab');
        await mainWindow.keyboard.press('Shift+Tab');
        await mainWindow.keyboard.type('Test!');
        // Escape then tab should move focus
        await mainWindow.keyboard.press('Escape');
        await (0, test_1.expect)(richTextEditor.container).toBeFocused();
        await mainWindow.keyboard.press('Tab');
        await (0, test_1.expect)(richTextEditor.container).not.toBeFocused();
        // After re-focusing the editor, Tab should indent again.
        await mainWindow.keyboard.press('Shift+Tab');
        await (0, test_1.expect)(richTextEditor.container).toBeFocused();
        await mainWindow.keyboard.type(' Another:');
        await mainWindow.keyboard.press('Tab');
        await mainWindow.keyboard.type('!');
        // After switching back to the Markdown editor,
        await (0, test_1.expect)(editor.toggleEditorsButton).not.toBeDisabled();
        const markdownEditor = await editor.showMarkdownEditor();
        await (0, test_1.expect)(markdownEditor.content).toHaveText('This is a        test.        Test! Another:        !');
    });
    (0, test_1.test)('should be possible to disable tab indentation from the menu', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing keyboard navigation!');
        const editor = mainScreen.noteEditor;
        const richTextEditor = await editor.showRichTextEditor();
        await richTextEditor.focusContent();
        await editor.enableTabNavigation(electronApp);
        await mainWindow.keyboard.type('This is a');
        // Tab should navigate
        await (0, test_1.expect)(richTextEditor.container).toBeFocused();
        await mainWindow.keyboard.press('Tab');
        await (0, test_1.expect)(richTextEditor.container).not.toBeFocused();
        await editor.disableTabNavigation(electronApp);
        // Tab should not navigate
        await richTextEditor.container.click();
        await mainWindow.keyboard.press('Tab');
        await (0, test_1.expect)(richTextEditor.container).toBeFocused();
    });
    (0, test_1.test)('double-clicking a code block should edit it', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing code blocks');
        const editor = mainScreen.noteEditor;
        const richTextEditor = await editor.showRichTextEditor();
        // Make the code block
        await editor.toggleCodeBlockButton.click();
        const codeEditor = richTextEditor.codeEditor;
        await codeEditor.textArea.fill('This is a test code block!');
        await codeEditor.submit();
        // Double-clicking the code block should open it
        const renderedCode = richTextEditor.body.locator('pre.hljs', { hasText: 'This is a test code block!' });
        await renderedCode.first().dblclick();
        await codeEditor.waitFor();
    });
    (0, test_1.test)('disabling tab indentation should also disable it in code dialogs', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing code blocks');
        const editor = mainScreen.noteEditor;
        const richTextEditor = await editor.showRichTextEditor();
        await editor.toggleCodeBlockButton.click();
        const codeEditor = richTextEditor.codeEditor;
        await codeEditor.waitFor();
        // Initially, pressing <tab> in the textarea should add a tab
        await codeEditor.textArea.click();
        await mainWindow.keyboard.press('Tab');
        await (0, test_1.expect)(codeEditor.textArea).toHaveValue('\t');
        await (0, test_1.expect)(codeEditor.textArea).toBeFocused();
        await editor.enableTabNavigation(electronApp);
        // After enabling tab navigation, pressing tab should navigate.
        await (0, test_1.expect)(codeEditor.textArea).toBeFocused();
        await mainWindow.keyboard.press('Tab');
        await (0, test_1.expect)(codeEditor.textArea).not.toBeFocused();
    });
    (0, test_1.test)('should be possible to navigate between the note title and rich text editor with enter/down/up keys', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing keyboard navigation!');
        const editor = mainScreen.noteEditor;
        const richTextEditor = await editor.showRichTextEditor();
        await editor.noteTitleInput.click();
        await (0, test_1.expect)(editor.noteTitleInput).toBeFocused();
        await mainWindow.keyboard.press('End');
        await mainWindow.keyboard.press('ArrowDown');
        await (0, test_1.expect)(richTextEditor.container).toBeFocused();
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(editor.noteTitleInput).toBeFocused();
        await mainWindow.keyboard.press('Enter');
        await (0, test_1.expect)(editor.noteTitleInput).not.toBeFocused();
        await (0, test_1.expect)(richTextEditor.container).toBeFocused();
    });
    (0, test_1.test)('note should have correct content even if opened quickly after last edit', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Test 1');
        await mainScreen.createNewNote('Test 2');
        const test1Header = mainScreen.noteList.getNoteItemByTitle('Test 1');
        const test2Header = mainScreen.noteList.getNoteItemByTitle('Test 2');
        const editor = mainScreen.noteEditor;
        const editorBody = (await editor.showRichTextEditor()).body;
        const setEditorText = async (targetText) => {
            await editorBody.pressSequentially(targetText);
            await (0, test_1.expect)(editorBody).toHaveText(targetText);
        };
        await test1Header.click();
        await (0, test_1.expect)(editorBody).toHaveText('');
        await setEditorText('Test 1');
        await test2Header.click();
        // Previously, after switching to note 2, the "Test 1" text would remain present in the
        // editor.
        await (0, test_1.expect)(editorBody).toHaveText('');
    });
    (0, test_1.test)('should save rich text changes when switching notes immediately after typing', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Test 1');
        await mainScreen.createNewNote('Test 2');
        const test1Header = mainScreen.noteList.getNoteItemByTitle('Test 1');
        const test2Header = mainScreen.noteList.getNoteItemByTitle('Test 2');
        const editor = mainScreen.noteEditor;
        const editorBody = (await editor.showRichTextEditor()).body;
        await test1Header.click();
        await (0, test_1.expect)(editor.noteTitleInput).toHaveValue('Test 1');
        await (0, test_1.expect)(editorBody).toHaveText('');
        await (0, test_1.expect)(editor.toggleEditorsButton).toBeEnabled();
        await editorBody.pressSequentially('Unsaved text');
        // This confirms that onWillChange has reached the parent without waiting for
        // TinyMCE's delayed onChange/save.
        await (0, test_1.expect)(editor.toggleEditorsButton).toBeDisabled();
        await test2Header.click();
        await (0, test_1.expect)(editor.noteTitleInput).toHaveValue('Test 2');
        await (0, test_1.expect)(editorBody).toHaveText('');
        await test1Header.click();
        await (0, test_1.expect)(editor.noteTitleInput).toHaveValue('Test 1');
        await (0, test_1.expect)(editorBody).toHaveText('Unsaved text');
    });
    (0, test_1.test)('should highlight search matches', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Testing');
        const editor = mainScreen.noteEditor;
        const richTextEditor = await editor.showRichTextEditor();
        const editorBody = richTextEditor.body;
        await editorBody.pressSequentially('search-match1 note search-match2');
        // Should highlight initial matches
        await mainScreen.search('/search-match');
        await test_1.expect.poll(() => richTextEditor.getSearchMatches()).toEqual(['search-match', 'search-match']);
        // Should highlight new matches
        await editorBody.pressSequentially('search-match');
        await test_1.expect.poll(() => richTextEditor.getSearchMatches()).toHaveLength(3);
        // Should stop highlighting old matches
        await editorBody.press('Backspace');
        await test_1.expect.poll(() => richTextEditor.getSearchMatches()).toHaveLength(2);
    });
});
//# sourceMappingURL=richTextEditor.spec.js.map