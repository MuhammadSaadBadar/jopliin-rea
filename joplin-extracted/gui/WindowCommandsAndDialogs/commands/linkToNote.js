"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const locale_1 = require("@joplin/lib/locale");
const GotoAnything_1 = require("../../../plugins/GotoAnything");
const gotoAnything_1 = require("./gotoAnything");
const BaseModel_1 = require("@joplin/lib/BaseModel");
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const markdownUtils_1 = __importDefault(require("@joplin/lib/markdownUtils"));
const logger = Logger_1.default.create('linkToNote');
exports.declaration = {
    name: 'linkToNote',
    label: () => (0, locale_1._)('Link to note...'),
    iconName: 'fas fa-file-export',
};
const runtime = () => {
    return {
        execute: async (_context) => {
            const options = {
                mode: GotoAnything_1.Mode.TitleOnly,
                alwaysShowHelp: true,
            };
            const result = await CommandService_1.default.instance().execute('gotoAnything', gotoAnything_1.UiType.ControlledApi, options);
            if (!result)
                return result;
            if (result.type !== BaseModel_1.ModelType.Note) {
                logger.warn('Retrieved item is not a note:', result);
                return null;
            }
            const link = `[${markdownUtils_1.default.escapeTitleText(result.item.title)}](:/${markdownUtils_1.default.escapeLinkUrl(result.item.id)})`;
            await CommandService_1.default.instance().execute('insertText', link);
            return result;
        },
        enabledCondition: 'oneNoteSelected && (markdownEditorPaneVisible || richTextEditorVisible) && !noteIsReadOnly && !noteIsDeleted',
    };
};
exports.runtime = runtime;
//# sourceMappingURL=linkToNote.js.map