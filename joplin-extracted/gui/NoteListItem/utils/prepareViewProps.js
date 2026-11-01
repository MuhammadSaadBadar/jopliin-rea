"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const locale_1 = require("@joplin/lib/locale");
const countCheckboxes = (body) => {
    if (!body)
        return null;
    // Match unchecked: - [ ] and checked: - [x] or - [X]
    const uncheckedMatches = body.match(/(^|\n)[ \t>]*- \[ \]/g);
    const checkedMatches = body.match(/(^|\n)[ \t>]*- \[[xX]\]/g);
    const unchecked = uncheckedMatches ? uncheckedMatches.length : 0;
    const checked = checkedMatches ? checkedMatches.length : 0;
    const total = unchecked + checked;
    if (total === 0)
        return null;
    return {
        total,
        checked,
        percent: Math.round((checked / total) * 100),
        isComplete: checked === total,
    };
};
const prepareViewProps = async (dependencies, note, itemSize, selected, noteTitleHtml, noteIsWatched, noteTags, folder, itemIndex, noteIsPublished = false) => {
    const output = {};
    for (const dep of dependencies) {
        if (dep.startsWith('note.')) {
            const splitted = dep.split('.');
            if (splitted.length <= 1)
                throw new Error(`Invalid dependency name: ${dep}`);
            const propName = splitted.pop();
            if (!output.note)
                output.note = {};
            if (dep === 'note.titleHtml') { // For backward compatibility
                output.note.titleHtml = noteTitleHtml;
            }
            else if (dep === 'note.isWatched') {
                output.note[propName] = noteIsWatched;
            }
            else if (dep === 'note.is_published') {
                output.note[propName] = noteIsPublished;
            }
            else if (dep === 'note.tags') {
                output.note[propName] = noteTags;
            }
            else if (dep === 'note.folder.title') {
                if (!output.note.folder)
                    output.note.folder = {};
                output.note.folder[propName] = folder.title;
            }
            else if (dep === 'note.todoStatusText') {
                let taskStatus = '';
                if (note.is_todo) {
                    taskStatus = note.todo_completed ? (0, locale_1._)('Complete to-do') : (0, locale_1._)('Incomplete to-do');
                }
                output.note[propName] = taskStatus;
            }
            else if (dep === 'note.checkboxes') {
                // Only load the note body and compute checkbox stats if the setting is enabled
                if (Setting_1.default.value('notes.showCheckboxCompletionChart')) {
                    if (!('body' in note))
                        note = await Note_1.default.load(note.id);
                    output.note[propName] = countCheckboxes(note.body);
                }
                else {
                    output.note[propName] = null;
                }
            }
            else {
                // The notes in the state only contain the properties defined in
                // Note.previewFields(). It means that if a view request a
                // property not present there, we need to load the full note.
                // One such missing property is the note body, which we don't
                // load by default.
                if (!(propName in note))
                    note = await Note_1.default.load(note.id);
                if (!(propName in note))
                    throw new Error(`Invalid dependency name: ${dep}`);
                output.note[propName] = note[propName];
            }
        }
        if (dep.startsWith('item.size.')) {
            const splitted = dep.split('.');
            if (splitted.length !== 3)
                throw new Error(`Invalid dependency name: ${dep}`);
            const propName = splitted.pop();
            if (!output.item)
                output.item = {};
            if (!output.item.size)
                output.item.size = {};
            if (!(propName in itemSize))
                throw new Error(`Invalid dependency name: ${dep}`);
            output.item.size[propName] = itemSize[propName];
        }
        if (dep === 'item.selected') {
            if (!output.item)
                output.item = {};
            output.item.selected = selected;
        }
        if (dep === 'item.index') {
            if (!output.item)
                output.item = {};
            output.item.index = itemIndex;
        }
    }
    return output;
};
exports.default = prepareViewProps;
//# sourceMappingURL=prepareViewProps.js.map