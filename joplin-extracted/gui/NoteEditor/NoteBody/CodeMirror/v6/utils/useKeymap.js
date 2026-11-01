"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const normalizeAccelerator_1 = __importDefault(require("../../utils/normalizeAccelerator"));
const types_1 = require("../../utils/types");
const useKeymap = (editorControl) => {
    (0, react_1.useEffect)(() => {
        if (!editorControl)
            return () => { };
        // Some commands aren't registered with the command service
        // (e.g. Quit). Don't have CodeMirror handle these.
        // See gui/KeymapConfig/getLabel.ts.
        const isCommandRegistered = (commandName) => {
            const commandNames = CommandService_1.default.instance().commandNames();
            return commandNames.includes(commandName);
        };
        const keymapItemToCodeMirror = (binding) => {
            if (!binding.accelerator || !isCommandRegistered(binding.command)) {
                return null;
            }
            return {
                key: (0, normalizeAccelerator_1.default)(binding.accelerator, types_1.CodeMirrorVersion.CodeMirror6),
                run: () => {
                    if (!CommandService_1.default.instance().isEnabled(binding.command)) {
                        return false;
                    }
                    void CommandService_1.default.instance().execute(binding.command);
                    return true;
                },
            };
        };
        const keymapItems = KeymapService_1.default.instance().getKeymapItems();
        const addedKeymap = editorControl.prependKeymap(keymapItems
            .map(item => keymapItemToCodeMirror(item))
            .filter(item => !!item));
        return () => {
            addedKeymap.remove();
        };
    }, [editorControl]);
};
exports.default = useKeymap;
//# sourceMappingURL=useKeymap.js.map