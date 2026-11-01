"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getImageSourceSize = async (imageLocator) => {
    // Use state: 'attached' -- we don't need the image to be on the screen (just present
    // in the DOM).
    await imageLocator.waitFor({ state: 'attached' });
    // We load a copy of the image to avoid returning an overriden width set with
    //    .width = some_number
    return await imageLocator.evaluate((originalImage) => {
        return new Promise(resolve => {
            const testImage = new Image();
            testImage.onload = () => {
                resolve([testImage.width, testImage.height]);
            };
            testImage.src = originalImage.src;
        });
    });
};
exports.default = getImageSourceSize;
//# sourceMappingURL=getImageSourceSize.js.map