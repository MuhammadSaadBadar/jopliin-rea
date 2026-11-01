"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useLayoutItemSizes_1 = __importStar(require("./useLayoutItemSizes"));
const types_1 = require("./types");
const react_1 = require("@testing-library/react");
const validateLayout_1 = __importDefault(require("./validateLayout"));
describe('useLayoutItemSizes', () => {
    test('should validate the layout', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'col1' },
                { key: 'col2' },
            ],
        });
        expect(layout.isRoot).toBe(true);
    });
    test('should stretch the last visible child item if all siblings have fixed size and the last child is not visible', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'col1', width: 50 },
                { key: 'col2', width: 50 },
                { key: 'col3', width: 70, visible: false },
            ],
        });
        const col1 = layout.children.find(c => c.key === 'col1');
        expect(col1.width).toBe(50);
        expect(col1.visible).toBe(true);
        const col2 = layout.children.find(c => c.key === 'col2');
        expect(col2).not.toHaveProperty('width');
        expect(col2.visible).toBe(true);
        const col3 = layout.children.find(c => c.key === 'col3');
        expect(col3.width).toBe(70);
        expect(col3.visible).toBe(false);
    });
    test('should stretch the last child item if all siblings have fixed size', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'col1', width: 50 },
                { key: 'col2', width: 50 },
                { key: 'col3', width: 70 },
            ],
        });
        const col1 = layout.children.find(c => c.key === 'col1');
        expect(col1.width).toBe(50);
        expect(col1.visible).toBe(true);
        const col2 = layout.children.find(c => c.key === 'col2');
        expect(col2.width).toBe(50);
        expect(col2.visible).toBe(true);
        const col3 = layout.children.find(c => c.key === 'col3');
        expect(col3).not.toHaveProperty('width');
        expect(col3.visible).toBe(true);
    });
    test('should give item sizes', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 50,
                },
                {
                    key: 'col2',
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        expect(sizes.root).toEqual({ width: 200, height: 100 });
        expect(sizes.col1).toEqual({ width: 50, height: 100 });
        expect(sizes.col2).toEqual({ width: 150, height: 100 });
    });
    test('should leave room for the resizer controls', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    resizableRight: true,
                    direction: types_1.LayoutItemDirection.Column,
                    children: [
                        { key: 'row1', resizableBottom: true },
                        { key: 'row2' },
                    ],
                },
                {
                    key: 'col2',
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        expect(sizes).toEqual({
            root: { width: 200, height: 100 },
            col1: { width: 100, height: 100 },
            col2: { width: 100, height: 100 },
            row1: { width: 100, height: 50 },
            row2: { width: 100, height: 50 },
        });
        expect((0, useLayoutItemSizes_1.itemSize)(layout.children[0], layout, sizes, true)).toEqual({ width: 100, height: 100 });
        const parent = layout.children[0];
        // row1: inside a column that has a right divider, and row1 itself has a
        // bottom divider (there's a visible sibling below it).
        expect((0, useLayoutItemSizes_1.itemSize)(parent.children[0], parent, sizes, false, { ownRight: false, ownBottom: true, parentRight: true, parentBottom: false })).toEqual({ width: 95, height: 45 });
        // row2: same column, no bottom divider (it is the last row).
        expect((0, useLayoutItemSizes_1.itemSize)(parent.children[1], parent, sizes, false, { ownRight: false, ownBottom: false, parentRight: true, parentBottom: false })).toEqual({ width: 95, height: 50 });
    });
    test('should decrease size of the largest item if the total size would be larger than the container', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 110,
                },
                {
                    key: 'col2',
                    width: 100,
                },
                {
                    key: 'col3',
                    minWidth: 50,
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        expect(sizes.col1.width).toBe(50);
        expect(sizes.col2.width).toBe(100);
        expect(sizes.col3.width).toBe(50);
    });
    test('should not allow a minWidth of 0, should still make space for the item', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 210,
                },
                {
                    key: 'col2',
                    minWidth: 0,
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        expect(sizes.col1.width).toBe(160);
        expect(sizes.col2.width).toBe(40); // default minWidth is 40
    });
    test('should ignore invisible items when counting remaining size', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 110,
                    visible: false,
                },
                {
                    key: 'col2',
                    width: 100,
                },
                {
                    key: 'col3',
                    minWidth: 50,
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        expect(sizes.col1.width).toBe(0);
        expect(sizes.col2.width).toBe(100);
        expect(sizes.col3.width).toBe(100);
    });
    test('should ignore invisible items when selecting largest child', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 110,
                    visible: false,
                },
                {
                    key: 'col2',
                    width: 100,
                },
                {
                    key: 'col3',
                    width: 110,
                },
                {
                    key: 'col4',
                    minWidth: 50,
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        expect(sizes.col1.width).toBe(0);
        expect(sizes.col2.width).toBe(100);
        expect(sizes.col3.width).toBe(50);
        expect(sizes.col4.width).toBe(50);
    });
    test('should give maximum available space this item can take up during resizing', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 50,
                },
                {
                    key: 'col2',
                    width: 70,
                },
                {
                    key: 'col3',
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        const maxSize1 = (0, useLayoutItemSizes_1.calculateMaxSizeAvailableForItem)(layout.children[0], layout, sizes);
        const maxSize2 = (0, useLayoutItemSizes_1.calculateMaxSizeAvailableForItem)(layout.children[1], layout, sizes);
        // maxSize = totalSize - ( [size of items with set size, except for the current item] + [minimum size of items with no set size] )
        expect(maxSize1.width).toBe(90); // 90 = layout.width - (col2.width + col3.minWidth(=40) )
        expect(maxSize2.width).toBe(110); // 110 = layout.width - (col1.width + col3.minWidth(=40) )
    });
    test('should respect minimum sizes', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 50,
                },
                {
                    key: 'col2',
                    width: 70,
                },
                {
                    key: 'col3',
                    minWidth: 60,
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        const maxSize1 = (0, useLayoutItemSizes_1.calculateMaxSizeAvailableForItem)(layout.children[0], layout, sizes);
        const maxSize2 = (0, useLayoutItemSizes_1.calculateMaxSizeAvailableForItem)(layout.children[1], layout, sizes);
        // maxSize = totalSize - ( [size of items with set size, except for the current item] + [minimum size of items with no set size] )
        expect(maxSize1.width).toBe(70); // 70 = layout.width - (col2.width + col3.minWidth)
        expect(maxSize2.width).toBe(90); // 90 = layout.width - (col1.width + col3.minWidth)
    });
    test('should not allow a minWidth of 0, should still leave space for the item', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 50,
                },
                {
                    key: 'col2',
                    minWidth: 0,
                },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        const maxSize1 = (0, useLayoutItemSizes_1.calculateMaxSizeAvailableForItem)(layout.children[0], layout, sizes);
        // maxSize = totalSize - ( [size of items with set size, except for the current item] + [minimum size of items with no set size] )
        expect(maxSize1.width).toBe(160); // 160 = layout.width - col2.minWidth(=40)
    });
    test('flexible child absorbs remaining space regardless of position', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 1000,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'sideBar', width: 250 },
                { key: 'noteList', width: 250 },
                { key: 'editor', flexible: true },
                { key: 'chatPanel', width: 340 },
            ],
        });
        const editor = layout.children.find(c => c.key === 'editor');
        expect(editor).not.toHaveProperty('width');
        const sizes = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout)).result.current;
        expect(sizes.editor.width).toBe(160);
        expect(sizes.chatPanel.width).toBe(340);
        const enlarged = (0, validateLayout_1.default)(Object.assign(Object.assign({}, layout), { width: 1200 }));
        const enlargedSizes = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(enlarged)).result.current;
        expect(enlargedSizes.editor.width).toBe(360);
        expect(enlargedSizes.chatPanel.width).toBe(340);
        expect(enlargedSizes.sideBar.width).toBe(250);
        expect(enlargedSizes.noteList.width).toBe(250);
    });
    test('flexible child still gets a draggable right edge so the divider against the next sibling stays usable', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 1000,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'sideBar', width: 250 },
                { key: 'editor', flexible: true },
                { key: 'chatPanel', width: 340 },
            ],
        });
        const editor = layout.children.find(c => c.key === 'editor');
        expect(editor.resizableRight).toBe(true);
        const chatPanel = layout.children.find(c => c.key === 'chatPanel');
        expect(chatPanel.resizableRight).toBe(false);
    });
    test('width-less non-absorber siblings get a fallback width so the explicit absorber alone absorbs', () => {
        // Mimics state after a move-mode rearrangement that wipes sibling widths.
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 1000,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'sideBar' },
                { key: 'editor', flexible: true, width: 408 },
                { key: 'noteList' },
                { key: 'chatPanel', width: 113 },
            ],
        });
        expect(layout.children.find(c => c.key === 'editor')).not.toHaveProperty('width');
        expect(layout.children.find(c => c.key === 'sideBar').width).toBeGreaterThan(0);
        expect(layout.children.find(c => c.key === 'noteList').width).toBeGreaterThan(0);
        const enlarged = (0, validateLayout_1.default)(Object.assign(Object.assign({}, layout), { width: 1200 }));
        const before = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout)).result.current;
        const after = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(enlarged)).result.current;
        expect(after.editor.width - before.editor.width).toBe(200);
        expect(after.sideBar.width).toBe(before.sideBar.width);
        expect(after.noteList.width).toBe(before.noteList.width);
        expect(after.chatPanel.width).toBe(before.chatPanel.width);
    });
    test('container holding a flexible descendant inherits the absorber role at the root level', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 1000,
            height: 600,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'sideBar', width: 218 },
                {
                    key: 'col',
                    width: 667,
                    children: [
                        { key: 'noteList', height: 250 },
                        { key: 'editor', flexible: true },
                    ],
                },
                { key: 'chatPanel' },
            ],
        });
        expect(layout.children.find(c => c.key === 'col')).not.toHaveProperty('width');
        expect(layout.children.find(c => c.key === 'chatPanel').width).toBeGreaterThan(0);
        const before = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout)).result.current;
        const after = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)((0, validateLayout_1.default)(Object.assign(Object.assign({}, layout), { width: 1300 })))).result.current;
        expect(after.col.width - before.col.width).toBe(300);
        expect(after.sideBar.width).toBe(before.sideBar.width);
        expect(after.chatPanel.width).toBe(before.chatPanel.width);
        expect(after.editor.width).toBe(after.col.width);
    });
    test('itemSize propagates the ancestor divider gap through last-child same-axis nesting', () => {
        // Same-axis nesting is unusual but valid; a row nested at the end of
        // another row should inherit its outer sibling's right gap.
        const sizes = { outer: { width: 200, height: 100 }, inner: { width: 200, height: 100 } };
        const inner = { key: 'inner' };
        // The outer has its own trailing gap because it has a sibling to its right.
        const edgesFromLastRowChild = { ownRight: false, ownBottom: false, parentRight: true, parentBottom: false };
        const size = (0, useLayoutItemSizes_1.itemSize)(inner, null, sizes, false, edgesFromLastRowChild);
        // 5px reserved for the propagated right gap.
        expect(size.width).toBe(195);
    });
    test('multiple width-less siblings stay within the container width even when combined fallbacks exceed it', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 400,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                // Three unsized non-absorber siblings would want 250 each (=750),
                // far above the 400 container. The absorber (editor) must still
                // get at least its minimum.
                { key: 'a' },
                { key: 'b' },
                { key: 'c' },
                { key: 'editor', flexible: true },
            ],
        });
        const { result } = (0, react_1.renderHook)(() => (0, useLayoutItemSizes_1.default)(layout));
        const sizes = result.current;
        const total = sizes.a.width + sizes.b.width + sizes.c.width + sizes.editor.width;
        expect(total).toBeLessThanOrEqual(400);
        expect(sizes.editor.width).toBeGreaterThanOrEqual(40); // itemMinWidth
    });
    test('flexible flag on a hidden child falls back to the last visible sibling', () => {
        const layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 200,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                { key: 'col1', width: 50 },
                { key: 'col2', flexible: true, visible: false },
                { key: 'col3', width: 60 },
            ],
        });
        const col3 = layout.children.find(c => c.key === 'col3');
        expect(col3).not.toHaveProperty('width');
    });
});
//# sourceMappingURL=useLayoutItemSizes.test.js.map