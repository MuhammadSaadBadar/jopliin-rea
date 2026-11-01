"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTextPatternsLookup = ({ enabled, enableMath }) => {
    const getTextPatterns = (ctx) => {
        if (!enabled)
            return [];
        return [
            // See https://www.tiny.cloud/docs/tinymce/latest/content-behavior-options/#text_patterns
            // for the default TinyMCE text patterns
            { start: '==', end: '==', format: 'joplinHighlight' },
            // Only replace math if math rendering is enabled.
            enableMath && { start: '$', end: '$', cmd: 'joplinMath' },
            { start: '`', end: '`', format: 'code' },
            { start: '*', end: '*', format: 'italic' },
            { start: '**', end: '**', format: 'bold' },
            { start: '#', format: 'h1' },
            { start: '##', format: 'h2' },
            { start: '###', format: 'h3' },
            { start: '####', format: 'h4' },
            { start: '#####', format: 'h5' },
            { start: '######', format: 'h6' },
            { start: '1.', cmd: 'InsertOrderedList' },
            { start: '*', cmd: 'InsertUnorderedList' },
            { start: '-', cmd: 'InsertUnorderedList' },
            // To more closely match Markdown, only do <hr/> replacements if the full line matches the pattern.
            ['---', '***', '___'].includes(ctx.text) && { start: ctx.text, replacement: '<hr/>' },
        ].filter(pattern => !!pattern);
    };
    // Store the lookup callback in a ref so that the editor doesn't need to be reloaded
    // to use the new patterns:
    const patternLookupRef = (0, react_1.useRef)(getTextPatterns);
    patternLookupRef.current = getTextPatterns;
    return patternLookupRef;
};
exports.default = useTextPatternsLookup;
//# sourceMappingURL=useTextPatternsLookup.js.map