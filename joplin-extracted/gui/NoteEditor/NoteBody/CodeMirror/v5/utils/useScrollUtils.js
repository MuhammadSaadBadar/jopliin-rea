"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useScrollUtils;
// Helper functions to sync up scrolling
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Receives dynamically-loaded CodeMirror 5 namespace; @types/codemirror's signature is too narrow for defineExtension
function useScrollUtils(CodeMirror) {
    CodeMirror.defineExtension('getScrollPercent', function () {
        const info = this.getScrollInfo();
        return info.top / (info.height - info.clientHeight);
    });
    CodeMirror.defineExtension('setScrollPercent', function (p) {
        const info = this.getScrollInfo();
        this.scrollTo(null, p * (info.height - info.clientHeight));
    });
}
//# sourceMappingURL=useScrollUtils.js.map