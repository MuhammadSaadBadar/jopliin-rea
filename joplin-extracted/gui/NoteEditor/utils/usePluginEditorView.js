"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const getShownPluginEditorView_1 = __importDefault(require("@joplin/lib/services/plugins/utils/getShownPluginEditorView"));
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
// If a plugin editor should be shown for the current note, this function will return the plugin and
// associated view.
exports.default = (plugins) => {
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    return (0, react_1.useMemo)(() => {
        return (0, getShownPluginEditorView_1.default)(plugins, windowId);
    }, [plugins, windowId]);
};
//# sourceMappingURL=usePluginEditorView.js.map