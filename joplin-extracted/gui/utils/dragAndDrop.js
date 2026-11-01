"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterGlobalDragEndEvent = exports.registerGlobalDragEndEvent = void 0;
let globalDropEventCallback_ = null;
const onGlobalDrop = () => {
    const callback = globalDropEventCallback_;
    (0, exports.unregisterGlobalDragEndEvent)();
    if (callback)
        callback();
};
const registerGlobalDragEndEvent = (callback) => {
    if (globalDropEventCallback_)
        return;
    globalDropEventCallback_ = callback;
    document.addEventListener('dragend', onGlobalDrop);
};
exports.registerGlobalDragEndEvent = registerGlobalDragEndEvent;
const unregisterGlobalDragEndEvent = () => {
    globalDropEventCallback_ = null;
    document.removeEventListener('dragend', onGlobalDrop);
};
exports.unregisterGlobalDragEndEvent = unregisterGlobalDragEndEvent;
//# sourceMappingURL=dragAndDrop.js.map