"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const useItemElement_1 = __importDefault(require("./useItemElement"));
const defaultProps = {
    noteId: 'note-1',
    noteHtml: '<span>Test content</span>',
    focusVisible: false,
    style: { height: '24px' },
    itemSize: { width: 200, height: 24 },
    onClick: jest.fn(),
    onDoubleClick: jest.fn(),
    flow: noteListType_1.ItemFlow.TopToBottom,
};
const defaultItemEventHandlers = { onInputChange: jest.fn(), onClick: null };
describe('useItemElement', () => {
    let rootElement;
    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
        defaultProps.onClick.mockClear();
        defaultProps.onDoubleClick.mockClear();
    });
    afterEach(() => {
        rootElement.remove();
    });
    test('returns a ref (no setState, avoids "Maximum update depth exceeded")', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useItemElement_1.default)(rootElement, defaultProps.noteId, defaultProps.noteHtml, defaultProps.focusVisible, defaultProps.style, defaultProps.itemSize, defaultProps.onClick, defaultProps.onDoubleClick, defaultProps.flow, defaultItemEventHandlers));
        expect(result.current).toHaveProperty('current');
    });
    test('assigns created element to ref.current and cleanup nulls ref and removes element', () => {
        const { result, unmount } = (0, react_1.renderHook)(() => (0, useItemElement_1.default)(rootElement, defaultProps.noteId, defaultProps.noteHtml, false, defaultProps.style, defaultProps.itemSize, defaultProps.onClick, defaultProps.onDoubleClick, defaultProps.flow, defaultItemEventHandlers));
        (0, react_1.act)(() => { });
        const el = result.current.current;
        expect(el).toBeInstanceOf(HTMLDivElement);
        expect(rootElement.contains(el)).toBe(true);
        unmount();
        expect(result.current.current).toBeNull();
        expect(rootElement.contains(el)).toBe(false);
    });
    test('does nothing when rootElement is null', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useItemElement_1.default)(null, defaultProps.noteId, defaultProps.noteHtml, false, defaultProps.style, defaultProps.itemSize, defaultProps.onClick, defaultProps.onDoubleClick, defaultProps.flow, defaultItemEventHandlers));
        (0, react_1.act)(() => { });
        expect(result.current.current).toBeNull();
    });
});
//# sourceMappingURL=useItemElement.test.js.map