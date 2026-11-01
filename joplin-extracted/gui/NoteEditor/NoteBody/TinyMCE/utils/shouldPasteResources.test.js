"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shouldPasteResources_1 = __importDefault(require("./shouldPasteResources"));
describe('shouldPasteResources', () => {
    test.each([
        [
            '',
            '',
            [],
            true,
        ],
        [
            'some text',
            '',
            [],
            false,
        ],
        [
            '',
            '<b>some html<b>',
            [],
            false,
        ],
        [
            '',
            '<img src="https://example.com/img.png"/>',
            [],
            false,
        ],
        [
            'some text',
            '<img src="https://example.com/img.png"/>',
            [],
            false,
        ],
        [
            '',
            '<img src="https://example.com/img.png"/><p>Some text</p>',
            [],
            false,
        ],
    ])('should tell if clipboard content should be processed as resources', (pastedText, pastedHtml, resourceMds, expected) => {
        const actual = (0, shouldPasteResources_1.default)(pastedText, pastedHtml, resourceMds);
        expect(actual).toBe(expected);
    });
});
//# sourceMappingURL=shouldPasteResources.test.js.map