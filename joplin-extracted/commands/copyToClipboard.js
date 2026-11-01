"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const electron_1 = require("electron");
exports.declaration = {
    name: 'copyToClipboard',
};
const runtime = () => {
    return {
        execute: async (_context, content) => {
            if (!content || (typeof content !== 'string'))
                return;
            electron_1.clipboard.writeText(content);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=copyToClipboard.js.map