"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SettingsScreen {
    constructor(page) {
        this.container = page.locator('.config-screen');
        this.okayButton = this.container.locator('.button-bar button', { hasText: 'OK' });
        this.appearanceTabButton = this.getTabLocator('Appearance');
    }
    getTabLocator(tabName) {
        return this.container.getByRole('tab', { name: tabName });
    }
    getLastTab() {
        return this.container.getByRole('tablist').getByRole('tab').last();
    }
    async waitFor() {
        await this.okayButton.waitFor();
        await this.appearanceTabButton.waitFor();
    }
}
exports.default = SettingsScreen;
//# sourceMappingURL=SettingsScreen.js.map