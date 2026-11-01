"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const react_1 = require("react");
const useWebViewApi = (editor, containerWindow) => {
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        if (!containerWindow)
            return () => { };
        const editorWindow = editor.getWin();
        const webviewApi = {
            postMessage: async (contentScriptId, message) => {
                const pluginService = PluginService_1.default.instance();
                const plugin = pluginService.pluginById(pluginService.pluginIdByContentScriptId(contentScriptId));
                return await plugin.emitContentScriptMessage(contentScriptId, message);
            },
        };
        editorWindow.webviewApi = webviewApi;
        return () => {
            if (editorWindow.webviewApi === webviewApi) {
                editorWindow.webviewApi = undefined;
            }
        };
    }, [editor, containerWindow]);
};
exports.default = useWebViewApi;
//# sourceMappingURL=useWebViewApi.js.map