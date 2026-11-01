"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enableFlow_1 = require("./enableFlow");
describe('enableFlow', () => {
    test('opens the master password dialog when enabling encryption without a stored master password', () => {
        expect((0, enableFlow_1.shouldOpenMasterPasswordDialogForEnable)({
            hasMasterPassword: false,
            masterPasswordDialogOpen: false,
        })).toBe(true);
    });
    test('does not reopen the master password dialog if it is already open', () => {
        expect((0, enableFlow_1.shouldOpenMasterPasswordDialogForEnable)({
            hasMasterPassword: false,
            masterPasswordDialogOpen: true,
        })).toBe(false);
    });
    test('does not open the master password dialog when a master password already exists', () => {
        expect((0, enableFlow_1.shouldOpenMasterPasswordDialogForEnable)({
            hasMasterPassword: true,
            masterPasswordDialogOpen: false,
        })).toBe(false);
    });
    test('resumes enabling encryption after the dialog closes with a saved password', () => {
        expect((0, enableFlow_1.shouldResumeEnableAfterMasterPasswordDialog)({
            pendingEnableEncryption: true,
            wasMasterPasswordDialogOpen: true,
            masterPasswordDialogOpen: false,
            masterPassword: 'new-password',
        })).toBe(true);
    });
    test('cancels the pending enable flow if the dialog closes without a password', () => {
        expect((0, enableFlow_1.shouldCancelPendingEnableAfterMasterPasswordDialog)({
            pendingEnableEncryption: true,
            wasMasterPasswordDialogOpen: true,
            masterPasswordDialogOpen: false,
            masterPassword: '',
        })).toBe(true);
    });
    test('does not resume while the dialog is still open', () => {
        expect((0, enableFlow_1.shouldResumeEnableAfterMasterPasswordDialog)({
            pendingEnableEncryption: true,
            wasMasterPasswordDialogOpen: true,
            masterPasswordDialogOpen: true,
            masterPassword: 'new-password',
        })).toBe(false);
    });
});
//# sourceMappingURL=enableFlow.test.js.map