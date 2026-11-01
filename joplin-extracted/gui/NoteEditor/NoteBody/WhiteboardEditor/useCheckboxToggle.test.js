"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useCheckboxToggle_1 = require("./useCheckboxToggle");
// Joplin's renderer only converts `- [ ]` / `- [x]` items inside bullet lists
// into clickable checkboxes — `*`, `+`, and numbered list markers are ignored.
// `flipNthCheckbox` must count exactly the same subset so the Nth rendered
// checkbox maps to the Nth source-text checkbox.
describe('useCheckboxToggle', () => {
    test('flips an unchecked box to checked', () => {
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('- [ ] todo', 0)).toBe('- [x] todo');
    });
    test('flips a checked box back to unchecked', () => {
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('- [x] done', 0)).toBe('- [ ] done');
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('- [X] done', 0)).toBe('- [ ] done');
    });
    test('targets the Nth checkbox by zero-based index', () => {
        const body = '- [ ] one\n- [ ] two\n- [ ] three';
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 0)).toBe('- [x] one\n- [ ] two\n- [ ] three');
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 1)).toBe('- [ ] one\n- [x] two\n- [ ] three');
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 2)).toBe('- [ ] one\n- [ ] two\n- [x] three');
    });
    test('returns null when index is out of range', () => {
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('- [ ] only one', 1)).toBeNull();
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('no checkboxes here', 0)).toBeNull();
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('', 0)).toBeNull();
    });
    test('ignores list markers other than `-` to match the renderer', () => {
        // `*`, `+`, and numbered markers are not turned into checkboxes by
        // Joplin's renderer, so they must not affect the index either.
        const body = '* [ ] starred\n+ [ ] plused\n1. [ ] numbered\n- [ ] real';
        // The only "real" checkbox is index 0 — it's the dash-prefixed one.
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 0)).toBe('* [ ] starred\n+ [ ] plused\n1. [ ] numbered\n- [x] real');
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 1)).toBeNull();
    });
    test('ignores `[ ]` not preceded by a list marker', () => {
        expect((0, useCheckboxToggle_1.flipNthCheckbox)('Standalone [ ] not a checkbox', 0)).toBeNull();
    });
    test('handles Windows line endings', () => {
        const body = '- [ ] one\r\n- [ ] two';
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 1)).toBe('- [ ] one\r\n- [x] two');
    });
    test('preserves indentation and the surrounding text', () => {
        const body = 'Intro paragraph.\n\n  - [ ] indented\n  - [x] also indented\n\nOutro.';
        expect((0, useCheckboxToggle_1.flipNthCheckbox)(body, 1)).toBe('Intro paragraph.\n\n  - [ ] indented\n  - [ ] also indented\n\nOutro.');
    });
});
//# sourceMappingURL=useCheckboxToggle.test.js.map