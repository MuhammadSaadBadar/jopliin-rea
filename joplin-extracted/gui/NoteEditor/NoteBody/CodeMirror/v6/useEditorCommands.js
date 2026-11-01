"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const resourceHandling_1 = require("../../../utils/resourceHandling");
const locale_1 = require("@joplin/lib/locale");
const dialogs_1 = __importDefault(require("../../../../dialogs"));
const types_1 = require("@joplin/editor/types");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const logger = Logger_1.default.create('CodeMirror 6 commands');
const useEditorCommands = (props) => {
    const editorRef = props.editorRef;
    return (0, react_1.useMemo)(() => {
        const selectedText = () => {
            if (!editorRef.current)
                return '';
            return editorRef.current.getSelection();
        };
        return {
            dropItems: async (cmd) => {
                let pos = cmd.pos && editorRef.current.editor.posAtCoords({ x: cmd.pos.clientX, y: cmd.pos.clientY });
                if (cmd.type === 'notes') {
                    const text = cmd.markdownTags.join('\n');
                    if ((pos !== null && pos !== void 0 ? pos : null) !== null) {
                        editorRef.current.select(pos, pos);
                    }
                    editorRef.current.insertText(text, types_1.UserEventSource.Drop);
                }
                else if (cmd.type === 'files') {
                    pos !== null && pos !== void 0 ? pos : (pos = props.selectionRange.from);
                    const newBody = await (0, resourceHandling_1.commandAttachFileToBody)(props.editorContent, cmd.paths, {
                        createFileURL: !!cmd.createFileURL,
                        position: pos,
                        markupLanguage: props.contentMarkupLanguage,
                    });
                    editorRef.current.updateBody(newBody);
                }
                else {
                    logger.warn('CodeMirror: unsupported drop item: ', cmd);
                }
            },
            selectedText: () => {
                return selectedText();
            },
            selectedHtml: () => {
                return selectedText();
            },
            replaceSelection: (value) => {
                return editorRef.current.insertText(value);
            },
            textCopy: () => {
                props.editorCopyText();
            },
            textCut: () => {
                props.editorCutText();
            },
            textPaste: () => {
                props.editorPaste();
            },
            textSelectAll: () => {
                return editorRef.current.execCommand(types_1.EditorCommandType.SelectAll);
            },
            textLink: async () => {
                const url = await dialogs_1.default.prompt((0, locale_1._)('Insert Hyperlink'));
                (0, focusHandler_1.focus)('useEditorCommands::textLink', editorRef.current);
                if (url) {
                    editorRef.current.wrapSelections('[', `](${url})`);
                }
            },
            insertText: (value) => editorRef.current.insertText(value),
            attachFile: async () => {
                const newBody = await (0, resourceHandling_1.commandAttachFileToBody)(props.editorContent, null, { position: props.selectionRange.from, markupLanguage: props.contentMarkupLanguage });
                if (newBody) {
                    editorRef.current.updateBody(newBody);
                }
            },
            textHorizontalRule: () => editorRef.current.execCommand(types_1.EditorCommandType.InsertHorizontalRule),
            'editor.execCommand': (value) => {
                if (!('args' in value))
                    value.args = [];
                const editorAsRecord = editorRef.current;
                if (editorAsRecord[value.name]) {
                    const result = editorAsRecord[value.name](...value.args);
                    return result;
                }
                else if (editorRef.current.supportsCommand(value.name)) {
                    const result = editorRef.current.execCommand(value.name, ...value.args);
                    return result;
                }
                else {
                    logger.warn('CodeMirror execCommand: unsupported command: ', value.name);
                }
            },
            'editor.focus': (options) => {
                if (props.visiblePanes.indexOf('editor') >= 0) {
                    (0, focusHandler_1.focus)('useEditorCommands::editor.focus', editorRef.current.editor);
                    if (options === null || options === void 0 ? void 0 : options.moveCursorToStart) {
                        editorRef.current.editor.dispatch({
                            selection: { anchor: 0 },
                            scrollIntoView: true,
                        });
                    }
                }
                else {
                    // If we just call focus() then the iframe is focused,
                    // but not its content, such that scrolling up / down
                    // with arrow keys fails
                    props.webviewRef.current.send('focus');
                }
            },
            'viewer.focus': () => {
                if (props.visiblePanes.includes('viewer')) {
                    const editorCursorLine = editorRef.current.getCursor().line;
                    props.webviewRef.current.focusLine(editorCursorLine);
                }
                else {
                    logger.info('Viewer not focused (not visible).');
                }
            },
            search: () => {
                return editorRef.current.execCommand(types_1.EditorCommandType.ShowSearch);
            },
            'editor.scrollToText': (value) => {
                value = Object.assign({ scrollStrategy: 'start' }, value);
                const valueToMarkdown = (value) => {
                    const conv = {
                        h1: text => `# ${text}`,
                        h2: text => `## ${text}`,
                        h3: text => `### ${text}`,
                        h4: text => `#### ${text}`,
                        h5: text => `##### ${text}`,
                        strong: text => `**${text}**`,
                        ul: text => `- ${text}`,
                    };
                    return conv[value.element](value.text);
                };
                return editorRef.current.scrollToText(valueToMarkdown(value), value.scrollStrategy);
            },
        };
    }, [
        props.visiblePanes, props.editorContent, props.editorCopyText, props.editorCutText, props.editorPaste,
        props.selectionRange,
        props.contentMarkupLanguage,
        props.webviewRef, editorRef,
    ]);
};
exports.default = useEditorCommands;
//# sourceMappingURL=useEditorCommands.js.map