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
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const exportDeletionLog = __importStar(require("./exportDeletionLog"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const app_reducer_1 = require("../app.reducer");
jest.mock('../services/bridge', () => ({
    __esModule: true,
    default: () => ({
        openItem: jest.fn,
    }),
}));
const logContentWithDeleteAction = `
2024-09-17 18:34:28: Running migration: 20
2024-09-17 18:34:28: DeleteAction: MigrationService: ; Item IDs: 1
2024-09-17 18:34:28: Running migration: 27
2024-09-17 18:34:28: DeleteAction: MigrationService: ; Item IDs: 2
2024-09-17 18:34:28: Running migration: 33
2024-09-17 18:34:28: SearchEngine: Updating FTS table...
2024-09-17 18:34:28: Updating items_normalized from {"updated_time":0,"id":""}
2024-09-17 18:34:28: SearchEngine: Updated FTS table in 1ms. Inserted: 0. Deleted: 0
2024-09-17 18:34:28: DeleteAction: MigrationService: ; Item IDs: 3
2024-09-17 18:34:29: Running migration: 35
2024-09-17 18:34:29: SearchEngine: Updating FTS table...
2024-09-17 18:34:29: Updating items_normalized from {"updated_time":0,"id":""}
2024-09-17 18:34:29: SearchEngine: Updated FTS table in 1ms. Inserted: 0. Deleted: 0
2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 4
2024-09-17 18:34:29: Running migration: 42
2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 5
2024-09-17 18:34:29: App: "syncInfoCache" was changed - setting up encryption related code
`;
const createFakeLogFile = async (filename, content) => {
    await shim_1.default.fsDriver().writeFile(`${Setting_1.default.value('profileDir')}/${filename}`, content, 'utf8');
};
describe('exportDeletionLog', () => {
    let state = undefined;
    beforeAll(() => {
        state = (0, app_reducer_1.createAppDefaultState)({});
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-09-18T12:00:00Z').getTime());
    });
    it('should get all deletion lines from the log file', async () => {
        await createFakeLogFile('log.txt', logContentWithDeleteAction);
        await exportDeletionLog.runtime().execute({ state, dispatch: jest.fn() });
        const result = await shim_1.default.fsDriver().readFile(`${Setting_1.default.value('profileDir')}/deletion_log_20240918.txt`, 'utf-8');
        expect(result).toBe(`2024-09-17 18:34:28: DeleteAction: MigrationService: ; Item IDs: 1
2024-09-17 18:34:28: DeleteAction: MigrationService: ; Item IDs: 2
2024-09-17 18:34:28: DeleteAction: MigrationService: ; Item IDs: 3
2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 4
2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 5
`);
    });
    it('should return a empty file if there is not deletion lines', async () => {
        await createFakeLogFile('log.txt', '');
        await exportDeletionLog.runtime().execute({ state, dispatch: jest.fn() });
        const result = await shim_1.default.fsDriver().readFile(`${Setting_1.default.value('profileDir')}/deletion_log_20240918.txt`, 'utf-8');
        expect(result).toBe('');
    });
    it('should ignore logs from log files that are not recent', async () => {
        const before = new Date('2024-09-16').getTime();
        const after = new Date('2024-09-17').getTime();
        await createFakeLogFile(`log-${before}.txt`, logContentWithDeleteAction);
        await createFakeLogFile(`log-${after}.txt`, '');
        await createFakeLogFile('log.txt', '');
        await exportDeletionLog.runtime().execute({ state, dispatch: jest.fn() });
        const result = await shim_1.default.fsDriver().readFile(`${Setting_1.default.value('profileDir')}/deletion_log_20240918.txt`, 'utf-8');
        expect(result).toBe('');
    });
    it('should contain the content from the recent log files', async () => {
        const rotateLog = new Date('2024-09-17').getTime();
        await createFakeLogFile(`log-${rotateLog}.txt`, '2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 4');
        await createFakeLogFile('log.txt', '2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 5');
        await exportDeletionLog.runtime().execute({ state, dispatch: jest.fn() });
        const result = await shim_1.default.fsDriver().readFile(`${Setting_1.default.value('profileDir')}/deletion_log_20240918.txt`, 'utf-8');
        expect(result).toBe(`2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 4
2024-09-17 18:34:29: DeleteAction: MigrationService: ; Item IDs: 5
`);
    });
    it('should contain the date in the filename', async () => {
        await shim_1.default.fsDriver().remove(`${Setting_1.default.value('profileDir')}/deletion_log_20230111.txt`);
        jest.setSystemTime(new Date('2023-01-11T12:00:00Z').getTime());
        await createFakeLogFile('log.txt', '');
        await exportDeletionLog.runtime().execute({ state, dispatch: jest.fn() });
        const exists = await shim_1.default.fsDriver().exists(`${Setting_1.default.value('profileDir')}/deletion_log_20230111.txt`);
        expect(exists).toBe(true);
    });
});
//# sourceMappingURL=exportDeletionLog.test.js.map