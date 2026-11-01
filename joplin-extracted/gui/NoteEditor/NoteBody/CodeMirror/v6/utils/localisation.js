"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale_1 = require("@joplin/lib/locale");
// See https://codemirror.net/examples/translate/
exports.default = () => ({
    // @codemirror/view
    'Control character': (0, locale_1._)('Control character'),
    // @codemirror/commands
    'Selection deleted': (0, locale_1._)('Selection deleted'),
    // @codemirror/search
    'Go to line': (0, locale_1._)('Go to line'),
    'go': (0, locale_1._)('go'),
    'Find': (0, locale_1._)('Find'),
    'Replace': (0, locale_1._)('Replace'),
    'next': (0, locale_1._)('next'),
    'previous': (0, locale_1._)('previous'),
    'all': (0, locale_1._)('all'),
    'match case': (0, locale_1._)('match case'),
    'by word': (0, locale_1._)('by word'),
    'replace': (0, locale_1._)('replace'),
    'replace all': (0, locale_1._)('replace all'),
    'close': (0, locale_1._)('close'),
    'current match': (0, locale_1._)('current match'),
    'replaced $ matches': (0, locale_1._)('replaced $ matches'),
    'replaced match on line $': (0, locale_1._)('replaced match on line $'),
    'on line': (0, locale_1._)('on line'),
    // Table editor context menu. These keys must be kept in sync with the
    // state.phrase() calls in packages/editor renderTables.ts.
    'Insert row above': (0, locale_1._)('Insert row above'),
    'Insert row below': (0, locale_1._)('Insert row below'),
    'Insert column left': (0, locale_1._)('Insert column left'),
    'Insert column right': (0, locale_1._)('Insert column right'),
    'Move row up': (0, locale_1._)('Move row up'),
    'Move row down': (0, locale_1._)('Move row down'),
    'Move column left': (0, locale_1._)('Move column left'),
    'Move column right': (0, locale_1._)('Move column right'),
    'Delete row': (0, locale_1._)('Delete row'),
    'Delete column': (0, locale_1._)('Delete column'),
});
//# sourceMappingURL=localisation.js.map