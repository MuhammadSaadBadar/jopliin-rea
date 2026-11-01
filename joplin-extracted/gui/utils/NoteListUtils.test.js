"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoteListUtils_1 = __importDefault(require("./NoteListUtils"));
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const menuCommandNames_1 = __importDefault(require("../menuCommandNames"));
const initializeCommandService_1 = __importDefault(require("../../utils/initializeCommandService"));
const app_reducer_1 = require("../../app.reducer");
jest.mock('../../services/bridge', () => ({
    __esModule: true,
    default: () => ({
        MenuItem: class MenuItem {
            constructor(value) {
                this.value = value;
            }
        },
        Menu: class MockMenu {
            constructor() {
                this.items = [];
            }
            append(item) {
                const identifier = item.value.id ? item.value.id : (item.value.label ? item.value.label : item.value.type);
                this.items.push(identifier);
            }
        },
    }),
}));
const mockDispatch = jest.fn();
describe('NoteListUtils', () => {
    beforeEach(() => {
        const mockStore = {
            getState: () => {
                return Object.assign(Object.assign({}, (0, app_reducer_1.createAppDefaultWindowState)()), { settings: {} });
            },
        };
        (0, initializeCommandService_1.default)(mockStore, false);
        const keymapService = KeymapService_1.default.instance();
        keymapService.initialize((0, menuCommandNames_1.default)());
    });
    it('should show only trash menu options on deleted note', () => {
        const noteIds = ['noteId1'];
        const deletedNote = {
            id: 'noteId1',
            deleted_time: new Date().getTime(),
        };
        const menu = NoteListUtils_1.default.makeContextMenu(noteIds, {
            notes: [
                deletedNote,
            ],
            dispatch: mockDispatch,
            watchedNoteFiles: [],
            plugins: {},
            inConflictFolder: false,
            customCss: '',
        });
        expect(menu.items).toEqual([
            'restoreNote',
            'permanentlyDeleteNote',
        ]);
    });
    it('should show menu options for normal notes', () => {
        const noteIds = ['noteId1'];
        const normalNote = {
            id: 'noteId1',
        };
        const menu = NoteListUtils_1.default.makeContextMenu(noteIds, {
            notes: [
                normalNote,
            ],
            dispatch: mockDispatch,
            watchedNoteFiles: [],
            plugins: {},
            inConflictFolder: false,
            customCss: '',
        });
        expect(menu.items).toEqual([
            'openNoteInNewWindow',
            'startExternalEditing',
            'separator',
            'setTags',
            'separator',
            'toggleNoteType',
            'moveToFolder',
            'duplicateNote',
            'deleteNote',
            'separator',
            'Copy Markdown link',
            'Copy external link',
            'separator',
            'Export',
        ]);
    });
    it('should show options when more than one note is selected', () => {
        const noteIds = ['noteId1', 'noteId2'];
        const menu = NoteListUtils_1.default.makeContextMenu(noteIds, {
            notes: [
                { id: 'noteId1' },
                { id: 'noteId2' },
            ],
            dispatch: mockDispatch,
            watchedNoteFiles: [],
            plugins: {},
            inConflictFolder: false,
            customCss: '',
        });
        expect(menu.items).toEqual([
            'setTags',
            'separator',
            'Switch to note type',
            'Switch to to-do type',
            'moveToFolder',
            'duplicateNote',
            'deleteNote',
            'separator',
            'Copy Markdown link',
            'separator',
            'Export',
        ]);
    });
    it('should hide all options for encrypted', () => {
        const noteIds = ['noteId1'];
        const encrypted = {
            id: 'noteId1',
            encryption_applied: 1,
        };
        const menu = NoteListUtils_1.default.makeContextMenu(noteIds, {
            notes: [
                encrypted,
            ],
            dispatch: mockDispatch,
            watchedNoteFiles: [],
            plugins: {},
            inConflictFolder: false,
            customCss: '',
        });
        expect(menu.items).toEqual([]);
    });
});
//# sourceMappingURL=NoteListUtils.test.js.map