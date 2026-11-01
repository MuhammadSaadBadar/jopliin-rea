"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const InteropService_1 = __importDefault(require("@joplin/lib/services/interop/InteropService"));
const types_1 = require("@joplin/lib/services/interop/types");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const locale_1 = require("@joplin/lib/locale");
const makeDiscourseDebugUrl_1 = __importDefault(require("@joplin/lib/makeDiscourseDebugUrl"));
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const import_enex_1 = require("@joplin/lib/import-enex");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const packageInfo = require('../../../packageInfo.js');
const logger = Logger_1.default.create('importFrom');
exports.declaration = {
    name: 'importFrom',
    label: () => (0, locale_1._)('Import...'),
};
const findImportModule = async (commandOptions, control) => {
    if (commandOptions) {
        const module = InteropService_1.default.instance().findModuleByFormat(types_1.ModuleType.Importer, commandOptions.importFormat, commandOptions.sourceType, commandOptions.outputFormat);
        if (module) {
            return module;
        }
    }
    const importModules = InteropService_1.default.instance().modules().filter(module => module.type === types_1.ModuleType.Importer);
    return await control.showPrompt({
        label: (0, locale_1._)('Select the type of file to be imported:'),
        value: '',
        suggestions: importModules.map(module => {
            const label = module.fullLabel();
            return {
                key: `${module.type}--${label}`,
                value: module,
                label: module.fullLabel(),
            };
        }),
    });
};
const promptForSourcePath = async (module, sourceType) => {
    if (!sourceType) {
        if (!module.sources.includes(types_1.FileSystemItem.Directory)) {
            sourceType = types_1.FileSystemItem.File;
        }
        if (!module.sources.includes(types_1.FileSystemItem.File)) {
            sourceType = types_1.FileSystemItem.Directory;
        }
    }
    if (sourceType === types_1.FileSystemItem.File) {
        return await (0, bridge_1.default)().showOpenDialog({
            filters: [{ name: module.description, extensions: module.fileExtensions }],
        });
    }
    else if (sourceType === types_1.FileSystemItem.Directory) {
        return await (0, bridge_1.default)().showOpenDialog({
            properties: ['openDirectory', 'createDirectory'],
        });
    }
    else {
        return await (0, bridge_1.default)().showOpenDialog({
            properties: ['openDirectory', 'openFile'],
        });
    }
};
const runtime = (control) => {
    return {
        // Since this can be run from "go to anything", partialOptions needs to support being null or empty.
        execute: async (context, options) => {
            var _a;
            const importModule = await findImportModule(options, control);
            if (!importModule)
                return null; // E.g. if cancelled
            let sourcePath = (_a = options === null || options === void 0 ? void 0 : options.sourcePath) !== null && _a !== void 0 ? _a : await promptForSourcePath(importModule, options === null || options === void 0 ? void 0 : options.sourceType);
            if (Array.isArray(sourcePath)) {
                sourcePath = sourcePath[0];
            }
            // Handle the case where the directory picker action was cancelled
            if (!sourcePath)
                return null;
            if (!options) {
                const isDirectory = await shim_1.default.fsDriver().isDirectory(sourcePath);
                const importsMultipleNotes = importModule.isNoteArchive || isDirectory;
                const destinationFolderId = importsMultipleNotes ? null : context.state.selectedFolderId;
                const importFormat = importModule.format;
                const outputFormat = importModule.outputFormat;
                options = {
                    sourcePath,
                    destinationFolderId,
                    importFormat,
                    outputFormat,
                    sourceType: isDirectory ? types_1.FileSystemItem.Directory : types_1.FileSystemItem.File,
                };
            }
            if (options.importFormat === 'one' && !shim_1.default.isWindows()) {
                const response = (0, bridge_1.default)().showMessageBox((0, locale_1._)('This notebook contains Windows-specific files. For maximum compatibility, consider importing the notebook from Windows.'), {
                    type: 'warning',
                    buttons: [(0, locale_1._)('Import anyway'), (0, locale_1._)('Cancel')],
                    defaultId: 0,
                    cancelId: 1,
                });
                if (response === 1)
                    return null;
            }
            const modalMessage = (0, locale_1._)('Importing from "%s" as "%s" format. Please wait...', sourcePath, options.importFormat);
            void CommandService_1.default.instance().execute('showModalMessage', modalMessage);
            const errors = [];
            const importOptions = {
                path: sourcePath,
                format: options.importFormat,
                outputFormat: options.outputFormat,
                onProgress: (status) => {
                    const statusStrings = Object.keys(status).map((key) => {
                        return `${key}: ${status[key]}`;
                    });
                    void CommandService_1.default.instance().execute('showModalMessage', `${modalMessage}\n\n${statusStrings.join('\n')}`);
                },
                onError: (error) => {
                    // Recovered errors are logged but not reported, since the
                    // notes were imported successfully anyway.
                    if (!(0, import_enex_1.isRecoverableError)(error))
                        errors.push(error);
                    console.warn(error);
                },
                destinationFolderId: options.destinationFolderId,
            };
            const service = InteropService_1.default.instance();
            try {
                const result = await service.import(importOptions);
                // eslint-disable-next-line no-console
                console.info('Import result: ', result);
            }
            catch (error) {
                logger.error(error);
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
            void CommandService_1.default.instance().execute('hideModalMessage');
            if (errors.length) {
                const response = (0, bridge_1.default)().showErrorMessageBox('There were some errors importing the notes - check the console for more details.\n\nPlease consider sending a bug report to the forum!', {
                    buttons: [(0, locale_1._)('Close'), (0, locale_1._)('Send bug report')],
                });
                context.dispatch({ type: 'NOTE_DEVTOOLS_SET', value: true });
                if (response === 1) {
                    const url = (0, makeDiscourseDebugUrl_1.default)(`Error importing notes from format: ${options.importFormat}`, `- Input format: ${options.importFormat}\n- Output format: ${options.outputFormat}`, errors, packageInfo, PluginService_1.default.instance(), Setting_1.default.value('plugins.states'));
                    void (0, bridge_1.default)().openExternal(url);
                }
            }
        },
        enabledCondition: '',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=importFrom.js.map