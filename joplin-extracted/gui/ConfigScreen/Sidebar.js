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
exports.default = Sidebar;
const Setting_1 = require("@joplin/lib/models/Setting");
const React = __importStar(require("react"));
const Setting_2 = __importDefault(require("@joplin/lib/models/Setting"));
const locale_1 = require("@joplin/lib/locale");
const react_1 = require("react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const SearchInput_1 = __importDefault(require("../lib/SearchInput/SearchInput"));
const config_search_text_1 = require("@joplin/lib/components/shared/config/config-search-text");
const searchHighlight_1 = __importDefault(require("./searchHighlight"));
function Sidebar(props) {
    const buttonRefs = (0, react_1.useRef)([]);
    const isSearching = !!(0, config_search_text_1.normalizeQuery)(props.searchQuery);
    const matchedSectionNames = (0, react_1.useMemo)(() => {
        return new Set(props.searchResultGroups.map(group => group.sectionName));
    }, [props.searchResultGroups]);
    // Making a tabbed region accessible involves supporting keyboard interaction.
    // See https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ for details
    const onKeyDown = (0, react_1.useCallback)((event) => {
        const selectedIndex = props.sections.findIndex(section => section.name === props.selection);
        let newIndex = selectedIndex;
        // Determine navigation direction
        let isMovingUp = false;
        if (event.code === 'ArrowUp') {
            newIndex--;
            isMovingUp = true;
        }
        else if (event.code === 'ArrowDown') {
            newIndex++;
            isMovingUp = false;
        }
        else if (event.code === 'Home') {
            newIndex = 0;
            isMovingUp = false;
        }
        else if (event.code === 'End') {
            newIndex = props.sections.length - 1;
            isMovingUp = true;
        }
        if (newIndex < 0)
            newIndex += props.sections.length;
        newIndex %= props.sections.length;
        // Skip disabled (no-match) sections during search
        if (isSearching) {
            const initialIndex = newIndex;
            while (!matchedSectionNames.has(props.sections[newIndex].name)) {
                if (isMovingUp) {
                    newIndex--;
                    if (newIndex < 0)
                        newIndex += props.sections.length;
                }
                else {
                    newIndex++;
                    newIndex %= props.sections.length;
                }
                // Prevent infinite loop if no matched sections
                if (newIndex === initialIndex)
                    break;
            }
            if (!matchedSectionNames.has(props.sections[newIndex].name))
                return;
        }
        if (newIndex !== selectedIndex) {
            event.preventDefault();
            props.onSelectionChange({ section: props.sections[newIndex] });
            const targetButton = buttonRefs.current[newIndex];
            if (targetButton) {
                (0, focusHandler_1.focus)('Sidebar', targetButton);
            }
        }
    }, [props.sections, props.selection, props.onSelectionChange, matchedSectionNames, isSearching]);
    const buttons = [];
    function renderButton(section, index) {
        const selected = props.selection === section.name;
        const hasMatch = matchedSectionNames.has(section.name);
        const isDisabled = isSearching && !hasMatch;
        const isActiveTab = selected && !isDisabled;
        const classNames = ['item'];
        if (Setting_2.default.isSubSection(section.name))
            classNames.push('sub');
        if (isActiveTab)
            classNames.push('selected');
        if (isDisabled)
            classNames.push('disabled');
        return (React.createElement("button", { key: section.name, type: 'button', role: 'tab', ref: (item) => {
                if (item) {
                    buttonRefs.current[index] = item;
                }
            }, className: classNames.join(' '), id: `setting-tab-${section.name}`, "aria-controls": isSearching ? (isDisabled ? undefined : 'setting-section-search-results') : `setting-section-${section.name}`, "aria-selected": isActiveTab, "aria-disabled": isDisabled, tabIndex: isActiveTab ? 0 : -1, onClick: () => {
                if (isDisabled)
                    return;
                props.onSelectionChange({ section: section });
            }, onKeyDown: !isDisabled ? onKeyDown : undefined },
            React.createElement("i", { className: `icon ${Setting_2.default.sectionNameToIcon(section.name, Setting_1.AppType.Desktop)}`, role: 'img', "aria-hidden": 'true' }),
            React.createElement("span", { className: 'label' }, (0, searchHighlight_1.default)(Setting_2.default.sectionNameToLabel(section.name), props.searchQuery))));
    }
    function renderDivider(key) {
        return (React.createElement("div", { key: key, className: 'separator', role: 'presentation', "aria-hidden": 'true' }, (0, locale_1._)('Plugins')));
    }
    let pluginDividerAdded = false;
    let index = 0;
    for (const section of props.sections) {
        if (section.source === Setting_1.SettingSectionSource.Plugin && !pluginDividerAdded) {
            buttons.push(renderDivider('divider-plugins'));
            pluginDividerAdded = true;
        }
        buttons.push(renderButton(section, index));
        index++;
    }
    return (React.createElement("div", { className: 'settings-sidebar _scrollbar2' },
        React.createElement("div", { className: 'searchbox' },
            React.createElement(SearchInput_1.default, { inputRef: null, inputClassName: 'settings', value: props.searchQuery, onChange: props.onSearchQueryChange, onSearchButtonClick: props.onSearchButtonClick, searchStarted: isSearching, placeholder: (0, locale_1._)('Search settings...'), "aria-controls": isSearching ? 'setting-section-search-results' : undefined, iconButtonTabIndex: -1 })),
        React.createElement("div", { role: 'tablist', className: 'tablist' }, buttons)));
}
//# sourceMappingURL=Sidebar.js.map