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
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const react_1 = require("react");
const _1 = require(".");
const ExternalEditWatcher_1 = __importDefault(require("@joplin/lib/services/ExternalEditWatcher"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const logger = Logger_1.default.create('useScheduleSaveCallbacks');
const useScheduleSaveCallbacks = (props) => {
    const editorNoteReloadTimeRequestRef = (0, react_1.useRef)(props.editorNoteReloadTimeRequest);
    editorNoteReloadTimeRequestRef.current = props.editorNoteReloadTimeRequest;
    const scheduleSaveNote = (0, react_1.useCallback)((formNote) => {
        if (!formNote.saveActionQueue)
            throw new Error('saveActionQueue is not set!!'); // Sanity check
        // reg.logger().debug('Scheduling...', formNote);
        const editorNoteReloadTimeRequest = editorNoteReloadTimeRequestRef.current;
        const makeAction = (formNote) => {
            return async function () {
                var _a;
                if (editorNoteReloadTimeRequestRef.current > editorNoteReloadTimeRequest)
                    return;
                // The lock state may change between scheduling and execution (e.g. encryption enabled
                // from the note list menu), so the save uses the latest form state for this note.
                const latestFormNote = ((_a = props.formNote.current) === null || _a === void 0 ? void 0 : _a.id) === formNote.id ? props.formNote.current : formNote;
                let note;
                if ((0, isNoteLockEnabled_1.default)()) {
                    note = await (0, _1.formNoteToNote)(Object.assign(Object.assign({}, formNote), { is_locked: latestFormNote.is_locked, isDecrypted: latestFormNote.isDecrypted }));
                }
                else {
                    note = await (0, _1.formNoteToNote)(formNote);
                }
                logger.debug('Saving note...', (0, isNoteLockEnabled_1.default)() && note.is_locked ? note.id : note);
                const savedNote = await Note_1.default.save(note, { changeId: `editorChange-${props.editorId}`, useNoteLock: true, noteLockKey: latestFormNote.noteLockKey });
                props.setFormNote.current((prev) => {
                    return Object.assign(Object.assign({}, prev), { user_updated_time: savedNote.user_updated_time, hasChanged: false });
                });
                void ExternalEditWatcher_1.default.instance().updateNoteFile(savedNote);
                props.dispatch({
                    type: 'EDITOR_NOTE_STATUS_REMOVE',
                    id: formNote.id,
                });
                eventManager_1.default.emit(eventManager_1.EventName.NoteContentChange, { note: savedNote });
            };
        };
        formNote.saveActionQueue.push(makeAction(formNote));
        return formNote.saveActionQueue.waitForAllDone();
    }, [props.dispatch, props.editorId, props.setFormNote, props.formNote]);
    const saveNoteIfWillChange = (0, react_1.useCallback)(async (formNote) => {
        if (!formNote.id || !formNote.bodyWillChangeId || !props.editorRef.current)
            return;
        const body = await props.editorRef.current.content();
        void scheduleSaveNote(Object.assign(Object.assign({}, formNote), { body: body, bodyWillChangeId: 0, bodyChangeId: 0 }));
        await formNote.saveActionQueue.processAllNow();
    }, [scheduleSaveNote, props.editorRef]);
    return { saveNoteIfWillChange, scheduleSaveNote };
};
exports.default = useScheduleSaveCallbacks;
//# sourceMappingURL=useScheduleSaveCallbacks.js.map