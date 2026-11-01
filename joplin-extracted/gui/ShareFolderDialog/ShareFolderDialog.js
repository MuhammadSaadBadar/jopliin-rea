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
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogButtonRow_1 = __importDefault(require("../DialogButtonRow"));
const DialogTitle_1 = __importDefault(require("../DialogTitle"));
const locale_1 = require("@joplin/lib/locale");
const react_1 = require("react");
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const ShareService_1 = __importDefault(require("@joplin/lib/services/share/ShareService"));
const styled_components_1 = __importDefault(require("styled-components"));
const StyledFormLabel_1 = __importDefault(require("../style/StyledFormLabel"));
const Button_1 = __importStar(require("../Button/Button"));
const InlineCombobox_1 = __importDefault(require("../InlineCombobox"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const StyledMessage_1 = __importDefault(require("../style/StyledMessage"));
const reducer_1 = require("@joplin/lib/services/share/reducer");
const react_redux_1 = require("react-redux");
const registry_1 = require("@joplin/lib/registry");
const useAsyncEffect_1 = __importDefault(require("@joplin/lib/hooks/useAsyncEffect"));
const Dropdown_1 = require("../Dropdown/Dropdown");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const debounce = require('debounce');
const logger = Logger_1.default.create('ShareFolderDialog');
const StyledRoot = styled_components_1.default.div `
	min-width: 500px;
`;
const StyledFolder = styled_components_1.default.div `
	border: 1px solid ${(props) => props.theme.dividerColor};
	padding: 0.5em;
	margin-bottom: 1em;
	display: flex;
	align-items: center;
`;
const StyledRecipientControls = styled_components_1.default.div `
	display: flex;
	flex-direction: row;
	gap: 10px;
`;
const StyledAddRecipient = styled_components_1.default.div `
	margin-bottom: 1em;
`;
const StyledRecipient = (0, styled_components_1.default)(StyledMessage_1.default) `
	display: flex;
	flex-direction: row;
	padding: .6em 1em;
	background-color: ${props => props.index % 2 === 0 ? props.theme.backgroundColor : props.theme.oddBackgroundColor};
	align-items: center;
`;
const StyledRecipientName = styled_components_1.default.div `
	display: flex;
	flex: 1;
`;
const StyledRecipientStatusIcon = styled_components_1.default.i `
	margin-right: .6em;
`;
const StyledRecipients = styled_components_1.default.div `
	margin-bottom: 10px;
`;
const StyledRecipientList = styled_components_1.default.div `
	border: 1px solid ${(props) => props.theme.dividerColor};
	border-radius: 3px;
	height: 300px;
	overflow-x: hidden;
	overflow-y: scroll;
`;
const StyledError = (0, styled_components_1.default)(StyledMessage_1.default) `
	word-break: break-all;
	margin-bottom: 1em;
`;
const StyledShareState = (0, styled_components_1.default)(StyledMessage_1.default) `
	word-break: break-all;
	margin-bottom: 1em;
`;
const StyledIcon = styled_components_1.default.i `
	margin-right: 8px;
`;
var ShareState;
(function (ShareState) {
    ShareState[ShareState["Idle"] = 0] = "Idle";
    ShareState[ShareState["Synchronizing"] = 1] = "Synchronizing";
    ShareState[ShareState["Creating"] = 2] = "Creating";
})(ShareState || (ShareState = {}));
function ShareFolderDialog(props) {
    const permissionOptions = {
        'can_read': (0, locale_1._)('Can view'),
        'can_read_and_write': (0, locale_1._)('Can view and edit'),
    };
    const [folder, setFolder] = (0, react_1.useState)(null);
    const [recipientEmail, setRecipientEmail] = (0, react_1.useState)('');
    const [recipientPermissions, setRecipientPermissions] = (0, react_1.useState)('can_read_and_write');
    const [latestError, setLatestError] = (0, react_1.useState)(null);
    const [share, setShare] = (0, react_1.useState)(null);
    const [shareUsers, setShareUsers] = (0, react_1.useState)([]);
    const [shareState, setShareState] = (0, react_1.useState)(ShareState.Idle);
    const [recipientsBeingUpdated, setRecipientsBeingUpdated] = (0, react_1.useState)({});
    const [recipientSuggestions, setRecipientSuggestions] = (0, react_1.useState)([]);
    async function synchronize(event = null) {
        setShareState(ShareState.Synchronizing);
        await registry_1.reg.waitForSyncFinishedThenSync();
        if (event && event.cancelled)
            return;
        setShareState(ShareState.Idle);
    }
    (0, useAsyncEffect_1.default)(async (event) => {
        const f = await Folder_1.default.load(props.folderId);
        if (event.cancelled)
            return;
        setFolder(f);
    }, [props.folderId]);
    (0, react_1.useEffect)(() => {
        void ShareService_1.default.instance().refreshShares();
    }, []);
    (0, useAsyncEffect_1.default)(async (event) => {
        await synchronize(event);
    }, []);
    (0, react_1.useEffect)(() => {
        const s = props.shares.find(s => s.folder_id === props.folderId);
        setShare(s);
    }, [props.shares, props.folderId]);
    (0, react_1.useEffect)(() => {
        if (!share)
            return;
        void ShareService_1.default.instance().refreshShareUsers(share.id);
    }, [share]);
    (0, react_1.useEffect)(() => {
        if (!share)
            return;
        const sus = props.shareUsers[share.id];
        if (!sus)
            return;
        setShareUsers(sus);
    }, [share, props.shareUsers]);
    (0, react_1.useEffect)(() => {
        setRecipientSuggestions([]);
        let cancelled = false;
        const loadSuggestions = async () => {
            if (!props.canUseRecipientAutocomplete || !recipientEmail)
                return;
            try {
                const result = await ShareService_1.default.instance().loadTeamUsers('me', recipientEmail);
                if (!cancelled) {
                    setRecipientSuggestions(result.items.map(item => item.email));
                }
            }
            catch (error) {
                logger.error('Could not load team users', error);
                if (!cancelled) {
                    setLatestError(error);
                    setRecipientSuggestions([]);
                }
            }
        };
        const debouncedLoad = debounce(loadSuggestions, 250);
        debouncedLoad();
        return () => {
            cancelled = true;
            debouncedLoad.clear();
        };
    }, [props.canUseRecipientAutocomplete, recipientEmail]);
    const permissionsFromString = (p) => {
        return {
            can_read: 1,
            can_write: p === 'can_read_and_write' ? 1 : 0,
        };
    };
    const shareRecipient_click = (0, react_1.useCallback)(async () => {
        setShareState(ShareState.Creating);
        setLatestError(null);
        let errorSet = false;
        const handleError = (error) => {
            if (!errorSet)
                setLatestError(error);
            errorSet = true;
            logger.error(error);
        };
        const defer = (error) => {
            if (error)
                handleError(error);
            setShareState(ShareState.Idle);
        };
        let share = null;
        try {
            share = await ShareService_1.default.instance().shareFolder(props.folderId);
        }
        catch (error) {
            return defer(error);
        }
        try {
            await ShareService_1.default.instance().addShareRecipient(share.id, share.master_key_id, recipientEmail, permissionsFromString(recipientPermissions));
        }
        catch (error) {
            // Handle the error but continue the process because we need to at
            // least refresh the shares since one has been created above.
            handleError(error);
        }
        try {
            await Promise.all([
                ShareService_1.default.instance().refreshShares(),
                ShareService_1.default.instance().refreshShareUsers(share.id),
            ]);
            // Only clear the input on success, otherwise the user loses the email
            // they typed and the error message would be wiped by the suggestions effect.
            if (!errorSet)
                setRecipientEmail('');
            await synchronize();
        }
        catch (error) {
            handleError(error);
        }
        finally {
            defer(null);
        }
    }, [recipientPermissions, props.folderId, recipientEmail]);
    const recipientEmail_change = (0, react_1.useCallback)((value) => {
        setRecipientEmail(value);
        setLatestError(null);
    }, []);
    const renderRecipientSuggestion = (0, react_1.useCallback)((suggestedValue) => {
        return React.createElement("div", null, suggestedValue);
    }, []);
    async function recipient_delete(event) {
        if (!await shim_1.default.showConfirmationDialog((0, locale_1._)('Delete this invitation? The recipient will no longer have access to this shared notebook.')))
            return;
        try {
            await ShareService_1.default.instance().deleteShareRecipient(event.shareUserId);
        }
        catch (error) {
            logger.error(error);
            await shim_1.default.showErrorDialog((0, locale_1._)('The recipient could not be removed from the list. Please try again.\n\nThe error was: "%s"', error.message));
        }
        await ShareService_1.default.instance().refreshShareUsers(share.id);
    }
    function renderFolder() {
        return (React.createElement(StyledFolder, null,
            React.createElement(StyledIcon, { className: "icon-notebooks" }),
            folder ? folder.title : '...'));
    }
    const recipientPermissions_change = (0, react_1.useCallback)((event) => {
        setRecipientPermissions(event.value);
    }, []);
    function renderAddRecipient() {
        const disabled = shareState !== ShareState.Idle && shareState !== ShareState.Synchronizing;
        const dropdown = !props.canUseSharePermissions ? null : React.createElement(Dropdown_1.Dropdown, { options: permissionOptions, value: recipientPermissions, onChange: recipientPermissions_change });
        return (React.createElement(StyledAddRecipient, null,
            React.createElement(StyledFormLabel_1.default, null, (0, locale_1._)('Add recipient:')),
            React.createElement(StyledRecipientControls, null,
                React.createElement(InlineCombobox_1.default, { value: recipientEmail, onChange: recipientEmail_change, suggestedValues: disabled ? [] : recipientSuggestions, renderOption: renderRecipientSuggestion, inputStyle: {}, inputId: 'share-folder-dialog-recipient-email', className: '-form-control' }),
                dropdown,
                React.createElement(Button_1.default, { size: Button_1.ButtonSize.Small, disabled: disabled, title: (0, locale_1._)('Share'), onClick: shareRecipient_click }))));
    }
    const recipient_permissionChange = (0, react_1.useCallback)(async (shareUserId, value) => {
        try {
            setRecipientsBeingUpdated(prev => {
                return Object.assign(Object.assign({}, prev), { [shareUserId]: true });
            });
            await ShareService_1.default.instance().setPermissions(share.id, shareUserId, permissionsFromString(value));
        }
        catch (error) {
            void shim_1.default.showErrorDialog(`Could not set permissions: ${error.message}`);
            logger.error(error);
        }
        finally {
            setRecipientsBeingUpdated(prev => {
                return Object.assign(Object.assign({}, prev), { [shareUserId]: false });
            });
        }
    }, [share]);
    function renderRecipient(index, shareUser) {
        const statusToIcon = {
            [reducer_1.ShareUserStatus.Waiting]: 'fas fa-question',
            [reducer_1.ShareUserStatus.Rejected]: 'fas fa-times',
            [reducer_1.ShareUserStatus.Accepted]: 'fas fa-check',
        };
        const statusToMessage = {
            [reducer_1.ShareUserStatus.Waiting]: (0, locale_1._)('Recipient has not yet accepted the invitation'),
            [reducer_1.ShareUserStatus.Rejected]: (0, locale_1._)('Recipient has rejected the invitation'),
            [reducer_1.ShareUserStatus.Accepted]: (0, locale_1._)('Recipient has accepted the invitation'),
        };
        const permission = shareUser.can_write ? 'can_read_and_write' : 'can_read';
        const enabled = !recipientsBeingUpdated[shareUser.id];
        const dropdown = !props.canUseSharePermissions ? null : React.createElement(Dropdown_1.Dropdown, { disabled: !enabled, className: "permission-dropdown", value: permission, options: permissionOptions, variant: Dropdown_1.DropdownVariant.NoBorder, onChange: event => recipient_permissionChange(shareUser.id, event.value) });
        return (React.createElement(StyledRecipient, { type: "info", key: shareUser.user.email, index: index },
            React.createElement(StyledRecipientName, null, shareUser.user.email),
            dropdown,
            React.createElement(StyledRecipientStatusIcon, { title: statusToMessage[shareUser.status], className: statusToIcon[shareUser.status] }),
            React.createElement(Button_1.default, { disabled: !enabled, size: Button_1.ButtonSize.Small, iconName: "far fa-times-circle", onClick: () => recipient_delete({ shareUserId: shareUser.id }), tooltip: (0, locale_1._)('Remove %s from share', shareUser.user.email) })));
    }
    function renderRecipients() {
        const listItems = shareUsers.map((su, index) => renderRecipient(index, su));
        return (React.createElement(StyledRecipients, null,
            React.createElement(StyledFormLabel_1.default, null, (0, locale_1._)('Recipients:')),
            React.createElement(StyledRecipientList, null, listItems)));
    }
    function renderError() {
        if (!latestError)
            return null;
        return (React.createElement(StyledError, { type: "error" }, latestError.message));
    }
    function renderShareState() {
        if (shareState === ShareState.Idle)
            return null;
        const messages = {
            [ShareState.Synchronizing]: (0, locale_1._)('Synchronizing...'),
            [ShareState.Creating]: (0, locale_1._)('Sharing notebook...'),
        };
        const message = messages[shareState];
        if (!message)
            throw new Error(`Unsupported state: ${shareState}`);
        return (React.createElement(StyledShareState, { type: "info" }, message));
    }
    const renderInfo = () => {
        return (React.createElement("p", { className: "info-text -small" }, (0, locale_1._)('Please note that if it is a large notebook, it may take a few minutes for all the notes to show up on the recipient\'s device.')));
    };
    async function buttonRow_click(event) {
        if (event.buttonName === 'unshare') {
            if (!await shim_1.default.showConfirmationDialog((0, locale_1._)('Unshare this notebook? The recipients will no longer have access to its content.'))) {
                return;
            }
            await ShareService_1.default.instance().unshareFolder(props.folderId);
            void synchronize();
        }
        props.onClose();
    }
    const customButtons = (0, react_1.useMemo)(() => {
        return share ? [{
                name: 'unshare',
                label: (0, locale_1._)('Unshare'),
                // Don't allow unsharing the folder during the "create" action. Doing so might
                // be able to cause issues similar to #13518 (e.g. if the "unshare" action completes while
                // the "share" action is still in progress).
                disabled: shareState === ShareState.Creating || shareState === ShareState.Synchronizing,
            }] : [];
    }, [share, shareState]);
    function renderContent() {
        return (React.createElement(StyledRoot, { className: "share-folder-dialog" },
            React.createElement(DialogTitle_1.default, { title: (0, locale_1._)('Share Notebook') }),
            renderFolder(),
            renderAddRecipient(),
            renderShareState(),
            renderError(),
            renderRecipients(),
            renderInfo(),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: buttonRow_click, okButtonShow: false, cancelButtonLabel: (0, locale_1._)('Close'), customButtons: customButtons })));
    }
    return (React.createElement(Dialog_1.default, null, renderContent()));
}
const mapStateToProps = (state) => {
    const getCanUseSharePermissions = (settings) => {
        return [9, 10, 11].includes(settings['sync.target']) && !!settings['sync.10.canUseSharePermissions'];
    };
    return {
        shares: state.shareService.shares,
        shareUsers: state.shareService.shareUsers,
        canUseSharePermissions: getCanUseSharePermissions(state.settings),
        // Autocomplete is in the same context as share permissions.
        // We discussed to reuse sync.10.canUseSharePermissions because adding
        // sync.10.canUseRecipientAutocomplete would need too many changes,
        // I decided to have a different local prop with the same value, so it's
        // separated to be easier to update when premium features handling change.
        canUseRecipientAutocomplete: getCanUseSharePermissions(state.settings),
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(ShareFolderDialog);
//# sourceMappingURL=ShareFolderDialog.js.map