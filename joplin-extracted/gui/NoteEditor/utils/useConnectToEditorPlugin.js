"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EditorPluginHandler_1 = __importDefault(require("@joplin/lib/services/plugins/EditorPluginHandler"));
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const react_1 = require("react");
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const WebviewController_1 = require("@joplin/lib/services/plugins/WebviewController");
const useQueuedAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useQueuedAsyncEffect"));
const logger = Logger_1.default.create('useEditorPlugin');
const useEditorPluginHandler = (formNote, setFormNote, scheduleSaveNote) => {
    const formNoteRef = (0, react_1.useRef)(formNote);
    formNoteRef.current = formNote;
    const lastEditorPluginSaveRef = (0, react_1.useRef)(null);
    return (0, react_1.useMemo)(() => {
        const onSave = async (newContent) => {
            var _a;
            const changed = newContent.body !== formNoteRef.current.body || newContent.id !== formNoteRef.current.id;
            if (!changed)
                return;
            const differentId = newContent.id !== formNoteRef.current.id;
            const sameIdAsLastSave = newContent.id === ((_a = lastEditorPluginSaveRef.current) === null || _a === void 0 ? void 0 : _a.id);
            // Ensure that the note is being saved with the correct parent_id, title, etc.
            const sourceFormNote = differentId && sameIdAsLastSave ? lastEditorPluginSaveRef.current : formNoteRef.current;
            const newFormNote = Object.assign(Object.assign({}, sourceFormNote), { id: newContent.id, body: newContent.body, hasChanged: true });
            lastEditorPluginSaveRef.current = newFormNote;
            setFormNote(newFormNote);
            return scheduleSaveNote(newFormNote);
        };
        return new EditorPluginHandler_1.default(PluginService_1.default.instance(), onSave);
    }, [setFormNote, scheduleSaveNote]);
};
const useLoadedViewIdsCacheKey = (windowId, plugins) => {
    return (0, react_1.useMemo)(() => {
        const viewIds = [];
        for (const plugin of Object.values(plugins)) {
            for (const view of Object.values(plugin.views)) {
                if (view.containerType === WebviewController_1.ContainerType.Editor && view.parentWindowId === windowId) {
                    viewIds.push(view.id);
                }
            }
        }
        // Create a string that can be easily checked for changes as an effect dependency
        return JSON.stringify(viewIds);
    }, [windowId, plugins]);
};
// Connects editor plugins to the current editor (handles editor plugin saving, loading).
const useConnectToEditorPlugin = ({ plugins, startupPluginsLoaded, setFormNote, formNote, scheduleSaveNote, effectiveNoteId, activeEditorView, shownEditorViewIds, }) => {
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    const loadedViewIdCacheKey = useLoadedViewIdsCacheKey(windowId, plugins);
    const editorPluginHandler = useEditorPluginHandler(formNote, setFormNote, scheduleSaveNote);
    (0, useQueuedAsyncEffect_1.default)(async () => {
        if (!startupPluginsLoaded)
            return;
        logger.debug('Emitting activation check for views:', loadedViewIdCacheKey);
        await editorPluginHandler.emitActivationCheck({
            parentWindowId: windowId,
            noteId: effectiveNoteId,
        });
        // It's important to re-run the activation check when the loaded view IDs change.
        // As such, `loadedViewIds` needs to be in the dependencies list:
    }, [loadedViewIdCacheKey, windowId, effectiveNoteId, editorPluginHandler, startupPluginsLoaded]);
    (0, react_1.useEffect)(() => {
        if (activeEditorView) {
            editorPluginHandler.onEditorPluginShown(activeEditorView.id);
        }
    }, [activeEditorView, editorPluginHandler]);
    const formNoteBody = formNote.body;
    const formNoteId = formNote.id;
    (0, react_1.useEffect)(() => {
        // Don't emit updates when formNote hasn't loaded the current note yet.
        // This can happen during note navigation when effectiveNoteId updates
        // immediately but formNote still contains the previous note's data.
        if (formNoteId !== effectiveNoteId)
            return;
        editorPluginHandler.emitUpdate({
            noteId: effectiveNoteId,
            newBody: formNoteBody,
        }, shownEditorViewIds);
    }, [effectiveNoteId, formNoteId, formNoteBody, editorPluginHandler, shownEditorViewIds]);
};
exports.default = useConnectToEditorPlugin;
//# sourceMappingURL=useConnectToEditorPlugin.js.map