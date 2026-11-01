"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useDragAndDrop_1 = require("./useDragAndDrop");
const defaultColumns = [
    {
        name: 'note.todo_completed',
        width: 40,
    },
    {
        name: 'note.user_updated_time',
        width: 100,
    },
    {
        name: 'note.title',
        width: 0,
    },
];
describe('useDragAndDrop', () => {
    test.each([
        [
            defaultColumns,
            {
                name: 'note.title',
            },
            {
                columnName: 'note.todo_completed',
                location: 'before',
            },
            [
                'note.title',
                'note.todo_completed',
                'note.user_updated_time',
            ],
        ],
        [
            defaultColumns,
            {
                name: 'note.title',
            },
            {
                columnName: 'note.user_updated_time',
                location: 'before',
            },
            [
                'note.todo_completed',
                'note.title',
                'note.user_updated_time',
            ],
        ],
        [
            defaultColumns,
            {
                name: 'note.title',
            },
            {
                columnName: 'note.user_updated_time',
                location: 'after',
            },
            [
                'note.todo_completed',
                'note.user_updated_time',
                'note.title',
            ],
        ],
    ])('should drop columns', (columns, header, insertAt, expected) => {
        const actual = (0, useDragAndDrop_1.dropHeaderAt)(columns, header, insertAt).map(c => c.name);
        expect(actual).toEqual(expected);
    });
});
//# sourceMappingURL=useDragAndDrop.test.js.map