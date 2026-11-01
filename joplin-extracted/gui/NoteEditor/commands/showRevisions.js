"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
exports.declaration = {
    name: 'showRevisions',
};
const runtime = (comp) => {
    return {
        execute: async () => {
            comp.setShowRevisions(true);
        },
        getPriority: () => {
            return comp.isInFocusedDocument() ? 1 : 0;
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=showRevisions.js.map