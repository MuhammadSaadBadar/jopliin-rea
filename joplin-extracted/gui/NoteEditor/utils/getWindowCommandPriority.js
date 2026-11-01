"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getWindowCommandPriority = (contentContainer, inTargetWindow) => {
    // If there's an explicit target window, always prefer the runtime
    if (inTargetWindow)
        return 3;
    if (!contentContainer.current)
        return 0;
    const containerDocument = contentContainer.current.getRootNode();
    if (!containerDocument || !containerDocument.hasFocus())
        return 0;
    if (contentContainer.current.contains(containerDocument.activeElement)) {
        return 2;
    }
    // Container document has focus, but not this editor.
    return 1;
};
exports.default = getWindowCommandPriority;
//# sourceMappingURL=getWindowCommandPriority.js.map