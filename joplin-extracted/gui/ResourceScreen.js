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
const ButtonBar_1 = __importDefault(require("./ConfigScreen/ButtonBar"));
const locale_1 = require("@joplin/lib/locale");
const react_redux_1 = require("react-redux");
const theme_1 = require("@joplin/lib/theme");
const bridge_1 = __importDefault(require("../services/bridge"));
const prettyBytes = require("pretty-bytes");
const Resource_1 = __importDefault(require("@joplin/lib/models/Resource"));
const ResourceTableComp = (props) => {
    const theme = (0, theme_1.themeStyle)(props.themeId);
    const titleCellStyle = Object.assign(Object.assign({}, theme.textStyle), { textOverflow: 'ellipsis', overflowX: 'hidden', maxWidth: 1, width: '100%', whiteSpace: 'nowrap' });
    const cellStyle = Object.assign(Object.assign({}, theme.textStyle), { whiteSpace: 'nowrap', color: theme.colorFaded, width: 1 });
    const headerStyle = Object.assign(Object.assign({}, theme.textStyle), { whiteSpace: 'nowrap', width: 1, fontWeight: 'bold' });
    const filteredResources = props.resources.filter((resource) => {
        var _a;
        if (props.filter) {
            const filterLowerCase = props.filter.toLowerCase();
            return ((_a = resource.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(filterLowerCase)) || resource.id.toLowerCase().includes(filterLowerCase);
        }
        return true;
    });
    const renderSortableHeader = (title, order) => {
        const sortedDescending = props.sorting.order === order && props.sorting.type === 'desc';
        const sortButtonLabel = sortedDescending ? (0, locale_1._)('Sort "%s" in ascending order', title) : (0, locale_1._)('Sort "%s" in descending order', title);
        const reverseSortButton = (React.createElement("a", { href: "#", style: { color: theme.urlColor }, onClick: () => props.onToggleSorting(order), "aria-label": sortButtonLabel, title: sortButtonLabel, role: 'button' }, sortedDescending ? '▾' : '▴'));
        return React.createElement("th", { key: `header-${title}`, style: headerStyle },
            title,
            " ",
            reverseSortButton);
    };
    return (React.createElement("table", { style: { width: '100%' } },
        React.createElement("thead", null,
            React.createElement("tr", null,
                renderSortableHeader((0, locale_1._)('Title'), 'name'),
                renderSortableHeader((0, locale_1._)('Size'), 'size'),
                React.createElement("th", { style: headerStyle }, (0, locale_1._)('ID')),
                React.createElement("th", { style: headerStyle }, (0, locale_1._)('Action')))),
        React.createElement("tbody", null, filteredResources.map((resource, index) => React.createElement("tr", { key: index },
            React.createElement("td", { id: `title-${resource.id}`, style: titleCellStyle, className: "titleCell" },
                React.createElement("a", { style: { color: theme.urlColor }, href: "#", onClick: () => props.onResourceClick(resource) }, resource.title || `(${(0, locale_1._)('Untitled')})`)),
            React.createElement("td", { style: cellStyle, className: "dataCell" }, prettyBytes(resource.size)),
            React.createElement("td", { style: cellStyle, className: "dataCell" }, resource.id),
            React.createElement("td", { style: cellStyle, className: "dataCell" },
                React.createElement("button", { id: `delete-${resource.id}`, "aria-labelledby": `delete-${resource.id} title-${resource.id}`, style: theme.buttonStyle, onClick: () => props.onResourceDelete(resource) }, (0, locale_1._)('Delete'))))))));
};
const getSortingOrderColumn = (s) => {
    switch (s) {
        case 'name': return 'title';
        case 'size': return 'size';
    }
};
const getNextSortingOrderType = (s) => {
    if (s === 'asc') {
        return 'desc';
    }
    else {
        return 'asc';
    }
};
const defaultMaxResources = 10000;
const searchMaxResources = 1000;
class ResourceScreenComponent extends React.Component {
    constructor(props) {
        super(props);
        this.reloadResourcesCounter = 0;
        this.onFilterUpdate = (updateEvent) => {
            this.setState({ filter: updateEvent.target.value });
        };
        this.state = {
            resources: undefined,
            filter: '',
            sorting: {
                type: 'asc',
                order: 'name',
            },
            isLoading: false,
        };
    }
    get maxResources() {
        // Use a smaller maximum when searching for performance -- results update
        // when the search input changes.
        if (this.state.filter) {
            return searchMaxResources;
        }
        else {
            return defaultMaxResources;
        }
    }
    async reloadResources() {
        this.setState({ isLoading: true });
        this.reloadResourcesCounter++;
        const currentCounterValue = this.reloadResourcesCounter;
        let searchOptions = {};
        if (this.state.filter) {
            const search = `%${this.state.filter}%`;
            searchOptions = {
                where: 'id LIKE ? OR title LIKE ?',
                whereParams: [search, search],
            };
        }
        const resources = await Resource_1.default.all(Object.assign({ order: [{
                    by: getSortingOrderColumn(this.state.sorting.order),
                    dir: this.state.sorting.type,
                    caseInsensitive: true,
                }], limit: this.maxResources, fields: ['title', 'id', 'size', 'file_extension'] }, searchOptions));
        const cancelled = currentCounterValue !== this.reloadResourcesCounter;
        if (cancelled)
            return;
        this.setState({ resources, isLoading: false });
    }
    componentDidMount() {
        void this.reloadResources();
    }
    componentDidUpdate(_prevProps, prevState) {
        if (prevState.sorting !== this.state.sorting || prevState.filter !== this.state.filter) {
            void this.reloadResources();
        }
    }
    onResourceDelete(resource) {
        const ok = (0, bridge_1.default)().showConfirmMessageBox((0, locale_1._)('Delete attachment "%s"?', resource.title), {
            buttons: [(0, locale_1._)('Delete'), (0, locale_1._)('Cancel')],
            defaultId: 1,
        });
        if (!ok) {
            return;
        }
        Resource_1.default.delete(resource.id, { sourceDescription: 'ResourceScreen' })
            // eslint-disable-next-line promise/prefer-await-to-then -- Old code before rule was applied
            .catch((error) => {
            console.error(error);
            (0, bridge_1.default)().showErrorMessageBox(error.message);
        })
            // eslint-disable-next-line promise/prefer-await-to-then -- Old code before rule was applied
            .finally(() => {
            void this.reloadResources();
        });
    }
    openResource(resource) {
        const resourcePath = Resource_1.default.fullPath(resource);
        const ok = (0, bridge_1.default)().openItem(resourcePath);
        if (!ok) {
            (0, bridge_1.default)().showErrorMessageBox(`This file could not be opened: ${resourcePath}`);
        }
    }
    onToggleSortOrder(sortOrder) {
        let newSorting = Object.assign({}, this.state.sorting);
        if (sortOrder === this.state.sorting.order) {
            newSorting.type = getNextSortingOrderType(newSorting.type);
        }
        else {
            newSorting = {
                order: sortOrder,
                type: 'desc',
            };
        }
        this.setState({ sorting: newSorting });
    }
    render() {
        const style = this.props.style;
        const theme = (0, theme_1.themeStyle)(this.props.themeId);
        const rootStyle = Object.assign(Object.assign({}, style), { overflowY: 'scroll', color: theme.color, padding: 20, boxSizing: 'border-box', flex: 1 });
        // rootStyle.height = style.height - 35; // Minus the header height
        delete rootStyle.height;
        delete rootStyle.width;
        const containerHeight = style.height;
        return (React.createElement("div", { style: Object.assign(Object.assign({}, theme.containerStyle), { fontFamily: theme.fontFamily, height: containerHeight, display: 'flex', flexDirection: 'column' }) },
            React.createElement("div", { style: rootStyle },
                React.createElement("div", { style: Object.assign(Object.assign({}, theme.notificationBox), { marginBottom: 10 }) }, (0, locale_1._)('This is an advanced tool to show the attachments that are linked to your notes. Please be careful when deleting one of them as they cannot be restored afterwards.')),
                React.createElement("p", { style: { float: 'left', paddingRight: 10 } },
                    React.createElement("input", { style: theme.inputStyle, type: "search", value: this.state.filter, onChange: this.onFilterUpdate, placeholder: (0, locale_1._)('Search...') })),
                this.state.isLoading && React.createElement("div", null, (0, locale_1._)('Please wait...')),
                !this.state.isLoading && React.createElement("div", null,
                    !this.state.resources && React.createElement("div", null, (0, locale_1._)('No resources!')),
                    this.state.resources && this.state.resources.length === this.maxResources &&
                        React.createElement("div", null, (0, locale_1._)('Warning: not all resources shown for performance reasons (limit: %s).', this.maxResources)),
                    this.state.resources && React.createElement(ResourceTableComp, { themeId: this.props.themeId, style: style, resources: this.state.resources, sorting: this.state.sorting, filter: this.state.filter, onToggleSorting: (order) => this.onToggleSortOrder(order), onResourceClick: (resource) => this.openResource(resource), onResourceDelete: (resource) => this.onResourceDelete(resource) }))),
            React.createElement(ButtonBar_1.default, { onCancelClick: () => this.props.dispatch({ type: 'NAV_BACK' }) })));
    }
}
const mapStateToProps = (state) => ({
    themeId: state.settings.theme,
});
const ResourceScreen = (0, react_redux_1.connect)(mapStateToProps)(ResourceScreenComponent);
exports.default = ResourceScreen;
//# sourceMappingURL=ResourceScreen.js.map