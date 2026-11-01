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
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const theme_1 = require("@joplin/lib/theme");
const locale_1 = require("@joplin/lib/locale");
const path_utils_1 = require("@joplin/lib/path-utils");
const import_enex_1 = __importDefault(require("@joplin/lib/import-enex"));
const react_redux_1 = require("react-redux");
class ImportScreenComponent extends React.Component {
    UNSAFE_componentWillMount() {
        this.setState({
            doImport: true,
            filePath: this.props.filePath,
            messages: [],
        });
    }
    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.filePath) {
            this.setState({
                doImport: true,
                filePath: newProps.filePath,
                messages: [],
            }, () => {
                void this.doImport();
            });
        }
    }
    componentDidMount() {
        if (this.state.filePath && this.state.doImport) {
            void this.doImport();
        }
    }
    addMessage(key, text) {
        const messages = this.state.messages.slice();
        messages.push({ key: key, text: text });
        this.setState({ messages: messages });
    }
    uniqueMessages() {
        const output = [];
        const messages = this.state.messages.slice();
        const foundKeys = [];
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (foundKeys.indexOf(msg.key) >= 0)
                continue;
            foundKeys.push(msg.key);
            output.unshift(msg);
        }
        return output;
    }
    async doImport() {
        const filePath = this.props.filePath;
        const folderTitle = await Folder_1.default.findUniqueItemTitle((0, path_utils_1.filename)(filePath));
        this.addMessage('start', (0, locale_1._)('New notebook "%s" will be created and file "%s" will be imported into it', folderTitle, (0, path_utils_1.basename)(filePath)));
        let lastProgress = '';
        const options = {
            onProgress: (progressState) => {
                const line = [];
                line.push((0, locale_1._)('Found: %d.', progressState.loaded));
                line.push((0, locale_1._)('Created: %d.', progressState.created));
                if (progressState.updated)
                    line.push((0, locale_1._)('Updated: %d.', progressState.updated));
                if (progressState.skipped)
                    line.push((0, locale_1._)('Skipped: %d.', progressState.skipped));
                if (progressState.resourcesCreated)
                    line.push((0, locale_1._)('Resources: %d.', progressState.resourcesCreated));
                if (progressState.notesTagged)
                    line.push((0, locale_1._)('Tagged: %d.', progressState.notesTagged));
                lastProgress = line.join(' ');
                this.addMessage('progress', lastProgress);
            },
            onError: (error) => {
                // Don't display the error directly because most of the time it doesn't matter
                // (eg. for weird broken HTML, but the note is still imported)
                console.warn('When importing ENEX file', error);
            },
        };
        const folder = await Folder_1.default.save({ title: folderTitle });
        await (0, import_enex_1.default)(folder.id, filePath, options);
        this.addMessage('done', (0, locale_1._)('The notes have been imported: %s', lastProgress));
        this.setState({ doImport: false });
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const messages = this.uniqueMessages();
        const messagesStyle = {
            padding: 10,
            fontSize: theme.fontSize,
            fontFamily: theme.fontFamily,
            backgroundColor: theme.backgroundColor,
        };
        const messageComps = [];
        for (let i = 0; i < messages.length; i++) {
            messageComps.push(React.createElement("div", { key: messages[i].key }, messages[i].text));
        }
        return (React.createElement("div", { style: {} },
            React.createElement("div", { style: messagesStyle }, messageComps)));
    }
}
const mapStateToProps = (state) => {
    return {
        themeId: state.settings.theme,
    };
};
const ImportScreen = (0, react_redux_1.connect)(mapStateToProps)(ImportScreenComponent);
exports.default = ImportScreen;
//# sourceMappingURL=ImportScreen.js.map