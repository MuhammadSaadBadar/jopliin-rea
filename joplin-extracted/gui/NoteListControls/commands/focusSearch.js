"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
exports.declaration = {
    name: 'focusSearch',
    label: () => (0, locale_1._)('Search in all the notes'),
};
const runtime = (searchBarRef) => {
    return {
        execute: async () => {
            if (searchBarRef.current)
                searchBarRef.current.select();
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusSearch.js.map