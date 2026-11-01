"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollOptionTypes = exports.NoteBodyEditorType = void 0;
exports.defaultFormNote = defaultFormNote;
var NoteBodyEditorType;
(function (NoteBodyEditorType) {
    NoteBodyEditorType["CodeMirror6"] = "CodeMirror6";
    NoteBodyEditorType["CodeMirror5"] = "CodeMirror5";
    NoteBodyEditorType["TinyMce"] = "TinyMCE";
    NoteBodyEditorType["PlainText"] = "PlainText";
})(NoteBodyEditorType || (exports.NoteBodyEditorType = NoteBodyEditorType = {}));
function defaultFormNote() {
    return {
        id: '',
        parent_id: '',
        deleted_time: 0,
        title: '',
        body: '',
        is_todo: 0,
        markup_language: 1,
        bodyWillChangeId: 0,
        bodyChangeId: 0,
        saveActionQueue: null,
        originalCss: '',
        hasChanged: false,
        user_updated_time: 0,
        encryption_applied: 0,
        is_locked: 0,
        noteLockKey: null,
        isDecrypted: false,
    };
}
var ScrollOptionTypes;
(function (ScrollOptionTypes) {
    ScrollOptionTypes[ScrollOptionTypes["None"] = 0] = "None";
    ScrollOptionTypes[ScrollOptionTypes["Hash"] = 1] = "Hash";
    ScrollOptionTypes[ScrollOptionTypes["Percent"] = 2] = "Percent";
})(ScrollOptionTypes || (exports.ScrollOptionTypes = ScrollOptionTypes = {}));
//# sourceMappingURL=types.js.map