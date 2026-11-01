"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const validateLayout_1 = __importDefault(require("./validateLayout"));
const movements_1 = require("./movements");
const findItemByKey_1 = __importDefault(require("./findItemByKey"));
describe('movements', () => {
    test('should move items horizontally to the right', () => {
        let layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 100,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                },
                {
                    key: 'col2',
                },
                {
                    key: 'col3',
                },
            ],
        });
        expect(() => (0, movements_1.moveHorizontal)(layout, 'col1', -1)).toThrow();
        layout = (0, movements_1.moveHorizontal)(layout, 'col1', 1);
        expect(layout.children[0].children[0].key).toBe('col2');
        expect(layout.children[0].children[1].key).toBe('col1');
        expect(layout.children[1].key).toBe('col3');
        layout = (0, movements_1.moveHorizontal)(layout, 'col1', 1);
        expect(layout.children[0].key).toBe('col2');
        expect(layout.children[1].key).toBe('col1');
        expect(layout.children[2].key).toBe('col3');
        layout = (0, movements_1.moveHorizontal)(layout, 'col1', 1);
        layout = (0, movements_1.moveHorizontal)(layout, 'col1', 1);
        expect(() => (0, movements_1.moveHorizontal)(layout, 'col1', 1)).toThrow();
    });
    test('should move items horizontally to the left', () => {
        let layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 100,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    direction: types_1.LayoutItemDirection.Column,
                    children: [
                        { key: 'item1' },
                        { key: 'item2' },
                    ],
                },
                {
                    key: 'col2',
                },
            ],
        });
        layout = (0, movements_1.moveHorizontal)(layout, 'item2', -1);
        expect(layout.children[0].key).toBe('item2');
        expect(layout.children[1].key).toBe('item1');
        expect(layout.children[2].key).toBe('col2');
    });
    test('should move items vertically', () => {
        let layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 100,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                },
                {
                    key: 'col2',
                    direction: types_1.LayoutItemDirection.Column,
                    children: [
                        { key: 'row1' },
                        { key: 'row2' },
                        { key: 'row3' },
                    ],
                },
                {
                    key: 'col3',
                },
            ],
        });
        layout = (0, movements_1.moveVertical)(layout, 'row3', -1);
        expect(layout.children[1].children[0].key).toBe('row1');
        expect(layout.children[1].children[1].key).toBe('row3');
        expect(layout.children[1].children[2].key).toBe('row2');
    });
    test('should tell if item can be moved', () => {
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
                        { key: 'row1' },
                        { key: 'row2' },
                    ],
                },
                {
                    key: 'col2',
                },
            ],
        });
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Up, (0, findItemByKey_1.default)(layout, 'col1'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Down, (0, findItemByKey_1.default)(layout, 'col1'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Left, (0, findItemByKey_1.default)(layout, 'col1'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Right, (0, findItemByKey_1.default)(layout, 'col1'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Up, (0, findItemByKey_1.default)(layout, 'row1'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Down, (0, findItemByKey_1.default)(layout, 'row1'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Left, (0, findItemByKey_1.default)(layout, 'row1'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Right, (0, findItemByKey_1.default)(layout, 'row1'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Up, (0, findItemByKey_1.default)(layout, 'row2'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Down, (0, findItemByKey_1.default)(layout, 'row2'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Left, (0, findItemByKey_1.default)(layout, 'row2'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Right, (0, findItemByKey_1.default)(layout, 'row2'), (0, findItemByKey_1.default)(layout, 'col1'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Up, (0, findItemByKey_1.default)(layout, 'col2'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Down, (0, findItemByKey_1.default)(layout, 'col2'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(false);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Left, (0, findItemByKey_1.default)(layout, 'col2'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(true);
        expect((0, movements_1.canMove)(movements_1.MoveDirection.Right, (0, findItemByKey_1.default)(layout, 'col2'), (0, findItemByKey_1.default)(layout, 'root'))).toBe(false);
    });
    test('container with only one child should take the width of its parent', () => {
        let layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 100,
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
        layout = (0, movements_1.moveHorizontal)(layout, 'col2', -1);
        expect(layout.children[0].children[0].key).toBe('col1');
        expect(layout.children[0].children[0].width).toBe(undefined);
    });
    test('temp container should take the width of the child it replaces', () => {
        let layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 100,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 20,
                },
                {
                    key: 'col2',
                    width: 80,
                },
                {
                    key: 'col3',
                },
            ],
        });
        layout = (0, movements_1.moveHorizontal)(layout, 'col2', -1);
        expect(layout.children[0].width).toBe(20);
        expect(layout.children[0].children[0].width).toBe(undefined);
        expect(layout.children[0].children[1].width).toBe(undefined);
    });
    test('last child should have flexible width if all siblings have fixed width', () => {
        let layout = (0, validateLayout_1.default)({
            key: 'root',
            width: 100,
            height: 100,
            direction: types_1.LayoutItemDirection.Row,
            children: [
                {
                    key: 'col1',
                    width: 20,
                },
                {
                    key: 'col2',
                    width: 20,
                },
                {
                    key: 'col3',
                },
            ],
        });
        layout = (0, movements_1.moveHorizontal)(layout, 'col3', -1);
        expect(layout.children[0].width).toBe(20);
        expect(layout.children[1].width).toBe(undefined);
    });
});
//# sourceMappingURL=movements.test.js.map