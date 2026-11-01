"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeAccelerator_1 = __importDefault(require("./normalizeAccelerator"));
const types_1 = require("./types");
describe('normalizeAccelerator', () => {
    test.each([
        ['Z', { v6: 'z', v5: 'Z' }],
        ['Alt+A', { v6: 'Alt-a', v5: 'Alt-A' }],
        ['Shift+A', { v6: 'Shift-a', v5: 'Shift-A' }],
        ['Shift+Up', { v6: 'Shift-ArrowUp', v5: 'Shift-Up' }],
    ])('should convert single-letter key names to lowercase for CM6, keep case unchanged for CM5 (%j)', (original, expected) => {
        expect((0, normalizeAccelerator_1.default)(original, types_1.CodeMirrorVersion.CodeMirror6)).toBe(expected.v6);
        expect((0, normalizeAccelerator_1.default)(original, types_1.CodeMirrorVersion.CodeMirror5)).toBe(expected.v5);
    });
});
//# sourceMappingURL=normalizeAccelerator.test.js.map