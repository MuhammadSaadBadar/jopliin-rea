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
const ToolbarButton_1 = __importDefault(require("./ToolbarButton/ToolbarButton"));
const ToggleEditorsButton_1 = __importStar(require("./ToggleEditorsButton/ToggleEditorsButton"));
const ToolbarSpace_1 = __importDefault(require("./ToolbarSpace"));
const react_redux_1 = require("react-redux");
const react_1 = require("react");
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const getItemType = (item) => {
    var _a;
    return (_a = item.type) !== null && _a !== void 0 ? _a : 'button';
};
const isFocusable = (item) => {
    if (!item.enabled) {
        return false;
    }
    return getItemType(item) === 'button';
};
const useCategorizedItems = (items) => {
    return (0, react_1.useMemo)(() => {
        const itemsLeft = [];
        const itemsCenter = [];
        const itemsRight = [];
        if (items) {
            for (const item of items) {
                const type = getItemType(item);
                if (item.name === 'toggleEditors') {
                    itemsRight.push(item);
                }
                else if (type === 'button') {
                    const target = ['historyForward', 'historyBackward', 'toggleExternalEditing'].includes(item.name) ? itemsLeft : itemsCenter;
                    target.push(item);
                }
                else if (type === 'separator') {
                    itemsCenter.push(item);
                }
            }
        }
        return {
            itemsLeft,
            itemsCenter,
            itemsRight,
            allItems: itemsLeft.concat(itemsCenter, itemsRight),
        };
    }, [items]);
};
const useKeyboardHandler = (setSelectedIndex, focusableItems) => {
    const onKeyDown = (0, react_1.useCallback)(event => {
        let direction = 0;
        if (event.code === 'ArrowRight') {
            direction = 1;
        }
        else if (event.code === 'ArrowLeft') {
            direction = -1;
        }
        let handled = true;
        if (direction !== 0) {
            setSelectedIndex(index => {
                let newIndex = (index + direction) % focusableItems.length;
                if (newIndex < 0) {
                    newIndex += focusableItems.length;
                }
                return newIndex;
            });
        }
        else if (event.code === 'End') {
            setSelectedIndex(focusableItems.length - 1);
        }
        else if (event.code === 'Home') {
            setSelectedIndex(0);
        }
        else {
            handled = false;
        }
        if (handled) {
            event.preventDefault();
        }
    }, [focusableItems, setSelectedIndex]);
    return onKeyDown;
};
const ToolbarBaseComponent = props => {
    var _a, _b, _c;
    const { itemsLeft, itemsCenter, itemsRight, allItems } = useCategorizedItems(props.items);
    const [selectedIndex, setSelectedIndex] = (0, react_1.useState)(0);
    const focusableItems = (0, react_1.useMemo)(() => {
        return allItems.filter(isFocusable);
    }, [allItems]);
    const containerRef = (0, react_1.useRef)(null);
    const doc = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument;
    const containerHasFocus = !!((_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.contains(doc === null || doc === void 0 ? void 0 : doc.activeElement));
    let keyCounter = 0;
    const renderItem = (o, indexInFocusable) => {
        let key = o.iconName ? o.iconName : '';
        key += o.title ? o.title : '';
        key += o.name ? o.name : '';
        if (!key)
            key = `${o.type}_${keyCounter++}`;
        const buttonProps = Object.assign({ key, themeId: props.themeId, disabled: props.disabled || !o.enabled }, o);
        const tabIndex = indexInFocusable === (selectedIndex % focusableItems.length) ? 0 : -1;
        const setButtonRefCallback = (button) => {
            if (button && tabIndex === 0 && containerHasFocus) {
                (0, focusHandler_1.focus)('ToolbarBase', button);
            }
        };
        if (o.type === 'button' && o.name === 'toggleEditors') {
            return React.createElement(ToggleEditorsButton_1.default, { key: o.name, buttonRef: setButtonRefCallback, value: ToggleEditorsButton_1.Value.Markdown, themeId: props.themeId, toolbarButtonInfo: o, tabIndex: tabIndex });
        }
        else if (o.type === 'button') {
            return (React.createElement(ToolbarButton_1.default, Object.assign({ tabIndex: tabIndex, buttonRef: setButtonRefCallback }, buttonProps)));
        }
        else if (o.type === 'separator') {
            return React.createElement(ToolbarSpace_1.default, Object.assign({}, buttonProps));
        }
        return null;
    };
    let focusableIndex = 0;
    const renderList = (items) => {
        const result = [];
        for (const item of items) {
            result.push(renderItem(item, focusableIndex));
            if (isFocusable(item)) {
                focusableIndex++;
            }
        }
        return result;
    };
    const leftItemComps = renderList(itemsLeft);
    const centerItemComps = renderList(itemsCenter);
    const rightItemComps = renderList(itemsRight);
    const onKeyDown = useKeyboardHandler(setSelectedIndex, focusableItems);
    return (React.createElement("div", { ref: containerRef, className: `editor-toolbar ${props.scrollable ? '-scrollable' : ''}`, style: props.style, id: (_c = props.id) !== null && _c !== void 0 ? _c : undefined, role: 'toolbar', "aria-label": props['aria-label'], onKeyDown: onKeyDown },
        React.createElement("div", { className: 'group' }, leftItemComps),
        React.createElement("div", { className: 'group' }, centerItemComps),
        React.createElement("div", { className: 'spacer' }),
        React.createElement("div", { className: 'group' }, rightItemComps)));
};
const mapStateToProps = (state) => {
    return { themeId: state.settings.theme };
};
exports.default = (0, react_redux_1.connect)(mapStateToProps)(ToolbarBaseComponent);
//# sourceMappingURL=ToolbarBase.js.map