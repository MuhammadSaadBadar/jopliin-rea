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
const locale_1 = require("@joplin/lib/locale");
const theme_1 = require("@joplin/lib/theme");
const creatable_1 = __importDefault(require("react-select/creatable"));
const react_select_1 = __importDefault(require("react-select"));
const animated_1 = __importDefault(require("react-select/animated"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const time_1 = require("@joplin/utils/time");
const light_1 = __importDefault(require("@joplin/lib/themes/light"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- State holds the current answer which mirrors the heterogeneous defaultValue type
class PromptDialog extends React.Component {
    constructor(props) {
        super(props);
        this.menuIsOpened_ = false;
        this.answerInput_ = React.createRef();
        this.select_menuOpen = this.select_menuOpen.bind(this);
        this.select_menuClose = this.select_menuClose.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.setState({
            visible: false,
            answer: this.props.defaultValue ? this.props.defaultValue : '',
        });
        this.focusInput_ = true;
        this.menuIsOpened_ = false;
    }
    UNSAFE_componentWillReceiveProps(newProps) {
        if ('visible' in newProps && newProps.visible !== this.props.visible) {
            this.setState({ visible: newProps.visible });
            if (newProps.visible)
                this.focusInput_ = true;
        }
        if ('defaultValue' in newProps && newProps.defaultValue !== this.props.defaultValue) {
            this.setState({ answer: newProps.defaultValue });
        }
    }
    select_menuOpen() {
        this.menuIsOpened_ = true;
    }
    select_menuClose() {
        this.menuIsOpened_ = false;
    }
    componentDidUpdate() {
        if (this.focusInput_ && this.answerInput_.current)
            (0, focusHandler_1.focus)('PromptDialog::componentDidUpdate', this.answerInput_.current);
        this.focusInput_ = false;
    }
    styles(themeId, visible) {
        const styleKey = `${themeId}_${visible}`;
        if (styleKey === this.styleKey_)
            return this.styles_;
        const theme = (0, theme_1.themeStyle)(themeId);
        this.styleKey_ = styleKey;
        this.styles_ = {};
        this.styles_.button = {
            minWidth: theme.buttonMinWidth,
            minHeight: theme.buttonMinHeight,
            marginLeft: 5,
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            border: '1px solid',
            borderColor: theme.dividerColor,
        };
        this.styles_.label = {
            marginRight: 5,
            fontSize: theme.fontSize,
            color: theme.color,
            fontFamily: theme.fontFamily,
            verticalAlign: 'middle',
        };
        this.styles_.input = {
            width: 'calc(0.5 * var(--prompt-width))',
            maxWidth: 400,
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            border: '1px solid',
            borderColor: theme.dividerColor,
        };
        // The button to change the date/time cannot be customized easily so we need to use the
        // light theme for that particular component.
        this.styles_.dateTimeInput = Object.assign(Object.assign({}, this.styles_.input), { color: light_1.default.color, backgroundColor: light_1.default.backgroundColor, borderColor: light_1.default.dividerColor });
        this.styles_.select = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
            control: (provided) => {
                return Object.assign(Object.assign({}, provided), { minWidth: 'calc(var(--prompt-width) * 0.2)', maxWidth: 'calc(var(--prompt-width) * 0.5)', fontFamily: theme.fontFamily });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
            input: (provided) => {
                return Object.assign(Object.assign({}, provided), { minWidth: '20px', color: theme.color });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
            menu: (provided) => {
                return Object.assign(Object.assign({}, provided), { color: theme.color, fontFamily: theme.fontFamily, backgroundColor: theme.backgroundColor });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
            option: (provided, state) => {
                return Object.assign(Object.assign({}, provided), { color: theme.color, fontFamily: theme.fontFamily, paddingLeft: `${10 + (state.data.indentDepth || 0) * 20}px` });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
            multiValueLabel: (provided) => {
                return Object.assign(Object.assign({}, provided), { fontFamily: theme.fontFamily });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
            multiValueRemove: (provided) => {
                return Object.assign(Object.assign({}, provided), { color: theme.color });
            },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- react-select style/theme factories take the library's own provided styles; tightening would require importing each StyleConfig generic
        this.styles_.selectTheme = (tagTheme) => {
            return Object.assign(Object.assign({}, tagTheme), { borderRadius: 2, colors: Object.assign(Object.assign({}, tagTheme.colors), { primary: theme.raisedBackgroundColor, primary25: theme.raisedBackgroundColor, neutral0: theme.backgroundColor, neutral5: theme.backgroundColor, neutral10: theme.raisedBackgroundColor, neutral20: theme.raisedBackgroundColor, neutral30: theme.raisedBackgroundColor, neutral40: theme.color, neutral50: theme.color, neutral60: theme.color, neutral70: theme.color, neutral80: theme.color, neutral90: theme.color, danger: theme.backgroundColor, dangerLight: theme.colorError2 }) });
        };
        this.styles_.desc = Object.assign(Object.assign({}, theme.textStyle), { marginTop: 10 });
        return this.styles_;
    }
    render() {
        if (!this.state.visible)
            return null;
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const buttonTypes = this.props.buttons ? this.props.buttons : ['ok', 'cancel'];
        const styles = this.styles(this.props.themeId, this.state.visible);
        const onClose = (accept, buttonType = null) => {
            if (this.props.onClose) {
                let outputAnswer = this.state.answer;
                if (this.props.inputType === 'datetime') {
                    outputAnswer = (0, time_1.isValidDate)(outputAnswer) ? (0, time_1.formatDateTimeLocalToMs)(outputAnswer) : null;
                }
                this.props.onClose(accept ? outputAnswer : null, buttonType);
            }
            this.setState({ visible: false, answer: '' });
        };
        const onChange = (event) => {
            this.setState({ answer: event.target.value });
        };
        // const anythingToDate = (o) => {
        // 	if (o && o.toDate) return o.toDate();
        // 	if (!o) return null;
        // 	let m = moment(o, time.dateTimeFormat());
        // 	if (m.isValid()) return m.toDate();
        // 	m = moment(o, time.dateFormat());
        // 	return m.isValid() ? m.toDate() : null;
        // }
        const onSelectChange = (newValue) => {
            this.setState({ answer: newValue });
            this.focusInput_ = true;
        };
        const onKeyDown = (event) => {
            if (event.key === 'Enter') {
                // If the dropdown is open, we don't close the dialog - instead
                // the currently item will be selected. If it is closed however
                // we confirm the dialog.
                if ((this.props.inputType === 'tags' || this.props.inputType === 'dropdown') && this.menuIsOpened_) {
                    // Do nothing
                }
                else {
                    onClose(true);
                }
            }
            else if (event.key === 'Escape') {
                // react-select calls preventDefault() on the Escape keydown
                // event, which prevents the native <dialog> cancel event from
                // firing. We handle Escape explicitly here to ensure the dialog
                // can be closed with the Escape key.
                if ((this.props.inputType === 'tags' || this.props.inputType === 'dropdown') && this.menuIsOpened_) {
                    // Let react-select close the dropdown menu
                }
                else {
                    onClose(false, 'cancel');
                }
            }
        };
        const descComp = this.props.description ? React.createElement("div", { style: styles.desc }, this.props.description) : null;
        let inputComp = null;
        if (this.props.inputType === 'datetime') {
            inputComp = React.createElement("input", { defaultValue: this.state.answer, onChange: onChange, type: "datetime-local", className: 'datetime-picker', style: styles.dateTimeInput });
        }
        else if (this.props.inputType === 'tags') {
            const uniqueAutocomplete = [];
            const seenLabels = new Set();
            const autocompleteOptions = this.props.autocomplete || [];
            for (const option of autocompleteOptions) {
                const key = (option.label || '').trim().normalize('NFC').toLowerCase();
                if (!seenLabels.has(key)) {
                    uniqueAutocomplete.push(option);
                    seenLabels.add(key);
                }
            }
            inputComp = React.createElement(creatable_1.default, { className: "tag-selector", onMenuOpen: this.select_menuOpen, onMenuClose: this.select_menuClose, styles: styles.select, theme: styles.selectTheme, ref: this.answerInput_, value: this.state.answer, placeholder: "", 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- makeAnimated's generic doesn't unify with react-select's expected SelectComponents shape
                components: (0, animated_1.default)(), isMulti: true, isClearable: false, backspaceRemovesValue: true, options: uniqueAutocomplete, onChange: onSelectChange, onKeyDown: onKeyDown, filterOption: (option, rawInput) => {
                    const input = (rawInput || '').trim().normalize('NFC').toLowerCase();
                    const label = (option.label || '').trim().normalize('NFC').toLowerCase();
                    return label.includes(input);
                }, isValidNewOption: (inputValue, _selectValue, selectOptions) => {
                    const input = (inputValue || '').trim().normalize('NFC').toLowerCase();
                    if (!input)
                        return false;
                    // If it matches an existing option (case-insensitive + normalized), it's not a valid "new" option
                    const exists = selectOptions.some(option => {
                        return (option.label || '').trim().normalize('NFC').toLowerCase() === input;
                    });
                    return !exists;
                } });
        }
        else if (this.props.inputType === 'dropdown') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- makeAnimated's generic doesn't unify with react-select's expected SelectComponents shape
            inputComp = React.createElement(react_select_1.default, { className: "item-selector", onMenuOpen: this.select_menuOpen, onMenuClose: this.select_menuClose, styles: styles.select, theme: styles.selectTheme, ref: this.answerInput_, components: (0, animated_1.default)(), value: this.props.answer, defaultValue: this.props.defaultValue, isClearable: false, options: this.props.autocomplete, onChange: onSelectChange, onKeyDown: onKeyDown });
        }
        else {
            inputComp = React.createElement("input", { style: styles.input, ref: this.answerInput_, value: this.state.answer, type: "text", onChange: event => onChange(event), onKeyDown: event => onKeyDown(event) });
        }
        const buttonComps = [];
        if (buttonTypes.indexOf('create') >= 0) {
            buttonComps.push(React.createElement("button", { key: "create", disabled: !this.state.answer, style: styles.button, onClick: () => onClose(true, 'create') }, (0, locale_1._)('Create')));
        }
        if (buttonTypes.indexOf('ok') >= 0) {
            buttonComps.push(React.createElement("button", { key: "ok", disabled: !this.state.answer, style: styles.button, onClick: () => onClose(true, 'ok') }, (0, locale_1._)('OK')));
        }
        if (buttonTypes.indexOf('cancel') >= 0) {
            buttonComps.push(React.createElement("button", { key: "cancel", style: styles.button, onClick: () => onClose(false, 'cancel') }, (0, locale_1._)('Cancel')));
        }
        if (buttonTypes.indexOf('clear') >= 0) {
            buttonComps.push(React.createElement("button", { key: "clear", style: styles.button, onClick: () => onClose(false, 'clear') }, (0, locale_1._)('Clear')));
        }
        return (React.createElement(Dialog_1.default, { className: 'prompt-dialog', contentStyle: styles.dialog, onCancel: () => onClose(false, 'cancel') },
            React.createElement("label", { style: styles.label }, this.props.label ? this.props.label : ''),
            React.createElement("div", { style: { display: 'inline-block', color: 'black', backgroundColor: theme.backgroundColor } },
                inputComp,
                descComp),
            React.createElement("div", { style: { textAlign: 'right', marginTop: 10 } }, buttonComps)));
    }
}
exports.default = PromptDialog;
//# sourceMappingURL=PromptDialog.js.map