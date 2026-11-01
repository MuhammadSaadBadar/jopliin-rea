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
const styles_1 = require("./styles");
const Button_1 = require("../Button/Button");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const Synchronizer_1 = __importDefault(require("@joplin/lib/Synchronizer"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const locale_1 = require("@joplin/lib/locale");
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const FolderAndTagList_1 = __importDefault(require("./FolderAndTagList"));
const syncCompletedWithoutError = (syncReport) => {
    return syncReport.completedTime && (!syncReport.errors || !syncReport.errors.length);
};
const SidebarComponent = (props) => {
    const renderSynchronizeButton = (type) => {
        var _a;
        const label = type === 'sync' ? (0, locale_1._)('Synchronise') : (0, locale_1._)('Cancel');
        const nothingToSync = type === 'sync' && !props.syncPending && syncCompletedWithoutError(props.syncReport);
        const syncHasErrors = type === 'sync' && !props.syncPending && !!((_a = props.syncReport.errors) === null || _a === void 0 ? void 0 : _a.length);
        const iconName = syncHasErrors ? 'fas fa-exclamation-triangle' : nothingToSync ? 'fas fa-check' : 'icon-sync';
        return (React.createElement(styles_1.StyledSynchronizeButton, { level: Button_1.ButtonLevel.SidebarSecondary, className: `sidebar-sync-button ${type === 'sync' ? '' : '-syncing'} ${nothingToSync ? '-synced' : ''} ${syncHasErrors ? '-error' : ''}`, iconName: iconName, iconLabel: syncHasErrors ? (0, locale_1._)('Synchronisation error') : undefined, key: "sync_button", title: label, onClick: () => {
                void CommandService_1.default.instance().execute('synchronize', type !== 'sync');
            } }));
    };
    const theme = (0, theme_1.themeStyle)(props.themeId);
    let decryptionReportText = '';
    if (props.decryptionWorker && props.decryptionWorker.state !== 'idle' && props.decryptionWorker.itemCount) {
        decryptionReportText = (0, locale_1._)('Decrypting items: %d/%d', props.decryptionWorker.itemIndex + 1, props.decryptionWorker.itemCount);
    }
    let resourceFetcherText = '';
    if (props.resourceFetcher && props.resourceFetcher.toFetchCount) {
        resourceFetcherText = (0, locale_1._)('Fetching resources: %d/%d', props.resourceFetcher.fetchingCount, props.resourceFetcher.toFetchCount);
    }
    const lines = Synchronizer_1.default.reportToLines(props.syncReport);
    if (resourceFetcherText)
        lines.push(resourceFetcherText);
    if (decryptionReportText)
        lines.push(decryptionReportText);
    const syncReportText = [];
    for (let i = 0; i < lines.length; i++) {
        syncReportText.push(React.createElement(styles_1.StyledSyncReportText, { key: i }, lines[i]));
    }
    const syncButton = renderSynchronizeButton(props.syncStarted ? 'cancel' : 'sync');
    const hasSyncReport = syncReportText.length > 0;
    const syncReportComp = !hasSyncReport || !props.syncReportIsVisible ? null : (React.createElement(styles_1.StyledSyncReport, { key: "sync_report", id: "sync-report" }, syncReportText));
    const syncReportToggle = (React.createElement("button", { className: "sync-report-toggle", style: { color: theme.color2 }, onClick: () => Setting_1.default.toggle('syncReportIsVisible'), "aria-label": (0, locale_1._)('Sync report'), "aria-expanded": props.syncReportIsVisible, "aria-controls": "sync-report" },
        React.createElement("i", { className: `fas fa-chevron-${props.syncReportIsVisible ? 'down' : 'up'}` })));
    return (React.createElement(styles_1.StyledRoot, { className: 'sidebar _scrollbar2', role: 'navigation', "aria-label": (0, locale_1._)('Sidebar') },
        React.createElement("div", { style: { flex: 1 } },
            React.createElement(FolderAndTagList_1.default, null)),
        React.createElement("div", { style: { flex: 0, padding: theme.mainPadding } },
            syncReportToggle,
            syncReportComp,
            syncButton)));
};
const mapStateToProps = (state) => {
    return {
        searches: state.searches,
        syncStarted: state.syncStarted,
        syncPending: state.syncPending,
        syncReport: state.syncReport,
        selectedSearchId: state.selectedSearchId,
        selectedSmartFilterId: state.selectedSmartFilterId,
        locale: state.settings.locale,
        themeId: state.settings.theme,
        collapsedFolderIds: state.collapsedFolderIds,
        decryptionWorker: state.decryptionWorker,
        resourceFetcher: state.resourceFetcher,
        syncReportIsVisible: state.settings.syncReportIsVisible,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(SidebarComponent);
//# sourceMappingURL=Sidebar.js.map