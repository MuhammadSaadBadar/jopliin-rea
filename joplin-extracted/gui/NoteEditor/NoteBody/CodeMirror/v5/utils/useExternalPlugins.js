"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useExternalPlugins;
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../../../../services/bridge"));
const loadContentScripts_1 = require("@joplin/lib/services/plugins/utils/loadContentScripts");
const path_1 = require("path");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const uuid_1 = __importDefault(require("@joplin/lib/uuid"));
const registry_1 = require("@joplin/lib/registry");
const addPluginDependency = (path) => {
    const id = `content-script-${encodeURIComponent(path)}`;
    if (document.getElementById(id)) {
        return;
    }
    const element = document.createElement('script');
    element.setAttribute('id', id);
    element.setAttribute('src', path);
    document.head.appendChild(element);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Receives dynamically-loaded CodeMirror 5 namespace; @types/codemirror's signature is too narrow for plugin registration
function useExternalPlugins(CodeMirror, plugins) {
    const [options, setOptions] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        let newOptions = {};
        const contentScripts = (0, loadContentScripts_1.contentScriptsToCodeMirrorPlugin)(plugins);
        const addedElements = [];
        for (const contentScript of contentScripts) {
            try {
                const mod = contentScript.module;
                if (mod.codeMirrorResources) {
                    for (const asset of mod.codeMirrorResources) {
                        try {
                            let assetPath = shim_1.default.fsDriver().resolveRelativePathWithinDir(`${(0, bridge_1.default)().vendorDir()}/lib/codemirror/`, asset);
                            // Compatibility with old versions of Joplin, where the file extension was automatically added by require().
                            if ((0, path_1.extname)(assetPath) === '') {
                                assetPath += '.js';
                            }
                            addPluginDependency(assetPath);
                        }
                        catch (error) {
                            error.message = `${asset} is not a valid CodeMirror asset, keymap or mode. You can find a list of valid assets here: https://codemirror.net/doc/manual.html#addons`;
                            throw error;
                        }
                    }
                }
                if (mod.codeMirrorOptions) {
                    newOptions = Object.assign(Object.assign({}, newOptions), mod.codeMirrorOptions);
                }
                if (mod.assets) {
                    const cssStrings = [];
                    for (const asset of mod.assets()) {
                        let mime = asset.mime;
                        if (!mime && asset.inline)
                            throw new Error('Mime type is required for inline assets');
                        if (!mime && asset.name) {
                            const ext = (0, path_1.extname)(asset.name).toLowerCase();
                            if (ext === '.css')
                                mime = 'text/css';
                        }
                        if (mime !== 'text/css')
                            throw new Error('Only css assets are supported for CodeMirror plugins');
                        if (asset.inline) {
                            cssStrings.push(asset.text);
                        }
                        else {
                            addedElements.push(addScript(shim_1.default.fsDriver().resolveRelativePathWithinDir(contentScript.assetPath, asset.name), contentScript.id));
                        }
                    }
                    if (cssStrings.length > 0) {
                        addedElements.push(addInlineCss(cssStrings, contentScript.id));
                    }
                }
                if (mod.plugin) {
                    mod.plugin(CodeMirror);
                }
            }
            catch (error) {
                registry_1.reg.logger().error(error.toString());
            }
        }
        setOptions(newOptions);
        return () => {
            for (const element of addedElements) {
                element.remove();
            }
        };
    }, [plugins, CodeMirror]);
    function addInlineCss(cssStrings, id) {
        const element = document.createElement('style');
        element.setAttribute('id', `content-script-${id}-inline-${uuid_1.default.createNano()}`);
        document.head.appendChild(element);
        element.appendChild(document.createTextNode(cssStrings.join('\n')));
        return element;
    }
    function addScript(path, id) {
        const element = document.createElement('link');
        element.setAttribute('id', `content-script-${id}-link-${uuid_1.default.createNano()}`);
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('href', path);
        document.head.appendChild(element);
        return element;
    }
    return options;
}
//# sourceMappingURL=useExternalPlugins.js.map