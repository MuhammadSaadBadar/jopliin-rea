"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prepareViewProps_1 = __importDefault(require("./prepareViewProps"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const test_utils_1 = require("@joplin/lib/testing/test-utils");
// Same as `prepareViewProps` but with default arguments to make testing code simpler.
const prepare = async (dependencies, note, itemSize = { width: 100, height: 20 }, selected = false, noteTitleHtml = '', noteIsWatched = false, noteTags = [], folder = null, itemIndex = 0) => {
    return (0, prepareViewProps_1.default)(dependencies, note, itemSize, selected, noteTitleHtml, noteIsWatched, noteTags, folder, itemIndex);
};
describe('prepareViewProps', () => {
    beforeEach(async () => {
        await (0, test_utils_1.setupDatabaseAndSynchronizer)(1);
        await (0, test_utils_1.switchClient)(1);
    });
    it('should prepare note properties', async () => {
        const note = await Note_1.default.save({ title: 'test' });
        expect(await prepare(['note.title', 'note.user_updated_time'], note)).toEqual({
            note: {
                title: 'test',
                user_updated_time: note.user_updated_time,
            },
        });
        expect(await prepare(['item.size.height'], note)).toEqual({
            item: {
                size: {
                    height: 20,
                },
            },
        });
        expect(await prepare(['item.selected'], note)).toEqual({
            item: {
                selected: false,
            },
        });
        expect(await prepare(['item.selected'], note, {}, true)).toEqual({
            item: {
                selected: true,
            },
        });
        expect(await prepare(['note.titleHtml'], note, {}, false, '<b>test</b>')).toEqual({
            note: {
                titleHtml: '<b>test</b>',
            },
        });
        expect(await prepare(['note.isWatched'], note, {}, false, '', true)).toEqual({
            note: {
                isWatched: true,
            },
        });
        expect(await prepare(['note.isWatched'], note, {}, false, '', false)).toEqual({
            note: {
                isWatched: false,
            },
        });
        expect(await prepare(['item.index'], note, {}, false, '', false, [], null, 5)).toEqual({
            item: {
                index: 5,
            },
        });
        expect(await prepare(['note.tags'], note, {}, false, '', false, [{ id: '1', title: 'one' }])).toEqual({
            note: {
                tags: [{ id: '1', title: 'one' }],
            },
        });
    });
    it('should return checkbox stats only when setting is enabled', async () => {
        const note = await Note_1.default.save({
            title: 'test',
            body: '- [ ] task 1\n- [x] task 2\n- [ ] task 3\n- [X] task 4',
        });
        Setting_1.default.setValue('notes.showCheckboxCompletionChart', true);
        expect(await prepare(['note.checkboxes'], note)).toEqual({
            note: {
                checkboxes: {
                    total: 4,
                    checked: 2,
                    percent: 50,
                    isComplete: false,
                },
            },
        });
        Setting_1.default.setValue('notes.showCheckboxCompletionChart', false);
        expect(await prepare(['note.checkboxes'], note)).toEqual({
            note: {
                checkboxes: null,
            },
        });
    });
    it('should return null for checkbox stats when note has no checkboxes', async () => {
        Setting_1.default.setValue('notes.showCheckboxCompletionChart', true);
        const note = await Note_1.default.save({
            title: 'test',
            body: 'This is a note without any checkboxes.',
        });
        const result = await prepare(['note.checkboxes'], note);
        expect(result).toEqual({
            note: {
                checkboxes: null,
            },
        });
    });
    it.each([
        {
            label: 'set isComplete to true when all checkboxes are checked',
            body: '- [x] task 1\n- [X] task 2\n- [x] task 3',
            expectedStatus: {
                total: 3,
                checked: 3,
                percent: 100,
                isComplete: true,
            },
        },
        {
            label: 'not recognise checkbox markup that isn\'t in a checklist',
            body: 'This will not render as a checkbox: "- [x] task 1".',
            expectedStatus: null,
        },
        {
            label: 'recognise checkbox markup within block quotes',
            body: '> > - [ ] This\n\n> - [ ] is\n> - [x] a test',
            expectedStatus: {
                total: 3,
                checked: 1,
                percent: 33,
                isComplete: false,
            },
        },
    ])('should $label', async ({ body, expectedStatus }) => {
        Setting_1.default.setValue('notes.showCheckboxCompletionChart', true);
        const note = await Note_1.default.save({
            title: 'test',
            body,
        });
        const result = await prepare(['note.checkboxes'], note);
        expect(result).toEqual({
            note: {
                checkboxes: expectedStatus,
            },
        });
    });
});
//# sourceMappingURL=prepareViewProps.test.js.map