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
const useSyncTargetUpgrade_1 = __importDefault(require("@joplin/lib/services/synchronizer/gui/useSyncTargetUpgrade"));
const client_1 = require("react-dom/client");
const electron_1 = require("electron");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const restart_1 = __importDefault(require("../services/restart"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
function useAppCloseHandler(upgradeResult) {
    (0, react_1.useEffect)(() => {
        async function onAppClose() {
            let canClose = true;
            if (!upgradeResult.done) {
                canClose = await shim_1.default.showConfirmationDialog('The synchronisation target upgrade is still running and it is recommanded to let it finish. Close the application anyway?');
            }
            if (canClose) {
                // We set the state back to IDLE so that the app can start normally and
                // potentially the user can fix issues if any, export the data, etc.
                // The message to upgrade will show up again if they try to sync.
                Setting_1.default.setValue('sync.upgradeState', Setting_1.default.SYNC_UPGRADE_STATE_IDLE);
                await Setting_1.default.saveAll();
            }
            electron_1.ipcRenderer.send('asynchronous-message', 'appCloseReply', {
                canClose: canClose,
            });
        }
        electron_1.ipcRenderer.on('appClose', onAppClose);
        return () => {
            electron_1.ipcRenderer.off('appClose', onAppClose);
        };
    }, [upgradeResult.done]);
}
function useStyle() {
    (0, react_1.useEffect)(() => {
        const element = document.createElement('style');
        element.appendChild(document.createTextNode(`
			body {
				font-family: sans-serif;
				padding: 5px 20px;
				color: #333333;
			}

			.errorBox {
				border: 1px solid red;
				padding: 5px 20px;
				background-color: #ffeeee;
			}

			pre {
				overflow-x: scroll;
			}
		`));
        document.head.appendChild(element);
    }, []);
}
function useRestartOnDone(upgradeResult) {
    (0, react_1.useEffect)(() => {
        if (upgradeResult.done && !upgradeResult.error) {
            void (0, restart_1.default)();
        }
        // eslint-disable-next-line @seiyab/react-hooks/exhaustive-deps -- Old code before rule was applied
    }, [upgradeResult.done]);
}
function Root_UpgradeSyncTarget() {
    const upgradeResult = (0, useSyncTargetUpgrade_1.default)();
    useStyle();
    useRestartOnDone(upgradeResult);
    useAppCloseHandler(upgradeResult);
    function renderUpgradeError() {
        if (!upgradeResult.error)
            return null;
        return (React.createElement("div", { className: "errorBox" },
            React.createElement("h2", null, "Error"),
            React.createElement("p", null,
                "The sync target could not be upgraded due to an error. For support, please copy the ",
                React.createElement("em", null, "complete"),
                " content of this page and paste it in the forum: https://discourse.joplinapp.org/"),
            React.createElement("p", null, "The full error was:"),
            React.createElement("p", null, upgradeResult.error.message),
            React.createElement("pre", null, upgradeResult.error.stack)));
    }
    return (React.createElement("div", null,
        React.createElement("h2", null, "Joplin upgrade in progress..."),
        React.createElement("p", null, "Please wait while the sync target is being upgraded. It may take a few seconds or a few minutes depending on the upgrade. The application will automatically restart once it is completed."),
        renderUpgradeError()));
}
const root = (0, client_1.createRoot)(document.getElementById('react-root'));
root.render(React.createElement(Root_UpgradeSyncTarget, null));
//# sourceMappingURL=Root_UpgradeSyncTarget.js.map