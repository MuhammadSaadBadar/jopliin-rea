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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalHotkeyInput;
const React = __importStar(require("react"));
const react_1 = require("react");
const ShortcutRecorder_1 = require("../../KeymapConfig/ShortcutRecorder");
// A thin wrapper around ShortcutRecorder for the global hotkey setting.
// Reuses ShortcutRecorder directly instead of maintaining a separate display mode.
function GlobalHotkeyInput(props) {
    const value = props.value || '';
    const onSave = (0, react_1.useCallback)((event) => {
        // Normalize platform-specific modifiers to CommandOrControl for
        // consistent cross-platform storage.
        const accelerator = event.accelerator
            .replace(/\bCmd\b/, 'CommandOrControl')
            .replace(/\bCtrl\b/, 'CommandOrControl');
        props.onChange({ value: accelerator });
    }, [props.onChange]);
    const onReset = (0, react_1.useCallback)(() => {
        props.onChange({ value: '' });
    }, [props.onChange]);
    // No-op: global hotkeys don't have a separate editing mode to cancel out of.
    const onCancel = (0, react_1.useCallback)(() => { }, []);
    // No-op: ShortcutRecorder validates against the keymap (command
    // conflicts), which doesn't apply to global hotkeys.
    const onError = (0, react_1.useCallback)((_event) => { }, []);
    return (React.createElement(ShortcutRecorder_1.ShortcutRecorder, { onSave: onSave, onReset: onReset, onCancel: onCancel, onError: onError, initialAccelerator: value, commandName: "globalHotkey", themeId: props.themeId, skipKeymapValidation: true, autoFocus: false }));
}
//# sourceMappingURL=GlobalHotkeyInput.js.map