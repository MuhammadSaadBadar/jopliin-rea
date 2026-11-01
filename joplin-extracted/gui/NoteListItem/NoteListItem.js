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
const noteListType_1 = require("@joplin/lib/services/plugins/api/noteListType");
const useRootElement_1 = __importDefault(require("./utils/useRootElement"));
const useItemElement_1 = __importDefault(require("./utils/useItemElement"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const isNoteLockEnabled_1 = __importDefault(require("@joplin/lib/services/noteLock/isNoteLockEnabled"));
const NoteLockNote_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockNote"));
const NoteLockSession_1 = __importDefault(require("@joplin/lib/services/noteLock/NoteLockSession"));
const bridge_1 = __importDefault(require("../../services/bridge"));
const locale_1 = require("@joplin/lib/locale");
const useRenderedNote_1 = __importDefault(require("./utils/useRenderedNote"));
const getNoteElementIdFromJoplinId_1 = __importDefault(require("./utils/getNoteElementIdFromJoplinId"));
const NoteListItem = (props, ref) => {
    const noteId = props.note.id;
    const elementId = (0, getNoteElementIdFromJoplinId_1.default)(noteId);
    const onInputChange = (0, react_1.useCallback)(async (event) => {
        const getValue = (element) => {
            if (element.type === 'checkbox')
                return element.checked;
            if (element.type === 'text')
                return element.value;
            throw new Error(`Unsupported element: ${element.type}`);
        };
        const changeEvent = {
            noteId: noteId,
            elementId: event.currentTarget.getAttribute('data-id'),
            value: getValue(event.currentTarget),
        };
        if (changeEvent.elementId === 'todo-checkbox') {
            if ((0, isNoteLockEnabled_1.default)()) {
                const lockState = await Note_1.default.load(changeEvent.noteId, { fields: ['is_locked'] });
                if (NoteLockNote_1.default.isLocked(lockState) && !NoteLockSession_1.default.instance().isUnlocked()) {
                    // event.currentTarget is already cleared here, after the await - target is the same input
                    event.target.checked = !changeEvent.value;
                    (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Cannot change a locked note while the session is locked'));
                    return;
                }
            }
            await Note_1.default.save({
                id: changeEvent.noteId,
                todo_completed: changeEvent.value ? Date.now() : 0,
            }, { userSideValidation: true });
            props.dispatch({ type: 'NOTE_SORT' });
        }
        else {
            if (props.onChange)
                await props.onChange(changeEvent);
        }
    }, [props.onChange, noteId, props.dispatch]);
    const rootElement = (0, useRootElement_1.default)(elementId);
    const renderedNote = (0, useRenderedNote_1.default)(props.note, props.isSelected, props.isWatched, props.isPublished, props.listRenderer, props.highlightedWords, props.index, props.columns);
    const itemEventHandlers = (0, react_1.useMemo)(() => ({ onInputChange, onClick: null }), [onInputChange]);
    const displayTitle = (0, react_1.useMemo)(() => Note_1.default.displayTitle(props.note), [props.note]);
    (0, useItemElement_1.default)(rootElement, noteId, renderedNote ? renderedNote.html : '', props.focusVisible, props.style, props.itemSize, props.onClick, props.onDoubleClick, props.flow, itemEventHandlers, displayTitle);
    const className = (0, react_1.useMemo)(() => {
        return [
            'note-list-item-wrapper',
            // This is not used by the app, but kept here because it may be used
            // by users for custom CSS.
            (props.index + 1) % 2 === 0 ? 'even' : 'odd',
            props.isProvisional && '-provisional',
        ].filter(e => !!e).join(' ');
    }, [props.index, props.isProvisional]);
    const isActiveDragItem = props.dragIndex === props.index;
    const isLastActiveDragItem = props.index === props.noteCount - 1 && props.dragIndex >= props.noteCount;
    const dragCursorStyle = (0, react_1.useMemo)(() => {
        if (props.flow === noteListType_1.ItemFlow.TopToBottom) {
            let dragItemPosition = '';
            if (isActiveDragItem) {
                dragItemPosition = 'top';
            }
            else if (isLastActiveDragItem) {
                dragItemPosition = 'bottom';
            }
            const output = {
                width: props.itemSize.width,
                display: dragItemPosition ? 'block' : 'none',
                left: 0,
            };
            if (dragItemPosition === 'top') {
                output.top = 0;
            }
            else {
                output.bottom = 0;
            }
            return output;
        }
        if (props.flow === noteListType_1.ItemFlow.LeftToRight) {
            let dragItemPosition = '';
            if (isActiveDragItem) {
                dragItemPosition = 'left';
            }
            else if (isLastActiveDragItem) {
                dragItemPosition = 'right';
            }
            const output = {
                height: props.itemSize.height,
                display: dragItemPosition ? 'block' : 'none',
                top: 0,
            };
            if (dragItemPosition === 'left') {
                output.left = 0;
            }
            else {
                output.right = 0;
            }
            return output;
        }
        throw new Error('Unreachable');
    }, [isActiveDragItem, isLastActiveDragItem, props.flow, props.itemSize]);
    return React.createElement("div", { id: elementId, ref: ref, draggable: true, tabIndex: props.tabIndex, className: className, "data-id": noteId, style: { height: props.itemSize.height }, onContextMenu: props.onContextMenu, onDragStart: props.onDragStart, onDragOver: props.onDragOver, "aria-selected": props.isSelected, "aria-posinset": 1 + props.index, "aria-setsize": props.noteCount, role: 'option' },
        React.createElement("div", { className: "dragcursor", style: dragCursorStyle }));
};
exports.default = (0, react_1.memo)((0, react_1.forwardRef)(NoteListItem));
//# sourceMappingURL=NoteListItem.js.map