"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const validateColumns_1 = __importDefault(require("./validateColumns"));
const makeColumns = (props) => {
    const columns = [];
    for (const p of props) {
        columns.push(Object.assign({ name: 'note.title', width: 100 }, p));
    }
    return columns;
};
describe('validateColumns', () => {
    test.each([
        [
            [{ width: 100 }, { width: 200 }, { width: 0 }],
            [{ width: 100 }, { width: 200 }, { width: 0 }],
        ],
        [
            [{ width: 100 }, { width: 200 }, { width: 100 }],
            [{ width: 100 }, { width: 200 }, { width: 0 }],
        ],
        [
            [{ width: 0 }, { width: 0 }, { width: 100 }],
            [{ width: 100 }, { width: 100 }, { width: 0 }],
        ],
        [
            [],
            (0, noteListType_1.defaultListColumns)(),
        ],
        [
            null,
            (0, noteListType_1.defaultListColumns)(),
        ],
    ])('should drop columns', (columnProps, expectedProps) => {
        const columns = columnProps ? makeColumns(columnProps) : columnProps;
        const expected = makeColumns(expectedProps);
        const actual = (0, validateColumns_1.default)(columns);
        expect(actual).toEqual(expected);
        const mustBeIdentical = JSON.stringify(columns) === JSON.stringify(expected);
        expect(actual === columns).toBe(mustBeIdentical);
    });
});
//# sourceMappingURL=validateColumns.test.js.map