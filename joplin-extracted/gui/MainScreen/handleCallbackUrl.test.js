"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandService_1 = require("@joplin/lib/services/CommandService");
const handleCallbackUrl_1 = __importDefault(require("./handleCallbackUrl"));
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const mockOpenExternal = jest.fn();
jest.mock('../../services/bridge', () => ({
    __esModule: true,
    default: () => ({
        openExternal: (url) => mockOpenExternal(url),
    }),
}));
const setSelectedNoteId = (noteId) => {
    // A null id makes handleGetCurrentNote take its x-error branch, which reaches
    // respond() without touching the database.
    CommandService_1.utils.store = {
        getState: () => ({ selectedNoteIds: noteId ? [noteId] : [] }),
    };
};
describe('handleCallbackUrl', () => {
    beforeEach(() => {
        mockOpenExternal.mockClear();
        setSelectedNoteId(null);
    });
    test.each([
        'ms-msdt:/id PCWDiagnostic',
        'search-ms:query=secret',
        'shell:startup',
        'file:///etc/passwd',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'mailto:someone@example.com',
        'http://example.com/cb',
        'https://example.com/cb',
        'unknown-app://attacker.example.com/cb',
        'unknown-app:///hostless',
        'not a url',
    ])('should not dispatch an unrecognised callback target (%s)', async (target) => {
        await (0, test_utils_1.withWarningSilenced)(/Rejected malformed callback|Rejected callback target with host/, async () => {
            await (0, handleCallbackUrl_1.default)(`joplin://x-callback-url/getCurrentNote?x-error=${encodeURIComponent(target)}`);
        }, { requireWarning: true });
        expect(mockOpenExternal).not.toHaveBeenCalled();
    });
    test.each([
        'hook://x-callback-url/setCurrentNode',
        'drafts://x-callback-url/create',
        'bear://x-callback-url/open-note',
        'ulysses://x-callback-url/new-sheet',
        'new-app://x-callback-url/cb',
        'editorial://workflow-callback',
        'things:///add',
    ])('should dispatch a recognised callback target (%s)', async (target) => {
        await (0, handleCallbackUrl_1.default)(`joplin://x-callback-url/getCurrentNote?x-error=${encodeURIComponent(target)}`);
        expect(mockOpenExternal).toHaveBeenCalledTimes(1);
        expect(mockOpenExternal.mock.calls[0][0]).toContain(`${target}?`);
    });
    it('should not leak the raw error message on the error path', async () => {
        // Force a throw inside the try block so the catch path builds the response.
        CommandService_1.utils.store = {
            getState: () => { throw new Error('secret path /home/victim/.config/joplin/database.sqlite'); },
        };
        await (0, test_utils_1.withWarningSilenced)(/Error handling callback URL command "getCurrentNote":.*secret path \/home\/victim/, async () => {
            await (0, handleCallbackUrl_1.default)(`joplin://x-callback-url/getCurrentNote?x-error=${encodeURIComponent('hook://x-callback-url/cb')}`);
        }, { requireWarning: true });
        expect(mockOpenExternal).toHaveBeenCalledTimes(1);
        const responseUrl = mockOpenExternal.mock.calls[0][0];
        expect(responseUrl).not.toContain('secret path');
        expect(responseUrl).not.toContain('database.sqlite');
        expect(new URL(responseUrl).searchParams.get('errorMessage')).toBe('The command could not be completed');
    });
});
//# sourceMappingURL=handleCallbackUrl.test.js.map