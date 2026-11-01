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
const restoreItems_1 = __importDefault(require("@joplin/lib/services/trash/restoreItems"));
const BaseModel_1 = require("@joplin/lib/BaseModel");
const PopupNotificationProvider_1 = require("../PopupNotification/PopupNotificationProvider");
const types_1 = require("../PopupNotification/types");
const TrashNotificationMessage_1 = __importDefault(require("./TrashNotificationMessage"));
const onCancelClick = async (lastDeletion) => {
    if (lastDeletion.folderIds.length) {
        await (0, restoreItems_1.default)(BaseModel_1.ModelType.Folder, lastDeletion.folderIds);
    }
    if (lastDeletion.noteIds.length) {
        await (0, restoreItems_1.default)(BaseModel_1.ModelType.Note, lastDeletion.noteIds);
    }
};
exports.default = (props) => {
    const popupManager = (0, react_1.useContext)(PopupNotificationProvider_1.PopupNotificationContext);
    const lastDeletionNotificationTimeRef = (0, react_1.useRef)(props.lastDeletionNotificationTime);
    lastDeletionNotificationTimeRef.current = props.lastDeletionNotificationTime;
    (0, react_1.useEffect)(() => {
        const lastDeletionNotificationTime = lastDeletionNotificationTimeRef.current;
        if (!props.lastDeletion || props.lastDeletion.timestamp <= lastDeletionNotificationTime)
            return;
        props.dispatch({ type: 'DELETION_NOTIFICATION_DONE' });
        let msg = '';
        if (props.lastDeletion.folderIds.length) {
            msg = (0, locale_1._)('The notebook and its content was successfully moved to the trash.');
        }
        else if (props.lastDeletion.noteIds.length) {
            msg = (0, locale_1._n)('The note was successfully moved to the trash.', 'The notes were successfully moved to the trash.', props.lastDeletion.noteIds.length);
        }
        else {
            return;
        }
        const handleCancelClick = () => {
            notification.remove();
            void onCancelClick(props.lastDeletion);
        };
        const notification = popupManager.createPopup(() => (React.createElement(TrashNotificationMessage_1.default, { message: msg, onCancel: handleCancelClick })), { type: types_1.NotificationType.Success });
        notification.scheduleDismiss();
    }, [props.lastDeletion, props.dispatch, popupManager]);
    return React.createElement("div", { style: { display: 'none' } });
};
//# sourceMappingURL=TrashNotification.js.map