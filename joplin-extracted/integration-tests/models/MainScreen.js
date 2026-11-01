"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoteEditorScreen_1 = __importDefault(require("./NoteEditor/NoteEditorScreen"));
const activateMainMenuItem_1 = __importDefault(require("../util/activateMainMenuItem"));
const Sidebar_1 = __importDefault(require("./Sidebar"));
const GoToAnything_1 = __importDefault(require("./GoToAnything"));
const setFilePickerResponse_1 = __importDefault(require("../util/setFilePickerResponse"));
const NoteList_1 = __importDefault(require("./NoteList"));
const test_1 = require("../util/test");
const ChangeAppLayoutScreen_1 = __importDefault(require("./ChangeAppLayoutScreen"));
const waitForNextWindowMatching_1 = __importDefault(require("../util/waitForNextWindowMatching"));
const ChatPanel_1 = __importDefault(require("./ChatPanel"));
class MainScreen {
    constructor(page) {
        this.page = page;
        this.newNoteButton = page.locator('.new-note-button');
        this.noteList = new NoteList_1.default(page);
        this.sidebar = new Sidebar_1.default(page, this);
        this.dialog = page.locator('.dialog-modal-layer');
        this.noteEditor = new NoteEditorScreen_1.default(page);
        this.goToAnything = new GoToAnything_1.default(page, this);
        this.changeLayoutScreen = new ChangeAppLayoutScreen_1.default(page, this);
        this.chatPanel = new ChatPanel_1.default(page, this);
    }
    async setup() {
        await this.waitFor();
        const folder = await this.sidebar.createNewFolder('Test');
        await folder.waitFor();
        return this;
    }
    async waitFor() {
        await this.noteList.waitFor();
    }
    // Follows the steps a user would use to create a new note.
    async createNewNote(title) {
        await this.waitFor();
        // The new note button is only visible when a folder is selected -- wait for it explicitly.
        await this.newNoteButton.waitFor();
        // Create the new note. Retry this -- creating new notes can sometimes fail if done just after
        // application startup.
        await test_1.expect.poll(async () => {
            await this.newNoteButton.click();
            await (0, test_1.expect)(this.noteEditor.noteTitleInput).toHaveValue('', { timeout: 4000 });
            await (0, test_1.expect)(this.noteEditor.noteTitleInput).toHaveJSProperty('placeholder', 'Creating new note...', { timeout: 4000 });
            return true;
        }, { timeout: 10000 }).toBe(true);
        // Fill the title
        await this.noteEditor.noteTitleInput.click();
        await this.noteEditor.noteTitleInput.fill(title);
        return this.noteEditor;
    }
    async openSettings(electronApp) {
        // Check both labels so this works on MacOS
        await (0, activateMainMenuItem_1.default)(electronApp, /^(Preferences\.\.\.|Options)$/);
    }
    async openNewWindow(electronApp) {
        const pagePromise = (0, waitForNextWindowMatching_1.default)(/^Joplin -/, electronApp);
        await (0, activateMainMenuItem_1.default)(electronApp, 'Open in new window');
        return pagePromise;
    }
    async search(text) {
        const searchBar = this.page.getByPlaceholder('Search...');
        await searchBar.fill(text);
    }
    async importFromModule_(electronApp, moduleName, path) {
        await (0, setFilePickerResponse_1.default)(electronApp, [path]);
        await (0, activateMainMenuItem_1.default)(electronApp, moduleName, 'Import');
    }
    async importHtmlDirectory(electronApp, path) {
        return this.importFromModule_(electronApp, 'HTML - HTML document (Directory)', path);
    }
    async importHtmlFile(electronApp, path) {
        return this.importFromModule_(electronApp, 'HTML - HTML document (File)', path);
    }
    async pluginPanelLocator(pluginId) {
        return this.page.locator(`iframe[id^=${JSON.stringify(`plugin-view-${pluginId}`)}]`);
    }
}
exports.default = MainScreen;
//# sourceMappingURL=MainScreen.js.map