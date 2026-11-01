"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const immer_1 = require("immer");
const iterateItems_1 = __importDefault(require("./iterateItems"));
const validateLayout_1 = __importDefault(require("./validateLayout"));
function default_1(layout) {
    const itemsToRemove = [];
    const output = (0, immer_1.produce)(layout, (layoutDraft) => {
        (0, iterateItems_1.default)(layoutDraft, (itemIndex, item, parent) => {
            if (!item.key)
                itemsToRemove.push({ parent, index: itemIndex });
            return true;
        });
        itemsToRemove.sort((a, b) => {
            return a.index > b.index ? -1 : +1;
        });
        for (const item of itemsToRemove) {
            item.parent.children.splice(item.index, 1);
        }
    });
    return output !== layout ? (0, validateLayout_1.default)(output) : layout;
}
//# sourceMappingURL=removeKeylessItems.js.map