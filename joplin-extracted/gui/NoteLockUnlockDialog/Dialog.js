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
exports.default = default_1;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const DialogButtonRow_1 = __importDefault(require("../DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogTitle_1 = __importDefault(require("../DialogTitle"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const LabelledPasswordInput_1 = __importDefault(require("../PasswordInput/LabelledPasswordInput"));
function default_1(props) {
    const [password, setPassword] = (0, react_1.useState)('');
    const [unlocking, setUnlocking] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const onClose = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'DIALOG_CLOSE',
            name: 'noteLockUnlock',
        });
    }, [props.dispatch]);
    const onPasswordChange = (0, react_1.useCallback)((event) => {
        setPassword(event.target.value);
    }, []);
    const onButtonRowClick = (0, react_1.useCallback)(async (event) => {
        if (event.buttonName === 'cancel') {
            onClose();
            return;
        }
        if (event.buttonName === 'ok') {
            setUnlocking(true);
            try {
                await NoteLockSession_1.default.instance().unlock(password);
            }
            catch (error) {
                // WebCrypto reports a wrong password as a generic OperationError.
                setErrorMessage(error.name === 'OperationError' ? (0, locale_1._)('Invalid password') : error.message);
                setUnlocking(false);
                return;
            }
            setUnlocking(false);
            onClose();
            if (props.successCommand) {
                void CommandService_1.default.instance().execute(props.successCommand.name, ...props.successCommand.args);
            }
        }
    }, [password, onClose, props.successCommand]);
    return (React.createElement(Dialog_1.default, { onCancel: onClose, className: "note-lock-unlock-dialog" },
        React.createElement("div", { className: "dialog-root" },
            React.createElement(DialogTitle_1.default, { title: (0, locale_1._)('Unlock encrypted notes') }),
            React.createElement("div", { className: "dialog-content" },
                React.createElement("p", null, (0, locale_1._)('Enter the note lock password to unlock encrypted notes for this session.')),
                React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Note lock password'), value: password, onChange: onPasswordChange }),
                !!errorMessage && React.createElement("p", { className: "error-message", role: "alert" }, errorMessage)),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: onButtonRowClick, okButtonLabel: (0, locale_1._)('Unlock'), okButtonDisabled: !password || unlocking, cancelButtonDisabled: unlocking }))));
}
//# sourceMappingURL=Dialog.js.map