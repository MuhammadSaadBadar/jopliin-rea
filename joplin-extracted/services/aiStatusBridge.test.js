"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const test_utils_1 = require("@joplin/lib/testing/test-utils");
const aiStatusBridge_1 = require("./aiStatusBridge");
const app_reducer_1 = require("../app.reducer");
const makeStore = (aiStatus) => {
    const state = { aiStatus, toast: null };
    const dispatched = [];
    const dispatch = (action) => {
        dispatched.push(action);
        if (action.type === 'AI_STATUS_UPDATE') {
            state.aiStatus = Object.assign(Object.assign({}, state.aiStatus), action.payload);
        }
        return action;
    };
    const store = { dispatch, getState: () => state };
    return { store, dispatched };
};
const localTs = (y, m, d, h = 0, min = 0) => new Date(y, m, d, h, min, 0, 0).getTime();
describe('aiStatusBridge', () => {
    beforeEach(async () => {
        await (0, test_utils_1.setupDatabaseAndSynchronizer)(1);
        await (0, test_utils_1.switchClient)(1);
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('isSameLocalDay treats same-day timestamps as equal, cross-midnight as different', () => {
        const yesterdayLate = localTs(2026, 6, 4, 23, 59);
        const todayEarly = localTs(2026, 6, 5, 0, 1);
        const todayLate = localTs(2026, 6, 5, 23, 59);
        expect(aiStatusBridge_1._internal.isSameLocalDay(todayEarly, todayLate)).toBe(true);
        expect(aiStatusBridge_1._internal.isSameLocalDay(yesterdayLate, todayEarly)).toBe(false);
    });
    it('fires the toast on the first degraded reply after local midnight', () => {
        const yesterday = localTs(2026, 6, 4, 23, 59);
        const now = localTs(2026, 6, 5, 0, 1);
        jest.useFakeTimers().setSystemTime(now);
        const { store, dispatched } = makeStore(Object.assign(Object.assign({}, (0, app_reducer_1.defaultAiStatus)()), { lastToastShownAt: yesterday }));
        const listener = (0, aiStatusBridge_1.makeAiStatusListener)(store);
        listener({ degraded: true, tokensUsed: 100, tokensBudget: 50 });
        expect(dispatched.some(a => a.type === 'TOAST_SHOW')).toBe(true);
        const toastTimeSet = dispatched
            .filter(a => a.type === 'AI_STATUS_UPDATE')
            .some(a => a.payload.lastToastShownAt === now);
        expect(toastTimeSet).toBe(true);
        const persisted = Setting_1.default.value('ai.status');
        expect(persisted.lastToastShownAt).toBe(now);
    });
    it('does not fire the toast when a degraded reply arrives later the same local day', () => {
        const morning = localTs(2026, 6, 5, 0, 1);
        const evening = localTs(2026, 6, 5, 23, 59);
        jest.useFakeTimers().setSystemTime(evening);
        const { store, dispatched } = makeStore(Object.assign(Object.assign({}, (0, app_reducer_1.defaultAiStatus)()), { degraded: true, lastToastShownAt: morning }));
        const listener = (0, aiStatusBridge_1.makeAiStatusListener)(store);
        listener({ degraded: true, tokensUsed: 200, tokensBudget: 50 });
        expect(dispatched.some(a => a.type === 'TOAST_SHOW')).toBe(false);
        // lastToastShownAt must not be bumped when the toast doesn't fire.
        const toastTimeChanged = dispatched
            .filter(a => a.type === 'AI_STATUS_UPDATE')
            .some(a => 'lastToastShownAt' in a.payload);
        expect(toastTimeChanged).toBe(false);
    });
    it('does not fire the toast for a non-degraded reply', () => {
        jest.useFakeTimers().setSystemTime(localTs(2026, 6, 5, 12, 0));
        const { store, dispatched } = makeStore((0, app_reducer_1.defaultAiStatus)());
        const listener = (0, aiStatusBridge_1.makeAiStatusListener)(store);
        listener({ degraded: false, tokensUsed: 10, tokensBudget: 1000 });
        expect(dispatched.some(a => a.type === 'TOAST_SHOW')).toBe(false);
    });
});
//# sourceMappingURL=aiStatusBridge.test.js.map