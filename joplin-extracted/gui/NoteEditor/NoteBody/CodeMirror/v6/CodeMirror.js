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
const NoteTextViewer_1 = __importDefault(require("../../../../NoteTextViewer"));
const Editor_1 = __importDefault(require("./Editor"));
const usePluginServiceRegistration_1 = __importDefault(require("../../../utils/usePluginServiceRegistration"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../../../services/bridge"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const electron_1 = require("electron");
const registry_1 = require("@joplin/lib/registry");
const ErrorBoundary_1 = __importDefault(require("../../../../ErrorBoundary"));
const types_2 = require("@joplin/editor/types");
const useStyles_1 = __importDefault(require("../utils/useStyles"));
const events_1 = require("@joplin/editor/events");
const useScrollHandler_1 = __importDefault(require("../utils/useScrollHandler"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const useEditorCommands_1 = __importDefault(require("./useEditorCommands"));
const useContextMenu_1 = __importDefault(require("../utils/useContextMenu"));
const useWebviewIpcMessage_1 = __importDefault(require("../utils/useWebviewIpcMessage"));
const Toolbar_1 = __importDefault(require("../Toolbar"));
const useEditorSearchHandler_1 = __importDefault(require("../utils/useEditorSearchHandler"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const useRefocusOnVisiblePaneChange_1 = __importDefault(require("./utils/useRefocusOnVisiblePaneChange"));
const NewWindowOrIFrame_1 = require("../../../../NewWindowOrIFrame");
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const useSyncEditorValue_1 = __importDefault(require("./utils/useSyncEditorValue"));
const types_3 = require("@joplin/renderer/types");
const useEditorSettings_1 = __importDefault(require("./utils/useEditorSettings"));
const logger = Logger_1.default.create('CodeMirror6');
const logDebug = (message) => logger.debug(message);
function defaultRenderedBody() {
    return {
        html: '',
        pluginAssets: [],
    };
}
function markupRenderOptions(override = null) {
    return Object.assign({}, override);
}
const CodeMirror = (props, ref) => {
    var _a;
    const styles = (0, useStyles_1.default)(props);
    const [renderedBody, setRenderedBody] = (0, react_1.useState)(defaultRenderedBody()); // Viewer content
    const [renderedBodyContentKey, setRenderedBodyContentKey] = (0, react_1.useState)(null);
    const [webviewReady, setWebviewReady] = (0, react_1.useState)(false);
    const editorRef = (0, react_1.useRef)(null);
    const rootRef = (0, react_1.useRef)(null);
    const webviewRef = (0, react_1.useRef)(null);
    const props_onChangeRef = (0, react_1.useRef)(null);
    props_onChangeRef.current = props.onChange;
    const [selectionRange, setSelectionRange] = (0, react_1.useState)({ from: 0, to: 0 });
    const { resetScroll, editor_scroll, setEditorPercentScroll, setViewerPercentScroll, getLineScrollPercent, } = (0, useScrollHandler_1.default)(editorRef, webviewRef, props.onScroll);
    (0, usePluginServiceRegistration_1.default)(ref);
    const codeMirror_change = (0, react_1.useCallback)((newBody) => {
        if (newBody !== props.content) {
            props_onChangeRef.current({ changeId: null, content: newBody });
        }
    }, [props.content]);
    const onEditorPaste = (0, react_1.useCallback)(async (event = null) => {
        const resourceMds = await (0, resourceHandling_1.getResourcesFromPasteEvent)(event);
        if (!resourceMds.length)
            return;
        if (editorRef.current) {
            editorRef.current.insertText(resourceMds.join('\n'), types_2.UserEventSource.Paste);
        }
    }, []);
    const editorCutText = (0, react_1.useCallback)(() => {
        if (editorRef.current) {
            editorRef.current.cutText(text => electron_1.clipboard.writeText(text));
        }
    }, []);
    const editorCopyText = (0, react_1.useCallback)(() => {
        if (editorRef.current) {
            editorRef.current.copyText(text => electron_1.clipboard.writeText(text));
        }
    }, []);
    const editorPasteText = (0, react_1.useCallback)(async () => {
        if (editorRef.current) {
            const pastedText = electron_1.clipboard.readText();
            const resourceMd = (0, resourceHandling_1.plainTextLooksLikeAffinityImageData)(pastedText) ? await (0, resourceHandling_1.getResourceFromClipboardImage)() : null;
            const modifiedMd = resourceMd || await Note_1.default.replaceResourceExternalToInternalLinks(pastedText, { useAbsolutePaths: true });
            editorRef.current.insertText(modifiedMd, types_2.UserEventSource.Paste);
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
    const commands = (0, useEditorCommands_1.default)({
        webviewRef,
        editorRef,
        selectionRange,
        editorCopyText, editorCutText, editorPaste,
        editorContent: props.content,
        visiblePanes: props.visiblePanes,
        contentMarkupLanguage: props.contentMarkupLanguage,
    });
    (0, react_1.useImperativeHandle)(ref, () => {
        return {
            content: () => props.content,
            resetScroll: () => {
                resetScroll();
            },
            scrollTo: (options) => {
                var _a;
                if (options.type === types_1.ScrollOptionTypes.Hash) {
                    const hash = options.value;
                    (_a = webviewRef.current) === null || _a === void 0 ? void 0 : _a.send('scrollToHash', hash);
                    editorRef.current.jumpToHash(hash);
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
            supportsCommand: (name) => {
                if (name === 'search' && !props.visiblePanes.includes('editor')) {
                    return false;
                }
                return name in commands || editorRef.current.supportsCommand(name);
            },
            execCommand: async (cmd) => {
                if (!editorRef.current)
                    return false;
                logger.debug('execCommand', cmd);
                let commandOutput = null;
                if (cmd.name in commands) {
                    commandOutput = commands[cmd.name](cmd.value);
                }
                else if (editorRef.current.supportsCommand(cmd.name)) {
                    commandOutput = editorRef.current.execCommand(cmd.name);
                }
                else if (editorRef.current.supportsJoplinCommand(cmd.name)) {
                    commandOutput = editorRef.current.execJoplinCommand(cmd.name);
                }
                else {
                    registry_1.reg.logger().warn('CodeMirror: unsupported Joplin command: ', cmd);
                }
                return commandOutput;
            },
        };
    }, [props.content, props.visiblePanes, commands, resetScroll, setEditorPercentScroll, setViewerPercentScroll]);
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
                // Always using useCustomPdfViewer for now, we can add a new setting for it in future if we need to.
                useCustomPdfViewer: props.useCustomPdfViewer,
                noteId: props.noteId,
                vendorDir: (0, bridge_1.default)().vendorDir(),
                globalSettings: (0, types_3.getGlobalSettings)(Setting_1.default),
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
    }, [
        props.content, props.contentKey, renderedBodyContentKey, props.contentMarkupLanguage,
        props.visiblePanes, props.resourceInfos, props.markupToHtml, props.contentMaxWidth,
        props.noteId, props.useCustomPdfViewer, props.showNoteLinkIcon,
    ]);
    (0, react_1.useEffect)(() => {
        const listener = (event) => {
            var _a;
            (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.onResourceChanged(event.id);
        };
        eventManager_1.default.on(eventManager_1.EventName.ResourceChange, listener);
        return () => {
            eventManager_1.default.off(eventManager_1.EventName.ResourceChange, listener);
        };
    }, [props.resourceInfos]);
    (0, react_1.useEffect)(() => {
        if (!webviewReady)
            return;
        let lineCount = 0;
        if (editorRef.current) {
            lineCount = editorRef.current.editor.state.doc.lines;
        }
        const options = {
            pluginAssets: renderedBody.pluginAssets,
            downloadResources: Setting_1.default.value('sync.resourceDownloadMode'),
            markupLineCount: lineCount,
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
    }, [renderedBody, webviewReady, getLineScrollPercent, setEditorPercentScroll]);
    (0, useRefocusOnVisiblePaneChange_1.default)({ editorRef, webviewRef, visiblePanes: props.visiblePanes });
    // Stop media playing in the viewer once it's hidden - https://github.com/laurent22/joplin/issues/15278
    const viewerVisible = props.visiblePanes.includes('viewer');
    (0, react_1.useEffect)(() => {
        var _a;
        if (!viewerVisible) {
            (_a = webviewRef.current) === null || _a === void 0 ? void 0 : _a.stopMediaPlayback();
        }
    }, [viewerVisible]);
    (0, useEditorSearchHandler_1.default)({
        setLocalSearchResultCount: props.setLocalSearchResultCount,
        searchMarkers: props.searchMarkers,
        webviewRef,
        editorRef,
        noteContent: props.content,
        renderedBody,
        showEditorMarkers: !props.useLocalSearch,
    });
    (0, useContextMenu_1.default)({
        plugins: props.plugins,
        dispatch: props.dispatch,
        editorCutText, editorCopyText, editorPaste,
        editorRef,
        editorClassName: 'cm-editor',
        containerRef: rootRef,
    });
    const lastSearchState = (0, react_1.useRef)(null);
    const onEditorEvent = (0, react_1.useCallback)((event) => {
        var _a, _b;
        if (event.kind === events_1.EditorEventType.Scroll) {
            editor_scroll();
        }
        else if (event.kind === events_1.EditorEventType.Change) {
            codeMirror_change(event.value);
        }
        else if (event.kind === events_1.EditorEventType.SelectionRangeChange) {
            props.onCursorMotion({ markdown: event.from });
            setSelectionRange({ from: event.from, to: event.to });
        }
        else if (event.kind === events_1.EditorEventType.UpdateSearchDialog) {
            if (((_a = lastSearchState.current) === null || _a === void 0 ? void 0 : _a.searchText) !== event.searchState.searchText) {
                props.setLocalSearch(event.searchState.searchText);
            }
            if (((_b = lastSearchState.current) === null || _b === void 0 ? void 0 : _b.dialogVisible) !== event.searchState.dialogVisible) {
                props.setShowLocalSearch(event.searchState.dialogVisible);
            }
            lastSearchState.current = event.searchState;
        }
        else if (event.kind === events_1.EditorEventType.FollowLink) {
            void CommandService_1.default.instance().execute('openItem', event.link);
        }
    }, [editor_scroll, codeMirror_change, props.setLocalSearch, props.setShowLocalSearch, props.onCursorMotion]);
    const onSelectPastBeginning = (0, react_1.useCallback)(() => {
        void CommandService_1.default.instance().execute('focusElement', 'noteTitle');
    }, []);
    const initialCursorLocationRef = (0, react_1.useRef)(0);
    initialCursorLocationRef.current = (_a = props.initialCursorLocation.markdown) !== null && _a !== void 0 ? _a : 0;
    (0, useSyncEditorValue_1.default)({
        content: props.content,
        visiblePanes: props.visiblePanes,
        onMessage: props.onMessage,
        editorRef,
        noteId: props.noteId,
        initialCursorLocationRef,
    });
    const settings = (0, useEditorSettings_1.default)({
        baseTheme: styles.globalTheme,
        contentMarkupLanguage: props.contentMarkupLanguage,
        disabled: props.disabled,
        keyboardMode: props.keyboardMode,
        tabMovesFocus: props.tabMovesFocus,
    });
    const renderEditor = () => {
        return (React.createElement("div", { className: 'editor' },
            React.createElement(Editor_1.default, { style: styles.editor, initialText: props.content, initialSelectionRef: initialCursorLocationRef, initialNoteId: props.noteId, ref: editorRef, settings: settings, pluginStates: props.plugins, onPasteFile: null, onEvent: onEditorEvent, onLogMessage: logDebug, onEditorPaste: onEditorPaste, onSelectPastBeginning: onSelectPastBeginning, externalSearch: props.searchMarkers, useLocalSearch: props.useLocalSearch, onLocalize: locale_1._ })));
    };
    const renderViewer = () => {
        return (React.createElement("div", { className: 'viewer' },
            React.createElement(NoteTextViewer_1.default, { ref: webviewRef, themeId: props.themeId, viewerStyle: styles.viewer, onIpcMessage: webview_ipcMessage, onDomReady: webview_domReady, contentMaxWidth: props.contentMaxWidth })));
    };
    const editorViewerRow = (React.createElement("div", { className: [
            'note-editor-viewer-row',
            props.visiblePanes.includes('editor') ? '-show-editor' : '',
            props.visiblePanes.includes('viewer') ? '-show-viewer' : '',
        ].join(' ') },
        renderEditor(),
        renderViewer()));
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    return (React.createElement(ErrorBoundary_1.default, { message: "The text editor encountered a fatal error and could not continue. The error might be due to a plugin, so please try to disable some of them and try again." },
        React.createElement("div", { style: styles.root, ref: rootRef },
            React.createElement("div", { style: styles.rowToolbar },
                React.createElement(Toolbar_1.default, { themeId: props.themeId, windowId: windowId }),
                props.noteToolbar),
            editorViewerRow)));
};
exports.default = (0, react_1.forwardRef)(CodeMirror);
//# sourceMappingURL=CodeMirror.js.map