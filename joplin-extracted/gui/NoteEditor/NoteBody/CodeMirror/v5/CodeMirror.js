"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const resourceHandling_1 = require("../../../utils/resourceHandling");
const types_1 = require("../../../utils/types");
const utils_1 = require("../utils");
const useScrollHandler_1 = __importDefault(require("../utils/useScrollHandler"));
const useElementSize_1 = __importDefault(require("@joplin/lib/hooks/useElementSize"));
const Toolbar_1 = __importDefault(require("../Toolbar"));
const types_2 = require("../utils/types");
const NoteTextViewer_1 = __importDefault(require("../../../../NoteTextViewer"));
const Editor_1 = __importDefault(require("./Editor"));
const usePluginServiceRegistration_1 = __importDefault(require("../../../utils/usePluginServiceRegistration"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../../../services/bridge"));
const markdownUtils_1 = __importDefault(require("@joplin/lib/markdownUtils"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const theme_1 = require("@joplin/lib/theme");
const type_1 = require("@joplin/lib/themes/type");
const dialogs_1 = __importDefault(require("../../../../dialogs"));
const renderer_1 = require("@joplin/renderer");
const electron_1 = require("electron");
const registry_1 = require("@joplin/lib/registry");
const ErrorBoundary_1 = __importDefault(require("../../../../ErrorBoundary"));
const useStyles_1 = __importDefault(require("../utils/useStyles"));
const useContextMenu_1 = __importDefault(require("../utils/useContextMenu"));
const useWebviewIpcMessage_1 = __importDefault(require("../utils/useWebviewIpcMessage"));
const useEditorSearchHandler_1 = __importDefault(require("../utils/useEditorSearchHandler"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const NewWindowOrIFrame_1 = require("../../../../NewWindowOrIFrame");
function markupRenderOptions(override = null) {
    return Object.assign({}, override);
}
function CodeMirror(props, ref) {
    const styles = (0, useStyles_1.default)(props);
    const [renderedBody, setRenderedBody] = (0, react_1.useState)((0, types_2.defaultRenderedBody)()); // Viewer content
    const [renderedBodyContentKey, setRenderedBodyContentKey] = (0, react_1.useState)(null);
    const [webviewReady, setWebviewReady] = (0, react_1.useState)(false);
    const editorRef = (0, react_1.useRef)(null);
    const [editorRoot, setEditorRoot] = (0, react_1.useState)(null);
    const rootRef = (0, react_1.useRef)(null);
    rootRef.current = editorRoot;
    const webviewRef = (0, react_1.useRef)(null);
    const props_onChangeRef = (0, react_1.useRef)(null);
    props_onChangeRef.current = props.onChange;
    const rootSize = (0, useElementSize_1.default)(rootRef);
    (0, usePluginServiceRegistration_1.default)(ref);
    const { resetScroll, editor_scroll, setEditorPercentScroll, setViewerPercentScroll, editor_resize, editor_update, getLineScrollPercent, } = (0, useScrollHandler_1.default)(editorRef, webviewRef, props.onScroll);
    const codeMirror_change = (0, react_1.useCallback)((newBody) => {
        props_onChangeRef.current({ changeId: null, content: newBody });
    }, []);
    const wrapSelectionWithStrings = (0, react_1.useCallback)((string1, string2 = '', defaultText = '') => {
        if (!editorRef.current)
            return;
        if (editorRef.current.somethingSelected()) {
            editorRef.current.wrapSelections(string1, string2);
        }
        else {
            editorRef.current.wrapSelections(string1 + defaultText, string2);
            // Now select the default text so the user can replace it
            const selections = editorRef.current.listSelections();
            const newSelections = [];
            for (let i = 0; i < selections.length; i++) {
                const s = selections[i];
                const anchor = { line: s.anchor.line, ch: s.anchor.ch + string1.length };
                const head = { line: s.head.line, ch: s.head.ch - string2.length };
                newSelections.push({ anchor: anchor, head: head });
            }
            editorRef.current.setSelections(newSelections);
        }
    }, []);
    const addListItem = (0, react_1.useCallback)((string1, defaultText = '') => {
        if (editorRef.current) {
            if (editorRef.current.somethingSelected()) {
                editorRef.current.wrapSelectionsByLine(string1);
            }
            else if (editorRef.current.getCursor('anchor').ch !== 0) {
                editorRef.current.insertAtCursor(`\n${string1}`);
            }
            else {
                wrapSelectionWithStrings(string1, '', defaultText);
            }
        }
    }, [wrapSelectionWithStrings]);
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            content: () => props.content,
            resetScroll: () => {
                resetScroll();
            },
            scrollTo: (options) => {
                if (options.type === types_1.ScrollOptionTypes.Hash) {
                    if (!webviewRef.current)
                        return;
                    webviewRef.current.send('scrollToHash', options.value);
                }
                else if (options.type === types_1.ScrollOptionTypes.Percent) {
                    const percent = options.value;
                    setEditorPercentScroll(percent);
                    setViewerPercentScroll(percent);
                }
                else {
                    throw new Error(`Unsupported scroll options: ${options.type}`);
                }
            },
            supportsCommand: ( /* name:string*/) => {
                // TODO: not implemented, currently only used for "search" command
                // which is not directly supported by this Editor.
                return false;
            },
            execCommand: async (cmd) => {
                if (!editorRef.current)
                    return false;
                registry_1.reg.logger().debug('CodeMirror: execCommand', cmd);
                let commandProcessed = true;
                if (cmd.name === 'dropItems') {
                    if (cmd.value.type === 'notes') {
                        editorRef.current.insertAtCursor(cmd.value.markdownTags.join('\n'));
                    }
                    else if (cmd.value.type === 'files') {
                        const pos = (0, utils_1.cursorPositionToTextOffset)(editorRef.current.getCursor(), props.content);
                        const newBody = await (0, resourceHandling_1.commandAttachFileToBody)(props.content, cmd.value.paths, {
                            createFileURL: !!cmd.value.createFileURL,
                            position: pos,
                            markupLanguage: props.contentMarkupLanguage,
                        });
                        editorRef.current.updateBody(newBody);
                    }
                    else {
                        registry_1.reg.logger().warn('CodeMirror: unsupported drop item: ', cmd);
                    }
                }
                else if (cmd.name === 'editor.focus') {
                    if (props.visiblePanes.indexOf('editor') >= 0) {
                        (0, focusHandler_1.focus)('v5/CodeMirror::editor.focus', editorRef.current);
                    }
                    else {
                        // If we just call focus() then the iframe is focused,
                        // but not its content, such that scrolling up / down
                        // with arrow keys fails
                        webviewRef.current.send('focus');
                    }
                }
                else {
                    commandProcessed = false;
                }
                let commandOutput = null;
                if (!commandProcessed) {
                    const selectedText = () => {
                        if (!editorRef.current)
                            return '';
                        const selections = editorRef.current.getSelections();
                        return selections.length ? selections[0] : '';
                    };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Heterogeneous editor commands; each entry has a different signature, dispatched dynamically by name
                    const commands = {
                        selectedText: () => {
                            return selectedText();
                        },
                        selectedHtml: () => {
                            return selectedText();
                        },
                        replaceSelection: (value) => {
                            return editorRef.current.replaceSelection(value);
                        },
                        textCopy: () => {
                            editorCopyText();
                        },
                        textCut: () => {
                            editorCutText();
                        },
                        textPaste: () => {
                            editorPaste();
                        },
                        textSelectAll: () => {
                            return editorRef.current.execCommand('selectAll');
                        },
                        textBold: () => wrapSelectionWithStrings('**', '**', (0, locale_1._)('strong text')),
                        textItalic: () => wrapSelectionWithStrings('*', '*', (0, locale_1._)('emphasised text')),
                        textLink: async () => {
                            const url = await dialogs_1.default.prompt((0, locale_1._)('Insert Hyperlink'));
                            (0, focusHandler_1.focus)('v5/CodeMirror::textLink', editorRef.current);
                            if (url)
                                wrapSelectionWithStrings('[', `](${url})`);
                        },
                        textCode: () => {
                            const selections = editorRef.current.getSelections();
                            // This bases the selection wrapping only around the first element
                            if (selections.length > 0) {
                                const string = selections[0];
                                // Look for newlines
                                const match = string.match(/\r?\n/);
                                if (match && match.length > 0) {
                                    wrapSelectionWithStrings(`\`\`\`${match[0]}`, `${match[0]}\`\`\``);
                                }
                                else {
                                    wrapSelectionWithStrings('`', '`', '');
                                }
                            }
                        },
                        insertText: (value) => editorRef.current.insertAtCursor(value),
                        attachFile: async () => {
                            const cursor = editorRef.current.getCursor();
                            const pos = (0, utils_1.cursorPositionToTextOffset)(cursor, props.content);
                            const newBody = await (0, resourceHandling_1.commandAttachFileToBody)(props.content, null, { position: pos, markupLanguage: props.contentMarkupLanguage });
                            if (newBody)
                                editorRef.current.updateBody(newBody);
                        },
                        textNumberedList: () => {
                            let bulletNumber = markdownUtils_1.default.olLineNumber(editorRef.current.getCurrentLine());
                            if (!bulletNumber)
                                bulletNumber = markdownUtils_1.default.olLineNumber(editorRef.current.getPreviousLine());
                            if (!bulletNumber)
                                bulletNumber = 0;
                            addListItem(`${bulletNumber + 1}. `, (0, locale_1._)('List item'));
                        },
                        textBulletedList: () => addListItem('- ', (0, locale_1._)('List item')),
                        textCheckbox: () => addListItem('- [ ] ', (0, locale_1._)('List item')),
                        textHeading: () => addListItem('## ', ''),
                        textHorizontalRule: () => addListItem('* * *'),
                        'editor.execCommand': (value) => {
                            if (!('args' in value))
                                value.args = [];
                            if (editorRef.current[value.name]) {
                                const result = editorRef.current[value.name](...value.args);
                                return result;
                            }
                            else if (editorRef.current.commandExists(value.name)) {
                                const result = editorRef.current.execCommand(value.name);
                                return result;
                            }
                            else {
                                registry_1.reg.logger().warn('CodeMirror execCommand: unsupported command: ', value.name);
                            }
                        },
                        'editor.scrollToText': (_text) => {
                            registry_1.reg.logger().warn('"editor.scrollToText" is unsupported in legacy editor - please use the new editor');
                            return false;
                        },
                        // Table editing commands are only supported in the v6 editor
                        'editor.tableAddRow': () => {
                            registry_1.reg.logger().warn('Table editing commands are not supported in the legacy editor');
                            return false;
                        },
                        'editor.tableAddColumn': () => {
                            registry_1.reg.logger().warn('Table editing commands are not supported in the legacy editor');
                            return false;
                        },
                        'editor.tableDeleteRow': () => {
                            registry_1.reg.logger().warn('Table editing commands are not supported in the legacy editor');
                            return false;
                        },
                        'editor.tableDeleteColumn': () => {
                            registry_1.reg.logger().warn('Table editing commands are not supported in the legacy editor');
                            return false;
                        },
                    };
                    if (commands[cmd.name]) {
                        commandOutput = commands[cmd.name](cmd.value);
                    }
                    else if (await editorRef.current.supportsCommand(cmd)) {
                        commandOutput = editorRef.current.execCommandFromJoplin(cmd);
                    }
                    else {
                        registry_1.reg.logger().warn('CodeMirror: unsupported Joplin command: ', cmd);
                    }
                }
                return commandOutput;
            },
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.content, props.visiblePanes, props.contentMarkupLanguage, addListItem, wrapSelectionWithStrings, setEditorPercentScroll, setViewerPercentScroll, resetScroll]);
    const onEditorPaste = (0, react_1.useCallback)(async (event = null) => {
        const resourceMds = await (0, resourceHandling_1.getResourcesFromPasteEvent)(event);
        if (!resourceMds.length)
            return;
        if (editorRef.current) {
            editorRef.current.replaceSelection(resourceMds.join('\n'));
        }
    }, []);
    const editorCutText = (0, react_1.useCallback)(() => {
        if (editorRef.current) {
            const selections = editorRef.current.getSelections();
            if (selections.length > 0 && selections[0]) {
                electron_1.clipboard.writeText(selections[0]);
                // Easy way to wipe out just the first selection
                selections[0] = '';
                editorRef.current.replaceSelections(selections);
            }
            else {
                const cursor = editorRef.current.getCursor();
                const line = editorRef.current.getLine(cursor.line);
                electron_1.clipboard.writeText(`${line}\n`);
                const startLine = editorRef.current.getCursor('head');
                startLine.ch = 0;
                const endLine = {
                    line: startLine.line + 1,
                    ch: 0,
                };
                editorRef.current.replaceRange('', startLine, endLine);
            }
        }
    }, []);
    const editorCopyText = (0, react_1.useCallback)(() => {
        if (editorRef.current) {
            const selections = editorRef.current.getSelections();
            // Handle the case when there is a selection - copy the selection to the clipboard
            // When there is no selection, the selection array contains an empty string.
            if (selections.length > 0 && selections[0]) {
                electron_1.clipboard.writeText(selections[0]);
            }
            else {
                // This is the case when there is no selection - copy the current line to the clipboard
                const cursor = editorRef.current.getCursor();
                const line = editorRef.current.getLine(cursor.line);
                electron_1.clipboard.writeText(line);
            }
        }
    }, []);
    const editorPasteText = (0, react_1.useCallback)(async () => {
        if (editorRef.current) {
            const pastedText = electron_1.clipboard.readText();
            const resourceMd = (0, resourceHandling_1.plainTextLooksLikeAffinityImageData)(pastedText) ? await (0, resourceHandling_1.getResourceFromClipboardImage)() : null;
            const modifiedMd = resourceMd || await Note_1.default.replaceResourceExternalToInternalLinks(pastedText, { useAbsolutePaths: true });
            editorRef.current.replaceSelection(modifiedMd);
        }
    }, []);
    const editorPaste = (0, react_1.useCallback)(() => {
        const clipboardText = electron_1.clipboard.readText();
        if (clipboardText) {
            void editorPasteText();
        }
        else {
            // To handle pasting images
            void onEditorPaste();
        }
    }, [editorPasteText, onEditorPaste]);
    const loadScript = async (script, document) => {
        return new Promise((resolve) => {
            let element = document.createElement('script');
            if (script.src.indexOf('.css') >= 0) {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = script.src;
            }
            else {
                element.src = script.src;
                if (script.attrs) {
                    for (const attr in script.attrs) {
                        element[attr] = script.attrs[attr];
                    }
                }
            }
            element.id = script.id;
            element.onload = () => {
                resolve(null);
            };
            document.getElementsByTagName('head')[0].appendChild(element);
        });
    };
    (0, react_1.useEffect)(() => {
        if (!editorRoot)
            return () => { };
        let cancelled = false;
        async function loadScripts() {
            const scriptsToLoad = [
                {
                    src: `${(0, bridge_1.default)().vendorDir()}/lib/codemirror/addon/dialog/dialog.css`,
                    id: 'codemirrorDialogStyle',
                    loaded: false,
                },
            ];
            // The default codemirror theme is defined in codemirror.css
            // and doesn't have an extra css file
            if (styles.editor.codeMirrorTheme !== 'default') {
                // Solarized light and solarized dark are loaded by the single
                // solarized.css file
                let theme = styles.editor.codeMirrorTheme;
                if (theme.indexOf('solarized') >= 0)
                    theme = 'solarized';
                scriptsToLoad.push({
                    src: `${(0, bridge_1.default)().vendorDir()}/lib/codemirror/theme/${theme}.css`,
                    id: `codemirrorTheme${theme}`,
                    loaded: false,
                });
            }
            const ownerDoc = editorRoot.ownerDocument;
            for (const s of scriptsToLoad) {
                if (ownerDoc.getElementById(s.id)) {
                    s.loaded = true;
                    continue;
                }
                await loadScript(s, ownerDoc);
                if (cancelled)
                    return;
                s.loaded = true;
            }
        }
        void loadScripts();
        return () => {
            cancelled = true;
        };
    }, [styles.editor.codeMirrorTheme, editorRoot]);
    (0, react_1.useEffect)(() => {
        if (!editorRoot)
            return () => { };
        const theme = (0, theme_1.themeStyle)(props.themeId);
        // Selection in dark mode is hard to see so make it brighter.
        // https://discourse.joplinapp.org/t/dragging-in-dark-theme/12433/4?u=laurent
        const selectionColorCss = theme.appearance === type_1.ThemeAppearance.Dark ?
            `.CodeMirror-selected {
				background: #6b6b6b !important;
			}` : '';
        // Vim mode draws a fat cursor in the background, we don't want to add background colors
        // to the inline code in this case (it would hide the cursor)
        const codeBackgroundColor = Setting_1.default.value('editor.keyboardMode') !== 'vim' ? theme.codeBackgroundColor : 'inherit';
        const monospaceFonts = [];
        if (Setting_1.default.value('style.editor.monospaceFontFamily'))
            monospaceFonts.push(`"${Setting_1.default.value('style.editor.monospaceFontFamily')}"`);
        monospaceFonts.push('monospace');
        const maxWidthCss = props.contentMaxWidth ? `
			margin-right: auto !important;
			margin-left: auto !important;
			max-width: ${props.contentMaxWidth}px !important;
		` : '';
        const ownerDoc = editorRoot.ownerDocument;
        const element = ownerDoc.createElement('style');
        element.setAttribute('id', 'codemirrorStyle');
        ownerDoc.head.appendChild(element);
        element.appendChild(ownerDoc.createTextNode(`
			/* These must be important to prevent the codemirror defaults from taking over*/
			.CodeMirror {
				font-family: monospace;
				font-size: ${props.fontSize}px;
				height: 100% !important;
				width: 100% !important;
				color: inherit !important;
				background-color: inherit !important;
				position: absolute !important;
				/* Some themes add a box shadow for some reason */
				-webkit-box-shadow: none !important;
				line-height: ${theme.lineHeight} !important;
			}

			.CodeMirror-code:focus-visible {
				/* Avoid showing additional focus-visible decoration */
				outline: none;
			}

			.CodeMirror-lines {
				/* This is used to enable the scroll-past end behaviour. The same height should */
				/* be applied to the viewer. */
				padding-bottom: 400px !important;
			}

			/* Left padding is applied at the editor component level, so we should remove it from the lines */
			.CodeMirror pre.CodeMirror-line,
			.CodeMirror pre.CodeMirror-line-like {
				padding-left: 0;
			}

			.CodeMirror-sizer {
				/* Add a fixed right padding to account for the appearance (and disappearance) */
				/* of the sidebar */
				padding-right: 10px !important;
				${maxWidthCss}
			}

			/* This enforces monospace for certain elements (code, tables, etc.) */
			.cm-jn-monospace {
				font-family: ${monospaceFonts.join(', ')} !important;
			}

			div.CodeMirror span.cm-header-1 {
				font-size: 1.5em;
				color: ${theme.color};
			}

			div.CodeMirror span.cm-header-2 {
				font-size: 1.3em;
				color: ${theme.color};
			}

			div.CodeMirror span.cm-header-3 {
				font-size: 1.1em;
				color: ${theme.color};
			}

			div.CodeMirror span.cm-header-4, div.CodeMirror span.cm-header-5, div.CodeMirror span.cm-header-6 {
				font-size: 1em;
				color: ${theme.color};
			}

			div.CodeMirror span.cm-variable-2, div.CodeMirror span.cm-variable-3, div.CodeMirror span.cm-keyword {
				color: ${theme.color};
			}

			div.CodeMirror span.cm-quote {
				color: ${theme.color};
				opacity: ${theme.blockQuoteOpacity};
			}

			div.CodeMirror span.cm-link-text {
				color: ${theme.urlColor};
			}

			div.CodeMirror span.cm-url {
				color: ${theme.urlColor};
				opacity: 0.5;
			}

			div.CodeMirror span.cm-comment {
				color: ${theme.codeColor};
			}

			/* Negative margins are needed to compensate for the border */
			div.CodeMirror span.cm-comment.cm-jn-inline-code:not(.cm-search-marker):not(.cm-fat-cursor-mark):not(.cm-search-marker-selected):not(.CodeMirror-selectedtext) {
				border: 1px solid ${theme.codeBorderColor};
				background-color: ${codeBackgroundColor};
				margin-left: -1px;
				margin-right: -1px;
				border-radius: .25em;
			}

			div.CodeMirror div.cm-jn-code-block-background {
				background-color: ${theme.codeBackgroundColor};
				padding-right: .2em;
				padding-left: .2em;
			}

			div.CodeMirror span.cm-hr {
				color: ${theme.dividerColor};
			}

			.cm-header-1, .cm-header-2, .cm-header-3, .cm-header-4, .cm-header-5, .cm-header-6 {
				line-height: 1.5em;
			}

			.cm-search-marker {
				background: ${theme.searchMarkerBackgroundColor};
				color: ${theme.searchMarkerColor} !important;
			}

			/* We need !important because the search marker is overridden by CodeMirror's own text selection marker */
			.cm-search-marker-selected {
				background: ${theme.selectedColor2} !important;
				color: ${theme.color2} !important;
			}

			.cm-search-marker-scrollbar {
				background: ${theme.searchMarkerBackgroundColor};
				-moz-box-sizing: border-box;
				box-sizing: border-box;
				opacity: .5;
			}

			/* We need to use important to override theme specific values */
			.cm-error {
				color: inherit !important;
				background-color: inherit !important;
				border-bottom: 1px dotted #dc322f;
			}

			/* The default dark theme colors don't have enough contrast with the background */

			/*
			.cm-s-nord span.cm-comment {
				color: #9aa4b6 !important;
			}

			.cm-s-dracula span.cm-comment {
				color: #a1abc9 !important;
			}

			.cm-s-monokai span.cm-comment {
				color: #908b74 !important;
			}

			.cm-s-material-darker span.cm-comment {
				color: #878787 !important;
			}

			.cm-s-solarized.cm-s-dark span.cm-comment {
				color: #8ba1a7 !important;
			}
			*/

			${selectionColorCss}
		`));
        return () => {
            ownerDoc.head.removeChild(element);
        };
    }, [props.themeId, props.contentMaxWidth, props.fontSize, editorRoot]);
    const webview_domReady = (0, react_1.useCallback)(() => {
        setWebviewReady(true);
    }, []);
    const webview_ipcMessage = (0, useWebviewIpcMessage_1.default)({
        editorRef,
        setEditorPercentScroll,
        getLineScrollPercent,
        content: props.content,
        onMessage: props.onMessage,
    });
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        // When a new note is loaded (contentKey is different), we want the note to be displayed
        // right away. However once that's done, we put a small delay so that the view is not
        // being constantly updated while the user changes the note.
        const interval = renderedBodyContentKey !== props.contentKey ? 0 : 500;
        const timeoutId = shim_1.default.setTimeout(async () => {
            let bodyToRender = props.content;
            if (!props.visiblePanes.includes('viewer')) {
                return;
            }
            if (!bodyToRender.trim() && props.visiblePanes.indexOf('viewer') >= 0 && props.visiblePanes.indexOf('editor') < 0) {
                // Fixes https://github.com/laurent22/joplin/issues/217
                bodyToRender = `<i>${(0, locale_1._)('This note has no content. Click on "%s" to toggle the editor and edit the note.', (0, locale_1._)('Layout'))}</i>`;
            }
            const result = await props.markupToHtml(props.contentMarkupLanguage, bodyToRender, markupRenderOptions({
                resourceInfos: props.resourceInfos,
                contentMaxWidth: props.contentMaxWidth,
                mapsToLine: true,
                useCustomPdfViewer: props.useCustomPdfViewer,
                noteId: props.noteId,
                vendorDir: (0, bridge_1.default)().vendorDir(),
                showNoteLinkIcon: props.showNoteLinkIcon,
            }));
            if (cancelled)
                return;
            setRenderedBody(result);
            // Since we set `renderedBodyContentKey` here, it means this effect is going to
            // be triggered again, but that's hard to avoid and the second call would be cheap
            // anyway since the renderered markdown is cached by MdToHtml. We could use a ref
            // to avoid this, but a second rendering might still happens anyway to render images,
            // resources, or for other reasons. So it's best to focus on making any second call
            // to this effect as cheap as possible with caching, etc.
            setRenderedBodyContentKey(props.contentKey);
        }, interval);
        return () => {
            cancelled = true;
            shim_1.default.clearTimeout(timeoutId);
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.content, props.contentKey, renderedBodyContentKey, props.contentMarkupLanguage, props.visiblePanes, props.resourceInfos, props.markupToHtml, props.showNoteLinkIcon]);
    (0, react_1.useEffect)(() => {
        var _a;
        if (!webviewReady)
            return;
        const options = {
            pluginAssets: renderedBody.pluginAssets,
            downloadResources: Setting_1.default.value('sync.resourceDownloadMode'),
            markupLineCount: ((_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.lineCount()) || 0,
        };
        // It seems when there's an error immediately when the component is
        // mounted, webviewReady might be true, but webviewRef.current will be
        // undefined. Maybe due to the error boundary that unmount components.
        // Since we can't do much about it we just print an error.
        if (webviewRef.current) {
            // To keep consistency among CodeMirror's editing and scroll percents
            // of Editor and Viewer.
            const percent = getLineScrollPercent();
            setEditorPercentScroll(percent);
            options.percent = percent;
            webviewRef.current.setHtml(renderedBody.html, options);
        }
        else {
            console.error('Trying to set HTML on an undefined webview ref');
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [renderedBody, webviewReady]);
    // Stop media playing in the viewer once it's hidden - https://github.com/laurent22/joplin/issues/15278
    const viewerVisible = props.visiblePanes.includes('viewer');
    (0, react_1.useEffect)(() => {
        var _a;
        if (!viewerVisible) {
            (_a = webviewRef.current) === null || _a === void 0 ? void 0 : _a.stopMediaPlayback();
        }
    }, [viewerVisible]);
    const { onSetInitialMarkersRef } = (0, useEditorSearchHandler_1.default)({
        setLocalSearchResultCount: props.setLocalSearchResultCount,
        searchMarkers: props.searchMarkers,
        webviewRef,
        editorRef,
        noteContent: props.content,
        renderedBody,
        showEditorMarkers: true,
    });
    (0, react_1.useEffect)(() => {
        if (!editorRef.current)
            return;
        // Need to let codemirror know that it's container's size has changed so that it can
        // re-compute anything it needs to. This ensures the cursor (and anything that is
        // based on window size will be correct
        // Codemirror will automatically refresh on window size changes but otherwise assumes
        // that it's container size is stable, that is not true with Joplin, hence
        // why we need to manually let codemirror know about resizes.
        // Manually calling refresh here will cause a double refresh in some instances (when the
        // window size is changed for example) but this is a fairly quick operation so it's worth
        // it.
        editorRef.current.refresh();
    }, [rootSize, styles.editor, props.visiblePanes]);
    (0, useContextMenu_1.default)({
        plugins: props.plugins,
        dispatch: props.dispatch,
        editorCutText, editorCopyText, editorPaste,
        editorRef,
        editorClassName: 'codeMirrorEditor',
        containerRef: rootRef,
    });
    function renderEditor() {
        const matchBracesOptions = Setting_1.default.value('editor.autoMatchingBraces') ? { override: true, pairs: '``()[]{}\'\'""‘’“”（）《》「」『』【】〔〕〖〗〘〙〚〛' } : false;
        return (React.createElement("div", { className: 'editor' },
            React.createElement(Editor_1.default, { value: props.content, searchMarkers: props.searchMarkers, onSetMarkersRef: onSetInitialMarkersRef, ref: editorRef, mode: props.contentMarkupLanguage === renderer_1.MarkupToHtml.MARKUP_LANGUAGE_HTML ? 'xml' : 'joplin-markdown', codeMirrorTheme: styles.editor.codeMirrorTheme, style: styles.editor, readOnly: props.disabled || props.visiblePanes.indexOf('editor') < 0, autoMatchBraces: matchBracesOptions, keyMap: props.keyboardMode, plugins: props.plugins, onChange: codeMirror_change, onScroll: editor_scroll, onEditorPaste: onEditorPaste, isSafeMode: props.isSafeMode, onResize: editor_resize, onUpdate: editor_update })));
    }
    function renderViewer() {
        return (React.createElement("div", { className: 'viewer' },
            React.createElement(NoteTextViewer_1.default, { ref: webviewRef, themeId: props.themeId, viewerStyle: styles.viewer, onIpcMessage: webview_ipcMessage, onDomReady: webview_domReady, contentMaxWidth: props.contentMaxWidth })));
    }
    const editorViewerRow = (React.createElement("div", { className: [
            'note-editor-viewer-row',
            props.visiblePanes.includes('editor') ? '-show-editor' : '',
            props.visiblePanes.includes('viewer') ? '-show-viewer' : '',
        ].join(' ') },
        renderEditor(),
        renderViewer()));
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    return (React.createElement(ErrorBoundary_1.default, { message: "The text editor encountered a fatal error and could not continue. The error might be due to a plugin, so please try to disable some of them and try again." },
        React.createElement("div", { style: styles.root, ref: setEditorRoot },
            React.createElement("div", { style: styles.rowToolbar },
                React.createElement(Toolbar_1.default, { themeId: props.themeId, windowId: windowId }),
                props.noteToolbar),
            editorViewerRow)));
}
exports.default = (0, react_1.forwardRef)(CodeMirror);
//# sourceMappingURL=CodeMirror.js.map