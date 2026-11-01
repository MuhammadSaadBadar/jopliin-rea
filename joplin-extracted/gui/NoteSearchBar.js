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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
class NoteSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.searchInput_change = this.searchInput_change.bind(this);
        this.searchInput_keyDown = this.searchInput_keyDown.bind(this);
        this.previousButton_click = this.previousButton_click.bind(this);
        this.nextButton_click = this.nextButton_click.bind(this);
        this.closeButton_click = this.closeButton_click.bind(this);
        // eslint-disable-next-line no-restricted-properties
        this.focus = this.focus.bind(this);
        this.backgroundColor = undefined;
        this.searchInputRef = React.createRef();
    }
    style() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const style = {
            root: Object.assign(Object.assign({}, theme.textStyle), { backgroundColor: theme.backgroundColor, color: theme.colorFaded }),
        };
        return style;
    }
    buttonIconComponent(iconName, clickHandler, isEnabled) {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const searchButton = {
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 2,
            paddingBottom: 2,
            textDecoration: 'none',
            marginRight: 5,
        };
        const iconStyle = {
            display: 'flex',
            fontSize: Math.round(theme.fontSize) * 1.2,
            color: theme.color,
            opacity: isEnabled ? 1.0 : theme.disabledOpacity,
        };
        const icon = React.createElement("i", { style: iconStyle, className: `fas ${iconName}` });
        return (React.createElement("a", { href: "#", style: searchButton, onClick: clickHandler }, icon));
    }
    searchInput_change(event) {
        const query = event.currentTarget.value;
        this.triggerOnChange(query);
    }
    searchInput_keyDown(event) {
        if (event.keyCode === 13) {
            // ENTER
            event.preventDefault();
            if (!event.shiftKey) {
                if (this.props.onNext)
                    this.props.onNext();
            }
            else {
                if (this.props.onPrevious)
                    this.props.onPrevious();
            }
        }
        if (event.keyCode === 27) {
            // ESCAPE
            event.preventDefault();
            if (this.props.onClose)
                this.props.onClose();
        }
        if (event.keyCode === 70) {
            // F key
            if (event.ctrlKey) {
                event.currentTarget.select();
            }
        }
    }
    previousButton_click() {
        if (this.props.onPrevious)
            this.props.onPrevious();
    }
    nextButton_click() {
        if (this.props.onNext)
            this.props.onNext();
    }
    closeButton_click() {
        if (this.props.onClose)
            this.props.onClose();
    }
    triggerOnChange(query) {
        if (this.props.onChange)
            this.props.onChange(query);
    }
    focus() {
        var _a;
        (0, focusHandler_1.focus)('NoteSearchBar::focus', this.searchInputRef.current);
        (_a = this.searchInputRef.current) === null || _a === void 0 ? void 0 : _a.select();
    }
    render() {
        const query = this.props.query ? this.props.query : '';
        // backgroundColor needs to cached to a local variable to prevent the
        // colour from blinking.
        // For more info: https://github.com/laurent22/joplin/pull/2329#issuecomment-578376835
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        if (!this.props.searching) {
            if (this.props.resultCount === 0 && query.length > 0) {
                this.backgroundColor = theme.warningBackgroundColor;
            }
            else {
                this.backgroundColor = theme.backgroundColor;
            }
        }
        if (this.backgroundColor === undefined) {
            this.backgroundColor = theme.backgroundColor;
        }
        const buttonEnabled = (this.backgroundColor === theme.backgroundColor);
        const closeButton = this.buttonIconComponent('fa-times', this.closeButton_click, true);
        const previousButton = this.buttonIconComponent('fa-chevron-up', this.previousButton_click, buttonEnabled);
        const nextButton = this.buttonIconComponent('fa-chevron-down', this.nextButton_click, buttonEnabled);
        const textStyle = { fontSize: theme.fontSize,
            fontFamily: theme.fontFamily,
            color: theme.colorFaded,
            backgroundColor: theme.backgroundColor };
        const matchesFoundString = (query.length > 0) ? (React.createElement("div", { style: textStyle }, `${this.props.resultCount === 0 ? 0 : this.props.selectedIndex + 1} / ${this.props.resultCount}`)) : null;
        const editorVisible = this.props.visiblePanes.includes('editor');
        const usesEditorSearch = this.props.editorType === 'CodeMirror6' && editorVisible;
        const allowScrolling = editorVisible;
        const viewerWarning = (React.createElement("div", { style: textStyle }, 'Jumping between matches is not available in the viewer, please toggle the editor'));
        if (usesEditorSearch)
            return null;
        return (React.createElement("div", { className: "note-search-bar", style: this.props.style },
            React.createElement("div", { style: { display: 'flex', flexDirection: 'row', alignItems: 'center' } },
                closeButton,
                React.createElement("input", { placeholder: (0, locale_1._)('Search...'), value: query, onChange: this.searchInput_change, onKeyDown: this.searchInput_keyDown, ref: this.searchInputRef, type: "text", style: { width: 200, marginRight: 5, backgroundColor: this.backgroundColor, color: theme.color } }),
                allowScrolling ? previousButton : null,
                allowScrolling ? nextButton : null,
                allowScrolling ? matchesFoundString : null,
                !allowScrolling ? viewerWarning : null)));
    }
}
exports.default = NoteSearchBar;
//# sourceMappingURL=NoteSearchBar.js.map