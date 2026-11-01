"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enabledCondition = void 0;
const locale_1 = require("@joplin/lib/locale");
const joplinCommandToTinyMceCommands_1 = require("./NoteBody/TinyMCE/utils/joplinCommandToTinyMceCommands");
const workWithHtmlNotes = [
    'attachFile',
    'textCopy',
    'textCut',
    'textPaste',
    'textSelectAll',
];
// Commands that should remain enabled in viewer mode and when the note is read-only.
const worksInViewerAndReadOnlyMode = [
    'textCopy',
    'textSelectAll',
];
const enabledCondition = (commandName) => {
    const markdownEditorOnly = !Object.keys(joplinCommandToTinyMceCommands_1.joplinCommandToTinyMceCommands).includes(commandName);
    const noteMustBeMarkdown = !workWithHtmlNotes.includes(commandName);
    const allowInViewerAndReadOnlyMode = worksInViewerAndReadOnlyMode.includes(commandName);
    const editorPaneCondition = markdownEditorOnly
        ? '(markdownEditorPaneVisible || hasActivePluginEditor)'
        : allowInViewerAndReadOnlyMode
            ? '(markdownEditorPaneVisible || richTextEditorVisible || markdownViewerPaneVisible || hasActivePluginEditor)'
            : '(markdownEditorPaneVisible || richTextEditorVisible || hasActivePluginEditor)';
    const output = [
        // gotoAnythingVisible: Enable if the command palette (which is a modal dialog) is visible
        '(!modalDialogVisible || gotoAnythingVisible)',
        editorPaneCondition,
        'oneNoteSelected',
        noteMustBeMarkdown ? 'noteIsMarkdown' : '',
        allowInViewerAndReadOnlyMode ? '' : '!noteIsReadOnly',
    ];
    return output.filter(c => !!c).join(' && ');
};
exports.enabledCondition = enabledCondition;
const declarations = [
    {
        name: 'insertText',
    },
    {
        name: 'scrollToHash',
    },
    {
        name: 'textCopy',
        label: () => (0, locale_1._)('Copy'),
        role: 'copy',
    },
    {
        name: 'textCut',
        label: () => (0, locale_1._)('Cut'),
        role: 'cut',
    },
    {
        name: 'textPaste',
        label: () => (0, locale_1._)('Paste'),
        role: 'paste',
    },
    {
        name: 'textSelectAll',
        label: () => (0, locale_1._)('Select all'),
        role: 'selectAll',
    },
    {
        name: 'textBold',
        label: () => (0, locale_1._)('Bold'),
        iconName: 'icon-bold',
    },
    {
        name: 'textItalic',
        label: () => (0, locale_1._)('Italic'),
        iconName: 'icon-italic',
    },
    {
        name: 'textLink',
        label: () => (0, locale_1._)('Hyperlink'),
        iconName: 'icon-link',
    },
    {
        name: 'textCode',
        label: () => (0, locale_1._)('Code'),
        iconName: 'icon-code',
    },
    {
        name: 'attachFile',
        label: () => (0, locale_1._)('Attach file'),
        iconName: 'icon-attachment',
    },
    {
        name: 'textNumberedList',
        label: () => (0, locale_1._)('Numbered List'),
        iconName: 'icon-numbered-list',
    },
    {
        name: 'textBulletedList',
        label: () => (0, locale_1._)('Bulleted List'),
        iconName: 'icon-bulleted-list',
    },
    {
        name: 'textCheckbox',
        label: () => (0, locale_1._)('Checkbox'),
        iconName: 'icon-to-do-list',
    },
    {
        name: 'textHeading',
        label: () => (0, locale_1._)('Heading'),
        iconName: 'icon-heading',
    },
    {
        name: 'textHorizontalRule',
        label: () => (0, locale_1._)('Horizontal Rule'),
        iconName: 'fas fa-ellipsis-h',
    },
    {
        name: 'insertDateTime',
        label: () => (0, locale_1._)('Insert time'),
        iconName: 'icon-add-date',
    },
    {
        name: 'editor.deleteLine',
        label: () => (0, locale_1._)('Delete line'),
    },
    {
        name: 'editor.duplicateLine',
        label: () => (0, locale_1._)('Duplicate line'),
    },
    {
        name: 'editor.undo',
        label: () => (0, locale_1._)('Editor: %s', (0, locale_1._)('Undo')),
    },
    {
        name: 'editor.redo',
        label: () => (0, locale_1._)('Editor: %s', (0, locale_1._)('Redo')),
    },
    {
        name: 'editor.indentLess',
        label: () => (0, locale_1._)('Indent less'),
    },
    {
        name: 'editor.indentMore',
        label: () => (0, locale_1._)('Indent more'),
    },
    {
        name: 'editor.toggleComment',
        label: () => (0, locale_1._)('Toggle comment'),
    },
    {
        name: 'editor.sortSelectedLines',
        label: () => (0, locale_1._)('Sort selected lines'),
    },
    {
        name: 'editor.swapLineUp',
        label: () => (0, locale_1._)('Swap line up'),
    },
    {
        name: 'editor.swapLineDown',
        label: () => (0, locale_1._)('Swap line down'),
    },
    {
        name: 'selectedText',
    },
    {
        name: 'replaceSelection',
    },
    {
        name: 'editor.setText',
    },
    {
        name: 'editor.scrollToText',
    },
    {
        name: 'editor.focus',
    },
    {
        name: 'editor.execCommand',
    },
    {
        name: 'viewer.focus',
    },
    {
        name: 'editor.textTable',
        label: () => (0, locale_1._)('Insert table'),
        iconName: 'fas fa-table',
    },
    {
        name: 'editor.tableAddRow',
        label: () => (0, locale_1._)('Table: Add row'),
        iconName: 'fas fa-plus',
    },
    {
        name: 'editor.tableAddColumn',
        label: () => (0, locale_1._)('Table: Add column'),
        iconName: 'fas fa-columns',
    },
    {
        name: 'editor.tableDeleteRow',
        label: () => (0, locale_1._)('Table: Delete row'),
        iconName: 'fas fa-minus',
    },
    {
        name: 'editor.tableDeleteColumn',
        label: () => (0, locale_1._)('Table: Delete column'),
        iconName: 'fas fa-times',
    },
];
exports.default = declarations;
//# sourceMappingURL=editorCommandDeclarations.js.map