"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('dialogs');
class Dialogs {
    setActiveWindow(win) {
        this.activeWindow = win;
    }
    get smalltalk() {
        // The smalltalk library shows prompts in whichever document it is loaded in
        // (it uses the global document object).
        // As such, a copy of the library needs to be loaded in each window:
        if (this.activeWindow && 'smalltalk' in this.activeWindow) {
            return this.activeWindow.smalltalk;
        }
        if ('smalltalk' in window) {
            return window.smalltalk;
        }
        throw new Error('Unable to find the smalltalk library. Please make sure it has been loaded with a <script> element.');
    }
    async alert(message, title = '') {
        await this.smalltalk.alert(title, message);
    }
    async confirm(message, title = '', options = {}) {
        try {
            await this.smalltalk.confirm(title, message, options);
            return true;
        }
        catch (error) {
            logger.error(error);
            return false;
        }
    }
    async prompt(message, title = '', defaultValue = '', options = null) {
        options = Object.assign({ cancel: true }, options);
        try {
            // https://github.com/laurent22/joplin/pull/10258#discussion_r1550306545
            const answer = await this.smalltalk.prompt(title, message, defaultValue, options);
            return answer;
        }
        catch (error) {
            logger.warn('Prompt appears to have been cancelled:', error);
            return null;
        }
    }
}
const dialogs = new Dialogs();
exports.default = dialogs;
//# sourceMappingURL=dialogs.js.map