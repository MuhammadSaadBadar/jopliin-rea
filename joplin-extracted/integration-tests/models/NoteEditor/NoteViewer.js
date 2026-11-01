"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoteViewer {
    constructor(parent) {
        this.container = parent.locator('iframe[src$="note-viewer/index.html"]');
        this.content = this.container.contentFrame();
    }
    async waitFor() {
        await this.container.waitFor();
        await this.content.locator('body').waitFor();
    }
}
exports.default = NoteViewer;
//# sourceMappingURL=NoteViewer.js.map