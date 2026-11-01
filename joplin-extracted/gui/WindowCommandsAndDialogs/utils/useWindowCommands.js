"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePrintToCallback_1 = __importDefault(require("./usePrintToCallback"));
const useWindowControl_1 = __importDefault(require("./useWindowControl"));
const commands_1 = __importDefault(require("../commands"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const useNowEffect_1 = __importDefault(require("@joplin/lib/hooks/useNowEffect"));
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
const useWindowCommands = ({ documentRef, customCss, plugins, editorNoteStatuses, setDialogState }) => {
    const onPrintCallback = (0, usePrintToCallback_1.default)({
        customCss: customCss,
        editorNoteStatuses: editorNoteStatuses,
        plugins: plugins,
    });
    const windowControl = (0, useWindowControl_1.default)(setDialogState, onPrintCallback, documentRef);
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    // This effect needs to run as soon as possible. Certain components may fail to load if window
    // commands are not registered on their first render.
    (0, useNowEffect_1.default)(() => {
        const runtimeHandles = commands_1.default.map((command) => {
            const runtime = Object.assign({ getPriority: (_state, targetWindowId) => {
                    var _a;
                    if (targetWindowId === windowId)
                        return 2;
                    return ((_a = documentRef.current) === null || _a === void 0 ? void 0 : _a.hasFocus()) ? 1 : 0;
                } }, command.runtime(windowControl));
            return CommandService_1.default.instance().registerRuntime(command.declaration.name, runtime, true);
        });
        return () => {
            for (const runtimeHandle of runtimeHandles) {
                runtimeHandle.deregister();
            }
        };
    }, [windowControl, windowId]);
};
exports.default = useWindowCommands;
//# sourceMappingURL=useWindowCommands.js.map