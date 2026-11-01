"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const EmbeddingIndexer_1 = __importDefault(require("@joplin/lib/services/ai/EmbeddingIndexer"));
// Live status panel under the "Enable AI features" toggle. Polls
// EmbeddingIndexer.getStatus() while the AI section is visible.
const POLL_INTERVAL_MS = 2000;
const modelStatusLabel = (s) => {
    switch (s) {
        case 'not-started': return (0, locale_1._)('Not started');
        case 'downloading': return (0, locale_1._)('Downloading…');
        case 'downloaded': return (0, locale_1._)('Downloaded');
        case 'unavailable': return (0, locale_1._)('Unavailable on this platform');
    }
};
const indexerStateLabel = (s) => {
    switch (s) {
        case 'idle': return (0, locale_1._)('Idle');
        case 'running': return (0, locale_1._)('Indexing…');
        case 'ai-disabled': return (0, locale_1._)('AI is disabled');
        case 'index-disabled': return (0, locale_1._)('Indexing is disabled');
        case 'vector-search-unavailable': return (0, locale_1._)('Vector search is not available on this platform');
    }
};
const AiIndexStatus = () => {
    const [status, setStatus] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        let timer = null;
        // Chained setTimeout, not setInterval — keeps polls from stacking up
        // when getStatus() is slow (e.g. competing with the model load).
        const tick = async () => {
            try {
                const s = await EmbeddingIndexer_1.default.instance().getStatus();
                if (!cancelled)
                    setStatus(s);
            }
            catch (_a) {
                // Swallow: this panel is decorative.
            }
            if (!cancelled)
                timer = setTimeout(() => void tick(), POLL_INTERVAL_MS);
        };
        void tick();
        return () => {
            cancelled = true;
            if (timer)
                clearTimeout(timer);
        };
    }, []);
    if (!status)
        return null;
    return (React.createElement("div", { className: 'ai-index-status' },
        React.createElement("h3", { className: 'title' }, (0, locale_1._)('Embedding index')),
        React.createElement("dl", { className: 'rows' },
            React.createElement("dt", null, (0, locale_1._)('Model:')),
            React.createElement("dd", null, modelStatusLabel(status.modelDownloadStatus)),
            React.createElement("dt", null, (0, locale_1._)('Indexer:')),
            React.createElement("dd", null, indexerStateLabel(status.indexerState)),
            React.createElement("dt", null, (0, locale_1._)('Indexed notes:')),
            React.createElement("dd", null, `${status.notesIndexed} / ${status.totalNotes}`))));
};
exports.default = AiIndexStatus;
//# sourceMappingURL=AiIndexStatus.js.map