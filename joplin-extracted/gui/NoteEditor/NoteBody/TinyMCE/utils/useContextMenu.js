"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const types_1 = require("@joplin/lib/services/plugins/api/types");
const SpellCheckerService_1 = __importDefault(require("@joplin/lib/services/spellChecker/SpellCheckerService"));
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../../../services/bridge"));
const contextMenuUtils_1 = require("../../../utils/contextMenuUtils");
const contextMenu_1 = require("../../../utils/contextMenu");
const MenuUtils_1 = __importDefault(require("@joplin/lib/services/commands/MenuUtils"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const locale_1 = require("@joplin/lib/locale");
const isItemId_1 = __importDefault(require("@joplin/lib/models/utils/isItemId"));
const NewWindowOrIFrame_1 = require("../../../../NewWindowOrIFrame");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('useContextMenu');
const Menu = (0, bridge_1.default)().Menu;
const MenuItem = (0, bridge_1.default)().MenuItem;
const menuUtils = new MenuUtils_1.default(CommandService_1.default.instance());
const contextMenuActionOptions = { current: null };
function default_1(editor, plugins, dispatch, htmlToMd, mdToHtml, editDialog) {
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    (0, react_1.useEffect)(() => {
        if (!editor)
            return () => { };
        const targetWindow = (0, bridge_1.default)().windowById(windowId);
        if (!targetWindow)
            return () => { };
        const contextMenuItems = (0, contextMenu_1.menuItems)(dispatch);
        const makeMainMenuItems = async (element) => {
            let itemType = contextMenuUtils_1.ContextMenuItemType.None;
            let resourceId = '';
            let linkUrl = null;
            const pathToId = (path) => {
                const id = Resource_1.default.pathToId(path);
                return (0, isItemId_1.default)(id) ? id : '';
            };
            if (element.nodeName === 'IMG') {
                itemType = contextMenuUtils_1.ContextMenuItemType.Image;
                resourceId = pathToId(element.src);
            }
            else if (element.nodeName === 'A') {
                resourceId = pathToId(element.href);
                itemType = resourceId ? contextMenuUtils_1.ContextMenuItemType.Resource : contextMenuUtils_1.ContextMenuItemType.Link;
                linkUrl = element.getAttribute('href') || '';
            }
            else {
                itemType = contextMenuUtils_1.ContextMenuItemType.Text;
            }
            contextMenuActionOptions.current = {
                itemType,
                resourceId,
                filename: null,
                mime: null,
                linkToCopy: linkUrl,
                linkToOpen: linkUrl,
                textToCopy: null,
                htmlToCopy: editor.selection ? editor.selection.getContent() : '',
                insertContent: (content) => {
                    editor.insertContent(content);
                },
                isReadOnly: false,
                fireEditorEvent: (event) => {
                    editor.fire(event);
                },
                htmlToMd,
                mdToHtml,
            };
            return (0, contextMenuUtils_1.buildMenuItems)(contextMenuItems, contextMenuActionOptions.current);
        };
        const makeEditableMenuItems = (element) => {
            if (editDialog.isEditable(element)) {
                return [
                    new MenuItem({
                        type: 'normal',
                        label: (0, locale_1._)('Edit'),
                        click: () => {
                            editDialog.editExisting(element);
                        },
                    }),
                    new MenuItem({ type: 'separator' }),
                ];
            }
            return [];
        };
        const showContextMenu = async (element, misspelledWord, dictionarySuggestions) => {
            const menu = new Menu();
            const menuItems = [];
            const toMenuItems = (specs) => {
                return specs.map(spec => new MenuItem(spec));
            };
            menuItems.push(...makeEditableMenuItems(element));
            menuItems.push(...(await makeMainMenuItems(element)));
            const spellCheckerMenuItems = SpellCheckerService_1.default.instance().contextMenuItems(misspelledWord, dictionarySuggestions);
            menuItems.push(...toMenuItems(spellCheckerMenuItems));
            menuItems.push(...toMenuItems(menuUtils.pluginContextMenuItems(plugins, types_1.MenuItemLocation.EditorContextMenu)));
            for (const item of menuItems) {
                menu.append(item);
            }
            menu.popup({ window: targetWindow });
        };
        let lastTarget = null;
        const onElectronContextMenu = async (event, params) => {
            if (!lastTarget)
                return;
            const element = lastTarget;
            lastTarget = null;
            event.preventDefault();
            await showContextMenu(element, params.misspelledWord, params.dictionarySuggestions);
        };
        const onBrowserContextMenu = async (event) => {
            const isKeyboard = event.buttons === 0;
            if (isKeyboard) {
                // Context menu events from the keyboard seem to always use <body> as the
                // event target. Since which context menu is displayed depends on what the
                // target is, using event.target for keyboard-triggered contextmenu events
                // would prevent keyboard-only users from accessing certain functionality.
                // To fix this, use the selection instead.
                lastTarget = editor.selection.getNode();
            }
            else {
                lastTarget = event.target;
            }
            // Plugins in the Rich Text Editor (e.g. the mermaid renderer) can sometimes
            // create custom right-click events. These don't trigger the Electron 'context-menu'
            // event. As such, the context menu must be shown manually.
            const isFromPlugin = !event.isTrusted;
            if (isFromPlugin) {
                event.preventDefault();
                await showContextMenu(lastTarget, null, []);
                lastTarget = null;
            }
        };
        try {
            targetWindow.webContents.prependListener('context-menu', onElectronContextMenu);
        }
        catch (error) {
            logger.error('Failed to register context menu', error);
        }
        editor.on('contextmenu', onBrowserContextMenu);
        return () => {
            var _a;
            editor.off('contextmenu', onBrowserContextMenu);
            try {
                if (!targetWindow.isDestroyed() && ((_a = targetWindow === null || targetWindow === void 0 ? void 0 : targetWindow.webContents) === null || _a === void 0 ? void 0 : _a.off)) {
                    targetWindow.webContents.off('context-menu', onElectronContextMenu);
                }
            }
            catch (error) {
                // This can happen if the window closes after the isDestroyed check, but before webContents.off
                // finishes running.
                logger.error('Error removing context menu listener', error);
            }
        };
    }, [editor, plugins, dispatch, htmlToMd, mdToHtml, editDialog, windowId]);
}
//# sourceMappingURL=useContextMenu.js.map