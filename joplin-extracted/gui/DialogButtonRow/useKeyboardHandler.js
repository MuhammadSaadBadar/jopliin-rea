"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const dom_1 = require("@joplin/lib/dom");
const globalKeydownHandlers = [];
exports.default = (props) => {
    const [elementId] = (0, react_1.useState)(`${Math.round(Math.random() * 10000000)}`);
    const globalKeydownHandlersRef = (0, react_1.useRef)(globalKeydownHandlers);
    (0, react_1.useEffect)(() => {
        globalKeydownHandlersRef.current.push(elementId);
        return () => {
            const idx = globalKeydownHandlersRef.current.findIndex(e => e === elementId);
            // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
            globalKeydownHandlersRef.current.splice(idx, 1);
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
    const isTopDialog = () => {
        const ln = globalKeydownHandlersRef.current.length;
        return ln && globalKeydownHandlersRef.current[ln - 1] === elementId;
    };
    const isInSubModal = (targetElement) => {
        // If we are inside a sub-modal within the dialog, we shouldn't handle
        // global key events. It can be for example the emoji picker. In general
        // it's difficult to know whether an element is a modal or not, so we'll
        // have to add special cases here. Normally there shouldn't be many of
        // these.
        if ((0, dom_1.isInsideContainer)(targetElement, 'emoji-picker'))
            return true;
        return false;
    };
    const onKeyDown = (0, react_1.useCallback)((event) => {
        // Early exit if it's neither ENTER nor ESCAPE, because isInSubModal
        // function can be costly.
        if (event.keyCode !== 13 && event.keyCode !== 27)
            return;
        if (!isTopDialog() || isInSubModal(event.target))
            return;
        if (event.keyCode === 13 && props.onOkButtonClick) {
            if ('nodeName' in event.target && event.target.nodeName === 'INPUT') {
                const target = event.target;
                if (target.type !== 'button' && target.type !== 'checkbox') {
                    event.preventDefault();
                    props.onOkButtonClick();
                }
            }
        }
        else if (event.keyCode === 27 && props.onCancelButtonClick) {
            event.preventDefault();
            props.onCancelButtonClick();
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.onOkButtonClick, props.onCancelButtonClick]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);
    return onKeyDown;
};
//# sourceMappingURL=useKeyboardHandler.js.map