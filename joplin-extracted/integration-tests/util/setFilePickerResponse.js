"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setFilePickerResponse = (electronApp, response) => {
    return electronApp.evaluate(async ({ dialog }, response) => {
        dialog.showOpenDialog = async () => ({
            canceled: false,
            filePaths: response,
        });
        dialog.showOpenDialogSync = () => response;
    }, response);
};
exports.default = setFilePickerResponse;
//# sourceMappingURL=setFilePickerResponse.js.map