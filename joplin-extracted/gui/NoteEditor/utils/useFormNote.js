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
exports.default = useFormNote;
const react_1 = require("react");
const types_1 = require("./types");
const AsyncActionQueue_1 = __importDefault(require("@joplin/lib/AsyncActionQueue"));
const resourceHandling_1 = require("./resourceHandling");
const HtmlToHtml_1 = require("@joplin/renderer/HtmlToHtml");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const usePrevious_1 = __importDefault(require("../../hooks/usePrevious"));
const attachedResources_1 = __importStar(require("@joplin/lib/utils/attachedResources"));
const renderer_1 = require("@joplin/renderer");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const ResourceFetcher_1 = __importDefault(require("@joplin/lib/services/ResourceFetcher"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const DecryptionWorker_1 = __importDefault(require("@joplin/lib/services/DecryptionWorker"));
const useQueuedAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useQueuedAsyncEffect"));
const NoteLockNote_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockNote"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const logger = Logger_1.default.create('useFormNote');
function installResourceChangeHandler(onResourceChangeHandler) {
    ResourceFetcher_1.default.instance().on('downloadComplete', onResourceChangeHandler);
    ResourceFetcher_1.default.instance().on('downloadStarted', onResourceChangeHandler);
    DecryptionWorker_1.default.instance().on('resourceDecrypted', onResourceChangeHandler);
    eventManager_1.default.on(eventManager_1.EventName.ResourceChange, onResourceChangeHandler);
}
function uninstallResourceChangeHandler(onResourceChangeHandler) {
    ResourceFetcher_1.default.instance().off('downloadComplete', onResourceChangeHandler);
    ResourceFetcher_1.default.instance().off('downloadStarted', onResourceChangeHandler);
    DecryptionWorker_1.default.instance().off('resourceDecrypted', onResourceChangeHandler);
    eventManager_1.default.off(eventManager_1.EventName.ResourceChange, onResourceChangeHandler);
}
function resourceInfosChanged(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
        return true;
    for (const id in a) {
        const r1 = a[id];
        const r2 = b[id];
        if (!r2)
            return true;
        if (r1.item.updated_time !== r2.item.updated_time)
            return true;
        if (r1.item.encryption_applied !== r2.item.encryption_applied)
            return true;
        if (r1.item.is_shared !== r2.item.is_shared)
            return true;
        if (r1.localState.fetch_status !== r2.localState.fetch_status)
            return true;
    }
    return false;
}
// While the session is locked, a locked note produces no form note at all - the unlock panel
// takes the editor's place. So no placeholder body exists that a save could write over the note.
const loadNoteForForm = async (noteId) => {
    if ((0, isNoteLockEnabled_1.default)()) {
        const lockState = await Note_1.default.load(noteId, { fields: ['is_locked'] });
        if (lockState && NoteLockNote_1.default.isLocked(lockState)) {
            if (!NoteLockSession_1.default.instance().isUnlocked())
                return { note: null, blocked: true, decryptFailed: false };
            try {
                return { note: await Note_1.default.load(noteId, { useNoteLock: true }), blocked: false, decryptFailed: false };
            }
            catch (error) {
                // Happens when the note was encrypted with a different key, e.g. before a password
                // reset. Fail closed and let the editor show the cannot-decrypt panel.
                logger.warn('Could not decrypt locked note:', noteId, error);
                return { note: null, blocked: false, decryptFailed: true };
            }
        }
    }
    return { note: await Note_1.default.load(noteId), blocked: false, decryptFailed: false };
};
const useRefreshFormNoteOnChange = (formNoteRef, editorId, noteId, initNoteState, clearFormNote, builtInEditorVisible, noteLockSessionUnlocked, setDecryptFailed, setLoadBlocked, onReloadInProgressChange, editorNoteReloadTimeRequest) => {
    // Increasing the value of this counter cancels any ongoing note refreshes and starts
    // a new refresh.
    const [formNoteRefreshRequest, setFormNoteRefreshRequest] = (0, react_1.useState)({ counter: 0, force: false });
    const previousEditorNoteReloadTimeRequestRef = (0, react_1.useRef)(editorNoteReloadTimeRequest);
    const prevBuiltInEditorVisible = (0, usePrevious_1.default)(builtInEditorVisible);
    // Seeded because usePrevious defaults to null, which would read as a session change on mount.
    const prevNoteLockSessionUnlocked = (0, usePrevious_1.default)(noteLockSessionUnlocked, noteLockSessionUnlocked);
    (0, useQueuedAsyncEffect_1.default)(async (event) => {
        if (event.cancelled)
            return;
        if (formNoteRefreshRequest.counter <= 0)
            return;
        const forceRefresh = formNoteRefreshRequest.force;
        if (formNoteRef.current.hasChanged && !forceRefresh) {
            logger.info('Form note changed between scheduling a refresh and the refresh itself. Cancelling the refresh.');
            return;
        }
        logger.info('Sync has finished and note has never been changed - reloading it');
        const loadNote = async () => {
            setDecryptFailed(false);
            const { note: n, blocked, decryptFailed } = await loadNoteForForm(noteId);
            if (event.cancelled || (formNoteRef.current.hasChanged && !forceRefresh))
                return;
            setLoadBlocked(blocked);
            setDecryptFailed(decryptFailed);
            if (blocked || decryptFailed) {
                // The session locked with this note open (or its content stopped decrypting) - drop
                // the decrypted content and let the corresponding panel take over.
                if (formNoteRef.current.id)
                    clearFormNote();
            }
            else {
                // Normally should not happened because if the note has been deleted via sync
                // it would not have been loaded in the editor (due to note selection changing
                // on delete)
                if (!n) {
                    logger.warn('Trying to reload note that has been deleted:', noteId);
                    return;
                }
                await initNoteState(n, false, forceRefresh);
                if (event.cancelled)
                    return;
            }
            setFormNoteRefreshRequest(oldValue => {
                // If a new refresh was scheduled between initNoteState
                // and now:
                if (oldValue.counter !== formNoteRefreshRequest.counter) {
                    return oldValue;
                }
                // A refresh is no longer scheduled
                return { counter: 0, force: false };
            });
        };
        try {
            await loadNote();
        }
        finally {
            if (forceRefresh && !event.cancelled)
                onReloadInProgressChange(false);
        }
    }, [formNoteRefreshRequest, noteId, editorId, initNoteState, clearFormNote, setDecryptFailed, onReloadInProgressChange]);
    const refreshFormNote = (0, react_1.useCallback)((force = false) => {
        // Increase the counter to cancel any ongoing refresh attempts
        // and start a new one.
        if (force)
            onReloadInProgressChange(true);
        setFormNoteRefreshRequest(previous => ({ counter: previous.counter + 1, force: previous.force || force }));
    }, [onReloadInProgressChange]);
    (0, react_1.useEffect)(() => {
        if (editorNoteReloadTimeRequest === previousEditorNoteReloadTimeRequestRef.current)
            return;
        previousEditorNoteReloadTimeRequestRef.current = editorNoteReloadTimeRequest;
        refreshFormNote(true);
    }, [editorNoteReloadTimeRequest, refreshFormNote]);
    // When switching from the plugin editor to the built-in editor, we refresh the note since the
    // plugin may have modified it via the data API.
    (0, react_1.useEffect)(() => {
        if (prevBuiltInEditorVisible !== builtInEditorVisible && builtInEditorVisible) {
            refreshFormNote();
        }
    }, [builtInEditorVisible, prevBuiltInEditorVisible, refreshFormNote]);
    // Unlocking loads the note the panel was blocking (the form is then empty), locking must drop
    // a locked note's plaintext - reload to recompute.
    (0, react_1.useEffect)(() => {
        if ((0, isNoteLockEnabled_1.default)() && prevNoteLockSessionUnlocked !== noteLockSessionUnlocked && (formNoteRef.current.is_locked || formNoteRef.current.id !== noteId)) {
            refreshFormNote();
        }
    }, [noteLockSessionUnlocked, prevNoteLockSessionUnlocked, noteId, formNoteRef, refreshFormNote]);
    (0, react_1.useEffect)(() => {
        if (!noteId)
            return () => { };
        let cancelled = false;
        const listener = ({ itemId, changeId }) => {
            // If this change came from the current editor, it should already be
            // handled by calls to `setFormNote`. If events from the current editor
            // aren't ignored, most user-activated note changes (e.g. a keypress)
            // cause the note to refresh. (Undesired refreshes can cause the cursor to jump).
            const isExternalChange = !(changeId !== null && changeId !== void 0 ? changeId : 'unknown').endsWith(editorId);
            if (itemId === noteId && !cancelled && isExternalChange) {
                if (formNoteRef.current.hasChanged)
                    return;
                refreshFormNote();
            }
        };
        eventManager_1.default.on(eventManager_1.EventName.ItemChange, listener);
        return () => {
            eventManager_1.default.off(eventManager_1.EventName.ItemChange, listener);
            cancelled = true;
        };
    }, [formNoteRef, noteId, editorId, refreshFormNote]);
};
function useFormNote(dependencies) {
    var _a, _b;
    const { noteId, isProvisional, titleInputRef, editorRef, onBeforeLoad, onAfterLoad, builtInEditorVisible, editorId, noteLockSessionUnlocked, onDecryptFailedChange, } = dependencies;
    const onReloadInProgressChange = (_a = dependencies.onReloadInProgressChange) !== null && _a !== void 0 ? _a : (() => { });
    const editorNoteReloadTimeRequest = (_b = dependencies.editorNoteReloadTimeRequest) !== null && _b !== void 0 ? _b : 0;
    const [formNote, setFormNote] = (0, react_1.useState)((0, types_1.defaultFormNote)());
    const [isNewNote, setIsNewNote] = (0, react_1.useState)(false);
    // Keyed by note id so a failure can never carry over to another note the user switches to.
    const [decryptFailedId, setDecryptFailedId] = (0, react_1.useState)(null);
    const setDecryptFailed = (0, react_1.useCallback)((value) => {
        setDecryptFailedId(value ? noteId : null);
        onDecryptFailedChange(value);
    }, [noteId, onDecryptFailedChange]);
    const [loadBlockedId, setLoadBlockedId] = (0, react_1.useState)(null);
    const setLoadBlocked = (0, react_1.useCallback)((value) => setLoadBlockedId(value ? noteId : null), [noteId]);
    const previousNoteId = (0, usePrevious_1.default)(formNote.id);
    const [resourceInfos, setResourceInfos] = (0, react_1.useState)({});
    const formNoteRef = (0, react_1.useRef)(formNote);
    formNoteRef.current = formNote;
    const initNoteState = (0, react_1.useCallback)(async (n, isNewNote, force = false) => {
        var _a;
        let noteLockKey = null;
        if ((0, isNoteLockEnabled_1.default)() && NoteLockNote_1.default.isLocked(n)) {
            // The session can lock between the gated load and here (e.g. lock-on-switch) - drop
            // the load rather than show plaintext that pending saves could no longer encrypt.
            if (!NoteLockSession_1.default.instance().isUnlocked())
                return null;
            // Capture the key with the plaintext so pending saves can re-encrypt even after
            // the session locks.
            noteLockKey = NoteLockSession_1.default.instance().decryptedKey();
        }
        let originalCss = '';
        if (n.markup_language === renderer_1.MarkupToHtml.MARKUP_LANGUAGE_HTML) {
            const splitted = (0, HtmlToHtml_1.splitHtml)(n.body);
            originalCss = splitted.css;
        }
        const newFormNote = {
            id: n.id,
            title: n.title,
            body: n.body,
            is_todo: n.is_todo,
            parent_id: n.parent_id,
            deleted_time: n.deleted_time,
            is_conflict: n.is_conflict,
            bodyWillChangeId: 0,
            bodyChangeId: 0,
            markup_language: n.markup_language,
            saveActionQueue: new AsyncActionQueue_1.default(300),
            originalCss: originalCss,
            hasChanged: false,
            user_updated_time: n.user_updated_time,
            encryption_applied: n.encryption_applied,
            is_locked: n.is_locked,
            noteLockKey,
            isDecrypted: 'isDecrypted' in n && !!n.isDecrypted,
        };
        logger.debug('Initializing note state');
        // Note that for performance reason,the call to setResourceInfos should
        // be first because it loads the resource infos in an async way. If we
        // swap them, the formNote will be updated first and rendered, then the
        // the resources will load, and the note will be re-rendered.
        const resources = await (0, attachedResources_1.default)(n.body);
        // If the user changes the note while resources are loading, this can lead to
        // a note being incorrectly marked as "unchanged".
        if (!isNewNote && ((_a = formNoteRef.current) === null || _a === void 0 ? void 0 : _a.hasChanged) && !force) {
            logger.info('Cancelled note refresh -- form note changed while loading attached resources.');
            return null;
        }
        setResourceInfos(resources);
        setFormNote(newFormNote);
        formNoteRef.current = newFormNote;
        logger.debug('Resource info and form note set.');
        await (0, resourceHandling_1.handleResourceDownloadMode)(n.body);
        return newFormNote;
    }, []);
    const clearFormNote = (0, react_1.useCallback)(() => {
        formNoteRef.current = (0, types_1.defaultFormNote)();
        setFormNote(formNoteRef.current);
    }, []);
    useRefreshFormNoteOnChange(formNoteRef, editorId, noteId, initNoteState, clearFormNote, builtInEditorVisible, noteLockSessionUnlocked, setDecryptFailed, setLoadBlocked, onReloadInProgressChange, editorNoteReloadTimeRequest);
    (0, react_1.useEffect)(() => {
        if (!noteId) {
            setDecryptFailed(false);
            if (formNote.id)
                setFormNote((0, types_1.defaultFormNote)());
            return () => { };
        }
        if (formNote.id === noteId)
            return () => { };
        let cancelled = false;
        logger.debug('Loading existing note', noteId);
        function handleAutoFocus(noteIsTodo) {
            if (!isProvisional)
                return;
            const focusSettingName = noteIsTodo ? 'newTodoFocus' : 'newNoteFocus';
            requestAnimationFrame(() => {
                if (Setting_1.default.value(focusSettingName) === 'title') {
                    if (titleInputRef.current)
                        (0, focusHandler_1.focus)('useFormNote::handleAutoFocus', titleInputRef.current);
                }
                else {
                    if (editorRef.current)
                        void editorRef.current.execCommand({ name: 'editor.focus' });
                }
            });
        }
        async function loadNote() {
            setDecryptFailed(false);
            const { note: n, blocked, decryptFailed } = await loadNoteForForm(noteId);
            if (cancelled)
                return;
            setLoadBlocked(blocked);
            setDecryptFailed(decryptFailed);
            if (blocked || decryptFailed) {
                await onBeforeLoad({ formNote });
                if (cancelled)
                    return;
                // Drop the previous form so no note content lingers behind the unlock or
                // cannot-decrypt panel. The id guard stops the resulting effect re-run from looping.
                if (formNoteRef.current.id)
                    clearFormNote();
                return;
            }
            if (!n)
                throw new Error(`Cannot find note with ID: ${noteId}`);
            logger.debug('Loaded note:', n);
            await onBeforeLoad({ formNote });
            const newFormNote = await initNoteState(n, true);
            setIsNewNote(isProvisional);
            await onAfterLoad({ formNote: newFormNote });
            handleAutoFocus(!!n.is_todo);
        }
        void loadNote();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [noteId, isProvisional, formNote]);
    const onResourceChange = (0, react_1.useCallback)(async (event = null) => {
        const resourceIds = await Note_1.default.linkedResourceIds(formNote.body);
        if (!event || resourceIds.indexOf(event.id) >= 0) {
            (0, attachedResources_1.clearResourceCache)();
            const newResourceInfos = await (0, attachedResources_1.default)(formNote.body);
            setResourceInfos(newResourceInfos);
        }
    }, [formNote.body]);
    (0, react_1.useEffect)(() => {
        installResourceChangeHandler(onResourceChange);
        return () => {
            uninstallResourceChangeHandler(onResourceChange);
        };
    }, [onResourceChange]);
    (0, react_1.useEffect)(() => {
        if (previousNoteId !== formNote.id) {
            void onResourceChange();
        }
    }, [previousNoteId, formNote.id, onResourceChange]);
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        async function runEffect() {
            const r = await (0, attachedResources_1.default)(formNote.body);
            if (cancelled)
                return;
            setResourceInfos((previous) => {
                return resourceInfosChanged(previous, r) ? r : previous;
            });
        }
        void runEffect();
        return () => {
            cancelled = true;
        };
    }, [formNote.body]);
    // Currently, useFormNote relies on formNoteRef being up-to-date immediately after the editor
    // changes, with no delay during which async code can run. Even a small delay (e.g. that introduced
    // by a setState -> useEffect) can lead to a race condition. See https://github.com/laurent22/joplin/issues/8960.
    const onSetFormNote = (0, react_1.useCallback)(newFormNote => {
        let newNote;
        if (typeof newFormNote === 'function') {
            newNote = newFormNote(formNoteRef.current);
        }
        else {
            newNote = newFormNote;
        }
        formNoteRef.current = newNote;
        setFormNote(newNote);
    }, [setFormNote]);
    return {
        isNewNote,
        formNote,
        setFormNote: onSetFormNote,
        resourceInfos,
        decryptFailed: !!noteId && decryptFailedId === noteId,
        loadBlocked: !!noteId && loadBlockedId === noteId,
    };
}
//# sourceMappingURL=useFormNote.js.map