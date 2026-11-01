"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const retryOnFailure = async (callback, { maxRetries }) => {
    let lastError = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await callback();
        }
        catch (error) {
            console.error('retry failed:', error, `Retrying... ${i + 1}/${maxRetries}`);
            lastError = error;
        }
    }
    throw lastError;
};
exports.default = retryOnFailure;
//# sourceMappingURL=retryOnFailure.js.map