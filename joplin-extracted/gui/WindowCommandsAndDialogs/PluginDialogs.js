"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const UserWebviewDialog_1 = __importDefault(require("../../services/plugins/UserWebviewDialog"));
const reducer_1 = require("@joplin/lib/services/plugins/reducer");
const WebviewController_1 = require("@joplin/lib/services/plugins/WebviewController");
const PluginDialogs = props => {
    var _a, _b;
    const output = [];
    const infos = reducer_1.utils.viewInfosByType(props.plugins, 'webview');
    for (const info of infos) {
        const { plugin, view } = info;
        if (view.containerType !== WebviewController_1.ContainerType.Dialog)
            continue;
        if (!props.visibleDialogs[view.id])
            continue;
        const html = (_b = (_a = props.pluginHtmlContents[plugin.id]) === null || _a === void 0 ? void 0 : _a[view.id]) !== null && _b !== void 0 ? _b : '';
        output.push(React.createElement(UserWebviewDialog_1.default, { key: view.id, viewId: view.id, themeId: props.themeId, html: html, scripts: view.scripts, pluginId: plugin.id, buttons: view.buttons, fitToContent: view.fitToContent }));
    }
    if (!output.length)
        return null;
    return (React.createElement("div", { className: 'user-webview-dialog-container' }, output));
};
exports.default = PluginDialogs;
//# sourceMappingURL=PluginDialogs.js.map