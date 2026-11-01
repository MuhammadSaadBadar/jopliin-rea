"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MarkdownEditor {
    constructor(parent) {
        this.container = parent.locator('.CodeMirror');
        this.content = this.container.locator('[contentEditable]');
    }
    async waitFor() {
        await this.container.waitFor();
    }
    async pressKey(text) {
        await this.content.press(text);
    }
    async typeText(text) {
        await this.focusContent();
        await this.content.pressSequentially(text);
    }
    async focusContent() {
        // eslint-disable-next-line no-restricted-properties -- The focusHandler wrapper can't be used here, since Playwright's focus needs to be awaited
        await this.content.focus();
    }
    async innerText() {
        return this.content.innerText();
    }
}
exports.default = MarkdownEditor;
//# sourceMappingURL=MarkdownEditor.js.map