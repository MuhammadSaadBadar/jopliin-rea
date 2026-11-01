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
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const ItemList_1 = __importDefault(require("./ItemList"));
const suggestionMatchesFilter = (suggestion, filter) => {
    return suggestion.toLowerCase().startsWith(filter.toLowerCase());
};
const InlineCombobox = ({ inputType, controls, inputStyle, className, value, suggestedValues, renderOption, onChange, inputId }) => {
    const [showList, setShowList] = (0, react_1.useState)(false);
    const containerRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    const listboxRef = (0, react_1.useRef)(null);
    const [filteredSuggestions, setFilteredSuggestions] = (0, react_1.useState)(suggestedValues);
    (0, react_1.useEffect)(() => {
        setFilteredSuggestions(suggestedValues);
    }, [suggestedValues]);
    const selectedIndex = filteredSuggestions.indexOf(value);
    const hasSuggestions = filteredSuggestions.length > 0;
    (0, react_1.useEffect)(() => {
        var _a;
        if (selectedIndex >= 0 && showList) {
            (_a = listboxRef.current) === null || _a === void 0 ? void 0 : _a.makeItemIndexVisible(selectedIndex);
        }
    }, [selectedIndex, showList]);
    const focusInput = (0, react_1.useCallback)(() => {
        (0, focusHandler_1.focus)('ComboBox/focus input', inputRef.current);
    }, []);
    const onTextChange = (0, react_1.useCallback)((event) => {
        const newValue = event.target.value;
        onChange(newValue);
        setShowList(true);
        const filteredSuggestions = suggestedValues.filter((suggestion) => suggestionMatchesFilter(suggestion, newValue));
        // If no suggestions, show all fonts
        setFilteredSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : suggestedValues);
    }, [onChange, suggestedValues]);
    const onFocus = (0, react_1.useCallback)(() => {
        setShowList(true);
    }, []);
    const onBlur = (0, react_1.useCallback)((event) => {
        const hasHoverOrFocus = !!containerRef.current.querySelector(':focus-within, :hover');
        const movesToContainedItem = containerRef.current.contains(event.relatedTarget);
        if (!hasHoverOrFocus && !movesToContainedItem) {
            setShowList(false);
        }
    }, []);
    const onItemClick = (0, react_1.useCallback)((event) => {
        const newValue = event.currentTarget.getAttribute('data-key');
        if (!newValue)
            return;
        focusInput();
        onChange(newValue);
        setFilteredSuggestions(suggestedValues);
        setShowList(false);
    }, [onChange, suggestedValues, focusInput]);
    const onKeyDown = (0, react_1.useCallback)(event => {
        if (event.nativeEvent.isComposing)
            return;
        let closestIndex = selectedIndex;
        if (selectedIndex === -1) {
            closestIndex = filteredSuggestions.findIndex(suggestion => {
                return suggestionMatchesFilter(suggestion, value);
            });
        }
        const isGoToNext = event.code === 'ArrowDown';
        if (isGoToNext || event.code === 'ArrowUp') {
            event.preventDefault();
            if (!event.altKey) {
                let newSelectedIndex;
                if (isGoToNext) {
                    newSelectedIndex = (selectedIndex + 1) % filteredSuggestions.length;
                }
                else {
                    newSelectedIndex = selectedIndex - 1;
                    if (newSelectedIndex < 0) {
                        newSelectedIndex += filteredSuggestions.length;
                    }
                }
                const newKey = filteredSuggestions[newSelectedIndex];
                onChange(newKey);
            }
            setShowList(true);
        }
        else if (event.code === 'Enter') {
            event.preventDefault();
            onChange(filteredSuggestions[closestIndex]);
            setShowList(false);
        }
        else if (event.code === 'Escape') {
            event.preventDefault();
            setShowList(false);
        }
    }, [filteredSuggestions, value, selectedIndex, onChange]);
    const valuesListId = (0, react_1.useId)();
    const itemId = (index) => {
        if (index < 0) {
            return undefined;
        }
        else {
            return `combobox-${valuesListId}-option-${index}`;
        }
    };
    const onRenderItem = (key, index) => {
        const selected = key === value;
        const id = itemId(index);
        return (React.createElement("div", { key: key, "data-key": key, className: `combobox-suggestion-option ${selected ? '-selected' : ''}`, role: 'option', "aria-posinset": 1 + index, "aria-setsize": filteredSuggestions.length, onClick: onItemClick, "aria-selected": selected, id: id }, renderOption(key)));
    };
    return (React.createElement("div", { className: `combobox-wrapper ${showList ? '-expanded' : ''} ${className !== null && className !== void 0 ? className : ''}`, onFocus: onFocus, onBlur: onBlur, onKeyDown: onKeyDown, ref: containerRef },
        React.createElement("input", { className: 'input', type: inputType !== null && inputType !== void 0 ? inputType : 'text', style: inputStyle, value: value, onChange: onTextChange, onKeyDown: onKeyDown, spellCheck: false, id: inputId, ref: inputRef, role: 'combobox', "aria-autocomplete": 'list', "aria-controls": valuesListId, "aria-expanded": showList, "aria-activedescendant": itemId(selectedIndex) }),
        React.createElement("div", { className: `suggestions ${hasSuggestions ? '' : '-empty'}` },
            // Custom controls
            controls,
            React.createElement(ItemList_1.default, { role: 'listbox', "aria-label": (0, locale_1._)('Suggestions'), style: { height: 200 }, itemHeight: 26, alwaysRenderSelection: true, selectedIndex: selectedIndex >= 0 ? selectedIndex : undefined, items: filteredSuggestions, itemRenderer: onRenderItem, id: valuesListId, ref: listboxRef }))));
};
exports.default = InlineCombobox;
//# sourceMappingURL=InlineCombobox.js.map