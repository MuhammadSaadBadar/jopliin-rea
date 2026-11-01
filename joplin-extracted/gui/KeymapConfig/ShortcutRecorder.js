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
exports.ShortcutRecorder = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const styles_1 = __importDefault(require("./styles"));
const locale_1 = require("@joplin/lib/locale");
const keymapService = KeymapService_1.default.instance();
const ShortcutRecorder = ({ onSave, onReset, onCancel, onError, initialAccelerator, commandName, themeId, skipKeymapValidation, autoFocus = true }) => {
    const styles = (0, styles_1.default)(themeId);
    const [accelerator, setAccelerator] = (0, react_1.useState)(initialAccelerator);
    const [saveAllowed, setSaveAllowed] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        try {
            // Only perform validations if there's an accelerator provided
            // Otherwise performing a save means that it's going to be disabled
            if (accelerator) {
                keymapService.validateAccelerator(accelerator);
                if (!skipKeymapValidation) {
                    keymapService.validateKeymap({ accelerator, command: commandName });
                }
            }
            // Discard previous errors
            onError({ recorderError: null });
            setSaveAllowed(true);
        }
        catch (recorderError) {
            onError({ recorderError });
            setSaveAllowed(false);
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [accelerator]);
    const handleKeyDown = (event) => {
        // Shift-tab and tab are needed for navigating the shortcuts screen with the keyboard. Do not
        // .preventDefault.
        if (event.code === 'Tab' && !event.metaKey && !event.altKey && !event.ctrlKey) {
            return;
        }
        event.preventDefault();
        const newAccelerator = keymapService.domToElectronAccelerator(event);
        switch (newAccelerator) {
            case 'Enter':
                if (saveAllowed)
                    return onSave({ commandName, accelerator });
                break;
            case 'Escape':
                return onCancel({ commandName });
            case 'Backspace':
            case 'Delete':
                return setAccelerator('');
            default:
                setAccelerator(newAccelerator);
        }
    };
    const hintText = (0, locale_1._)('Press the shortcut and then press ENTER. Or, press BACKSPACE to clear the shortcut.');
    const placeholderText = (0, locale_1._)('Press the shortcut');
    return (React.createElement("div", { className: 'shortcut-recorder', style: styles.recorderContainer },
        React.createElement("input", { className: 'shortcut text-input', value: accelerator, "aria-label": accelerator ? accelerator : placeholderText, placeholder: placeholderText, title: hintText, "aria-description": hintText, "aria-invalid": accelerator && !saveAllowed, "aria-live": 'polite', onKeyDown: handleKeyDown, readOnly: true, autoFocus: autoFocus }),
        React.createElement("button", { style: styles.inlineButton, disabled: !saveAllowed, onClick: () => onSave({ commandName, accelerator }) }, (0, locale_1._)('Save')),
        React.createElement("button", { style: styles.inlineButton, onClick: () => onReset({ commandName }) }, (0, locale_1._)('Restore')),
        React.createElement("button", { style: styles.inlineButton, onClick: () => onCancel({ commandName }) }, (0, locale_1._)('Cancel'))));
};
exports.ShortcutRecorder = ShortcutRecorder;
//# sourceMappingURL=ShortcutRecorder.js.map