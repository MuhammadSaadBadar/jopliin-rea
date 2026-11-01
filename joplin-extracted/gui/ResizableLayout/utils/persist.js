"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLayout = saveLayout;
exports.loadLayout = loadLayout;
const immer_1 = require("immer");
const iterateItems_1 = __importDefault(require("./iterateItems"));
const validateLayout_1 = __importDefault(require("./validateLayout"));
function saveLayout(layout) {
    const propertyWhiteList = [
        'visible',
        'width',
        'height',
        'children',
        'key',
        'context',
        'flexible',
    ];
    return (0, immer_1.produce)(layout, (draft) => {
        delete draft.width;
        delete draft.height;
        (0, iterateItems_1.default)(draft, (_itemIndex, item, _parent) => {
            for (const k of Object.keys(item)) {
                if (!propertyWhiteList.includes(k))
                    delete item[k];
            }
            return true;
        });
    });
}
function loadLayout(layout, defaultLayout, rootSize) {
    let output = null;
    if (layout) {
        output = Object.assign({}, layout);
    }
    else {
        output = Object.assign({}, defaultLayout);
    }
    output.width = rootSize.width;
    output.height = rootSize.height;
    return (0, validateLayout_1.default)(output);
}
//# sourceMappingURL=persist.js.map