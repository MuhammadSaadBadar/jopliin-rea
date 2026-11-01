"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reducer_1 = require("@joplin/lib/services/plugins/reducer");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const MenuUtils_1 = __importDefault(require("@joplin/lib/services/commands/MenuUtils"));
const InteropServiceHelper_1 = __importDefault(require("../../InteropServiceHelper"));
const locale_1 = require("@joplin/lib/locale");
const types_1 = require("@joplin/lib/services/plugins/api/types");
const callbackUrlUtils_1 = require("@joplin/lib/callbackUrlUtils");
const bridge_1 = __importDefault(require("../../services/bridge"));
const BaseModel_1 = __importDefault(require("@joplin/lib/BaseModel"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const electron_1 = require("electron");
const renderer_1 = require("@joplin/renderer");
const hasLockedNoteWhileSessionLocked_1 = __importDefault(require("@joplin/lib/services/noteLock/hasLockedNoteWhileSessionLocked"));
const Menu = (0, bridge_1.default)().Menu;
const MenuItem = (0, bridge_1.default)().MenuItem;
class NoteListUtils {
    static makeContextMenu(noteIds, props) {
        const cmdService = CommandService_1.default.instance();
        const menuUtils = new MenuUtils_1.default(cmdService);
        const notes = BaseModel_1.default.modelsByIds(props.notes, noteIds);
        const singleNoteId = noteIds.length === 1 ? noteIds[0] : null;
        const includeDeletedNotes = notes.find(n => !!n.deleted_time);
        const includeEncryptedNotes = notes.find(n => !!n.encryption_applied);
        const menu = new Menu();
        if (!includeEncryptedNotes && !includeDeletedNotes) {
            if (singleNoteId) {
                menu.append(new MenuItem(menuUtils.commandToStatefulMenuItem('openNoteInNewWindow', singleNoteId)));
                const cmd = props.watchedNoteFiles.includes(singleNoteId) ? 'stopExternalEditing' : 'startExternalEditing';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
                menu.append(new MenuItem(menuUtils.commandToStatefulMenuItem(cmd, singleNoteId)));
                menu.append(new MenuItem({ type: 'separator' }));
            }
            menu.append(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            new MenuItem(menuUtils.commandToStatefulMenuItem('setTags', noteIds)));
            menu.append(new MenuItem({ type: 'separator' }));
            if (noteIds.length <= 1) {
                menu.append(new MenuItem(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
                menuUtils.commandToStatefulMenuItem('toggleNoteType', noteIds)));
            }
            else {
                const switchNoteType = async (noteIds, type) => {
                    if (await (0, hasLockedNoteWhileSessionLocked_1.default)(noteIds)) {
                        (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Cannot change a locked note while the session is locked'));
                        return;
                    }
                    for (let i = 0; i < noteIds.length; i++) {
                        const note = await Note_1.default.load(noteIds[i]);
                        const newNote = Note_1.default.changeNoteType(note, type);
                        if (newNote === note)
                            continue;
                        await Note_1.default.save(newNote, { userSideValidation: true });
                    }
                };
                menu.append(new MenuItem({
                    label: (0, locale_1._)('Switch to note type'),
                    click: async () => {
                        await switchNoteType(noteIds, 'note');
                    },
                }));
                menu.append(new MenuItem({
                    label: (0, locale_1._)('Switch to to-do type'),
                    click: async () => {
                        await switchNoteType(noteIds, 'todo');
                    },
                }));
            }
            menu.append(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            new MenuItem(menuUtils.commandToStatefulMenuItem('moveToFolder', noteIds)));
            menu.append(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            new MenuItem(menuUtils.commandToStatefulMenuItem('duplicateNote', noteIds)));
            menu.append(new MenuItem(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            menuUtils.commandToStatefulMenuItem('deleteNote', noteIds)));
            menu.append(new MenuItem({ type: 'separator' }));
            menu.append(new MenuItem({
                label: (0, locale_1._)('Copy Markdown link'),
                click: async () => {
                    const links = [];
                    for (let i = 0; i < noteIds.length; i++) {
                        const note = await Note_1.default.load(noteIds[i]);
                        links.push(Note_1.default.markdownTag(note));
                    }
                    electron_1.clipboard.writeText(links.join(' '));
                },
            }));
            if (noteIds.length === 1) {
                menu.append(new MenuItem({
                    label: (0, locale_1._)('Copy external link'),
                    click: () => {
                        electron_1.clipboard.writeText((0, callbackUrlUtils_1.getNoteCallbackUrl)(noteIds[0]));
                    },
                }));
            }
            menu.append(new MenuItem({ type: 'separator' }));
            const includesHtmlNotes = notes.some(n => n.markup_language === renderer_1.MarkupLanguage.Html);
            if (includesHtmlNotes) {
                menu.append(new MenuItem(menuUtils.commandToStatefulMenuItem('convertNoteToMarkdown', noteIds)));
                menu.append(new MenuItem({ type: 'separator' }));
            }
            if ([9, 10, 11].includes(Setting_1.default.value('sync.target'))) {
                menu.append(new MenuItem(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
                menuUtils.commandToStatefulMenuItem('showShareNoteDialog', noteIds.slice())));
            }
            const exportMenu = new Menu();
            const ioService = InteropService_1.default.instance();
            const ioModules = ioService.modules();
            for (let i = 0; i < ioModules.length; i++) {
                const module = ioModules[i];
                if (module.type !== 'exporter')
                    continue;
                if (noteIds.length > 1 && module.isNoteArchive === false)
                    continue;
                exportMenu.append(new MenuItem({
                    label: module.fullLabel(),
                    click: async () => {
                        await InteropServiceHelper_1.default.export(props.dispatch.bind(this), module, {
                            sourceNoteIds: noteIds,
                            includeConflicts: props.inConflictFolder,
                            plugins: props.plugins,
                            customCss: props.customCss,
                        });
                    },
                }));
            }
            exportMenu.append(new MenuItem(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            menuUtils.commandToStatefulMenuItem('exportPdf', noteIds)));
            const exportMenuItem = new MenuItem({ label: (0, locale_1._)('Export'), submenu: exportMenu });
            menu.append(exportMenuItem);
        }
        if (includeDeletedNotes) {
            menu.append(new MenuItem(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            menuUtils.commandToStatefulMenuItem('restoreNote', noteIds)));
            menu.append(new MenuItem(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
            menuUtils.commandToStatefulMenuItem('permanentlyDeleteNote', noteIds)));
        }
        const pluginViewInfos = reducer_1.utils.viewInfosByType(props.plugins, 'menuItem');
        for (const info of pluginViewInfos) {
            const location = info.view.location;
            if (location !== types_1.MenuItemLocation.Context && location !== types_1.MenuItemLocation.NoteListContextMenu)
                continue;
            if (cmdService.isEnabled(info.view.commandName)) {
                menu.append(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- commandToStatefulMenuItem returns lib's MenuItem shape which doesn't structurally match Electron's MenuItemConstructorOptions
                new MenuItem(menuUtils.commandToStatefulMenuItem(info.view.commandName, noteIds)));
            }
        }
        return menu;
    }
}
exports.default = NoteListUtils;
//# sourceMappingURL=NoteListUtils.js.map