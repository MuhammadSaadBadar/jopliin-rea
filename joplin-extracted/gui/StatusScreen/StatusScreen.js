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
const ButtonBar_1 = __importDefault(require("../ConfigScreen/ButtonBar"));
const locale_1 = require("@joplin/lib/locale");
const react_redux_1 = require("react-redux");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const theme_1 = require("@joplin/lib/theme");
const ReportService_1 = __importDefault(require("@joplin/lib/services/ReportService"));
const Button_1 = __importStar(require("../Button/Button"));
const bridge_1 = __importDefault(require("../../services/bridge"));
const styled_components_1 = __importDefault(require("styled-components"));
const fs_1 = require("fs");
const StyledAdvancedToolItem = styled_components_1.default.div `
	margin-bottom: 1em;
`;
async function exportDebugReportClick() {
    const filename = `syncReport-${new Date().getTime()}.csv`;
    const filePath = await (0, bridge_1.default)().showSaveDialog({
        title: (0, locale_1._)('Please select where the sync status should be exported to'),
        defaultPath: filename,
    });
    if (!filePath)
        return;
    const service = new ReportService_1.default();
    const csv = (await service.basicItemList({ format: 'csv' }));
    await (0, fs_1.writeFileSync)(filePath, csv);
}
function StatusScreen(props) {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [report, setReport] = (0, react_1.useState)([]);
    async function refreshScreen() {
        setLoading(true);
        try {
            const service = new ReportService_1.default();
            const r = await service.status(Setting_1.default.value('sync.target'));
            setReport(r);
        }
        finally {
            setLoading(false);
        }
    }
    (0, react_1.useEffect)(() => {
        void refreshScreen();
    }, []);
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const style = Object.assign(Object.assign({}, props.style), { display: 'flex', flexDirection: 'column' });
    const inlineLinkStyle = Object.assign(Object.assign({}, theme.urlStyle), { marginLeft: 5 });
    const retryAllStyle = Object.assign(Object.assign({}, theme.urlStyle), { marginTop: 5, display: 'inline-block' });
    const containerPadding = theme.configScreenPadding;
    const containerStyle = Object.assign(Object.assign({}, theme.containerStyle), { padding: containerPadding, flex: 1 });
    function renderSectionTitle(key, title) {
        return (React.createElement("h2", { key: `section_${key}`, style: theme.h2Style }, title));
    }
    function renderSectionRetryAll(key, retryAllHandler) {
        return (React.createElement("a", { key: `retry_all_${key}`, href: "#", onClick: retryAllHandler, style: retryAllStyle }, (0, locale_1._)('Retry All')));
    }
    const renderRetryAll = (key, section) => {
        const items = [];
        if (section.canRetryAll) {
            items.push(renderSectionRetryAll(`${key}_${section.title}`, async () => {
                await section.retryAllHandler();
                void refreshScreen();
            }));
        }
        return items;
    };
    const renderSection = (key, section) => {
        let items = [];
        items.push(renderSectionTitle(section.title, section.title));
        items = items.concat(renderRetryAll('top', section));
        let currentListKey = '';
        let listItems = [];
        for (const n in section.body) {
            if (!section.body.hasOwnProperty(n))
                continue;
            const item = section.body[n];
            let text = '';
            let ignoreLink = null;
            let retryLink = null;
            let itemType = null;
            if (typeof item === 'object') {
                if (item.canIgnore) {
                    const onClick = async () => {
                        await item.ignoreHandler();
                        void refreshScreen();
                    };
                    ignoreLink = (React.createElement("a", { href: "#", onClick: onClick, style: inlineLinkStyle }, (0, locale_1._)('Ignore')));
                }
                if (item.canRetry) {
                    const onClick = async () => {
                        await item.retryHandler();
                        void refreshScreen();
                    };
                    retryLink = (React.createElement("a", { href: "#", onClick: onClick, style: inlineLinkStyle }, (0, locale_1._)('Retry')));
                }
                text = item.text;
                itemType = item.type;
            }
            else {
                text = item;
            }
            if (itemType === 'openList') {
                currentListKey = item.key;
                continue;
            }
            if (itemType === 'closeList') {
                items.push(React.createElement("ul", { key: currentListKey }, listItems));
                currentListKey = '';
                listItems = [];
                continue;
            }
            if (!text)
                text = '\xa0';
            const actionLinks = React.createElement(React.Fragment, null,
                ignoreLink,
                " ",
                retryLink);
            if (currentListKey) {
                listItems.push(React.createElement("li", { style: theme.textStyle, key: `item_${n}` },
                    React.createElement("span", null, text),
                    actionLinks));
            }
            else {
                items.push(React.createElement("div", { style: theme.textStyle, key: `item_${n}` },
                    React.createElement("span", null, text),
                    actionLinks));
            }
        }
        items = items.concat(renderRetryAll('bottom', section));
        return React.createElement("div", { key: key }, items);
    };
    function renderBody(report) {
        const sections = [];
        for (let i = 0; i < report.length; i++) {
            const section = report[i];
            if (!section.body.length)
                continue;
            sections.push(renderSection(`${i}`, section));
        }
        return React.createElement("div", null, sections);
    }
    function renderTools() {
        return (React.createElement("div", null,
            React.createElement("h2", { key: "section_tools", style: theme.h2Style }, (0, locale_1._)('Advanced tools')),
            React.createElement(StyledAdvancedToolItem, null,
                React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Primary, title: (0, locale_1._)('Export debug report'), onClick: () => exportDebugReportClick() }))));
    }
    const body = renderBody(report);
    return (React.createElement("div", { style: style },
        React.createElement("div", { style: containerStyle },
            renderTools(),
            loading && React.createElement("p", null,
                React.createElement("span", { className: 'loading-animation' }),
                " ",
                (0, locale_1._)('Loading...')),
            body),
        React.createElement(ButtonBar_1.default, { onCancelClick: () => props.dispatch({ type: 'NAV_BACK' }) })));
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
        settings: state.settings,
        locale: state.settings.locale,
    };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(StatusScreen);
//# sourceMappingURL=StatusScreen.js.map