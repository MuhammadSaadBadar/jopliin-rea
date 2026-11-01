"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setSettingValue_1 = __importDefault(require("../util/setSettingValue"));
const test_1 = require("../util/test");
class ChatPanel {
    constructor(page_, mainScreen_) {
        this.page_ = page_;
        this.mainScreen_ = mainScreen_;
        this.container = page_.getByRole('region', { name: 'AI Chat' });
        this.textInput = page_.getByRole('textbox', { name: 'Chat message' });
    }
    async configure(electronApp) {
        await (0, setSettingValue_1.default)(electronApp, this.page_, 'ai.enabled', true);
        await (0, setSettingValue_1.default)(electronApp, this.page_, 'ai.allowRemote', true);
        await (0, setSettingValue_1.default)(electronApp, this.page_, 'ai.chat.providerType', 'test-provider');
    }
    async open(electronApp) {
        await this.mainScreen_.goToAnything.runCommand(electronApp, 'toggleAiChat');
        await this.container.waitFor();
    }
    async close(electronApp) {
        await this.container.waitFor();
        await this.mainScreen_.goToAnything.runCommand(electronApp, 'toggleAiChat');
        await (0, test_1.expect)(this.container).not.toBeVisible();
    }
    async sendMessage(message) {
        await this.textInput.fill(message);
        await this.textInput.press('Enter');
    }
    async waitForMessageCount(count) {
        await (0, test_1.expect)(this.container.locator('.chat-message.turn')).toHaveCount(count);
    }
}
exports.default = ChatPanel;
//# sourceMappingURL=ChatPanel.js.map