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
exports.default = NoteContentPropertiesDialog;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const DialogButtonRow_1 = __importDefault(require("./DialogButtonRow"));
const theme_1 = require("@joplin/lib/theme");
const Countable = require('@joplin/lib/countable/Countable');
const markupLanguageUtils_1 = __importDefault(require("@joplin/lib/utils/markupLanguageUtils"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
let markupToHtml_ = null;
function markupToHtml() {
    if (markupToHtml_)
        return markupToHtml_;
    markupToHtml_ = markupLanguageUtils_1.default.newMarkupToHtml();
    return markupToHtml_;
}
function countElements(text, wordSetter, characterSetter, characterNoSpaceSetter, cjkCharacterSetter, lineSetter) {
    Countable.count(text, (counter) => {
        wordSetter(counter.words);
        characterSetter(counter.all);
        characterNoSpaceSetter(counter.characters);
    });
    const cjkMatches = text.match(/[\p{Script=Han}\p{Script=Bopomofo}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu);
    cjkCharacterSetter(cjkMatches ? cjkMatches.length : 0);
    lineSetter(text === '' ? 0 : text.split('\n').length);
}
function formatReadTime(readTimeMinutes) {
    if (readTimeMinutes < 1) {
        return '< 1';
    }
    return Math.ceil(readTimeMinutes).toString();
}
function NoteContentPropertiesDialog(props) {
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const tableBodyComps = [];
    // For the source Markdown
    const [lines, setLines] = (0, react_1.useState)(0);
    const [words, setWords] = (0, react_1.useState)(0);
    const [characters, setCharacters] = (0, react_1.useState)(0);
    const [charactersNoSpace, setCharactersNoSpace] = (0, react_1.useState)(0);
    const [cjkCharacters, setCjkCharacters] = (0, react_1.useState)(0);
    // For source with Markdown syntax stripped out
    const [strippedLines, setStrippedLines] = (0, react_1.useState)(0);
    const [strippedWords, setStrippedWords] = (0, react_1.useState)(0);
    const [strippedCharacters, setStrippedCharacters] = (0, react_1.useState)(0);
    const [strippedCharactersNoSpace, setStrippedCharactersNoSpace] = (0, react_1.useState)(0);
    const [strippedCjkCharacters, setStrippedCjkCharacters] = (0, react_1.useState)(0);
    const [strippedReadTime, setStrippedReadTime] = (0, react_1.useState)(0);
    // This amount based on the following paper:
    // https://www.researchgate.net/publication/332380784_How_many_words_do_we_read_per_minute_A_review_and_meta-analysis_of_reading_rate
    const wordsPerMinute = 250;
    (0, react_1.useEffect)(() => {
        countElements(props.text, setWords, setCharacters, setCharactersNoSpace, setCjkCharacters, setLines);
    }, [props.text]);
    (0, react_1.useEffect)(() => {
        const strippedText = markupToHtml().stripMarkup(props.markupLanguage, props.text);
        countElements(strippedText, setStrippedWords, setStrippedCharacters, setStrippedCharactersNoSpace, setStrippedCjkCharacters, setStrippedLines);
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [props.text]);
    (0, react_1.useEffect)(() => {
        const readTimeMinutes = strippedWords / wordsPerMinute;
        setStrippedReadTime(readTimeMinutes);
    }, [strippedWords]);
    const textProperties = {
        lines: lines,
        words: words,
        characters: characters,
        charactersNoSpace: charactersNoSpace,
        cjkCharacters: cjkCharacters,
    };
    const strippedTextProperties = {
        // The function stripMarkup() currently removes all new lines so we can't use the
        // strippedLines property. Instead we simply use the lines property which should
        // be a good approximation anyway.
        // Also dummy check to silence TypeScript warning
        lines: strippedLines === -5000 ? strippedLines : lines,
        words: strippedWords,
        characters: strippedCharacters,
        charactersNoSpace: strippedCharactersNoSpace,
        cjkCharacters: strippedCjkCharacters,
    };
    const keyToLabel = {
        words: (0, locale_1._)('Words'),
        characters: (0, locale_1._)('Characters'),
        charactersNoSpace: (0, locale_1._)('Characters excluding spaces'),
        cjkCharacters: (0, locale_1._)('Chinese/Japanese/Korean characters'),
        lines: (0, locale_1._)('Lines'),
    };
    const buttonRow_click = () => {
        props.onClose();
    };
    const labelCompStyle = Object.assign(Object.assign({}, theme.textStyle), { fontWeight: 'bold', width: '10em' });
    const controlCompStyle = Object.assign(Object.assign({}, theme.textStyle), { textAlign: 'center' });
    const createTableBodyRow = (key, value, strippedValue) => {
        const labelComp = React.createElement("td", { style: labelCompStyle }, keyToLabel[key]);
        const controlComp = React.createElement("td", { style: controlCompStyle }, value);
        const strippedControlComp = React.createElement("td", { style: controlCompStyle }, strippedValue);
        return (React.createElement("tr", { key: key },
            labelComp,
            controlComp,
            strippedControlComp));
    };
    const tableHeaderStyle = Object.assign(Object.assign({}, theme.textStyle), { textAlign: 'center' });
    const tableHeader = (React.createElement("tr", null,
        React.createElement("th", { style: tableHeaderStyle }),
        React.createElement("th", { style: tableHeaderStyle }, (0, locale_1._)('Editor')),
        React.createElement("th", { style: tableHeaderStyle }, (0, locale_1._)('Viewer'))));
    for (const key in textProperties) {
        if (key === 'cjkCharacters' && textProperties[key] === 0 && strippedTextProperties[key] === 0)
            continue;
        const comp = createTableBodyRow(key, textProperties[key], strippedTextProperties[key]);
        tableBodyComps.push(comp);
    }
    const dialogBoxHeadingStyle = Object.assign(Object.assign({}, theme.dialogTitle), { textAlign: 'center' });
    const readTimeLabel = (0, locale_1._)('Read time: %s min', formatReadTime(strippedReadTime));
    return (React.createElement(Dialog_1.default, { onCancel: props.onClose },
        React.createElement("div", { style: dialogBoxHeadingStyle }, (0, locale_1._)('Statistics')),
        React.createElement("table", null,
            React.createElement("thead", null, tableHeader),
            React.createElement("tbody", null, tableBodyComps)),
        React.createElement("div", { style: Object.assign(Object.assign({}, labelCompStyle), { marginTop: 10 }) }, readTimeLabel),
        React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: buttonRow_click, okButtonShow: false, cancelButtonLabel: (0, locale_1._)('Close') })));
}
//# sourceMappingURL=NoteContentPropertiesDialog.js.map