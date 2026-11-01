"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = layoutItemProp;
const findItemByKey_1 = __importDefault(require("./findItemByKey"));
function layoutItemProp(layout, key, propName) {
    const item = (0, findItemByKey_1.default)(layout, key);
    if (!item)
        throw new Error(`Could not find layout item: ${key}`);
    return item[propName];
}
//# sourceMappingURL=layoutItemProp.js.map