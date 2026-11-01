"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'search',
    iconName: 'icon-search',
};
const runtime = () => {
    return {
        execute: async () => {
            // Doesn't do anything for now but could be used to
            // automatically focus the search field (using the
            // `focusSearch` command) and then set an initial search.
            // However not straightforward to implement since the SearchBar
            // is not a controlled component.
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=search.js.map