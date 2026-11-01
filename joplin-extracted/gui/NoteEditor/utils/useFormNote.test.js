"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const react_1 = require("@testing-library/react");
const useFormNote_1 = __importDefault(require("./useFormNote"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const ItemChange_1 = __importDefault(require("@joplin/lib/models/ItemChange"));
const path_1 = require("path");
const _1 = require(".");
const NoteLockNote_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockNote"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const defaultFormNoteProps = {
    noteId: '',
    isProvisional: false,
    titleInputRef: null,
    editorRef: null,
    onBeforeLoad: () => { },
    onAfterLoad: () => { },
    editorId: 'editor',
    builtInEditorVisible: false,
    noteLockSessionUnlocked: false,
    onDecryptFailedChange: () => { },
};
const deferred = () => {
    let resolve;
    const promise = new Promise(resolvePromise => {
        resolve = resolvePromise;
    });
    return { promise, resolve: resolve };
};
describe('useFormNote', () => {
    beforeEach(async () => {
        await (0, test_utils_1.setupDatabaseAndSynchronizer)(1);
        await (0, test_utils_1.switchClient)(1);
    });
    // The session and decryption internals are covered by the lib tests; here they are mocked to
    // test only the hook's gating: ciphertext must never reach the form note.
    it('should not produce a form note for a locked note while the session is locked, and decrypt it once unlocked', async () => {
        Setting_1.default.setValue('featureFlag.noteLock', true);
        // A direct save of a new note with is_locked keeps the raw body, standing in for ciphertext.
        const testNote = await Note_1.default.save({ title: 'Locked note', body: 'ciphertext', is_locked: 1 });
        const isUnlockedMock = jest.spyOn(NoteLockSession_1.default.instance(), 'isUnlocked').mockReturnValue(false);
        const decryptedKeyMock = jest.spyOn(NoteLockSession_1.default.instance(), 'decryptedKey').mockReturnValue({ id: 'key-id', plainText: 'key' });
        const decryptBodyMock = jest.spyOn(NoteLockNote_1.default, 'decryptBody').mockImplementation(async (note) => (Object.assign(Object.assign({}, note), { body: 'secret content' })));
        const onBeforeLoad = jest.fn();
        const onDecryptFailedChange = jest.fn();
        try {
            const lockedRender = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
                initialProps: Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: testNote.id, onBeforeLoad, onDecryptFailedChange }),
            });
            // The blocked load produces no state change to wait for; onBeforeLoad is its last
            // await, so once it has run a single flush completes the branch.
            await (0, react_1.waitFor)(() => expect(onBeforeLoad).toHaveBeenCalled());
            await (0, react_1.act)(async () => { });
            expect(lockedRender.result.current.formNote).toMatchObject({
                id: '',
                body: '',
                noteLockKey: null,
            });
            expect(lockedRender.result.current.loadBlocked).toBe(true);
            expect(onDecryptFailedChange).toHaveBeenLastCalledWith(false);
            isUnlockedMock.mockReturnValue(true);
            lockedRender.rerender(Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: testNote.id, onBeforeLoad, onDecryptFailedChange, noteLockSessionUnlocked: true }));
            await (0, react_1.waitFor)(() => {
                expect(lockedRender.result.current.formNote).toMatchObject({
                    id: testNote.id,
                    is_locked: 1,
                    body: 'secret content',
                    noteLockKey: { id: 'key-id', plainText: 'key' },
                });
            });
            expect(lockedRender.result.current.loadBlocked).toBe(false);
            lockedRender.unmount();
            Setting_1.default.setValue('featureFlag.noteLock', false);
            isUnlockedMock.mockReturnValue(false);
            const flagOffRender = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
                initialProps: Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: testNote.id }),
            });
            await (0, react_1.waitFor)(() => {
                expect(flagOffRender.result.current.formNote.id).toBe(testNote.id);
            });
            expect(flagOffRender.result.current.formNote).toMatchObject({
                body: 'ciphertext',
            });
            flagOffRender.unmount();
        }
        finally {
            isUnlockedMock.mockRestore();
            decryptedKeyMock.mockRestore();
            decryptBodyMock.mockRestore();
            Setting_1.default.setValue('featureFlag.noteLock', false);
        }
    });
    it('should report a decryption failure instead of throwing, without producing a form note', async () => {
        Setting_1.default.setValue('featureFlag.noteLock', true);
        const testNote = await Note_1.default.save({ title: 'Locked note', body: 'ciphertext', is_locked: 1 });
        // The save's own change event would otherwise reach the hook's listener and reload the note.
        await ItemChange_1.default.waitForAllSaved();
        const isUnlockedMock = jest.spyOn(NoteLockSession_1.default.instance(), 'isUnlocked').mockReturnValue(true);
        const decryptBodyMock = jest.spyOn(NoteLockNote_1.default, 'decryptBody').mockRejectedValue(new Error('OperationError'));
        const onDecryptFailedChange = jest.fn();
        try {
            const render = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
                initialProps: Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: testNote.id, noteLockSessionUnlocked: true, onDecryptFailedChange }),
            });
            await (0, react_1.waitFor)(() => {
                expect(render.result.current.decryptFailed).toBe(true);
            });
            expect(render.result.current.formNote).toMatchObject({
                id: '',
                body: '',
            });
            expect(render.result.current.loadBlocked).toBe(false);
            expect(onDecryptFailedChange).toHaveBeenLastCalledWith(true);
            render.unmount();
        }
        finally {
            isUnlockedMock.mockRestore();
            decryptBodyMock.mockRestore();
            Setting_1.default.setValue('featureFlag.noteLock', false);
        }
    });
    it('should update note when decryption completes', async () => {
        const testNote = await Note_1.default.save({ title: 'Test Note!' });
        const makeFormNoteProps = () => {
            return Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: testNote.id });
        };
        const formNote = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
            initialProps: makeFormNoteProps(),
        });
        await (0, react_1.waitFor)(() => {
            // id is falsy until after the first load of the form note.
            expect(formNote.result.current.formNote.id).not.toBeFalsy();
        });
        expect(formNote.result.current.formNote).toMatchObject({
            encryption_applied: 0,
            title: testNote.title,
        });
        await (0, react_1.act)(async () => {
            await Note_1.default.save({
                id: testNote.id,
                encryption_cipher_text: 'cipher_text',
                encryption_applied: 1,
            });
        });
        // Changing encryption_applied should cause a re-render
        await (0, react_1.waitFor)(() => {
            expect(formNote.result.current.formNote).toMatchObject({
                encryption_applied: 1,
            });
        });
        await (0, react_1.act)(async () => {
            await Note_1.default.save({
                id: testNote.id,
                encryption_applied: 0,
                title: 'Test Note!',
            });
        });
        // Ending decryption should also cause a re-render
        await (0, react_1.waitFor)(() => {
            expect(formNote.result.current.formNote).toMatchObject({
                encryption_applied: 0,
            });
            // A larger-than-default timeout is needed to prevent CI failures:
        }, { timeout: 15000 });
        formNote.unmount();
    });
    // Lacking is_conflict has previously caused UI issues. See https://github.com/laurent22/joplin/pull/10913
    // for details.
    it('should preserve value of is_conflict on save', async () => {
        const testNote = await Note_1.default.save({ title: 'Test Note!', is_conflict: 1 });
        const makeFormNoteProps = () => {
            return Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: testNote.id });
        };
        const formNote = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
            initialProps: makeFormNoteProps(),
        });
        await (0, react_1.waitFor)(() => {
            expect(formNote.result.current.formNote).toMatchObject({
                is_conflict: 1,
                title: testNote.title,
            });
        }, { timeout: 15000 });
        // Should preserve is_conflict after save.
        expect(await (0, _1.formNoteToNote)(formNote.result.current.formNote)).toMatchObject({
            is_conflict: 1,
            deleted_time: 0,
            title: testNote.title,
        });
        formNote.unmount();
    });
    it('should reload the note when it is changed outside of the editor', async () => {
        const note = await Note_1.default.save({ title: 'Test Note!', body: '...' });
        const onReloadInProgressChange = jest.fn();
        const props = Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: note.id, onReloadInProgressChange });
        const formNote = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
            initialProps: props,
        });
        await (0, react_1.waitFor)(() => {
            expect(formNote.result.current.formNote.title).toBe('Test Note!');
        });
        // Simulate the note being modified outside the editor
        await (0, react_1.act)(async () => {
            await Note_1.default.save({ id: note.id, title: 'Modified' });
        });
        await (0, react_1.waitFor)(() => {
            expect(formNote.result.current.formNote.title).toBe('Modified');
        });
        expect(onReloadInProgressChange).not.toHaveBeenCalled();
        formNote.unmount();
    });
    it('should force a reload when editorNoteReloadTimeRequest changes', async () => {
        const note = await Note_1.default.save({ title: 'Original', body: '...' });
        const onReloadInProgressChange = jest.fn();
        const props = Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: note.id, editorNoteReloadTimeRequest: 0, onReloadInProgressChange });
        const formNote = (0, react_1.renderHook)(hookProps => (0, useFormNote_1.default)(hookProps), { initialProps: props });
        await (0, react_1.waitFor)(() => expect(formNote.result.current.formNote.title).toBe('Original'));
        (0, react_1.act)(() => {
            formNote.result.current.setFormNote(previous => (Object.assign(Object.assign({}, previous), { title: 'Unsaved local title', hasChanged: true })));
        });
        await Note_1.default.save({ id: note.id, title: 'Remote title' }, { changeId: 'test-editor' });
        formNote.rerender(Object.assign(Object.assign({}, props), { editorNoteReloadTimeRequest: 1 }));
        await (0, react_1.waitFor)(() => expect(onReloadInProgressChange).toHaveBeenCalledWith(true));
        await (0, react_1.waitFor)(() => expect(formNote.result.current.formNote.title).toBe('Remote title'));
        await (0, react_1.waitFor)(() => expect(onReloadInProgressChange).toHaveBeenLastCalledWith(false));
        formNote.unmount();
    });
    it('should clear reloadInProgress after overlapping reload requests', async () => {
        const note = await Note_1.default.save({ title: 'Original', body: '...' });
        const onReloadInProgressChange = jest.fn();
        const props = Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: note.id, editorNoteReloadTimeRequest: 0, onReloadInProgressChange });
        const formNote = (0, react_1.renderHook)(hookProps => (0, useFormNote_1.default)(hookProps), { initialProps: props });
        await (0, react_1.waitFor)(() => expect(formNote.result.current.formNote.title).toBe('Original'));
        const firstLoad = deferred();
        const lastLoad = deferred();
        const loadMock = jest.spyOn(Note_1.default, 'load')
            .mockImplementationOnce(() => firstLoad.promise)
            .mockImplementationOnce(() => lastLoad.promise);
        formNote.rerender(Object.assign(Object.assign({}, props), { editorNoteReloadTimeRequest: 1 }));
        await (0, react_1.waitFor)(() => expect(loadMock).toHaveBeenCalledTimes(1));
        formNote.rerender(Object.assign(Object.assign({}, props), { editorNoteReloadTimeRequest: 2 }));
        firstLoad.resolve(Object.assign(Object.assign({}, note), { title: 'First reload' }));
        await (0, react_1.waitFor)(() => expect(loadMock).toHaveBeenCalledTimes(2));
        expect(onReloadInProgressChange).toHaveBeenLastCalledWith(true);
        lastLoad.resolve(Object.assign(Object.assign({}, note), { title: 'Last reload' }));
        await (0, react_1.waitFor)(() => expect(formNote.result.current.formNote.title).toBe('Last reload'));
        await (0, react_1.waitFor)(() => expect(onReloadInProgressChange).toHaveBeenLastCalledWith(false));
        loadMock.mockRestore();
        formNote.unmount();
    });
    test('should refresh resource infos when changed outside the editor', async () => {
        let note = await Note_1.default.save({});
        note = await shim_1.default.attachFileToNote(note, (0, path_1.join)(test_utils_1.supportDir, 'sample.txt'));
        const resourceIds = Note_1.default.linkedItemIds(note.body);
        const resource = await Resource_1.default.load(resourceIds[0]);
        const makeFormNoteProps = () => {
            return Object.assign(Object.assign({}, defaultFormNoteProps), { noteId: note.id });
        };
        const formNote = (0, react_1.renderHook)(props => (0, useFormNote_1.default)(props), {
            initialProps: makeFormNoteProps(),
        });
        await (0, react_1.waitFor)(() => {
            expect(Object.values(formNote.result.current.resourceInfos).length).toBeGreaterThan(0);
        });
        const initialResourceInfos = formNote.result.current.resourceInfos;
        expect(initialResourceInfos).toMatchObject({
            [resource.id]: { item: { id: resource.id } },
        });
        await (0, react_1.act)(async () => {
            await Resource_1.default.save(Object.assign(Object.assign({}, resource), { filename: 'test.txt' }));
        });
        await (0, react_1.waitFor)(() => {
            const resourceInfo = formNote.result.current.resourceInfos[resource.id];
            expect(resourceInfo.item).toMatchObject({
                id: resource.id, filename: 'test.txt',
            });
        });
        formNote.unmount();
    });
});
//# sourceMappingURL=useFormNote.test.js.map