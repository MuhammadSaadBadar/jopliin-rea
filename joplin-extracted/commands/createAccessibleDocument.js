"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const locale_1 = require("@joplin/lib/locale");
const types_1 = require("@joplin/lib/services/database/types");
const bridge_1 = __importDefault(require("../services/bridge"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('createAccessibleDocument');
exports.declaration = {
    name: 'createAccessibleDocument',
};
const runtime = () => {
    return {
        execute: async (_context, resourceId) => {
            const resource = await Resource_1.default.load(resourceId);
            if (!resource) {
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Resource not found'));
                return;
            }
            const resourcePath = Resource_1.default.fullPath(resource);
            if (resource.mime !== 'application/pdf') {
                (0, bridge_1.default)().showInfoMessageBox((0, locale_1._)('This feature is only available for PDF files.'));
                return;
            }
            if (resource.ocr_status !== types_1.ResourceOcrStatus.Done) {
                (0, bridge_1.default)().showInfoMessageBox((0, locale_1._)('OCR is not complete. Please wait for OCR to finish before creating an accessible document.'));
                return;
            }
            const ocrDetails = resource.ocr_details;
            // If ocr_details is missing (legacy PDF processed before this feature),
            // automatically re-run OCR to get the coordinate data
            if (!ocrDetails) {
                const result = await (0, bridge_1.default)().showMessageBox((0, locale_1._)('OCR needs to run to generate an accessible document. This may take a moment. Would you like to continue?'), {
                    buttons: [(0, locale_1._)('Run OCR'), (0, locale_1._)('Cancel')],
                });
                if (result === 1)
                    return; // User cancelled
                // Trigger OCR re-run with TodoAccessible status to request full OCR details
                await Resource_1.default.save({
                    id: resource.id,
                    ocr_status: types_1.ResourceOcrStatus.TodoAccessible,
                    ocr_details: '',
                    ocr_error: '',
                    ocr_text: '',
                });
                (0, bridge_1.default)().showInfoMessageBox((0, locale_1._)('OCR has been queued. Please wait for it to complete and then try again.'));
                return;
            }
            // Show save dialog
            const defaultFilename = `${(resource.filename || resource.title || resource.id).replace(/\.pdf$/i, '')}_accessible.pdf`;
            const outputPath = await (0, bridge_1.default)().showSaveDialog({
                defaultPath: defaultFilename,
                filters: [{ name: 'PDF', extensions: ['pdf'] }],
            });
            if (!outputPath)
                return;
            try {
                await shim_1.default.createAccessiblePdf(resourcePath, ocrDetails, outputPath, Setting_1.default.value('tempDir'));
                await (0, bridge_1.default)().openItem(outputPath);
            }
            catch (error) {
                logger.error(error);
                (0, bridge_1.default)().showErrorMessageBox((0, locale_1._)('Failed to create accessible document: %s', error.message));
            }
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=createAccessibleDocument.js.map