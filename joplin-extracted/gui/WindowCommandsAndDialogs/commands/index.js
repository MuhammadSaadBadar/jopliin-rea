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
Object.defineProperty(exports, "__esModule", { value: true });
// AUTO-GENERATED using `gulp buildScriptIndexes`
const addNoteToWhiteboard = __importStar(require("./addNoteToWhiteboard"));
const addProfile = __importStar(require("./addProfile"));
const commandPalette = __importStar(require("./commandPalette"));
const deleteFolder = __importStar(require("./deleteFolder"));
const disableNoteEncryption = __importStar(require("./disableNoteEncryption"));
const duplicateNote = __importStar(require("./duplicateNote"));
const editAlarm = __importStar(require("./editAlarm"));
const enableNoteEncryption = __importStar(require("./enableNoteEncryption"));
const exportPdf = __importStar(require("./exportPdf"));
const globalRedo = __importStar(require("./globalRedo"));
const globalUndo = __importStar(require("./globalUndo"));
const gotoAnything = __importStar(require("./gotoAnything"));
const hideModalMessage = __importStar(require("./hideModalMessage"));
const importFrom = __importStar(require("./importFrom"));
const linkToNote = __importStar(require("./linkToNote"));
const lockEncryptedNotes = __importStar(require("./lockEncryptedNotes"));
const moveToFolder = __importStar(require("./moveToFolder"));
const newFolder = __importStar(require("./newFolder"));
const newNote = __importStar(require("./newNote"));
const newSubFolder = __importStar(require("./newSubFolder"));
const newTodo = __importStar(require("./newTodo"));
const newWhiteboard = __importStar(require("./newWhiteboard"));
const openAiChatConversation = __importStar(require("./openAiChatConversation"));
const openFolder = __importStar(require("./openFolder"));
const openFolderDialog = __importStar(require("./openFolderDialog"));
const openItem = __importStar(require("./openItem"));
const openNote = __importStar(require("./openNote"));
const openPdfViewer = __importStar(require("./openPdfViewer"));
const openTag = __importStar(require("./openTag"));
const print = __importStar(require("./print"));
const renameFolder = __importStar(require("./renameFolder"));
const renameTag = __importStar(require("./renameTag"));
const resetLayout = __importStar(require("./resetLayout"));
const restoreFolder = __importStar(require("./restoreFolder"));
const restoreNote = __importStar(require("./restoreNote"));
const revealResourceFile = __importStar(require("./revealResourceFile"));
const search = __importStar(require("./search"));
const setTags = __importStar(require("./setTags"));
const showModalMessage = __importStar(require("./showModalMessage"));
const showNoteContentProperties = __importStar(require("./showNoteContentProperties"));
const showNoteProperties = __importStar(require("./showNoteProperties"));
const showPrompt = __importStar(require("./showPrompt"));
const showPublishFolderDialog = __importStar(require("./showPublishFolderDialog"));
const showShareFolderDialog = __importStar(require("./showShareFolderDialog"));
const showShareNoteDialog = __importStar(require("./showShareNoteDialog"));
const showSpellCheckerMenu = __importStar(require("./showSpellCheckerMenu"));
const toggleAiChat = __importStar(require("./toggleAiChat"));
const toggleEditors = __importStar(require("./toggleEditors"));
const toggleLayoutMoveMode = __importStar(require("./toggleLayoutMoveMode"));
const toggleMenuBar = __importStar(require("./toggleMenuBar"));
const toggleNoteList = __importStar(require("./toggleNoteList"));
const toggleNoteType = __importStar(require("./toggleNoteType"));
const toggleNotesSortOrderField = __importStar(require("./toggleNotesSortOrderField"));
const toggleNotesSortOrderReverse = __importStar(require("./toggleNotesSortOrderReverse"));
const togglePerFolderSortOrder = __importStar(require("./togglePerFolderSortOrder"));
const toggleSideBar = __importStar(require("./toggleSideBar"));
const toggleVisiblePanes = __importStar(require("./toggleVisiblePanes"));
const toggleWhiteboardEditor = __importStar(require("./toggleWhiteboardEditor"));
const index = [
    addNoteToWhiteboard,
    addProfile,
    commandPalette,
    deleteFolder,
    disableNoteEncryption,
    duplicateNote,
    editAlarm,
    enableNoteEncryption,
    exportPdf,
    globalRedo,
    globalUndo,
    gotoAnything,
    hideModalMessage,
    importFrom,
    linkToNote,
    lockEncryptedNotes,
    moveToFolder,
    newFolder,
    newNote,
    newSubFolder,
    newTodo,
    newWhiteboard,
    openAiChatConversation,
    openFolder,
    openFolderDialog,
    openItem,
    openNote,
    openPdfViewer,
    openTag,
    print,
    renameFolder,
    renameTag,
    resetLayout,
    restoreFolder,
    restoreNote,
    revealResourceFile,
    search,
    setTags,
    showModalMessage,
    showNoteContentProperties,
    showNoteProperties,
    showPrompt,
    showPublishFolderDialog,
    showShareFolderDialog,
    showShareNoteDialog,
    showSpellCheckerMenu,
    toggleAiChat,
    toggleEditors,
    toggleLayoutMoveMode,
    toggleMenuBar,
    toggleNoteList,
    toggleNoteType,
    toggleNotesSortOrderField,
    toggleNotesSortOrderReverse,
    togglePerFolderSortOrder,
    toggleSideBar,
    toggleVisiblePanes,
    toggleWhiteboardEditor,
];
exports.default = index;
// AUTO-GENERATED using `gulp buildScriptIndexes`
//# sourceMappingURL=index.js.map