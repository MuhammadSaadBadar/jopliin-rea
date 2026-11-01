"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToClipboardData = htmlToClipboardData;
exports.copyHtmlToClipboard = copyHtmlToClipboard;
const HtmlToMd_1 = __importDefault(require("@joplin/lib/HtmlToMd"));
const htmlUtils_1 = __importDefault(require("@joplin/lib/htmlUtils"));
const electron_1 = require("electron");
let htmlToMd_ = null;
function htmlToMd() {
    if (!htmlToMd_) {
        htmlToMd_ = new HtmlToMd_1.default();
    }
    return htmlToMd_;
}
function removeImageUrlAttributes(htmlContent) {
    // We need to remove extra url params from the image URLs while copying
    // because some offline editors do not show the image if there is
    // an extra parameter in it's path.
    // Related to - https://github.com/laurent22/joplin/issues/4602
    const removeParametersFromUrl = (url) => {
        const imageSrc = new URL(url);
        // Remove parameters if it's a local image.
        if (imageSrc.protocol === 'file:') {
            imageSrc.search = '';
        }
        return imageSrc.toString();
    };
    return htmlUtils_1.default.replaceImageUrls(htmlContent, removeParametersFromUrl);
}
// Code blocks are rendered like so:
//
//     <div class="joplin-editable" contenteditable="false" data-mce-selected="1">
//         <pre class="joplin-source" data-joplin-language="javascript" data-joplin-source-open="```javascript" data-joplin-source-close="```">var a = 123;</pre>
//         <pre class="hljs"><code><span class="hljs-keyword">var</span> a = <span class="hljs-number">123</span>;</code></pre>
//     </div>
//
// One part is hidden and contains the raw source code, while the second part
// contains the rendered code. When setting the HTML clipboard, we want to get
// rid of the raw part, otherwise the code will show up twice when pasting.
//
// When setting the plain text part of the clipboard, we simply process it with
// HtmlToMd, which already supports Joplin code blocks (it will keep the raw
// part, and discard the rendered part), so we don't need to do any additional
// processing.
function cleanUpCodeBlocks(html) {
    const element = document.createElement('div');
    element.innerHTML = html;
    const sourceElements = element.querySelectorAll('.joplin-editable .joplin-source');
    for (const sourceElement of sourceElements) {
        sourceElement.remove();
    }
    return element.innerHTML;
}
function htmlToClipboardData(html) {
    const copyableContent = removeImageUrlAttributes(html);
    // In that case we need to set both HTML and Text context, otherwise it
    // won't be possible to paste the text in, for example, a text editor.
    // https://github.com/laurent22/joplin/issues/4788
    //
    // Also we don't escape the content produced in HTML to MD conversion
    // because it's not what would be expected. For example, if the content is
    // `* something`, strictly speaking it would be correct to escape to `\*
    // something`, however this is not what the user would expect when copying
    // text. Likewise for URLs that contain "_". So the resulting Markdown might
    // not be perfectly valid but would be closer to what a user would expect.
    // If they want accurate MArkdown they can switch to the MD editor.
    // https://github.com/laurent22/joplin/issues/5440
    return {
        text: htmlToMd().parse(copyableContent, { disableEscapeContent: true }),
        html: cleanUpCodeBlocks(copyableContent),
    };
}
function copyHtmlToClipboard(copiedHtml) {
    electron_1.clipboard.write(htmlToClipboardData(copiedHtml));
}
//# sourceMappingURL=clipboardUtils.js.map