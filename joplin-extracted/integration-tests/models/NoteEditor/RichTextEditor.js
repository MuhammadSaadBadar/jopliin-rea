"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EditorCodeDialog_1 = __importDefault(require("./EditorCodeDialog"));
class RichTextEditor {
    constructor(parent, page) {
        this.container = parent.locator('iframe[title="Rich Text Area"]');
        this.content = this.container.contentFrame();
        this.codeEditor = new EditorCodeDialog_1.default(page);
        this.body = this.content.locator('body');
    }
    async waitFor() {
        await this.container.waitFor();
        await this.content.locator('body').waitFor();
    }
    async focusContent() {
        // eslint-disable-next-line no-restricted-properties -- The focusHandler wrapper can't be used here, since Playwright's focus needs to be awaited
        await this.body.focus();
    }
    async typeText(text) {
        await this.body.waitFor();
        await this.focusContent();
        await this.body.pressSequentially(text);
    }
    async getSearchMatches() {
        return this.body.evaluate(() => {
            var _a;
            const highlights = (_a = CSS.highlights.get('jop-search-highlight')) !== null && _a !== void 0 ? _a : new Set();
            const result = [];
            for (const highlight of highlights) {
                result.push(highlight.toString());
            }
            return result;
        });
    }
}
exports.default = RichTextEditor;
//# sourceMappingURL=RichTextEditor.js.map