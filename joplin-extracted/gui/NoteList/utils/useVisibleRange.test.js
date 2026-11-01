"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useVisibleRange_1 = __importDefault(require("./useVisibleRange"));
const react_1 = require("@testing-library/react");
describe('useVisibleRange', () => {
    test('should calculate indexes', () => {
        // IN: scrollTop, listSize, itemSize, noteCount, flow
        //
        // OUT: [itemsPerLine, startNoteIndex, endNoteIndex, startLineIndex, endLineIndex, totalLineCount, visibleItemCount]
        const testCases = [
            [
                1,
                150,
                { width: 100, height: 400 },
                { width: 100, height: 100 },
                8,
                [1, 5, 1, 5, 8, 5],
            ],
            [
                2,
                100,
                { width: 220, height: 380 },
                { width: 100, height: 100 },
                12,
                [2, 9, 1, 4, 6, 8],
            ],
            [
                2,
                50,
                { width: 220, height: 300 },
                { width: 100, height: 100 },
                9,
                [0, 7, 0, 3, 5, 8],
            ],
            [
                4,
                0,
                { width: 410, height: 450 },
                { width: 100, height: 100 },
                30,
                [0, 19, 0, 4, 8, 20],
            ],
        ];
        for (const [scrollTop, listSize, itemSize, noteCount, flow, expected] of testCases) {
            const { result } = (0, react_1.renderHook)(() => (0, useVisibleRange_1.default)(scrollTop, listSize, itemSize, noteCount, flow));
            expect(result.current).toEqual(expected);
        }
    });
});
//# sourceMappingURL=useVisibleRange.test.js.map