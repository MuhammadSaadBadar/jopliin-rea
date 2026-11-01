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
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = require("@joplin/lib/models/Setting");
const InlineCombobox_1 = __importDefault(require("../../InlineCombobox"));
const FontSearch = (props) => {
    const { type, style, value, availableFonts, onChange, subtype } = props;
    const [filteredAvailableFonts, setFilteredAvailableFonts] = (0, react_1.useState)(availableFonts);
    const [isMonoBoxChecked, setIsMonoBoxChecked] = (0, react_1.useState)(false);
    const isLoadingFonts = filteredAvailableFonts.length === 0;
    (0, react_1.useEffect)(() => {
        if (subtype === Setting_1.SettingItemSubType.MonospaceFontFamily) {
            setIsMonoBoxChecked(true);
        }
    }, [subtype]);
    (0, react_1.useEffect)(() => {
        if (!isMonoBoxChecked)
            return setFilteredAvailableFonts(availableFonts);
        const localMonospacedFonts = availableFonts.filter((font) => monospaceKeywords.some((word) => font.toLowerCase().includes(word)) ||
            knownMonospacedFonts.includes(font.toLowerCase()));
        setFilteredAvailableFonts(localMonospacedFonts);
    }, [isMonoBoxChecked, availableFonts]);
    const handleMonoBoxCheck = (0, react_1.useCallback)(() => {
        setIsMonoBoxChecked(!isMonoBoxChecked);
    }, [isMonoBoxChecked]);
    const comboboxControls = React.createElement(React.Fragment, null,
        isLoadingFonts ? (0, locale_1._)('Loading...') : null,
        React.createElement("div", { className: 'monospace-checkbox' },
            React.createElement("input", { type: 'checkbox', checked: isMonoBoxChecked, onChange: handleMonoBoxCheck, id: `show-monospace-fonts_${subtype}` }),
            React.createElement("label", { htmlFor: `show-monospace-fonts_${subtype}` }, (0, locale_1._)('Show monospace fonts only.'))));
    return (React.createElement(InlineCombobox_1.default, { inputType: type, inputStyle: style, value: value, suggestedValues: filteredAvailableFonts, renderOption: font => React.createElement("span", { style: { fontFamily: font } }, font), controls: comboboxControls, onChange: onChange, inputId: props.inputId }));
};
exports.default = FontSearch;
// Known monospaced fonts from wikipedia
// https://en.wikipedia.org/wiki/List_of_monospaced_typefaces
// https://en.wikipedia.org/wiki/Category:Monospaced_typefaces
// Make sure to add the fonts in lower case
// cSpell:disable
const knownMonospacedFonts = [
    'andalé mono',
    'anonymous pro',
    'bitstream vera sans mono',
    'cascadia code',
    'century schoolbook monospace',
    'comic mono',
    'computer modern mono/typewriter',
    'consolas',
    'courier',
    'courier final draft',
    'courier new',
    'courier prime',
    'courier screenplay',
    'cousine',
    'dejavu sans mono',
    'droid sans mono',
    'envy code r',
    'everson mono',
    'fantasque sans mono',
    'fira code',
    'fira mono',
    'fixed',
    'fixedsys',
    'freemono',
    'go mono',
    'hack',
    'hyperfont',
    'ibm courier',
    'ibm plex mono',
    'inconsolata',
    'input',
    'iosevka',
    'jetbrains mono',
    'juliamono',
    'letter gothic',
    'liberation mono',
    'lucida console',
    'menlo',
    'monaco',
    'monofur',
    'monospace (unicode)',
    'nimbus mono l',
    'nk57 monospace',
    'noto mono',
    'ocr-a',
    'ocr-b',
    'operator mono',
    'overpass mono',
    'oxygen mono',
    'pragmatapro',
    'profont',
    'pt mono',
    'recursive mono',
    'roboto mono',
    'sf mono',
    'source code pro',
    'spleen',
    'terminal',
    'terminus',
    'tex gyre cursor',
    'ubuntu mono',
    'victor mono',
    'wumpus mono',
];
const monospaceKeywords = [
    'mono',
    'code',
    'courier',
    'console',
    'source code',
    'terminal',
    'fixed',
];
//# sourceMappingURL=FontSearch.js.map