"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
exports.declaration = {
    name: 'focusElementToolbar',
    label: () => (0, locale_1._)('Toolbar'),
    parentLabel: () => (0, locale_1._)('Focus'),
};
const runtime = (dependencies) => {
    return {
        execute: async () => {
            if (!dependencies || !dependencies.containerRef || !dependencies.containerRef.current)
                return;
            const firstButtonOnRTEToolbar = dependencies.containerRef.current.querySelector('.tox-toolbar__group button');
            if (firstButtonOnRTEToolbar) {
                (0, focusHandler_1.focus)('focusElementToolbar', firstButtonOnRTEToolbar);
                return;
            }
            const firstButtonOnMarkdownToolbar = dependencies.containerRef.current.querySelector('#CodeMirrorToolbar .button:not(.disabled)');
            if (firstButtonOnMarkdownToolbar) {
                (0, focusHandler_1.focus)('focusElementToolbar', firstButtonOnMarkdownToolbar);
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=focusElementToolbar.js.map