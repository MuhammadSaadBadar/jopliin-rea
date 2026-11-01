"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initializeCommandService;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const stateToWhenClauseContext_1 = __importDefault(require("../services/commands/stateToWhenClauseContext"));
const index_1 = __importDefault(require("../gui/WindowCommandsAndDialogs/commands/index"));
const index_2 = __importDefault(require("../gui/NoteEditor/commands/index"));
const index_3 = __importDefault(require("../gui/NoteList/commands/index"));
const index_4 = __importDefault(require("../gui/NoteListControls/commands/index"));
const index_5 = __importDefault(require("../gui/Sidebar/commands/index"));
const index_6 = __importDefault(require("../commands/index"));
const index_7 = __importDefault(require("@joplin/lib/commands/index"));
const editorCommandDeclarations_1 = __importDefault(require("../gui/NoteEditor/editorCommandDeclarations"));
const commands = index_1.default
    .concat(index_2.default)
    .concat(index_3.default)
    .concat(index_4.default)
    .concat(index_5.default);
// Commands that are not tied to any particular component.
// The runtime for these commands can be loaded when the app starts.
const globalCommands = index_6.default.concat(index_7.default);
function initializeCommandService(store, devMode) {
    CommandService_1.default.instance().initialize(store, devMode, stateToWhenClauseContext_1.default);
    for (const command of commands) {
        CommandService_1.default.instance().registerDeclaration(command.declaration);
    }
    for (const command of globalCommands) {
        CommandService_1.default.instance().registerDeclaration(command.declaration);
        CommandService_1.default.instance().registerRuntime(command.declaration.name, command.runtime());
    }
    for (const declaration of editorCommandDeclarations_1.default) {
        CommandService_1.default.instance().registerDeclaration(declaration);
    }
}
//# sourceMappingURL=initializeCommandService.js.map