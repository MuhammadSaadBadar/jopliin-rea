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
exports.Mode = void 0;
const React = __importStar(require("react"));
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const KeymapService_1 = __importDefault(require("@joplin/lib/services/KeymapService"));
const react_redux_1 = require("react-redux");
const locale_1 = require("@joplin/lib/locale");
const theme_1 = require("@joplin/lib/theme");
const SearchEngine_1 = __importDefault(require("@joplin/lib/services/search/SearchEngine"));
const gotoAnythingStyleQuery_1 = __importDefault(require("@joplin/lib/services/search/gotoAnythingStyleQuery"));
const BaseModel_1 = __importStar(require("@joplin/lib/BaseModel"));
const Tag_1 = __importDefault(require("@joplin/lib/models/Tag"));
const Folder_1 = __importDefault(require("@joplin/lib/models/Folder"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const ItemList_1 = __importDefault(require("../gui/ItemList"));
const HelpButton_1 = __importDefault(require("../gui/HelpButton"));
const string_utils_1 = require("@joplin/lib/string-utils");
const ArrayUtils_1 = require("@joplin/lib/ArrayUtils");
const markupLanguageUtils_1 = __importDefault(require("@joplin/lib/utils/markupLanguageUtils"));
const focusEditorIfEditorCommand_1 = __importDefault(require("@joplin/lib/services/commands/focusEditorIfEditorCommand"));
const Logger_1 = __importDefault(require("@joplin/utils/Logger"));
const renderer_1 = require("@joplin/renderer");
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const AsyncActionQueue_1 = __importDefault(require("@joplin/lib/AsyncActionQueue"));
const logger = Logger_1.default.create('GotoAnything');
const PLUGIN_NAME = 'gotoAnything';
// GotoAnything supports several modes:
//
// - Default: Search in note title, body. Can search for folders, tags, etc. This is the full
//   featured GotoAnything.
//
// - TitleOnly: Search in note titles only.
//
// These different modes can be set from the `gotoAnything` command.
var Mode;
(function (Mode) {
    Mode[Mode["Default"] = 0] = "Default";
    Mode[Mode["TitleOnly"] = 1] = "TitleOnly";
})(Mode || (exports.Mode = Mode = {}));
const getContentMarkupLanguageAndBody = (result, notesById, resources) => {
    if (result.item_type === BaseModel_1.ModelType.Resource) {
        const resource = resources.find(r => r.id === result.item_id);
        if (!resource) {
            logger.warn('Could not find resources associated with result:', result);
            return { markupLanguage: renderer_1.MarkupLanguage.Markdown, content: '' };
        }
        else {
            return { markupLanguage: renderer_1.MarkupLanguage.Markdown, content: resource.ocr_text };
        }
    }
    else { // a note
        const note = notesById[result.id];
        return { markupLanguage: note.markup_language, content: note.body };
    }
};
// A result row contains an `id` property (the note ID) and, if the current row
// is a resource, an `item_id` property, which is the resource ID. In that case,
// the row also has an `id` property, which is the note that contains the
// resource.
//
// It means a result set may include multiple results with the same `id`
// property, if it contains one or more resources that are in a note that's
// already in the result set. For that reason, when we need a unique ID for the
// result, we use this function - which returns either the item_id, if present,
// or the note ID.
const getResultId = (result) => {
    // This ID used as a DOM ID for accessibility purposes, so it is prefixed to prevent
    // name collisions.
    return `goto-anything-result-${result.item_id ? result.item_id : result.id}`;
};
const itemListId = 'goto-anything-item-list';
class GotoAnything {
    onTrigger(event) {
        this.dispatch({
            type: 'PLUGINLEGACY_DIALOG_SET',
            open: true,
            pluginName: PLUGIN_NAME,
            userData: event.userData,
        });
    }
}
class DialogComponent extends React.PureComponent {
    constructor(props) {
        var _a, _b, _c, _d, _e;
        super(props);
        this.userCallback_ = null;
        this.lastMouseCoords_ = null;
        this.modalLayer_onDismiss = () => {
            this.props.dispatch({
                pluginName: PLUGIN_NAME,
                type: 'PLUGINLEGACY_DIALOG_SET',
                open: false,
            });
        };
        const startString = ((_a = props === null || props === void 0 ? void 0 : props.userData) === null || _a === void 0 ? void 0 : _a.startString) ? (_b = props === null || props === void 0 ? void 0 : props.userData) === null || _b === void 0 ? void 0 : _b.startString : '';
        this.userCallback_ = (_c = props === null || props === void 0 ? void 0 : props.userData) === null || _c === void 0 ? void 0 : _c.callback;
        this.listUpdateQueue_ = new AsyncActionQueue_1.default(100);
        this.mode_ = ((_d = props === null || props === void 0 ? void 0 : props.userData) === null || _d === void 0 ? void 0 : _d.mode) ? props.userData.mode : Mode.Default;
        this.alwaysShowHelp_ = !!((_e = props === null || props === void 0 ? void 0 : props.userData) === null || _e === void 0 ? void 0 : _e.alwaysShowHelp);
        this.state = {
            query: startString,
            results: [],
            selectedItemId: null,
            keywords: [],
            listType: BaseModel_1.default.TYPE_NOTE,
            showHelp: false,
            resultsInBody: false,
            commandArgs: [],
        };
        this.styles_ = {};
        this.inputRef = React.createRef();
        this.itemListRef = React.createRef();
        this.input_onChange = this.input_onChange.bind(this);
        this.input_onKeyDown = this.input_onKeyDown.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.listItem_onClick = this.listItem_onClick.bind(this);
        this.listItem_onMouseMove = this.listItem_onMouseMove.bind(this);
        this.helpButton_onClick = this.helpButton_onClick.bind(this);
        if (startString)
            this.scheduleListUpdate();
    }
    style() {
        const styleKey = [this.props.themeId, this.state.listType, this.state.resultsInBody ? '1' : '0'].join('-');
        if (this.styles_[styleKey])
            return this.styles_[styleKey];
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        let itemHeight = this.state.resultsInBody ? 84 : 64;
        if (this.state.listType === BaseModel_1.default.TYPE_COMMAND) {
            itemHeight = 40;
        }
        this.styles_[styleKey] = {
            dialogBox: Object.assign(Object.assign({}, theme.dialogBox), { minWidth: '50%', maxWidth: '50%' }),
            input: Object.assign(Object.assign({}, theme.inputStyle), { flex: 1 }),
            row: {
                overflow: 'hidden',
                height: itemHeight,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                paddingLeft: 10,
                paddingRight: 10,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: theme.dividerColor,
                boxSizing: 'border-box',
            },
            inputHelpWrapper: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
        };
        delete this.styles_[styleKey].dialogBox.maxHeight;
        const rowTextStyle = {
            fontSize: theme.fontSize,
            color: theme.color,
            fontFamily: theme.fontFamily,
            whiteSpace: 'nowrap',
            opacity: 0.7,
            userSelect: 'none',
        };
        const rowTitleStyle = Object.assign(Object.assign({}, rowTextStyle), { fontSize: rowTextStyle.fontSize * 1.4, marginBottom: this.state.resultsInBody ? 6 : 4, color: theme.colorFaded });
        const rowFragmentsStyle = Object.assign(Object.assign({}, rowTextStyle), { fontSize: rowTextStyle.fontSize * 1.2, marginBottom: this.state.resultsInBody ? 8 : 6, color: theme.colorFaded });
        this.styles_[styleKey].rowSelected = Object.assign(Object.assign({}, this.styles_[styleKey].row), { backgroundColor: theme.selectedColor });
        this.styles_[styleKey].rowPath = rowTextStyle;
        this.styles_[styleKey].rowTitle = rowTitleStyle;
        this.styles_[styleKey].rowFragments = rowFragmentsStyle;
        this.styles_[styleKey].itemHeight = itemHeight;
        return this.styles_[styleKey];
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'VISIBLE_DIALOGS_ADD',
            name: 'gotoAnything',
        });
    }
    componentWillUnmount() {
        void this.listUpdateQueue_.reset();
        this.props.dispatch({
            type: 'VISIBLE_DIALOGS_REMOVE',
            name: 'gotoAnything',
        });
    }
    helpButton_onClick() {
        this.setState({ showHelp: !this.state.showHelp });
    }
    input_onChange(event) {
        this.setState({ query: event.target.value });
        this.scheduleListUpdate();
    }
    scheduleListUpdate() {
        this.listUpdateQueue_.push(() => this.updateList());
    }
    async keywords(searchQuery) {
        const parsedQuery = await SearchEngine_1.default.instance().parseQuery(searchQuery);
        return SearchEngine_1.default.instance().allParsedQueryTerms(parsedQuery);
    }
    markupToHtml() {
        if (this.markupToHtml_)
            return this.markupToHtml_;
        this.markupToHtml_ = markupLanguageUtils_1.default.newMarkupToHtml();
        return this.markupToHtml_;
    }
    parseCommandQuery(query) {
        const fullQuery = query;
        const splitted = fullQuery.split(/\s+/);
        return {
            name: splitted.length ? splitted[0] : '',
            args: splitted.slice(1),
        };
    }
    async updateList() {
        let resultsInBody = false;
        if (!this.state.query) {
            this.setState({ results: [], keywords: [] });
        }
        else {
            let results = [];
            let listType = null;
            let searchQuery = '';
            let keywords = null;
            let commandArgs = [];
            if (this.state.query.indexOf(':') === 0) { // COMMANDS
                const commandQuery = this.parseCommandQuery(this.state.query.substr(1));
                listType = BaseModel_1.default.TYPE_COMMAND;
                keywords = [commandQuery.name];
                commandArgs = commandQuery.args;
                const commandResults = CommandService_1.default.instance().searchCommands(commandQuery.name, true);
                results = commandResults.map((result) => {
                    return {
                        id: result.commandName,
                        title: result.title,
                        parent_id: null,
                        fields: [],
                        type: BaseModel_1.default.TYPE_COMMAND,
                    };
                });
            }
            else if (this.state.query.indexOf('#') === 0) { // TAGS
                listType = BaseModel_1.default.TYPE_TAG;
                searchQuery = `*${this.state.query.split(' ')[0].substr(1).trim()}*`;
                results = await Tag_1.default.searchAllWithNotes({ titlePattern: searchQuery });
            }
            else if (this.state.query.indexOf('@') === 0) { // FOLDERS
                listType = BaseModel_1.default.TYPE_FOLDER;
                searchQuery = this.state.query.substr(1).trim();
                const normalizedSearchQuery = (0, string_utils_1.removeDiacritics)(searchQuery).toLowerCase();
                results = [];
                for (const folder of this.props.folders) {
                    if (folder.deleted_time)
                        continue;
                    const normalizedTitle = (0, string_utils_1.removeDiacritics)(folder.title).toLowerCase();
                    if (normalizedSearchQuery && normalizedTitle.indexOf(normalizedSearchQuery) < 0)
                        continue;
                    const path = Folder_1.default.folderPathString(this.props.folders, folder.parent_id);
                    results.push(Object.assign(Object.assign({}, folder), { path: path ? path : '/' }));
                }
            }
            else { // Note TITLE or BODY
                listType = BaseModel_1.default.TYPE_NOTE;
                searchQuery = (0, gotoAnythingStyleQuery_1.default)(this.state.query);
                // SearchEngine returns the title normalized, that is why we need to
                // override this field below with the original title
                results = (await SearchEngine_1.default.instance().search(searchQuery));
                resultsInBody = !!results.find((row) => row.fields.includes('body'));
                if (this.mode_ === Mode.TitleOnly) {
                    resultsInBody = false;
                    results = results.filter(r => {
                        return r.fields.includes('title');
                    });
                }
                const resourceIds = results.filter(r => r.item_type === BaseModel_1.ModelType.Resource).map(r => r.item_id);
                const resources = await Resource_1.default.resourceOcrTextsByIds(resourceIds);
                if (!resultsInBody || this.state.query.length <= 1) {
                    const notes = await Note_1.default.byIds(results.map(result => result.id), { fields: ['id', 'title'] });
                    for (let i = 0; i < results.length; i++) {
                        const row = results[i];
                        const path = Folder_1.default.folderPathString(this.props.folders, row.parent_id);
                        const originalNote = notes.find(note => note.id === row.id);
                        results[i] = Object.assign(Object.assign({}, row), { path: path, title: originalNote.title });
                    }
                }
                else {
                    const limit = 20;
                    // Note: any filtering must be done **before** fetching the notes, because we're
                    // going to apply a limit to the number of fetched notes.
                    // https://github.com/laurent22/joplin/issues/9944
                    if (!this.props.showCompletedTodos) {
                        results = results.filter((row) => !row.is_todo || !row.todo_completed);
                    }
                    const notes = await Note_1.default.byIds(results.map(result => result.id).slice(0, limit), { fields: ['id', 'body', 'markup_language', 'is_todo', 'todo_completed', 'title'] });
                    const notesById = notes.reduce((obj, { id, body, markup_language, title }) => {
                        obj[id] = { id, body, markup_language, title };
                        return obj;
                    }, {});
                    // Filter out search results that are associated with non-existing notes.
                    // https://github.com/laurent22/joplin/issues/5417
                    results = results.filter(r => !!notesById[r.id])
                        .map(r => (Object.assign(Object.assign({}, r), { title: notesById[r.id].title })));
                    const keywordRegexes = (await this.keywords(searchQuery)).map(term => {
                        if (typeof term === 'string') {
                            return new RegExp((0, string_utils_1.escapeRegExp)(term), 'ig');
                        }
                        else if (term.valueRegex) {
                            return new RegExp((0, string_utils_1.removeDiacritics)(term.valueRegex), 'ig');
                        }
                        else {
                            return new RegExp((0, string_utils_1.escapeRegExp)(term.value), 'ig');
                        }
                    });
                    for (let i = 0; i < results.length; i++) {
                        const row = results[i];
                        const path = Folder_1.default.folderPathString(this.props.folders, row.parent_id);
                        if (row.fields.includes('body')) {
                            let fragments = '...';
                            const loadFragments = (markupLanguage, content) => {
                                const indices = [];
                                const body = this.markupToHtml().stripMarkup(markupLanguage, content, { collapseWhiteSpaces: true });
                                const normalizedBody = (0, string_utils_1.removeDiacritics)(body);
                                // Iterate over all matches in the body for each search keyword
                                for (const keywordRegex of keywordRegexes) {
                                    for (const match of normalizedBody.matchAll(keywordRegex)) {
                                        // Populate 'indices' with [begin index, end index] of each note fragment
                                        // Begins at the regex matching index, ends at the next whitespace after seeking 15 characters to the right
                                        indices.push([match.index, (0, string_utils_1.nextWhitespaceIndex)(body, match.index + match[0].length + 15)]);
                                        if (indices.length > 20)
                                            break;
                                    }
                                }
                                // Merge multiple overlapping fragments into a single fragment to prevent repeated content
                                // e.g. 'Joplin is a free, open source' and 'open source note taking application'
                                // will result in 'Joplin is a free, open source note taking application'
                                const mergedIndices = (0, ArrayUtils_1.mergeOverlappingIntervals)(indices, 3);
                                fragments = mergedIndices.map((f) => body.slice(f[0], f[1])).join(' ... ');
                                // Add trailing ellipsis if the final fragment doesn't end where the note is ending
                                if (mergedIndices.length && mergedIndices[mergedIndices.length - 1][1] !== body.length)
                                    fragments += ' ...';
                            };
                            if (i < limit) { // Display note fragments of search keyword matches
                                const { markupLanguage, content } = getContentMarkupLanguageAndBody(row, notesById, resources);
                                // Don't load fragments for long notes -- doing so can lead to UI freezes.
                                if (content.length < 100000) {
                                    loadFragments(markupLanguage, content);
                                }
                            }
                            results[i] = Object.assign(Object.assign({}, row), { path, fragments });
                        }
                        else {
                            results[i] = Object.assign(Object.assign({}, row), { path: path, fragments: '' });
                        }
                    }
                }
            }
            // make list scroll to top in every search
            this.makeItemIndexVisible(0);
            const keywordsWithoutEmptyString = keywords === null || keywords === void 0 ? void 0 : keywords.filter(v => !!v);
            this.setState({
                listType: listType,
                results: results,
                keywords: keywordsWithoutEmptyString ? keywordsWithoutEmptyString : await this.keywords(searchQuery),
                selectedItemId: results.length === 0 ? null : getResultId(results[0]),
                resultsInBody: resultsInBody,
                commandArgs: commandArgs,
            });
        }
    }
    makeItemIndexVisible(index) {
        // Looks like it's not always defined
        // https://github.com/laurent22/joplin/issues/5184#issuecomment-879714850
        if (!this.itemListRef || !this.itemListRef.current) {
            logger.warn('Trying to set item index but the item list is not defined. Index: ', index);
            return;
        }
        this.itemListRef.current.makeItemIndexVisible(index);
    }
    async gotoItem(item) {
        this.props.dispatch({
            pluginName: PLUGIN_NAME,
            type: 'PLUGINLEGACY_DIALOG_SET',
            open: false,
        });
        if (this.userCallback_) {
            logger.info('gotoItem: user callback', item);
            this.userCallback_.resolve({
                type: this.state.listType,
                item: Object.assign({}, item),
            });
            return;
        }
        if (item.type === BaseModel_1.default.TYPE_COMMAND) {
            logger.info('gotoItem: execute command', item);
            // Defer so the close above renders before the command runs — otherwise
            // commands that reopen the dialog (e.g. linkToNote) get batched with the
            // close, the dialog never remounts, and its constructor-read userData is
            // stale. See https://github.com/laurent22/joplin/issues/15780
            setTimeout(() => {
                void CommandService_1.default.instance().execute(item.id, ...item.commandArgs);
                void (0, focusEditorIfEditorCommand_1.default)(item.id, CommandService_1.default.instance());
            }, 0);
            return;
        }
        if (this.state.listType === BaseModel_1.default.TYPE_NOTE || this.state.listType === BaseModel_1.default.TYPE_FOLDER) {
            const folderPath = await Folder_1.default.folderPath(this.props.folders, item.parent_id);
            for (const folder of folderPath) {
                this.props.dispatch({
                    type: 'FOLDER_SET_COLLAPSED',
                    id: folder.id,
                    collapsed: false,
                });
            }
        }
        if (this.state.listType === BaseModel_1.default.TYPE_NOTE) {
            logger.info('gotoItem: note', item);
            this.props.dispatch({
                type: 'FOLDER_AND_NOTE_SELECT',
                folderId: item.parent_id,
                noteId: item.id,
            });
            CommandService_1.default.instance().scheduleExecute('focusElement', 'noteBody');
        }
        else if (this.state.listType === BaseModel_1.default.TYPE_TAG) {
            logger.info('gotoItem: tag', item);
            this.props.dispatch({
                type: 'TAG_SELECT',
                id: item.id,
            });
        }
        else if (this.state.listType === BaseModel_1.default.TYPE_FOLDER) {
            logger.info('gotoItem: folder', item);
            this.props.dispatch({
                type: 'FOLDER_SELECT',
                id: item.id,
            });
        }
    }
    listItem_onClick(event) {
        const targetResultId = event.currentTarget.getAttribute('id');
        void this.gotoItem(this.selectedItem(targetResultId));
    }
    listItem_onMouseMove(event) {
        // Only update selection when the mouse actually moves. Without this, a stationary
        // cursor over a row that gets re-mounted (e.g. after keyboard navigation re-renders
        // the list) would steal the keyboard selection.
        if (this.lastMouseCoords_ && this.lastMouseCoords_.x === event.clientX && this.lastMouseCoords_.y === event.clientY) {
            return;
        }
        this.lastMouseCoords_ = { x: event.clientX, y: event.clientY };
        const targetResultId = event.currentTarget.getAttribute('id');
        if (targetResultId && targetResultId !== this.state.selectedItemId) {
            this.setState({ selectedItemId: targetResultId });
        }
    }
    renderItem(item, index) {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const style = this.style();
        const resultId = getResultId(item);
        const isSelected = resultId === this.state.selectedItemId;
        const rowStyle = isSelected ? style.rowSelected : style.row;
        const wrapKeywordMatches = (unescapedContent) => {
            return (0, string_utils_1.surroundKeywords)(this.state.keywords, unescapedContent, `<span class="match-highlight" style="font-weight: bold; color: ${theme.searchMarkerColor}; background-color: ${theme.searchMarkerBackgroundColor}">`, '</span>', { escapeHtml: true });
        };
        const titleHtml = wrapKeywordMatches(item.title);
        const fragmentsHtml = !item.fragments ? null : wrapKeywordMatches(item.fragments);
        const folderIcon = React.createElement("i", { style: { fontSize: theme.fontSize, marginRight: 2 }, className: "fa fa-book", role: 'img', "aria-label": (0, locale_1._)('Notebook') });
        const pathComp = !item.path ? null : React.createElement("div", { style: style.rowPath },
            folderIcon,
            " ",
            item.path);
        const fragmentComp = !fragmentsHtml ? null : React.createElement("div", { style: style.rowFragments, dangerouslySetInnerHTML: { __html: (fragmentsHtml) } });
        return (React.createElement("div", { key: resultId, className: isSelected ? 'selected' : null, style: rowStyle, onClick: this.listItem_onClick, onMouseMove: this.listItem_onMouseMove, "data-id": item.id, "data-parent-id": item.parent_id, "data-type": item.type, role: 'option', id: resultId, "aria-posinset": index + 1 },
            React.createElement("div", { style: style.rowTitle, dangerouslySetInnerHTML: { __html: titleHtml } }),
            this.mode_ === Mode.TitleOnly ? null : fragmentComp,
            this.mode_ === Mode.TitleOnly ? null : pathComp));
    }
    selectedItemIndex(results = undefined, itemId = undefined) {
        if (typeof results === 'undefined')
            results = this.state.results;
        if (typeof itemId === 'undefined')
            itemId = this.state.selectedItemId;
        for (let i = 0; i < results.length; i++) {
            const r = results[i];
            if (getResultId(r) === itemId)
                return i;
        }
        return -1;
    }
    selectedItem(itemId = undefined) {
        const index = this.selectedItemIndex(undefined, itemId);
        if (index < 0)
            return null;
        return Object.assign(Object.assign({}, this.state.results[index]), { commandArgs: this.state.commandArgs });
    }
    input_onKeyDown(event) {
        const keyCode = event.keyCode;
        if (this.state.results.length > 0 && (keyCode === 40 || keyCode === 38)) { // DOWN / UP
            event.preventDefault();
            const inc = keyCode === 38 ? -1 : +1;
            let index = this.selectedItemIndex();
            if (index < 0)
                return; // Not possible, but who knows
            index += inc;
            if (index < 0)
                index = 0;
            if (index >= this.state.results.length)
                index = this.state.results.length - 1;
            const newId = getResultId(this.state.results[index]);
            this.makeItemIndexVisible(index);
            this.setState({ selectedItemId: newId });
        }
        if (keyCode === 13) { // ENTER
            event.preventDefault();
            const item = this.selectedItem();
            if (!item)
                return;
            void this.gotoItem(item);
        }
    }
    calculateMaxHeight(itemHeight) {
        var _a, _b, _c;
        const listContainer = (_a = this.itemListRef.current) === null || _a === void 0 ? void 0 : _a.container;
        const containerWindow = (_c = (_b = listContainer === null || listContainer === void 0 ? void 0 : listContainer.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView) !== null && _c !== void 0 ? _c : window;
        const maxItemCount = Math.floor((0.7 * containerWindow.innerHeight) / itemHeight);
        return maxItemCount * itemHeight;
    }
    renderList() {
        const style = this.style();
        const itemListStyle = {
            marginTop: 5,
            height: Math.min(style.itemHeight * this.state.results.length, this.calculateMaxHeight(style.itemHeight)),
        };
        return (React.createElement(ItemList_1.default, { ref: this.itemListRef, id: itemListId, role: 'listbox', "aria-label": (0, locale_1._)('Search results'), itemHeight: style.itemHeight, items: this.state.results, style: itemListStyle, itemRenderer: this.renderItem }));
    }
    helpText() {
        if (this.mode_ === Mode.TitleOnly) {
            return (0, locale_1._)('Type a note title to search for it.');
        }
        else {
            return (0, locale_1._)('Type a note title or part of its content to jump to it. Or type # followed by a tag name, or @ followed by a notebook name. Or type : to search for commands.');
        }
    }
    render() {
        const style = this.style();
        const helpTextId = 'goto-anything-help-text';
        const helpComp = (React.createElement("div", { className: 'help-text', "aria-live": 'polite', id: helpTextId, style: style.help, hidden: !this.alwaysShowHelp_ && !this.state.showHelp }, this.helpText()));
        return (React.createElement(Dialog_1.default, { className: 'go-to-anything-dialog', onCancel: this.modalLayer_onDismiss, contentStyle: style.dialogBox },
            helpComp,
            React.createElement("div", { style: style.inputHelpWrapper },
                React.createElement("input", { autoFocus: true, type: 'text', style: style.input, ref: this.inputRef, value: this.state.query, onChange: this.input_onChange, onKeyDown: this.input_onKeyDown, "aria-describedby": helpTextId, "aria-autocomplete": 'list', "aria-controls": itemListId, "aria-activedescendant": this.state.selectedItemId }),
                this.alwaysShowHelp_ ? null : React.createElement(HelpButton_1.default, { onClick: this.helpButton_onClick, "aria-controls": helpTextId, "aria-expanded": this.state.showHelp })),
            this.renderList()));
    }
}
const mapStateToProps = (state) => {
    return {
        folders: state.folders,
        themeId: state.settings.theme,
        showCompletedTodos: state.settings.showCompletedTodos,
        highlightedWords: state.highlightedWords,
    };
};
GotoAnything.Dialog = (0, react_redux_1.connect)(mapStateToProps)(DialogComponent);
GotoAnything.manifest = {
    name: PLUGIN_NAME,
    menuItems: [
        {
            id: 'gotoAnything',
            name: 'main',
            parent: 'go',
            label: (0, locale_1._)('Goto Anything...'),
            accelerator: () => KeymapService_1.default.instance().getAccelerator('gotoAnything'),
            screens: ['Main'],
        },
        {
            id: 'commandPalette',
            name: 'main',
            parent: 'tools',
            label: (0, locale_1._)('Command palette'),
            accelerator: () => KeymapService_1.default.instance().getAccelerator('commandPalette'),
            screens: ['Main'],
            userData: {
                startString: ':',
            },
        },
        {
            id: 'controlledApi',
        },
    ],
};
exports.default = GotoAnything;
//# sourceMappingURL=GotoAnything.js.map