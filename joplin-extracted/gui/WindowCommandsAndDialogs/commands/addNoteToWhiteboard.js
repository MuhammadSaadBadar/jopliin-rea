"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const BaseModel_1 = require("@joplin/lib/BaseModel");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const ItemChange_1 = __importDefault(require("@joplin/lib/models/ItemChange"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const GotoAnything_1 = require("../../../plugins/GotoAnything");
const gotoAnything_1 = require("./gotoAnything");
const parse_1 = require("@joplin/lib/services/whiteboard/parse");
const serialize_1 = require("@joplin/lib/services/whiteboard/serialize");
const generateId_1 = __importDefault(require("@joplin/lib/services/whiteboard/generateId"));
const logger = Logger_1.default.create('addNoteToWhiteboard');
exports.declaration = {
    name: 'addNoteToWhiteboard',
    label: () => (0, locale_1._)('Add note to whiteboard...'),
};
// Adds a note (chosen via Goto Anything) as a card on the currently open
// whiteboard. The whiteboard is the currently selected note — the command is
// only enabled when that note contains a jsoncanvas fence.
const runtime = () => {
    return {
        execute: async (context) => {
            var _a;
            const targetId = (_a = context.state.selectedNoteIds) === null || _a === void 0 ? void 0 : _a[0];
            if (!targetId)
                return;
            // Quick gate before opening the picker — if the active note isn't
            // a whiteboard, bail out without disturbing the user.
            const initial = await Note_1.default.load(targetId);
            if (!initial)
                return;
            if (!(0, parse_1.parseWhiteboard)(initial.body || '').hasCanvas) {
                logger.warn('Active note is not a whiteboard:', targetId);
                return;
            }
            const options = { mode: GotoAnything_1.Mode.TitleOnly };
            const result = await CommandService_1.default.instance().execute('gotoAnything', gotoAnything_1.UiType.ControlledApi, options);
            if (!result)
                return;
            if (result.type !== BaseModel_1.ModelType.Note) {
                logger.warn('Selected item is not a note:', result);
                return;
            }
            // Reload the note after the picker resolves: between opening the
            // picker and now, the whiteboard editor (or a sync) may have
            // written a newer body, and we want to append onto the freshest
            // persisted state — not the snapshot we read before the prompt.
            const fresh = await Note_1.default.load(targetId);
            if (!fresh)
                return;
            const parsed = (0, parse_1.parseWhiteboard)(fresh.body || '');
            if (!parsed.hasCanvas) {
                logger.warn('Active note is no longer a whiteboard:', targetId);
                return;
            }
            // Place the new card near the centre of the existing layout, with a
            // small offset for each subsequent add so cards don't stack exactly.
            const xs = parsed.canvas.nodes.map(n => n.x + n.width / 2);
            const ys = parsed.canvas.nodes.map(n => n.y + n.height / 2);
            const cx = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
            const cy = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
            const offset = (parsed.canvas.nodes.length % 8) * 24;
            const newNode = {
                id: (0, generateId_1.default)(),
                type: 'file',
                x: cx - 120 + offset,
                y: cy - 80 + offset,
                width: 240,
                height: 160,
                file: `:/${result.item.id}`,
            };
            const nextCanvas = Object.assign(Object.assign({}, parsed.canvas), { nodes: [...parsed.canvas.nodes, newNode] });
            const newBody = (0, serialize_1.serializeWhiteboard)(fresh.body || '', nextCanvas);
            // Pass user_updated_time so the save layer can detect concurrent
            // edits (the whiteboard editor's own debounced save, or a sync
            // write between Note.load above and Note.save here). Mirrors the
            // linked-note write path in FileNode.tsx.
            await Note_1.default.save(Object.assign({ id: targetId, body: newBody }, (fresh.user_updated_time ? { user_updated_time: fresh.user_updated_time } : {})), { changeSource: ItemChange_1.default.SOURCE_UNSPECIFIED });
        },
        enabledCondition: 'oneNoteSelected && activeNoteIsWhiteboard && !noteIsReadOnly',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=addNoteToWhiteboard.js.map