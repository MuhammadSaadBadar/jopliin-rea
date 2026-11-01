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
const callbackUrlUtils_1 = require("@joplin/lib/callbackUrlUtils");
const CommandService_1 = __importStar(require("@joplin/lib/services/CommandService"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const reducer_1 = require("@joplin/lib/reducer");
const bridge_1 = __importDefault(require("../../services/bridge"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('handleCallbackUrl');
// Schemes of known apps, which are allowed whatever their callback format. Add
// any legitimate app here - it's preferred over relying on the host check below.
// From https://x-callback-url.com/apps/ and https://app-talk.com/
const knownCallbackProtocols = [
    'agenda:', 'airmail:', 'bear:', 'beorg:', 'byword:', 'calca:', 'copied:',
    'dayone:', 'devonthink:', 'drafts:', 'drafts5:', 'due:', 'editorial:',
    'fantastical2:', 'gladys:', 'hook:', 'instapaper:', 'launcher:', 'omnifocus:',
    'omnifocus3:', 'onewriter:', 'opener:', 'outlinely:', 'overcast:', 'prizmo:',
    'pyto:', 'scriptable:', 'shortcutsiosopen:', 'terminology:', 'textastic:',
    'things:', 'timepage:', 'todoist:', 'trello:', 'twodo:', 'ulysses:',
    'working-copy:', 'x-devonthink:',
];
const respond = (target, params = {}) => {
    if (!target)
        return;
    // A joplin:// URL can be triggered from a web page and the target is passed to
    // the OS URI dispatcher, so it must not reach an arbitrary handler.
    let url;
    try {
        url = new URL(target);
    }
    catch (error) {
        // The target is untrusted and may contain secrets, so don't log it.
        logger.warn('Rejected malformed callback target');
        return;
    }
    if (url.host !== 'x-callback-url' && !knownCallbackProtocols.includes(url.protocol)) {
        logger.warn(`Rejected callback target with host "${url.host}" and scheme "${url.protocol}"`);
        return;
    }
    const query = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    const fragmentIndex = target.indexOf('#');
    const base = fragmentIndex === -1 ? target : target.substring(0, fragmentIndex);
    const fragment = fragmentIndex === -1 ? '' : target.substring(fragmentIndex);
    const separator = base.includes('?') ? '&' : '?';
    const responseUrl = query ? `${base}${separator}${query}${fragment}` : target;
    void (0, bridge_1.default)().openExternal(responseUrl);
};
const handleGetCurrentNote = async (params) => {
    const state = CommandService_1.utils.store.getState();
    const noteId = reducer_1.stateUtils.selectedNoteId(state);
    if (!noteId) {
        respond(params['x-error'], { errorMessage: 'No note is currently selected' });
        return;
    }
    const note = await Note_1.default.load(noteId);
    if (!note) {
        respond(params['x-error'], { errorMessage: 'The selected note could not be loaded' });
        return;
    }
    respond(params['x-success'], {
        title: note.title,
        url: (0, callbackUrlUtils_1.getNoteCallbackUrl)(note.id),
    });
};
const handleCreateNote = async (params) => {
    var _a, _b;
    const folder = await Folder_1.default.getValidActiveFolder();
    if (!folder) {
        respond(params['x-error'], { errorMessage: 'No valid notebook is available to create the note in' });
        return;
    }
    // Not provisional: an externally-requested note should persist even if unedited.
    const note = await Note_1.default.save(Object.assign(Object.assign({}, Note_1.default.previewFieldsWithDefaultValues({ includeTimestamps: false })), { title: (_a = params.title) !== null && _a !== void 0 ? _a : '', body: (_b = params.body) !== null && _b !== void 0 ? _b : '', parent_id: folder.id }));
    CommandService_1.utils.store.dispatch({ type: 'NOTE_SELECT', id: note.id });
    respond(params['x-success'], {
        title: note.title,
        url: (0, callbackUrlUtils_1.getNoteCallbackUrl)(note.id),
    });
};
// Verbs dispatched directly to CommandService by name. Kept as an explicit
// allowlist (not a catch-all) so a crafted URL can't run arbitrary commands. See 69826610a.
const openCommands = [
    "openNote" /* CallbackUrlCommand.OpenNote */,
    "openFolder" /* CallbackUrlCommand.OpenFolder */,
    "openTag" /* CallbackUrlCommand.OpenTag */,
];
const executeCallbackUrl = async (url) => {
    const info = (0, callbackUrlUtils_1.parseCallbackUrl)(url);
    if (!openCommands.includes(info.command) &&
        info.command !== "getCurrentNote" /* CallbackUrlCommand.GetCurrentNote */ &&
        info.command !== "createNote" /* CallbackUrlCommand.CreateNote */) {
        throw new Error(`Unhandled callback URL command: ${info.command}`);
    }
    try {
        if (info.command === "getCurrentNote" /* CallbackUrlCommand.GetCurrentNote */) {
            await handleGetCurrentNote(info.params);
        }
        else if (info.command === "createNote" /* CallbackUrlCommand.CreateNote */) {
            await handleCreateNote(info.params);
        }
        else {
            await CommandService_1.default.instance().execute(info.command.toString(), info.params.id);
            logger.info(`Executed callback URL command: ${info.command}`);
        }
    }
    catch (error) {
        logger.error(`Error handling callback URL command "${info.command}":`, error);
        // Return an opaque status rather than error.message, which can leak
        // profile paths and item ids to the caller-supplied x-error target.
        respond(info.params['x-error'], { errorMessage: 'The command could not be completed' });
    }
};
exports.default = executeCallbackUrl;
//# sourceMappingURL=handleCallbackUrl.js.map