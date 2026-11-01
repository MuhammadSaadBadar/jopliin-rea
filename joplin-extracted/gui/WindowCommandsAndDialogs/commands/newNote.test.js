"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newNote_1 = require("./newNote");
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
describe('newNote', () => {
    beforeEach(async () => {
        await (0, test_utils_1.setupDatabaseAndSynchronizer)(1);
        await (0, test_utils_1.switchClient)(1);
    });
    test.each([
        [null, null],
        ['order', true],
        ['order', false],
    ])('should create a new note', async (sortOrderField, sortOrderReverse) => {
        // The command needs an active folder ID.
        const activeFolder = await Folder_1.default.save({ title: 'folder' });
        const initialNote = await Note_1.default.save({ title: 'test', parent_id: activeFolder.id });
        Setting_1.default.setValue('activeFolderId', activeFolder.id);
        Setting_1.default.setValue('notes.sortOrder.field', sortOrderField);
        Setting_1.default.setValue('notes.sortOrder.reverse', sortOrderReverse);
        await (0, newNote_1.runtime)().execute(null, 'test note', true);
        // Correct note should have been created
        const newNote = (await Note_1.default.loadByField('body', 'test note'));
        expect(newNote.body).toEqual('test note');
        expect(newNote.parent_id).toEqual(activeFolder.id);
        if (sortOrderField === 'order' && !!sortOrderReverse) {
            expect(newNote.order).toBeGreaterThanOrEqual(initialNote.order + Note_1.default.defaultIntevalBetweenNotes);
        }
        else if (sortOrderField === 'order' && !sortOrderReverse) {
            expect(newNote.order).toBeLessThanOrEqual(initialNote.order - Note_1.default.defaultIntevalBetweenNotes);
        }
        else {
            expect(newNote.order).toEqual(0);
        }
    });
});
//# sourceMappingURL=newNote.test.js.map