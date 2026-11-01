"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setLayoutItemProps;
const immer_1 = require("immer");
const validateLayout_1 = __importDefault(require("./validateLayout"));
function setLayoutItemProps(layout, key, props) {
    return (0, validateLayout_1.default)((0, immer_1.produce)(layout, (draftState) => {
        function recurseFind(item) {
            if (item.key === key) {
                for (const n in props) {
                    item[n] = props[n];
                }
            }
            else {
                if (item.children) {
                    for (const child of item.children) {
                        recurseFind(child);
                    }
                }
            }
        }
        recurseFind(draftState);
    }));
}
//# sourceMappingURL=setLayoutItemProps.js.map