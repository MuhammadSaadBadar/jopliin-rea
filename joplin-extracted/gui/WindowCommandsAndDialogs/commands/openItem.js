"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const contextMenu_1 = require("../../NoteEditor/utils/contextMenu");
const urlUtils_1 = require("@joplin/lib/urlUtils");
const url_1 = require("@joplin/utils/url");
const string_utils_1 = require("@joplin/lib/string-utils");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
exports.declaration = {
    name: 'openItem',
};
const runtime = () => {
    return {
        execute: async (context, link) => {
            if (!link)
                throw new Error('Link cannot be empty');
            const fromFileUrl = (0, urlUtils_1.fileUrlToResourceUrl)(link, Setting_1.default.value('resourceDir'));
            if (fromFileUrl) {
                link = fromFileUrl;
            }
            if (link.startsWith('joplin://') || link.startsWith(':/')) {
                const parsedUrl = (0, urlUtils_1.parseResourceUrl)(link);
                if (parsedUrl) {
                    const { itemId, hash } = parsedUrl;
                    await (0, contextMenu_1.openItemById)(itemId, context.dispatch, hash);
                }
                else {
                    void (0, bridge_1.default)().openExternal(link);
                }
            }
            else if (link.indexOf('file://') === 0) {
                // When using the file:// protocol, openPath doesn't work (does
                // nothing) with URL-encoded paths.
                //
                // shell.openPath seems to work with file:// urls on Windows,
                // but doesn't on macOS, so we need to convert it to a path
                // before passing it to openPath.
                let decoded = (0, string_utils_1.urlDecode)(link);
                // On Windows, UNC paths like file://\\server\share have backslashes
                // right after file:// which makes the URL invalid. Convert them
                // to forward slashes so fileUriToPath can handle them correctly.
                // https://github.com/laurent22/joplin/issues/14196
                if (decoded.startsWith('file://\\')) {
                    decoded = `file://${decoded.substring(7).replace(/\\/g, '/')}`;
                }
                const decodedPath = (0, url_1.fileUriToPath)(decoded, shim_1.default.platformName());
                void (0, bridge_1.default)().openItem(decodedPath);
            }
            else if ((0, urlUtils_1.urlProtocol)(link)) {
                void (0, bridge_1.default)().openExternal(link);
            }
            else {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Unsupported link or message: %s', link));
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openItem.js.map