"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const constants_1 = require("./constants");
// This must be called before Electron's onReady event.
// handleCustomProtocols should be called separately, after onReady.
const registerCustomProtocols = async () => {
    const contentProtocolPrivileges = {
        supportFetchAPI: true,
        // Don't trigger mixed content warnings (see https://stackoverflow.com/a/75988466)
        secure: true,
        // Allows loading localStorage/sessionStorage and similar APIs
        standard: true,
        // Allows loading <video>/<audio> streaming elements
        stream: true,
        corsEnabled: true,
        codeCache: true,
    };
    // The plugin protocol is currently only used for serving JS and doesn't require as
    // broad privileges.
    const pluginProtocolPrivileges = {
        secure: true,
        standard: true,
    };
    electron_1.protocol.registerSchemesAsPrivileged([
        { scheme: constants_1.contentProtocolName, privileges: contentProtocolPrivileges },
        { scheme: constants_1.pluginProtocolName, privileges: pluginProtocolPrivileges },
    ]);
};
exports.default = registerCustomProtocols;
//# sourceMappingURL=registerCustomProtocols.js.map