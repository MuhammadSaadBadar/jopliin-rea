"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const getImageSourceSize_1 = __importDefault(require("./util/getImageSourceSize"));
const setFilePickerResponse_1 = __importDefault(require("./util/setFilePickerResponse"));
const activateMainMenuItem_1 = __importDefault(require("./util/activateMainMenuItem"));
const setSettingValue_1 = __importDefault(require("./util/setSettingValue"));
const path_2 = require("@joplin/utils/path");
const mockClipboard_1 = __importDefault(require("./util/mockClipboard"));
const urlUtils_1 = require("@joplin/lib/urlUtils");
const importAndOpenHtmlExport = async (mainWindow, electronApp, noteTitle) => {
    const mainScreen = await new MainScreen_1.default(mainWindow).setup();
    await mainScreen.waitFor();
    await mainScreen.importHtmlDirectory(electronApp, (0, path_1.join)(__dirname, 'resources', 'html-import'));
    const importedFolder = mainScreen.sidebar.container.getByText('html-import');
    await importedFolder.waitFor();
    // Retry -- focusing the imported-folder may fail in some cases
    await (0, test_1.expect)(async () => {
        await importedFolder.click();
        await mainScreen.noteList.focusContent(electronApp);
        const importedHtmlFileItem = mainScreen.noteList.getNoteItemByTitle(noteTitle);
        await importedHtmlFileItem.click({ timeout: 300 });
    }).toPass();
    return { mainScreen };
};
test_1.test.describe('markdownEditor', () => {
    (0, test_1.test)('editor should render the full content of HTML notes', async ({ mainWindow, electronApp }) => {
        const { mainScreen } = await importAndOpenHtmlExport(mainWindow, electronApp, 'test-html-file-with-spans');
        await mainScreen.noteEditor.showMarkdownEditor();
        // Regression test: The <span> should not be hidden by inline Markdown rendering (since this is an HTML note):
        await mainScreen.noteEditor.expectToHaveText('<p><span style="margin-left: 100px;">test</span></p>');
    });
    (0, test_1.test)('preview pane should render images in HTML notes', async ({ mainWindow, electronApp }) => {
        const { mainScreen } = await importAndOpenHtmlExport(mainWindow, electronApp, 'test-html-file-with-image');
        const viewerFrame = (await mainScreen.noteEditor.showNoteViewer()).content;
        // Should render headers
        await (0, test_1.expect)(viewerFrame.locator('h1')).toHaveText('Test HTML file!');
        // Should render images
        const image = viewerFrame.getByAltText('An SVG image.');
        await (0, test_1.expect)(image).toBeAttached();
        await (0, test_1.expect)(await (0, getImageSourceSize_1.default)(image)).toMatchObject([117, 30]);
    });
    (0, test_1.test)('preview pane should render PDFs', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('PDF attachments');
        const editor = mainScreen.noteEditor;
        await editor.showMarkdownEditor();
        await (0, setFilePickerResponse_1.default)(electronApp, [(0, path_1.join)(__dirname, 'resources', 'small-pdf.pdf')]);
        await editor.attachFileButton.click();
        const viewerFrame = (await mainScreen.noteEditor.showNoteViewer()).content;
        const pdfLink = viewerFrame.getByText('small-pdf.pdf');
        await (0, test_1.expect)(pdfLink).toBeVisible();
        const expectToBeRendered = async () => {
            // PDF preview should render
            const pdfViewer = viewerFrame.locator('object[data$=".pdf"]');
            // Should create the PDF viewer. Note: This is not sufficient to determine that the PDF viewer
            // has rendered.
            await (0, test_1.expect)(pdfViewer).toBeAttached();
            // Verify that the PDF viewer has rendered. This relies on how Chrome/Electron loads custom PDFs
            // in an object.
            // If this breaks due to an Electron upgrade,
            // 1. manually verify that the PDF viewer has loaded and
            // 2. replace this test with a screenshot comparison (https://playwright.dev/docs/test-snapshots)
            await test_1.expect.poll(() => pdfViewer.evaluate((handle) => {
                const contentDocument = handle.contentDocument;
                const pdfViewerAsset = contentDocument.querySelector('link[href*=pdf_embedder]');
                return !!pdfViewerAsset;
            })).toBe(true);
        };
        await expectToBeRendered();
        // Should still render after switching editors
        await mainScreen.noteEditor.showRichTextEditor();
        await mainScreen.noteEditor.showNoteViewer();
        await expectToBeRendered();
    });
    (0, test_1.test)('preview pane should render video attachments', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.createNewNote('Media attachments');
        const editor = mainScreen.noteEditor;
        await editor.showMarkdownEditor();
        await (0, setFilePickerResponse_1.default)(electronApp, [(0, path_1.join)(__dirname, 'resources', 'video.mp4')]);
        await editor.attachFileButton.click();
        const videoLocator = (await editor.showNoteViewer()).content.locator('video');
        const expectVideoToRender = async () => {
            await (0, test_1.expect)(videoLocator).toBeSeekableMediaElement(6.9, 7);
        };
        await expectVideoToRender();
        // Should be able to render again if the editor is closed and re-opened.
        await mainScreen.noteEditor.showRichTextEditor();
        await mainScreen.noteEditor.showNoteViewer();
        await expectVideoToRender();
    });
    (0, test_1.test)('arrow keys should navigate the toolbar', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.createNewNote('Note 1');
        await mainScreen.createNewNote('Note 2');
        const noteEditor = mainScreen.noteEditor;
        await (await noteEditor.showMarkdownEditor()).focusContent();
        // Escape, then Shift+Tab should focus the toolbar
        await mainWindow.keyboard.press('Escape');
        await mainWindow.keyboard.press('Shift+Tab');
        // Should focus the first item by default, the "back" arrow (back to "Note 1")
        const firstItemLocator = noteEditor.toolbarButtonLocator('Back');
        await (0, test_1.expect)(firstItemLocator).toBeFocused();
        // Left arrow should wrap to the end
        await mainWindow.keyboard.press('ArrowLeft');
        const lastItemLocator = noteEditor.toolbarButtonLocator('Toggle editors');
        await (0, test_1.expect)(lastItemLocator).toBeFocused();
        await mainWindow.keyboard.press('ArrowRight');
        await (0, test_1.expect)(firstItemLocator).toBeFocused();
        // ArrowRight should skip disabled items (Forward).
        await mainWindow.keyboard.press('ArrowRight');
        await (0, test_1.expect)(noteEditor.toolbarButtonLocator('Toggle external editing')).toBeFocused();
        // Home/end should navigate to the first/last items
        await mainWindow.keyboard.press('End');
        await (0, test_1.expect)(lastItemLocator).toBeFocused();
        await mainWindow.keyboard.press('Home');
        await (0, test_1.expect)(firstItemLocator).toBeFocused();
    });
    (0, test_1.test)('should sync local search between the viewer and editor', async ({ mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        const noteEditor = mainScreen.noteEditor;
        await mainScreen.createNewNote('Note');
        const { editor: markdownEditor, viewer } = await noteEditor.showNoteViewerAndMarkdownEditor();
        await markdownEditor.typeText('# Testing');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.typeText('This is a test of search. `Test inline code`');
        await (0, test_1.expect)(viewer.content.locator('h1')).toHaveText('Testing');
        const matches = viewer.content.locator('mark-ghost');
        await (0, test_1.expect)(matches).toHaveCount(0);
        await markdownEditor.pressKey(process.platform === 'darwin' ? 'Meta+f' : 'Control+f');
        await (0, test_1.expect)(noteEditor.editorSearchInput).toBeVisible();
        await noteEditor.editorSearchInput.click();
        await noteEditor.editorSearchInput.fill('test');
        await mainWindow.keyboard.press('Enter');
        // Should show at least one match in the viewer
        await (0, test_1.expect)(matches).toHaveCount(3);
        await (0, test_1.expect)(matches.first()).toBeAttached();
        // Should show matches in code regions
        await noteEditor.editorSearchInput.fill('inline code');
        await mainWindow.keyboard.press('Enter');
        await (0, test_1.expect)(matches).toHaveCount(1);
        // Should continue searching after switching to view-only mode
        await noteEditor.toggleEditorLayout();
        await noteEditor.toggleEditorLayout();
        await (0, test_1.expect)(markdownEditor.container).not.toBeVisible();
        await (0, test_1.expect)(noteEditor.editorSearchInput).not.toBeVisible();
        await (0, test_1.expect)(noteEditor.viewerSearchInput).toBeVisible();
        // Should stop searching after closing the search input
        await noteEditor.viewerSearchInput.click();
        await (0, test_1.expect)(matches).toHaveCount(1);
        await mainWindow.keyboard.press('Escape');
        await (0, test_1.expect)(noteEditor.viewerSearchInput).not.toBeVisible();
        await (0, test_1.expect)(matches).toHaveCount(0);
        // After showing the viewer again, search should still be hidden
        await noteEditor.toggleEditorLayout();
        await (0, test_1.expect)(markdownEditor.container).toBeVisible();
        await (0, test_1.expect)(noteEditor.editorSearchInput).not.toBeVisible();
    });
    (0, test_1.test)('should move focus when the visible editor panes change', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        const noteEditor = mainScreen.noteEditor;
        await mainScreen.createNewNote('Note');
        const { viewer: markdownViewer, editor: markdownEditor, } = await noteEditor.showNoteViewerAndMarkdownEditor();
        await markdownEditor.content.click();
        await mainWindow.keyboard.type('test');
        const focusInMarkdownEditor = markdownEditor.container.locator(':focus');
        await (0, test_1.expect)(focusInMarkdownEditor).toBeAttached();
        // Use the "toggle layout" menu item to avoid changing focus
        const toggleEditorLayout = () => (0, activateMainMenuItem_1.default)(electronApp, 'Toggle editor layout');
        // Editor only
        await toggleEditorLayout();
        // Markdown editor should be focused
        await (0, test_1.expect)(focusInMarkdownEditor).toBeAttached();
        // Viewer only
        await toggleEditorLayout();
        await (0, test_1.expect)(markdownEditor.container).not.toBeVisible();
        // Viewer should be focused
        await (0, test_1.expect)(markdownViewer.container).toBeFocused();
        // Viewer and editor
        await toggleEditorLayout();
        await (0, test_1.expect)(markdownEditor.container).toBeAttached();
        await (0, test_1.expect)(markdownViewer.container).toBeVisible();
        // Editor should be focused
        await (0, test_1.expect)(focusInMarkdownEditor).toBeAttached();
    });
    (0, test_1.test)('focusElementNoteViewer should move focus to the viewer', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        const noteEditor = mainScreen.noteEditor;
        await mainScreen.createNewNote('Note');
        const markdownEditor = await noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('# Test');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.typeText('Test paragraph.');
        // Wait for rendering
        const noteViewer = await noteEditor.showNoteViewer();
        await (0, test_1.expect)(noteViewer.content.getByText('Test paragraph.')).toBeAttached();
        // Move focus
        await mainScreen.goToAnything.runCommand(electronApp, 'focusElementNoteViewer');
        // Note viewer should be focused
        await (0, test_1.expect)(noteViewer.container).toBeFocused();
    });
    (0, test_1.test)('local file URLs setting should allow loading images from local file URLs', async ({ mainWindow, electronApp }) => {
        await (0, setSettingValue_1.default)(electronApp, mainWindow, 'renderer.fileUrls', true);
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.createNewNote('Test local file URLs');
        const editor = mainScreen.noteEditor;
        const markdownEditor = await editor.showMarkdownEditor();
        await markdownEditor.typeText(`![Test image](file://${(0, path_2.toForwardSlashes)((0, path_1.join)(__dirname, 'resources', 'test.png'))})`);
        const renderedImage = (await editor.showNoteViewer()).content.getByRole('img', { name: 'Test image' });
        await (0, test_1.expect)(renderedImage).toBeAttached();
        const imageSize = await (0, getImageSourceSize_1.default)(renderedImage);
        (0, test_1.expect)(imageSize[0]).toBeGreaterThan(0);
        (0, test_1.expect)(imageSize[1]).toBeGreaterThan(0);
    });
    (0, test_1.test)('ctrl-clicking on note links should open the linked note (when the viewer is hidden)', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow);
        // Workaround: Required for extracting content accurately from the Markdown editor
        await mainScreen.noteEditor.disableInlineRendering(electronApp);
        await mainScreen.setup();
        await mainScreen.createNewNote('Original');
        const { editor: markdownEditor } = await mainScreen.noteEditor.showNoteViewerAndMarkdownEditor();
        const noteEditor = mainScreen.noteEditor;
        await noteEditor.hideViewer();
        await markdownEditor.focusContent();
        await markdownEditor.typeText('# Test');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.typeText('## Test 2');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.typeText('### Test 3');
        const editorContent = markdownEditor.content;
        // Extract the note ID
        const note1Locator = mainScreen.noteList.getNoteItemByTitle('Original');
        await note1Locator.dragTo(editorContent);
        const linkExpression = /\[[^\]]*\]\(:\/([a-z0-9]{32})\)/;
        await noteEditor.expectToHaveText(linkExpression);
        const targetNoteId = (await editorContent.textContent()).match(linkExpression)[1];
        await mainScreen.createNewNote('Test note links');
        // Create a new link to a header
        await markdownEditor.focusContent();
        await markdownEditor.pressKey('Enter');
        await markdownEditor.pressKey('Enter');
        await markdownEditor.typeText('[link](:/');
        await markdownEditor.typeText(targetNoteId);
        await markdownEditor.typeText('#test-2');
        await markdownEditor.typeText(')');
        await markdownEditor.pressKey('Enter');
        // Clicking the link should navigate to note1
        const link = editorContent.getByText(/\[?link\]?/);
        await link.click({ modifiers: ['ControlOrMeta'] });
        await (0, test_1.expect)(noteEditor.noteTitleInput).toHaveValue('Original');
        await noteEditor.expectToHaveText(/^# Test/);
        await test_1.expect.poll(() => editorContent.evaluate(async (editor) => {
            const selection = getSelection();
            return editor.contains(selection.anchorNode);
        })).toBe(true);
        // The cursor should be positioned on the linked-to header
        await test_1.expect.poll(async () => {
            await mainWindow.keyboard.type('[[cursor]]');
            await noteEditor.expectToHaveText(/## Test 2\[\[cursor\]\]/);
            return true;
        }).toBe(true);
    });
    (0, test_1.test)('should still support the legacy Markdown editor', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await (0, setSettingValue_1.default)(electronApp, mainWindow, 'editor.legacyMarkdown', true);
        await mainScreen.createNewNote('Test');
        // Should show the legacy editor
        await (0, test_1.expect)(mainWindow.locator('.rli-editor .CodeMirror5')).toBeVisible();
    });
    (0, test_1.test)('should support the textCopy command', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.createNewNote('Test copy');
        const noteEditor = mainScreen.noteEditor;
        const markdownEditor = await noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('Test content.');
        const { expectClipboardToMatch } = await (0, mockClipboard_1.default)(electronApp, 'original');
        await mainScreen.goToAnything.runCommand(electronApp, 'textCopy');
        await expectClipboardToMatch('Test content.\n');
    });
    (0, test_1.test)('should support the textCut and textPaste commands', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.createNewNote('Test paste');
        await mainScreen.noteEditor.showMarkdownEditor();
        const { expectClipboardToMatch } = await (0, mockClipboard_1.default)(electronApp, 'test!');
        await expectClipboardToMatch('test!');
        // Should paste text using the textPaste command
        const goToAnything = mainScreen.goToAnything;
        await goToAnything.runCommand(electronApp, 'textPaste');
        const noteEditor = mainScreen.noteEditor;
        await noteEditor.expectToHaveText('test!');
        // Should cut text using the textCut command
        await mainScreen.createNewNote('Test cut');
        const markdownEditor = await noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('Test (new content!)');
        await goToAnything.runCommand(electronApp, 'textCut');
        await noteEditor.expectToHaveText('\n');
        await expectClipboardToMatch('Test (new content!)\n');
        // Should paste the content again with textPaste
        await goToAnything.runCommand(electronApp, 'textPaste');
        await noteEditor.expectToHaveText(/^Test \(new content!\)[\n]+/);
    });
    for (const testCase of [
        { name: 'CodeMirror 6', useLegacyMarkdownEditor: false },
        { name: 'CodeMirror 5', useLegacyMarkdownEditor: true },
    ]) {
        (0, test_1.test)(`should paste Affinity Copy Merged clipboard data as an image resource (${testCase.name})`, async ({ electronApp, mainWindow }) => {
            const mainScreen = new MainScreen_1.default(mainWindow);
            await (0, setSettingValue_1.default)(electronApp, mainWindow, 'editor.legacyMarkdown', testCase.useLegacyMarkdownEditor);
            await mainScreen.noteEditor.disableInlineRendering(electronApp);
            await (0, setSettingValue_1.default)(electronApp, mainWindow, 'imageResizing', 'neverResize');
            await mainScreen.setup();
            const noteEditor = await mainScreen.createNewNote('Test Affinity image paste');
            const markdownEditor = await noteEditor.showMarkdownEditor();
            const editorContent = markdownEditor.container;
            const noteBody = async () => editorContent.innerText();
            await editorContent.click();
            const affinityClipboardText = await (0, fs_extra_1.readFile)((0, path_1.join)(__dirname, 'resources', 'affinity.txt'), 'utf8');
            await mainWindow.evaluate((affinityClipboardText) => {
                var _a;
                const { clipboard, nativeImage } = require('electron');
                const affinityImageData = (_a = affinityClipboardText.match(/data:image\/png;base64,[^"]+/)) === null || _a === void 0 ? void 0 : _a[0];
                if (!affinityImageData)
                    throw new Error('Affinity clipboard text does not contain PNG image data');
                const image = nativeImage.createFromDataURL(affinityImageData);
                if (image.isEmpty())
                    throw new Error('Could not create image from Affinity clipboard data');
                clipboard.write({
                    text: affinityClipboardText,
                    image,
                });
            }, affinityClipboardText);
            await mainScreen.goToAnything.runCommand(electronApp, 'textPaste');
            await test_1.expect.poll(async () => {
                const currentNoteBody = (await noteBody()).trimEnd();
                const resourceUrls = (0, urlUtils_1.extractResourceUrls)(currentNoteBody);
                const isImageResource = currentNoteBody.startsWith('![') && resourceUrls.length === 1 && currentNoteBody.endsWith(`](:/${resourceUrls[0].itemId})`);
                const doesNotContainSvg = !currentNoteBody.includes('<svg');
                const doesNotContainBase64 = !currentNoteBody.includes('data:image/png;base64,');
                return isImageResource && doesNotContainSvg && doesNotContainBase64;
            }).toBe(true);
            const renderedImage = (await noteEditor.showNoteViewer()).content.locator('img');
            await (0, test_1.expect)(renderedImage).toHaveCount(1);
            await (0, test_1.expect)(await (0, getImageSourceSize_1.default)(renderedImage.first())).toMatchObject([64, 64]);
        });
    }
    (0, test_1.test)('the undo and redo menu items should work', async ({ mainWindow, electronApp }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.createNewNote('Test undo/redo');
        const noteEditor = mainScreen.noteEditor;
        const markdownEditor = await noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('A');
        await noteEditor.expectToHaveText('A');
        await (0, activateMainMenuItem_1.default)(electronApp, 'Undo');
        await noteEditor.expectToHaveText('\n');
        await (0, activateMainMenuItem_1.default)(electronApp, 'Redo');
        await noteEditor.expectToHaveText('A');
    });
    (0, test_1.test)('copying from the preview pane should not include theme background color and should preserve bold formatting', async ({ mainWindow, electronApp }) => {
        // Set dark theme so background-color would be present in clipboard without the fix
        await (0, setSettingValue_1.default)(electronApp, mainWindow, 'theme', 2);
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.createNewNote('Test copy formatting');
        const noteEditor = mainScreen.noteEditor;
        const markdownEditor = await noteEditor.showMarkdownEditor();
        await markdownEditor.typeText('**hello**');
        const viewerFrame = (await mainScreen.noteEditor.showNoteViewer()).content;
        await (0, test_1.expect)(viewerFrame.locator('strong')).toHaveText('hello');
        // Double-click selects the text node inside <strong>, not <strong> itself.
        // Without the ancestor re-wrapping fix, <strong> would be dropped.
        await viewerFrame.locator('strong').dblclick();
        const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
        await mainWindow.keyboard.press(`${modifier}+c`);
        const clipboardHtml = await mainWindow.evaluate(() => {
            const { clipboard } = require('electron');
            return clipboard.readHTML();
        });
        (0, test_1.expect)(clipboardHtml).toContain('hello');
        // Dark theme background (#1D2024) must not leak into clipboard
        (0, test_1.expect)(clipboardHtml).not.toMatch(/1D2024/i);
        (0, test_1.expect)(clipboardHtml).toContain('<strong');
        (0, test_1.expect)(clipboardHtml).toMatch(/font-weight/i);
    });
});
//# sourceMappingURL=markdownEditor.spec.js.map