"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const SettingsScreen_1 = __importDefault(require("./models/SettingsScreen"));
test_1.test.describe('settings', () => {
    (0, test_1.test)('should be possible to remove sort order buttons in settings', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        // Sort order buttons should be visible by default
        const sortOrderLocator = mainScreen.noteList.sortOrderButton;
        await (0, test_1.expect)(sortOrderLocator).toBeVisible();
        await mainScreen.openSettings(electronApp);
        // Should be on the settings screen
        const settingsScreen = new SettingsScreen_1.default(mainWindow);
        await settingsScreen.waitFor();
        // Open the appearance tab
        await settingsScreen.appearanceTabButton.click();
        // Find the sort order visible checkbox
        const sortOrderVisibleCheckbox = mainWindow.getByLabel(/^Show sort order/);
        await (0, test_1.expect)(sortOrderVisibleCheckbox).toBeChecked();
        await sortOrderVisibleCheckbox.click();
        await (0, test_1.expect)(sortOrderVisibleCheckbox).not.toBeChecked();
        // Save settings & close
        await settingsScreen.okayButton.click();
        await mainScreen.waitFor();
        await (0, test_1.expect)(sortOrderLocator).not.toBeVisible();
    });
    (0, test_1.test)('clicking the sync wizard button in settings should open a dialog', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        await mainScreen.openSettings(electronApp);
        const settingsScreen = new SettingsScreen_1.default(mainWindow);
        const generalTab = settingsScreen.getTabLocator('Synchronisation');
        await generalTab.click();
        await (0, test_1.expect)(mainScreen.dialog).not.toBeVisible();
        const syncWizardButton = mainWindow.getByRole('button', { name: 'Open Sync Wizard' });
        await syncWizardButton.click();
        await (0, test_1.expect)(mainScreen.dialog).toBeVisible();
    });
    (0, test_1.test)('should be possible to navigate settings screen tabs with the arrow keys', async ({ electronApp, mainWindow, startupPluginsLoaded }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await startupPluginsLoaded;
        await mainScreen.waitFor();
        await mainScreen.openSettings(electronApp);
        const settingsScreen = new SettingsScreen_1.default(mainWindow);
        await settingsScreen.waitFor();
        const generalTab = settingsScreen.getTabLocator('General');
        await generalTab.click();
        const focusedItem = mainWindow.locator(':focus');
        // Up/Down arrows should move to the next and previous items
        await (0, test_1.expect)(focusedItem).toHaveText('General');
        await mainWindow.keyboard.press('ArrowDown');
        await (0, test_1.expect)(focusedItem).toHaveText('Application');
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(focusedItem).toHaveText('General');
        // Pressing Up when the first item is focused should focus the last item
        await mainWindow.keyboard.press('ArrowUp');
        await (0, test_1.expect)(settingsScreen.getLastTab()).toBeFocused();
        await mainWindow.keyboard.press('ArrowDown');
        await mainWindow.keyboard.press('ArrowDown');
        await (0, test_1.expect)(focusedItem).toHaveText('Application');
        // Pressing Tab should focus the tab container
        await mainWindow.keyboard.press('Tab');
        await (0, test_1.expect)(focusedItem).toHaveAttribute('role', 'tabpanel');
        // The correct tab should be visible
        await (0, test_1.expect)(mainWindow.getByLabel('Show tray icon')).toBeVisible();
        // Shift+Tab should focus the sidebar again
        await mainWindow.keyboard.press('Shift+Tab');
        await (0, test_1.expect)(focusedItem).toHaveAttribute('role', 'tab');
        await (0, test_1.expect)(focusedItem).toHaveText('Application');
    });
});
//# sourceMappingURL=settings.spec.js.map