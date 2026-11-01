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
exports.default = QuitSyncDialog;
const React = __importStar(require("react"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const locale_1 = require("@joplin/lib/locale");
const bridge_1 = __importDefault(require("../services/bridge"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const DialogButtonRow_1 = __importDefault(require("./DialogButtonRow"));
const styled_components_1 = __importDefault(require("styled-components"));
const registry_1 = require("@joplin/lib/registry");
const Synchronizer_1 = __importDefault(require("@joplin/lib/Synchronizer"));
const StyledContent = styled_components_1.default.div `
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	min-width: 300px;
`;
const StyledMessage = styled_components_1.default.div `
	margin-bottom: 16px;
	text-align: center;
`;
function QuitSyncDialog(props) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const showDialog = (0, react_redux_1.useSelector)((state) => state.showQuitSyncDialog);
    const syncPending = (0, react_redux_1.useSelector)((state) => state.syncPending);
    const syncStarted = (0, react_redux_1.useSelector)((state) => state.syncStarted);
    // Auto-quit when sync completes
    (0, react_1.useEffect)(() => {
        if (showDialog && !syncPending) {
            dispatch({ type: 'QUIT_SYNC_DIALOG_CLOSE' });
            void (0, bridge_1.default)().electronApp().quit();
        }
    }, [showDialog, syncPending, dispatch]);
    // Trigger immediate sync when dialog opens if not already syncing
    // If the sync process schedules another sync automatically, this hook will trigger another sync immediately, instead of having to wait the syncAsYouTypeInterval
    // That is because this triggers when sync completed is emitted, but if another sync is not scheduled, the app quits via the other hook when syncPending is reset to false just after
    (0, react_1.useEffect)(() => {
        if (showDialog && syncPending && !syncStarted) {
            void registry_1.reg.scheduleSync(0, { syncSteps: Synchronizer_1.default.partialSyncSteps });
        }
    }, [showDialog, syncPending, syncStarted]);
    if (!showDialog)
        return null;
    const handleCancel = (_event) => {
        dispatch({ type: 'QUIT_SYNC_DIALOG_CLOSE' });
    };
    const handleQuitAnyway = (_event) => {
        dispatch({ type: 'QUIT_SYNC_DIALOG_CLOSE' });
        void (0, bridge_1.default)().electronApp().quit();
    };
    const dialogButtonOnClick = (event) => {
        if (event.buttonName === 'ok') {
            handleQuitAnyway(event);
        }
        else if (event.buttonName === 'cancel') {
            handleCancel(event);
        }
    };
    return (React.createElement(Dialog_1.default, null,
        React.createElement(StyledContent, null,
            React.createElement(StyledMessage, null, (0, locale_1._)('Synchronising remaining changes, please wait...')),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: dialogButtonOnClick, okButtonLabel: (0, locale_1._)('Quit anyway'), cancelButtonLabel: (0, locale_1._)('Cancel') }))));
}
//# sourceMappingURL=QuitSyncDialog.js.map