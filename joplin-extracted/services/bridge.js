"use strict";
// Just a convenient wrapper to get a typed bridge in TypeScript
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bridge;
const remoteBridge = require('@electron/remote').getGlobal('joplinBridge');
function bridge() {
    return remoteBridge;
}
//# sourceMappingURL=bridge.js.map