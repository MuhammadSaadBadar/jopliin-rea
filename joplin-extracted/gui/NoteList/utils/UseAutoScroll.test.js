"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useAutoScroll_1 = __importDefault(require("./useAutoScroll"));
const react_1 = require("@testing-library/react");
describe('UseAutoScroll', () => {
    test('scrolls to the note when a new note is selected', () => {
        const makeItemIndexVisible = jest.fn();
        (0, react_1.renderHook)(() => (0, useAutoScroll_1.default)('note-1', 'folder-1', 5, makeItemIndexVisible));
        expect(makeItemIndexVisible).toHaveBeenCalledTimes(1);
        expect(makeItemIndexVisible).toHaveBeenCalledWith(5);
    });
    test('does not scroll when the same note is already selected', () => {
        const makeItemIndexVisible = jest.fn();
        const { rerender } = (0, react_1.renderHook)(() => (0, useAutoScroll_1.default)('note-1', 'folder-1', 5, makeItemIndexVisible));
        makeItemIndexVisible.mockClear();
        rerender();
        expect(makeItemIndexVisible).not.toHaveBeenCalled();
    });
    test('does not scroll for multi-selection or no selection', () => {
        const makeItemIndexVisible = jest.fn();
        (0, react_1.renderHook)(() => (0, useAutoScroll_1.default)('', 'folder-1', -1, makeItemIndexVisible));
        expect(makeItemIndexVisible).not.toHaveBeenCalled();
    });
    test('defers scroll until notes load after folder change', () => {
        const makeItemIndexVisible = jest.fn();
        const { rerender } = (0, react_1.renderHook)((props) => (0, useAutoScroll_1.default)(props.selectedNoteId, props.selectedFolderId, props.targetIndex, props.makeItemIndexVisible), { initialProps: { selectedNoteId: 'note-1', selectedFolderId: 'folder-2', targetIndex: -1, makeItemIndexVisible } });
        expect(makeItemIndexVisible).not.toHaveBeenCalled();
        rerender({ selectedNoteId: 'note-1', selectedFolderId: 'folder-2', targetIndex: 3, makeItemIndexVisible });
        expect(makeItemIndexVisible).toHaveBeenCalledTimes(1);
        expect(makeItemIndexVisible).toHaveBeenCalledWith(3);
    });
    test('scrolls again when the folder changes even if note ID is the same', () => {
        const makeItemIndexVisible = jest.fn();
        const { rerender } = (0, react_1.renderHook)((props) => (0, useAutoScroll_1.default)(props.selectedNoteId, props.selectedFolderId, props.targetIndex, props.makeItemIndexVisible), { initialProps: { selectedNoteId: 'note-1', selectedFolderId: 'folder-1', targetIndex: 2, makeItemIndexVisible } });
        expect(makeItemIndexVisible).toHaveBeenCalledTimes(1);
        rerender({ selectedNoteId: 'note-1', selectedFolderId: 'folder-2', targetIndex: 2, makeItemIndexVisible });
        expect(makeItemIndexVisible).toHaveBeenCalledTimes(2);
    });
    test('does not scroll again when targetIndex changes after the pending flag is cleared', () => {
        // Covers the case where a sort or filter changes targetIndex without a new selection.
        // Without this guard, arrow-key navigation would trigger a spurious second scroll.
        const makeItemIndexVisible = jest.fn();
        const { rerender } = (0, react_1.renderHook)((props) => (0, useAutoScroll_1.default)(props.selectedNoteId, props.selectedFolderId, props.targetIndex, props.makeItemIndexVisible), { initialProps: { selectedNoteId: 'note-1', selectedFolderId: 'folder-1', targetIndex: 5, makeItemIndexVisible } });
        expect(makeItemIndexVisible).toHaveBeenCalledTimes(1);
        rerender({ selectedNoteId: 'note-1', selectedFolderId: 'folder-1', targetIndex: 7, makeItemIndexVisible });
        expect(makeItemIndexVisible).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=UseAutoScroll.test.js.map