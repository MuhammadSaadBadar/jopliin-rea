"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldCancelPendingEnableAfterMasterPasswordDialog = exports.shouldResumeEnableAfterMasterPasswordDialog = exports.shouldOpenMasterPasswordDialogForEnable = void 0;
const shouldOpenMasterPasswordDialogForEnable = ({ hasMasterPassword, masterPasswordDialogOpen }) => {
    return !hasMasterPassword && !masterPasswordDialogOpen;
};
exports.shouldOpenMasterPasswordDialogForEnable = shouldOpenMasterPasswordDialogForEnable;
const shouldResumeEnableAfterMasterPasswordDialog = ({ pendingEnableEncryption, wasMasterPasswordDialogOpen, masterPasswordDialogOpen, masterPassword }) => {
    return pendingEnableEncryption && wasMasterPasswordDialogOpen && !masterPasswordDialogOpen && !!masterPassword;
};
exports.shouldResumeEnableAfterMasterPasswordDialog = shouldResumeEnableAfterMasterPasswordDialog;
const shouldCancelPendingEnableAfterMasterPasswordDialog = ({ pendingEnableEncryption, wasMasterPasswordDialogOpen, masterPasswordDialogOpen, masterPassword }) => {
    return pendingEnableEncryption && wasMasterPasswordDialogOpen && !masterPasswordDialogOpen && !masterPassword;
};
exports.shouldCancelPendingEnableAfterMasterPasswordDialog = shouldCancelPendingEnableAfterMasterPasswordDialog;
//# sourceMappingURL=enableFlow.js.map