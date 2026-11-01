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
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const DialogButtonRow_1 = __importDefault(require("../DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogTitle_1 = __importDefault(require("../DialogTitle"));
const utils_1 = require("@joplin/lib/services/e2ee/utils");
const registry_1 = require("@joplin/lib/registry");
const EncryptionService_1 = __importDefault(require("@joplin/lib/services/e2ee/EncryptionService"));
const KvStore_1 = __importDefault(require("@joplin/lib/services/KvStore"));
const ShareService_1 = __importDefault(require("@joplin/lib/services/share/ShareService"));
const LabelledPasswordInput_1 = __importDefault(require("../PasswordInput/LabelledPasswordInput"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const time_1 = __importDefault(require("@joplin/lib/time"));
var Mode;
(function (Mode) {
    Mode[Mode["Set"] = 1] = "Set";
    Mode[Mode["Reset"] = 2] = "Reset";
})(Mode || (Mode = {}));
const syncAfterDefaultInterval = async () => {
    await time_1.default.msleep(registry_1.reg.defaultScheduleInterval());
    await registry_1.reg.waitForSyncFinishedThenSync();
};
function default_1(props) {
    const [status, setStatus] = (0, react_1.useState)(utils_1.MasterPasswordStatus.NotSet);
    const [hasMasterPasswordEncryptedData, setHasMasterPasswordEncryptedData] = (0, react_1.useState)(true);
    const [currentPassword, setCurrentPassword] = (0, react_1.useState)('');
    const [currentPasswordIsValid, setCurrentPasswordIsValid] = (0, react_1.useState)(false);
    const [password1, setPassword1] = (0, react_1.useState)('');
    const [password2, setPassword2] = (0, react_1.useState)('');
    const [saveButtonDisabled, setSaveButtonDisabled] = (0, react_1.useState)(true);
    const [showPasswordForm, setShowPasswordForm] = (0, react_1.useState)(false);
    const [updatingPassword, setUpdatingPassword] = (0, react_1.useState)(false);
    const [mode, setMode] = (0, react_1.useState)(Mode.Set);
    const showCurrentPassword = (0, react_1.useMemo)(() => {
        if ([utils_1.MasterPasswordStatus.NotSet, utils_1.MasterPasswordStatus.Invalid].includes(status))
            return false;
        if (mode === Mode.Reset)
            return false;
        return true;
    }, [status, mode]);
    const onClose = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'DIALOG_CLOSE',
            name: 'masterPassword',
        });
    }, [props.dispatch]);
    (0, react_1.useEffect)(() => {
        setCurrentPassword((0, utils_1.getMasterPassword)(false) || '');
    }, []);
    (0, useAsyncEffect_1.default)(async (event) => {
        const newStatus = await (0, utils_1.getMasterPasswordStatus)();
        const hasIt = await (0, utils_1.checkHasMasterPasswordEncryptedData)();
        if (event.cancelled)
            return;
        setStatus(newStatus);
        setHasMasterPasswordEncryptedData(hasIt);
    }, []);
    const onButtonRowClick = (0, react_1.useCallback)(async (event) => {
        if (event.buttonName === 'cancel') {
            onClose();
            return;
        }
        if (event.buttonName === 'ok') {
            setUpdatingPassword(true);
            try {
                if (mode === Mode.Set) {
                    await (0, utils_1.updateMasterPassword)(showCurrentPassword ? currentPassword : null, password1);
                }
                else if (mode === Mode.Reset) {
                    await (0, utils_1.resetMasterPassword)(EncryptionService_1.default.instance(), KvStore_1.default.instance(), ShareService_1.default.instance(), password1);
                }
                else {
                    throw new Error(`Unknown mode: ${mode}`);
                }
                // We need to defer the sync, as enabling encryption may take a few seconds to complete
                void syncAfterDefaultInterval();
                onClose();
            }
            catch (error) {
                void shim_1.default.showErrorDialog(error.message);
            }
            finally {
                setUpdatingPassword(false);
            }
            return;
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [currentPassword, password1, onClose, mode]);
    // Show the "Re-enter password" confirmation field
    const needToRepeatPassword = (0, react_1.useMemo)(() => {
        if (mode === Mode.Reset)
            return true;
        if (showCurrentPassword)
            return true;
        return !hasMasterPasswordEncryptedData;
    }, [mode, showCurrentPassword, hasMasterPasswordEncryptedData]);
    const onCurrentPasswordChange = (0, react_1.useCallback)((event) => {
        setCurrentPassword(event.target.value);
    }, []);
    const onPasswordChange1 = (0, react_1.useCallback)((event) => {
        setPassword1(event.target.value);
    }, []);
    const onPasswordChange2 = (0, react_1.useCallback)((event) => {
        setPassword2(event.target.value);
    }, []);
    const onShowPasswordForm = (0, react_1.useCallback)(() => {
        setShowPasswordForm(true);
    }, []);
    const onToggleMode = (0, react_1.useCallback)(() => {
        setMode(m => {
            return m === Mode.Set ? Mode.Reset : Mode.Set;
        });
        setCurrentPassword('');
        setPassword1('');
        setPassword2('');
    }, []);
    (0, react_1.useEffect)(() => {
        setSaveButtonDisabled(updatingPassword || (!password1 || (needToRepeatPassword && password1 !== password2)));
    }, [password1, password2, updatingPassword, needToRepeatPassword]);
    (0, react_1.useEffect)(() => {
        setShowPasswordForm([utils_1.MasterPasswordStatus.NotSet, utils_1.MasterPasswordStatus.Invalid].includes(status));
    }, [status]);
    (0, useAsyncEffect_1.default)(async (event) => {
        const isValid = currentPassword ? await (0, utils_1.masterPasswordIsValid)(currentPassword) : false;
        if (event.cancelled)
            return;
        setCurrentPasswordIsValid(isValid);
    }, [currentPassword]);
    function renderPasswordForm() {
        const passwordsMatch = password1 === password2;
        const renderCurrentPassword = () => {
            if (!showCurrentPassword)
                return null;
            // If the master password is in the keychain we preload it into the
            // field and allow displaying it. That way if the user has forgotten
            // their password, they have a chance to recover it that way without
            // having to reset the password (and lose access to any data that's
            // been encrypted with it).
            const showValidIcon = currentPassword && status !== utils_1.MasterPasswordStatus.NotSet;
            return (React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Current password'), value: currentPassword, onChange: onCurrentPasswordChange, valid: showValidIcon ? currentPasswordIsValid : undefined }));
        };
        const renderResetMasterPasswordLink = () => {
            if (mode === Mode.Reset)
                return null;
            if (status === utils_1.MasterPasswordStatus.Valid)
                return null;
            return React.createElement("p", null,
                React.createElement("a", { href: "#", onClick: onToggleMode }, (0, locale_1._)('Reset master password')));
        };
        if (showPasswordForm) {
            const enterPasswordLabel = [utils_1.MasterPasswordStatus.Loaded, utils_1.MasterPasswordStatus.Valid].includes(status) ? (0, locale_1._)('Enter new password') : (0, locale_1._)('Enter password');
            return (React.createElement("div", null,
                React.createElement("div", { className: "form" },
                    renderCurrentPassword(),
                    React.createElement(LabelledPasswordInput_1.default, { labelText: enterPasswordLabel, value: password1, onChange: onPasswordChange1 }),
                    needToRepeatPassword && (React.createElement(React.Fragment, null,
                        React.createElement(LabelledPasswordInput_1.default, { labelText: (0, locale_1._)('Re-enter password'), value: password2, onChange: onPasswordChange2, valid: password2 ? passwordsMatch : undefined }),
                        password2 && !passwordsMatch && (React.createElement("p", { className: "error-message" }, (0, locale_1._)('Passwords do not match')))))),
                React.createElement("p", { className: "bold" }, (0, locale_1._)('Please make sure you remember your password. It cannot be recovered if lost, and any data encrypted with it will become inaccessible.')),
                renderResetMasterPasswordLink()));
        }
        else {
            return (React.createElement("p", null,
                React.createElement("a", { onClick: onShowPasswordForm, href: "#" }, (0, locale_1._)('Change master password'))));
        }
    }
    function renderContent() {
        if (mode === Mode.Reset) {
            return (React.createElement("div", { className: "dialog-content" },
                React.createElement("p", null, (0, locale_1._)('Attention: After resetting your password it will no longer be possible to decrypt any data encrypted with your current password. All encrypted shared notebooks will also be unshared, so please ask the notebook owner to share it again with you.')),
                renderPasswordForm()));
        }
        else {
            return (React.createElement("div", { className: "dialog-content" },
                React.createElement("p", null, (0, locale_1._)('Your master password is used to protect sensitive information. In particular, it is used to encrypt your notes when end-to-end encryption (E2EE) is enabled, or to share and encrypt notes with someone who has E2EE enabled.')),
                React.createElement("p", null,
                    React.createElement("span", null, (0, locale_1._)('Master password status:')),
                    " ",
                    React.createElement("span", { className: "bold" }, (0, utils_1.getMasterPasswordStatusMessage)(status))),
                renderPasswordForm()));
        }
    }
    const dialogTitle = mode === Mode.Set ? (0, locale_1._)('Manage master password') : `⚠️ ${(0, locale_1._)('Reset master password')} ⚠️`;
    const okButtonLabel = mode === Mode.Set ? (0, locale_1._)('Save') : `⚠️ ${(0, locale_1._)('Reset master password')} ⚠️`;
    function renderDialogWrapper() {
        return (React.createElement("div", { className: "dialog-root" },
            React.createElement(DialogTitle_1.default, { title: dialogTitle }),
            renderContent(),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: onButtonRowClick, okButtonLabel: okButtonLabel, okButtonDisabled: saveButtonDisabled, cancelButtonDisabled: updatingPassword })));
    }
    return (React.createElement(Dialog_1.default, { onCancel: onClose, className: "master-password-dialog" }, renderDialogWrapper()));
}
//# sourceMappingURL=Dialog.js.map