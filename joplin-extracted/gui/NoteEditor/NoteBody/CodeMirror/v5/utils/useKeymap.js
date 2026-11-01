"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useKeymap;
const react_1 = require("react");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const registry_1 = require("@joplin/lib/registry");
const setupVim_1 = __importDefault(require("@joplin/editor/CodeMirror/utils/setupVim"));
const eventManager_1 = require("@joplin/lib/eventManager");
const normalizeAccelerator_1 = __importDefault(require("../../utils/normalizeAccelerator"));
const types_1 = require("../../utils/types");
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Receives dynamically-loaded CodeMirror 5 namespace; @types/codemirror's signature is too narrow for keymap registration
function useKeymap(CodeMirror) {
    function save() {
        void CommandService_1.default.instance().execute('synchronize');
    }
    function setupEmacs() {
        CodeMirror.keyMap.emacs['Tab'] = 'smartListIndent';
        CodeMirror.keyMap.emacs['Enter'] = 'insertListElement';
        CodeMirror.keyMap.emacs['Shift-Tab'] = 'smartListUnindent';
    }
    function isEditorCommand(command) {
        return command.startsWith('editor.');
    }
    // Converts a command of the form editor.command to just command
    function editorCommandToCodeMirror(command) {
        return command.slice(7); // 7 is the length of editor.
    }
    // Because there is sometimes a clash between these keybindings and the Joplin window ones
    // (This specifically can happen with the Ctrl-B and Ctrl-I keybindings when
    // codemirror is in contenteditable mode)
    // we will register all keypresses with the codemirror editor to guarentee they
    // work no matter where the focus is
    function registerJoplinCommand(key) {
        if (!key.command || !key.accelerator)
            return;
        let command = '';
        // We need to register Joplin commands with codemirror
        command = `joplin${key.command}`;
        // Not all commands are registered with the command service
        // (for example, the Quit command)
        // This check will ensure that codemirror only takesover the commands that are
        // see gui/KeymapConfig/getLabel.ts for more information
        const commandNames = CommandService_1.default.instance().commandNames();
        if (commandNames.includes(key.command)) {
            CodeMirror.commands[command] = () => {
                void CommandService_1.default.instance().execute(key.command);
            };
        }
        // CodeMirror and Electron have slightly different formats for defining accelerators
        const acc = (0, normalizeAccelerator_1.default)(key.accelerator, types_1.CodeMirrorVersion.CodeMirror5);
        CodeMirror.keyMap.default[acc] = command;
    }
    // Called on initialization, and whenever the keymap changes
    function registerKeymap() {
        const keymapItems = KeymapService_1.default.instance().getKeymapItems();
        // Register all commands with the codemirror editor
        // eslint-disable-next-line github/array-foreach -- Old code before rule was applied
        keymapItems.forEach((key) => { registerJoplinCommand(key); });
    }
    CodeMirror.defineExtension('supportsCommand', (cmd) => {
        return isEditorCommand(cmd.name) && editorCommandToCodeMirror(cmd.name) in CodeMirror.commands;
    });
    // Used when an editor command is executed using the CommandService.instance().execute
    // function (rather than being initiated by a keypress in the editor)
    CodeMirror.defineExtension('execCommandFromJoplin', function (cmd) {
        if (cmd.value) {
            registry_1.reg.logger().warn('CodeMirror commands cannot accept a value:', cmd);
        }
        return this.execCommand(editorCommandToCodeMirror(cmd.name));
    });
    (0, react_1.useEffect)(() => {
        // This enables the special modes (emacs and vim) to initiate sync by the save action
        CodeMirror.commands.save = save;
        CodeMirror.keyMap.basic = {
            'Left': 'goCharLeft',
            'Right': 'goCharRight',
            'Up': 'goLineUpSmart',
            'Down': 'goLineDownSmart',
            'End': 'goLineRightSmart',
            'Home': 'goLineLeftSmart',
            'PageUp': 'goPageUp',
            'PageDown': 'goPageDown',
            'Delete': 'delCharAfter',
            'Backspace': 'delCharBefore',
            'Shift-Backspace': 'delCharBefore',
            'Tab': 'smartListIndent',
            'Shift-Tab': 'smartListUnindent',
            'Enter': 'insertListElement',
            'Insert': 'toggleOverwrite',
            'Esc': 'singleSelection',
        };
        // Some keybindings are added here and not to the global registry because users
        // often expect multiple keys to bind to the same command for example, redo is mapped to
        // both Ctrl+Shift+Z AND Ctrl+Y
        // Doing this mapping here will make those commands available but will allow users to
        // override them using the KeymapService
        CodeMirror.keyMap.default = {
            // Windows / Linux
            'Ctrl-Z': 'undo',
            'Shift-Ctrl-Z': 'redo',
            'Ctrl-Y': 'redo',
            'Ctrl-Up': 'goLineUpSmart',
            'Ctrl-Down': 'goLineDownSmart',
            'Ctrl-Home': 'goDocStart',
            'Ctrl-End': 'goDocEnd',
            'Ctrl-Left': 'goGroupLeft',
            'Ctrl-Right': 'goGroupRight',
            'Alt-Left': 'goLineStart',
            'Alt-Right': 'goLineEnd',
            'Ctrl-Backspace': 'delGroupBefore',
            'Ctrl-Delete': 'delGroupAfter',
            'Ctrl-Enter': 'insertLineAfter',
            'fallthrough': 'basic',
        };
        if (shim_1.default.isMac()) {
            CodeMirror.keyMap.default = {
                // macOS
                'Shift-Cmd-Z': 'redo',
                'Cmd-Y': 'redo',
                'Cmd-End': 'goDocEnd',
                'Cmd-Down': 'goDocEnd',
                'Cmd-Home': 'goDocStart',
                'Cmd-Up': 'goDocStart',
                'Ctrl-D': 'delCharAfter',
                'Alt-Left': 'goGroupLeft',
                'Alt-Right': 'goGroupRight',
                'Ctrl-A': 'goLineStart',
                'Ctrl-E': 'goLineEnd',
                'Cmd-Left': 'goLineLeftSmart',
                'Cmd-Right': 'goLineRightSmart',
                'Alt-Backspace': 'delGroupBefore',
                'Alt-Delete': 'delGroupAfter',
                'Cmd-Backspace': 'delWrappedLineLeft',
                'Cmd-Enter': 'insertLineAfter',
                'fallthrough': 'basic',
            };
        }
        const keymapService = KeymapService_1.default.instance();
        registerKeymap();
        keymapService.on(eventManager_1.EventName.KeymapChange, registerKeymap);
        setupEmacs();
        (0, setupVim_1.default)(CodeMirror, null);
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, []);
}
//# sourceMappingURL=useKeymap.js.map