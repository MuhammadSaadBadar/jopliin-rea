"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.declaration = void 0;
const locale_1 = require("@joplin/lib/locale");
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const bridge_1 = __importDefault(require("../services/bridge"));
const time_1 = require("@joplin/utils/time");
exports.declaration = {
    name: 'exportDeletionLog',
    label: () => (0, locale_1._)('Export deletion log'),
};
const getDeletionLines = async (filePath) => {
    const logFile = await shim_1.default.fsDriver().readFile(`${Setting_1.default.value('profileDir')}/${filePath}`);
    const deletionLines = logFile
        .split('\n')
        .filter(line => line.includes('DeleteAction'));
    if (!deletionLines.length)
        return '';
    return `${deletionLines.join('\n')}\n`;
};
const runtime = () => {
    return {
        execute: async () => {
            const files = await shim_1.default.fsDriver().readDirStats(Setting_1.default.value('profileDir'));
            // Get all log.txt and log-{timestamp}.txt files but ignore deletion_log.txt
            const logFiles = files.filter(f => f.path.match(/^log(-\d+)?\.txt$/gi));
            const lastOneAndCurrent = logFiles.sort().slice(logFiles.length - 2);
            let allDeletionLines = '';
            for (const file of lastOneAndCurrent) {
                const deletionLines = await getDeletionLines(file.path);
                allDeletionLines += deletionLines;
            }
            const fileName = `deletion_log_${(0, time_1.formatMsToLocal)(Date.now(), 'YYYYMMDD')}.txt`;
            const deletionLogPath = `${Setting_1.default.value('profileDir')}/${fileName}`;
            await shim_1.default.fsDriver().writeFile(deletionLogPath, allDeletionLines, 'utf8');
            await (0, bridge_1.default)().openItem(deletionLogPath);
        },
    };
};
exports.runtime = runtime;
//# sourceMappingURL=exportDeletionLog.js.map