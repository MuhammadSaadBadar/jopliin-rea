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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowMode = exports.WindowIdContext = void 0;
const reducer_1 = require("@joplin/lib/reducer");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
// This component uses react-dom's Portals to render its children in a different HTML
// document. As children are rendered in a different Window/Document, they should avoid
// referencing the `window` and `document` globals. Instead, HTMLElement.ownerDocument
// and refs can be used to access the child component's DOM.
exports.WindowIdContext = (0, react_1.createContext)(reducer_1.defaultWindowId);
var WindowMode;
(function (WindowMode) {
    WindowMode[WindowMode["Iframe"] = 0] = "Iframe";
    WindowMode[WindowMode["NewWindow"] = 1] = "NewWindow";
})(WindowMode || (exports.WindowMode = WindowMode = {}));
const useDocument = (mode, iframeElement, onClose) => {
    const [doc, setDoc] = (0, react_1.useState)(null);
    const onCloseRef = (0, react_1.useRef)(onClose);
    onCloseRef.current = onClose;
    (0, react_1.useEffect)(() => {
        var _a;
        let openedWindow = null;
        let unmounted = false;
        if (iframeElement) {
            setDoc((_a = iframeElement === null || iframeElement === void 0 ? void 0 : iframeElement.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
        }
        else if (mode === WindowMode.NewWindow) {
            openedWindow = window.open('about:blank');
            // Required to support TinyMCE:
            openedWindow.document.open();
            openedWindow.document.write('<!DOCTYPE html><html><head></head><body></body></html>');
            openedWindow.document.close();
            setDoc(openedWindow.document);
            // .onbeforeunload and .onclose events don't seem to fire when closed by a user -- rely on polling
            // instead:
            void (async () => {
                while (!unmounted) {
                    await new Promise(resolve => {
                        setTimeout(() => resolve(), 2000);
                    });
                    // Re-check after sleep to avoid duplicate WINDOW_CLOSE if IPC already fired.
                    if (unmounted)
                        break;
                    if (openedWindow === null || openedWindow === void 0 ? void 0 : openedWindow.closed) {
                        // Null out doc first so React stops rendering into the destroyed window
                        // before WINDOW_CLOSE triggers unmounting (prevents renderer crash on Windows).
                        setDoc(null);
                        openedWindow = null;
                        break;
                    }
                }
            })();
        }
        return () => {
            var _a;
            unmounted = true;
            // Delay: Closing immediately causes Electron to crash
            setTimeout(() => {
                var _a;
                if (!(openedWindow === null || openedWindow === void 0 ? void 0 : openedWindow.closed)) {
                    openedWindow === null || openedWindow === void 0 ? void 0 : openedWindow.close();
                    (_a = onCloseRef.current) === null || _a === void 0 ? void 0 : _a.call(onCloseRef);
                    openedWindow = null;
                }
            }, 200);
            if (iframeElement && !openedWindow) {
                (_a = onCloseRef.current) === null || _a === void 0 ? void 0 : _a.call(onCloseRef);
            }
        };
    }, [iframeElement, mode]);
    return doc;
};
const useDocumentSetup = (doc, setLoaded) => {
    (0, react_1.useEffect)(() => {
        if (!doc)
            return;
        const cssUrls = [
            'style.min.css',
        ];
        for (const url of cssUrls) {
            const style = doc.createElement('link');
            style.rel = 'stylesheet';
            style.href = url;
            doc.head.appendChild(style);
        }
        const jsUrls = [
            'vendor/lib/smalltalk/dist/smalltalk.min.js',
            './utils/window/eventHandlerOverrides.js',
        ];
        for (const url of jsUrls) {
            const script = doc.createElement('script');
            script.src = url;
            doc.head.appendChild(script);
        }
        doc.body.style.height = '100vh';
        setLoaded(true);
    }, [doc, setLoaded]);
};
const NewWindowOrIFrame = props => {
    const [iframeRef, setIframeRef] = (0, react_1.useState)(null);
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    const doc = useDocument(props.mode, iframeRef, props.onClose);
    useDocumentSetup(doc, setLoaded);
    (0, react_1.useEffect)(() => {
        if (!doc)
            return;
        doc.title = props.title;
    }, [doc, props.title]);
    (0, react_1.useEffect)(() => {
        const win = doc === null || doc === void 0 ? void 0 : doc.defaultView;
        if (win && 'electronWindow' in win && typeof win.electronWindow === 'object') {
            const electronWindow = win.electronWindow;
            electronWindow.onSetWindowId(props.windowId);
        }
    }, [doc, props.windowId]);
    const onWindowRef = (0, react_1.useRef)(props.onWindow);
    onWindowRef.current = props.onWindow;
    (0, react_1.useEffect)(() => {
        const win = doc === null || doc === void 0 ? void 0 : doc.defaultView;
        if (win && onWindowRef.current) {
            onWindowRef.current(win);
        }
    }, [doc]);
    const parentNode = loaded ? doc === null || doc === void 0 ? void 0 : doc.body : null;
    const wrappedChildren = React.createElement(exports.WindowIdContext.Provider, { value: props.windowId }, props.children);
    const contentPortal = parentNode && (0, react_dom_1.createPortal)(wrappedChildren, parentNode);
    if (props.mode === WindowMode.NewWindow) {
        return React.createElement("div", { style: { display: 'none' } }, contentPortal);
    }
    else {
        return React.createElement("iframe", { ref: setIframeRef, style: { flexGrow: 1, width: '100%', height: '100%', border: 'none' } }, contentPortal);
    }
};
exports.default = NewWindowOrIFrame;
//# sourceMappingURL=NewWindowOrIFrame.js.map