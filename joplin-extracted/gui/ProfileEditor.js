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
const ButtonBar_1 = __importDefault(require("./ConfigScreen/ButtonBar"));
const locale_1 = require("@joplin/lib/locale");
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const bridge_1 = __importDefault(require("../services/bridge"));
const dialogs_1 = __importDefault(require("./dialogs"));
const profileConfig_1 = require("@joplin/lib/services/profileConfig");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('ProfileEditor');
const ProfileTableComp = props => {
    const theme = (0, theme_1.themeStyle)(props.themeId);
    return (React.createElement("table", { className: "profile-table" },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { className: "headerCell" }, (0, locale_1._)('Profile name')),
                React.createElement("th", { className: "headerCell" }, (0, locale_1._)('ID')),
                React.createElement("th", { className: "headerCell" }, (0, locale_1._)('Status')),
                React.createElement("th", { className: "headerCell" }, (0, locale_1._)('Actions')))),
        React.createElement("tbody", null, props.profiles.map((profile, index) => {
            const isCurrentProfile = profile.id === props.currentProfileId;
            return (React.createElement("tr", { key: index },
                React.createElement("td", { id: `name-${profile.id}`, className: "nameCell" },
                    React.createElement("span", { style: { fontWeight: isCurrentProfile ? 'bold' : 'normal' } }, profile.name || `(${(0, locale_1._)('Untitled')})`)),
                React.createElement("td", { className: "dataCell" }, profile.id),
                React.createElement("td", { className: "dataCell" }, isCurrentProfile ? (0, locale_1._)('Active') : ''),
                React.createElement("td", { className: "dataCell profileActions" },
                    React.createElement("button", { id: `rename-${profile.id}`, "aria-labelledby": `rename-${profile.id} name-${profile.id}`, style: theme.buttonStyle, onClick: () => props.onProfileRename(profile) }, (0, locale_1._)('Rename')),
                    !isCurrentProfile && (React.createElement("button", { id: `delete-${profile.id}`, "aria-labelledby": `delete-${profile.id} name-${profile.id}`, style: theme.buttonStyle, onClick: () => props.onProfileDelete(profile) }, (0, locale_1._)('Delete'))))));
        }))));
};
const ProfileEditorComponent = props => {
    const { profileConfig, themeId, dispatch } = props;
    const theme = (0, theme_1.themeStyle)(themeId);
    const style = props.style;
    const containerHeight = style.height;
    const [profiles, setProfiles] = (0, react_1.useState)(profileConfig.profiles);
    (0, react_1.useEffect)(() => {
        setProfiles(profileConfig.profiles);
    }, [profileConfig]);
    const saveNewProfileConfig = async (makeNewProfileConfig) => {
        try {
            const newProfileConfig = makeNewProfileConfig();
            await (0, profileConfig_1.saveProfileConfig)(`${Setting_1.default.value('rootProfileDir')}/profiles.json`, newProfileConfig);
            dispatch({
                type: 'PROFILE_CONFIG_SET',
                value: newProfileConfig,
            });
        }
        catch (error) {
            logger.error(error);
            (0, bridge_1.default)().showErrorMessageBox(error.message);
        }
    };
    const onProfileRename = async (profile) => {
        const newName = await dialogs_1.default.prompt((0, locale_1._)('Profile name:'), '', profile.name);
        if (newName === null || newName === undefined || newName === profile.name)
            return;
        if (!newName.trim()) {
            (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Profile name cannot be empty'));
            return;
        }
        const makeNewProfileConfig = () => {
            const newProfiles = profileConfig.profiles.map(p => p.id === profile.id ? Object.assign(Object.assign({}, p), { name: newName.trim() }) : p);
            const newProfileConfig = Object.assign(Object.assign({}, profileConfig), { profiles: newProfiles });
            return newProfileConfig;
        };
        await saveNewProfileConfig(makeNewProfileConfig);
    };
    const onProfileDelete = async (profile) => {
        const isCurrentProfile = profile.id === profileConfig.currentProfileId;
        if (isCurrentProfile) {
            (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('The active profile cannot be deleted. Switch to a different profile and try again.'));
            return;
        }
        const ok = (0, bridge_1.default)().showConfirmMessageBox((0, locale_1._)('Delete profile "%s"?\n\nAll data, including notes, notebooks and tags will be permanently deleted.', profile.name), {
            buttons: [(0, locale_1._)('Delete'), (0, locale_1._)('Cancel')],
            defaultId: 1,
        });
        if (!ok)
            return;
        const subProfile = (0, profileConfig_1.isSubProfile)(profile);
        const rootDir = Setting_1.default.value('rootProfileDir');
        // Deleting the default profile must be handled differently. We can't delete the whole directory because it contains other profiles and global settings
        if (subProfile) {
            const profileDir = `${rootDir}/profile-${profile.id}`;
            try {
                await shim_1.default.fsDriver().remove(profileDir);
                logger.info('Deleted profile directory: ', profileDir);
            }
            catch (error) {
                logger.error('Error deleting profile directory: ', error);
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
            await saveNewProfileConfig(() => (0, profileConfig_1.deleteProfileById)(profileConfig, profile.id));
        }
        else {
            const dirsToDelete = ['cache', 'resources', 'tmp'];
            const filesToDelete = ['database.sqlite', 'log.txt', 'keymap-desktop.json'];
            // Reset settings for the default profile, but retain global settings
            try {
                await Setting_1.default.resetDefaultProfileSettings();
            }
            catch (error) {
                // If the first stage fails, nothing has happened, so throw an error. But if there is a failure in later steps, ignore errors but log them
                logger.error('Error deleting the default profile: ', error);
                (0, bridge_1.default)().showErrorMessageBox(error.message);
                return;
            }
            // Delete directories
            for (const dir of dirsToDelete) {
                const fullPath = `${rootDir}/${dir}`;
                try {
                    if (await shim_1.default.fsDriver().exists(fullPath)) {
                        await shim_1.default.fsDriver().remove(fullPath);
                        logger.info('Deleted directory: ', fullPath);
                    }
                }
                catch (error) {
                    logger.error('Error deleting directory: ', fullPath, error);
                }
            }
            // Delete files
            for (const file of filesToDelete) {
                const fullPath = `${rootDir}/${file}`;
                try {
                    if (await shim_1.default.fsDriver().exists(fullPath)) {
                        await shim_1.default.fsDriver().unlink(fullPath);
                        logger.info('Deleted file: ', fullPath);
                    }
                }
                catch (error) {
                    logger.error('Error deleting file: ', fullPath, error);
                }
            }
            (0, bridge_1.default)().showMessageBox((0, locale_1._)('The default profile has been reset.'));
        }
    };
    return (React.createElement("div", { className: "profile-management", style: Object.assign(Object.assign({}, theme.containerStyle), { height: containerHeight }) },
        React.createElement("div", { className: "tableContainer" },
            React.createElement("div", { className: "notification", style: theme.notificationBox }, (0, locale_1._)('Manage your profiles. You can rename or delete profiles. The active profile cannot be deleted.')),
            React.createElement(ProfileTableComp, { themeId: themeId, profiles: profiles, currentProfileId: profileConfig.currentProfileId, onProfileRename: onProfileRename, onProfileDelete: onProfileDelete })),
        React.createElement(ButtonBar_1.default, { onCancelClick: () => dispatch({ type: 'NAV_BACK' }) })));
};
const mapStateToProps = (state) => ({
    themeId: state.settings.theme,
    profileConfig: state.profileConfig,
});
exports.default = (0, react_redux_1.connect)(mapStateToProps)(ProfileEditorComponent);
//# sourceMappingURL=ProfileEditor.js.map