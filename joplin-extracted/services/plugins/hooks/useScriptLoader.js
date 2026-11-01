"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../bridge"));
function default_1(postMessage, isReady, scripts, cssFilePath) {
    const protocolHandler = (0, react_1.useMemo)(() => {
        return (0, bridge_1.default)().electronApp().getContentProtocolHandler();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isReady)
            return () => { };
        postMessage('setScripts', { scripts: scripts });
        const { remove } = protocolHandler.allowReadAccessToFiles(scripts);
        return remove;
    }, [scripts, isReady, postMessage, protocolHandler]);
    (0, react_1.useEffect)(() => {
        if (!isReady || !cssFilePath)
            return () => { };
        postMessage('setScript', { script: cssFilePath, key: 'themeCss' });
        const { remove } = protocolHandler.allowReadAccessToFile(cssFilePath);
        return remove;
    }, [isReady, cssFilePath, postMessage, protocolHandler]);
}
//# sourceMappingURL=useScriptLoader.js.map