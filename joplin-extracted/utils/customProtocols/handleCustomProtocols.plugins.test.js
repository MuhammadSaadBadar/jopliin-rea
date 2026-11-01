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
jest.doMock('electron', () => {
    return {
        protocol: {
            handle: handleProtocolMock,
        },
        Session: jest.fn(),
    };
});
const handleCustomProtocols_1 = __importDefault(require("./handleCustomProtocols"));
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
        if (call[0] === 'joplin-plugin') {
            onRequestListener = call[1];
        }
    }
    // Should have registered the protocol
    expect(onRequestListener).toBeDefined();
    return {
        protocolHandler: protocolHandler.pluginContent,
        onRequestListener,
    };
};
describe('handleCustomProtocols.plugins', () => {
    beforeEach(() => {
        // Reset mocks between tests to ensure a clean testing environment.
        customProtocols.clear();
        handleProtocolMock.mockClear();
    });
    test('should return a 404 error response for unregistered content script paths', async () => {
        const { onRequestListener } = setUpProtocolHandler();
        const response = await onRequestListener(new Request('joplin-plugin://plugins/testing'));
        expect(response.status).toBe(404);
    });
    test('should return a 405 method not supported response for non-get requests', async () => {
        const { onRequestListener } = setUpProtocolHandler();
        const response = await onRequestListener(new Request('joplin-plugin://plugins/testing', { method: 'POST' }));
        expect(response.status).toBe(405);
    });
    test('should return a content script', async () => {
        const { protocolHandler, onRequestListener } = setUpProtocolHandler();
        const handle = protocolHandler.registerContentScript('some-id-here', 'test()');
        const response = await onRequestListener(new Request(handle.uri));
        expect(response.status).toBe(200);
        expect(await response.text()).toBe('test()');
        expect(response.headers.get('Content-Type')).toBe('application/javascript');
    });
    test('should return a 404 error after a content script has been removed', async () => {
        const { protocolHandler, onRequestListener } = setUpProtocolHandler();
        const handle = protocolHandler.registerContentScript('some-id-here', 'test()');
        handle.revoke();
        const response = await onRequestListener(new Request(handle.uri));
        expect(response.status).toBe(404);
    });
});
//# sourceMappingURL=handleCustomProtocols.plugins.test.js.map