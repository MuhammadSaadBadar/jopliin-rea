"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const locale_1 = require("@joplin/lib/locale");
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const reducer_1 = require("@joplin/lib/services/plugins/reducer");
const layoutKeyToLabel = (key, plugins) => {
    if (key === 'sideBar')
        return (0, locale_1._)('Sidebar');
    if (key === 'noteList')
        return (0, locale_1._)('Note list');
    if (key === 'editor')
        return (0, locale_1._)('Editor');
    if (key === 'chatPanel')
        return (0, locale_1._)('AI Chat');
    const viewInfo = reducer_1.utils.viewInfoByViewId(plugins, key);
    if (viewInfo) {
        return PluginService_1.default.instance().safePluginNameById(viewInfo.plugin.id);
    }
    return key;
};
exports.default = layoutKeyToLabel;
//# sourceMappingURL=layoutKeyToLabel.js.map