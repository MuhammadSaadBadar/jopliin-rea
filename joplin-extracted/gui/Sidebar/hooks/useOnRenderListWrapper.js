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
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const CommandService_1 = __importDefault(require("@joplin/lib/services/CommandService"));
const onAddFolderButtonClick = () => {
    void CommandService_1.default.instance().execute('newFolder');
};
const onToggleAllFolders = (allFoldersCollapsed) => {
    void CommandService_1.default.instance().execute('toggleAllFolders', !allFoldersCollapsed);
};
const CollapseExpandAllButton = (props) => {
    // To allow it to be accessed by accessibility tools, the toggle button
    // is not included in the portion of the list with role='tree'.
    const icon = props.allFoldersCollapsed ? 'far fa-caret-square-right' : 'far fa-caret-square-down';
    const label = props.allFoldersCollapsed ? (0, locale_1._)('Expand all notebooks') : (0, locale_1._)('Collapse all notebooks');
    return React.createElement("button", { onClick: () => onToggleAllFolders(props.allFoldersCollapsed), className: `sidebar-header-button -collapseall ${props.hasSubFolders ? '' : '-disabled'}`, title: label, disabled: !props.hasSubFolders },
        React.createElement("i", { "aria-label": label, role: 'img', className: icon }));
};
const NewFolderButton = () => {
    // To allow it to be accessed by accessibility tools, the new folder button
    // is not included in the portion of the list with role='tree'.
    const label = (0, locale_1._)('New notebook');
    return React.createElement("button", { onClick: onAddFolderButtonClick, className: 'sidebar-header-button -newfolder', title: label },
        React.createElement("i", { "aria-label": label, role: 'img', className: 'fas fa-plus' }));
};
const useOnRenderListWrapper = (props) => {
    return (0, react_1.useCallback)((listItems) => {
        const listHasValidSelection = props.selectedIndex >= 0;
        const allowContainerFocus = !listHasValidSelection;
        return React.createElement(React.Fragment, null,
            React.createElement(CollapseExpandAllButton, { allFoldersCollapsed: props.allFoldersCollapsed, hasSubFolders: props.hasSubFolders }),
            React.createElement(NewFolderButton, null),
            React.createElement("div", { role: 'tree', className: 'sidebar-list-items-wrapper', tabIndex: allowContainerFocus ? 0 : undefined, onKeyDown: props.onKeyDown }, ...listItems));
    }, [props.selectedIndex, props.onKeyDown, props.allFoldersCollapsed, props.hasSubFolders]);
};
exports.default = useOnRenderListWrapper;
//# sourceMappingURL=useOnRenderListWrapper.js.map