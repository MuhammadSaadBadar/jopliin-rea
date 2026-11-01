"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
exports.declaration = {
    name: 'openPdfViewer',
    label: () => (0, locale_1._)('Open PDF viewer'),
};
const runtime = () => {
    return {
        execute: async (context, resourceId, pageNo) => {
            const resource = await Resource_1.default.load(resourceId);
            if (!resource)
                throw new Error(`No such resource: ${resourceId}`);
            if (resource.mime !== 'application/pdf')
                throw new Error(`Not a PDF: ${resource.mime}`);
            context.dispatch({
                type: 'DIALOG_OPEN',
                name: 'pdfViewer',
                props: {
                    resource,
                    pageNo: pageNo,
                },
            });
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=openPdfViewer.js.map