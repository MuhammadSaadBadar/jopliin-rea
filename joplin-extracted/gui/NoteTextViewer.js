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
const PostMessageService_1 = __importStar(require("@joplin/lib/services/PostMessageService"));
const React = __importStar(require("react"));
const registry_1 = require("@joplin/lib/registry");
const bridge_1 = __importDefault(require("../services/bridge"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const react_1 = require("react");
const NewWindowOrIFrame_1 = require("./NewWindowOrIFrame");
const useDocument_1 = __importDefault(require("@joplin/lib/hooks/dom/useDocument"));
const locale_1 = require("@joplin/lib/locale");
const getAssetPath_1 = __importDefault(require("../utils/getAssetPath"));
const path_1 = require("@joplin/utils/path");
const usePluginMessageResponder = (webviewRef) => {
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    (0, react_1.useEffect)(() => {
        PostMessageService_1.default.instance().registerResponder(PostMessageService_1.ResponderComponentType.NoteTextViewer, '', windowId, (message) => {
            var _a;
            if (!((_a = webviewRef === null || webviewRef === void 0 ? void 0 : webviewRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow)) {
                registry_1.reg.logger().warn('Cannot respond to message because target is gone', message);
                return;
            }
            webviewRef.current.contentWindow.postMessage({
                target: 'webview',
                name: 'postMessageService.response',
                data: message,
            }, '*');
        });
        return () => {
            PostMessageService_1.default.instance().unregisterResponder(PostMessageService_1.ResponderComponentType.NoteTextViewer, '', windowId);
        };
    }, [webviewRef, windowId]);
};
const useAllowAttribute = () => {
    // Specifies what content in the note viewer can do. See
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/allow
    // allow=fullscreen: Required to allow the user to fullscreen videos.
    return [
        'clipboard-write', 'fullscreen', 'autoplay', 'local-fonts', 'encrypted-media',
    ].map(attr => `${attr} joplin-content://note-viewer/`).join('; ');
};
const NoteTextViewer = (0, react_1.forwardRef)((props, ref) => {
    const [webview, setWebview] = (0, react_1.useState)(null);
    const webviewRef = (0, react_1.useRef)(null);
    webviewRef.current = webview;
    usePluginMessageResponder(webviewRef);
    const domReadyRef = (0, react_1.useRef)(false);
    const removePluginAssetsCallbackRef = (0, react_1.useRef)(null);
    const parentDoc = (0, useDocument_1.default)(webview);
    const containerWindow = parentDoc === null || parentDoc === void 0 ? void 0 : parentDoc.defaultView;
    (0, react_1.useImperativeHandle)(ref, () => {
        const result = {
            domReady: () => domReadyRef.current,
            setHtml: (html, options) => {
                var _a;
                const protocolHandler = (0, bridge_1.default)().electronApp().getContentProtocolHandler();
                // Grant & remove asset access.
                if (options.pluginAssets) {
                    (_a = removePluginAssetsCallbackRef.current) === null || _a === void 0 ? void 0 : _a.call(removePluginAssetsCallbackRef);
                    const pluginAssetPaths = options.pluginAssets.map((asset) => asset.path);
                    const assetAccesses = pluginAssetPaths.map(path => protocolHandler.allowReadAccessToFile(path));
                    removePluginAssetsCallbackRef.current = () => {
                        for (const accessControl of assetAccesses) {
                            accessControl.remove();
                        }
                        removePluginAssetsCallbackRef.current = null;
                    };
                }
                result.send('setHtml', html, Object.assign(Object.assign({}, options), { mediaAccessKey: protocolHandler.getMediaAccessKey() }));
            },
            send: (channel, arg0 = null, arg1 = null) => {
                var _a;
                const win = (_a = webviewRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow;
                // Window may already be closed
                if (!win)
                    return;
                if (channel === 'focus') {
                    win.postMessage({ target: 'webview', name: 'focus', data: {} }, '*');
                }
                if (channel === 'focusLine') {
                    win.postMessage({ target: 'webview', name: 'focusLine', data: { line: arg0 } }, '*');
                }
                // External code should use .setHtml (rather than send('setHtml', ...))
                if (channel === 'setHtml') {
                    win.postMessage({ target: 'webview', name: 'setHtml', data: { html: arg0, options: arg1 } }, '*');
                }
                if (channel === 'scrollToHash') {
                    win.postMessage({ target: 'webview', name: 'scrollToHash', data: { hash: arg0 } }, '*');
                }
                if (channel === 'setPercentScroll') {
                    win.postMessage({ target: 'webview', name: 'setPercentScroll', data: { percent: arg0 } }, '*');
                }
                if (channel === 'setMarkers') {
                    win.postMessage({ target: 'webview', name: 'setMarkers', data: { keywords: arg0, options: arg1 } }, '*');
                }
                if (channel === 'stopMediaPlayback') {
                    win.postMessage({ target: 'webview', name: 'stopMediaPlayback', data: {} }, '*');
                }
            },
            focus: () => {
                if (webviewRef.current) {
                    // Calling focus on webviewRef seems to be necessary when NoteTextViewer.focus
                    // is called outside of a user event (e.g. in a setTimeout) or during automated
                    // tests:
                    (0, focusHandler_1.focus)('NoteTextViewer::focus', webviewRef.current);
                    // Calling .focus on this.webviewRef.current isn't sufficient.
                    // To allow arrow-key scrolling, focus must also be set within the iframe:
                    result.send('focus');
                }
            },
            hasFocus: () => {
                var _a;
                return (_a = webviewRef.current) === null || _a === void 0 ? void 0 : _a.contains(parentDoc.activeElement);
            },
            focusLine: (lineNumber) => {
                if (webviewRef.current) {
                    (0, focusHandler_1.focus)('NoteTextViewer::focusLine', webviewRef.current);
                    // A timeout seems necessary after focusing the viewer to prevent focus from jumping to the top
                    setTimeout(() => {
                        result.send('focusLine', lineNumber);
                    }, 100);
                }
            },
            stopMediaPlayback: () => {
                result.send('stopMediaPlayback');
            },
        };
        return result;
    }, [parentDoc]);
    const webview_domReadyRef = (0, react_1.useRef)(null);
    webview_domReadyRef.current = (event) => {
        domReadyRef.current = true;
        if (props.onDomReady)
            props.onDomReady(event);
    };
    const webview_ipcMessageRef = (0, react_1.useRef)(null);
    webview_ipcMessageRef.current = (event) => {
        // The webview 'ipc-message' event carries channel/args, though it is statically typed as a bare Event here.
        if (props.onIpcMessage)
            props.onIpcMessage(event);
    };
    const webview_loadRef = (0, react_1.useRef)(null);
    webview_loadRef.current = (event) => {
        webview_domReadyRef.current(event);
    };
    const webview_messageRef = (0, react_1.useRef)(null);
    webview_messageRef.current = (event) => {
        var _a;
        if (event.source !== ((_a = webviewRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow))
            return;
        if (!event.data || event.data.target !== 'main')
            return;
        const callName = event.data.name;
        const args = event.data.args;
        if (props.onIpcMessage) {
            props.onIpcMessage({
                channel: callName,
                args: args,
            });
        }
    };
    (0, react_1.useEffect)(() => {
        const wv = webviewRef.current;
        if (!wv || !containerWindow)
            return () => { };
        const webviewListeners = {
            'dom-ready': (event) => webview_domReadyRef.current(event),
            'ipc-message': (event) => webview_ipcMessageRef.current(event),
            'load': (event) => webview_loadRef.current(event),
        };
        for (const n in webviewListeners) {
            if (!webviewListeners.hasOwnProperty(n))
                continue;
            const fn = webviewListeners[n];
            wv.addEventListener(n, fn);
        }
        const messageListener = event => webview_messageRef.current(event);
        containerWindow.addEventListener('message', messageListener);
        return () => {
            var _a;
            domReadyRef.current = false;
            const wv = webviewRef.current;
            if (!wv)
                return;
            for (const n in webviewListeners) {
                if (!webviewListeners.hasOwnProperty(n))
                    continue;
                const fn = webviewListeners[n];
                wv.removeEventListener(n, fn);
            }
            containerWindow === null || containerWindow === void 0 ? void 0 : containerWindow.removeEventListener('message', messageListener);
            (_a = removePluginAssetsCallbackRef.current) === null || _a === void 0 ? void 0 : _a.call(removePluginAssetsCallbackRef);
        };
    }, [containerWindow]);
    const viewerStyle = (0, react_1.useMemo)(() => {
        return Object.assign({ border: 'none' }, props.viewerStyle);
    }, [props.viewerStyle]);
    const allow = useAllowAttribute();
    return (React.createElement("iframe", { className: "noteTextViewer", ref: setWebview, style: viewerStyle, allow: allow, "aria-label": (0, locale_1._)('Note viewer'), src: `joplin-content://note-viewer/${(0, path_1.toForwardSlashes)((0, getAssetPath_1.default)('gui/note-viewer/index.html'))}` }));
});
exports.default = NoteTextViewer;
//# sourceMappingURL=NoteTextViewer.js.map