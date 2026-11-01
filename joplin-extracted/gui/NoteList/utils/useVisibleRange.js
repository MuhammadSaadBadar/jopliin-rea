"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useVisibleRange = (itemsPerLine, scrollTop, listSize, itemSize, noteCount) => {
    const startLineIndexFloat = (0, react_1.useMemo)(() => {
        return scrollTop / itemSize.height;
    }, [scrollTop, itemSize.height]);
    const endLineIndexFloat = (0, react_1.useMemo)(() => {
        return startLineIndexFloat + (listSize.height / itemSize.height);
    }, [startLineIndexFloat, listSize.height, itemSize.height]);
    const startLineIndex = (0, react_1.useMemo)(() => {
        return Math.floor(startLineIndexFloat);
    }, [startLineIndexFloat]);
    const endLineIndex = (0, react_1.useMemo)(() => {
        return Math.floor(endLineIndexFloat);
    }, [endLineIndexFloat]);
    const visibleLineCount = (0, react_1.useMemo)(() => {
        return endLineIndex - startLineIndex + 1;
    }, [endLineIndex, startLineIndex]);
    const visibleItemCount = (0, react_1.useMemo)(() => {
        return visibleLineCount * itemsPerLine;
    }, [visibleLineCount, itemsPerLine]);
    const startNoteIndex = (0, react_1.useMemo)(() => {
        return itemsPerLine * startLineIndex;
    }, [itemsPerLine, startLineIndex]);
    const endNoteIndex = (0, react_1.useMemo)(() => {
        let output = (endLineIndex + 1) * itemsPerLine - 1;
        if (output >= noteCount)
            output = noteCount - 1;
        return output;
    }, [endLineIndex, itemsPerLine, noteCount]);
    const totalLineCount = (0, react_1.useMemo)(() => {
        return Math.ceil(noteCount / itemsPerLine);
    }, [noteCount, itemsPerLine]);
    // Note: Leave this here to test the note list scroll behaviour. Also add "item.index" to the
    // rows in defaultListRenderer to check whether the value here matches what's being displayed.
    // `useScroll` can also be changed to display the effective scroll value.
    // console.info('=======================================');
    // console.info('scrollTop', scrollTop);
    // console.info('itemsPerLine', itemsPerLine);
    // console.info('listSize.height', listSize.height);
    // console.info('itemSize.height', itemSize.height);
    // console.info('startLineIndexFloat', startLineIndexFloat);
    // console.info('endLineIndexFloat', endLineIndexFloat);
    // console.info('visibleLineCount', visibleLineCount);
    // console.info('startNoteIndex', startNoteIndex);
    // console.info('endNoteIndex', endNoteIndex);
    // console.info('startLineIndex', startLineIndex);
    // console.info('endLineIndex', endLineIndex);
    // console.info('totalLineCount', totalLineCount);
    // console.info('visibleItemCount', visibleItemCount);
    // console.info('=======================================');
    return [startNoteIndex, endNoteIndex, startLineIndex, endLineIndex, totalLineCount, visibleItemCount];
};
exports.default = useVisibleRange;
//# sourceMappingURL=useVisibleRange.js.map