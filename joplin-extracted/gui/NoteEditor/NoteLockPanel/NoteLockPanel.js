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
exports.default = NoteLockPanel;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const Button_1 = __importStar(require("../../Button/Button"));
const LabelledPasswordInput_1 = __importDefault(require("../../PasswordInput/LabelledPasswordInput"));
function NoteLockPanel(props) {
    const [password, setPassword] = (0, react_1.useState)('');
    const [unlocking, setUnlocking] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const onPasswordChange = (0, react_1.useCallback)((event) => {
        setPassword(event.target.value);
    }, []);
    const unlock = (0, react_1.useCallback)(async () => {
        if (!password || unlocking)
            return;
        setUnlocking(true);
        try {
            await NoteLockSession_1.default.instance().unlock(password);
            // No success handling: the unlock event swaps this panel out for the note.
        }
        catch (error) {
            // WebCrypto reports a wrong password as a generic OperationError.
            setErrorMessage(error.name === 'OperationError' ? (0, locale_1._)('Invalid password') : error.message);
            setUnlocking(false);
        }
    }, [password, unlocking]);
    const onSubmit = (0, react_1.useCallback)((event) => {
        event.preventDefault();
        void unlock();
    }, [unlock]);
    const onSetUpClick = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'NAV_GO',
            routeName: 'Config',
            props: { defaultSection: 'noteLock' },
        });
    }, [props.dispatch]);
    const renderAction = () => {
        if (props.undecryptable) {
            return React.createElement("p", { className: "message" }, (0, locale_1._)('This note could not be decrypted. If it was encrypted prior to a password reset, the contents are no longer recoverable.'));
        }
        if (!props.hasNoteLockKey) {
            return (React.createElement(React.Fragment, null,
                React.createElement("p", { className: "message" }, (0, locale_1._)('Reading this note requires the note lock password, which has not been set up on this device yet.')),
                React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Primary, title: (0, locale_1._)('Set up note lock'), onClick: onSetUpClick })));
        }
        return (React.createElement("form", { className: "form unlock-form", onSubmit: onSubmit },
            React.createElement("p", { className: "message" }, (0, locale_1._)('This note is encrypted. Enter the note lock password to unlock encrypted notes for this session.')),
            React.createElement("div", { className: "field" },
                React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Note lock password'), value: password, onChange: onPasswordChange })),
            !!errorMessage && React.createElement("p", { className: "error", role: "alert" }, errorMessage),
            React.createElement(Button_1.default, { type: 'button', level: Button_1.ButtonLevel.Primary, title: (0, locale_1._)('Unlock'), disabled: !password || unlocking, onClick: unlock })));
    };
    return (React.createElement("div", { className: "note-lock-panel" },
        React.createElement("i", { className: "icon fas fa-lock", role: "img", "aria-label": (0, locale_1._)('Locked note') }),
        React.createElement("h2", { className: "title" }, props.noteTitle),
        renderAction()));
}
//# sourceMappingURL=NoteLockPanel.js.map