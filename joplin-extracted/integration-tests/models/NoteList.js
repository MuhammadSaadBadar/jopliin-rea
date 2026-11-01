"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activateMainMenuItem_1 = __importDefault(require("../util/activateMainMenuItem"));
const test_1 = require("@playwright/test");
class NoteList {
    constructor(page) {
        this.container = page.locator('.rli-noteList');
        this.sortOrderButton = this.container.getByRole('button', { name: 'Toggle sort order' });
    }
    waitFor() {
        return this.container.waitFor();
    }
    async sortBy(electronApp, sortMethod) {
        await (0, activateMainMenuItem_1.default)(electronApp, sortMethod, 'Sort notes by');
    }
    async sortByTitle(electronApp) {
        await this.sortBy(electronApp, 'Title');
        await (0, test_1.expect)(this.sortOrderButton).toHaveAttribute('title', /Toggle sort order field:[\n ]*title ->/);
    }
    async focusContent(electronApp) {
        await (0, activateMainMenuItem_1.default)(electronApp, 'Note list', 'Focus');
        await (0, test_1.expect)(this.container.locator(':focus')).toBeAttached();
        // Wait for the list to have rendered a selected item before the caller
        // tries to navigate with arrow keys. Without this, the aria-selected
        // attribute may not be set yet on slow CI runners.
        await (0, test_1.expect)(this.container.locator('[aria-selected="true"]')).toBeAttached();
    }
    // The resultant locator may fail to resolve if the item is not visible
    getNoteItemByTitle(title) {
        return this.container.getByRole('option', { name: title });
    }
    async expectNoteToBeSelected(title) {
        await (0, test_1.expect)(this.getNoteItemByTitle(title)).toHaveAttribute('aria-selected', 'true');
    }
}
exports.default = NoteList;
//# sourceMappingURL=NoteList.js.map