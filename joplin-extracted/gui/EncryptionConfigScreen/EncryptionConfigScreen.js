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
exports.EncryptionConfigScreen = void 0;
const React = __importStar(require("react"));
const EncryptionService_1 = __importDefault(require("@joplin/lib/services/e2ee/EncryptionService"));
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const time_1 = __importDefault(require("@joplin/lib/time"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
const dialogs_1 = __importDefault(require("../dialogs"));
const utils_1 = require("@joplin/lib/components/EncryptionConfigScreen/utils");
const syncInfoUtils_1 = require("@joplin/lib/services/synchronizer/syncInfoUtils");
const utils_2 = require("@joplin/lib/services/e2ee/utils");
const Button_1 = __importStar(require("../Button/Button"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const app_reducer_1 = require("../../app.reducer");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const ToggleAdvancedSettingsButton_1 = __importDefault(require("../ConfigScreen/controls/ToggleAdvancedSettingsButton"));
const MissingPasswordHelpLink_1 = __importDefault(require("../ConfigScreen/controls/MissingPasswordHelpLink"));
const enableFlow_1 = require("./enableFlow");
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogButtonRow_1 = __importDefault(require("../DialogButtonRow"));
const DialogTitle_1 = __importDefault(require("../DialogTitle"));
const PasswordInput_1 = __importDefault(require("../PasswordInput/PasswordInput"));
const EncryptionConfigScreen = (props) => {
    const { inputPasswords, onInputPasswordChange } = (0, utils_1.useInputPasswords)(props.passwords);
    const [pendingEnableEncryption, setPendingEnableEncryption] = (0, react_1.useState)(false);
    const [enableEncryptionPromptVisible, setEnableEncryptionPromptVisible] = (0, react_1.useState)(false);
    const [enableEncryptionPassword, setEnableEncryptionPassword] = (0, react_1.useState)('');
    const [enableEncryptionError, setEnableEncryptionError] = (0, react_1.useState)('');
    const [disableEncryptionPromptVisible, setDisableEncryptionPromptVisible] = (0, react_1.useState)(false);
    const disablePromptPromiseRef = (0, react_1.useRef)(null);
    const promptPromiseRef = (0, react_1.useRef)(null);
    // Cleanup on unmount to resolve pending promises if the user navigates away
    (0, react_1.useEffect)(() => {
        return () => {
            if (disablePromptPromiseRef.current)
                disablePromptPromiseRef.current(false);
            if (promptPromiseRef.current)
                promptPromiseRef.current(null);
        };
    }, []);
    const wasMasterPasswordDialogOpen = (0, react_1.useRef)(props.masterPasswordDialogOpen);
    const theme = (0, react_1.useMemo)(() => {
        return (0, theme_1.themeStyle)(props.themeId);
    }, [props.themeId]);
    const stats = (0, utils_1.useStats)();
    const { passwordChecks, masterPasswordKeys, masterPasswordStatus } = (0, utils_1.usePasswordChecker)(props.masterKeys, props.activeMasterKeyId, props.masterPassword, props.passwords);
    const { showDisabledMasterKeys, toggleShowDisabledMasterKeys } = (0, utils_1.useToggleShowDisabledMasterKeys)();
    const needMasterPassword = (0, utils_1.useNeedMasterPassword)(passwordChecks, props.masterKeys);
    (0, react_1.useEffect)(() => {
        const wasOpen = wasMasterPasswordDialogOpen.current;
        wasMasterPasswordDialogOpen.current = props.masterPasswordDialogOpen;
        if ((0, enableFlow_1.shouldCancelPendingEnableAfterMasterPasswordDialog)({
            pendingEnableEncryption,
            wasMasterPasswordDialogOpen: wasOpen,
            masterPasswordDialogOpen: props.masterPasswordDialogOpen,
            masterPassword: props.masterPassword,
        })) {
            setPendingEnableEncryption(false);
            return;
        }
        if (!(0, enableFlow_1.shouldResumeEnableAfterMasterPasswordDialog)({
            pendingEnableEncryption,
            wasMasterPasswordDialogOpen: wasOpen,
            masterPasswordDialogOpen: props.masterPasswordDialogOpen,
            masterPassword: props.masterPassword,
        }))
            return;
        const masterKey = (0, utils_2.getDefaultMasterKey)();
        void (async () => {
            try {
                await (0, utils_2.toggleAndSetupEncryption)(EncryptionService_1.default.instance(), true, masterKey, props.masterPassword);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                await dialogs_1.default.alert(message);
            }
            finally {
                setPendingEnableEncryption(false);
            }
        })();
    }, [pendingEnableEncryption, props.masterPasswordDialogOpen, props.masterPassword]);
    const onUpgradeMasterKey = (0, react_1.useCallback)(async (mk) => {
        const password = (0, utils_1.determineKeyPassword)(mk.id, masterPasswordKeys, props.masterPassword, props.passwords);
        const result = await (0, utils_1.upgradeMasterKey)(mk, password);
        await shim_1.default.showMessageBox(result, { type: shim_1.MessageBoxType.Info });
    }, [props.passwords, masterPasswordKeys, props.masterPassword]);
    const renderNeedUpgradeSection = () => {
        if (!shim_1.default.isElectron())
            return null;
        const needUpgradeMasterKeys = EncryptionService_1.default.instance().masterKeysThatNeedUpgrading(props.masterKeys);
        if (!needUpgradeMasterKeys.length)
            return null;
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const rows = [];
        for (const mk of needUpgradeMasterKeys) {
            rows.push(React.createElement("tr", { key: mk.id },
                React.createElement("td", { style: theme.textStyle }, mk.id),
                React.createElement("td", null,
                    React.createElement("button", { onClick: () => onUpgradeMasterKey(mk), style: theme.buttonStyle }, "Upgrade"))));
        }
        return (React.createElement("div", null,
            React.createElement("h2", null, (0, locale_1._)('Keys that need upgrading')),
            React.createElement("p", null, (0, locale_1._)('The following keys use an out-dated encryption algorithm and it is recommended to upgrade them. The upgraded key will still be able to decrypt and encrypt your data as usual.')),
            React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('ID')),
                        React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('Upgrade'))),
                    rows))));
    };
    const renderMasterKey = (mk) => {
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const passwordStyle = {
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            border: '1px solid',
            borderColor: theme.dividerColor,
        };
        const missingPasswordCellStyle = Object.assign(Object.assign({}, theme.textStyle), { border: '3px solid', borderColor: theme.colorError });
        const password = inputPasswords[mk.id] ? inputPasswords[mk.id] : '';
        const isActive = props.activeMasterKeyId === mk.id;
        const activeIcon = isActive ? '✔' : '';
        const passwordOk = passwordChecks[mk.id] === true ? '✔' : '❌';
        const renderPasswordInput = (masterKeyId) => {
            if (masterPasswordKeys[masterKeyId] || !passwordChecks['master']) {
                return (React.createElement("td", { style: Object.assign(Object.assign({}, theme.textStyle), { color: theme.colorFaded, fontStyle: 'italic' }) },
                    "(",
                    (0, locale_1._)('Master password'),
                    ")"));
            }
            else {
                return (React.createElement("td", { style: passwordChecks[masterKeyId] ? theme.textStyle : missingPasswordCellStyle },
                    React.createElement("input", { type: "password", placeholder: (0, locale_1._)('Enter password'), style: passwordStyle, value: password, onChange: event => onInputPasswordChange(mk, event.target.value) }),
                    ' ',
                    React.createElement("button", { style: theme.buttonStyle, onClick: () => (0, utils_1.onSavePasswordClick)(mk, Object.assign(Object.assign({}, props.passwords), inputPasswords)) }, (0, locale_1._)('Save'))));
            }
        };
        return (React.createElement("tr", { key: mk.id },
            React.createElement("td", { style: theme.textStyle }, activeIcon),
            React.createElement("td", { style: theme.textStyle },
                mk.id,
                React.createElement("br", null),
                (0, locale_1._)('Source: '),
                mk.source_application),
            React.createElement("td", { style: theme.textStyle },
                (0, locale_1._)('Created: '),
                time_1.default.formatMsToLocal(mk.created_time),
                React.createElement("br", null),
                (0, locale_1._)('Updated: '),
                time_1.default.formatMsToLocal(mk.updated_time)),
            renderPasswordInput(mk.id),
            React.createElement("td", { style: theme.textStyle }, passwordOk),
            React.createElement("td", { style: theme.textStyle },
                React.createElement("button", { style: theme.buttonStyle, onClick: () => (0, utils_1.onToggleEnabledClick)(mk) }, (0, syncInfoUtils_1.masterKeyEnabled)(mk) ? (0, locale_1._)('Disable') : (0, locale_1._)('Enable')))));
    };
    const renderMasterKeySection = (masterKeys, isEnabledMasterKeys) => {
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const mkComps = [];
        const showTable = isEnabledMasterKeys || showDisabledMasterKeys;
        for (let i = 0; i < masterKeys.length; i++) {
            const mk = masterKeys[i];
            mkComps.push(renderMasterKey(mk));
        }
        const headerComp = isEnabledMasterKeys ? React.createElement("h2", null, (0, locale_1._)('Encryption keys')) : React.createElement("a", { onClick: () => toggleShowDisabledMasterKeys(), style: Object.assign(Object.assign({}, theme.urlStyle), { display: 'inline-block', marginBottom: 10 }), href: "#" }, showTable ? (0, locale_1._)('Hide disabled keys') : (0, locale_1._)('Show disabled keys'));
        const infoComp = null; // isEnabledMasterKeys ? <p>{'Note: Only one key is going to be used for encryption (the one marked as "active"). Any of the keys might be used for decryption, depending on how the notes or notebooks were originally encrypted.'}</p> : null;
        const tableComp = !showTable ? null : (React.createElement("table", null,
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('Active')),
                    React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('ID')),
                    React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('Date')),
                    React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('Password')),
                    React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('Valid')),
                    React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('Actions'))),
                mkComps)));
        if (mkComps.length) {
            return (React.createElement("div", { className: "section" },
                headerComp,
                tableComp,
                infoComp));
        }
        return null;
    };
    const onToggleButtonClick = (0, react_1.useCallback)(async () => {
        const isEnabled = (0, syncInfoUtils_1.getEncryptionEnabled)();
        const newEnabled = !isEnabled;
        const masterKey = (0, utils_2.getDefaultMasterKey)();
        const hasMasterPassword = !!props.masterPassword;
        let newPassword = '';
        if (isEnabled) {
            setDisableEncryptionPromptVisible(true);
            const answer = await new Promise((resolve) => {
                disablePromptPromiseRef.current = resolve;
            });
            if (!answer)
                return;
        }
        else {
            if ((0, enableFlow_1.shouldOpenMasterPasswordDialogForEnable)({
                hasMasterPassword,
                masterPasswordDialogOpen: props.masterPasswordDialogOpen,
            })) {
                setPendingEnableEncryption(true);
                props.dispatch({
                    type: 'DIALOG_OPEN',
                    name: app_reducer_1.AppStateDialogName.MasterPassword,
                });
                return;
            }
            // Wait for the custom React Dialog to resolve
            setEnableEncryptionPassword('');
            setEnableEncryptionError('');
            setEnableEncryptionPromptVisible(true);
            newPassword = await new Promise((resolve) => {
                promptPromiseRef.current = resolve;
            });
            if (newPassword === null)
                return; // User cancelled
        }
        try {
            await (0, utils_2.toggleAndSetupEncryption)(EncryptionService_1.default.instance(), newEnabled, masterKey, newPassword);
        }
        catch (error) {
            await dialogs_1.default.alert(error.message);
        }
    }, [props.dispatch, props.masterPassword, props.masterPasswordDialogOpen]);
    const renderEncryptionDialog = (options) => {
        var _a;
        return (React.createElement(Dialog_1.default, { onCancel: options.onClose, className: options.className },
            React.createElement("div", { className: 'dialog-root' },
                React.createElement(DialogTitle_1.default, { title: options.title }),
                React.createElement("div", { className: 'dialog-content' }, options.content),
                React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: options.onDialogButtonRowClick, okButtonDisabled: (_a = options.okButtonDisabled) !== null && _a !== void 0 ? _a : false }))));
    };
    const renderEnableEncryptionDialog = () => {
        if (!enableEncryptionPromptVisible)
            return null;
        const masterKey = (0, utils_2.getDefaultMasterKey)();
        const hasMasterPassword = !!props.masterPassword;
        const msg = (0, utils_1.enableEncryptionConfirmationMessages)(masterKey, hasMasterPassword);
        const messageComps = msg.map((m, index) => React.createElement("p", { key: index, style: theme.textStyle }, m));
        const onClose = () => {
            setEnableEncryptionPromptVisible(false);
            if (promptPromiseRef.current)
                promptPromiseRef.current(null);
        };
        const onDialogButtonRowClick = async (event) => {
            if (event.buttonName === 'cancel') {
                onClose();
                return;
            }
            if (event.buttonName === 'ok') {
                if (hasMasterPassword) {
                    if (!(await (0, utils_2.masterPasswordIsValid)(enableEncryptionPassword))) {
                        setEnableEncryptionError((0, locale_1._)('Invalid password. Please try again. If you have forgotten your password you will need to reset it.'));
                        return;
                    }
                }
                setEnableEncryptionError('');
                setEnableEncryptionPromptVisible(false);
                if (promptPromiseRef.current)
                    promptPromiseRef.current(enableEncryptionPassword);
            }
        };
        const onPasswordInputChange = (event) => {
            setEnableEncryptionError('');
            setEnableEncryptionPassword(event.target.value);
        };
        return renderEncryptionDialog({
            className: 'enable-encryption-dialog',
            title: (0, locale_1._)('Enable encryption'),
            content: (React.createElement(React.Fragment, null,
                React.createElement("div", { style: { marginBottom: 16 } }, messageComps),
                React.createElement("div", { style: { marginBottom: 16 } },
                    React.createElement("label", { style: Object.assign(Object.assign({}, theme.textStyle), { marginBottom: 5, display: 'block' }), htmlFor: "enable-encryption-password" }, (0, locale_1._)('Password:')),
                    React.createElement(PasswordInput_1.default, { inputId: "enable-encryption-password", value: enableEncryptionPassword, onChange: onPasswordInputChange })),
                enableEncryptionError && (React.createElement("div", { style: Object.assign(Object.assign({}, theme.textStyle), { color: theme.colorError, marginTop: 10, marginBottom: 10 }) }, enableEncryptionError)))),
            onClose,
            onDialogButtonRowClick,
            okButtonDisabled: !enableEncryptionPassword,
        });
    };
    const renderDisableEncryptionDialog = () => {
        if (!disableEncryptionPromptVisible)
            return null;
        const onClose = () => {
            setDisableEncryptionPromptVisible(false);
            if (disablePromptPromiseRef.current)
                disablePromptPromiseRef.current(false);
        };
        const onDialogButtonRowClick = (event) => {
            if (event.buttonName === 'cancel') {
                onClose();
                return;
            }
            if (event.buttonName === 'ok') {
                setDisableEncryptionPromptVisible(false);
                if (disablePromptPromiseRef.current)
                    disablePromptPromiseRef.current(true);
            }
        };
        return renderEncryptionDialog({
            className: 'disable-encryption-dialog',
            title: (0, locale_1._)('Disable encryption'),
            content: (React.createElement("div", { style: { marginBottom: 16 } },
                React.createElement("p", { style: theme.textStyle }, (0, locale_1._)('Disabling encryption means *all* your notes and attachments are going to be re-synchronised and sent unencrypted to the sync target. Do you wish to continue?')))),
            onClose,
            onDialogButtonRowClick,
        });
    };
    const renderEncryptionSection = () => {
        const decryptedItemsInfo = React.createElement("p", null, (0, utils_1.decryptedStatText)(stats));
        const toggleButton = (React.createElement(Button_1.default, { onClick: onToggleButtonClick, title: props.encryptionEnabled ? (0, locale_1._)('Disable encryption') : (0, locale_1._)('Enable encryption'), level: Button_1.ButtonLevel.Secondary }));
        const needUpgradeSection = renderNeedUpgradeSection();
        return (React.createElement("div", { className: "section" },
            React.createElement("div", { className: "encryption-section" },
                React.createElement("h2", { className: "-no-top-margin" }, (0, locale_1._)('End-to-end encryption')),
                React.createElement("p", null,
                    (0, locale_1._)('Encryption:'),
                    " ",
                    React.createElement("strong", null, props.encryptionEnabled ? (0, locale_1._)('Enabled') : (0, locale_1._)('Disabled'))),
                React.createElement("p", null,
                    (0, locale_1._)('Public-private key pair:'),
                    " ",
                    React.createElement("strong", null, props.ppk ? (0, locale_1._)('Generated') : (0, locale_1._)('Not generated'))),
                decryptedItemsInfo,
                toggleButton,
                needUpgradeSection)));
    };
    const renderMasterPasswordSection = () => {
        const onManageMasterPassword = async () => {
            void CommandService_1.default.instance().execute('openMasterPasswordDialog');
        };
        const buttonTitle = CommandService_1.default.instance().label('openMasterPasswordDialog');
        const needPasswordMessage = !needMasterPassword ? null : (React.createElement("p", { className: "needpassword" },
            (0, locale_1._)('Your password is needed to decrypt some of your data.'),
            React.createElement("br", null),
            (0, locale_1._)('Please click on "%s" to proceed, or set the passwords in the "%s" list below.', buttonTitle, (0, locale_1._)('Encryption keys')),
            React.createElement("br", null),
            React.createElement(MissingPasswordHelpLink_1.default, { theme: theme, text: (0, locale_1._)('%s: Missing password.', (0, locale_1._)('Help')) })));
        return (React.createElement("div", { className: "section" },
            React.createElement("div", { className: "manage-password-section" },
                React.createElement("h2", null, (0, locale_1._)('Master password')),
                React.createElement("p", { className: "status" },
                    React.createElement("span", null, (0, locale_1._)('Master password:')),
                    "\u00A0",
                    React.createElement("span", { className: "bold" }, (0, utils_2.getMasterPasswordStatusMessage)(masterPasswordStatus))),
                needPasswordMessage,
                React.createElement(Button_1.default, { className: "managebutton", level: needMasterPassword ? Button_1.ButtonLevel.Primary : Button_1.ButtonLevel.Secondary, onClick: onManageMasterPassword, title: buttonTitle }))));
    };
    const onClearMasterPassword = (0, react_1.useCallback)(() => {
        Setting_1.default.setValue('encryption.masterPassword', '');
    }, []);
    const renderDebugSection = () => {
        if (Setting_1.default.value('env') !== 'dev')
            return null;
        return (React.createElement("div", { style: { paddingBottom: '20px' } },
            React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Secondary, onClick: onClearMasterPassword, title: "Clear master password" })));
    };
    const renderNonExistingMasterKeysSection = () => {
        let nonExistingMasterKeySection = null;
        const nonExistingMasterKeyIds = props.notLoadedMasterKeys.slice();
        for (let i = 0; i < props.masterKeys.length; i++) {
            const mk = props.masterKeys[i];
            const idx = nonExistingMasterKeyIds.indexOf(mk.id);
            if (idx >= 0)
                nonExistingMasterKeyIds.splice(idx, 1);
        }
        if (nonExistingMasterKeyIds.length) {
            const rows = [];
            for (let i = 0; i < nonExistingMasterKeyIds.length; i++) {
                const id = nonExistingMasterKeyIds[i];
                rows.push(React.createElement("tr", { key: id },
                    React.createElement("td", { style: theme.textStyle }, id)));
            }
            nonExistingMasterKeySection = (React.createElement("div", { className: "section" },
                React.createElement("h2", null, (0, locale_1._)('Missing keys')),
                React.createElement("p", null, (0, locale_1._)('The keys with these IDs are used to encrypt some of your items, however the application does not currently have access to them. It is likely they will eventually be downloaded via synchronisation.')),
                React.createElement("table", null,
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("th", { style: theme.textStyle }, (0, locale_1._)('ID'))),
                        rows))));
        }
        return nonExistingMasterKeySection;
    };
    const renderReencryptData = () => {
        if (!shim_1.default.isElectron())
            return null;
        if (!props.encryptionEnabled)
            return null;
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const buttonLabel = (0, locale_1._)('Re-encrypt data');
        const intro = props.shouldReencrypt ? (0, locale_1._)('The default encryption method has been changed to a more secure one and it is recommended that you apply it to your data.') : (0, locale_1._)('You may use the tool below to re-encrypt your data, for example if you know that some of your notes are encrypted with an obsolete encryption method.');
        let t = `${intro}\n\n${(0, locale_1._)('In order to do so, your entire data set will have to be encrypted and synchronised, so it is best to run it overnight.\n\nTo start, please follow these instructions:\n\n1. Synchronise all your devices.\n2. Click "%s".\n3. Let it run to completion. While it runs, avoid changing any note on your other devices, to avoid conflicts.\n4. Once sync is done on this device, sync all your other devices and let it run to completion.\n\nImportant: you only need to run this ONCE on one device.', buttonLabel)}`;
        t = t.replace(/\n\n/g, '</p><p>');
        t = t.replace(/\n/g, '<br>');
        t = `<p>${t}</p>`;
        return (React.createElement(React.Fragment, null,
            React.createElement("h2", null, (0, locale_1._)('Re-encryption')),
            React.createElement("p", { style: theme.textStyle, dangerouslySetInnerHTML: { __html: t } }),
            React.createElement("span", { style: { marginRight: 10 } },
                React.createElement("button", { onClick: () => void (0, utils_1.reencryptData)(), style: theme.buttonStyle }, buttonLabel)),
            !props.shouldReencrypt ? null : React.createElement("button", { onClick: () => (0, utils_1.dontReencryptData)(), style: theme.buttonStyle }, (0, locale_1._)('Ignore'))));
    };
    // If the user should re-encrypt, ensure that the section is visible initially.
    const [showAdvanced, setShowAdvanced] = (0, react_1.useState)(props.shouldReencrypt);
    const toggleAdvanced = (0, react_1.useCallback)(() => {
        setShowAdvanced(!showAdvanced);
    }, [showAdvanced]);
    const advancedSettingsId = (0, react_1.useId)();
    const renderAdvancedSection = () => {
        const reEncryptSection = renderReencryptData();
        if (!reEncryptSection)
            return null;
        return (React.createElement("div", null,
            React.createElement(ToggleAdvancedSettingsButton_1.default, { onClick: toggleAdvanced, advancedSettingsVisible: showAdvanced, "aria-controls": advancedSettingsId }),
            React.createElement("div", { id: advancedSettingsId }, showAdvanced ? reEncryptSection : null)));
    };
    return (React.createElement("div", { className: "config-screen-content" },
        renderDebugSection(),
        renderEncryptionSection(),
        renderMasterPasswordSection(),
        renderMasterKeySection(props.masterKeys.filter(mk => (0, syncInfoUtils_1.masterKeyEnabled)(mk)), true),
        renderMasterKeySection(props.masterKeys.filter(mk => !(0, syncInfoUtils_1.masterKeyEnabled)(mk)), false),
        renderNonExistingMasterKeysSection(),
        renderAdvancedSection(),
        renderEnableEncryptionDialog(),
        renderDisableEncryptionDialog()));
};
exports.EncryptionConfigScreen = EncryptionConfigScreen;
const mapStateToProps = (state) => {
    const syncInfo = (0, syncInfoUtils_1.localSyncInfoSelector)(state);
    return {
        themeId: state.settings.theme,
        masterKeys: syncInfo.masterKeys,
        passwords: state.settings['encryption.passwordCache'],
        encryptionEnabled: syncInfo.e2ee,
        activeMasterKeyId: syncInfo.activeMasterKeyId,
        shouldReencrypt: state.settings['encryption.shouldReencrypt'] >= Setting_1.default.SHOULD_REENCRYPT_YES,
        notLoadedMasterKeys: state.notLoadedMasterKeys,
        masterPassword: state.settings['encryption.masterPassword'],
        ppk: syncInfo.ppk,
        masterPasswordDialogOpen: !!state.dialogs.find(dialog => dialog.name === app_reducer_1.AppStateDialogName.MasterPassword),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(exports.EncryptionConfigScreen);
//# sourceMappingURL=EncryptionConfigScreen.js.map