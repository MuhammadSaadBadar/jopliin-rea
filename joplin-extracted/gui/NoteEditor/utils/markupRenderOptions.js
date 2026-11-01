"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MdToHtml_1 = require("@joplin/renderer/MdToHtml");
const types_1 = require("@joplin/renderer/types");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.default = (override = null) => {
    return Object.assign({ plugins: {
            checkbox: {
                checkboxRenderingType: 2,
            },
            link_open: {
                linkRenderingType: MdToHtml_1.LinkRenderingType.HrefHandler,
            },
        }, replaceResourceInternalToExternalLinks: true, globalSettings: (0, types_1.getGlobalSettings)(Setting_1.default) }, override);
};
//# sourceMappingURL=markupRenderOptions.js.map