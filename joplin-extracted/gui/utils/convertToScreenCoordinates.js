"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = convertToScreenCoordinates;
// Converts world coordinate to screen coordinates by applying the current
// zoom. `windowContentZoomFactor` is the setting value.
function convertToScreenCoordinates(windowContentZoomFactor, o) {
    const percent = windowContentZoomFactor / 100;
    if (typeof o === 'number')
        return o * percent;
    if (typeof o === 'object' && o !== null) {
        const copy = JSON.parse(JSON.stringify(o));
        for (const k of Object.keys(copy)) {
            copy[k] = convertToScreenCoordinates(windowContentZoomFactor, copy[k]);
        }
        return copy;
    }
    throw new Error(`Cannot convert to screen coordinates: ${typeof o}`);
}
//# sourceMappingURL=convertToScreenCoordinates.js.map