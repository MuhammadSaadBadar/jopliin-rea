"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const bridge_1 = __importDefault(require("../../../services/bridge"));
const InteropServiceHelper_1 = __importDefault(require("../../../InteropServiceHelper"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const time_1 = require("@joplin/utils/time");
let isPrinting = false;
const usePrintToCallback = (props) => {
    const noteStatusesRef = (0, react_1.useRef)(props.editorNoteStatuses);
    noteStatusesRef.current = props.editorNoteStatuses;
    const waitForNoteToSaved = (0, react_1.useCallback)(async (noteId) => {
        while (noteId && noteStatusesRef.current[noteId] === 'saving') {
            // eslint-disable-next-line no-console -- Old code from before rule was applied
            console.info('Waiting for note to be saved...', noteStatusesRef.current);
            await (0, time_1.msleep)(100);
        }
    }, []);
    return (0, react_1.useCallback)(async (target, options) => {
        var _a;
        // Concurrent print calls are disallowed to avoid incorrect settings being restored upon completion
        if (isPrinting) {
            // eslint-disable-next-line no-console -- Old code from before rule was applied
            console.info(`Printing ${(_a = options.path) !== null && _a !== void 0 ? _a : options.noteId} to ${target} disallowed, already printing.`);
            return;
        }
        isPrinting = true;
        // Need to wait for save because the interop service reloads the note from the database
        await waitForNoteToSaved(options.noteId);
        if (target === 'pdf') {
            try {
                const pdfData = await InteropServiceHelper_1.default.exportNoteToPdf(options.noteId, {
                    printBackground: true,
                    pageSize: Setting_1.default.value('export.pdfPageSize'),
                    landscape: Setting_1.default.value('export.pdfPageOrientation') === 'landscape',
                    customCss: props.customCss,
                    plugins: props.plugins,
                });
                await shim_1.default.fsDriver().writeFile(options.path, pdfData, 'buffer');
            }
            catch (error) {
                console.error(error);
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        }
        else if (target === 'printer') {
            try {
                await InteropServiceHelper_1.default.printNote(options.noteId, {
                    printBackground: true,
                    customCss: props.customCss,
                });
            }
            catch (error) {
                console.error(error);
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        }
        isPrinting = false;
    }, [props.plugins, waitForNoteToSaved, props.customCss]);
};
exports.default = usePrintToCallback;
//# sourceMappingURL=usePrintToCallback.js.map