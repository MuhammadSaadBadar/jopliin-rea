"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorPositionToTextOffset = cursorPositionToTextOffset;
// eslint-disable-next-line import/prefer-default-export -- Single exported function is intentional
function cursorPositionToTextOffset(cursorPos, body) {
    if (!body)
        return 0;
    const noteLines = body.split('\n');
    let pos = 0;
    for (let i = 0; i < noteLines.length; i++) {
        if (i > 0)
            pos++; // Need to add the newline that's been removed in the split() call above
        if (i === cursorPos.line) {
            pos += cursorPos.ch;
            break;
        }
        else {
            pos += noteLines[i].length;
        }
    }
    return pos;
}
//# sourceMappingURL=index.js.map