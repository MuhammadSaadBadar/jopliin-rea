"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const useRootElement_1 = __importDefault(require("./useRootElement"));
describe('useRootElement', () => {
    beforeEach(() => {
        jest.useFakeTimers({ advanceTimers: true });
    });
    test('should find an element with a matching ID', async () => {
        const testElement = document.createElement('div');
        testElement.id = 'test-element-id';
        document.body.appendChild(testElement);
        const { result } = (0, react_1.renderHook)(useRootElement_1.default, {
            initialProps: testElement.id,
        });
        await (0, react_1.act)(async () => {
            await jest.advanceTimersByTimeAsync(100);
        });
        expect(result.current).toBe(testElement);
        testElement.remove();
    });
    test('should redo the element search when the elementId prop changes', async () => {
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        const { rerender, result } = (0, react_1.renderHook)(useRootElement_1.default, {
            initialProps: 'some-id-here',
        });
        await jest.advanceTimersByTimeAsync(100);
        expect(result.current).toBe(null);
        // Searching for another non-existent ID: Should not match
        rerender('updated-id');
        await jest.advanceTimersByTimeAsync(100);
        expect(result.current).toBe(null);
        // Should not match the first element if its ID is set to the original (search
        // should be cancelled).
        testElement.id = 'some-id-here';
        await jest.advanceTimersByTimeAsync(100);
        expect(result.current).toBe(null);
        // Should match if the element ID changes to the updated ID.
        await (0, react_1.act)(async () => {
            testElement.id = 'updated-id';
            await jest.advanceTimersByTimeAsync(100);
        });
        expect(result.current).toBe(testElement);
        testElement.remove();
    });
});
//# sourceMappingURL=useRootElement.test.js.map