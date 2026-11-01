"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
exports.declaration = {
    name: 'showLocalSearch',
    label: () => (0, locale_1._)('Search in current note'),
};
const runtime = (comp) => {
    return {
        execute: async () => {
            if (comp.editorRef.current && await comp.editorRef.current.supportsCommand('search')) {
                void comp.editorRef.current.execCommand({ name: 'search' });
            }
            else {
                if (comp.noteSearchBarRef.current) {
                    (0, focusHandler_1.focus)('showLocalSearch', comp.noteSearchBarRef.current);
                }
                else {
                    comp.setShowLocalSearch(true);
                }
            }
        },
        enabledCondition: 'oneNoteSelected',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showLocalSearch.js.map