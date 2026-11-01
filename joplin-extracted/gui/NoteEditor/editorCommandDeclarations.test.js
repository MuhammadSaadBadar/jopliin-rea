"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WhenClause_1 = __importDefault(require("@joplin/lib/services/WhenClause"));
const editorCommandDeclarations_1 = require("./editorCommandDeclarations");
const baseContext = {
    modalDialogVisible: false,
    gotoAnythingVisible: false,
    markdownEditorPaneVisible: true,
    markdownViewerPaneVisible: false,
    oneNoteSelected: true,
    noteIsMarkdown: true,
    noteIsReadOnly: false,
    richTextEditorVisible: false,
    hasActivePluginEditor: false,
};
describe('editorCommandDeclarations', () => {
    test.each([
        [
            {},
            { textBold: true },
        ],
        [
            {
                markdownEditorPaneVisible: false,
            },
            { textBold: false },
        ],
        [
            {
                noteIsReadOnly: true,
            },
            { textBold: false },
        ],
        [
            // In the Markdown editor, but only the viewer is visible
            {
                markdownEditorPaneVisible: false,
                richTextEditorVisible: false,
            },
            { textBold: false },
        ],
        [
            // In the Markdown editor, and the viewer is visible
            {
                markdownEditorPaneVisible: true,
                richTextEditorVisible: false,
            },
            { textBold: true },
        ],
        [
            // In the RT editor
            {
                markdownEditorPaneVisible: false,
                richTextEditorVisible: true,
            },
            { textBold: true },
        ],
        [
            // In the Markdown editor, and the command palette is visible
            {
                markdownEditorPaneVisible: true,
                richTextEditorVisible: false,
                gotoAnythingVisible: true,
                modalDialogVisible: true,
            },
            { textBold: true },
        ],
        [
            // In the Markdown editor, and the command palette is visible
            {
                markdownEditorPaneVisible: true,
                richTextEditorVisible: false,
                gotoAnythingVisible: true,
                modalDialogVisible: true,
            },
            { textBold: true },
        ],
        [
            // Rich Text Editor, HTML note
            {
                markdownEditorPaneVisible: false,
                richTextEditorVisible: true,
                noteIsMarkdown: false,
            },
            {
                textCopy: true,
                textPaste: true,
                textSelectAll: true,
            },
        ],
        [
            // Rich Text Editor, read-only note
            {
                markdownEditorPaneVisible: false,
                richTextEditorVisible: true,
                noteIsReadOnly: true,
            },
            {
                textBold: false,
                textPaste: false,
                textCopy: true,
                textSelectAll: true,
            },
        ],
        [
            // Viewer-only mode (no editor pane visible, only the rendered viewer)
            {
                markdownEditorPaneVisible: false,
                richTextEditorVisible: false,
                markdownViewerPaneVisible: true,
            },
            {
                textCopy: true,
                textSelectAll: true,
                textCut: false,
                textPaste: false,
                textBold: false,
            },
        ],
        [
            // Viewer-only mode with a read-only note
            {
                markdownEditorPaneVisible: false,
                richTextEditorVisible: false,
                markdownViewerPaneVisible: true,
                noteIsReadOnly: true,
            },
            {
                textCopy: true,
                textSelectAll: true,
                textCut: false,
                textPaste: false,
            },
        ],
    ])('should correctly determine whether command is enabled (case %#)', (context, expectedStates) => {
        const actualStates = [];
        for (const commandName of Object.keys(expectedStates)) {
            const condition = (0, editorCommandDeclarations_1.enabledCondition)(commandName);
            const wc = new WhenClause_1.default(condition);
            const actual = wc.evaluate(Object.assign(Object.assign({}, baseContext), context));
            actualStates.push([commandName, actual]);
        }
        const expectedStatesArray = Object.entries(expectedStates);
        expect(actualStates).toEqual(expectedStatesArray);
    });
});
//# sourceMappingURL=editorCommandDeclarations.test.js.map