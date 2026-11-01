"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const types_1 = require("../../types");
const toggleHeader = (headerId) => {
    const settingKey = headerId === types_1.HeaderId.TagHeader ? 'tagHeaderIsExpanded' : 'folderHeaderIsExpanded';
    const current = Setting_1.default.value(settingKey);
    Setting_1.default.setValue(settingKey, !current);
};
exports.default = toggleHeader;
//# sourceMappingURL=toggleHeader.js.map