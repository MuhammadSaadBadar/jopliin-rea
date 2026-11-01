"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWhiteboardContext = exports.WhiteboardContext = void 0;
const react_1 = require("react");
exports.WhiteboardContext = (0, react_1.createContext)(null);
const useWhiteboardContext = () => {
    const ctx = (0, react_1.useContext)(exports.WhiteboardContext);
    if (!ctx)
        throw new Error('WhiteboardContext used outside provider');
    return ctx;
};
exports.useWhiteboardContext = useWhiteboardContext;
//# sourceMappingURL=WhiteboardContext.js.map