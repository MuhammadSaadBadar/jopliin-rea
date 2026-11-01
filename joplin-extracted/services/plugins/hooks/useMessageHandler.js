"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useMessageHandler = (viewRef, onMessage) => {
    const onMessageRef = (0, react_1.useRef)(onMessage);
    onMessageRef.current = onMessage;
    (0, react_1.useEffect)(() => {
        function onMessage_(event) {
            if (event.source !== viewRef.current.contentWindow) {
                return;
            }
            onMessageRef.current(event);
        }
        const containerWindow = viewRef.current.getRootNode().defaultView;
        containerWindow.addEventListener('message', onMessage_);
        return () => {
            containerWindow.removeEventListener('message', onMessage_);
        };
    }, [viewRef]);
};
exports.default = useMessageHandler;
//# sourceMappingURL=useMessageHandler.js.map