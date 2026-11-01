"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
const SettingsScreen_1 = __importDefault(require("./models/SettingsScreen"));
const activateMainMenuItem_1 = __importDefault(require("./util/activateMainMenuItem"));
test_1.test.describe('simpleBackup', () => {
    (0, test_1.test)('should have a section in settings', async ({ electronApp, startupPluginsLoaded, mainWindow }) => {
        await startupPluginsLoaded;
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        // Open settings (check both labels so that this works on MacOS)
        await mainScreen.openSettings(electronApp);
        // Should be on the settings screen
        const settingsScreen = new SettingsScreen_1.default(mainWindow);
        await settingsScreen.waitFor();
        const backupTab = settingsScreen.getTabLocator('Backup');
        await backupTab.waitFor();
    });
    (0, test_1.test)('should be possible to create a backup', async ({ electronApp, startupPluginsLoaded, mainWindow }) => {
        await startupPluginsLoaded;
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        await mainScreen.waitFor();
        // Backups should work
        await (0, activateMainMenuItem_1.default)(electronApp, 'Create backup');
        const successDialog = mainWindow.locator('iframe[id$=backup-backupDialog]');
        await successDialog.waitFor();
        // Should report success
        const dialogContentLocator = successDialog.frameLocator(':scope');
        await dialogContentLocator.getByText('Backup completed').waitFor();
    });
});
//# sourceMappingURL=simpleBackup.spec.js.map