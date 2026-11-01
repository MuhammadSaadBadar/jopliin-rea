"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const types_1 = require("./types");
const locale_1 = require("@joplin/lib/locale");
const enableTextAreaTab_1 = __importDefault(require("./enableTextAreaTab"));
const renderer_1 = require("@joplin/renderer");
const types_2 = require("@joplin/renderer/types");
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
function findBlockSource(node) {
    const sources = node.getElementsByClassName('joplin-source');
    if (!sources.length)
        throw new Error('No source for node');
    const source = sources[0];
    return {
        openCharacters: source.getAttribute('data-joplin-source-open'),
        closeCharacters: source.getAttribute('data-joplin-source-close'),
        content: source.textContent,
        node: source,
        language: source.getAttribute('data-joplin-language') || '',
    };
}
function newBlockSource(language = '', content = '', previousSource = null) {
    let fence = '```';
    if (language === 'katex') {
        if (previousSource && previousSource.openCharacters === '$') {
            fence = '$';
        }
        else {
            fence = '$$';
        }
    }
    else if (language === 'frontmatter') {
        // Frontmatter uses --- delimiters instead of code fences
        return {
            openCharacters: '---\n',
            closeCharacters: '\n---\n',
            content: content,
            node: null,
            language: language,
        };
    }
    const fenceLanguage = language === 'katex' ? '' : language;
    return {
        openCharacters: fence === '$' ? '$' : `\n${fence}${fenceLanguage}\n`,
        closeCharacters: fence === '$' ? '$' : `\n${fence}\n`,
        content: content,
        node: null,
        language: language,
    };
}
function editableInnerHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const editable = temp.getElementsByClassName('joplin-editable');
    if (!editable.length)
        throw new Error(`Invalid joplin-editable: ${html}`);
    return editable[0].innerHTML;
}
function openEditDialog(editor, markupToHtml, dispatchDidUpdate, editable) {
    const source = editable ? findBlockSource(editable) : newBlockSource();
    let tabHandler = null;
    editor.windowManager.open({
        title: (0, locale_1._)('Edit'),
        size: 'large',
        initialData: {
            codeTextArea: source.content,
            languageInput: source.language,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TinyMCE dialog API is not exposed as a public type
        onSubmit: async (dialogApi) => {
            const newSource = newBlockSource(dialogApi.getData().languageInput, dialogApi.getData().codeTextArea, source);
            const md = `${newSource.openCharacters}${newSource.content}${newSource.closeCharacters}`;
            const result = await markupToHtml.current(renderer_1.MarkupToHtml.MARKUP_LANGUAGE_MARKDOWN, md, { bodyOnly: true, globalSettings: (0, types_2.getGlobalSettings)(Setting_1.default) });
            // markupToHtml will return the complete editable HTML, but we only
            // want to update the inner HTML, so as not to break additional props that
            // are added by TinyMCE on the main node.
            if (editable) {
                editable.innerHTML = editableInnerHtml(result.html);
            }
            else {
                editor.insertContent(result.html);
            }
            dialogApi.close();
            editor.fire(types_1.TinyMceEditorEvents.JoplinChange);
            dispatchDidUpdate(editor);
        },
        onClose: () => {
            tabHandler === null || tabHandler === void 0 ? void 0 : tabHandler.remove();
        },
        body: {
            type: 'panel',
            items: [
                {
                    type: 'input',
                    name: 'languageInput',
                    label: 'Language',
                    // Katex is a special case with special opening/closing tags
                    // and we don't currently handle switching the language in this case.
                    enabled: source.language !== 'katex',
                },
                {
                    type: 'textarea',
                    name: 'codeTextArea',
                },
            ],
        },
        buttons: [
            {
                type: 'submit',
                text: 'OK',
            },
        ],
    });
    window.requestAnimationFrame(() => {
        const containerDocument = editor.getContainer().ownerDocument;
        const textAreas = containerDocument.querySelectorAll('.tox-textarea');
        tabHandler = (0, enableTextAreaTab_1.default)([...textAreas]);
    });
}
const findEditableContainer = (node) => {
    if (node.nodeName.startsWith('#')) { // Not an element, e.g. #text
        node = node.parentElement;
    }
    return node === null || node === void 0 ? void 0 : node.closest('.joplin-editable');
};
const useEditDialog = ({ editor, markupToHtml, dispatchDidUpdate, }) => {
    return (0, react_1.useMemo)(() => {
        const edit = (editable) => {
            openEditDialog(editor, markupToHtml, dispatchDidUpdate, editable);
        };
        return {
            isEditable: element => !!findEditableContainer(element),
            editExisting: (element) => {
                const editable = findEditableContainer(element);
                if (editable) {
                    edit(editable);
                }
            },
            editNew: () => {
                edit(null);
            },
        };
    }, [editor, markupToHtml, dispatchDidUpdate]);
};
exports.default = useEditDialog;
//# sourceMappingURL=useEditDialog.js.map