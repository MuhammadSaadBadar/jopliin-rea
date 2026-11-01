"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activateMainMenuItem_1 = __importDefault(require("../util/activateMainMenuItem"));
const extendedExpect_1 = __importDefault(require("../util/extendedExpect"));
class Sidebar {
    constructor(page, mainScreen) {
        this.mainScreen = mainScreen;
        this.container = page.locator('.rli-sideBar');
        this.allNotes = this.container.getByText('All notes');
    }
    async createNewFolder(title) {
        const newFolderButton = this.container.getByRole('button', { name: 'New' });
        await newFolderButton.click();
        const titleInput = this.mainScreen.dialog.getByLabel('Title');
        await titleInput.fill(title);
        const submitButton = this.mainScreen.dialog.getByRole('button', { name: 'OK' });
        await submitButton.click();
        return this.container.getByRole('treeitem', { name: title });
    }
    async sortBy(electronApp, option) {
        await (0, activateMainMenuItem_1.default)(electronApp, option, 'Sort notebooks by');
    }
    async sortByDate(electronApp) {
        return this.sortBy(electronApp, 'Updated date');
    }
    async sortByTitle(electronApp) {
        return this.sortBy(electronApp, 'Title');
    }
    async forceUpdateSorting(electronApp) {
        // By default, notebooks will not be in the correct position in the list for about 1 second.
        // Change the notebook list sort order to force an immediate refresh.
        await this.sortByDate(electronApp);
        await this.sortByTitle(electronApp);
    }
    // Checks the indentation level of each folder. Useful for determining whether folders are subfolders.
    async expectToHaveDepths(folderToDepth) {
        for (let i = 0; i < folderToDepth.length; i++) {
            const [folder, depth] = folderToDepth[i];
            await (0, extendedExpect_1.default)(folder, { message: `Folder ${i} should have depth ${depth}.` }).toHaveJSProperty('ariaLevel', String(depth));
        }
    }
}
exports.default = Sidebar;
//# sourceMappingURL=Sidebar.js.map