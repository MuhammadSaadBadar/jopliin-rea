"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale_1 = require("@joplin/lib/locale");
const titles = {
    'note.checkboxes': () => (0, locale_1._)('Checkbox completion'),
    'note.folder.title': () => (0, locale_1._)('Notebook: %s', (0, locale_1._)('Title')),
    'note.is_todo': () => (0, locale_1._)('To-do'),
    'note.latitude': () => (0, locale_1._)('Latitude'),
    'note.longitude': () => (0, locale_1._)('Longitude'),
    'note.source_url': () => (0, locale_1._)('Source'),
    'note.tags': () => (0, locale_1._)('Tags'),
    'note.title': () => (0, locale_1._)('Title'),
    'note.todo_completed': () => (0, locale_1._)('Completed'),
    'note.todo_due': () => (0, locale_1._)('Due'),
    'note.user_created_time': () => (0, locale_1._)('Created'),
    'note.user_updated_time': () => (0, locale_1._)('Updated'),
};
exports.default = (name) => {
    return titles[name]();
};
//# sourceMappingURL=getColumnTitle.js.map