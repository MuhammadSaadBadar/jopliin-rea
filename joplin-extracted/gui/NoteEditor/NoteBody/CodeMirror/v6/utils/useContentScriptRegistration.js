"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@joplin/lib/services/plugins/api/types");
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const path_1 = require("path");
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../../../../services/bridge"));
const useContentScriptRegistration = ({ editor, pluginStates }) => {
    const loadedContentScriptRefs = (0, react_1.useRef)(new Map());
    const editorId = (0, react_1.useId)();
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (!editor) {
            return;
        }
        const contentScripts = [];
        for (const pluginId in pluginStates) {
            const pluginState = pluginStates[pluginId];
            const codeMirrorContentScripts = (_a = pluginState.contentScripts[types_1.ContentScriptType.CodeMirrorPlugin]) !== null && _a !== void 0 ? _a : [];
            for (const contentScript of codeMirrorContentScripts) {
                // Ensure that the key is unique to the (pluginId, editorId, contentScript) set.
                // Include the plugin ID to prevent ID collisions if multiple plugins register
                // content scripts with the same ID:
                const scriptId = `${pluginId}::${contentScript.id}`;
                (_b = loadedContentScriptRefs.current.get(scriptId)) === null || _b === void 0 ? void 0 : _b.revoke();
                contentScripts.push({
                    pluginId,
                    contentScriptId: contentScript.id,
                    contentScriptJs: async (context) => {
                        const handle = await registerContentScriptWithMainProcess({
                            scriptPath: contentScript.path,
                            context,
                            key: `${editorId}::${scriptId}`,
                        });
                        loadedContentScriptRefs.current.set(scriptId, handle);
                        return { uri: handle.uri };
                    },
                    loadCssAsset: (name) => {
                        const assetPath = (0, path_1.dirname)(contentScript.path);
                        const path = shim_1.default.fsDriver().resolveRelativePathWithinDir(assetPath, name);
                        return shim_1.default.fsDriver().readFile(path, 'utf8');
                    },
                    postMessageHandler: (message) => {
                        const plugin = PluginService_1.default.instance().pluginById(pluginId);
                        return plugin.emitContentScriptMessage(contentScript.id, message);
                    },
                });
            }
        }
        void editor.setContentScripts(contentScripts);
    }, [editor, pluginStates, editorId]);
    (0, react_1.useEffect)(() => () => {
        for (const script of loadedContentScriptRefs.current.values()) {
            script.revoke();
        }
        loadedContentScriptRefs.current.clear();
    }, []);
};
const registerContentScriptWithMainProcess = async ({ key, scriptPath, context }) => {
    const contentScriptJs = [
        context.contentScriptStartJs,
        await shim_1.default.fsDriver().readFile(scriptPath),
        context.contentScriptEndJs,
    ].join('\n');
    const content = (0, bridge_1.default)().electronApp().getPluginProtocolHandler().registerContentScript(encodeURIComponent(key), contentScriptJs);
    return content;
};
exports.default = useContentScriptRegistration;
//# sourceMappingURL=useContentScriptRegistration.js.map