"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_1 = require("react");
const useMessageHandler_1 = __importDefault(require("./useMessageHandler"));
const md5 = require('md5');
function default_1(viewRef, isReady, postMessage, html) {
    const [loadedHtmlHash, setLoadedHtmlHash] = (0, react_1.useState)('');
    const htmlHash = (0, react_1.useMemo)(() => {
        return md5(html);
    }, [html]);
    (0, useMessageHandler_1.default)(viewRef, event => {
        const data = event.data;
        if (!data || data.target !== 'UserWebview')
            return;
        // eslint-disable-next-line no-console
        console.info('useHtmlLoader: message', data);
        // We only update if the HTML that was loaded is the same as
        // the active one. Otherwise it means the content has been
        // changed between the moment it was set by the user and the
        // moment it was loaded in the view.
        if (data.message === 'htmlIsSet' && data.hash === htmlHash) {
            setLoadedHtmlHash(data.hash);
        }
    });
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line no-console
        console.info('useHtmlLoader: isReady', isReady);
        if (!isReady)
            return;
        // eslint-disable-next-line no-console
        console.info('useHtmlLoader: setHtml', htmlHash);
        postMessage('setHtml', {
            hash: htmlHash,
            html: html,
        });
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [html, htmlHash, isReady]);
    return loadedHtmlHash;
}
//# sourceMappingURL=useHtmlLoader.js.map