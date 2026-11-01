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
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const React = __importStar(require("react"));
const react_1 = require("react");
const styles_1 = require("../styles");
const BaseModel_1 = __importStar(require("@joplin/lib/BaseModel"));
const NoteCount_1 = __importDefault(require("./NoteCount"));
const EmptyExpandLink_1 = __importDefault(require("./EmptyExpandLink"));
const ListItemWrapper_1 = __importDefault(require("./ListItemWrapper"));
const TagItem = (props) => {
    const { tag, selectionState } = props;
    let noteCount = null;
    if (Setting_1.default.value('showNoteCounts')) {
        const count = Setting_1.default.value('showCompletedTodos') ? tag.note_count : tag.note_count - tag.todo_completed_count;
        noteCount = React.createElement(NoteCount_1.default, { count: count });
    }
    const onClickHandler = (0, react_1.useCallback)((event) => {
        props.onClick({ id: tag.id, type: BaseModel_1.ModelType.Tag, event });
    }, [props.onClick, tag]);
    return (React.createElement(ListItemWrapper_1.default, { containerRef: props.anchorRef, selectionState: selectionState, depth: 1, className: `list-item-container ${selectionState.selected ? 'selected' : ''}`, highlightOnHover: true, onDrop: props.onTagDrop, onContextMenu: props.onContextMenu, "data-id": tag.id, "data-tag-id": tag.id, "data-type": BaseModel_1.ModelType.Tag, itemIndex: props.index, itemCount: props.itemCount },
        React.createElement(EmptyExpandLink_1.default, null),
        React.createElement(styles_1.StyledListItemAnchor, { className: "list-item", selected: selectionState.selected, "data-id": tag.id, "data-type": BaseModel_1.default.TYPE_TAG, onClick: onClickHandler },
            React.createElement(styles_1.StyledSpanFix, { className: "tag-label" }, props.label),
            noteCount)));
};
exports.default = TagItem;
//# sourceMappingURL=TagItem.js.map