"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const serialize_1 = require("@joplin/lib/services/whiteboard/serialize");
const newNote_1 = require("./newNote");
exports.declaration = {
    name: 'newWhiteboard',
    label: () => (0, locale_1._)('Create whiteboard'),
    iconName: 'fa-th',
};
const runtime = () => {
    return {
        execute: async (_context, title) => {
            await (0, newNote_1.createNoteInActiveFolder)({
                title: title || (0, locale_1._)('Untitled whiteboard'),
                body: (0, serialize_1.newWhiteboardBody)(),
                // A whiteboard isn't a place-stamped capture; skip the
                // reverse-geocode lookup that fires for ordinary new notes.
                updateGeolocation: false,
            });
        },
        enabledCondition: newNote_1.newNoteEnabledConditions,
    };
};
exports.runtime = runtime;
//# sourceMappingURL=newWhiteboard.js.map