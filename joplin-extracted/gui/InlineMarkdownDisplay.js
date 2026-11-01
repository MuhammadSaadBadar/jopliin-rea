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
const react_1 = require("react");
const MarkdownIt = require("markdown-it");
const urlUtils_1 = require("@joplin/lib/urlUtils");
const url_1 = require("@joplin/utils/url");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const InlineMarkdownDisplay = props => {
    const outputElementRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        outputElementRef.current.replaceChildren(renderMarkdownToElement(props.markdown, { allowLinks: props.allowLinks }));
    }, [props.markdown, props.allowLinks]);
    return React.createElement("div", { className: `inline-markdown ${props.className}`, ref: outputElementRef });
};
exports.default = InlineMarkdownDisplay;
const renderMarkdownToElement = (markdown, { allowLinks }) => {
    // Since we're including the output in the main document, use markdown-it directly with minimal
    // settings (e.g. HTML rendering disabled).
    const markdownIt = MarkdownIt()
        .set({
        // Match Joplin's main renderer
        breaks: false,
    })
        .disable([
        'image',
        allowLinks ? '' : 'link',
    ].filter(item => !!item));
    const rendered = markdownIt.render(markdown);
    const markdownContainer = document.createElement('div');
    markdownContainer.innerHTML = rendered;
    // Make links clickable
    for (const link of markdownContainer.querySelectorAll('a[href]')) {
        const href = link.getAttribute('href');
        const url = (0, urlUtils_1.isResourceUrl)(href) || (0, url_1.isHttpOrHttpsUrl)(href) ? href : '#';
        link.href = '#';
        link.title = url;
        link.onclick = (event) => {
            event.preventDefault();
            void CommandService_1.default.instance().execute('openItem', url);
        };
    }
    return markdownContainer;
};
//# sourceMappingURL=InlineMarkdownDisplay.js.map