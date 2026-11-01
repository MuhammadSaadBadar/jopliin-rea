"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useFocusVisible = (containerRef, onFocusEnter) => {
    const [focusVisible, setFocusVisible] = (0, react_1.useState)(false);
    const onFocusEnterRef = (0, react_1.useRef)(onFocusEnter);
    onFocusEnterRef.current = onFocusEnter;
    const focusVisibleRef = (0, react_1.useRef)(focusVisible);
    focusVisibleRef.current = focusVisible;
    const onFocusVisible = (0, react_1.useCallback)(() => {
        if (!focusVisibleRef.current) {
            setFocusVisible(true);
            onFocusEnterRef.current();
        }
    }, []);
    const onFocus = (0, react_1.useCallback)(() => {
        if (containerRef.current.matches(':focus-visible')) {
            onFocusVisible();
        }
    }, [containerRef, onFocusVisible]);
    const onKeyUp = (0, react_1.useCallback)(() => {
        if (containerRef.current.contains(document.activeElement)) {
            onFocusVisible();
        }
    }, [containerRef, onFocusVisible]);
    const onBlur = (0, react_1.useCallback)(() => setFocusVisible(false), []);
    return {
        focusVisible,
        onFocus,
        // When focus becomes visible due to a key press, but the item was already
        // focused, no new focus event is emitted and the browser :focus-visible doesn't
        // change. As such, we need to handle this case ourselves.
        onKeyUp,
        onBlur,
    };
};
exports.default = useFocusVisible;
//# sourceMappingURL=useFocusVisible.js.map