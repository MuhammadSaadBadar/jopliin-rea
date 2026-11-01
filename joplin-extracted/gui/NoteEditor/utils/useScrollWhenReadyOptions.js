"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const types_1 = require("./types");
const usePrevious_1 = __importDefault(require("@joplin/lib/hooks/usePrevious"));
const NotePositionService_1 = __importDefault(require("@joplin/lib/services/NotePositionService"));
const useNowEffect_1 = __importDefault(require("@joplin/lib/hooks/useNowEffect"));
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
const useScrollWhenReadyOptions = ({ noteId, editorName, selectedNoteHash, editorRef }) => {
    const scrollWhenReadyRef = (0, react_1.useRef)(null);
    const previousNoteId = (0, usePrevious_1.default)(noteId);
    const previousEditor = (0, usePrevious_1.default)(editorName);
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    // This needs to be a nowEffect to prevent race conditions
    (0, useNowEffect_1.default)(() => {
        const editorChanged = editorName !== previousEditor;
        const noteIdChanged = noteId !== previousNoteId;
        if (!editorChanged && !noteIdChanged)
            return () => { };
        const lastScrollPercent = NotePositionService_1.default.instance().getScrollPercent(noteId, windowId) || 0;
        scrollWhenReadyRef.current = {
            type: selectedNoteHash ? types_1.ScrollOptionTypes.Hash : types_1.ScrollOptionTypes.Percent,
            value: selectedNoteHash ? selectedNoteHash : lastScrollPercent,
        };
        if (editorRef.current) {
            editorRef.current.resetScroll();
        }
        return () => { };
    }, [editorName, previousEditor, noteId, previousNoteId, selectedNoteHash, editorRef, windowId]);
    const clearScrollWhenReady = (0, react_1.useCallback)(() => {
        scrollWhenReadyRef.current = null;
    }, []);
    return { scrollWhenReadyRef, clearScrollWhenReady };
};
exports.default = useScrollWhenReadyOptions;
//# sourceMappingURL=useScrollWhenReadyOptions.js.map