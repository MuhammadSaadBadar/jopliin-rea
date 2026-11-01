"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("./util/test");
const MainScreen_1 = __importDefault(require("./models/MainScreen"));
test_1.test.describe('resizableLayout', () => {
    (0, test_1.test)('right/left buttons should retain keyboard focus after use', async ({ electronApp, mainWindow }) => {
        const mainScreen = await new MainScreen_1.default(mainWindow).setup();
        const changeLayoutScreen = mainScreen.changeLayoutScreen;
        await changeLayoutScreen.open(electronApp);
        const moveSidebarControls = changeLayoutScreen.containerLocator.getByRole('group', { name: 'Sidebar' });
        const moveSidebarRight = moveSidebarControls.getByRole('button', { name: 'Move right' });
        await (0, test_1.expect)(moveSidebarRight).not.toBeDisabled();
        // Should refocus (or keep focused) after clicking
        await moveSidebarRight.click();
        await (0, test_1.expect)(moveSidebarRight).toBeFocused();
        await moveSidebarRight.click();
        await (0, test_1.expect)(moveSidebarRight).toBeFocused();
    });
});
//# sourceMappingURL=resizableLayout.spec.js.map