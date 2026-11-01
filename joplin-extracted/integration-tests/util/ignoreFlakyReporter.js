"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Treats a run as successful when the only "failures" are flaky tests
// (tests that failed initially but passed on retry).
class IgnoreFlakyReporter {
    constructor() {
        this.hasRealFailure = false;
    }
    onTestEnd(test) {
        const status = test.outcome();
        if (status === 'unexpected') {
            this.hasRealFailure = true;
        }
    }
    async onEnd(result) {
        if (result.status === 'failed' && !this.hasRealFailure) {
            return { status: 'passed' };
        }
        return undefined;
    }
    printsToStdio() {
        return false;
    }
}
exports.default = IgnoreFlakyReporter;
//# sourceMappingURL=ignoreFlakyReporter.js.map