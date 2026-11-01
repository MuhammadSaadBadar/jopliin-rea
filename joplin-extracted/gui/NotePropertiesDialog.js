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
const locale_1 = require("@joplin/lib/locale");
const theme_1 = require("@joplin/lib/theme");
const DialogButtonRow_1 = __importDefault(require("./DialogButtonRow"));
const Note_1 = __importDefault(require("@joplin/lib/models/Note"));
const bridge_1 = __importDefault(require("../services/bridge"));
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const focusHandler_1 = require("@joplin/lib/utils/focusHandler");
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const time_1 = require("@joplin/utils/time");
const electron_1 = require("electron");
const formatcoords = require('formatcoords');
const uniqueId = (key) => `note-properties-dialog-${key}`;
const isPropertyDatetimeRelated = (key) => {
    return key === 'user_created_time' || key === 'user_updated_time' || key === 'deleted_time' || key === 'todo_completed';
};
class NotePropertiesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.revisionsLink_click = this.revisionsLink_click.bind(this);
        this.buttonRow_click = this.buttonRow_click.bind(this);
        this.locationOnChange = this.locationOnChange.bind(this);
        this.okButton = React.createRef();
        this.inputRef = React.createRef();
        this.state = {
            formNote: null,
            editedKey: null,
            editedValue: null,
            isValid: {
                location: true,
            },
        };
        this.keyToLabel_ = {
            id: (0, locale_1._)('ID'),
            user_created_time: (0, locale_1._)('Created'),
            user_updated_time: (0, locale_1._)('Updated'),
            deleted_time: (0, locale_1._)('Deleted'),
            todo_completed: (0, locale_1._)('Completed'),
            location: (0, locale_1._)('Location'),
            source_url: (0, locale_1._)('URL'),
            revisionsLink: (0, locale_1._)('Note History'),
            markup_language: (0, locale_1._)('Markup'),
        };
    }
    componentDidMount() {
        void this.loadNote(this.props.noteId);
    }
    componentDidUpdate() {
        if (this.state.editedKey === null) {
            if (this.okButton.current)
                (0, focusHandler_1.focus)('NotePropertiesDialog::componentDidUpdate', this.okButton.current);
        }
    }
    async loadNote(noteId) {
        if (!noteId) {
            this.setState({ formNote: null });
        }
        else {
            const note = await Note_1.default.load(noteId);
            const formNote = this.noteToFormNote(note);
            this.setState({ formNote: formNote });
        }
    }
    isReadOnly() {
        return this.state.formNote && !!this.state.formNote.deleted_time;
    }
    latLongFromLocation(location) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The output is spread into NoteEntity which expects number latitude/longitude; the existing code parses to strings and relies on runtime coercion
        const o = {};
        const l = location.split(',');
        if (l.length === 2) {
            o.latitude = l[0].trim();
            o.longitude = l[1].trim();
        }
        else {
            o.latitude = '';
            o.longitude = '';
        }
        return o;
    }
    noteToFormNote(note) {
        const formNote = {
            id: note.id,
            user_updated_time: note.user_updated_time,
            user_created_time: note.user_created_time,
            source_url: note.source_url,
            location: '',
            revisionsLink: note.id,
            markup_language: Note_1.default.markupLanguageToLabel(note.markup_language),
            deleted_time: note.deleted_time,
        };
        if (note.todo_completed) {
            formNote.todo_completed = note.todo_completed;
        }
        if (Number(note.latitude) || Number(note.longitude)) {
            formNote.location = `${note.latitude}, ${note.longitude}`;
        }
        return formNote;
    }
    formNoteToNote(formNote) {
        const note = Object.assign({ id: formNote.id }, this.latLongFromLocation(formNote.location));
        note.user_created_time = formNote.user_created_time;
        note.user_updated_time = formNote.user_updated_time;
        if (formNote.todo_completed) {
            note.todo_completed = formNote.todo_completed;
        }
        note.source_url = formNote.source_url;
        return note;
    }
    styles(themeId) {
        const styleKey = themeId;
        if (styleKey === this.styleKey_)
            return this.styles_;
        const theme = (0, theme_1.themeStyle)(themeId);
        this.styles_ = {};
        this.styleKey_ = styleKey;
        this.styles_.button = {
            minWidth: theme.buttonMinWidth,
            minHeight: theme.buttonMinHeight,
            marginLeft: 5,
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            border: '1px solid',
            borderColor: theme.dividerColor,
        };
        this.styles_.editPropertyButton = {
            color: theme.color,
            textDecoration: 'none',
            backgroundColor: theme.backgroundColor,
            padding: '.14em',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '0.5em',
        };
        this.styles_.input = {
            display: 'inline-block',
            color: theme.color,
            backgroundColor: theme.backgroundColor,
            border: '1px solid',
            borderColor: theme.dividerColor,
        };
        this.styles_.invalidInput = {
            border: '1px solid',
            borderColor: theme.colorWarn,
        };
        this.styles_.invalidMessage = {
            marginTop: '0.3em',
            color: theme.color,
            fontSize: theme.fontSize * 0.9,
        };
        return this.styles_;
    }
    async closeDialog(applyChanges) {
        if (applyChanges) {
            await this.saveProperty();
            const note = this.formNoteToNote(this.state.formNote);
            note.updated_time = Date.now();
            await Note_1.default.save(note, { autoTimestamp: false });
        }
        else {
            await this.cancelProperty();
        }
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    buttonRow_click(event) {
        void this.closeDialog(event.buttonName === 'ok');
    }
    revisionsLink_click() {
        void this.closeDialog(false);
        if (this.props.onRevisionLinkClick)
            this.props.onRevisionLinkClick();
    }
    editPropertyButtonClick(key, initialValue) {
        this.setState({
            editedKey: key,
            editedValue: initialValue,
        });
        shim_1.default.setTimeout(() => {
            // Opens datetime-local fields with calendar
            if (this.inputRef.current.showPicker) {
                this.inputRef.current.showPicker();
            }
            else if (this.inputRef.current) {
                (0, focusHandler_1.focus)('NotePropertiesDialog::editPropertyButtonClick', (this.inputRef.current));
            }
        }, 100);
    }
    async saveProperty() {
        if (!this.state.editedKey)
            return null;
        return new Promise((resolve) => {
            const newFormNote = Object.assign({}, this.state.formNote);
            newFormNote[this.state.editedKey] = this.state.editedValue;
            this.setState({
                formNote: newFormNote,
                editedKey: null,
                editedValue: null,
            }, () => {
                resolve();
            });
        });
    }
    async cancelProperty() {
        return new Promise((resolve) => {
            if (this.okButton.current)
                (0, focusHandler_1.focus)('NotePropertiesDialog::focus', this.okButton.current);
            this.setState({
                editedKey: null,
                editedValue: null,
            }, () => {
                resolve();
            });
        });
    }
    async locationOnChange(event) {
        this.setState({ editedValue: event.target.value });
        if (!event.target.value) {
            this.setState({ isValid: Object.assign(Object.assign({}, this.state.isValid), { location: true }) });
            return;
        }
        if (event.target.value.includes(',')) {
            const [lat, log] = event.target.value.split(',');
            if (parseFloat(lat) < 90 && parseFloat(lat) > -90 && parseFloat(log) < 180 && parseFloat(log) > -180) {
                this.setState({ isValid: Object.assign(Object.assign({}, this.state.isValid), { location: true }) });
                return;
            }
        }
        this.setState({ isValid: Object.assign(Object.assign({}, this.state.isValid), { location: false }) });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Heterogeneous per-field types (timestamps as number, urls/ids as string); tightening to a union forces narrowing at every call site
    createNoteField(key, value) {
        const styles = this.styles(this.props.themeId);
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const labelText = this.formatLabel(key);
        const labelComp = React.createElement("label", { htmlFor: uniqueId(key), style: Object.assign(Object.assign({}, theme.textStyle), theme.controlBoxLabel) }, labelText);
        let controlComp = null;
        let editComp = null;
        let editCompHandler = null;
        let editCompIcon = null;
        let editComDescription = null;
        const onKeyDown = (event) => {
            if (event.keyCode === 13) {
                void this.saveProperty();
            }
            else if (event.keyCode === 27) {
                void this.cancelProperty();
            }
        };
        if (this.state.editedKey === key) {
            if (isPropertyDatetimeRelated(key)) {
                controlComp = React.createElement("input", { type: "datetime-local", defaultValue: (0, time_1.formatMsToDateTimeLocal)(value), ref: this.inputRef, onChange: event => this.setState({ editedValue: (0, time_1.formatDateTimeLocalToMs)(event.target.value) }), onKeyDown: event => onKeyDown(event), style: styles.input, id: uniqueId(key), name: uniqueId(key), autoFocus: true });
                editCompHandler = () => {
                    void this.saveProperty();
                };
                editCompIcon = 'fa-save';
                editComDescription = (0, locale_1._)('Save changes');
            }
            else if (this.state.editedKey === 'location') {
                controlComp = (React.createElement(React.Fragment, null,
                    React.createElement("input", { defaultValue: value, type: "text", ref: this.inputRef, onChange: this.locationOnChange, onKeyDown: event => onKeyDown(event), style: this.state.isValid.location ? styles.input : Object.assign(Object.assign({}, styles.input), styles.invalidInput), id: uniqueId(key), name: uniqueId(key), "aria-invalid": !this.state.isValid.location, autoFocus: true }),
                    this.state.isValid.location ? null
                        : React.createElement(React.Fragment, null,
                            React.createElement("div", { "aria-live": 'polite', style: styles.invalidMessage }, (0, locale_1._)('Invalid format. E.g.: 48.8581372, 2.2926735')))));
            }
            else {
                controlComp = (React.createElement("input", { defaultValue: value, type: "text", ref: this.inputRef, onChange: event => {
                        this.setState({ editedValue: event.target.value });
                    }, onKeyDown: event => onKeyDown(event), style: styles.input, id: uniqueId(key), name: uniqueId(key), autoFocus: true }));
            }
        }
        else {
            let displayedValue = value;
            if (key === 'location') {
                try {
                    const dms = formatcoords(value);
                    displayedValue = dms.format('DD MM ss X', { latLonSeparator: ', ', decimalPlaces: 2 });
                }
                catch (error) {
                    displayedValue = '';
                }
            }
            else if (isPropertyDatetimeRelated(key)) {
                displayedValue = (0, time_1.formatMsToLocal)(value);
            }
            if (['source_url', 'location'].indexOf(key) >= 0) {
                let url = '';
                if (key === 'source_url')
                    url = value;
                if (key === 'location') {
                    const ll = this.latLongFromLocation(value);
                    url = Note_1.default.geoLocationUrlFromLatLong(ll.latitude, ll.longitude);
                }
                const urlStyle = Object.assign(Object.assign({}, theme.urlStyle), { maxWidth: '180px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'inline-block' });
                controlComp = displayedValue ? (React.createElement("a", { href: "#", onClick: () => (0, bridge_1.default)().openExternal(url), style: urlStyle }, displayedValue)) : null;
            }
            else if (key === 'revisionsLink') {
                controlComp = (React.createElement("a", { href: "#", onClick: this.revisionsLink_click, style: theme.urlStyle }, (0, locale_1._)('Previous versions of this note')));
            }
            else {
                controlComp = React.createElement("div", { style: Object.assign(Object.assign({}, theme.textStyle), theme.controlBoxValue) }, displayedValue);
            }
            if (['id', 'revisionsLink', 'markup_language'].indexOf(key) < 0) {
                editCompHandler = () => {
                    this.editPropertyButtonClick(key, value);
                };
                editCompIcon = 'fa-edit';
                editComDescription = (0, locale_1._)('Edit');
            }
            // Add the copy icon and the 'copy on click' event
            if (key === 'id') {
                editCompIcon = 'fa-copy';
                editCompHandler = () => electron_1.clipboard.writeText(value);
                editComDescription = (0, locale_1._)('Copy');
            }
        }
        if (editCompHandler && !this.isReadOnly()) {
            editComp = (React.createElement("a", { href: "#", onClick: editCompHandler, style: styles.editPropertyButton, "aria-label": editComDescription, title: editComDescription },
                React.createElement("i", { className: `fas ${editCompIcon}`, "aria-hidden": "true" })));
        }
        return (React.createElement("tr", { key: key, style: theme.controlBox, className: "note-property-box" },
            React.createElement("th", null, labelComp),
            React.createElement("td", null,
                controlComp,
                " ",
                editComp)));
    }
    formatLabel(key) {
        if (this.keyToLabel_[key])
            return this.keyToLabel_[key];
        return key;
    }
    render() {
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const formNote = this.state.formNote;
        const noteComps = [];
        if (formNote) {
            for (const key of Object.keys(formNote)) {
                if (key === 'deleted_time' && !formNote.deleted_time)
                    continue;
                const comp = this.createNoteField(key, formNote[key]);
                noteComps.push(comp);
            }
        }
        return (React.createElement(Dialog_1.default, { onCancel: this.props.onClose },
            React.createElement("h1", { style: theme.dialogTitle, id: 'note-properties-dialog-title' }, (0, locale_1._)('Note properties')),
            React.createElement("table", { "aria-labelledby": 'note-properties-dialog-title' },
                React.createElement("tbody", null, noteComps)),
            React.createElement(DialogButtonRow_1.default, { themeId: this.props.themeId, okButtonShow: !this.isReadOnly(), okButtonRef: this.okButton, onClick: this.buttonRow_click })));
    }
}
exports.default = NotePropertiesDialog;
//# sourceMappingURL=NotePropertiesDialog.js.map