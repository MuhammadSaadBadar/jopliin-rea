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
exports.default = PdfViewer;
const React = __importStar(require("react"));
const react_1 = require("react");
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const bridge_1 = __importDefault(require("../services/bridge"));
const contextMenu_1 = __importDefault(require("./NoteEditor/utils/contextMenu"));
const contextMenuUtils_1 = require("./NoteEditor/utils/contextMenuUtils");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const styled_components_1 = __importDefault(require("styled-components"));
const theme_1 = require("@joplin/lib/theme");
const Window = styled_components_1.default.div `
	height: 100%;
    width: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 999;
    background-color: ${(props) => props.theme.backgroundColor};
	color: ${(props) => props.theme.color};
	`;
const IFrame = styled_components_1.default.iframe `
	height: 100%;
    width: 100%;
    border: none;
	`;
function PdfViewer(props) {
    const iframeRef = (0, react_1.useRef)(null);
    const onClose = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'DIALOG_CLOSE',
            name: 'pdfViewer',
        });
    }, [props.dispatch]);
    const openExternalViewer = (0, react_1.useCallback)(async () => {
        await CommandService_1.default.instance().execute('openItem', `joplin://${props.resource.id}`);
    }, [props.resource.id]);
    const textSelected = (0, react_1.useCallback)(async (text) => {
        if (!text)
            return;
        const itemType = contextMenuUtils_1.ContextMenuItemType.Text;
        const menu = await (0, contextMenu_1.default)({
            itemType,
            resourceId: null,
            filename: null,
            mime: 'text/plain',
            textToCopy: text,
            linkToCopy: null,
            linkToOpen: null,
            htmlToCopy: '',
            insertContent: () => { console.warn('insertContent() not implemented'); },
            fireEditorEvent: () => { console.warn('fireEditorEvent() not implemented'); },
            htmlToMd: async (_a, b, _c) => b,
            mdToHtml: async (_a, b, _c) => { return { html: b, pluginAssets: [], cssStrings: [] }; },
        }, props.dispatch);
        menu.popup({ window: (0, bridge_1.default)().activeWindow() });
    }, [props.dispatch]);
    const onMessage_ = (0, react_1.useCallback)(async (event) => {
        if (!event.data || !event.data.name) {
            return;
        }
        if (event.data.name === 'close') {
            onClose();
        }
        else if (event.data.name === 'externalViewer') {
            await openExternalViewer();
        }
        else if (event.data.name === 'textSelected') {
            await textSelected(event.data.text);
        }
        else {
            console.error('Unknown event received', event.data.name);
        }
    }, [openExternalViewer, textSelected, onClose]);
    (0, react_1.useEffect)(() => {
        const iframe = iframeRef.current;
        iframe.contentWindow.addEventListener('message', onMessage_);
        return () => {
            // iframe.contentWindow is not always defined
            // https://github.com/laurent22/joplin/issues/7528
            if (iframe.contentWindow)
                iframe.contentWindow.removeEventListener('message', onMessage_);
        };
    }, [onMessage_]);
    const theme = (0, theme_1.themeStyle)(props.themeId);
    return (React.createElement(Window, { theme: theme },
        React.createElement(IFrame, { src: "./vendor/lib/@joplin/pdf-viewer/index.html", "x-url": Resource_1.default.fullPath(props.resource), "x-appearance": theme.appearance, ref: iframeRef, "x-title": props.resource.title, "x-anchorpage": props.pageNo, "x-type": "full" })));
}
//# sourceMappingURL=PdfViewer.js.map