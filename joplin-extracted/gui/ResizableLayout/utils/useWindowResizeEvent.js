"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useWindowResizeEvent;
const react_1 = require("react");
const debounce = require('debounce');
function useWindowResizeEvent(eventEmitter) {
    (0, react_1.useEffect)(() => {
        const window_resize = debounce(() => {
            eventEmitter.current.emit('resize');
        }, 500);
        window.addEventListener('resize', window_resize);
        return () => {
            window_resize.clear();
            window.removeEventListener('resize', window_resize);
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
}
//# sourceMappingURL=useWindowResizeEvent.js.map