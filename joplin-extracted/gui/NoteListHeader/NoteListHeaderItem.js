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
const getColumnTitle_1 = __importDefault(require("./utils/getColumnTitle"));
exports.default = (props) => {
    const column = props.column;
    const style = (0, react_1.useMemo)(() => {
        const output = {};
        if (column.width) {
            output.width = column.width;
        }
        else {
            output.flex = 1;
        }
        return output;
    }, [column.width]);
    const classes = (0, react_1.useMemo)(() => {
        const output = ['item'];
        if (props.isFirst)
            output.push('-first');
        if (props.isCurrent) {
            output.push('-current');
            if (props.isReverse)
                output.push('-reverse');
        }
        if (props.dragCursorLocation)
            output.push(`-drop-${props.dragCursorLocation}`);
        return output;
    }, [props.isFirst, props.isCurrent, props.isReverse, props.dragCursorLocation]);
    const onClick = (0, react_1.useCallback)((event) => {
        const name = event.currentTarget.getAttribute('data-name');
        props.onClick({ name });
    }, [props.onClick]);
    const renderTitle = () => {
        let chevron = null;
        if (props.isCurrent) {
            const classes = ['chevron', 'fas'];
            classes.push(props.isReverse ? 'fa-chevron-down' : 'fa-chevron-up');
            chevron = React.createElement("i", { className: classes.join(' ') });
        }
        const title = (0, getColumnTitle_1.default)(column.name);
        let titleElement = title;
        if (column.name === 'note.checkboxes') {
            titleElement = React.createElement("i", { className: "fas fa-adjust", "aria-label": title, title: title });
        }
        else if (column.name === 'note.is_todo') {
            titleElement = React.createElement("i", { className: "fas fa-check", "aria-label": title, title: title });
        }
        return React.createElement("span", { className: "titlewrapper" },
            titleElement,
            chevron);
    };
    const renderResizer = () => {
        if (props.isFirst)
            return null;
        return (React.createElement("div", { className: "resizer", "data-name": column.name, draggable: true, onDragStart: props.onResizerDragStart, onDragEnd: props.onResizerDragEnd }));
    };
    return (React.createElement("a", { "data-name": column.name, draggable: true, className: classes.join(' '), style: style, title: (0, getColumnTitle_1.default)(column.name), onClick: onClick, onDragStart: props.onDragStart, onDragOver: props.onDragOver, onDrop: props.onDrop },
        renderResizer(),
        React.createElement("div", { className: "inner" }, renderTitle())));
};
//# sourceMappingURL=NoteListHeaderItem.js.map