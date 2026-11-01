"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const reducer_1 = require("@joplin/lib/reducer");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const MenuUtils_1 = __importDefault(require("@joplin/lib/services/commands/MenuUtils"));
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const reducer_2 = require("@joplin/lib/services/plugins/reducer");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const versionInfo_1 = __importDefault(require("@joplin/lib/versionInfo"));
const InteropServiceHelper_1 = __importDefault(require("../InteropServiceHelper"));
const locale_1 = require("@joplin/lib/locale");
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const types_1 = require("@joplin/lib/services/plugins/api/types");
const SpellCheckerService_1 = __importDefault(require("@joplin/lib/services/spellChecker/SpellCheckerService"));
const menuCommandNames_1 = __importDefault(require("./menuCommandNames"));
const stateToWhenClauseContext_1 = __importDefault(require("../services/commands/stateToWhenClauseContext"));
const bridge_1 = __importDefault(require("../services/bridge"));
const checkForUpdates_1 = __importDefault(require("../checkForUpdates"));
const react_redux_1 = require("react-redux");
const registry_1 = require("@joplin/lib/registry");
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const renderers_1 = require("@joplin/lib/services/noteList/renderers");
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const eventManager_1 = require("@joplin/lib/eventManager");
const electron_1 = require("electron");
const NavService_1 = __importDefault(require("@joplin/lib/services/NavService"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const availability_1 = require("@joplin/lib/services/ai/availability");
const logger = Logger_1.default.create('MenuBar');
const packageInfo = require('../packageInfo.js');
const electron_2 = require("electron");
const Menu = (0, bridge_1.default)().Menu;
const menuUtils = new MenuUtils_1.default(CommandService_1.default.instance());
function pluginMenuItemsCommandNames(menuItems) {
    let output = [];
    for (const menuItem of menuItems) {
        if (menuItem.submenu) {
            output = output.concat(pluginMenuItemsCommandNames(menuItem.submenu));
        }
        else {
            if (menuItem.commandName)
                output.push(menuItem.commandName);
        }
    }
    return output;
}
function getPluginCommandNames(plugins) {
    let output = [];
    for (const view of reducer_2.utils.viewsByType(plugins, 'menu')) {
        output = output.concat(pluginMenuItemsCommandNames(view.menuItems));
    }
    for (const view of reducer_2.utils.viewsByType(plugins, 'menuItem')) {
        if (view.commandName)
            output.push(view.commandName);
    }
    return output;
}
function createPluginMenuTree(label, menuItems, onMenuItemClick) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
    const output = {
        label: label,
        submenu: [],
    };
    for (const menuItem of menuItems) {
        if (menuItem.submenu) {
            output.submenu.push(createPluginMenuTree(menuItem.label, menuItem.submenu, onMenuItemClick));
        }
        else {
            output.submenu.push(menuUtils.commandToMenuItem(menuItem.commandName, onMenuItemClick));
        }
    }
    return output;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
const useSwitchProfileMenuItems = (profileConfig, menuItemDic) => {
    return (0, react_1.useMemo)(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
        const switchProfileMenuItems = [];
        for (let i = 0; i < profileConfig.profiles.length; i++) {
            const profile = profileConfig.profiles[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
            let menuItem = {};
            const profileNum = i + 1;
            if (menuItemDic[`switchProfile${profileNum}`]) {
                menuItem = Object.assign({}, menuItemDic[`switchProfile${profileNum}`]);
            }
            else {
                menuItem = {
                    label: profile.name,
                    click: () => {
                        void CommandService_1.default.instance().execute('switchProfile', profile.id);
                    },
                };
            }
            menuItem.label = profile.name;
            menuItem.type = 'checkbox';
            menuItem.checked = profileConfig.currentProfileId === profile.id;
            switchProfileMenuItems.push(menuItem);
        }
        switchProfileMenuItems.push({ type: 'separator' });
        switchProfileMenuItems.push(menuItemDic.addProfile);
        switchProfileMenuItems.push(menuItemDic.showProfileEditor);
        return switchProfileMenuItems;
    }, [profileConfig, menuItemDic]);
};
const useNoteListMenuItems = (noteListRendererIds) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
    const [menuItems, setMenuItems] = (0, react_1.useState)([]);
    (0, useAsyncEffect_1.default)(async (event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
        const output = [];
        for (const id of noteListRendererIds) {
            const renderer = (0, renderers_1.getListRendererById)(id);
            output.push({
                id: `noteListRenderer_${id}`,
                label: await renderer.label(),
                type: 'checkbox',
                click: () => {
                    Setting_1.default.setValue('notes.listRendererId', id);
                },
            });
            if (event.cancelled)
                return;
        }
        setMenuItems(output);
    }, [noteListRendererIds]);
    return menuItems;
};
const commandNames = (0, menuCommandNames_1.default)();
function menuItemSetChecked(id, checked) {
    const menu = Menu.getApplicationMenu();
    const menuItem = menu.getMenuItemById(id);
    if (!menuItem)
        return;
    menuItem.checked = checked;
}
function menuItemSetEnabled(id, enabled) {
    const menu = Menu.getApplicationMenu();
    const menuItem = menu.getMenuItemById(id);
    if (!menuItem)
        return;
    // Don't disable menu items that have a role (e.g. copy, paste, cut,
    // selectAll). Since Electron 40, disabling a role-based menu item also
    // prevents the native role behaviour, which breaks clipboard operations
    // in non-editor input fields such as the Settings screen.
    if (!enabled && menuItem.role)
        return;
    menuItem.enabled = enabled;
}
const applyMenuBarVisibility = (windowId, showMenuBar) => {
    var _a;
    // The menu bar cannot be hidden on macOS
    if (shim_1.default.isMac())
        return;
    const window = (_a = (0, bridge_1.default)().windowById(windowId)) !== null && _a !== void 0 ? _a : (0, bridge_1.default)().mainWindow();
    window.setAutoHideMenuBar(!showMenuBar);
    window.setMenuBarVisibility(showMenuBar);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
function useMenuStates(menu, props) {
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
        let timeoutId = null;
        function scheduleUpdate() {
            if (!timeoutId)
                return; // Was cancelled
            timeoutId = null;
            const whenClauseContext = CommandService_1.default.instance().currentWhenClauseContext();
            for (const commandName in props.menuItemProps) {
                const p = props.menuItemProps[commandName];
                if (!p)
                    continue;
                const enabled = 'enabled' in p ? p.enabled : CommandService_1.default.instance().isEnabled(commandName, whenClauseContext);
                menuItemSetEnabled(commandName, enabled);
            }
            const layoutButtonSequenceOptions = Setting_1.default.enumOptions('layoutButtonSequence');
            for (const value in layoutButtonSequenceOptions) {
                menuItemSetChecked(`layoutButtonSequence_${value}`, props.layoutButtonSequence === Number(value));
            }
            const listRendererIds = (0, renderers_1.getListRendererIds)();
            for (const id of listRendererIds) {
                menuItemSetChecked(`noteListRenderer_${id}`, props.noteListRendererId === id);
            }
            function applySortItemCheckState(type) {
                const sortOptions = Setting_1.default.enumOptions(`${type}.sortOrder.field`);
                for (const field in sortOptions) {
                    if (!sortOptions.hasOwnProperty(field))
                        continue;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
                    menuItemSetChecked(`sort:${type}:${field}`, props[`${type}.sortOrder.field`] === field);
                }
                const id = type === 'notes' ? 'toggleNotesSortOrderReverse' : `sort:${type}:reverse`;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
                menuItemSetChecked(id, props[`${type}.sortOrder.reverse`]);
            }
            applySortItemCheckState('notes');
            applySortItemCheckState('folders');
            menuItemSetChecked('showNoteCounts', props.showNoteCounts);
            menuItemSetChecked('uncompletedTodosOnTop', props.uncompletedTodosOnTop);
            menuItemSetChecked('showCompletedTodos', props.showCompletedTodos);
            menuItemSetChecked('toggleTabMovesFocus', props.tabMovesFocus);
        }
        timeoutId = setTimeout(scheduleUpdate, 150);
        return () => {
            clearTimeout(timeoutId);
            timeoutId = null;
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [
        props.menuItemProps,
        props.layoutButtonSequence,
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
        props['notes.sortOrder.field'],
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
        props['folders.sortOrder.field'],
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
        props['notes.sortOrder.reverse'],
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
        props['folders.sortOrder.reverse'],
        props.markdownEditorVisible,
        props.tabMovesFocus,
        props.noteListRendererId,
        props.showNoteCounts,
        props.uncompletedTodosOnTop,
        props.showCompletedTodos,
        menu,
    ]);
}
function useMenu(props) {
    const [menu, setMenu] = (0, react_1.useState)(null);
    const [keymapLastChangeTime, setKeymapLastChangeTime] = (0, react_1.useState)(Date.now());
    const [modulesLastChangeTime, setModulesLastChangeTime] = (0, react_1.useState)(Date.now());
    // We use a ref here because the plugin state can change frequently when
    // switching note since any plugin view might be rendered again. However we
    // need this plugin state only in a click handler when exporting notes, and
    // for that a ref is sufficient.
    const pluginsRef = (0, react_1.useRef)(props.plugins);
    const onMenuItemClick = (0, react_1.useCallback)((commandName) => {
        void CommandService_1.default.instance().execute(commandName);
    }, []);
    const onImportModuleClick = (0, react_1.useCallback)(async (module, moduleSource) => {
        const options = {
            destinationFolderId: !module.isNoteArchive && moduleSource === 'file' ? props.selectedFolderId : null,
            sourcePath: undefined, // Show a file picker
            sourceType: moduleSource,
            importFormat: module.format,
            outputFormat: module.outputFormat,
        };
        await CommandService_1.default.instance().execute('importFrom', options);
    }, [props.selectedFolderId]);
    const onMenuItemClickRef = (0, react_1.useRef)(null);
    onMenuItemClickRef.current = onMenuItemClick;
    const onImportModuleClickRef = (0, react_1.useRef)(null);
    onImportModuleClickRef.current = onImportModuleClick;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
    const pluginCommandNames = (0, react_1.useMemo)(() => props.pluginMenuItems.map((view) => view.commandName), [props.pluginMenuItems]);
    const menuItemDic = (0, react_1.useMemo)(() => {
        return menuUtils.commandsToMenuItems(commandNames.concat(pluginCommandNames), (commandName) => onMenuItemClickRef.current(commandName), props.locale);
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [commandNames, pluginCommandNames, props.locale]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
    const switchProfileMenuItems = useSwitchProfileMenuItems(props.profileConfig, menuItemDic);
    const noteListMenuItems = useNoteListMenuItems(props.noteListRendererIds);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
        let timeoutId = null;
        function updateMenu() {
            if (!timeoutId)
                return; // Has been cancelled
            const keymapService = KeymapService_1.default.instance();
            const navigateTo = (routeName) => {
                void NavService_1.default.go(routeName);
                // NavService.go opens in the main window -- switch to it to show the screen:
                const isBackgroundWindow = props.windowId !== reducer_1.defaultWindowId;
                if (isBackgroundWindow) {
                    logger.info('Focusing the main window');
                    (0, bridge_1.default)().mainWindow().show();
                }
            };
            const quitMenuItem = {
                label: (0, locale_1._)('Quit'),
                accelerator: keymapService.getAccelerator('quit'),
                click: () => {
                    (0, bridge_1.default)().electronApp().quitWithSyncCheck((action) => props.dispatch(action), props.syncPending);
                },
            };
            const sortNoteFolderItems = (type) => {
                const sortItems = [];
                const sortOptions = Setting_1.default.enumOptions(`${type}.sortOrder.field`);
                for (const field in sortOptions) {
                    if (!sortOptions.hasOwnProperty(field))
                        continue;
                    sortItems.push({
                        id: `sort:${type}:${field}`,
                        label: sortOptions[field],
                        type: 'checkbox',
                        // checked: Setting.value(`${type}.sortOrder.field`) === field,
                        click: () => {
                            if (type === 'notes') {
                                void CommandService_1.default.instance().execute('toggleNotesSortOrderField', field);
                            }
                            else {
                                Setting_1.default.setValue(`${type}.sortOrder.field`, field);
                            }
                        },
                    });
                }
                sortItems.push({ type: 'separator' });
                if (type === 'notes') {
                    sortItems.push(Object.assign(Object.assign({}, menuItemDic.toggleNotesSortOrderReverse), { type: 'checkbox' }), Object.assign(Object.assign({}, menuItemDic.toggleNotesSortOrderField), { visible: false }));
                }
                else {
                    sortItems.push({
                        id: `sort:${type}:reverse`,
                        label: Setting_1.default.settingMetadata(`${type}.sortOrder.reverse`).label(),
                        type: 'checkbox',
                        // checked: Setting.value(`${type}.sortOrder.reverse`),
                        click: () => {
                            Setting_1.default.setValue(`${type}.sortOrder.reverse`, !Setting_1.default.value(`${type}.sortOrder.reverse`));
                        },
                    });
                }
                return sortItems;
            };
            const sortNoteItems = sortNoteFolderItems('notes');
            const sortFolderItems = sortNoteFolderItems('folders');
            const focusItems = [
                menuItemDic.focusElementSideBar,
                menuItemDic.focusElementNoteList,
                menuItemDic.focusElementNoteTitle,
                menuItemDic.focusElementNoteBody,
                menuItemDic.focusElementNoteViewer,
                menuItemDic.focusElementToolbar,
            ];
            const importItems = [];
            const exportItems = [];
            const ioService = InteropService_1.default.instance();
            const ioModules = ioService.modules();
            for (let i = 0; i < ioModules.length; i++) {
                const module = ioModules[i];
                if (module.type === 'exporter') {
                    if (module.isNoteArchive !== false) {
                        exportItems.push({
                            label: module.fullLabel(),
                            click: async () => {
                                await InteropServiceHelper_1.default.export(
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
                                (action) => props.dispatch(action), module, {
                                    plugins: pluginsRef.current,
                                    customCss: props.customCss,
                                });
                            },
                        });
                    }
                }
                else {
                    for (let j = 0; j < module.sources.length; j++) {
                        const moduleSource = module.sources[j];
                        importItems.push({
                            label: module.fullLabel(moduleSource),
                            click: () => onImportModuleClickRef.current(module, moduleSource),
                        });
                        if (module.separatorAfter)
                            importItems.push({ type: 'separator' });
                    }
                }
            }
            importItems.push({ type: 'separator' });
            importItems.push({
                label: (0, locale_1._)('Other applications...'),
                click: () => { void (0, bridge_1.default)().openExternal('https://discourse.joplinapp.org/t/importing-notes-from-other-notebook-applications/22425'); },
            });
            exportItems.push(menuItemDic.exportPdf);
            // We need a dummy entry, otherwise the ternary operator to show a
            // menu item only on a specific OS does not work.
            const noItem = {
                type: 'separator',
                visible: false,
            };
            const syncStatusItem = {
                label: (0, locale_1._)('Synchronisation Status'),
                click: () => {
                    navigateTo('Status');
                },
            };
            const separator = () => {
                return {
                    type: 'separator',
                };
            };
            const newNoteItem = menuItemDic.newNote;
            const newTodoItem = menuItemDic.newTodo;
            const newFolderItem = menuItemDic.newFolder;
            const newSubFolderItem = menuItemDic.newSubFolder;
            const printItem = menuItemDic.print;
            const openSecondaryAppInstance = menuItemDic.openSecondaryAppInstance;
            const openPrimaryAppInstance = menuItemDic.openPrimaryAppInstance;
            const switchProfileItem = {
                label: (0, locale_1._)('Switch profile'),
                submenu: switchProfileMenuItems,
            };
            const profilesAndAppInstancesItems = [
                openSecondaryAppInstance,
                openPrimaryAppInstance,
                switchProfileItem,
            ];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
            let toolsItems = [];
            // we need this workaround, because on macOS the menu is different
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
            const toolsItemsWindowsLinux = [
                {
                    label: (0, locale_1._)('Options'),
                    accelerator: keymapService.getAccelerator('config'),
                    click: () => {
                        navigateTo('Config');
                    },
                },
                separator(),
            ];
            // the following menu items will be available for all OS under Tools
            const toolsItemsAll = [
                menuItemDic.newWhiteboard,
                menuItemDic.addNoteToWhiteboard,
                separator(),
                {
                    label: (0, locale_1._)('Note attachments...'),
                    click: () => {
                        navigateTo('Resources');
                    },
                },
            ];
            if (!shim_1.default.isMac()) {
                toolsItems = toolsItems.concat(toolsItemsWindowsLinux);
            }
            toolsItems = toolsItems.concat(toolsItemsAll);
            toolsItems.push(SpellCheckerService_1.default.instance().spellCheckerConfigMenuItem(props['spellChecker.languages'], props['spellChecker.enabled']));
            function _checkForUpdates() {
                if (Setting_1.default.value('featureFlag.autoUpdaterServiceEnabled')) {
                    electron_1.ipcRenderer.send('check-for-updates');
                }
                else {
                    void (0, checkForUpdates_1.default)(false, (0, bridge_1.default)().mainWindow(), { includePreReleases: Setting_1.default.value('autoUpdate.includePreReleases') });
                }
            }
            function _showAbout() {
                const v = (0, versionInfo_1.default)(packageInfo, PluginService_1.default.instance().enabledPlugins(props.pluginSettings));
                const copyToClipboard = (0, bridge_1.default)().showMessageBox(v.message, {
                    icon: `${(0, bridge_1.default)().electronApp().buildDir()}/icons/128x128.png`,
                    buttons: [(0, locale_1._)('Copy'), (0, locale_1._)('OK')],
                    cancelId: 1,
                    defaultId: 1,
                });
                if (copyToClipboard === 0) {
                    electron_2.clipboard.writeText(v.body);
                }
            }
            const rootMenuFile = {
                // Using a dummy entry for macOS here, because first menu
                // becomes 'Joplin' and we need a menu called 'File' later.
                label: shim_1.default.isMac() ? '&JoplinMainMenu' : (0, locale_1._)('&File'),
                // `&` before one of the char in the label name mean, that
                // <Alt + F> will open this menu. It's needed because electron
                // opens the first menu on Alt press if no hotkey assigned.
                // Issue: https://github.com/laurent22/joplin/issues/934
                submenu: [{
                        label: (0, locale_1._)('About Joplin'),
                        visible: !!shim_1.default.isMac(),
                        click: () => _showAbout(),
                    }, {
                        type: 'separator',
                        visible: !!shim_1.default.isMac(),
                    }, {
                        label: (0, locale_1._)('Preferences...'),
                        visible: !!shim_1.default.isMac(),
                        accelerator: shim_1.default.isMac() && keymapService.getAccelerator('config'),
                        click: () => {
                            navigateTo('Config');
                        },
                    }, {
                        label: (0, locale_1._)('Check for updates...'),
                        visible: !!shim_1.default.isMac(),
                        click: () => _checkForUpdates(),
                    }, {
                        type: 'separator',
                        visible: !!shim_1.default.isMac(),
                    },
                    shim_1.default.isMac() ? noItem : newNoteItem,
                    shim_1.default.isMac() ? noItem : newTodoItem,
                    shim_1.default.isMac() ? noItem : newFolderItem,
                    shim_1.default.isMac() ? noItem : newSubFolderItem,
                    {
                        type: 'separator',
                        visible: !shim_1.default.isMac(),
                    }, {
                        label: (0, locale_1._)('Import'),
                        visible: !shim_1.default.isMac(),
                        submenu: importItems,
                    }, {
                        label: (0, locale_1._)('Export all'),
                        visible: !shim_1.default.isMac(),
                        submenu: exportItems,
                    }, {
                        type: 'separator',
                    },
                    menuItemDic.synchronize,
                    shim_1.default.isMac() ? noItem : printItem, {
                        type: 'separator',
                        platforms: ['darwin'],
                    },
                    ...(shim_1.default.isMac() ? [] : profilesAndAppInstancesItems),
                    shim_1.default.isMac() ? noItem : {
                        type: 'separator',
                    },
                    shim_1.default.isMac() ? noItem : {
                        label: (0, locale_1._)('Close Window'),
                        accelerator: keymapService.getAccelerator('closeWindow'),
                        click: () => {
                            var _a;
                            (_a = (0, bridge_1.default)().activeWindow()) === null || _a === void 0 ? void 0 : _a.close();
                        },
                    },
                    shim_1.default.isMac() ? {
                        label: (0, locale_1._)('Hide %s', 'Joplin'),
                        platforms: ['darwin'],
                        accelerator: shim_1.default.isMac() && keymapService.getAccelerator('hideApp'),
                        click: () => { (0, bridge_1.default)().electronApp().hide(); },
                    } : noItem,
                    shim_1.default.isMac() ? {
                        role: 'hideothers',
                    } : noItem,
                    shim_1.default.isMac() ? {
                        role: 'unhide',
                    } : noItem,
                    {
                        type: 'separator',
                    },
                    quitMenuItem],
            };
            const rootMenuFileMacOs = {
                label: (0, locale_1._)('&File'),
                visible: !!shim_1.default.isMac(),
                submenu: [
                    newNoteItem,
                    newTodoItem,
                    newFolderItem,
                    newSubFolderItem,
                    {
                        label: (0, locale_1._)('Close Window'),
                        platforms: ['darwin'],
                        accelerator: shim_1.default.isMac() && keymapService.getAccelerator('closeWindow'),
                        selector: 'performClose:',
                    }, {
                        type: 'separator',
                    }, {
                        label: (0, locale_1._)('Import'),
                        submenu: importItems,
                    }, {
                        label: (0, locale_1._)('Export all'),
                        submenu: exportItems,
                    }, {
                        type: 'separator',
                    },
                    printItem, {
                        type: 'separator',
                    },
                    ...profilesAndAppInstancesItems,
                ],
            };
            const layoutButtonSequenceOptions = Setting_1.default.enumOptions('layoutButtonSequence');
            const layoutButtonSequenceMenuItems = [];
            for (const value in layoutButtonSequenceOptions) {
                layoutButtonSequenceMenuItems.push({
                    id: `layoutButtonSequence_${value}`,
                    label: layoutButtonSequenceOptions[value],
                    type: 'checkbox',
                    click: () => {
                        Setting_1.default.setValue('layoutButtonSequence', Number(value));
                    },
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
            const rootMenus = {
                edit: {
                    id: 'edit',
                    label: (0, locale_1._)('&Edit'),
                    submenu: [
                        menuItemDic.textCopy,
                        menuItemDic.textCut,
                        menuItemDic.textPaste,
                        menuItemDic.pasteAsText,
                        menuItemDic.pasteAsMarkdown,
                        menuItemDic.textSelectAll,
                        separator(),
                        menuItemDic.globalUndo,
                        menuItemDic.globalRedo,
                        separator(),
                        menuItemDic.textBold,
                        menuItemDic.textItalic,
                        menuItemDic.textLink,
                        menuItemDic.textCode,
                        separator(),
                        menuItemDic.insertDateTime,
                        menuItemDic.attachFile,
                        separator(),
                        menuItemDic['editor.deleteLine'],
                        menuItemDic['editor.duplicateLine'],
                        menuItemDic['editor.toggleComment'],
                        menuItemDic['editor.sortSelectedLines'],
                        menuItemDic['editor.indentLess'],
                        menuItemDic['editor.indentMore'],
                        menuItemDic['editor.swapLineDown'],
                        menuItemDic['editor.swapLineUp'],
                        separator(),
                        menuItemDic.focusSearch,
                        menuItemDic.showLocalSearch,
                    ],
                },
                view: {
                    label: (0, locale_1._)('&View'),
                    submenu: [
                        menuItemDic.toggleLayoutMoveMode,
                        menuItemDic.resetLayout,
                        separator(),
                        menuItemDic.toggleSideBar,
                        shim_1.default.isMac() ? noItem : menuItemDic.toggleMenuBar,
                        menuItemDic.toggleNoteList,
                        Object.assign(Object.assign({}, menuItemDic.toggleAiChat), { visible: props.showAiChatMenuItem }),
                        menuItemDic.toggleVisiblePanes,
                        menuItemDic.toggleEditorPlugin,
                        menuItemDic.toggleEditors,
                        {
                            label: (0, locale_1._)('Layout button sequence'),
                            submenu: layoutButtonSequenceMenuItems,
                        },
                        {
                            label: (0, locale_1._)('Note list style'),
                            submenu: noteListMenuItems,
                            visible: noteListMenuItems.length > 1,
                        },
                        separator(),
                        {
                            label: Setting_1.default.settingMetadata('notes.sortOrder.field').label(),
                            submenu: sortNoteItems,
                        }, {
                            label: Setting_1.default.settingMetadata('folders.sortOrder.field').label(),
                            submenu: sortFolderItems,
                        }, {
                            id: 'showNoteCounts',
                            label: Setting_1.default.settingMetadata('showNoteCounts').label(),
                            type: 'checkbox',
                            click: () => {
                                Setting_1.default.setValue('showNoteCounts', !Setting_1.default.value('showNoteCounts'));
                            },
                        }, {
                            id: 'uncompletedTodosOnTop',
                            label: Setting_1.default.settingMetadata('uncompletedTodosOnTop').label(),
                            type: 'checkbox',
                            click: () => {
                                Setting_1.default.setValue('uncompletedTodosOnTop', !Setting_1.default.value('uncompletedTodosOnTop'));
                            },
                        }, {
                            id: 'showCompletedTodos',
                            label: Setting_1.default.settingMetadata('showCompletedTodos').label(),
                            type: 'checkbox',
                            click: () => {
                                Setting_1.default.setValue('showCompletedTodos', !Setting_1.default.value('showCompletedTodos'));
                            },
                        },
                        separator(),
                        Object.assign(Object.assign({}, menuItemDic['toggleTabMovesFocus']), { label: Setting_1.default.settingMetadata('editor.tabMovesFocus').label(), type: 'checkbox' }),
                        separator(),
                        {
                            label: (0, locale_1._)('Actual Size'),
                            click: () => {
                                Setting_1.default.setValue('windowContentZoomFactor', 100);
                            },
                            accelerator: 'CommandOrControl+0',
                        }, {
                            // There are 2 shortcuts for the action 'zoom in', mainly to increase the user experience.
                            // Most applications handle this the same way. These applications indicate Ctrl +, but actually mean Ctrl =.
                            // In fact they allow both: + and =. On the English keyboard layout - and = are used without the shift key.
                            // So to use Ctrl + would mean to use the shift key, but this is not the case in any of the apps that show Ctrl +.
                            // Additionally it allows the use of the plus key on the numpad.
                            label: (0, locale_1._)('Zoom In'),
                            click: () => {
                                Setting_1.default.incValue('windowContentZoomFactor', 10);
                            },
                            accelerator: 'CommandOrControl+Plus',
                        }, {
                            label: (0, locale_1._)('Zoom In'),
                            visible: false,
                            click: () => {
                                Setting_1.default.incValue('windowContentZoomFactor', 10);
                            },
                            accelerator: 'CommandOrControl+=',
                        }, {
                            label: (0, locale_1._)('Zoom Out'),
                            click: () => {
                                Setting_1.default.incValue('windowContentZoomFactor', -10);
                            },
                            accelerator: 'CommandOrControl+-',
                        }, {
                            type: 'separator',
                            visible: shim_1.default.isMac(),
                        }, {
                            role: 'togglefullscreen',
                            visible: shim_1.default.isMac(),
                        }
                    ],
                },
                go: {
                    label: (0, locale_1._)('&Go'),
                    submenu: [
                        menuItemDic.historyBackward,
                        menuItemDic.historyForward,
                        separator(),
                        {
                            label: (0, locale_1._)('Focus'),
                            submenu: focusItems,
                        },
                    ],
                },
                folder: {
                    label: (0, locale_1._)('Note&book'),
                    submenu: [
                        menuItemDic.showShareFolderDialog,
                    ],
                },
                note: {
                    label: (0, locale_1._)('&Note'),
                    submenu: [
                        menuItemDic.openNoteInNewWindow,
                        menuItemDic.toggleExternalEditing,
                        separator(),
                        menuItemDic.linkToNote,
                        menuItemDic.setTags,
                        menuItemDic.showShareNoteDialog,
                        menuItemDic.convertNoteToMarkdown,
                        ...((0, isNoteLockEnabled_1.default)() ? [
                            separator(),
                            menuItemDic.enableNoteEncryption,
                            menuItemDic.disableNoteEncryption,
                            menuItemDic.lockEncryptedNotes,
                        ] : []),
                        separator(),
                        menuItemDic.showNoteProperties,
                        menuItemDic.showNoteContentProperties,
                        separator(),
                        menuItemDic.permanentlyDeleteNote,
                    ],
                },
                tools: {
                    label: (0, locale_1._)('&Tools'),
                    submenu: toolsItems,
                },
                window: {
                    id: 'window',
                    // Adds the default MacOS actions (e.g. "tile left") to the menu.
                    //
                    // Note: If the dev tools are shown on startup, this adds additional tab-related
                    // actions to the menu that are not otherwise shown. See https://stackoverflow.com/a/77458809
                    role: 'windowMenu',
                    label: (0, locale_1._)('&Window'),
                    visible: !!shim_1.default.isMac(),
                    submenu: [
                        {
                            role: 'minimize',
                            accelerator: shim_1.default.isMac() && keymapService.getAccelerator('minimizeWindow'),
                        },
                    ],
                },
                help: {
                    label: (0, locale_1._)('&Help'),
                    role: 'help', // Makes it add the "Search" field on macOS
                    submenu: [{
                            label: (0, locale_1._)('Website and documentation'),
                            accelerator: keymapService.getAccelerator('help'),
                            click() { void (0, bridge_1.default)().openExternal('https://joplinapp.org'); },
                        }, {
                            label: (0, locale_1._)('Joplin Forum'),
                            click() { void (0, bridge_1.default)().openExternal('https://discourse.joplinapp.org'); },
                        }, {
                            label: (0, locale_1._)('Join us on %s', 'Bluesky'),
                            click() { void (0, bridge_1.default)().openExternal('https://bsky.app/profile/joplinapp.bsky.social'); },
                        }, {
                            label: (0, locale_1._)('Make a donation'),
                            click() { void (0, bridge_1.default)().openExternal('https://joplinapp.org/donate/'); },
                        }, {
                            label: (0, locale_1._)('Check for updates...'),
                            visible: !shim_1.default.isMac(),
                            click: () => _checkForUpdates(),
                        },
                        separator(),
                        syncStatusItem,
                        separator(),
                        menuItemDic.exportDeletionLog,
                        {
                            id: 'help:toggleDevTools',
                            label: (0, locale_1._)('Toggle development tools'),
                            click: () => {
                                props.dispatch({
                                    type: 'NOTE_DEVTOOLS_TOGGLE',
                                });
                            },
                        },
                        menuItemDic.toggleSafeMode,
                        menuItemDic.openProfileDirectory,
                        menuItemDic.copyDevCommand,
                        {
                            type: 'separator',
                            visible: !shim_1.default.isMac(),
                        }, {
                            label: (0, locale_1._)('About Joplin'),
                            visible: !shim_1.default.isMac(),
                            click: () => _showAbout(),
                        }],
                },
            };
            if (shim_1.default.isMac()) {
                rootMenus.macOsApp = rootMenuFile;
                rootMenus.file = rootMenuFileMacOs;
            }
            else {
                rootMenus.file = rootMenuFile;
            }
            // It seems the "visible" property of separators is ignored by Electron, making
            // it display separators that we want hidden. So this function iterates through
            // them and remove them completely.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
            const cleanUpSeparators = (items) => {
                const output = [];
                for (const item of items) {
                    if ('visible' in item && item.type === 'separator' && !item.visible)
                        continue;
                    output.push(item);
                }
                return output;
            };
            for (const key in rootMenus) {
                if (!rootMenus.hasOwnProperty(key))
                    continue;
                if (!rootMenus[key].submenu)
                    continue;
                rootMenus[key].submenu = cleanUpSeparators(rootMenus[key].submenu);
            }
            rootMenus.go.submenu.push(menuItemDic.gotoAnything);
            rootMenus.tools.submenu.push(menuItemDic.commandPalette);
            rootMenus.tools.submenu.push(menuItemDic.openMasterPasswordDialog);
            for (const view of props.pluginMenuItems) {
                const location = view.location;
                if ((0, types_1.isContextMenuItemLocation)(location))
                    continue;
                const itemParent = rootMenus[location];
                if (!itemParent) {
                    registry_1.reg.logger().error('Menu item location does not exist: ', location, view);
                }
                else {
                    itemParent.submenu.push(menuItemDic[view.commandName]);
                }
            }
            for (const view of props.pluginMenus) {
                if ((0, types_1.isContextMenuItemLocation)(view.location))
                    continue;
                const itemParent = rootMenus[view.location];
                if (!itemParent) {
                    registry_1.reg.logger().error('Menu location does not exist: ', location, view);
                }
                else {
                    itemParent.submenu.push(createPluginMenuTree(view.label, view.menuItems, (commandName) => onMenuItemClickRef.current(commandName)));
                }
            }
            const template = [
                shim_1.default.isMac() ? rootMenus.macOsApp : null,
                rootMenus.file,
                rootMenus.edit,
                rootMenus.view,
                rootMenus.go,
                rootMenus.folder,
                rootMenus.note,
                rootMenus.tools,
                shim_1.default.isMac() ? rootMenus.window : null,
                rootMenus.help,
            ].filter(item => item !== null);
            if (!props.mainScreenVisible) {
                setMenu(Menu.buildFromTemplate([
                    {
                        label: (0, locale_1._)('&File'),
                        submenu: [quitMenuItem],
                    },
                    {
                        label: (0, locale_1._)('&Edit'),
                        submenu: [
                            menuItemDic.textCopy,
                            menuItemDic.textCut,
                            menuItemDic.textPaste,
                            menuItemDic.textSelectAll,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
                        ],
                    },
                ]));
            }
            else {
                setMenu(Menu.buildFromTemplate(template));
            }
        }
        timeoutId = setTimeout(updateMenu, 50);
        return () => {
            clearTimeout(timeoutId);
            timeoutId = null;
        };
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [
        props.windowId,
        props.mainScreenVisible,
        props.pluginMenuItems,
        props.pluginMenus,
        keymapLastChangeTime,
        modulesLastChangeTime,
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
        props['spellChecker.languages'],
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
        props['spellChecker.enabled'],
        noteListMenuItems,
        props.pluginSettings,
        props.customCss,
        props.locale,
        props.profileConfig,
        switchProfileMenuItems,
        menuItemDic,
        props.syncPending,
        props.showAiChatMenuItem,
    ]);
    useMenuStates(menu, props);
    (0, react_1.useEffect)(() => {
        function onKeymapChange() {
            setKeymapLastChangeTime(Date.now());
        }
        KeymapService_1.default.instance().on(eventManager_1.EventName.KeymapChange, onKeymapChange);
        return () => {
            KeymapService_1.default.instance().off(eventManager_1.EventName.KeymapChange, onKeymapChange);
        };
    }, []);
    (0, react_1.useEffect)(() => {
        function onModulesChanged() {
            setModulesLastChangeTime(Date.now());
        }
        InteropService_1.default.instance().on('modulesChanged', onModulesChanged);
        return () => {
            InteropService_1.default.instance().off('modulesChanged', onModulesChanged);
        };
    }, []);
    return menu;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Electron MenuItemConstructorOptions has heterogeneous shapes (submenu/role/type/click vary by item kind); the menu structure is built dynamically
function MenuBar(props) {
    const menu = useMenu(props);
    (0, react_1.useEffect)(() => {
        // Currently, this sets the menu for all windows. Although it's possible to set the menu
        // for individual windows with BrowserWindow.setMenu, it causes issues with updating the
        // state of existing menu items (and doesn't work with MacOS/Playwright).
        if (menu) {
            Menu.setApplicationMenu(menu);
        }
    }, [menu]);
    (0, react_1.useEffect)(() => {
        applyMenuBarVisibility(props.windowId, props.showMenuBar);
    }, [props.showMenuBar, props.windowId]);
    return null;
}
const mapStateToProps = (state) => {
    const whenClauseContext = (0, stateToWhenClauseContext_1.default)(state, { windowId: state.windowId });
    const secondaryWindowFocused = state.windowId !== reducer_1.defaultWindowId;
    return {
        windowId: state.windowId,
        menuItemProps: menuUtils.commandsToMenuItemProps(commandNames.concat(getPluginCommandNames(state.pluginService.plugins)), whenClauseContext),
        locale: state.settings.locale,
        // Secondary windows can only show the main screen
        mainScreenVisible: state.route.routeName === 'Main' || secondaryWindowFocused,
        selectedFolderId: state.selectedFolderId,
        layoutButtonSequence: state.settings.layoutButtonSequence,
        ['notes.sortOrder.field']: state.settings['notes.sortOrder.field'],
        ['folders.sortOrder.field']: state.settings['folders.sortOrder.field'],
        ['notes.sortOrder.reverse']: state.settings['notes.sortOrder.reverse'],
        ['folders.sortOrder.reverse']: state.settings['folders.sortOrder.reverse'],
        tabMovesFocus: state.settings['editor.tabMovesFocus'],
        pluginSettings: state.settings['plugins.states'],
        showNoteCounts: state.settings.showNoteCounts,
        uncompletedTodosOnTop: state.settings.uncompletedTodosOnTop,
        showCompletedTodos: state.settings.showCompletedTodos,
        pluginMenuItems: reducer_1.stateUtils.selectArrayShallow({ array: reducer_2.utils.viewsByType(state.pluginService.plugins, 'menuItem') }, 'menuBar.pluginMenuItems'),
        pluginMenus: reducer_1.stateUtils.selectArrayShallow({ array: reducer_2.utils.viewsByType(state.pluginService.plugins, 'menu') }, 'menuBar.pluginMenus'),
        ['spellChecker.languages']: state.settings['spellChecker.languages'],
        ['spellChecker.enabled']: state.settings['spellChecker.enabled'],
        markdownEditorVisible: whenClauseContext.markdownEditorVisible,
        plugins: state.pluginService.plugins,
        customCss: state.customViewerCss,
        profileConfig: state.profileConfig,
        noteListRendererIds: state.noteListRendererIds,
        noteListRendererId: state.settings['notes.listRendererId'],
        showMenuBar: state.settings.showMenuBar,
        syncPending: state.syncPending,
        showAiChatMenuItem: (0, availability_1.chatAvailability)().available || !!state.settings['ai.chat.showToolbarButton'],
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(MenuBar);
//# sourceMappingURL=MenuBar.js.map