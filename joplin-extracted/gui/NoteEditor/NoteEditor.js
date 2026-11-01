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
const TinyMCE_1 = __importDefault(require("./NoteBody/TinyMCE/TinyMCE"));
const react_redux_1 = require("react-redux");
const MultiNoteActions_1 = __importDefault(require("../MultiNoteActions"));
const utils_1 = require("./utils");
const useSearchMarkers_1 = __importDefault(require("./utils/useSearchMarkers"));
const useNoteSearchBar_1 = __importDefault(require("./utils/useNoteSearchBar"));
const useMessageHandler_1 = __importDefault(require("./utils/useMessageHandler"));
const useWindowCommandHandler_1 = __importDefault(require("./utils/useWindowCommandHandler"));
const useDropHandler_1 = __importDefault(require("./utils/useDropHandler"));
const useMarkupToHtml_1 = __importDefault(require("../hooks/useMarkupToHtml"));
const useFormNote_1 = __importDefault(require("./utils/useFormNote"));
const useEffectiveNoteId_1 = __importDefault(require("./utils/useEffectiveNoteId"));
const useFolder_1 = __importDefault(require("./utils/useFolder"));
const styles_1 = __importDefault(require("./styles"));
const types_1 = require("./utils/types");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const Button_1 = __importStar(require("../Button/Button"));
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const ToolbarButtonUtils_1 = __importDefault(require("@joplin/lib/services/commands/ToolbarButtonUtils"));
const locale_1 = require("@joplin/lib/locale");
const NoteTitleBar_1 = __importDefault(require("./NoteTitle/NoteTitleBar"));
const markupLanguageUtils_1 = __importDefault(require("@joplin/lib/utils/markupLanguageUtils"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const stateToWhenClauseContext_1 = __importDefault(require("../../services/commands/stateToWhenClauseContext"));
const ExternalEditWatcher_1 = __importDefault(require("@joplin/lib/services/ExternalEditWatcher"));
const readOnly_1 = require("@joplin/lib/models/utils/readOnly");
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const syncInfoUtils_1 = require("@joplin/lib/services/synchronizer/syncInfoUtils");
const NoteLockPanel_1 = __importDefault(require("./NoteLockPanel/NoteLockPanel"));
const theme_1 = require("@joplin/lib/theme");
const string_utils_1 = require("@joplin/lib/string-utils");
const NoteSearchBar_1 = __importDefault(require("../NoteSearchBar"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const NoteRevisionViewer_1 = __importDefault(require("../NoteRevisionViewer"));
const reducer_1 = require("@joplin/lib/services/share/reducer");
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const BaseItem_1 = __importDefault(require("@joplin/lib/models/BaseItem"));
const errors_1 = require("@joplin/lib/errors");
const ItemChange_1 = __importDefault(require("@joplin/lib/models/ItemChange"));
const PlainEditor_1 = __importDefault(require("./NoteBody/PlainEditor/PlainEditor"));
const CodeMirror_1 = __importDefault(require("./NoteBody/CodeMirror/v6/CodeMirror"));
const CodeMirror_2 = __importDefault(require("./NoteBody/CodeMirror/v5/CodeMirror"));
const WhiteboardEditor_1 = __importDefault(require("./NoteBody/WhiteboardEditor/WhiteboardEditor"));
const parse_1 = require("@joplin/lib/services/whiteboard/parse");
const contextMenu_1 = require("./utils/contextMenu");
const renderer_1 = require("@joplin/renderer");
const useScrollWhenReadyOptions_1 = __importDefault(require("./utils/useScrollWhenReadyOptions"));
const useScheduleSaveCallbacks_1 = __importDefault(require("./utils/useScheduleSaveCallbacks"));
const WarningBanner_1 = __importDefault(require("./WarningBanner/WarningBanner"));
const UserWebview_1 = __importDefault(require("../../services/plugins/UserWebview"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const usePluginEditorView_1 = __importDefault(require("./utils/usePluginEditorView"));
const reducer_2 = require("@joplin/lib/reducer");
const NewWindowOrIFrame_1 = require("../NewWindowOrIFrame");
const useResourceUnwatcher_1 = __importDefault(require("./utils/useResourceUnwatcher"));
const StatusBar_1 = __importDefault(require("./StatusBar"));
const useVisiblePluginEditorViewIds_1 = __importDefault(require("@joplin/lib/hooks/plugins/useVisiblePluginEditorViewIds"));
const useConnectToEditorPlugin_1 = __importDefault(require("./utils/useConnectToEditorPlugin"));
const getResourceBaseUrl_1 = __importDefault(require("./utils/getResourceBaseUrl"));
const useInitialCursorLocation_1 = __importDefault(require("./utils/useInitialCursorLocation"));
const NotePositionService_1 = __importDefault(require("@joplin/lib/services/NotePositionService"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const debounce = require('debounce');
const logger = Logger_1.default.create('NoteEditor');
const commands = [
    require('./commands/showRevisions'),
];
const toolbarButtonUtils = new ToolbarButtonUtils_1.default(CommandService_1.default.instance());
const onDragOver = event => event.preventDefault();
let editorIdCounter = 0;
function NoteEditorContent(props) {
    var _a;
    const [showRevisions, setShowRevisions] = (0, react_1.useState)(false);
    const [titleHasBeenManuallyChanged, setTitleHasBeenManuallyChanged] = (0, react_1.useState)(false);
    const [isReadOnly, setIsReadOnly] = (0, react_1.useState)(false);
    const [reloadInProgress, setReloadInProgress] = (0, react_1.useState)(false);
    const editorRef = (0, react_1.useRef)(null);
    const titleInputRef = (0, react_1.useRef)(null);
    const isMountedRef = (0, react_1.useRef)(true);
    const noteSearchBarRef = (0, react_1.useRef)(null);
    // Should be constant and unique to this instance of the editor.
    const editorId = (0, react_1.useMemo)(() => {
        return `editor-${editorIdCounter++}`;
    }, []);
    const setFormNoteRef = (0, react_1.useRef)(null);
    const formNoteRef = (0, react_1.useRef)(null);
    const { saveNoteIfWillChange, scheduleSaveNote } = (0, useScheduleSaveCallbacks_1.default)({
        setFormNote: setFormNoteRef, formNote: formNoteRef, dispatch: props.dispatch, editorRef, editorId,
        editorNoteReloadTimeRequest: props.editorNoteReloadTimeRequest,
    });
    const formNote_beforeLoad = (0, react_1.useCallback)(async (event) => {
        var _a;
        await saveNoteIfWillChange(event.formNote);
        // The lock must wait for the pending saves of the note being left: a locked note's save
        // needs the unlocked session to encrypt, so locking first would drop the last edits.
        // The note being left may have no form note at all (unlock or cannot-decrypt overlay).
        if ((0, isNoteLockEnabled_1.default)() && Setting_1.default.value('noteLock.lockOnNoteSwitch')) {
            await ((_a = event.formNote.saveActionQueue) === null || _a === void 0 ? void 0 : _a.waitForAllDone());
            NoteLockSession_1.default.instance().lock();
        }
        setShowRevisions(false);
    }, [saveNoteIfWillChange]);
    const formNote_afterLoad = (0, react_1.useCallback)(async () => {
        setTitleHasBeenManuallyChanged(false);
    }, []);
    const effectiveNoteId = (0, useEffectiveNoteId_1.default)(props);
    const { editorPlugin, editorView } = (0, usePluginEditorView_1.default)(props.plugins);
    const builtInEditorVisible = !editorPlugin;
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    const onDecryptFailedChange = (0, react_1.useCallback)((value) => {
        props.dispatch({ type: 'SET_ACTIVE_NOTE_IS_UNDECRYPTABLE', value, windowId });
    }, [props.dispatch, windowId]);
    const onReloadInProgressChange = (0, react_1.useCallback)((value) => {
        var _a, _b, _c, _d;
        if (value) {
            // TinyMCE edits inside its own document. Blurring only the outer window does
            // not reliably stop input when the editor is in a secondary window.
            (_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.blurEditor) === null || _b === void 0 ? void 0 : _b.call(_a);
            // Blur only the window whose editor is being refreshed. A secondary window
            // can refresh in response to a change saved by the main editor; blurring the
            // global document here would incorrectly interrupt typing in the main window.
            const editorWindowActiveElement = (_d = (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.ownerDocument) === null || _d === void 0 ? void 0 : _d.activeElement;
            if (editorWindowActiveElement) {
                (0, focusHandler_1.blur)('NoteEditor::reloadEditorWindow', editorWindowActiveElement);
            }
        }
        setReloadInProgress(value);
        if (!value) {
            // TinyMCE can report onWillChange before a reload, then have its delayed
            // onChange rejected while the reload is in progress. Since no save is queued
            // in that case, clear the saving status when the reload completes.
            props.dispatch({
                type: 'EDITOR_NOTE_STATUS_REMOVE',
                id: effectiveNoteId,
            });
        }
    }, [effectiveNoteId, props.dispatch]);
    const { formNote, setFormNote, isNewNote, resourceInfos, decryptFailed, loadBlocked } = (0, useFormNote_1.default)({
        noteId: effectiveNoteId,
        isProvisional: props.isProvisional,
        titleInputRef: titleInputRef,
        editorRef: editorRef,
        onBeforeLoad: formNote_beforeLoad,
        onAfterLoad: formNote_afterLoad,
        builtInEditorVisible,
        editorId,
        noteLockSessionUnlocked: props.noteLockSessionUnlocked,
        onDecryptFailedChange,
        onReloadInProgressChange,
        editorNoteReloadTimeRequest: props.editorNoteReloadTimeRequest,
    });
    setFormNoteRef.current = setFormNote;
    formNoteRef.current = Object.assign({}, formNote);
    (0, react_1.useEffect)(() => {
        if (!(0, isNoteLockEnabled_1.default)())
            return () => { };
        // Pending scheduled saves read the lock state from the form note, so it must follow an
        // enable/disable triggered outside the editor (note list menu, another window) immediately.
        const onLockStateChange = (event) => {
            if (formNoteRef.current.id !== event.noteId)
                return;
            // Enabling requires an unlocked session, so capture the key the same way a decrypt
            // does - a pending save can then still encrypt if the session locks before it runs.
            const noteLockKey = event.isLocked && NoteLockSession_1.default.instance().isUnlocked() ? NoteLockSession_1.default.instance().decryptedKey() : null;
            const newFormNote = Object.assign(Object.assign({}, formNoteRef.current), { is_locked: event.isLocked ? 1 : 0, noteLockKey, isDecrypted: event.isLocked });
            setFormNote(newFormNote);
            void scheduleSaveNote(newFormNote);
        };
        eventManager_1.default.on(eventManager_1.EventName.NoteLockNoteStateChange, onLockStateChange);
        return () => {
            eventManager_1.default.off(eventManager_1.EventName.NoteLockNoteStateChange, onLockStateChange);
        };
    }, [setFormNote, scheduleSaveNote]);
    (0, useAsyncEffect_1.default)(async () => {
        var _a;
        if (!(0, isNoteLockEnabled_1.default)() || props.noteLockSessionUnlocked)
            return;
        const lockedFormNote = formNoteRef.current;
        if (!(lockedFormNote === null || lockedFormNote === void 0 ? void 0 : lockedFormNote.is_locked) || !lockedFormNote.hasChanged)
            return;
        // The panel replaces the editor only once the edits are written, so flush them the same way
        // a note switch does before locking.
        await saveNoteIfWillChange(lockedFormNote);
        // The editor dispatches its pending change when it unmounts, which would be saved over the
        // flushed one - clearing the change id makes onFieldChange drop it, as a note switch does.
        setFormNote(prev => (Object.assign(Object.assign({}, prev), { bodyWillChangeId: 0 })));
        await ((_a = lockedFormNote.saveActionQueue) === null || _a === void 0 ? void 0 : _a.waitForAllDone());
    }, [props.noteLockSessionUnlocked, saveNoteIfWillChange]);
    const formNoteFolder = (0, useFolder_1.default)({ folderId: formNote.parent_id });
    const shownEditorViewIds = (0, useVisiblePluginEditorViewIds_1.default)(props.plugins, windowId);
    (0, useConnectToEditorPlugin_1.default)({
        startupPluginsLoaded: props.startupPluginsLoaded,
        setFormNote,
        scheduleSaveNote,
        formNote,
        effectiveNoteId,
        shownEditorViewIds,
        activeEditorView: editorView,
        plugins: props.plugins,
    });
    const { localSearch, onChange: localSearch_change, onNext: localSearch_next, onPrevious: localSearch_previous, onClose: localSearch_close, setResultCount: setLocalSearchResultCount, showLocalSearch, setShowLocalSearch, searchMarkers: localSearchMarkerOptions, } = (0, useNoteSearchBar_1.default)({ noteSearchBarRef });
    // If the note has been modified in another editor, wait for it to be saved
    // before loading it in this editor.
    // const waitingToSaveNote = props.noteId && formNote.id !== props.noteId && props.editorNoteStatuses[props.noteId] === 'saving';
    const styles = (0, styles_1.default)(props);
    const whiteBackgroundNoteRendering = formNote.markup_language === renderer_1.MarkupLanguage.Html;
    const markupToHtml = (0, useMarkupToHtml_1.default)({
        themeId: props.themeId,
        whiteBackgroundNoteRendering,
        customCss: props.customCss,
        plugins: props.plugins,
        scrollbarSize: props.scrollbarSize,
        baseFontFamily: props.viewerFontFamily,
    });
    const allAssets = (0, react_1.useCallback)(async (markupLanguage, options = null) => {
        options = Object.assign({ contentMaxWidthTarget: '' }, options);
        const theme = (0, theme_1.themeStyle)(options.themeId ? options.themeId : props.themeId);
        const markupToHtml = markupLanguageUtils_1.default.newMarkupToHtml(props.plugins, {
            resourceBaseUrl: (0, getResourceBaseUrl_1.default)(),
            customCss: props.customCss,
        });
        return markupToHtml.allAssets(markupLanguage, theme, {
            contentMaxWidth: props.contentMaxWidth,
            contentMaxWidthTarget: options.contentMaxWidthTarget,
            scrollbarSize: props.scrollbarSize,
            baseFontFamily: props.viewerFontFamily,
            whiteBackgroundNoteRendering: options.whiteBackgroundNoteRendering,
        });
    }, [props.plugins, props.themeId, props.scrollbarSize, props.viewerFontFamily, props.customCss, props.contentMaxWidth]);
    const handleProvisionalFlag = (0, react_1.useCallback)(() => {
        if (props.isProvisional) {
            props.dispatch({
                type: 'NOTE_PROVISIONAL_FLAG_CLEAR',
                id: formNote.id,
            });
        }
    }, [props.isProvisional, formNote.id, props.dispatch]);
    const scheduleNoteListResort = (0, react_1.useMemo)(() => {
        return debounce(() => {
            // Although the note list will update automatically, it may take some time. This
            // forces an immediate update.
            props.dispatch({ type: 'NOTE_SORT' });
        }, 100);
    }, [props.dispatch]);
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = props.onTitleChange) === null || _a === void 0 ? void 0 : _a.call(props, formNote.title);
    }, [formNote.title, props.onTitleChange]);
    const onFieldChange = (0, react_1.useCallback)(async (field, value, changeId = 0) => {
        if (reloadInProgress)
            return;
        if (!isMountedRef.current) {
            // When the component is unmounted, various actions can happen which can
            // trigger onChange events, for example the textarea might be cleared.
            // We need to ignore these events, otherwise the note is going to be saved
            // with an invalid body.
            logger.debug('Skipping change event because the component is unmounted');
            return;
        }
        handleProvisionalFlag();
        const change = field === 'body' ? {
            body: value,
        } : {
            title: value,
        };
        const newNote = Object.assign(Object.assign(Object.assign({}, formNote), change), { bodyWillChangeId: 0, bodyChangeId: 0, hasChanged: true });
        if (field === 'title') {
            setTitleHasBeenManuallyChanged(true);
        }
        if (isNewNote && !titleHasBeenManuallyChanged && field === 'body') {
            // TODO: Handle HTML/Markdown format
            newNote.title = Note_1.default.defaultTitle(value);
        }
        if (changeId !== null && field === 'body' && formNote.bodyWillChangeId !== changeId) {
            // Note was changed, but another note was loaded before save - skipping
            // The previously loaded note, that was modified, will be saved via saveNoteIfWillChange()
        }
        else {
            setFormNote(newNote);
            await scheduleSaveNote(newNote);
        }
        if (field === 'title') {
            // Scheduling a resort needs to be:
            // - called after scheduleSaveNote so that the new note title is used for sorting
            // - debounced because many calls to scheduleSaveNote can resolve at once
            scheduleNoteListResort();
        }
    }, [reloadInProgress, handleProvisionalFlag, formNote, setFormNote, isNewNote, titleHasBeenManuallyChanged, scheduleNoteListResort, scheduleSaveNote]);
    const onDrop = (0, useDropHandler_1.default)({ editorRef });
    const onBodyChange = (0, react_1.useCallback)((event) => onFieldChange('body', event.content, event.changeId), [onFieldChange]);
    const onTitleChange = (0, react_1.useCallback)((event) => onFieldChange('title', event.target.value), [onFieldChange]);
    const containerRef = (0, react_1.useRef)(null);
    (0, useWindowCommandHandler_1.default)({
        dispatch: props.dispatch,
        setShowLocalSearch,
        noteSearchBarRef,
        editorRef,
        titleInputRef,
        onBodyChange,
        containerRef,
    });
    // const onTitleKeydown = useCallback((event:any) => {
    // 	const keyCode = event.keyCode;
    // 	if (keyCode === 9) {
    // 		// TAB
    // 		event.preventDefault();
    // 		if (event.shiftKey) {
    // 			CommandService.instance().execute('focusElement', 'noteList');
    // 		} else {
    // 			CommandService.instance().execute('focusElement', 'noteBody');
    // 		}
    // 	}
    // }, [props.dispatch]);
    const shareCache = (0, react_1.useMemo)(() => {
        return (0, reducer_1.parseShareCache)(props.shareCacheSetting);
    }, [props.shareCacheSetting]);
    (0, useAsyncEffect_1.default)(async (event) => {
        if (!formNote.id)
            return;
        try {
            const result = await (0, readOnly_1.itemIsReadOnly)(BaseItem_1.default, BaseModel_1.ModelType.Note, ItemChange_1.default.SOURCE_UNSPECIFIED, formNote.id, props.syncUserId, shareCache);
            if (event.cancelled)
                return;
            setIsReadOnly(result);
        }
        catch (error) {
            if (error.code === errors_1.ErrorCode.NotFound) {
                // Can happen if the note has been deleted but a render is
                // triggered anyway. It can be ignored.
            }
            else {
                throw error;
            }
        }
    }, [formNote.id, props.syncUserId, shareCache]);
    const onBodyWillChange = (0, react_1.useCallback)((event) => {
        handleProvisionalFlag();
        setFormNote(prev => {
            return Object.assign(Object.assign({}, prev), { bodyWillChangeId: event.changeId, hasChanged: true });
        });
        props.dispatch({
            type: 'EDITOR_NOTE_STATUS_SET',
            id: formNote.id,
            status: 'saving',
        });
    }, [formNote, setFormNote, handleProvisionalFlag, props.dispatch]);
    const { scrollWhenReadyRef, clearScrollWhenReady } = (0, useScrollWhenReadyOptions_1.default)({
        noteId: formNote.id,
        selectedNoteHash: props.selectedNoteHash,
        editorRef,
        editorName: props.bodyEditor,
    });
    const onMessage = (0, useMessageHandler_1.default)(scrollWhenReadyRef, clearScrollWhenReady, windowId, editorRef, setLocalSearchResultCount, props.dispatch, formNote, utils_1.htmlToMarkdown, markupToHtml);
    (0, useResourceUnwatcher_1.default)({ noteId: formNote.id, windowId });
    const externalEditWatcher_noteChange = (0, react_1.useCallback)((event) => {
        if (event.id === formNote.id) {
            const newFormNote = Object.assign(Object.assign({}, formNote), { title: event.note.title, body: event.note.body });
            setFormNote(newFormNote);
        }
    }, [formNote, setFormNote]);
    const onNotePropertyChange = (0, react_1.useCallback)((event) => {
        setFormNote(formNote => {
            if (formNote.id !== event.note.id)
                return formNote;
            const newFormNote = Object.assign({}, formNote);
            const noteAsRecord = event.note;
            for (const key in noteAsRecord) {
                if (key === 'id')
                    continue;
                newFormNote[key] = noteAsRecord[key];
            }
            return newFormNote;
        });
    }, [setFormNote]);
    (0, react_1.useEffect)(() => {
        eventManager_1.default.on(eventManager_1.EventName.AlarmChange, onNotePropertyChange);
        ExternalEditWatcher_1.default.instance().on('noteChange', externalEditWatcher_noteChange);
        return () => {
            eventManager_1.default.off(eventManager_1.EventName.AlarmChange, onNotePropertyChange);
            ExternalEditWatcher_1.default.instance().off('noteChange', externalEditWatcher_noteChange);
        };
    }, [externalEditWatcher_noteChange, onNotePropertyChange]);
    (0, react_1.useEffect)(() => {
        const dependencies = {
            setShowRevisions,
            isInFocusedDocument: () => {
                var _a, _b;
                return (_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.hasFocus();
            },
        };
        const registeredCommands = CommandService_1.default.instance().componentRegisterCommands(dependencies, commands, true);
        return () => {
            registeredCommands.deregister();
        };
    }, [setShowRevisions]);
    const onScroll = (0, react_1.useCallback)((event) => {
        const noteId = formNoteRef.current.id;
        NotePositionService_1.default.instance().updateScrollPosition(noteId, windowId, event.percent);
    }, [windowId]);
    const onCursorMotion = (0, react_1.useCallback)((location) => {
        const noteId = formNoteRef.current.id;
        NotePositionService_1.default.instance().updateCursorPosition(noteId, windowId, location);
    }, [windowId]);
    function renderNoNotes(rootStyle) {
        const emptyDivStyle = Object.assign({ backgroundColor: 'black', opacity: 0.1 }, rootStyle);
        return React.createElement("div", { style: emptyDivStyle, ref: containerRef });
    }
    const searchMarkers = (0, useSearchMarkers_1.default)({
        showLocalSearch,
        localSearchMarkerOptions,
        noteId: props.noteId,
        searchResults: props.searchResults,
        searchId: props.selectedSearchId,
        searches: props.searches,
        highlightedWords: props.highlightedWords,
        noteTitle: formNote.title,
    });
    const initialCursorLocation = (0, useInitialCursorLocation_1.default)({
        noteId: props.noteId,
    });
    const markupLanguage = formNote.markup_language;
    const editorProps = {
        ref: editorRef,
        contentKey: formNote.id,
        style: styles.tinyMCE,
        whiteBackgroundNoteRendering,
        onChange: onBodyChange,
        onWillChange: onBodyWillChange,
        onMessage: onMessage,
        content: formNote.body,
        contentMarkupLanguage: markupLanguage,
        contentOriginalCss: formNote.originalCss,
        editorNoteReloadTimeRequest: props.editorNoteReloadTimeRequest,
        initialCursorLocation,
        resourceInfos: resourceInfos,
        resourceDirectory: Setting_1.default.value('resourceDir'),
        htmlToMarkdown: utils_1.htmlToMarkdown,
        markupToHtml: markupToHtml,
        allAssets: allAssets,
        disabled: isReadOnly || reloadInProgress,
        themeId: props.themeId,
        dispatch: props.dispatch,
        noteToolbar: null,
        onScroll: onScroll,
        onCursorMotion,
        setLocalSearchResultCount: setLocalSearchResultCount,
        setLocalSearch: localSearch_change,
        setShowLocalSearch,
        useLocalSearch: showLocalSearch,
        searchMarkers: searchMarkers,
        visiblePanes: props.noteVisiblePanes || ['editor', 'viewer'],
        keyboardMode: Setting_1.default.value('editor.keyboardMode'),
        enableTextPatterns: Setting_1.default.value('editor.enableTextPatterns'),
        tabMovesFocus: props.tabMovesFocus,
        locale: Setting_1.default.value('locale'),
        onDrop: onDrop,
        noteToolbarButtonInfos: props.toolbarButtonInfos,
        plugins: props.plugins,
        // KaTeX isn't supported in HTML notes
        mathEnabled: markupLanguage === renderer_1.MarkupLanguage.Markdown && Setting_1.default.value('markdown.plugin.katex'),
        fontSize: Setting_1.default.value('style.editor.fontSize'),
        contentMaxWidth: props.contentMaxWidth,
        scrollbarSize: props.scrollbarSize,
        baseFontFamily: props.viewerFontFamily,
        isSafeMode: props.isSafeMode,
        useCustomPdfViewer: props.useCustomPdfViewer,
        // We need it to identify the context for which media is rendered.
        // It is currently used to remember pdf scroll position for each attachments of each note uniquely.
        // Use the form note object to ensure the editor is associated with the loaded form note until onBeforeLoad
        // has flushed any pending changes from it.
        noteId: formNote.id,
        watchedNoteFiles: props.watchedNoteFiles,
        enableHtmlToMarkdownBanner: props.enableHtmlToMarkdownBanner,
        showNoteLinkIcon: props.showNoteLinkIcon,
    };
    let editor = null;
    const noteHasWhiteboardFence = markupLanguage === renderer_1.MarkupLanguage.Markdown
        && (0, parse_1.hasWhiteboardFence)(formNote.body);
    const useWhiteboardEditor = builtInEditorVisible
        && noteHasWhiteboardFence
        && !((_a = props.whiteboardForceMarkdown) === null || _a === void 0 ? void 0 : _a[formNote.id]);
    // Mirror "active note is a whiteboard" to redux so the NoteToolbar can
    // show the editor toggle. We can't compute this from the redux note list
    // because note bodies aren't in the preview fields.
    (0, react_1.useEffect)(() => {
        props.dispatch({ type: 'WHITEBOARD_ACTIVE_NOTE_SET', value: noteHasWhiteboardFence, windowId });
    }, [noteHasWhiteboardFence, windowId, props.dispatch]);
    if (useWhiteboardEditor) {
        editor = React.createElement(WhiteboardEditor_1.default, Object.assign({ key: formNote.id }, editorProps));
    }
    else if (builtInEditorVisible) {
        if (props.bodyEditor === 'TinyMCE') {
            editor = React.createElement(TinyMCE_1.default, Object.assign({}, editorProps));
        }
        else if (props.bodyEditor === 'PlainText') {
            editor = React.createElement(PlainEditor_1.default, Object.assign({}, editorProps));
        }
        else if (props.bodyEditor === 'CodeMirror5') {
            editor = React.createElement(CodeMirror_2.default, Object.assign({}, editorProps));
        }
        else if (props.bodyEditor === 'CodeMirror6') {
            editor = React.createElement(CodeMirror_1.default, Object.assign({}, editorProps));
        }
        else {
            throw new Error(`Invalid editor: ${props.bodyEditor}`);
        }
    }
    const noteRevisionViewer_onBack = (0, react_1.useCallback)(() => {
        setShowRevisions(false);
    }, []);
    const onBannerConvertItToMarkdown = (0, react_1.useCallback)(async (event) => {
        event.preventDefault();
        if (!props.selectedNoteIds || props.selectedNoteIds.length === 0)
            return;
        await CommandService_1.default.instance().execute('convertNoteToMarkdown', props.selectedNoteIds[0]);
    }, [props.selectedNoteIds]);
    const onHideBannerConvertItToMarkdown = async (event) => {
        event.preventDefault();
        Setting_1.default.setValue('editor.enableHtmlToMarkdownBanner', false);
    };
    const onBannerResourceClick = (0, react_1.useCallback)(async (event) => {
        event.preventDefault();
        const resourceId = event.currentTarget.getAttribute('data-resource-id');
        await (0, contextMenu_1.openItemById)(resourceId, props.dispatch);
    }, [props.dispatch]);
    if (showRevisions) {
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const revStyle = {
            // ...props.style,
            display: 'inline-flex',
            padding: theme.margin,
            verticalAlign: 'top',
            boxSizing: 'border-box',
            flex: 1,
            overflowX: 'scroll',
        };
        return (React.createElement("div", { style: revStyle, ref: containerRef },
            React.createElement(NoteRevisionViewer_1.default, { customCss: props.customCss, noteId: formNote.id, onBack: noteRevisionViewer_onBack })));
    }
    if (props.selectedNoteIds.length > 1) {
        return React.createElement(MultiNoteActions_1.default, { themeId: props.themeId, selectedNoteIds: props.selectedNoteIds, notes: props.notes, dispatch: props.dispatch, watchedNoteFiles: props.watchedNoteFiles, plugins: props.plugins, inConflictFolder: props.selectedFolderId === Folder_1.default.conflictFolderId(), customCss: props.customCss });
    }
    function renderSearchBar() {
        if (!showLocalSearch)
            return false;
        const theme = (0, theme_1.themeStyle)(props.themeId);
        return (React.createElement(NoteSearchBar_1.default, { ref: noteSearchBarRef, themeId: props.themeId, style: {
                display: 'flex',
                height: 35,
                borderTop: `1px solid ${theme.dividerColor}`,
            }, query: localSearch.query, searching: localSearch.searching, resultCount: localSearch.resultCount, selectedIndex: localSearch.selectedIndex, onChange: localSearch_change, onNext: localSearch_next, onPrevious: localSearch_previous, onClose: localSearch_close, visiblePanes: props.noteVisiblePanes, editorType: props.bodyEditor }));
    }
    function renderResourceWatchingNotification() {
        if (!Object.keys(props.watchedResources).length)
            return null;
        const resourceTitles = Object.keys(props.watchedResources).map(id => props.watchedResources[id].title);
        return (React.createElement("div", { style: styles.resourceWatchBanner },
            React.createElement("p", { style: styles.resourceWatchBannerLine },
                (0, locale_1._)('The following attachments are being watched for changes:'),
                " ",
                React.createElement("strong", null, resourceTitles.join(', '))),
            React.createElement("p", { style: Object.assign(Object.assign({}, styles.resourceWatchBannerLine), { marginBottom: 0 }) }, (0, locale_1._)('The attachments will no longer be watched when you switch to a different note.'))));
    }
    const renderResourceInSearchResultsNotification = () => {
        const resourceResults = props.searchResults.filter(r => r.id === props.noteId && r.item_type === BaseModel_1.ModelType.Resource);
        if (!resourceResults.length)
            return null;
        const renderResource = (id, title) => {
            return React.createElement("li", { key: id },
                React.createElement("a", { "data-resource-id": id, onClick: onBannerResourceClick, href: "#" }, title));
        };
        return (React.createElement("div", { style: styles.resourceWatchBanner },
            React.createElement("p", { style: styles.resourceWatchBannerLine }, (0, locale_1._n)('The following attachment matches your search query:', 'The following attachments match your search query:', resourceResults.length)),
            React.createElement("ul", null, resourceResults.map(r => renderResource(r.item_id, r.title)))));
    };
    function renderSearchInfo() {
        const theme = (0, theme_1.themeStyle)(props.themeId);
        if (formNoteFolder && ['Search', 'Tag', 'SmartFilter'].includes(props.notesParentType)) {
            return (React.createElement("div", { style: { paddingTop: 10, paddingBottom: 10, paddingLeft: theme.editorPaddingLeft } },
                React.createElement(Button_1.default, { iconName: "icon-notebooks", level: Button_1.ButtonLevel.Primary, title: (0, locale_1._)('In: %s', (0, string_utils_1.substrWithEllipsis)(formNoteFolder.title, 0, 100)), onClick: () => {
                        props.dispatch({
                            type: 'FOLDER_AND_NOTE_SELECT',
                            folderId: formNoteFolder.id,
                            noteId: formNote.id,
                        });
                    } }),
                React.createElement("div", { style: { flex: 1 } })));
        }
        else {
            return null;
        }
    }
    const renderPluginEditor = () => {
        var _a, _b;
        if (!editorPlugin)
            return null;
        const html = (_b = (_a = props.pluginHtmlContents[editorPlugin.id]) === null || _a === void 0 ? void 0 : _a[editorView.id]) !== null && _b !== void 0 ? _b : '';
        return React.createElement(UserWebview_1.default, { key: editorView.id, viewId: editorView.id, themeId: props.themeId, html: html, scripts: editorView.scripts, pluginId: editorPlugin.id, borderBottom: true, fitToContent: false });
    };
    // A locked note has no form note while the session is locked (see loadNoteForForm), so the
    // panel is driven by the note metadata. A loaded form note stays mounted on lock only if it
    // has unsaved changes, so they are not thrown away.
    const lockedNoteMetadata = (0, isNoteLockEnabled_1.default)() && effectiveNoteId ? props.notes.find(n => n.id === effectiveNoteId) : null;
    if (lockedNoteMetadata === null || lockedNoteMetadata === void 0 ? void 0 : lockedNoteMetadata.is_locked) {
        // The session is unlocked but the note content failed to decrypt (e.g. it was encrypted
        // prior to a password reset) - locking the session again shows the regular unlock panel.
        if (decryptFailed && props.noteLockSessionUnlocked) {
            return (React.createElement("div", { style: styles.root, ref: containerRef },
                React.createElement(NoteLockPanel_1.default, { noteTitle: lockedNoteMetadata.title, hasNoteLockKey: props.hasNoteLockKey, dispatch: props.dispatch, undecryptable: true })));
        }
        const formNoteLoaded = formNote.id === effectiveNoteId;
        const showLockPanel = formNoteLoaded
            ? !props.noteLockSessionUnlocked && !formNote.hasChanged
            : !props.noteLockSessionUnlocked || loadBlocked;
        if (showLockPanel) {
            return (React.createElement("div", { style: styles.root, ref: containerRef },
                React.createElement(NoteLockPanel_1.default, { noteTitle: lockedNoteMetadata.title, hasNoteLockKey: props.hasNoteLockKey, dispatch: props.dispatch })));
        }
    }
    if ((!editorPlugin && reloadInProgress) || formNote.encryption_applied || !formNote.id || !effectiveNoteId) {
        return renderNoNotes(styles.root);
    }
    const theme = (0, theme_1.themeStyle)(props.themeId);
    function renderConvertHtmlToMarkdown() {
        if (!props.enableHtmlToMarkdownBanner)
            return null;
        const note = props.notes.find(n => n.id === props.selectedNoteIds[0]);
        if (!note)
            return null;
        if (note.markup_language !== renderer_1.MarkupLanguage.Html)
            return null;
        if ((0, isNoteLockEnabled_1.default)() && note.is_locked && !props.noteLockSessionUnlocked)
            return null;
        return (React.createElement("div", { style: styles.resourceWatchBanner },
            React.createElement("p", { style: styles.resourceWatchBannerLine },
                (0, locale_1._)('This note is in HTML format. Convert it to Markdown to edit it more easily.'),
                "\u00A0",
                React.createElement("a", { href: "#", style: styles.resourceWatchBannerAction, onClick: onBannerConvertItToMarkdown }, `${(0, locale_1._)('Convert it')}`),
                ' / ',
                React.createElement("a", { href: "#", style: styles.resourceWatchBannerAction, onClick: onHideBannerConvertItToMarkdown }, (0, locale_1._)('Don\'t show this message again')))));
    }
    return (React.createElement("div", { style: styles.root, onDragOver: onDragOver, onDrop: onDrop, ref: containerRef },
        React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
            renderConvertHtmlToMarkdown(),
            renderResourceWatchingNotification(),
            renderResourceInSearchResultsNotification(),
            React.createElement(NoteTitleBar_1.default, { titleInputRef: titleInputRef, themeId: props.themeId, isProvisional: props.isProvisional, noteIsTodo: formNote.is_todo, noteTitle: formNote.title, noteUserUpdatedTime: formNote.user_updated_time, onTitleChange: onTitleChange, disabled: isReadOnly || reloadInProgress }),
            renderSearchInfo(),
            React.createElement("div", { style: { display: 'flex', flex: 1, paddingLeft: theme.editorPaddingLeft, maxHeight: '100%', minHeight: '0' } },
                editor,
                renderPluginEditor()),
            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', alignItems: 'center' } }, renderSearchBar()),
            React.createElement(StatusBar_1.default, { noteId: formNote.id, setTagsToolbarButtonInfo: props.setTagsToolbarButtonInfo, selectedNoteTags: props.selectedNoteTags }),
            React.createElement(WarningBanner_1.default, { bodyEditor: props.bodyEditor }))));
}
// Memoized because mapStateToProps runs on every dispatch and SyncInfo parses the cached JSON.
let hasNoteLockKeyCache = null;
const hasNoteLockKey = (syncInfoCache) => {
    if (!hasNoteLockKeyCache || hasNoteLockKeyCache.syncInfoCache !== syncInfoCache) {
        hasNoteLockKeyCache = { syncInfoCache, value: !!new syncInfoUtils_1.SyncInfo(syncInfoCache).noteLockKey };
    }
    return hasNoteLockKeyCache.value;
};
const mapStateToProps = (state, ownProps) => {
    var _a;
    const whenClauseContext = (0, stateToWhenClauseContext_1.default)(state, { windowId: ownProps.windowId });
    const windowState = reducer_2.stateUtils.windowStateById(state, ownProps.windowId);
    const noteId = reducer_2.stateUtils.selectedNoteId(windowState);
    let bodyEditor = windowState.editorCodeView ? types_1.NoteBodyEditorType.CodeMirror6 : types_1.NoteBodyEditorType.TinyMce;
    if (state.settings.isSafeMode) {
        bodyEditor = types_1.NoteBodyEditorType.PlainText;
    }
    else if (windowState.editorCodeView && state.settings['editor.legacyMarkdown']) {
        bodyEditor = types_1.NoteBodyEditorType.CodeMirror5;
    }
    const mainWindowState = reducer_2.stateUtils.windowStateById(state, reducer_2.defaultWindowId);
    return {
        noteId,
        bodyEditor,
        isProvisional: state.provisionalNoteIds.includes(noteId),
        notes: windowState.notes,
        selectedNoteIds: windowState.selectedNoteIds,
        selectedFolderId: windowState.selectedFolderId,
        editorNoteStatuses: state.editorNoteStatuses,
        themeId: state.settings.theme,
        watchedNoteFiles: state.watchedNoteFiles,
        notesParentType: windowState.notesParentType,
        selectedNoteTags: windowState.selectedNoteTags,
        selectedNoteHash: windowState.selectedNoteHash,
        searches: state.searches,
        selectedSearchId: windowState.selectedSearchId,
        customCss: state.customViewerCss,
        noteVisiblePanes: windowState.noteVisiblePanes,
        watchedResources: windowState.watchedResources,
        // For now, only the main window has search UI. Show the same search markers in all
        // windows:
        highlightedWords: mainWindowState.highlightedWords,
        plugins: state.pluginService.plugins,
        pluginHtmlContents: state.pluginService.pluginHtmlContents,
        toolbarButtonInfos: toolbarButtonUtils.commandsToToolbarButtons([
            'historyBackward',
            'historyForward',
            'toggleEditors',
            'toggleExternalEditing',
        ], whenClauseContext),
        setTagsToolbarButtonInfo: toolbarButtonUtils.commandsToToolbarButtons([
            'setTags',
        ], whenClauseContext)[0],
        contentMaxWidth: state.settings['style.editor.contentMaxWidth'],
        scrollbarSize: state.settings['style.scrollbarSize'],
        viewerFontFamily: state.settings['style.viewer.fontFamily'],
        tabMovesFocus: state.settings['editor.tabMovesFocus'],
        isSafeMode: state.settings.isSafeMode,
        useCustomPdfViewer: false,
        syncUserId: state.settings['sync.userId'],
        shareCacheSetting: state.settings['sync.shareCache'],
        searchResults: state.searchResults,
        enableHtmlToMarkdownBanner: state.settings['editor.enableHtmlToMarkdownBanner'],
        enableInEditorRendering: state.settings['editor.inlineRendering'],
        showNoteLinkIcon: state.settings['notes.showNoteLinkIcon'],
        whiteboardForceMarkdown: (_a = windowState.whiteboardForceMarkdown) !== null && _a !== void 0 ? _a : {},
        noteLockSessionUnlocked: state.noteLockSessionUnlocked,
        hasNoteLockKey: hasNoteLockKey(state.settings['syncInfoCache']),
        editorNoteReloadTimeRequest: windowState.windowEditorNoteReloadTimeRequest,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NoteEditorContent);
//# sourceMappingURL=NoteEditor.js.map