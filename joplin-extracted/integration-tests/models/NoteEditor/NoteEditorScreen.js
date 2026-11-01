"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("../../util/test");
const activateMainMenuItem_1 = __importDefault(require("../../util/activateMainMenuItem"));
const setSettingValue_1 = __importDefault(require("../../util/setSettingValue"));
const NoteViewer_1 = __importDefault(require("./NoteViewer"));
const MarkdownEditor_1 = __importDefault(require("./MarkdownEditor"));
const RichTextEditor_1 = __importDefault(require("./RichTextEditor"));
class NoteEditorScreen {
    constructor(page_) {
        this.page_ = page_;
        // .rli-editor is used in the main window, .note-editor-wrapper in secondary windows
        this.containerLocator = page_.locator('.rli-editor, .note-editor-wrapper');
        this.noteViewer_ = new NoteViewer_1.default(this.containerLocator);
        this.markdownEditor_ = new MarkdownEditor_1.default(this.containerLocator);
        this.richTextEditor_ = new RichTextEditor_1.default(this.containerLocator, page_);
        this.editorPluginFrame = this.containerLocator.locator('iframe[id^="plugin-view-"]');
        this.noteTitleInput = this.containerLocator.locator('.title-input');
        this.attachFileButton = this.containerLocator.getByRole('button', { name: 'Attach file' });
        this.toggleCodeBlockButton = this.containerLocator.getByRole('button', { name: 'Code Block' });
        this.toggleEditorsButton = this.containerLocator.getByRole('button', { name: 'Toggle editors', exact: true });
        this.toggleEditorLayoutButton = this.containerLocator.getByRole('button', { name: 'Toggle editor layout' });
        // The editor and viewer have slightly different search UI
        this.editorSearchInput = this.containerLocator.getByPlaceholder('Find');
        this.viewerSearchInput = this.containerLocator.getByPlaceholder('Search...');
        this.disableTabNavigationButton = this.containerLocator.getByRole('button', { name: 'Tab moves focus' });
        this.toggleEditorPluginButton = this.containerLocator.getByRole('button', { name: 'Toggle editor plugin' });
    }
    async waitFor() {
        await this.contentLocator_();
        await this.noteTitleInput.waitFor();
        await this.toggleEditorsButton.waitFor();
    }
    async undo(electronApp) {
        await (0, activateMainMenuItem_1.default)(electronApp, 'Undo');
    }
    toolbarButtonLocator(title) {
        return this.containerLocator.getByRole('button', { name: title });
    }
    async markdownEditorActive() {
        await this.toggleEditorsButton.waitFor();
        return this.toggleEditorsButton.evaluate(element => element.classList.contains('markdown-active'));
    }
    async showMarkdownEditorOrViewer_() {
        if (!await this.markdownEditorActive()) {
            await this.toggleEditorsButton.click();
        }
        await Promise.race([
            this.markdownEditor_.waitFor().catch(() => { }),
            this.noteViewer_.waitFor().catch(() => { }),
        ]);
    }
    async showNoteViewerAndMarkdownEditor() {
        await this.showMarkdownEditorOrViewer_();
        const noteViewerVisible = await this.noteViewer_.container.isVisible();
        const noteEditorVisible = await this.markdownEditor_.container.isVisible();
        if (noteViewerVisible && !noteEditorVisible) {
            await this.toggleEditorLayout();
        }
        else if (!noteViewerVisible && noteEditorVisible) {
            await this.toggleEditorLayout();
            await (0, test_1.expect)(this.noteViewer_.container).toBeVisible();
            await (0, test_1.expect)(this.markdownEditor_.content).not.toBeVisible();
            await this.toggleEditorLayout();
        }
        await (0, test_1.expect)(this.noteViewer_.container).toBeVisible();
        await (0, test_1.expect)(this.markdownEditor_.content).toBeVisible();
        return { viewer: this.noteViewer_, editor: this.markdownEditor_ };
    }
    async showNoteViewer() {
        await this.showMarkdownEditorOrViewer_();
        if (!await this.noteViewer_.container.isVisible()) {
            await this.toggleEditorLayout();
        }
        return this.noteViewer_;
    }
    async showMarkdownEditor() {
        await this.showMarkdownEditorOrViewer_();
        if (!await this.markdownEditor_.container.isVisible()) {
            await this.toggleEditorLayout();
        }
        return this.markdownEditor_;
    }
    async showRichTextEditor() {
        if (await this.markdownEditorActive()) {
            await this.toggleEditorsButton.click();
        }
        await this.richTextEditor_.waitFor();
        return this.richTextEditor_;
    }
    async contentLocator_() {
        const richTextBody = this.richTextEditor_.content.locator('body');
        const markdownEditor = this.markdownEditor_.container;
        const noteViewer = this.noteViewer_.container;
        // Work around an issue where .or doesn't work with frameLocators.
        // See https://github.com/microsoft/playwright/issues/27688#issuecomment-1771403495
        await Promise.race([
            richTextBody.waitFor({ state: 'visible' }).catch(() => { }),
            markdownEditor.waitFor({ state: 'visible' }).catch(() => { }),
            noteViewer.waitFor({ state: 'visible' }).catch(() => { }),
        ]);
        if (await richTextBody.isVisible()) {
            return richTextBody;
        }
        else if (await markdownEditor.isVisible()) {
            return markdownEditor;
        }
        else {
            return noteViewer;
        }
    }
    async disableInlineRendering(electronApp) {
        await (0, setSettingValue_1.default)(electronApp, this.page_, 'editor.inlineRendering', false);
    }
    async expectToHaveText(expected) {
        // expect(...).toHaveText can fail in the Rich Text Editor (perhaps due to frame locators).
        // Using expect.poll refreshes the locator on each attempt, which seems to prevent flakiness.
        const expectResult = test_1.expect.poll(
        // Use .innerText: textContent doesn't handle line breaks correctly in the CodeMirror
        // editor.
        async () => (await this.contentLocator_()).innerText());
        // Allow `expected` to be either an exact match (a string) or a pattern
        if (typeof expected === 'string') {
            await expectResult.toBe(expected);
        }
        else {
            await expectResult.toMatch(expected);
        }
    }
    async enableTabNavigation(electronApp) {
        await (0, test_1.expect)(this.disableTabNavigationButton).not.toBeVisible();
        await (0, activateMainMenuItem_1.default)(electronApp, 'Tab moves focus');
        await (0, test_1.expect)(this.disableTabNavigationButton).toBeVisible();
    }
    async disableTabNavigation(electronApp) {
        await (0, test_1.expect)(this.disableTabNavigationButton).toBeVisible();
        await (0, activateMainMenuItem_1.default)(electronApp, 'Tab moves focus');
        await (0, test_1.expect)(this.disableTabNavigationButton).not.toBeVisible();
    }
    async goBack() {
        const backButton = this.toolbarButtonLocator('Back');
        await (0, test_1.expect)(backButton).not.toBeDisabled();
        await backButton.click();
    }
    async toggleEditorLayout() {
        await this.toggleEditorLayoutButton.click();
    }
    async hideViewer() {
        const editorVisible = await this.markdownEditor_.container.isVisible();
        await (0, test_1.expect)(this.noteViewer_.container).toBeVisible();
        await this.toggleEditorLayout();
        // An additional toggle was needed if initially in viewer-only mode
        if (!editorVisible) {
            await (0, test_1.expect)(this.markdownEditor_.container).toBeVisible();
            await this.toggleEditorLayout();
        }
        await (0, test_1.expect)(this.noteViewer_.container).not.toBeVisible();
    }
}
exports.default = NoteEditorScreen;
//# sourceMappingURL=NoteEditorScreen.js.map