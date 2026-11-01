"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const types_1 = require("./types");
function default_1(itemKey) {
    return itemKey.indexOf(types_1.tempContainerPrefix) === 0;
}
//# sourceMappingURL=isTempContainer.js.map