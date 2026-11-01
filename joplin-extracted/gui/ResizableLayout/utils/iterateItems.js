"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = iterateItems;
// Callback should return `true` if iteration should continue, or `false` if it
// should stop
function iterateItems(layout, callback) {
    const result = callback(0, layout, null);
    if (result === false)
        return;
    function recurseFind(item, callback) {
        if (item.children) {
            for (let childIndex = 0; childIndex < item.children.length; childIndex++) {
                const child = item.children[childIndex];
                if (callback(childIndex, child, item) === false)
                    return false;
                if (recurseFind(child, callback) === false)
                    return false;
            }
        }
        return true;
    }
    if (recurseFind(layout, callback) === false)
        return;
}
//# sourceMappingURL=iterateItems.js.map