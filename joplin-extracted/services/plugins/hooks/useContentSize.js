"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const useMessageHandler_1 = __importDefault(require("./useMessageHandler"));
function default_1(viewRef, htmlHash, minWidth, minHeight) {
    const [contentSize, setContentSize] = (0, react_1.useState)({
        width: minWidth,
        height: minHeight,
        hash: '',
    });
    (0, useMessageHandler_1.default)(viewRef, event => {
        if (event.data.message !== 'updateContentSize')
            return;
        const rect = event.data.size;
        let w = rect.width;
        let h = rect.height;
        if (w < minWidth)
            w = minWidth;
        if (h < minHeight)
            h = minHeight;
        const newSize = { width: w, height: h, hash: htmlHash };
        setContentSize((current) => {
            if (current.width === newSize.width && current.height === newSize.height && current.hash === htmlHash)
                return current;
            return newSize;
        });
    });
    return contentSize;
}
//# sourceMappingURL=useContentSize.js.map