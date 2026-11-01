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
exports.runtime = exports.declaration = void 0;
const eventManager_1 = __importStar(require("@joplin/lib/eventManager"));
const locale_1 = require("@joplin/lib/locale");
const reducer_1 = require("@joplin/lib/reducer");
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const time_1 = __importDefault(require("@joplin/lib/time"));
const time_2 = require("@joplin/utils/time");
exports.declaration = {
    name: 'editAlarm',
    label: () => (0, locale_1._)('Set alarm'),
    iconName: 'icon-alarm',
};
const runtime = (comp) => {
    return {
        execute: async (context, noteId = null) => {
            noteId = noteId || reducer_1.stateUtils.selectedNoteId(context.state);
            const note = await Note_1.default.load(noteId);
            const defaultDate = new Date(Date.now() + 2 * 3600 * 1000);
            defaultDate.setMinutes(0);
            defaultDate.setSeconds(0);
            comp.setState({
                promptOptions: {
                    label: (0, locale_1._)('Set alarm:'),
                    inputType: 'datetime',
                    buttons: ['ok', 'cancel', 'clear'],
                    value: note.todo_due ? (0, time_2.formatMsToDateTimeLocal)(note.todo_due) : (0, time_2.formatMsToDateTimeLocal)(defaultDate.getTime()),
                    onClose: async (answer, buttonType) => {
                        let newNote = null;
                        if (buttonType === 'clear') {
                            newNote = {
                                id: note.id,
                                todo_due: 0,
                            };
                        }
                        else if (answer !== null) {
                            newNote = {
                                id: note.id,
                                todo_due: answer,
                            };
                        }
                        if (newNote) {
                            await Note_1.default.save(newNote);
                            eventManager_1.default.emit(eventManager_1.EventName.AlarmChange, { noteId: note.id, note: newNote });
                        }
                        comp.setState({ promptOptions: null });
                    },
                },
            });
        },
        enabledCondition: 'oneNoteSelected && noteIsTodo && !noteTodoCompleted',
        mapStateToTitle: (state) => {
            const note = reducer_1.stateUtils.selectedNote(state);
            return note && note.todo_due ? time_1.default.formatMsToLocal(note.todo_due) : null;
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=editAlarm.js.map