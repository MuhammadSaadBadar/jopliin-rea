"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeMirrorVersion = void 0;
exports.defaultRenderedBody = defaultRenderedBody;
function defaultRenderedBody() {
    return {
        html: '',
        pluginAssets: [],
    };
}
var CodeMirrorVersion;
(function (CodeMirrorVersion) {
    CodeMirrorVersion[CodeMirrorVersion["CodeMirror5"] = 0] = "CodeMirror5";
    CodeMirrorVersion[CodeMirrorVersion["CodeMirror6"] = 1] = "CodeMirror6";
})(CodeMirrorVersion || (exports.CodeMirrorVersion = CodeMirrorVersion = {}));
//# sourceMappingURL=types.js.map