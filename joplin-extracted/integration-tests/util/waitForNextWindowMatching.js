"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_1 = require("@joplin/utils/time");
const waitForNextWindowMatching = (titlePattern, electronApp) => {
    return new Promise((resolve, reject) => {
        let timeout = null;
        const clearListenersAndTimeouts = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            electronApp.off('window', onWindowAdded);
            electronApp.off('close', onClose);
        };
        const onWindowAdded = async (page) => {
            const title = await page.title();
            if (title.match(titlePattern)) {
                clearListenersAndTimeouts();
                resolve(page);
            }
        };
        const onClose = () => {
            clearListenersAndTimeouts();
            reject(new Error('Target application closed.'));
        };
        electronApp.on('window', onWindowAdded);
        electronApp.on('close', onClose);
        timeout = setTimeout(async () => {
            timeout = null;
            clearListenersAndTimeouts();
            const windowTitles = await getOpenWindowTitles(electronApp);
            reject(new Error(`Opening a window timed out. Open window titles: ${JSON.stringify(windowTitles)}.`));
        }, 30 * time_1.Second);
    });
};
exports.default = waitForNextWindowMatching;
const getOpenWindowTitles = (electronApp) => {
    const windows = electronApp.windows();
    return Promise.all(windows.map(async (w) => {
        try {
            return await w.title();
        }
        catch (error) {
            return `(Error: ${error})`;
        }
    }));
};
//# sourceMappingURL=waitForNextWindowMatching.js.map