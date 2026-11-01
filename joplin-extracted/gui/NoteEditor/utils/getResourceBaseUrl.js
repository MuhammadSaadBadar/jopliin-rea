"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const getResourceBaseUrl = () => `joplin-content://note-viewer/${Setting_1.default.value('resourceDir')}/`;
exports.default = getResourceBaseUrl;
//# sourceMappingURL=getResourceBaseUrl.js.map