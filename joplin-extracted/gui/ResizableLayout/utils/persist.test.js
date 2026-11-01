"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const persist_1 = require("./persist");
const types_1 = require("./types");
const validateLayout_1 = __importDefault(require("./validateLayout"));
describe('persist', () => {
    test('should save layout and filter out non-user properties', () => {
        const layout = (0, validateLayout_1.default)({
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
                    direction: types_1.LayoutItemDirection.Column,
                    children: [
                        { key: 'item1', height: 20 },
                        { key: 'item2' },
                    ],
                },
                {
                    key: 'col3',
                },
            ],
        });
        const toSave = (0, persist_1.saveLayout)(layout);
        expect(toSave.key).toBe('root');
        expect(toSave.width).toBeUndefined();
        expect(toSave.height).toBeUndefined();
        expect(toSave.direction).toBeUndefined();
        expect(toSave.children.length).toBe(3);
        expect(toSave.children[1].key).toBe('col2');
        expect(toSave.children[1].direction).toBeUndefined();
    });
    test('should load a layout', () => {
        const layout = {
            key: 'root',
            children: [
                {
                    key: 'col1',
                    width: 50,
                },
                {
                    key: 'col2',
                    children: [
                        { key: 'item1', height: 20 },
                        { key: 'item2' },
                    ],
                },
                {
                    key: 'col3',
                },
            ],
        };
        const loaded = (0, persist_1.loadLayout)(layout, null, { width: 100, height: 200 });
        expect(loaded.key).toBe('root');
        expect(loaded.width).toBe(100);
        expect(loaded.height).toBe(200);
        expect(loaded.direction).toBe(types_1.LayoutItemDirection.Row);
        expect(loaded.children.length).toBe(3);
        expect(loaded.children[1].key).toBe('col2');
        expect(loaded.children[1].direction).toBe(types_1.LayoutItemDirection.Column);
    });
});
//# sourceMappingURL=persist.test.js.map