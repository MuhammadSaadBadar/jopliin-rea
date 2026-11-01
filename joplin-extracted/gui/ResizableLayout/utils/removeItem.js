"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const immer_1 = require("immer");
const iterateItems_1 = __importDefault(require("./iterateItems"));
const validateLayout_1 = __importDefault(require("./validateLayout"));
function default_1(layout, itemKey) {
    const output = (0, immer_1.produce)(layout, (layoutDraft) => {
        (0, iterateItems_1.default)(layoutDraft, (itemIndex, item, parent) => {
            if (item.key === itemKey) {
                parent.children.splice(itemIndex, 1);
                return false;
            }
            return true;
        });
    });
    return output !== layout ? (0, validateLayout_1.default)(output) : layout;
}
//# sourceMappingURL=removeItem.js.map