"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceIdFromMarkup = void 0;
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const types_1 = require("@joplin/lib/services/plugins/api/types");
const MenuUtils_1 = __importDefault(require("@joplin/lib/services/commands/MenuUtils"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const SpellCheckerService_1 = __importDefault(require("@joplin/lib/services/spellChecker/SpellCheckerService"));
const bridge_1 = __importDefault(require("../../../../../services/bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const contextMenuUtils_1 = require("../../../utils/contextMenuUtils");
const contextMenu_1 = require("../../../utils/contextMenu");
const isItemId_1 = __importDefault(require("@joplin/lib/models/utils/isItemId"));
const urlUtils_1 = require("@joplin/lib/urlUtils");
const NewWindowOrIFrame_1 = require("../../../../NewWindowOrIFrame");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('useContextMenu');
// Extract resource ID from resource markup (images or file attachments) at a given cursor position within a line.
// Returns the resource ID and its type if the cursor is within a resource markup, null otherwise.
const getResourceIdFromMarkup = (lineContent, cursorPosInLine) => {
    const resourceUrls = (0, urlUtils_1.extractResourceUrls)(lineContent);
    if (!resourceUrls.length)
        return null;
    for (const resourceInfo of resourceUrls) {
        const resourcePattern = new RegExp(`[:](/?${resourceInfo.itemId})`, 'g');
        let match;
        while ((match = resourcePattern.exec(lineContent)) !== null) {
            // Look backwards for ![, [, <img, or <a
            const imageMarkupStart = lineContent.lastIndexOf('![', match.index);
            const linkMarkupStart = lineContent.lastIndexOf('[', match.index);
            const imgTagStart = lineContent.lastIndexOf('<img', match.index);
            const aTagStart = lineContent.lastIndexOf('<a', match.index);
            // Find the closest markup start and determine type
            let markupStart = -1;
            let markupType = 'file';
            if (imageMarkupStart !== -1 && imageMarkupStart > markupStart) {
                markupStart = imageMarkupStart;
                markupType = 'image';
            }
            if (linkMarkupStart !== -1 && linkMarkupStart > markupStart && lineContent[linkMarkupStart - 1] !== '!') {
                markupStart = linkMarkupStart;
                markupType = 'file';
            }
            if (imgTagStart !== -1 && imgTagStart > markupStart) {
                markupStart = imgTagStart;
                markupType = 'image';
            }
            if (aTagStart !== -1 && aTagStart > markupStart) {
                markupStart = aTagStart;
                markupType = 'file';
            }
            if (markupStart === -1)
                continue;
            // Find the end of the markup
            let markupEnd;
            if (lineContent[markupStart] === '!' || lineContent[markupStart] === '[') {
                markupEnd = lineContent.indexOf(')', match.index);
                if (markupEnd !== -1)
                    markupEnd += 1;
            }
            else {
                markupEnd = lineContent.indexOf('>', match.index);
                if (markupEnd !== -1)
                    markupEnd += 1;
            }
            if (markupEnd !== -1 && cursorPosInLine >= markupStart && cursorPosInLine <= markupEnd) {
                return { resourceId: resourceInfo.itemId, type: markupType, markupStart, markupEnd };
            }
        }
    }
    return null;
};
exports.getResourceIdFromMarkup = getResourceIdFromMarkup;
const Menu = (0, bridge_1.default)().Menu;
const MenuItem = (0, bridge_1.default)().MenuItem;
const menuUtils = new MenuUtils_1.default(CommandService_1.default.instance());
const imageClassName = 'cm-md-image';
// Shared helper to extract resource ID from a path/URL
const pathToId = (path) => {
    const id = Resource_1.default.pathToId(path);
    return (0, isItemId_1.default)(id) ? id : '';
};
const useContextMenu = (props) => {
    const editorRef = props.editorRef;
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    // The below code adds support for spellchecking when it is enabled
    // It might be buggy, refer to the below issue
    // https://github.com/laurent22/joplin/pull/3974#issuecomment-718936703
    (0, react_1.useEffect)(() => {
        const targetWindow = (0, bridge_1.default)().windowById(windowId);
        if (!targetWindow)
            return () => { };
        const isAncestorOfCodeMirrorEditor = (elem) => {
            for (; elem.parentElement; elem = elem.parentElement) {
                if (elem.classList.contains(props.editorClassName)) {
                    return true;
                }
            }
            return false;
        };
        const convertFromScreenCoordinates = (zoomPercent, screenXY) => {
            const zoomFraction = zoomPercent / 100;
            return screenXY / zoomFraction;
        };
        const pointerInsideEditor = (params, allowNonEditable = false) => {
            var _a;
            const x = params.x, y = params.y, isEditable = params.isEditable;
            const containerDoc = (_a = props.containerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument;
            const elements = containerDoc === null || containerDoc === void 0 ? void 0 : containerDoc.getElementsByClassName(props.editorClassName);
            // Note: We can't check inputFieldType here. When spellcheck is enabled,
            // params.inputFieldType is "none". When spellcheck is disabled,
            // params.inputFieldType is "plainText". Thus, such a check would be inconsistent.
            if (!(elements === null || elements === void 0 ? void 0 : elements.length) || (!isEditable && !allowNonEditable))
                return false;
            // Checks whether the element the pointer clicked on is inside the editor.
            // This logic will need to be changed if the editor is eventually wrapped
            // in an iframe, as elementFromPoint will return the iframe container (and not
            // a child of the editor).
            const zoom = Setting_1.default.value('windowContentZoomFactor');
            const xScreen = convertFromScreenCoordinates(zoom, x);
            const yScreen = convertFromScreenCoordinates(zoom, y);
            const intersectingElement = containerDoc.elementFromPoint(xScreen, yScreen);
            return intersectingElement && isAncestorOfCodeMirrorEditor(intersectingElement);
        };
        const getClickedImageContainer = (params) => {
            var _a;
            const containerDoc = (_a = props.containerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument;
            if (!containerDoc)
                return null;
            const zoom = Setting_1.default.value('windowContentZoomFactor');
            const xScreen = convertFromScreenCoordinates(zoom, params.x);
            const yScreen = convertFromScreenCoordinates(zoom, params.y);
            const clickedElement = containerDoc.elementFromPoint(xScreen, yScreen);
            return clickedElement === null || clickedElement === void 0 ? void 0 : clickedElement.closest(`.${imageClassName}`);
        };
        const appendEditMenuItems = (menu) => {
            var _a, _b, _c;
            const hasSelectedText = editorRef.current && !!editorRef.current.getSelection();
            const isReadOnly = (_c = (_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor) === null || _b === void 0 ? void 0 : _b.state.readOnly) !== null && _c !== void 0 ? _c : false;
            menu.append(new MenuItem({ label: (0, locale_1._)('Cut'), enabled: hasSelectedText && !isReadOnly, click: () => props.editorCutText() }));
            menu.append(new MenuItem({ label: (0, locale_1._)('Copy'), enabled: hasSelectedText, click: () => props.editorCopyText() }));
            menu.append(new MenuItem({ label: (0, locale_1._)('Paste'), enabled: !isReadOnly, click: () => props.editorPaste() }));
            menu.append(new MenuItem({ label: (0, locale_1._)('Paste as Markdown'), enabled: !isReadOnly, click: () => CommandService_1.default.instance().execute('pasteAsMarkdown') }));
        };
        const showResourceContextMenu = async (resourceId, type) => {
            var _a, _b, _c;
            const menu = new Menu();
            // Add resource-specific options first
            const baseType = type === 'image' ? contextMenuUtils_1.ContextMenuItemType.Image : contextMenuUtils_1.ContextMenuItemType.Resource;
            const itemType = await (0, contextMenuUtils_1.resolveContextMenuItemType)(baseType, resourceId);
            const isReadOnly = (_c = (_b = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor) === null || _b === void 0 ? void 0 : _b.state.readOnly) !== null && _c !== void 0 ? _c : false;
            const contextMenuOptions = {
                itemType,
                resourceId,
                filename: null,
                mime: null,
                linkToCopy: null,
                linkToOpen: null,
                textToCopy: null,
                htmlToCopy: null,
                insertContent: () => { var _a; (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.insertText(''); },
                isReadOnly,
                fireEditorEvent: () => { },
                htmlToMd: null,
                mdToHtml: null,
            };
            const resourceMenuItems = await (0, contextMenuUtils_1.buildMenuItems)((0, contextMenu_1.menuItems)(props.dispatch), contextMenuOptions, { excludeEditItems: true, excludePluginItems: true });
            for (const item of resourceMenuItems) {
                menu.append(item);
            }
            // Add edit items
            menu.append(new MenuItem({ type: 'separator' }));
            appendEditMenuItems(menu);
            // Add plugin items last
            const extraItems = await (0, contextMenuUtils_1.handleEditorContextMenuFilter)({
                resourceId,
                itemType,
            });
            if (extraItems.length) {
                menu.append(new MenuItem({ type: 'separator' }));
                for (const item of extraItems) {
                    menu.append(item);
                }
            }
            menu.popup({ window: targetWindow });
        };
        // Move the cursor to the line containing the image markup for a rendered image.
        // This ensures plugins that inspect cursor position (e.g. rich markdown, image resize)
        // show the correct context menu options.
        const moveCursorToImageLine = (imageContainer) => {
            var _a;
            const editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
            if (!editor)
                return;
            // The image widget stores its source document position as a data attribute.
            const sourceFrom = imageContainer.dataset.sourceFrom;
            if (sourceFrom === undefined)
                return;
            const pos = Math.min(Number(sourceFrom), editor.state.doc.length);
            const line = editor.state.doc.lineAt(pos);
            editor.dispatch({
                selection: { anchor: line.from },
            });
        };
        const getResourceInfoAtPos = (docPos) => {
            var _a;
            const editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
            if (!editor)
                return null;
            const line = editor.state.doc.lineAt(docPos);
            const info = (0, exports.getResourceIdFromMarkup)(line.text, docPos - line.from);
            if (!info)
                return null;
            return { resourceId: info.resourceId, type: info.type };
        };
        const onContextMenu = async (event, params) => {
            var _a, _b;
            let resourceInfo = null;
            // Check if right-clicking on a rendered image first (images may not be "editable")
            const imageContainer = getClickedImageContainer(params);
            if (imageContainer && pointerInsideEditor(params, true)) {
                const imgElement = imageContainer.querySelector('img');
                if (imgElement) {
                    const resourceId = pathToId(imgElement.src);
                    if (resourceId) {
                        moveCursorToImageLine(imageContainer);
                        const sourceFrom = imageContainer.dataset.sourceFrom;
                        if (sourceFrom !== undefined) {
                            const editor = (_a = editorRef.current) === null || _a === void 0 ? void 0 : _a.editor;
                            if (editor) {
                                const pos = Math.min(Number(sourceFrom), editor.state.doc.length);
                                resourceInfo = getResourceInfoAtPos(pos);
                            }
                        }
                        // Fallback if we couldn't get markup info
                        if (!resourceInfo) {
                            resourceInfo = { resourceId, type: 'image' };
                        }
                    }
                }
            }
            // Check if right-clicking on resource markup text (images or file attachments)
            if (!resourceInfo && pointerInsideEditor(params)) {
                const editor = (_b = editorRef.current) === null || _b === void 0 ? void 0 : _b.editor;
                if (editor) {
                    const zoom = Setting_1.default.value('windowContentZoomFactor');
                    const x = convertFromScreenCoordinates(zoom, params.x);
                    const y = convertFromScreenCoordinates(zoom, params.y);
                    const clickPos = editor.posAtCoords({ x, y });
                    if (clickPos !== null) {
                        resourceInfo = getResourceInfoAtPos(clickPos);
                    }
                }
            }
            if (resourceInfo) {
                event.preventDefault();
                await showResourceContextMenu(resourceInfo.resourceId, resourceInfo.type);
                return;
            }
            // For text context menu, require editable
            if (!pointerInsideEditor(params))
                return;
            // Don't show the default menu.
            event.preventDefault();
            const menu = new Menu();
            appendEditMenuItems(menu);
            const spellCheckerMenuItems = SpellCheckerService_1.default.instance().contextMenuItems(params.misspelledWord, params.dictionarySuggestions);
            for (const item of spellCheckerMenuItems) {
                menu.append(new MenuItem(item));
            }
            // CodeMirror 5 only:
            // Typically CodeMirror handles all interactions itself (highlighting etc.)
            // But in the case of clicking a misspelled word, we need electron to handle the click
            // The result is that CodeMirror doesn't know what's been selected and doesn't
            // move the cursor into the correct location.
            // and when the user selects a new spelling it will be inserted in the wrong location
            // So in this situation, we use must manually align the internal codemirror selection
            // to the contextmenu selection
            if (editorRef.current && !editorRef.current.cm6 && spellCheckerMenuItems.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- CodeMirror 5 editor's runtime alignSelection method is not in the type
                editorRef.current.alignSelection(params);
            }
            const extraItems = await (0, contextMenuUtils_1.handleEditorContextMenuFilter)({
                itemType: contextMenuUtils_1.ContextMenuItemType.Text,
            });
            if (extraItems.length) {
                menu.append(new MenuItem({
                    type: 'separator',
                }));
            }
            for (const extraItem of extraItems) {
                menu.append(extraItem);
            }
            // eslint-disable-next-line github/array-foreach, @typescript-eslint/no-explicit-any -- forEach used historically; lib's MenuItem shape doesn't structurally satisfy Electron's MenuItemConstructorOptions
            menuUtils.pluginContextMenuItems(props.plugins, types_1.MenuItemLocation.EditorContextMenu).forEach((item) => {
                menu.append(new MenuItem(item));
            });
            menu.popup({ window: targetWindow });
        };
        // Prepend the event listener so that it gets called before
        // the listener that shows the default menu.
        try {
            targetWindow.webContents.prependListener('context-menu', onContextMenu);
        }
        catch (error) {
            logger.warn('Error registering menu', error);
        }
        return () => {
            try {
                if (!targetWindow.isDestroyed()) {
                    targetWindow.webContents.off('context-menu', onContextMenu);
                }
            }
            catch (error) {
                // This can happen if the window closes after the isDestroyed check, but before webContents.off
                // finishes running.
                logger.warn('Error removing menu listener', error);
            }
        };
    }, [
        props.plugins, props.dispatch, props.editorClassName, editorRef, props.containerRef,
        props.editorCutText, props.editorCopyText, props.editorPaste,
        windowId,
    ]);
};
exports.default = useContextMenu;
//# sourceMappingURL=useContextMenu.js.map