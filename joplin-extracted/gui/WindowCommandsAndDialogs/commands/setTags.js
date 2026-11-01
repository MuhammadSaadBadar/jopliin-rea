"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const hasLockedNoteWhileSessionLocked_1 = __importDefault(require("@joplin/lib/services/noteLock/hasLockedNoteWhileSessionLocked"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
exports.declaration = {
    name: 'setTags',
    label: () => (0, locale_1._)('Tags'),
    iconName: 'icon-tags',
};
const runtime = (comp) => {
    return {
        execute: async (context, noteIds = null) => {
            noteIds = noteIds || context.state.selectedNoteIds;
            if (await (0, hasLockedNoteWhileSessionLocked_1.default)(noteIds)) {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Tags cannot be changed for locked notes while the session is locked'));
                return;
            }
            const tags = await Tag_1.default.commonTagsByNoteIds(noteIds);
            const startTags = tags
                .map((a) => {
                return { value: a.id, label: a.title };
            })
                .sort((a, b) => {
                // sensitivity accent will treat accented characters as different
                // but treats caps as equal
                return a.label.localeCompare(b.label, undefined, { sensitivity: 'accent' });
            });
            const allTags = await Tag_1.default.allWithNotes();
            const tagSuggestions = allTags.map((a) => {
                return { value: a.id, label: a.title };
            })
                .sort((a, b) => {
                // sensitivity accent will treat accented characters as different
                // but treats caps as equal
                return a.label.localeCompare(b.label, undefined, { sensitivity: 'accent' });
            });
            comp.setState({
                promptOptions: {
                    label: (0, locale_1._)('Add or remove tags:'),
                    inputType: 'tags',
                    value: startTags,
                    autocomplete: tagSuggestions,
                    onClose: async (answer) => {
                        if (answer !== null) {
                            const answerTags = answer;
                            const endTagTitles = answerTags.map(a => {
                                return a.label.trim();
                            });
                            if (noteIds.length === 1) {
                                await Tag_1.default.setNoteTagsByTitles(noteIds[0], endTagTitles);
                            }
                            else {
                                const startTagTitles = startTags.map(a => { return a.label.trim(); });
                                const addTags = endTagTitles.filter((value) => !startTagTitles.includes(value));
                                const delTags = startTagTitles.filter((value) => !endTagTitles.includes(value));
                                // apply the tag additions and deletions to each selected note
                                for (let i = 0; i < noteIds.length; i++) {
                                    const tags = await Tag_1.default.tagsByNoteId(noteIds[i]);
                                    let tagTitles = tags.map((a) => { return a.title; });
                                    tagTitles = tagTitles.concat(addTags);
                                    tagTitles = tagTitles.filter((value) => !delTags.includes(value));
                                    await Tag_1.default.setNoteTagsByTitles(noteIds[i], tagTitles);
                                }
                            }
                        }
                        comp.setState({ promptOptions: null });
                    },
                },
            });
        },
        enabledCondition: 'someNotesSelected && !allSelectedNotesAreDeleted && !inTrash',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=setTags.js.map