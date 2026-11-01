"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const activateMainMenuItem_1 = __importDefault(require("../util/activateMainMenuItem"));
const time_1 = require("@joplin/utils/time");
const retryOnFailure_1 = __importDefault(require("../util/retryOnFailure"));
class GoToAnything {
    constructor(page, mainScreen) {
        this.mainScreen = mainScreen;
        this.containerLocator = page.locator('.go-to-anything-dialog[open]');
        this.inputLocator = this.containerLocator.getByRole('textbox');
    }
    async waitFor(timeout) {
        await this.containerLocator.waitFor({ timeout });
    }
    async open(electronApp) {
        await this.mainScreen.waitFor();
        const openFromMenu = async () => {
            await (0, activateMainMenuItem_1.default)(electronApp, 'Goto Anything...');
            // Use a shorter per-attempt timeout so multiple retries fit within the
            // overall test timeout — otherwise a slow CI runner can exhaust the
            // per-test budget mid-retry and force a hard worker teardown.
            await this.waitFor(10000);
        };
        await (0, retryOnFailure_1.default)(openFromMenu, { maxRetries: 3 });
    }
    async openLinkToNote(electronApp) {
        await this.mainScreen.waitFor();
        await (0, activateMainMenuItem_1.default)(electronApp, 'Link to note...');
        return this.waitFor();
    }
    resultLocator(resultText) {
        return this.containerLocator.getByRole('option', { name: resultText });
    }
    async searchForWithRetry(query, resultLocator) {
        // If note indexing hasn't finished, it's sometimes necessary to search multiple times.
        // This expect.poll retries the search if it initially fails.
        await test_1.expect.poll(async () => {
            await this.inputLocator.clear();
            // Pause to help ensure that the change in the search input is detected
            await (0, time_1.msleep)(300);
            await this.inputLocator.fill(query);
            try {
                await (0, test_1.expect)(resultLocator).toBeVisible({ timeout: 1000 });
            }
            catch (error) {
                // Return, rather than throw, the error -- expect.poll doesn't retry
                // if the callback throws.
                return error;
            }
            return true;
        }, { timeout: 15000 }).toBe(true);
    }
    async expectToBeClosed() {
        await (0, test_1.expect)(this.containerLocator).not.toBeAttached();
    }
    async expectToBeOpen() {
        await (0, test_1.expect)(this.containerLocator).toBeAttached();
    }
    async runCommand(electronApp, command) {
        if (!command.startsWith(':')) {
            command = `:${command}`;
        }
        await this.open(electronApp);
        await this.inputLocator.fill(command);
        await this.containerLocator.locator('.match-highlight').first().waitFor();
        await this.inputLocator.press('Enter');
        await this.expectToBeClosed();
    }
}
exports.default = GoToAnything;
//# sourceMappingURL=GoToAnything.js.map