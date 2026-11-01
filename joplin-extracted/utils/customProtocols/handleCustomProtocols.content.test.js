"use strict";
/** @jest-environment node */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customProtocols = new Map();
const handleProtocolMock = jest.fn((scheme, handler) => {
    customProtocols.set(scheme, handler);
});
const fetchMock = jest.fn(async (url) => new Response(`Mock response to ${url}`));
jest.doMock('electron', () => {
    return {
        net: {
            fetch: fetchMock,
        },
        protocol: {
            handle: handleProtocolMock,
        },
        Session: jest.fn(),
    };
});
const handleCustomProtocols_1 = __importDefault(require("./handleCustomProtocols"));
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const path_2 = require("@joplin/utils/path");
const setUpProtocolHandler = () => {
    const mockSession = {
        protocol: {
            handle: handleProtocolMock,
        },
    };
    const protocolHandler = (0, handleCustomProtocols_1.default)(mockSession);
    expect(handleProtocolMock).toHaveBeenCalled();
    let onRequestListener;
    for (const call of handleProtocolMock.mock.calls) {
        if (call[0] === 'joplin-content') {
            // The request listener is the second argument:
            onRequestListener = call[1];
        }
    }
    // Should have registered the protocol
    expect(onRequestListener).toBeDefined();
    return {
        appProtocolHandler: protocolHandler.appContent,
        onRequestListener,
    };
};
// Although none of the paths in this test suite point to real files, file paths must be in
// a certain format on Windows to avoid invalid path exceptions.
const toPlatformPath = (path) => process.platform === 'win32' ? `C:/${path}` : path;
const toAccessUrl = (path, { host = 'note-viewer' } = {}) => {
    return `joplin-content://${host}/${toPlatformPath(path)}`;
};
const expectPathToBeBlocked = async (onRequestListener, filePath, options) => {
    const url = toAccessUrl(filePath, options);
    const response = await onRequestListener(new Request(url));
    expect(response.status).toBe(403); // Forbidden
};
const expectPathToBeUnblocked = async (onRequestListener, filePath, options) => {
    const url = toAccessUrl(filePath, options);
    const handleRequestResult = await onRequestListener(new Request(url));
    expect(handleRequestResult.body).toBeTruthy();
};
describe('handleCustomProtocols.content', () => {
    beforeEach(() => {
        // Reset mocks between tests to ensure a clean testing environment.
        customProtocols.clear();
        handleProtocolMock.mockClear();
        fetchMock.mockClear();
    });
    test('should only allow access to files in allowed directories', async () => {
        const { appProtocolHandler: protocolHandler, onRequestListener } = setUpProtocolHandler();
        await expectPathToBeBlocked(onRequestListener, '/test/path');
        await expectPathToBeBlocked(onRequestListener, '/');
        protocolHandler.allowReadAccessToDirectory(toPlatformPath('/test/path/'));
        await expectPathToBeUnblocked(onRequestListener, '/test/path');
        await expectPathToBeUnblocked(onRequestListener, '/test/path/a.txt');
        await expectPathToBeUnblocked(onRequestListener, '/test/path/b.txt');
        await expectPathToBeBlocked(onRequestListener, '/');
        await expectPathToBeBlocked(onRequestListener, '/test/path2');
        await expectPathToBeBlocked(onRequestListener, '/test/path/../a.txt');
        protocolHandler.allowReadAccessToDirectory(toPlatformPath('/another/path/here'));
        await expectPathToBeBlocked(onRequestListener, '/another/path/here2');
        await expectPathToBeUnblocked(onRequestListener, '/another/path/here');
        await expectPathToBeUnblocked(onRequestListener, '/another/path/here/2');
    });
    test('should be possible to allow and remove read access for a file', async () => {
        const { appProtocolHandler: protocolHandler, onRequestListener } = setUpProtocolHandler();
        await expectPathToBeBlocked(onRequestListener, '/test/path/a.txt');
        const handle1 = protocolHandler.allowReadAccessToFile('/test/path/a.txt');
        await expectPathToBeUnblocked(onRequestListener, '/test/path/a.txt');
        const handle2 = protocolHandler.allowReadAccessToFile('/test/path/a.txt');
        await expectPathToBeUnblocked(onRequestListener, '/test/path/a.txt');
        handle1.remove();
        await expectPathToBeUnblocked(onRequestListener, '/test/path/a.txt');
        handle2.remove();
        await expectPathToBeBlocked(onRequestListener, '/test/path/a.txt');
    });
    test('should only allow access to file-media/ URLs when given the correct access key', async () => {
        const { appProtocolHandler: protocolHandler, onRequestListener } = setUpProtocolHandler();
        const expectBlocked = (path) => {
            return expectPathToBeBlocked(onRequestListener, path, { host: 'file-media' });
        };
        const expectUnblocked = (path) => {
            return expectPathToBeUnblocked(onRequestListener, path, { host: 'file-media' });
        };
        fetchMock.mockImplementation(async (_url) => {
            return new Response('', { headers: { 'Content-Type': 'image/jpeg' } });
        });
        const testPath = (0, path_1.join)(test_utils_1.supportDir, 'photo.jpg');
        await expectBlocked(testPath);
        await expectBlocked(`${testPath}?access-key=wrongKey`);
        await expectBlocked(`${testPath}?access-key=false`);
        protocolHandler.setMediaAccessEnabled(true);
        const key = protocolHandler.getMediaAccessKey();
        await expectUnblocked(`${testPath}?access-key=${key}`);
        await expectBlocked(`${testPath}?access-key=null`);
        protocolHandler.setMediaAccessEnabled(false);
        await expectBlocked(`${testPath}?access-key=${key}`);
    });
    test('should allow requesting part of a file', async () => {
        const { appProtocolHandler: protocolHandler, onRequestListener } = setUpProtocolHandler();
        protocolHandler.allowReadAccessToDirectory(`${test_utils_1.supportDir}/`);
        const targetFilePath = (0, path_1.join)(test_utils_1.supportDir, 'photo.jpg');
        const targetUrl = `joplin-content://note-viewer/${(0, path_2.toForwardSlashes)(targetFilePath)}`;
        // Should return correct headers for an in-range response,
        let response = await onRequestListener(new Request(targetUrl, { headers: { 'Range': 'bytes=10-20' } }));
        expect(response.status).toBe(206); // Partial content
        expect(response.headers.get('Accept-Ranges')).toBe('bytes');
        expect(response.headers.get('Content-Type')).toBe('image/jpeg');
        expect(response.headers.get('Content-Length')).toBe('11');
        const targetStats = await (0, fs_extra_1.stat)(targetFilePath);
        expect(response.headers.get('Content-Range')).toBe(`bytes 10-20/${targetStats.size}`);
        // Should return correct headers for an out-of-range response,
        response = await onRequestListener(new Request(targetUrl, { headers: { 'Range': 'bytes=99999999999999-999999999999990' } }));
        expect(response.status).toBe(416); // Out of range
    });
});
//# sourceMappingURL=handleCustomProtocols.content.test.js.map