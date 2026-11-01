"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const HtmlToMd_1 = __importDefault(require("@joplin/lib/HtmlToMd"));
const resourceHandling_1 = require("../utils/resourceHandling");
const electron_1 = require("electron");
exports.declaration = {
    name: 'pasteAsMarkdown',
    label: () => (0, locale_1._)('Paste as Markdown'),
};
let htmlToMd_ = null;
const htmlToMd = () => {
    if (!htmlToMd_) {
        htmlToMd_ = new HtmlToMd_1.default();
    }
    return htmlToMd_;
};
const runtime = (comp) => {
    return {
        execute: async () => {
            let html = electron_1.clipboard.readHTML();
            if (html) {
                // Download images and convert them to Joplin resources
                html = await (0, resourceHandling_1.processImagesInPastedHtml)(html, { useInternalUrls: true });
                const markdown = htmlToMd().parse(html, { tightLists: true, collapseMultipleBlankLines: true });
                void comp.editorRef.current.execCommand({ name: 'insertText', value: markdown });
            }
            else {
                // Fall back to plain text if no HTML is available
                const text = electron_1.clipboard.readText();
                if (text) {
                    void comp.editorRef.current.execCommand({ name: 'insertText', value: text });
                }
            }
        },
        enabledCondition: 'oneNoteSelected && markdownEditorVisible',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=pasteAsMarkdown.js.map