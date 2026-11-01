"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activateMainMenuItem_1 = __importDefault(require("../util/activateMainMenuItem"));
class ChangeAppLayoutScreen {
    constructor(page, mainScreen) {
        this.mainScreen = mainScreen;
        this.containerLocator = page.locator('.change-app-layout-dialog[open]');
    }
    async open(electronApp) {
        await this.mainScreen.waitFor();
        await (0, activateMainMenuItem_1.default)(electronApp, 'Change application layout');
        return this.waitFor();
    }
    async waitFor() {
        await this.containerLocator.waitFor();
    }
}
exports.default = ChangeAppLayoutScreen;
//# sourceMappingURL=ChangeAppLayoutScreen.js.map