"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useWindowCommandHandler;
const react_1 = require("react");
const types_1 = require("./types");
const editorCommandDeclarations_1 = __importStar(require("../editorCommandDeclarations"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const time_1 = require("@joplin/utils/time");
const registry_1 = require("@joplin/lib/registry");
const getWindowCommandPriority_1 = __importDefault(require("./getWindowCommandPriority"));
const NewWindowOrIFrame_1 = require("../../NewWindowOrIFrame");
const commandsWithDependencies = [
    require('../commands/showLocalSearch'),
    require('../commands/focusElementNoteTitle'),
    require('../commands/focusElementNoteBody'),
    require('../commands/focusElementNoteViewer'),
    require('../commands/focusElementToolbar'),
    require('../commands/pasteAsText'),
    require('../commands/pasteAsMarkdown'),
];
function editorCommandRuntime(declaration, editorRef, onBodyChange) {
    return {
        execute: async (_context, ...args) => {
            if (!editorRef.current) {
                registry_1.reg.logger().warn('Received command, but editor is gone', declaration.name);
                return;
            }
            if (!editorRef.current.execCommand) {
                registry_1.reg.logger().warn('Received command, but editor cannot execute commands', declaration.name);
                return;
            }
            if (declaration.name === 'insertDateTime') {
                return editorRef.current.execCommand({
                    name: 'insertText',
                    value: (0, time_1.formatMsToLocal)(Date.now()),
                });
            }
            else if (declaration.name === 'scrollToHash') {
                return editorRef.current.scrollTo({
                    type: types_1.ScrollOptionTypes.Hash,
                    value: args[0],
                });
            }
            else if (declaration.name === 'editor.setText') {
                onBodyChange({ content: args[0], changeId: 0 });
            }
            else {
                return editorRef.current.execCommand({
                    name: declaration.name,
                    value: args[0],
                });
            }
        },
        // We disable the editor commands whenever a modal dialog is visible,
        // otherwise the user might type something in a dialog and accidentally
        // change something in the editor. However, we still enable them for
        // GotoAnything so that it's possible to type eg `textBold` and bold the
        // currently selected text.
        //
        // https://github.com/laurent22/joplin/issues/5707
        enabledCondition: (0, editorCommandDeclarations_1.enabledCondition)(declaration.name),
    };
}
function useWindowCommandHandler(dependencies) {
    const { setShowLocalSearch, noteSearchBarRef, editorRef, titleInputRef, onBodyChange, containerRef } = dependencies;
    const windowId = (0, react_1.useContext)(NewWindowOrIFrame_1.WindowIdContext);
    (0, react_1.useEffect)(() => {
        const getRuntimePriority = (_state, targetWindowId) => {
            return (0, getWindowCommandPriority_1.default)(containerRef, windowId === targetWindowId);
        };
        const deregisterCallbacks = [];
        for (const declaration of editorCommandDeclarations_1.default) {
            const runtime = editorCommandRuntime(declaration, editorRef, onBodyChange);
            deregisterCallbacks.push(CommandService_1.default.instance().registerRuntime(declaration.name, Object.assign(Object.assign({}, runtime), { getPriority: getRuntimePriority }), true));
        }
        const dependencies = {
            editorRef,
            setShowLocalSearch,
            noteSearchBarRef,
            titleInputRef,
            containerRef,
        };
        for (const command of commandsWithDependencies) {
            const runtime = command.runtime(dependencies);
            deregisterCallbacks.push(CommandService_1.default.instance().registerRuntime(command.declaration.name, Object.assign(Object.assign({}, runtime), { getPriority: getRuntimePriority }), true));
        }
        return () => {
            for (const runtime of deregisterCallbacks) {
                runtime.deregister();
            }
        };
    }, [editorRef, windowId, setShowLocalSearch, noteSearchBarRef, titleInputRef, onBodyChange, containerRef]);
}
//# sourceMappingURL=useWindowCommandHandler.js.map