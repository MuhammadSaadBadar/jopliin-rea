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
exports.KeymapConfigScreen = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const ShortcutRecorder_1 = require("./ShortcutRecorder");
const getLabel_1 = __importDefault(require("./utils/getLabel"));
const useKeymap_1 = __importDefault(require("./utils/useKeymap"));
const useCommandStatus_1 = __importDefault(require("./utils/useCommandStatus"));
const styles_1 = __importDefault(require("./styles"));
const locale_1 = require("@joplin/lib/locale");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const bridge_1 = __importDefault(require("../../services/bridge"));
const keymapService = KeymapService_1.default.instance();
const KeymapConfigScreen = ({ themeId }) => {
    const styles = (0, styles_1.default)(themeId);
    const [filter, setFilter] = (0, react_1.useState)('');
    const [keymapItems, keymapError, overrideKeymapItems, setAccelerator, resetAccelerator] = (0, useKeymap_1.default)();
    const [recorderError, setRecorderError] = (0, react_1.useState)(null);
    const [editing, enableEditing, disableEditing] = (0, useCommandStatus_1.default)();
    const handleSave = (event) => {
        const { commandName, accelerator } = event;
        setAccelerator(commandName, accelerator);
        disableEditing(commandName);
    };
    const handleReset = (event) => {
        const { commandName } = event;
        resetAccelerator(commandName);
        disableEditing(commandName);
    };
    const handleCancel = (event) => {
        const { commandName } = event;
        disableEditing(commandName);
    };
    const handleError = (event) => {
        const { recorderError } = event;
        setRecorderError(recorderError);
    };
    const handleImport = async () => {
        const filePath = await (0, bridge_1.default)().showOpenDialog({
            properties: ['openFile'],
            defaultPath: 'keymap-desktop',
            filters: [{ name: 'Joplin Keymaps (keymap-desktop.json)', extensions: ['json'] }],
        });
        if (filePath && filePath.length !== 0) {
            const actualFilePath = filePath[0];
            try {
                const keymapFile = await shim_1.default.fsDriver().readFile(actualFilePath, 'utf-8');
                overrideKeymapItems(JSON.parse(keymapFile));
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Error: %s', error.message));
            }
        }
    };
    const handleExport = async () => {
        const filePath = await (0, bridge_1.default)().showSaveDialog({
            defaultPath: 'keymap-desktop',
            filters: [{ name: 'Joplin Keymaps (keymap-desktop.json)', extensions: ['json'] }],
        });
        if (filePath) {
            try {
                // KeymapService is already synchronized with the in-state keymap
                await keymapService.saveCustomKeymap(filePath);
            }
            catch (error) {
                (0, bridge_1.default)().showErrorMessageBox(error.message);
            }
        }
    };
    const renderAccelerator = (accelerator) => {
        return (React.createElement("div", null, accelerator.split('+').map(part => React.createElement("kbd", { style: styles.kbd, key: part }, part)).reduce((accumulator, part) => (accumulator.length ? [...accumulator, ' + ', part] : [part]), [])));
    };
    const renderStatus = (commandName) => {
        if (!editing[commandName]) {
            const editLabel = (0, locale_1._)('Change shortcut for "%s"', (0, getLabel_1.default)(commandName));
            return React.createElement("i", { className: "fa fa-pen", role: 'img', "aria-label": editLabel, title: editLabel });
        }
        else if (recorderError) {
            return React.createElement("i", { className: "fa fa-exclamation-triangle", role: 'img', "aria-label": recorderError.message, title: recorderError.message });
        }
        return null;
    };
    const renderError = (error) => {
        return (React.createElement("div", { style: Object.assign(Object.assign({}, styles.warning), { position: 'absolute', top: 0 }) },
            React.createElement("p", { style: styles.text },
                React.createElement("span", null, error.message))));
    };
    const renderKeymapRow = ({ command, accelerator }) => {
        const handleClick = () => {
            if (!editing[command]) {
                enableEditing(command);
            }
            else if (recorderError) {
                void (0, bridge_1.default)().showErrorMessageBox(recorderError.message);
            }
        };
        const statusContent = renderStatus(command);
        const cellContent = React.createElement("div", { className: 'keymap-shortcut-row-content' },
            editing[command] ?
                React.createElement(ShortcutRecorder_1.ShortcutRecorder, { onSave: handleSave, onReset: handleReset, onCancel: handleCancel, onError: handleError, initialAccelerator: accelerator || '' /* Because accelerator is null if disabled */, commandName: command, themeId: themeId }) :
                React.createElement("div", { style: styles.tableCellContent, onClick: handleClick }, accelerator
                    ? renderAccelerator(accelerator)
                    : React.createElement("div", { style: styles.disabled }, (0, locale_1._)('Disabled'))),
            React.createElement("button", { className: `flat-button edit ${editing[command] ? '-editing' : ''}`, style: styles.tableCellStatus, "aria-live": recorderError ? 'polite' : null, tabIndex: statusContent ? 0 : -1, onClick: handleClick }, statusContent));
        return (React.createElement("tr", { key: command },
            React.createElement("td", { style: styles.tableCommandColumn }, (0, getLabel_1.default)(command)),
            React.createElement("td", { style: styles.tableShortcutColumn }, cellContent)));
    };
    return (React.createElement("div", null,
        keymapError && renderError(keymapError),
        React.createElement("div", { style: styles.container },
            React.createElement("div", { style: styles.actionsContainer },
                React.createElement("input", { value: filter, onChange: event => setFilter(event.target.value), placeholder: (0, locale_1._)('Search...'), style: styles.filterInput }),
                React.createElement("button", { style: styles.inlineButton, onClick: handleImport }, (0, locale_1._)('Import')),
                React.createElement("button", { style: styles.inlineButton, onClick: handleExport }, (0, locale_1._)('Export'))),
            React.createElement("table", { style: styles.table },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: styles.tableCommandColumn }, (0, locale_1._)('Command')),
                        React.createElement("th", { style: styles.tableShortcutColumn }, (0, locale_1._)('Keyboard Shortcut')))),
                React.createElement("tbody", null, keymapItems.filter(({ command }) => {
                    const filterLowerCase = filter.toLowerCase();
                    return (command.toLowerCase().includes(filterLowerCase) || (0, getLabel_1.default)(command).toLowerCase().includes(filterLowerCase));
                }).map(item => renderKeymapRow(item)))))));
};
exports.KeymapConfigScreen = KeymapConfigScreen;
//# sourceMappingURL=KeymapConfigScreen.js.map