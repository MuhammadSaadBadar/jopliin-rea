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
const React = __importStar(require("react"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const locale_1 = require("@joplin/lib/locale");
const NoteLockKey_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockKey"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
const syncInfoUtils_1 = require("@joplin/lib/services/synchronizer/syncInfoUtils");
const LabelledPasswordInput_1 = __importDefault(require("../../PasswordInput/LabelledPasswordInput"));
const Button_1 = __importStar(require("../../Button/Button"));
const useNoteLockMode_1 = __importStar(require("./useNoteLockMode"));
// WebCrypto reports a wrong password as an OperationError with an unhelpful generic message
const errorMessage = (error) => {
    if (!(error instanceof Error))
        return String(error);
    if (error.name === 'OperationError')
        return (0, locale_1._)('Invalid password');
    return error.message;
};
const NoteLockSettings = props => {
    const hasKey = props.hasNoteLockKey;
    const { mode, onModeChange, currentPassword, setCurrentPassword, password, setPassword, passwordRepeat, setPasswordRepeat, error, setError, } = (0, useNoteLockMode_1.default)(hasKey);
    const [upgradePassword, setUpgradePassword] = (0, react_1.useState)('');
    const [upgradeError, setUpgradeError] = (0, react_1.useState)('');
    const [saving, setSaving] = (0, react_1.useState)(false);
    const passwordMismatch = !!passwordRepeat && password !== passwordRepeat;
    const canSave = !!password && !!passwordRepeat && !passwordMismatch && !saving && (mode !== useNoteLockMode_1.ActionMode.Change || !!currentPassword);
    const canUpgrade = !!upgradePassword && !saving;
    const forgotPasswordDescription = (0, locale_1._)('Only do this if you\'ve forgotten your current password. A new password will be created, and any notes locked with the old one will become permanently unreadable.');
    const forgotPasswordWarning = `${(0, locale_1._)('Warning:')} ${forgotPasswordDescription}`;
    const resetConfirmationMessage = `${forgotPasswordWarning}\n\n${(0, locale_1._)('Continue?')}`;
    const onCurrentPasswordChange = (0, react_1.useCallback)((event) => {
        setCurrentPassword(event.target.value);
    }, [setCurrentPassword]);
    const onPasswordChange = (0, react_1.useCallback)((event) => {
        setPassword(event.target.value);
    }, [setPassword]);
    const onPasswordRepeatChange = (0, react_1.useCallback)((event) => {
        setPasswordRepeat(event.target.value);
    }, [setPasswordRepeat]);
    const onUpgradePasswordChange = (0, react_1.useCallback)((event) => {
        setUpgradePassword(event.target.value);
    }, []);
    const submit = (0, react_1.useCallback)(async () => {
        if (!canSave)
            return;
        if (mode === useNoteLockMode_1.ActionMode.Reset) {
            const response = await shim_1.default.showMessageBox(resetConfirmationMessage, {
                buttons: [(0, locale_1._)('Yes'), (0, locale_1._)('No')],
                type: shim_1.MessageBoxType.Confirm,
            });
            if (response !== 0)
                return;
        }
        setSaving(true);
        setError('');
        try {
            const noteLockKey = NoteLockKey_1.default.instance();
            if (mode === useNoteLockMode_1.ActionMode.Create) {
                await noteLockKey.create(password);
            }
            else if (mode === useNoteLockMode_1.ActionMode.Change) {
                await noteLockKey.changePassword(currentPassword, password);
            }
            else if (mode === useNoteLockMode_1.ActionMode.Reset) {
                await NoteLockSession_1.default.instance().reset(password);
            }
            onModeChange(useNoteLockMode_1.ActionMode.Collapsed);
        }
        catch (error) {
            setError(errorMessage(error));
        }
        finally {
            setSaving(false);
        }
    }, [canSave, onModeChange, currentPassword, mode, password, setError, resetConfirmationMessage]);
    const submitUpgrade = (0, react_1.useCallback)(async () => {
        if (!canUpgrade)
            return;
        setSaving(true);
        setUpgradeError('');
        try {
            await NoteLockKey_1.default.instance().upgrade(upgradePassword);
            setUpgradePassword('');
        }
        catch (error) {
            setUpgradeError(errorMessage(error));
        }
        finally {
            setSaving(false);
        }
    }, [canUpgrade, upgradePassword]);
    const onChangePasswordClick = (0, react_1.useCallback)(() => {
        onModeChange(useNoteLockMode_1.ActionMode.Change);
    }, [onModeChange]);
    const onForgotPasswordClick = (0, react_1.useCallback)(() => {
        onModeChange(useNoteLockMode_1.ActionMode.Reset);
    }, [onModeChange]);
    const onCancel = (0, react_1.useCallback)(() => {
        onModeChange(useNoteLockMode_1.ActionMode.Collapsed);
    }, [onModeChange]);
    const resetPasswordTitle = `⚠️ ${(0, locale_1._)('Reset password')} ⚠️`;
    const actionButtonTitle = mode === useNoteLockMode_1.ActionMode.Reset ? resetPasswordTitle : (0, locale_1._)('Save');
    const getSectionTitle = () => {
        if (mode === useNoteLockMode_1.ActionMode.Reset)
            return resetPasswordTitle;
        if (mode === useNoteLockMode_1.ActionMode.Change)
            return (0, locale_1._)('Change note lock password');
        if (mode === useNoteLockMode_1.ActionMode.Collapsed)
            return (0, locale_1._)('Manage password');
        return (0, locale_1._)('Password setup');
    };
    const renderManageButtons = () => {
        return (React.createElement("div", { className: 'form' },
            React.createElement("div", { className: 'buttons' },
                React.createElement(Button_1.default, { title: (0, locale_1._)('Change note lock password'), level: Button_1.ButtonLevel.Secondary, onClick: onChangePasswordClick })),
            React.createElement("div", { className: 'buttons' },
                React.createElement(Button_1.default, { title: (0, locale_1._)('Forgot password?'), level: Button_1.ButtonLevel.Secondary, onClick: onForgotPasswordClick })),
            React.createElement("p", { className: 'description' }, forgotPasswordDescription)));
    };
    const renderPasswordForm = () => {
        return (React.createElement("div", { className: 'form' },
            mode === useNoteLockMode_1.ActionMode.Reset && React.createElement("p", { className: 'warning', role: 'alert' },
                React.createElement("strong", null, (0, locale_1._)('Warning:')),
                " ",
                forgotPasswordDescription),
            mode === useNoteLockMode_1.ActionMode.Change && (React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Current password'), value: currentPassword, onChange: onCurrentPasswordChange, reserveIconGutter: true })),
            React.createElement(LabelledPasswordInput_1.default, { labelText: mode === useNoteLockMode_1.ActionMode.Create ? (0, locale_1._)('Password') : (0, locale_1._)('New password'), value: password, onChange: onPasswordChange, reserveIconGutter: true }),
            React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Repeat password'), value: passwordRepeat, onChange: onPasswordRepeatChange, valid: passwordRepeat ? !passwordMismatch : undefined, reserveIconGutter: true }),
            passwordMismatch && React.createElement("p", { className: 'error' }, (0, locale_1._)('Passwords do not match')),
            error ? React.createElement("p", { className: 'error', role: 'alert' }, error) : null,
            React.createElement("div", { className: 'buttons' },
                React.createElement(Button_1.default, { title: actionButtonTitle, level: mode === useNoteLockMode_1.ActionMode.Reset ? Button_1.ButtonLevel.Secondary : Button_1.ButtonLevel.Primary, disabled: !canSave, onClick: submit }),
                mode !== useNoteLockMode_1.ActionMode.Create && (React.createElement(Button_1.default, { title: (0, locale_1._)('Cancel'), level: Button_1.ButtonLevel.Secondary, disabled: saving, onClick: onCancel }))),
            React.createElement("p", { className: 'reminder' },
                React.createElement("strong", null, (0, locale_1._)('Please make sure you remember your password. It cannot be recovered if lost, and any data encrypted with it will become inaccessible.')))));
    };
    const renderUpgradeSection = () => {
        if (!props.needsNoteLockKeyUpgrade)
            return null;
        return (React.createElement("div", { className: 'section' },
            React.createElement("h2", null, (0, locale_1._)('Key upgrade')),
            React.createElement("p", null, (0, locale_1._)('The note lock key uses an out-dated encryption algorithm and it is recommended to upgrade it. The upgraded key will still be able to decrypt and encrypt your data as usual.')),
            React.createElement("div", { className: 'form' },
                React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Password'), value: upgradePassword, onChange: onUpgradePasswordChange, reserveIconGutter: true }),
                upgradeError ? React.createElement("p", { className: 'error', role: 'alert' }, upgradeError) : null,
                React.createElement("div", { className: 'buttons' },
                    React.createElement(Button_1.default, { title: (0, locale_1._)('Upgrade key'), level: Button_1.ButtonLevel.Primary, disabled: !canUpgrade, onClick: submitUpgrade })))));
    };
    return (React.createElement("div", { className: 'note-lock-settings' },
        React.createElement("div", { className: 'section' },
            React.createElement("h2", null, getSectionTitle()),
            mode === useNoteLockMode_1.ActionMode.Collapsed ? renderManageButtons() : renderPasswordForm()),
        renderUpgradeSection()));
};
const mapStateToProps = (state) => {
    return {
        hasNoteLockKey: !!new syncInfoUtils_1.SyncInfo(state.settings['syncInfoCache']).noteLockKey,
        needsNoteLockKeyUpgrade: NoteLockKey_1.default.instance().needsUpgrade(),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(NoteLockSettings);
//# sourceMappingURL=NoteLockSettings.js.map