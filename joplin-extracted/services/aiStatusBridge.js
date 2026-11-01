"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._internal = exports.installAiStatusBridge = exports.makeAiStatusListener = void 0;
const locale_1 = require("@joplin/lib/locale");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const AiService_1 = require("@joplin/lib/services/ai/AiService");
const types_1 = require("@joplin/lib/services/plugins/api/types");
const app_reducer_1 = require("../app.reducer");
const logger = Logger_1.default.create('aiStatusBridge');
// Two local timestamps are on the same calendar day when their year, month
// and date match in the local timezone. Using components rather than a UTC
// diff means DST transitions don't accidentally count as a same-day match
// or push the boundary into the wrong day.
const isSameLocalDay = (a, b) => {
    const da = new Date(a);
    const db = new Date(b);
    return da.getFullYear() === db.getFullYear()
        && da.getMonth() === db.getMonth()
        && da.getDate() === db.getDate();
};
const readPersistedStatus = () => {
    try {
        const raw = Setting_1.default.value('ai.status');
        if (!raw)
            return (0, app_reducer_1.defaultAiStatus)();
        return Object.assign(Object.assign({}, (0, app_reducer_1.defaultAiStatus)()), raw);
    }
    catch (error) {
        logger.warn('Failed to read ai.status:', error);
        return (0, app_reducer_1.defaultAiStatus)();
    }
};
// Exported for tests: takes a store and returns the same function that
// installAiStatusBridge would register on AiService. Kept separate so a test
// can drive it without spinning up the real AiService.
const makeAiStatusListener = (store) => (update) => {
    var _a, _b;
    store.dispatch({ type: 'AI_STATUS_UPDATE', payload: update });
    if (update.degraded !== true)
        return;
    const now = Date.now();
    const state = store.getState();
    const last = (_b = (_a = state.aiStatus) === null || _a === void 0 ? void 0 : _a.lastToastShownAt) !== null && _b !== void 0 ? _b : null;
    const alreadyShownToday = last !== null && isSameLocalDay(last, now);
    if (alreadyShownToday)
        return;
    // Toast content is plain text — the popup renderer only accepts a string.
    // The clickable link lives in the persistent surfaces (ChatPanel, Settings)
    // where JSX is available.
    store.dispatch({
        type: 'TOAST_SHOW',
        value: {
            message: (0, locale_1._)('AI usage has exceeded your monthly allowance — responses are using a reduced-quality model. Credits replenish on a rolling 30-day basis. Buy more at %s.', 'https://joplincloud.com/users/me'),
            type: types_1.ToastType.Info,
        },
    });
    store.dispatch({ type: 'AI_STATUS_UPDATE', payload: { lastToastShownAt: now } });
    try {
        const persisted = Setting_1.default.value('ai.status');
        Setting_1.default.setValue('ai.status', Object.assign(Object.assign({}, persisted), { lastToastShownAt: now }));
    }
    catch (error) {
        logger.warn('Failed to persist lastToastShownAt:', error);
    }
};
exports.makeAiStatusListener = makeAiStatusListener;
const installAiStatusBridge = (store) => {
    // Seed the slice from the persisted setting so a plugin call made while
    // the sidebar and settings screen were both closed still shows a fresh
    // status the next time either is opened.
    store.dispatch({ type: 'AI_STATUS_UPDATE', payload: readPersistedStatus() });
    (0, AiService_1.setAiStatusListener)((0, exports.makeAiStatusListener)(store));
};
exports.installAiStatusBridge = installAiStatusBridge;
exports._internal = { isSameLocalDay, readPersistedStatus };
//# sourceMappingURL=aiStatusBridge.js.map