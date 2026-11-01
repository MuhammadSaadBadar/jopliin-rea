"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDropHandler;
const react_1 = require("react");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const electron_1 = require("electron");
function useDropHandler(dependencies) {
    const { editorRef } = dependencies;
    return (0, react_1.useCallback)((event) => {
        if (!event.dataTransfer)
            return false;
        const dt = event.dataTransfer;
        const createFileURL = event.altKey;
        const eventPosition = {
            clientX: event.clientX,
            clientY: event.clientY,
        };
        if (dt.types.indexOf('text/x-jop-note-ids') >= 0) {
            const noteIds = JSON.parse(dt.getData('text/x-jop-note-ids'));
            const dropNotes = async () => {
                const noteMarkdownTags = [];
                for (let i = 0; i < noteIds.length; i++) {
                    const note = await Note_1.default.load(noteIds[i]);
                    noteMarkdownTags.push(Note_1.default.markdownTag(note));
                }
                const props = {
                    type: 'notes',
                    pos: eventPosition,
                    markdownTags: noteMarkdownTags,
                };
                void editorRef.current.execCommand({
                    name: 'dropItems',
                    value: props,
                });
            };
            void dropNotes();
            return true;
        }
        const files = dt.files;
        if (files && files.length) {
            const paths = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const path = electron_1.webUtils.getPathForFile(file);
                if (!path)
                    continue;
                paths.push(path);
            }
            if (paths.length > 0) {
                const props = {
                    type: 'files',
                    pos: eventPosition,
                    paths: paths,
                    createFileURL: createFileURL,
                };
                void editorRef.current.execCommand({
                    name: 'dropItems',
                    value: props,
                });
                return true;
            }
        }
        return false;
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
}
//# sourceMappingURL=useDropHandler.js.map