"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditorCodeDialog {
    constructor(page) {
        this.dialog = page.getByRole('dialog', { name: 'Edit' });
        this.textArea = this.dialog.locator('textarea');
        this.okButton = this.dialog.getByRole('button', { name: 'OK' });
    }
    async waitFor() {
        await this.dialog.waitFor();
        await this.textArea.waitFor();
    }
    async submit() {
        await this.okButton.click();
    }
}
exports.default = EditorCodeDialog;
//# sourceMappingURL=EditorCodeDialog.js.map