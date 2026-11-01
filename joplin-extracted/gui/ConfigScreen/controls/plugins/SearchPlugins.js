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
const SearchInput_1 = __importDefault(require("../../../lib/SearchInput/SearchInput"));
const styled_components_1 = __importDefault(require("styled-components"));
const AsyncActionQueue_1 = __importDefault(require("@joplin/lib/AsyncActionQueue"));
const PluginBox_1 = __importStar(require("./PluginBox"));
const PluginService_1 = __importDefault(require("@joplin/lib/services/plugins/PluginService"));
const locale_1 = require("@joplin/lib/locale");
const useOnInstallHandler_1 = __importDefault(require("@joplin/lib/components/shared/config/plugins/useOnInstallHandler"));
const theme_1 = require("@joplin/lib/theme");
const SettingDescription_1 = __importDefault(require("../SettingDescription"));
const Root = styled_components_1.default.div `
`;
const ResultsRoot = styled_components_1.default.div `
	display: flex;
	flex-wrap: wrap;
`;
function default_1(props) {
    const [searchStarted, setSearchStarted] = (0, react_1.useState)(false);
    const [manifests, setManifests] = (0, react_1.useState)([]);
    const asyncSearchQueue = (0, react_1.useRef)(new AsyncActionQueue_1.default(10));
    const [installingPluginsIds, setInstallingPluginIds] = (0, react_1.useState)({});
    const [searchResultCount, setSearchResultCount] = (0, react_1.useState)(null);
    const pluginSettingsRef = (0, react_1.useRef)(props.pluginSettings);
    pluginSettingsRef.current = props.pluginSettings;
    const onInstall = (0, useOnInstallHandler_1.default)(setInstallingPluginIds, pluginSettingsRef, props.repoApi, props.onPluginSettingsChange, false);
    (0, react_1.useEffect)(() => {
        setSearchResultCount(null);
        asyncSearchQueue.current.push(async () => {
            if (!props.searchQuery) {
                setManifests([]);
                setSearchResultCount(null);
            }
            else {
                const r = await props.repoApi().search(props.searchQuery);
                setManifests(r);
                setSearchResultCount(r.length);
            }
        });
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.searchQuery]);
    const onChange = (0, react_1.useCallback)((event) => {
        setSearchStarted(true);
        props.onSearchQueryChange(event);
    }, [props.onSearchQueryChange]);
    const onSearchButtonClick = (0, react_1.useCallback)(() => {
        setSearchStarted(false);
        props.onSearchQueryChange({ value: '' });
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
    function installState(pluginId) {
        const settings = props.pluginSettings[pluginId];
        if (settings && !settings.deleted)
            return PluginBox_1.InstallState.Installed;
        if (installingPluginsIds[pluginId])
            return PluginBox_1.InstallState.Installing;
        return PluginBox_1.InstallState.NotInstalled;
    }
    function renderResults(query, manifests) {
        if (query && !manifests.length) {
            if (searchResultCount === null)
                return ''; // Search in progress
            return React.createElement(SettingDescription_1.default, { text: (0, locale_1._)('No results') });
        }
        else {
            const output = [];
            for (const manifest of manifests) {
                output.push(React.createElement(PluginBox_1.default, { key: manifest.id, manifest: manifest, themeId: props.themeId, isCompatible: PluginService_1.default.instance().isCompatible(manifest), onInstall: onInstall, installState: installState(manifest.id) }));
            }
            return output;
        }
    }
    const renderContentSourceInfo = () => {
        if (props.repoApi().isUsingDefaultContentUrl)
            return null;
        const theme = (0, theme_1.themeStyle)(props.themeId);
        const url = new URL(props.repoApi().contentBaseUrl);
        return React.createElement("div", { style: Object.assign(Object.assign({}, theme.textStyleMinor), { marginTop: 5, fontSize: theme.fontSize }) }, (0, locale_1._)('Content provided by %s', url.hostname));
    };
    return (React.createElement(Root, null,
        React.createElement("div", { style: { marginBottom: 10, width: props.maxWidth } },
            React.createElement(SearchInput_1.default, { inputRef: null, value: props.searchQuery, onChange: onChange, onSearchButtonClick: onSearchButtonClick, searchStarted: searchStarted, placeholder: props.disabled ? (0, locale_1._)('Please wait...') : (0, locale_1._)('Search for plugins...'), disabled: props.disabled }),
            renderContentSourceInfo()),
        React.createElement(ResultsRoot, null, renderResults(props.searchQuery, manifests))));
}
//# sourceMappingURL=SearchPlugins.js.map