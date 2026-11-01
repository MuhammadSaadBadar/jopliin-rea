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
const React = __importStar(require("react"));
const react_1 = require("@testing-library/react");
const searchHighlight_1 = __importDefault(require("./searchHighlight"));
describe('searchHighlight', () => {
    const countMarks = (result) => {
        return result.filter((element) => React.isValidElement(element) && element.type === 'mark').length;
    };
    it('should highlight all matching occurrences (case-insensitive)', () => {
        const text = 'Synchronization settings for sync behavior';
        const query = 'sync';
        const result = (0, searchHighlight_1.default)(text, query);
        const markCount = countMarks(result);
        expect(markCount).toBe(2);
    });
    it('should return original text when query is empty', () => {
        const text = 'Some test text';
        const resultEmpty = (0, searchHighlight_1.default)(text, '');
        expect(resultEmpty).toBe(text);
    });
    it('should return original text when query is whitespace only', () => {
        const text = 'Some test text';
        const resultWhitespace = (0, searchHighlight_1.default)(text, '   ');
        expect(resultWhitespace).toBe(text);
    });
    it('should return original text when input text is empty', () => {
        const result = (0, searchHighlight_1.default)('', 'query');
        expect(result).toBe('');
    });
    it('should handle special regex characters in query', () => {
        const text = 'Test (nested) [brackets] and {braces}';
        const query = '(nested)';
        const result = (0, searchHighlight_1.default)(text, query);
        const markCount = countMarks(result);
        expect(markCount).toBe(1);
    });
    it('should render mark elements for case-insensitive matches', () => {
        const result = (0, searchHighlight_1.default)('Synchronization', 'sync');
        const rendered = (0, react_1.render)(React.createElement(React.Fragment, null, result));
        const marks = rendered.container.querySelectorAll('mark');
        expect(marks.length).toBeGreaterThan(0);
    });
    it('should preserve full text content when highlighting', () => {
        const text = 'Search and Find';
        const result = (0, searchHighlight_1.default)(text, 'find');
        const rendered = (0, react_1.render)(React.createElement(React.Fragment, null, result));
        expect(rendered.container.textContent).toBe(text);
    });
    it('should render highlighted mark for matches', () => {
        var _a;
        const result = (0, searchHighlight_1.default)('Find this', 'find');
        const rendered = (0, react_1.render)(React.createElement(React.Fragment, null, result));
        const marks = rendered.container.querySelectorAll('mark');
        expect(marks.length).toBeGreaterThan(0);
        expect((_a = marks[0].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()).toContain('find');
    });
});
//# sourceMappingURL=searchHighlight.test.js.map