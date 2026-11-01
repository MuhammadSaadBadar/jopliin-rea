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
const Setting_1 = __importStar(require("@joplin/lib/models/Setting"));
const theme_1 = require("@joplin/lib/theme");
const React = __importStar(require("react"));
const react_1 = require("react");
const PluginsStates_1 = __importDefault(require("./plugins/PluginsStates"));
const GlobalHotkeyInput_1 = __importDefault(require("./GlobalHotkeyInput"));
const bridge_1 = __importDefault(require("../../../services/bridge"));
const locale_1 = require("@joplin/lib/locale");
const Button_1 = __importStar(require("../../Button/Button"));
const FontSearch_1 = __importDefault(require("./FontSearch"));
const pathUtils = __importStar(require("@joplin/lib/path-utils"));
const SettingLabel_1 = __importDefault(require("./SettingLabel"));
const SettingDescription_1 = __importDefault(require("./SettingDescription"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Each control component has different prop types
const settingKeyToControl = {
    'plugins.states': PluginsStates_1.default,
    'globalHotkey': GlobalHotkeyInput_1.default,
};
const SettingComponent = props => {
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const output = null;
    const updateSettingValue = (0, react_1.useCallback)((key, value) => {
        props.onUpdateSettingValue({ key, value });
    }, [props.onUpdateSettingValue]);
    const renderText = (0, react_1.useCallback)((text) => {
        if (!props.renderSearchText)
            return text;
        return props.renderSearchText(text);
    }, [props.renderSearchText]);
    const rowStyle = {
        marginBottom: theme.mainPadding * 1.5,
    };
    const controlStyle = {
        display: 'inline-block',
        color: theme.color,
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
    };
    const textInputBaseStyle = Object.assign(Object.assign({}, controlStyle), { fontFamily: theme.fontFamily, border: '1px solid', padding: '4px 6px', boxSizing: 'border-box', borderColor: theme.borderColor4, borderRadius: 3, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4 });
    const key = props.settingKey;
    const md = Setting_1.default.settingMetadata(key);
    const descriptionText = Setting_1.default.keyDescription(key, Setting_1.AppType.Desktop);
    const inputId = (0, react_1.useId)();
    const descriptionId = (0, react_1.useId)();
    const descriptionComp = React.createElement(SettingDescription_1.default, { id: descriptionId, text: descriptionText, renderText: renderText });
    if (key in settingKeyToControl) {
        const CustomSettingComponent = settingKeyToControl[key];
        const label = md.label ? React.createElement(SettingLabel_1.default, { text: md.label(), htmlFor: null, renderText: renderText }) : null;
        return (React.createElement("div", { style: rowStyle },
            label,
            React.createElement(SettingDescription_1.default, { id: descriptionId, text: md.description ? md.description(Setting_1.AppType.Desktop) : null, renderText: renderText }),
            React.createElement(CustomSettingComponent, { value: props.value, themeId: props.themeId, onChange: (event) => {
                    updateSettingValue(key, event.value);
                } })));
    }
    else if (md.isEnum) {
        const value = props.value;
        const items = [];
        const settingOptions = md.options();
        const array = Setting_1.default.enumOptionsToValueLabels(settingOptions, md.optionsOrder ? md.optionsOrder() : [], {
            valueKey: 'key',
            labelKey: 'label',
        });
        for (let i = 0; i < array.length; i++) {
            const e = array[i];
            items.push(React.createElement("option", { value: e.key.toString(), key: e.key }, settingOptions[e.key]));
        }
        return (React.createElement("div", { style: rowStyle },
            React.createElement(SettingLabel_1.default, { htmlFor: inputId, text: md.label(), renderText: renderText }),
            React.createElement("select", { value: value, className: 'setting-select-control', onChange: (event) => {
                    updateSettingValue(key, event.target.value);
                }, id: inputId, "aria-describedby": descriptionId }, items),
            descriptionComp));
    }
    else if (md.type === Setting_1.default.TYPE_BOOL) {
        const value = props.value;
        const checkboxSize = theme.fontSize * 1.1666666666666;
        return (React.createElement("div", { style: rowStyle },
            React.createElement("div", { style: Object.assign(Object.assign({}, controlStyle), { backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }) },
                React.createElement("input", { id: inputId, type: "checkbox", checked: !!value, onChange: event => updateSettingValue(key, event.target.checked), style: { marginLeft: 0, width: checkboxSize, height: checkboxSize }, "aria-details": descriptionId }),
                React.createElement("label", { className: 'setting-label -for-checkbox', htmlFor: inputId }, renderText(md.label()))),
            descriptionComp));
    }
    else if (md.type === Setting_1.default.TYPE_STRING) {
        const value = props.value;
        const inputStyle = Object.assign(Object.assign({}, textInputBaseStyle), { width: '50%', minWidth: '20em' });
        const inputType = md.secure === true ? 'password' : 'text';
        if (md.subType === 'file_path_and_args' || md.subType === 'file_path' || md.subType === 'directory_path') {
            inputStyle.marginBottom = theme.mainPadding / 2;
            const splitCmd = (cmdString) => {
                // Normally not necessary but certain plugins found a way to
                // set the set the value to "undefined", leading to a crash.
                // This is now fixed at the model level but to be sure we
                // check here too, to handle any already existing data.
                // https://github.com/laurent22/joplin/issues/7621
                if (!cmdString)
                    cmdString = '';
                const path = pathUtils.extractExecutablePath(cmdString);
                const args = cmdString.substr(path.length + 1);
                return [pathUtils.unquotePath(path), args];
            };
            const joinCmd = (cmdArray) => {
                if (!cmdArray[0] && !cmdArray[1])
                    return '';
                let cmdString = pathUtils.quotePath(cmdArray[0]);
                if (!cmdString)
                    cmdString = '""';
                if (cmdArray[1])
                    cmdString += ` ${cmdArray[1]}`;
                return cmdString;
            };
            const onPathChange = event => {
                if (md.subType === 'file_path_and_args') {
                    const cmd = splitCmd(value);
                    cmd[0] = event.target.value;
                    updateSettingValue(key, joinCmd(cmd));
                }
                else {
                    updateSettingValue(key, event.target.value);
                }
            };
            const onArgsChange = event => {
                const cmd = splitCmd(value);
                cmd[1] = event.target.value;
                updateSettingValue(key, joinCmd(cmd));
            };
            const browseButtonClick = async () => {
                if (md.subType === 'directory_path') {
                    const paths = await (0, bridge_1.default)().showOpenDialog({
                        properties: ['openDirectory'],
                    });
                    if (!paths || !paths.length)
                        return;
                    updateSettingValue(key, paths[0]);
                }
                else {
                    const paths = await (0, bridge_1.default)().showOpenDialog();
                    if (!paths || !paths.length)
                        return;
                    if (md.subType === 'file_path') {
                        updateSettingValue(key, paths[0]);
                    }
                    else {
                        const cmd = splitCmd(value);
                        cmd[0] = paths[0];
                        updateSettingValue(key, joinCmd(cmd));
                    }
                }
            };
            const cmd = splitCmd(value);
            const path = md.subType === 'file_path_and_args' ? cmd[0] : value;
            const argInputId = `setting_path_arg_${key}`;
            const argComp = md.subType !== 'file_path_and_args' ? null : (React.createElement("div", { style: Object.assign(Object.assign({}, rowStyle), { marginBottom: 5 }) },
                React.createElement("label", { className: 'setting-label -sub-label', htmlFor: argInputId }, (0, locale_1._)('Arguments:')),
                React.createElement("input", { type: inputType, style: inputStyle, onChange: onArgsChange, value: cmd[1], spellCheck: false, id: argInputId, "aria-describedby": descriptionId }),
                React.createElement("div", { style: { width: inputStyle.width, minWidth: inputStyle.minWidth } }, descriptionComp)));
            const pathDescriptionId = `setting_path_label_${key}`;
            return (React.createElement("div", { style: rowStyle },
                React.createElement(SettingLabel_1.default, { text: md.label(), htmlFor: inputId, renderText: renderText }),
                React.createElement("div", { style: { display: 'flex' } },
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: Object.assign(Object.assign({}, rowStyle), { marginBottom: 5 }) },
                            React.createElement("div", { className: 'setting-label -sub-label', id: pathDescriptionId }, (0, locale_1._)('Path:')),
                            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: inputStyle.marginBottom } },
                                React.createElement("input", { type: inputType, style: Object.assign(Object.assign({}, inputStyle), { marginBottom: 0, marginRight: 5 }), onChange: onPathChange, value: path, spellCheck: false, id: inputId, "aria-describedby": pathDescriptionId, "aria-details": descriptionId }),
                                React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Secondary, title: (0, locale_1._)('Browse...'), onClick: browseButtonClick, size: Button_1.ButtonSize.Small })),
                            React.createElement("div", { style: { width: inputStyle.width, minWidth: inputStyle.minWidth } }, descriptionComp)))),
                argComp));
        }
        else {
            const onTextChange = event => {
                updateSettingValue(key, event.target.value);
            };
            return (React.createElement("div", { style: rowStyle },
                React.createElement(SettingLabel_1.default, { text: md.label(), htmlFor: inputId, renderText: renderText }),
                md.subType === Setting_1.SettingItemSubType.FontFamily || md.subType === Setting_1.SettingItemSubType.MonospaceFontFamily ?
                    React.createElement(FontSearch_1.default, { type: inputType, style: inputStyle, value: props.value, availableFonts: props.fonts, onChange: fontFamily => updateSettingValue(key, fontFamily), subtype: md.subType, inputId: inputId }) :
                    React.createElement("input", { type: inputType, style: inputStyle, value: props.value, onChange: onTextChange, spellCheck: false, id: inputId, "aria-describedby": descriptionId }),
                React.createElement("div", { style: { width: inputStyle.width, minWidth: inputStyle.minWidth } }, descriptionComp)));
        }
    }
    else if (md.type === Setting_1.default.TYPE_INT) {
        const value = props.value;
        const onNumChange = (event) => {
            updateSettingValue(key, event.target.value);
        };
        const label = [md.label()];
        if (md.unitLabel)
            label.push(`(${md.unitLabel(md.value)})`);
        return (React.createElement("div", { style: rowStyle },
            React.createElement(SettingLabel_1.default, { htmlFor: inputId, text: label.join(' '), renderText: renderText }),
            React.createElement("input", { type: "number", style: textInputBaseStyle, value: value, onChange: onNumChange, min: md.minimum, max: md.maximum, step: md.step, spellCheck: false, id: inputId, "aria-describedby": descriptionId }),
            descriptionComp));
    }
    else if (md.type === Setting_1.default.TYPE_BUTTON) {
        const labelComp = md.hideLabel ? null : (React.createElement(SettingLabel_1.default, { text: md.label(), htmlFor: null, renderText: renderText }));
        return (React.createElement("div", { style: rowStyle },
            labelComp,
            React.createElement(Button_1.default, { level: Button_1.ButtonLevel.Secondary, title: md.label(), onClick: md.onClick ? md.onClick : () => props.onSettingButtonClick(key) }),
            descriptionComp));
    }
    else {
        console.warn(`Type not implemented: ${key}`);
    }
    return output;
};
exports.default = SettingComponent;
//# sourceMappingURL=SettingComponent.js.map