"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useJoplinCommands;
// Helper commands added to the CodeMirror instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Receives dynamically-loaded CodeMirror 5 namespace; @types/codemirror's signature is too narrow for defineExtension
function useJoplinCommands(CodeMirror) {
    CodeMirror.defineExtension('commandExists', (name) => {
        return !!CodeMirror.commands[name];
    });
}
//# sourceMappingURL=useJoplinCommands.js.map