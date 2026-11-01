"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const noteTitleTooltip_1 = __importDefault(require("./noteTitleTooltip"));
const addItemEventListeners = (element, listeners, onClick, onDoubleClick) => {
    const processedInputs = [];
    const processedButtons = [];
    const inputs = element.getElementsByTagName('input');
    for (const input of inputs) {
        if (input.type === 'checkbox' || input.type === 'text') {
            input.addEventListener('change', listeners.onInputChange);
            processedInputs.push(input);
        }
    }
    const buttons = element.getElementsByTagName('button');
    if (listeners.onClick) {
        for (const button of buttons) {
            button.addEventListener('click', listeners.onClick);
            processedButtons.push(button);
        }
    }
    const clickHandler = (e) => onClick(e);
    const dblclickHandler = (e) => onDoubleClick(e);
    element.addEventListener('click', clickHandler);
    element.addEventListener('dblclick', dblclickHandler);
    return {
        cleanup: () => {
            for (const input of processedInputs) {
                input.removeEventListener('change', listeners.onInputChange);
            }
            if (listeners.onClick) {
                for (const button of processedButtons) {
                    button.removeEventListener('click', listeners.onClick);
                }
            }
            element.removeEventListener('click', clickHandler);
            element.removeEventListener('dblclick', dblclickHandler);
        },
    };
};
const useItemElement = (rootElement, noteId, noteHtml, focusVisible, style, itemSize, onClick, onDoubleClick, flow, itemEventHandlers, displayTitle = '') => {
    const itemElement = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!rootElement)
            return () => { };
        const element = document.createElement('div');
        element.setAttribute('data-id', noteId);
        element.className = 'note-list-item';
        for (const [n, v] of Object.entries(style)) {
            element.style[n] = v;
        }
        if (flow === noteListType_1.ItemFlow.LeftToRight)
            element.style.width = `${itemSize.width}px`;
        element.style.height = `${itemSize.height}px`;
        element.innerHTML = noteHtml;
        const { cleanup } = addItemEventListeners(element, itemEventHandlers, onClick, onDoubleClick);
        const detachTooltip = displayTitle ? (0, noteTitleTooltip_1.default)(element, displayTitle) : null;
        rootElement.appendChild(element);
        itemElement.current = element;
        return () => {
            cleanup();
            if (detachTooltip)
                detachTooltip();
            itemElement.current = null;
            element.remove();
        };
    }, [rootElement, itemSize, noteHtml, noteId, flow, style, onClick, onDoubleClick, itemEventHandlers, displayTitle]);
    (0, react_1.useEffect)(() => {
        const element = itemElement.current;
        if (!element)
            return;
        if (focusVisible) {
            element.classList.add('-focus-visible');
        }
        else {
            element.classList.remove('-focus-visible');
        }
    }, [focusVisible]);
    return itemElement;
};
exports.default = useItemElement;
//# sourceMappingURL=useItemElement.js.map