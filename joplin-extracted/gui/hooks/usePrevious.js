"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePrevious;
const react_1 = require("react");
function usePrevious(value, initialValue = null) {
    const ref = (0, react_1.useRef)(initialValue);
    (0, react_1.useEffect)(() => {
        ref.current = value;
    });
    return ref.current;
}
//# sourceMappingURL=usePrevious.js.map