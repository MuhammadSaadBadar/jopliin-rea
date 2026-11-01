"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = findItemByKey;
function findItemByKey(layout, key) {
    if (!layout)
        throw new Error('Layout cannot be null');
    function recurseFind(item) {
        if (item.key === key)
            return item;
        if (item.children) {
            for (const child of item.children) {
                const found = recurseFind(child);
                if (found)
                    return found;
            }
        }
        return null;
    }
    return recurseFind(layout);
}
//# sourceMappingURL=findItemByKey.js.map