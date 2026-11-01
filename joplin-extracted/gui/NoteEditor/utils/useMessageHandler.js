"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMessageHandler;
const react_1 = require("react");
const contextMenu_1 = __importDefault(require("./contextMenu"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const PostMessageService_1 = __importDefault(require("@joplin/lib/services/PostMessageService"));
const ResourceFetcher_1 = __importDefault(require("@joplin/lib/services/ResourceFetcher"));
const registry_1 = require("@joplin/lib/registry");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const contextMenuUtils_1 = require("./contextMenuUtils");
function useMessageHandler(scrollWhenReadyRef, clearScrollWhenReady, windowId, editorRef, setLocalSearchResultCount, dispatch, formNote, htmlToMd, mdToHtml) {
    return (0, react_1.useCallback)(async (event) => {
        const msg = event.channel ? event.channel : '';
        const args = event.args;
        const arg0 = args && args.length >= 1 ? args[0] : null;
        // eslint-disable-next-line no-console
        if (msg !== 'percentScroll')
            console.info(`Got ipc-message: ${msg}`, arg0);
        if (msg.indexOf('error:') === 0) {
            const s = msg.split(':');
            s.splice(0, 1);
            registry_1.reg.logger().error(s.join(':'));
        }
        else if (msg === 'noteRenderComplete') {
            if (scrollWhenReadyRef.current) {
                const options = Object.assign({}, scrollWhenReadyRef.current);
                clearScrollWhenReady();
                editorRef.current.scrollTo(options);
            }
        }
        else if (msg === 'setMarkerCount') {
            setLocalSearchResultCount(arg0);
        }
        else if (msg.indexOf('markForDownload:') === 0) {
            const s = msg.split(':');
            if (s.length < 2)
                throw new Error(`Invalid message: ${msg}`);
            void ResourceFetcher_1.default.instance().markForDownload(s[1]);
        }
        else if (msg === 'contextMenu') {
            const resourceId = arg0.resourceId;
            const itemType = await (0, contextMenuUtils_1.resolveContextMenuItemType)(arg0 && arg0.type, resourceId);
            const menu = await (0, contextMenu_1.default)({
                itemType,
                resourceId: resourceId,
                filename: arg0.filename,
                mime: arg0.mime,
                linkToOpen: null,
                textToCopy: arg0.textToCopy,
                linkToCopy: arg0.linkToCopy || null,
                htmlToCopy: '',
                insertContent: () => { console.warn('insertContent() not implemented'); },
                fireEditorEvent: () => { console.warn('fireEditorEvent() not implemented'); },
                htmlToMd,
                mdToHtml,
            }, dispatch);
            menu.popup({ window: (0, bridge_1.default)().activeWindow() });
        }
        else if (msg.indexOf('#') === 0) {
            // This is an internal anchor, which is handled by the WebView so skip this case
        }
        else if (msg === 'contentScriptExecuteCommand') {
            const commandName = arg0.name;
            const commandArgs = arg0.args || [];
            void CommandService_1.default.instance().execute(commandName, ...commandArgs);
        }
        else if (msg === 'postMessageService.message') {
            void PostMessageService_1.default.instance().postMessage(Object.assign(Object.assign({}, arg0), { windowId }));
        }
        else if (msg === 'openPdfViewer') {
            await CommandService_1.default.instance().execute('openPdfViewer', arg0.resourceId, arg0.pageNo);
        }
        else {
            await CommandService_1.default.instance().execute('openItem', msg);
            // bridge().showErrorMessageBox(_('Unsupported link or message: %s', msg));
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [dispatch, setLocalSearchResultCount, scrollWhenReadyRef, formNote]);
}
//# sourceMappingURL=useMessageHandler.js.map