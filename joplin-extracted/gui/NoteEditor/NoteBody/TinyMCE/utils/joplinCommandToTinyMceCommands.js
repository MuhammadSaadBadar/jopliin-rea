"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joplinCommandToTinyMceCommands = void 0;
// If the mapping is simply `true` it means that the command is supported via
// useWindowCommandHandlers.ts. We still add it here to have the complete list
// of supported commands.
exports.joplinCommandToTinyMceCommands = {
    'textBold': { name: 'mceToggleFormat', value: 'bold' },
    'textItalic': { name: 'mceToggleFormat', value: 'italic' },
    'textCode': { name: 'mceToggleFormat', value: 'code' },
    'textLink': { name: 'mceLink' },
    'textBulletedList': { name: 'InsertUnorderedList' },
    'textNumberedList': { name: 'InsertOrderedList' },
    'search': { name: 'SearchReplace' },
    'attachFile': { name: 'joplinAttach' },
    'insertDateTime': true,
    'textCopy': true,
    'textCut': true,
    'textPaste': true,
    'textSelectAll': true,
};
//# sourceMappingURL=joplinCommandToTinyMceCommands.js.map