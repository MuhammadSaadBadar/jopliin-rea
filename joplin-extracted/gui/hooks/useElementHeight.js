"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// This uses a ResizeObserver -- be careful to prevent infinite loops (should be stopped
// early and print a warning). See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
const useElementHeight = (container) => {
    var _a;
    const [height, setHeight] = (0, react_1.useState)((_a = container === null || container === void 0 ? void 0 : container.clientHeight) !== null && _a !== void 0 ? _a : 0);
    (0, react_1.useEffect)(() => {
        if (!container)
            return () => { };
        const observer = new ResizeObserver(() => {
            setHeight(container.clientHeight);
        });
        observer.observe(container);
        return () => {
            observer.disconnect();
        };
    }, [container]);
    return height;
};
exports.default = useElementHeight;
//# sourceMappingURL=useElementHeight.js.map