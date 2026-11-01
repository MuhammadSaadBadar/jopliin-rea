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
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const types_1 = require("@joplin/lib/services/interop/types");
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("./services/bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const path_utils_1 = require("@joplin/lib/path-utils");
const time_1 = __importDefault(require("@joplin/lib/time"));
const md5 = require('md5');
const url = __importStar(require("url"));
class InteropServiceHelper {
    static async exportNoteToHtmlFile(noteId, exportOptions) {
        const tempFile = `${Setting_1.default.value('tempDir')}/${md5(Date.now() + Math.random())}.html`;
        const fullExportOptions = Object.assign({ path: tempFile, format: types_1.ExportModuleOutputFormat.Html, target: types_1.FileSystemItem.File, sourceNoteIds: [noteId], customCss: '' }, exportOptions);
        const service = InteropService_1.default.instance();
        const result = await service.export(fullExportOptions);
        // eslint-disable-next-line no-console
        console.info('Export HTML result: ', result);
        return tempFile;
    }
    static async exportNoteTo_(target, noteId, options = {}) {
        let win = null;
        let htmlFile = null;
        const cleanup = () => {
            if (win)
                win.destroy();
            if (htmlFile)
                void shim_1.default.fsDriver().remove(htmlFile);
        };
        try {
            const exportOptions = {
                customCss: options.customCss ? options.customCss : '',
                plugins: options.plugins,
                shouldEmbedOnlyImages: true,
            };
            htmlFile = await this.exportNoteToHtmlFile(noteId, exportOptions);
            const windowOptions = {
                // Work around a printing issue: As of Electron 39, if the window is initially hidden, printing crashes the app.
                // This only seems to be necessary on Linux.
                show: shim_1.default.isLinux(),
            };
            win = (0, bridge_1.default)().newBrowserWindow(windowOptions);
            return new Promise((resolve, reject) => {
                win.webContents.on('did-finish-load', () => {
                    // did-finish-load will trigger when most assets are done loading, probably
                    // images, JavaScript and CSS. However it seems it might trigger *before*
                    // all fonts are loaded, which will break for example Katex rendering.
                    // So we need to add an additional timer to make sure fonts are loaded
                    // as it doesn't seem there's any easy way to figure that out.
                    shim_1.default.setTimeout(async () => {
                        if (target === 'pdf') {
                            try {
                                // The below line "opens" all <details> tags
                                // before printing. This assures that the
                                // contents of the tag are visible in printed
                                // pdfs.
                                // https://github.com/laurent22/joplin/issues/6254.
                                await win.webContents.executeJavaScript('document.querySelectorAll(\'details\').forEach(el=>el.setAttribute(\'open\',\'\'))');
                                const data = await win.webContents.printToPDF(Object.assign(Object.assign({}, options), { 
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- options.pageSize is a string (user setting); Electron's PrintToPDFOptions.pageSize is a stricter union
                                    pageSize: options.pageSize, 
                                    // Allows users to override the CSS page size.
                                    // See https://github.com/laurent22/joplin/issues/13096
                                    preferCSSPageSize: true, 
                                    // Include accessibility information in the output:
                                    generateTaggedPDF: true }));
                                resolve(data);
                            }
                            catch (error) {
                                reject(error);
                            }
                            finally {
                                cleanup();
                            }
                        }
                        else {
                            // TODO: it is crashing at this point :( Appears to
                            // be a Chromium bug:
                            // https://github.com/electron/electron/issues/19946
                            // Maybe can be fixed by doing everything from main
                            // process? i.e. creating a function `print()` that
                            // takes the `htmlFile` variable as input.
                            //
                            // 2021-10-01: This old bug is fixed, and has been
                            // replaced by a brand new bug:
                            // https://github.com/electron/electron/issues/28192
                            // Still doesn't work but at least it doesn't crash
                            // the app.
                            //
                            // 2024-01-31: Printing with webContents.print still
                            // fails on Linux (even if run in the main process).
                            // As such, we use window.print(), which seems to work.
                            //
                            // 2025-05-03: Windows and MacOS also need the window.print() workaround.
                            // See https://github.com/electron/electron/pull/46937.
                            //
                            // 2025-10-30: window.print() now causes a crash on Linux -- switch back to the
                            // other method.
                            const applyWorkaround = true;
                            if (applyWorkaround) {
                                await win.webContents.executeJavaScript(`
									// Blocks while the print dialog is open
									window.print();
								`);
                                shim_1.default.setTimeout(() => {
                                    // To prevent a crash, the window can only be closed after a timeout.
                                    // This timeout can't be too small, or else it may still crash (e.g. 100ms
                                    // is too short).
                                    //
                                    // See https://github.com/electron/electron/issues/31635 for details
                                    cleanup();
                                    resolve(null);
                                }, 1000);
                            }
                            else {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ExportNoteOptions is broader than Electron's WebContentsPrintOptions; the runtime tolerates the extra fields
                                win.webContents.print(options, (success, reason) => {
                                    cleanup();
                                    if (!success && reason !== 'cancelled')
                                        reject(new Error(`Could not print: ${reason}`));
                                    resolve(null);
                                });
                            }
                        }
                    }, 2000);
                });
                void win.loadURL(url.format({
                    pathname: htmlFile,
                    protocol: 'file:',
                    slashes: true,
                }));
            });
        }
        catch (error) {
            cleanup();
            throw error;
        }
    }
    static async exportNoteToPdf(noteId, options = {}) {
        return this.exportNoteTo_('pdf', noteId, options);
    }
    static async printNote(noteId, options = {}) {
        return this.exportNoteTo_('printer', noteId, options);
    }
    static async defaultFilename(noteId, fileExtension) {
        // Default filename is just the date
        const date = time_1.default.formatMsToLocal(new Date().getTime(), time_1.default.dateFormat());
        let filename = (0, path_utils_1.friendlySafeFilename)(`${date}`, 100);
        if (noteId) {
            const note = await Note_1.default.load(noteId);
            // In a rare case the passed note will be null, use the id for filename
            filename = (0, path_utils_1.friendlySafeFilename)(note ? note.title : noteId, 100);
        }
        return `${filename}.${fileExtension}`;
    }
    static async export(_dispatch, module, options = null) {
        if (!options)
            options = {};
        let path = null;
        if (module.target === 'file') {
            const noteId = options.sourceNoteIds && options.sourceNoteIds.length ? options.sourceNoteIds[0] : null;
            path = await (0, bridge_1.default)().showSaveDialog({
                filters: [{ name: module.description, extensions: module.fileExtensions }],
                defaultPath: await this.defaultFilename(noteId, module.fileExtensions[0]),
            });
        }
        else {
            path = await (0, bridge_1.default)().showOpenDialog({
                properties: ['openDirectory', 'createDirectory'],
            });
        }
        if (!path || (Array.isArray(path) && !path.length))
            return;
        if (Array.isArray(path))
            path = path[0];
        void CommandService_1.default.instance().execute('showModalMessage', (0, locale_1._)('Exporting to "%s" as "%s" format. Please wait...', path, module.format));
        const exportOptions = {};
        exportOptions.path = path;
        exportOptions.format = module.format;
        // exportOptions.modulePath = module.path;
        if (options.plugins)
            exportOptions.plugins = options.plugins;
        exportOptions.customCss = options.customCss;
        exportOptions.target = module.target;
        exportOptions.includeConflicts = !!options.includeConflicts;
        if (options.sourceFolderIds)
            exportOptions.sourceFolderIds = options.sourceFolderIds;
        if (options.sourceNoteIds)
            exportOptions.sourceNoteIds = options.sourceNoteIds;
        const service = InteropService_1.default.instance();
        try {
            const result = await service.export(exportOptions);
            // eslint-disable-next-line no-console
            console.info('Export result: ', result);
        }
        catch (error) {
            console.error(error);
            (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Could not export notes: %s', error.message));
        }
        void CommandService_1.default.instance().execute('hideModalMessage');
    }
}
exports.default = InteropServiceHelper;
//# sourceMappingURL=InteropServiceHelper.js.map