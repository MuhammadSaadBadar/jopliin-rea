"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropHeaderAt = exports.DataType = void 0;
const react_1 = require("react");
const dragAndDrop_1 = require("../utils/dragAndDrop");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const dom_1 = require("@joplin/utils/dom");
var DataType;
(function (DataType) {
    DataType["HeaderItem"] = "text/x-jop-header-item";
    DataType["Resizer"] = "text/x-jop-header-resizer";
})(DataType || (exports.DataType = DataType = {}));
const getHeader = (event) => {
    const dt = event.dataTransfer;
    const headerText = dt.getData(DataType.HeaderItem);
    if (!headerText)
        return null;
    return JSON.parse(headerText);
};
const isDraggedHeaderItem = (event) => {
    return event.dataTransfer.types.includes(DataType.HeaderItem);
};
const isDraggedHeaderResizer = (event) => {
    return event.dataTransfer.types.includes(DataType.Resizer);
};
const getInsertAt = (event) => {
    const name = event.currentTarget.getAttribute('data-name');
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const percent = x / rect.width;
    const headerElement = (0, dom_1.findParentElementByClassName)(event.currentTarget, 'note-list-header');
    const headerRect = headerElement.getBoundingClientRect();
    const data = {
        columnName: name,
        location: percent < 0.5 ? 'before' : 'after',
        x: event.clientX - headerRect.x,
    };
    return data;
};
const dropHeaderAt = (columns, header, insertAt) => {
    const droppedColumn = columns.find(c => c.name === header.name);
    const newColumns = [];
    for (const column of columns) {
        if (insertAt.columnName === column.name) {
            if (insertAt.location === 'before') {
                newColumns.push(droppedColumn);
                newColumns.push(column);
            }
            else {
                newColumns.push(column);
                newColumns.push(droppedColumn);
            }
        }
        else if (droppedColumn.name === column.name) {
            continue;
        }
        else {
            newColumns.push(column);
        }
    }
    return newColumns;
};
exports.dropHeaderAt = dropHeaderAt;
const setupDataTransfer = (event, dataType, image, data) => {
    event.dataTransfer.setDragImage(image, 1, 1);
    event.dataTransfer.clearData();
    event.dataTransfer.setData(dataType, JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
};
const getEffectiveColumnWidths = (columns, totalWidth) => {
    let totalFixedWidth = 0;
    for (const c of columns)
        totalFixedWidth += c.width;
    const dynamicWidth = totalWidth - totalFixedWidth;
    const output = [];
    for (const c of columns) {
        output.push(c.width ? c.width : dynamicWidth);
    }
    return output;
};
const getColumnsToBoundaries = (columns, totalWidth) => {
    const widths = getEffectiveColumnWidths(columns, totalWidth);
    const boundaries = [0];
    let total = 0;
    for (const w of widths) {
        boundaries.push(total + w);
        total += w;
    }
    return boundaries;
};
const applyBoundariesToColumns = (columns, boundaries) => {
    const newColumns = [];
    let changed = false;
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const previousWidth = column.width;
        const newWidth = column.width ? boundaries[i + 1] - boundaries[i] : 0;
        if (previousWidth !== newWidth) {
            changed = true;
        }
        newColumns.push(Object.assign(Object.assign({}, column), { width: newWidth }));
    }
    return changed ? newColumns : columns;
};
exports.default = (columns) => {
    const [dropAt, setDropAt] = (0, react_1.useState)(null);
    const [draggedItem, setDraggedItem] = (0, react_1.useState)(null);
    const draggedItemRef = (0, react_1.useRef)(null);
    draggedItemRef.current = draggedItem;
    const columnsRef = (0, react_1.useRef)(null);
    columnsRef.current = columns;
    // The drag and drop image needs to be created in advance to avoid the globe 🌐 cursor.
    // https://www.sam.today/blog/html5-dnd-globe-icon
    const emptyImage = (0, react_1.useMemo)(() => {
        const image = new Image(1, 1);
        image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
        return image;
    }, []);
    const onItemDragStart = (0, react_1.useCallback)(event => {
        if (event.dataTransfer.items.length)
            return;
        const name = event.currentTarget.getAttribute('data-name');
        setupDataTransfer(event, DataType.HeaderItem, emptyImage, { name });
        setDraggedItem({
            type: DataType.HeaderItem,
            columnName: name,
            initX: 0,
            initBoundaries: [],
        });
    }, [emptyImage]);
    const onItemDragOver = (0, react_1.useCallback)((event) => {
        if (!isDraggedHeaderItem(event))
            return;
        const data = getInsertAt(event);
        setDropAt(current => {
            if (JSON.stringify(current) === JSON.stringify(data))
                return current;
            return data;
        });
        (0, dragAndDrop_1.registerGlobalDragEndEvent)(() => setDropAt(null));
    }, []);
    const onItemDrop = (0, react_1.useCallback)(event => {
        const header = getHeader(event);
        if (!header)
            return;
        (0, dragAndDrop_1.unregisterGlobalDragEndEvent)();
        const data = getInsertAt(event);
        setDropAt(null);
        if (header.name === data.columnName)
            return;
        const newColumns = (0, exports.dropHeaderAt)(columns, header, data);
        if (JSON.stringify(newColumns) !== JSON.stringify(columns))
            Setting_1.default.setValue('notes.columns', newColumns);
    }, [columns]);
    const onResizerDragOver = (0, react_1.useCallback)(event => {
        if (!isDraggedHeaderResizer(event))
            return;
        // We use refs so that the identity of the `onResizerDragOver` callback doesn't change, so
        // that it can be removed as an event listener.
        const draggedItem = draggedItemRef.current;
        const columns = columnsRef.current;
        const deltaX = event.clientX - draggedItem.initX;
        const columnIndex = columns.findIndex(c => c.name === draggedItem.columnName);
        const initBoundary = draggedItem.initBoundaries[columnIndex];
        const minBoundary = columnIndex > 0 ? draggedItem.initBoundaries[columnIndex - 1] + 20 : 0;
        const maxBoundary = draggedItem.initBoundaries[columnIndex + 1] - 20;
        let newBoundary = initBoundary + deltaX;
        if (newBoundary < minBoundary)
            newBoundary = minBoundary;
        if (newBoundary > maxBoundary)
            newBoundary = maxBoundary;
        const newBoundaries = draggedItem.initBoundaries.slice();
        newBoundaries[columnIndex] = newBoundary;
        const newColumns = applyBoundariesToColumns(columns, newBoundaries);
        if (newColumns !== columns)
            Setting_1.default.setValue('notes.columns', newColumns);
    }, []);
    const onResizerDragEnd = (0, react_1.useCallback)(() => {
        document.removeEventListener('dragover', onResizerDragOver);
    }, [onResizerDragOver]);
    const onResizerDragStart = (0, react_1.useCallback)(event => {
        const name = event.currentTarget.getAttribute('data-name');
        setupDataTransfer(event, DataType.Resizer, emptyImage, { name });
        const headerElement = (0, dom_1.findParentElementByClassName)(event.currentTarget, 'note-list-header');
        const headerRect = headerElement.getBoundingClientRect();
        const boundaries = getColumnsToBoundaries(columns, headerRect.width);
        setDraggedItem({
            type: DataType.Resizer,
            columnName: name,
            initX: event.clientX,
            initBoundaries: boundaries,
        });
        document.addEventListener('dragover', onResizerDragOver);
    }, [columns, onResizerDragOver, emptyImage]);
    return {
        onItemDragStart,
        onItemDragOver,
        onItemDrop,
        onResizerDragStart,
        onResizerDragEnd,
        dropAt,
        draggedItem,
    };
};
//# sourceMappingURL=useDragAndDrop.js.map