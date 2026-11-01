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
const Sidebar_1 = __importDefault(require("./Sidebar"));
const ButtonBar_1 = __importDefault(require("./ButtonBar"));
const Button_1 = __importStar(require("../Button/Button"));
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../../services/bridge"));
const Setting_1 = __importStar(require("@joplin/lib/models/Setting"));
const EncryptionConfigScreen_1 = __importDefault(require("../EncryptionConfigScreen/EncryptionConfigScreen"));
const NoteLockSettings_1 = __importDefault(require("./controls/NoteLockSettings"));
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const registry_1 = require("@joplin/lib/registry");
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const SyncTargetRegistry_1 = __importDefault(require("@joplin/lib/SyncTargetRegistry"));
const shared = __importStar(require("@joplin/lib/components/shared/config/config-shared.js"));
const ClipperConfigScreen_1 = __importDefault(require("../ClipperConfigScreen"));
const restart_1 = __importDefault(require("../../services/restart"));
const JoplinCloudConfigScreen_1 = __importDefault(require("../JoplinCloudConfigScreen"));
const ToggleAdvancedSettingsButton_1 = __importDefault(require("./controls/ToggleAdvancedSettingsButton"));
const shouldShowMissingPasswordWarning_1 = __importDefault(require("@joplin/lib/components/shared/config/shouldShowMissingPasswordWarning"));
const config_search_text_js_1 = require("@joplin/lib/components/shared/config/config-search-text.js");
const configSearch_1 = require("./configSearch");
const MissingPasswordHelpLink_1 = __importDefault(require("./controls/MissingPasswordHelpLink"));
const AiIndexStatus_1 = __importDefault(require("./controls/AiIndexStatus"));
const AiStatus_1 = __importDefault(require("./controls/AiStatus"));
const { KeymapConfigScreen } = require('../KeymapConfig/KeymapConfigScreen');
const SettingComponent_1 = __importDefault(require("./controls/SettingComponent"));
const shim_1 = __importStar(require("@joplin/lib/shim"));
const searchHighlight_1 = __importDefault(require("./searchHighlight"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old class component without props/state interfaces; tightening requires structural refactor
class ConfigScreenComponent extends React.Component {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Constructor signature must match the class's open `any` props type
    constructor(props) {
        super(props);
        this.rowStyle_ = null;
        this.onUpdateSettingValue = ({ key, value }) => {
            const md = Setting_1.default.settingMetadata(key);
            if (md.needRestart) {
                this.setState({ needRestart: true });
            }
            shared.updateSettingValue(this, key, value);
        };
        this.renderSearchHighlightedText = (text) => {
            return (0, searchHighlight_1.default)(text, this.state.searchQuery);
        };
        shared.init(registry_1.reg);
        this.state = Object.assign(Object.assign({}, shared.defaultScreenState), { selectedSectionName: 'general', screenName: '', changedSettingKeys: [], needRestart: false, fonts: [], searchQuery: '', searchSectionFilter: null });
        this.rowStyle_ = {
            marginBottom: 10,
        };
        this.sidebar_selectionChange = this.sidebar_selectionChange.bind(this);
        this.checkSyncConfig_ = this.checkSyncConfig_.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onApplyClick = this.onApplyClick.bind(this);
        this.handleSettingButton = this.handleSettingButton.bind(this);
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
    }
    onSearchQueryChange(event) {
        this.setState({
            searchQuery: event.value,
            searchSectionFilter: null,
        });
    }
    onSearchButtonClick() {
        this.setState({
            searchQuery: '',
            searchSectionFilter: null,
        });
    }
    async checkSyncConfig_() {
        if (this.state.settings['sync.target'] === SyncTargetRegistry_1.default.nameToId('joplinCloud')) {
            const isAuthenticated = await registry_1.reg.syncTarget().isAuthenticated();
            if (!isAuthenticated) {
                return this.props.dispatch({
                    type: 'NAV_GO',
                    routeName: 'JoplinCloudLogin',
                });
            }
        }
        await shared.checkSyncConfig(this, this.state.settings);
    }
    UNSAFE_componentWillMount() {
        this.setState({ settings: this.props.settings });
    }
    async componentDidMount() {
        if (this.props.defaultSection) {
            this.setState({ selectedSectionName: this.props.defaultSection }, () => {
                void this.switchSection(this.props.defaultSection);
            });
        }
        const fonts = (await window.queryLocalFonts()).map((font) => font.family);
        const uniqueFonts = [...new Set(fonts)];
        this.setState({ fonts: uniqueFonts });
    }
    async handleSettingButton(key) {
        if (key === 'sync.clearLocalSyncStateButton') {
            if (!await shim_1.default.showConfirmationDialog('This cannot be undone. Do you want to continue?'))
                return;
            Setting_1.default.setValue('sync.startupOperation', Setting_1.SyncStartupOperation.ClearLocalSyncState);
            await Setting_1.default.saveAll();
            await (0, restart_1.default)();
        }
        else if (key === 'sync.clearLocalDataButton') {
            if (!await shim_1.default.showConfirmationDialog('This cannot be undone. Do you want to continue?'))
                return;
            Setting_1.default.setValue('sync.startupOperation', Setting_1.SyncStartupOperation.ClearLocalData);
            await Setting_1.default.saveAll();
            await (0, restart_1.default)();
        }
        else if (key === 'ocr.clearLanguageDataCacheButton') {
            if (!await shim_1.default.showConfirmationDialog(this.restartMessage()))
                return;
            Setting_1.default.setValue('ocr.clearLanguageDataCache', true);
            await (0, restart_1.default)();
        }
        else if (key === 'ai.usage.resetButton') {
            if (!await shim_1.default.showConfirmationDialog((0, locale_1._)('Reset AI token usage counters?')))
                return;
            Setting_1.default.setValue('ai.usage.inputTokens', 0);
            Setting_1.default.setValue('ai.usage.outputTokens', 0);
            await Setting_1.default.saveAll();
        }
        else if (key === 'ai.chat.testButton') {
            await shared.checkAiConfig(this);
        }
        else if (key === 'sync.openSyncWizard') {
            this.props.dispatch({
                type: 'DIALOG_OPEN',
                name: 'syncWizard',
            });
        }
        else {
            throw new Error(`Unhandled key: ${key}`);
        }
    }
    sectionByName(name) {
        const sections = shared.settingsSections({ device: Setting_1.AppType.Desktop, settings: this.state.settings });
        for (const section of sections) {
            if (section.name === name)
                return section;
        }
        throw new Error(`Invalid section name: ${name}`);
    }
    screenFromName(screenName) {
        if (screenName === 'encryption')
            return React.createElement(EncryptionConfigScreen_1.default, null);
        if (screenName === 'server')
            return React.createElement(ClipperConfigScreen_1.default, { themeId: this.props.themeId });
        if (screenName === 'keymap')
            return React.createElement(KeymapConfigScreen, { themeId: this.props.themeId });
        if (screenName === 'joplinCloud')
            return React.createElement(JoplinCloudConfigScreen_1.default, null);
        throw new Error(`Invalid screen name: ${screenName}`);
    }
    async switchSection(name) {
        const section = this.sectionByName(name);
        let screenName = '';
        if (section.isScreen) {
            screenName = section.name;
            if (this.hasChanges()) {
                const answer = await shim_1.default.showMessageBox((0, locale_1._)('This will open a new screen. Save your current changes?'), {
                    type: shim_1.MessageBoxType.Confirm,
                    buttons: [(0, locale_1._)('Save changes'), (0, locale_1._)('Discard changes')],
                    defaultId: 0,
                    cancelId: 1,
                });
                if (answer === 0) {
                    await shared.saveSettings(this);
                }
            }
        }
        this.setState({ selectedSectionName: section.name, screenName: screenName });
    }
    sidebar_selectionChange(event) {
        const sectionName = event.section.name;
        const searchMode = !!(0, config_search_text_js_1.normalizeQuery)(this.state.searchQuery);
        if (searchMode) {
            this.setState({
                searchSectionFilter: sectionName,
            });
            return;
        }
        void this.switchSection(sectionName);
    }
    renderSectionDescription(section) {
        const description = Setting_1.default.sectionDescription(section.name, Setting_1.AppType.Desktop);
        if (!description)
            return null;
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        return (React.createElement("div", { style: Object.assign(Object.assign({}, theme.textStyle), { marginBottom: 15 }) }, description));
    }
    sectionToComponent(key, section, settings, selected) {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const searchMode = !!(0, config_search_text_js_1.normalizeQuery)(this.state.searchQuery);
        const createSettingComponents = (advanced) => {
            const output = [];
            for (let i = 0; i < section.metadatas.length; i++) {
                const md = section.metadatas[i];
                if (!!md.advanced !== advanced)
                    continue;
                const settingComp = this.settingToComponent(md.key, settings[md.key]);
                output.push(settingComp);
            }
            return output;
        };
        const settingComps = createSettingComponents(false);
        const advancedSettingComps = createSettingComponents(true);
        const sectionWidths = {
            plugins: '100%',
        };
        const sectionStyle = {
            marginTop: 20,
            marginBottom: 20,
            maxWidth: sectionWidths[section.name] ? sectionWidths[section.name] : 640,
        };
        if (!selected)
            sectionStyle.display = 'none';
        if (section.name === 'general') {
            sectionStyle.borderTopWidth = 0;
        }
        if (section.name === 'ai' && settings['ai.enabled']) {
            const messages = shared.checkAiConfigMessages(this);
            if (messages.length) {
                const result = this.state.checkAiConfigResult;
                const ok = result && result !== 'checking' && result.ok;
                const statusStyle = Object.assign(Object.assign({}, theme.textStyle), { marginTop: 10, color: ok ? theme.color : theme.colorWarn });
                settingComps.push(React.createElement("div", { key: "ai_config_test_status", style: statusStyle, "aria-live": 'polite' },
                    messages[0],
                    messages.length > 1 ? React.createElement("p", null, messages[1]) : null));
            }
            settingComps.push(React.createElement(AiIndexStatus_1.default, { key: 'ai_index_status' }));
            settingComps.push(React.createElement(AiStatus_1.default, { key: 'ai_status' }));
        }
        if (section.name === 'noteLock' && (0, isNoteLockEnabled_1.default)()) {
            settingComps.push(React.createElement(NoteLockSettings_1.default, { key: 'note_lock_settings' }));
        }
        if (section.name === 'sync') {
            const syncTargetMd = SyncTargetRegistry_1.default.idToMetadata(settings['sync.target']);
            const statusStyle = Object.assign(Object.assign({}, theme.textStyle), { marginTop: 10 });
            const warningStyle = Object.assign(Object.assign({}, theme.textStyle), { color: theme.colorWarn });
            // Don't show the missing password warning if the user just changed the sync target (but hasn't
            // saved yet).
            const matchesSavedTarget = settings['sync.target'] === this.props.settings['sync.target'];
            if (matchesSavedTarget && (0, shouldShowMissingPasswordWarning_1.default)(settings['sync.target'], settings)) {
                settingComps.push(React.createElement("p", { key: 'missing-password-warning', style: warningStyle },
                    (0, locale_1._)('%s: Missing password.', (0, locale_1._)('Warning')),
                    ' ',
                    React.createElement(MissingPasswordHelpLink_1.default, { theme: theme, text: (0, locale_1._)('Help') })));
            }
            if (syncTargetMd.supportsConfigCheck) {
                const messages = shared.checkSyncConfigMessages(this);
                const statusComp = !messages.length ? null : (React.createElement("div", { style: statusStyle, "aria-live": 'polite' },
                    messages[0],
                    messages.length >= 1 ? React.createElement("p", null, messages[1]) : null));
                if (settings['sync.target'] === SyncTargetRegistry_1.default.nameToId('joplinCloud')) {
                    const goToJoplinCloudLogin = () => {
                        this.props.dispatch({
                            type: 'NAV_GO',
                            routeName: 'JoplinCloudLogin',
                        });
                    };
                    settingComps.push(React.createElement("div", { key: "connect_to_joplin_cloud_button", style: this.rowStyle_ },
                        React.createElement(Button_1.default, { title: (0, locale_1._)('Connect to Joplin Cloud'), level: Button_1.ButtonLevel.Primary, onClick: goToJoplinCloudLogin })));
                }
                if (settings['sync.target'] === SyncTargetRegistry_1.default.nameToId('joplinServerSaml')) {
                    const server = settings['sync.11.path'];
                    const goToSamlLogin = async () => {
                        // Save settings to allow SAML auth with the correct URL.
                        await shared.saveSettings(this);
                        this.props.dispatch({
                            type: 'NAV_GO',
                            routeName: 'JoplinServerSamlLogin',
                        });
                    };
                    settingComps.push(React.createElement("div", { key: "connect_to_joplin_server_saml_button", style: this.rowStyle_ },
                        React.createElement(Button_1.default, { title: (0, locale_1._)('Connect using your organisation account'), level: Button_1.ButtonLevel.Primary, onClick: goToSamlLogin, disabled: !server || (server === null || server === void 0 ? void 0 : server.trim().length) === 0 })));
                }
                settingComps.push(React.createElement("div", { key: "check_sync_config_button", style: this.rowStyle_ },
                    React.createElement(Button_1.default, { title: (0, locale_1._)('Check synchronisation configuration'), level: Button_1.ButtonLevel.Secondary, disabled: this.state.checkSyncConfigResult === 'checking', onClick: this.checkSyncConfig_ }),
                    statusComp));
            }
        }
        let advancedSettingsButton = null;
        const advancedSettingsSectionStyle = { display: 'none' };
        const advancedSettingsGroupId = `advanced_settings_${key}`;
        const advancedSettingsVisible = this.state.showAdvancedSettings || searchMode;
        if (advancedSettingComps.length) {
            if (!searchMode) {
                advancedSettingsButton = (React.createElement(ToggleAdvancedSettingsButton_1.default, { onClick: () => shared.advancedSettingsButton_click(this), advancedSettingsVisible: advancedSettingsVisible, "aria-controls": advancedSettingsGroupId }));
            }
            advancedSettingsSectionStyle.display = advancedSettingsVisible ? 'block' : 'none';
        }
        return (React.createElement("div", { key: key, style: sectionStyle },
            this.renderSectionDescription(section),
            React.createElement("div", null, settingComps),
            advancedSettingsButton,
            React.createElement("div", { style: advancedSettingsSectionStyle, id: advancedSettingsGroupId, role: 'group' }, advancedSettingComps)));
    }
    settingToComponent(key, value) {
        return (React.createElement(SettingComponent_1.default, { themeId: this.props.themeId, key: key, settingKey: key, value: value, fonts: this.state.fonts, onUpdateSettingValue: this.onUpdateSettingValue, onSettingButtonClick: this.handleSettingButton, renderSearchText: this.renderSearchHighlightedText }));
    }
    restartMessage() {
        return (0, locale_1._)('The application must be restarted for these changes to take effect.');
    }
    async restartApp() {
        await Setting_1.default.saveAll();
        await (0, restart_1.default)();
    }
    async checkNeedRestart() {
        if (this.state.needRestart) {
            const doItNow = await (0, bridge_1.default)().showConfirmMessageBox(this.restartMessage(), {
                buttons: [(0, locale_1._)('Do it now'), (0, locale_1._)('Later')],
            });
            if (doItNow)
                await this.restartApp();
        }
    }
    async onApplyClick() {
        const done = await shared.saveSettings(this);
        if (!done)
            return;
        await this.checkNeedRestart();
    }
    async onSaveClick() {
        const done = await shared.saveSettings(this);
        if (!done)
            return;
        await this.checkNeedRestart();
        this.props.dispatch({ type: 'NAV_BACK' });
    }
    onCancelClick() {
        this.props.dispatch({ type: 'NAV_BACK' });
    }
    hasChanges() {
        return !!this.state.changedSettingKeys.length;
    }
    render() {
        var _a, _b;
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const searchQuery = (0, config_search_text_js_1.normalizeQuery)(this.state.searchQuery);
        const searchMode = !!searchQuery;
        const sectionFilter = this.state.searchSectionFilter;
        const style = Object.assign(Object.assign({}, this.props.style), { overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: theme.backgroundColor3 });
        const settings = this.state.settings;
        const hasChanges = this.hasChanges();
        const settingComps = shared.settingsToComponents2(this, Setting_1.AppType.Desktop, settings, this.state.selectedSectionName);
        // screenComp is a custom config screen, such as the encryption config screen or keymap config screen.
        // These screens handle their own loading/saving of settings and have bespoke rendering.
        // When screenComp is null, it means we are viewing the regular settings.
        const screenComp = this.state.screenName ? React.createElement("div", { className: "config-screen-content-wrapper", style: { overflow: 'scroll', flex: 1 } }, this.screenFromName(this.state.screenName)) : null;
        const shouldHideSettingsContainer = !!screenComp && !searchMode;
        const sections = shared.settingsSections({ device: Setting_1.AppType.Desktop, settings });
        const searchResultGroupItems = (0, configSearch_1.searchResultGroups)(this.state.searchQuery, sections, Setting_1.AppType.Desktop);
        const matchedSections = (0, configSearch_1.matchedSearchSections)(sections, searchResultGroupItems);
        const hasValidSectionFilter = !!sectionFilter && matchedSections.some(group => group.section.name === sectionFilter);
        const filteredMatchedSections = hasValidSectionFilter ? matchedSections.filter(group => group.section.name === sectionFilter) : matchedSections;
        const needRestartComp = this.state.needRestart ? (React.createElement("div", { style: Object.assign(Object.assign({}, theme.textStyle), { padding: 10, paddingLeft: 24, backgroundColor: theme.warningBackgroundColor, color: theme.color }) },
            this.restartMessage(),
            React.createElement("a", { style: Object.assign(Object.assign({}, theme.urlStyle), { marginLeft: 10 }), href: "#", onClick: () => { void this.restartApp(); } }, (0, locale_1._)('Restart now')))) : null;
        const rightStyle = Object.assign(Object.assign({}, style), { flex: 1 });
        delete style.width;
        const tabComponents = [];
        if (searchMode) {
            const searchContent = filteredMatchedSections.map(({ section }) => {
                const sectionComp = section.isScreen ? (React.createElement("div", { className: 'search-message' }, (0, locale_1._)('This section opens in its own screen and is matched by section title.'))) : this.sectionToComponent(section.name, section, settings, true);
                if (!sectionComp)
                    return null;
                return (React.createElement("div", { key: `search-result-${section.name}` },
                    React.createElement("h2", { className: 'search-section-title' },
                        React.createElement("i", { className: Setting_1.default.sectionNameToIcon(section.name, Setting_1.AppType.Desktop), role: 'img', "aria-hidden": 'true' }),
                        this.renderSearchHighlightedText(Setting_1.default.sectionNameToLabel(section.name))),
                    sectionComp));
            });
            const noResultsMessage = filteredMatchedSections.length === 0 ? (React.createElement("div", { className: 'search-no-results' }, (0, locale_1._)('No matching results'))) : null;
            tabComponents.push(React.createElement("div", { key: 'setting-section-search-results', id: 'setting-section-search-results', className: 'setting-tab-panel', role: 'region', "aria-label": (0, locale_1._)('Search results') },
                React.createElement("div", { className: 'search-results' },
                    React.createElement("div", { "aria-live": 'polite', "aria-atomic": 'true', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' } }, filteredMatchedSections.length === 0 ? (0, locale_1._)('No matching results') : (0, locale_1._)('%d sections found', filteredMatchedSections.length)),
                    React.createElement("div", { className: 'search-filter-control' },
                        hasValidSectionFilter ?
                            (0, locale_1._)('Filtered by section [%s]', Setting_1.default.sectionNameToLabel(sectionFilter)) :
                            (0, locale_1._)('Showing all matching settings'),
                        hasValidSectionFilter ? (React.createElement("button", { type: 'button', className: 'link-button', onClick: () => {
                                this.setState({ searchSectionFilter: null });
                            } }, (0, locale_1._)('Show all results'))) : null),
                    searchContent,
                    noResultsMessage)));
        }
        else {
            for (const section of sections) {
                const sectionId = `setting-section-${section.name}`;
                let content = null;
                const visible = section.name === this.state.selectedSectionName;
                if (visible) {
                    content = (React.createElement(React.Fragment, null,
                        screenComp,
                        React.createElement("div", { className: `config-screen-settings-container ${shouldHideSettingsContainer ? 'hidden' : ''}` }, settingComps)));
                }
                tabComponents.push(React.createElement("div", { key: sectionId, id: sectionId, className: `setting-tab-panel ${!visible ? '-hidden' : ''}`, hidden: !visible, "aria-labelledby": `setting-tab-${section.name}`, tabIndex: 0, role: 'tabpanel' }, content));
            }
        }
        return (React.createElement("div", { className: "config-screen", role: "main", style: { display: 'flex', flexDirection: 'row', height: this.props.style.height } },
            React.createElement(Sidebar_1.default, { selection: searchMode ? ((_b = sectionFilter !== null && sectionFilter !== void 0 ? sectionFilter : (_a = matchedSections[0]) === null || _a === void 0 ? void 0 : _a.section.name) !== null && _b !== void 0 ? _b : this.state.selectedSectionName) : this.state.selectedSectionName, onSelectionChange: this.sidebar_selectionChange, sections: sections, searchQuery: this.state.searchQuery, onSearchQueryChange: this.onSearchQueryChange, onSearchButtonClick: this.onSearchButtonClick, searchResultGroups: searchResultGroupItems }),
            React.createElement("div", { style: rightStyle },
                needRestartComp,
                tabComponents,
                React.createElement(ButtonBar_1.default, { hasChanges: hasChanges, backButtonTitle: hasChanges && (!screenComp || searchMode) ? (0, locale_1._)('Cancel') : (0, locale_1._)('Back'), onCancelClick: this.onCancelClick, onSaveClick: screenComp && !searchMode ? undefined : this.onSaveClick, onApplyClick: screenComp && !searchMode ? undefined : this.onApplyClick }))));
    }
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
        settings: state.settings,
        locale: state.settings.locale,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(ConfigScreenComponent);
//# sourceMappingURL=ConfigScreen.js.map