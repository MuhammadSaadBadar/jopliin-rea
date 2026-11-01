"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToMarkdown = htmlToMarkdown;
exports.formNoteToNote = formNoteToNote;
const HtmlToMd_1 = __importDefault(require("@joplin/lib/HtmlToMd"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const renderer_1 = require("@joplin/renderer");
async function htmlToMarkdown(markupLanguage, html, originalCss, parseOptions = null) {
    let newBody = '';
    if (markupLanguage === renderer_1.MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN) {
        const htmlToMd = new HtmlToMd_1.default();
        newBody = htmlToMd.parse(html, Object.assign({ preserveImageTagsWithSize: true, preserveNestedTables: true, preserveTableStyles: true, preserveColorStyles: true }, parseOptions));
        newBody = await Note_1.default.replaceResourceExternalToInternalLinks(newBody, { useAbsolutePaths: true });
    }
    else {
        newBody = await Note_1.default.replaceResourceExternalToInternalLinks(html, { useAbsolutePaths: true });
        if (originalCss)
            newBody = `<style>${originalCss}</style>\n${newBody}`;
    }
    return newBody;
}
async function formNoteToNote(formNote) {
    return {
        id: formNote.id,
        // Should also include parent_id and deleted_time so that the reducer
        // can know in which folder the note should go when saving.
        // https://discourse.joplinapp.org/t/experimental-wysiwyg-editor-in-joplin/6915/57?u=laurent
        parent_id: formNote.parent_id,
        deleted_time: formNote.deleted_time,
        is_conflict: formNote.is_conflict,
        title: formNote.title,
        body: formNote.body,
        is_locked: formNote.is_locked,
        isDecrypted: formNote.isDecrypted,
    };
}
//# sourceMappingURL=index.js.map