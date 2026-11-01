"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const logger = Logger_1.default.create('announceForAccessibility');
const announceForAccessibility = (message) => {
    const id = 'joplin-announce-for-accessibility-live-region';
    let announcementArea = document.querySelector(`#${id}`);
    if (!announcementArea) {
        announcementArea = document.createElement('div');
        announcementArea.ariaLive = 'polite';
        announcementArea.role = 'status';
        announcementArea.id = id;
        announcementArea.classList.add('visually-hidden');
        document.body.appendChild(announcementArea);
    }
    else {
        // Allows messages to be re-announced.
        announcementArea.textContent = '';
    }
    // Defer the announcement. Because `aria-live: polite` causes **changes** in
    // content to be announced, a slight delay is needed when there would otherwise
    // be no change in content.
    const announce = () => {
        logger.debug('Announcing:', message);
        announcementArea.textContent = message;
    };
    shim_1.default.setTimeout(announce, 100);
};
exports.default = announceForAccessibility;
//# sourceMappingURL=announceForAccessibility.js.map