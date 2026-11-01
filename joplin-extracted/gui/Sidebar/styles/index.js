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
exports.StyledSpanFix = exports.StyledSyncReportText = exports.StyledSyncReport = exports.StyledAddButton = exports.StyledSynchronizeButton = exports.StyledShareIcon = exports.StyledListItemAnchor = exports.StyledHeaderLabel = exports.StyledAllNotesIcon = exports.StyledHeaderIcon = exports.StyledHeader = exports.StyledRoot = void 0;
const shim_1 = __importDefault(require("@joplin/lib/shim"));
const Button_1 = __importDefault(require("../../Button/Button"));
const styled_components_1 = __importStar(require("styled-components"));
exports.StyledRoot = styled_components_1.default.div `
	background-color: ${(props) => props.theme.backgroundColor2};
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: hidden;
	display: inline-flex;
	flex-direction: column;
`;
exports.StyledHeader = styled_components_1.default.div `
	//height: ${(props) => props.theme.topRowHeight}px;
	//text-decoration: none;
	flex: 1;
	box-sizing: border-box;
	padding: ${(props) => props.theme.mainPadding}px;
	padding-bottom: ${(props) => props.theme.mainPadding / 2}px;
	display: flex;
	align-items: center;
	user-select: none;
	text-transform: uppercase;
	//cursor: pointer;
	cursor: default;
	transition: background 0.2s;
	&:hover {
		background: ${(props) => props.theme.backgroundColorHover2};
	}
`;
exports.StyledHeaderIcon = styled_components_1.default.i `
	font-size: ${(props) => props.theme.toolbarIconSize}px;
	color: ${(props) => props.theme.color2};
	margin-right: 8px;
`;
exports.StyledAllNotesIcon = (0, styled_components_1.default)(exports.StyledHeaderIcon) `
	font-size: ${(props) => props.theme.toolbarIconSize * 0.8}px;
	color: ${(props) => props.theme.colorFaded2};
	margin-right: 8px;
`;
exports.StyledHeaderLabel = styled_components_1.default.span `
	flex: 1;
	color: ${(props) => props.theme.color2};
	font-size: ${(props) => Math.round(props.theme.fontSize * 1.1)}px;
	font-weight: bold;
`;
function listItemTextColor(props) {
    if (props.isConflictFolder)
        return props.theme.colorError2;
    if (props.isSpecialItem)
        return props.theme.colorFaded2;
    if (props.selected && props.isPublished)
        return props.theme.color2;
    if (props.isPublished)
        return props.theme.colorPublished2;
    if (props.shareId)
        return props.theme.colorWarn2;
    return props.theme.color2;
}
exports.StyledListItemAnchor = styled_components_1.default.a `
	font-size: ${(props) => Math.round(props.theme.fontSize * 1.0833333)}px;
	text-decoration: none;
	color: ${(props) => listItemTextColor(props)};
	cursor: default;
	opacity: ${(props) => {
    // So that the conflicts folder and shared folders have sufficient contrast,
    // use an opacity of 1 even when unselected.
    const needsHigherContrast = props.isConflictFolder || props.isSpecialItem;
    return (props.selected || props.shareId || props.isPublished || needsHigherContrast) ? 1 : 0.8;
}};
	white-space: nowrap;
	display: flex;
	flex: 1;
	align-items: center;
	user-select: none;
	height: 100%;

	/* A different background color is already used to indicate focus for sidebar list items. */
	&:focus-visible {
		outline: none;
	}
`;
exports.StyledShareIcon = styled_components_1.default.i `
	margin-left: 8px;
`;
exports.StyledSynchronizeButton = (0, styled_components_1.default)(Button_1.default) `
	width: 100%;
`;
exports.StyledAddButton = (0, styled_components_1.default)(Button_1.default) `
	border: none;
	padding-right: 15px;
	padding-top: 4px;
`;
exports.StyledSyncReport = styled_components_1.default.div `
	font-size: ${(props) => Math.round(props.theme.fontSize * 0.9)}px;
	color: ${(props) => props.theme.color2};
	opacity: 0.5;
	display: flex;
	flex-direction: column;
	margin-left: 5px;
	margin-right: 5px;
	margin-bottom: 10px;
	word-wrap: break-word;
`;
exports.StyledSyncReportText = styled_components_1.default.div `
	color: ${(props) => props.theme.color2};
	word-wrap: break-word;
	width: 100%;
`;
// Workaround sidebar rendering bug on Linux Intel GPU.
// https://github.com/laurent22/joplin/issues/7506
exports.StyledSpanFix = styled_components_1.default.span `
	${shim_1.default.isLinux() && (0, styled_components_1.css) `
		position: relative;
	`}
`;
//# sourceMappingURL=index.js.map