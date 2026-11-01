"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const renderTemplate_1 = __importDefault(require("@joplin/lib/services/noteList/renderTemplate"));
const renderViewProps_1 = __importDefault(require("@joplin/lib/services/noteList/renderViewProps"));
const crypto_1 = require("crypto");
const getNoteTitleHtml_1 = __importDefault(require("./getNoteTitleHtml"));
const prepareViewProps_1 = __importDefault(require("./prepareViewProps"));
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const array_1 = require("@joplin/lib/array");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const hashContent = (content) => {
    return (0, crypto_1.createHash)('sha1').update(JSON.stringify(content)).digest('hex');
};
exports.default = (note, isSelected, isWatched, isPublished, listRenderer, highlightedWords, itemIndex, columns) => {
    const [renderedNote, setRenderedNote] = (0, react_1.useState)(null);
    let dependencies = columns && columns.length ? columns.map(c => c.name) : [];
    if (listRenderer.dependencies)
        dependencies = dependencies.concat(listRenderer.dependencies);
    dependencies = (0, array_1.unique)(dependencies);
    (0, useAsyncEffect_1.default)(async (event) => {
        const renderNote = async () => {
            let noteTags = [];
            let folder = null;
            if (dependencies.includes('note.tags')) {
                noteTags = await Tag_1.default.tagsByNoteId(note.id, { fields: ['id', 'title'] });
            }
            if (dependencies.find(d => d.startsWith('note.folder'))) {
                folder = await Folder_1.default.load(note.parent_id, { fields: ['id', 'title'] });
            }
            // Note: with this hash we're assuming that the list renderer
            // properties never changes. It means that later if we support
            // dynamic list renderers, we should include these into the hash.
            const viewHash = hashContent([
                listRenderer.id,
                note.updated_time,
                isSelected,
                isWatched,
                isPublished,
                highlightedWords,
                note.encryption_applied,
                JSON.stringify(columns),
                noteTags.map(t => t.title).sort().join(','),
                folder ? folder.title : '',
            ]);
            if (renderedNote && renderedNote.hash === viewHash)
                return null;
            const noteTitleHtml = (0, getNoteTitleHtml_1.default)(highlightedWords, Note_1.default.displayTitle(note));
            const viewProps = await (0, prepareViewProps_1.default)(dependencies, note, listRenderer.itemSize, isSelected, noteTitleHtml, isWatched, noteTags, folder, itemIndex, isPublished);
            if (event.cancelled)
                return null;
            const view = await listRenderer.onRenderNote(viewProps);
            if (event.cancelled)
                return null;
            await (0, renderViewProps_1.default)(view, [], { noteTitleHtml });
            if (event.cancelled)
                return null;
            setRenderedNote({
                id: note.id,
                hash: viewHash,
                html: (0, renderTemplate_1.default)(columns, listRenderer.itemTemplate, listRenderer.itemValueTemplates, view),
            });
        };
        void renderNote();
    }, [note, isSelected, isWatched, isPublished, listRenderer, renderedNote, columns]);
    return renderedNote;
};
//# sourceMappingURL=useRenderedNote.js.map