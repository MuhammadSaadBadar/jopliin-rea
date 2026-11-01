"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const getLabel_1 = __importDefault(require("./getLabel"));
const keymapService = KeymapService_1.default.instance();
// This custom hook provides a synchronized snapshot of the keymap residing at KeymapService
// All the logic regarding altering and interacting with the keymap is isolated from the components
function allKeymapItems() {
    const output = keymapService.getKeymapItems().slice();
    output.sort((a, b) => {
        return (0, getLabel_1.default)(a.command).toLocaleLowerCase() < (0, getLabel_1.default)(b.command).toLocaleLowerCase() ? -1 : +1;
    });
    return output;
}
const useKeymap = () => {
    const [keymapItems, setKeymapItems] = (0, react_1.useState)(() => allKeymapItems());
    const [keymapError, setKeymapError] = (0, react_1.useState)(null);
    const [mustSave, setMustSave] = (0, react_1.useState)(false);
    const setAccelerator = (commandName, accelerator) => {
        setKeymapItems(prevKeymap => {
            const newKeymap = [...prevKeymap];
            newKeymap.find(item => item.command === commandName).accelerator = accelerator || null /* Disabled */;
            return newKeymap;
        });
        setMustSave(true);
    };
    const resetAccelerator = (commandName) => {
        const defaultAccelerator = keymapService.getDefaultAccelerator(commandName);
        setKeymapItems(prevKeymap => {
            const newKeymap = [...prevKeymap];
            newKeymap.find(item => item.command === commandName).accelerator = defaultAccelerator;
            return newKeymap;
        });
        setMustSave(true);
    };
    const overrideKeymapItems = (customKeymapItems) => {
        const oldKeymapItems = [...customKeymapItems];
        keymapService.resetKeymap(); // Start with a fresh keymap
        try {
            // First, try to update the in-memory keymap of KeymapService
            // This function will throw if there are any issues with the new custom keymap
            keymapService.overrideKeymap(customKeymapItems);
            // Then, update the state with the data from KeymapService
            // Side-effect: Changes will also be saved to the disk
            setKeymapItems(keymapService.getKeymapItems());
            setMustSave(true);
        }
        catch (error) {
            // oldKeymapItems includes even the unchanged keymap items
            // However, it is not an issue because the logic accounts for such scenarios
            keymapService.overrideKeymap(oldKeymapItems);
            throw error;
        }
    };
    (0, react_1.useEffect)(() => {
        if (!mustSave)
            return;
        setMustSave(false);
        async function saveKeymap() {
            try {
                keymapService.overrideKeymap(keymapItems);
                await keymapService.saveCustomKeymap();
                setKeymapError(null);
            }
            catch (error) {
                error.message = `Could not save file: ${error.message}`;
                setKeymapError(error);
            }
        }
        void saveKeymap();
    }, [keymapItems, mustSave]);
    return [keymapItems, keymapError, overrideKeymapItems, setAccelerator, resetAccelerator];
};
exports.default = useKeymap;
//# sourceMappingURL=useKeymap.js.map