"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const path_1 = require("path");
const isSafeToOpen_1 = __importDefault(require("./isSafeToOpen"));
describe('isSafeToOpen', () => {
    test.each([
        { fileName: 'a.txt', expected: true },
        { fileName: 'a.json', expected: true },
        { fileName: 'a.JSON', expected: true },
        { fileName: 'a.tar.gz', expected: true },
        { fileName: 'a.exe', expected: false },
        { fileName: 'test.com', expected: false },
        { fileName: 'a.pyc', expected: false },
        { fileName: 'a.pyo', expected: false },
        { fileName: 'a.pyw', expected: false },
        { fileName: 'a.jar', expected: false },
        { fileName: 'a.bat', expected: false },
        { fileName: 'a.cmd', expected: false },
        { fileName: 'noExtension', expected: false },
    ])('should mark executable files as possibly unsafe to open (%j)', async ({ fileName, expected }) => {
        const tempDir = await (0, test_utils_1.createTempDir)();
        try {
            const fullPath = (0, path_1.join)(tempDir, fileName);
            await (0, fs_extra_1.writeFile)(fullPath, 'test');
            expect(await (0, isSafeToOpen_1.default)(fullPath)).toBe(expected);
        }
        finally {
            await (0, fs_extra_1.remove)(tempDir);
        }
    });
});
//# sourceMappingURL=isSafeToOpen.test.js.map