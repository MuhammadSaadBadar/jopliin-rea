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
exports.default = default_1;
const React = __importStar(require("react"));
const react_1 = require("react");
const locale_1 = require("@joplin/lib/locale");
const DialogButtonRow_1 = __importDefault(require("../DialogButtonRow"));
const Dialog_1 = __importDefault(require("@joplin/lib/components/Dialog"));
const styled_components_1 = __importDefault(require("styled-components"));
const DialogTitle_1 = __importDefault(require("../DialogTitle"));
const SyncTargetRegistry_1 = __importDefault(require("@joplin/lib/SyncTargetRegistry"));
const useElementSize_1 = __importDefault(require("@joplin/lib/hooks/useElementSize"));
const Button_1 = __importStar(require("../Button/Button"));
const bridge_1 = __importDefault(require("../../services/bridge"));
const Setting_1 = __importDefault(require("@joplin/lib/models/Setting"));
const JoplinCloudSignUpCallToAction_1 = __importDefault(require("../JoplinCloudSignUpCallToAction"));
const StyledRoot = styled_components_1.default.div `
	width: ${props => props.expanded ? '832px' : '432px'};
	max-width: 100%;
`;
const SyncTargetDescription = styled_components_1.default.div `
	${props => props.height ? `height: ${props.height}px` : ''};
	margin-bottom: 1.3em;
	line-height: ${props => props.theme.lineHeight};
	font-size: 16px;
`;
const ContentRoot = styled_components_1.default.div `
	background-color: ${props => props.theme.backgroundColor3};
	padding: 1em;
`;
const SelfHostingMessage = styled_components_1.default.div `
	color: ${props => props.theme.color};
	font-style: italic;
	margin-top: 1em;
	opacity: 0.6;
`;
const SyncTargetBoxes = styled_components_1.default.div `
	display: flex;
	flex-direction: row;
	justify-content: center;
`;
const OtherOptions = styled_components_1.default.div `
	margin-top: 1.5em;
`;
const OtherOptionsToggle = styled_components_1.default.button `
	display: flex;
	align-items: center;
	gap: 0.5em;
	width: 100%;
	background: none;
	border: none;
	cursor: pointer;
	font-family: ${props => props.theme.fontFamily};
	font-size: 16px;
	font-weight: bold;
	color: ${props => props.theme.color};
	padding: 0.5em 0;
	text-align: left;

	&:hover {
		opacity: 0.8;
	}
`;
const OtherOptionsBoxes = styled_components_1.default.div `
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 1em;
	margin-top: 1em;

	> * {
		margin-right: 0;
	}
`;
const SyncTargetTitle = styled_components_1.default.h2 `
	display: flex;
	flex-direction: row;
	font-weight: bold;
	font-size: 1.7em;
	align-items: center;
	white-space: nowrap;
`;
const SyncTargetLogo = styled_components_1.default.img `
	height: 1.3em;
	margin-right: 0.4em;
`;
const SyncTargetBox = styled_components_1.default.div `
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	font-family: ${props => props.theme.fontFamily};
	color: ${props => props.theme.color};
	background-color: ${props => props.theme.backgroundColor};
	border: ${props => props.hero ? `2px solid ${props.theme.color4}` : `1px solid ${props.theme.dividerColor}`};
	border-radius: 8px;
	padding: 2em 2.2em 2em 2.2em;
	flex: 1 1 0;
	min-width: 0;
	max-width: 400px;
	opacity: 1;
`;
const FeatureList = styled_components_1.default.ul `
	margin-bottom: 1em;

	list-style-type: none;
	padding: 0;
`;
const FeatureIcon = styled_components_1.default.i `
	display: inline-flex;
	width: 16px;
	justify-content: center;
	color: ${props => props.theme.color4};
	position: absolute;
`;
const FeatureLine = styled_components_1.default.li `
	margin-bottom: .5em;
	opacity: ${props => props.enabled ? 1 : 0.5};
	position: relative;
	font-size: 16px;
`;
const FeatureLabel = styled_components_1.default.div `
	margin-left: 24px;
	line-height: ${props => props.theme.lineHeight};
`;
const SelectButton = (0, styled_components_1.default)(Button_1.default) `
	padding: 10px 10px;
    height: auto;
    min-height: auto;
    max-height: fit-content;
    font-size: 1em;
`;
const LoginLink = styled_components_1.default.a `
	margin-top: 0.8em;
	font-size: 14px;
	align-self: center;
	color: ${props => props.theme.urlColor};
`;
const SlowSyncWarning = styled_components_1.default.div `
	margin-top: 1em;
	opacity: 0.8;
	font-family: ${props => props.theme.fontFamily};
	color: ${props => props.theme.color};
	font-size: 14px;
`;
const syncTargetNames = [
    'joplinCloud',
    'dropbox',
    'onedrive',
    'nextcloud',
    'webdav',
    'amazon_s3',
    'joplinServer',
    'joplinServerSaml',
];
const logosImageNames = {
    'dropbox': 'SyncTarget_Dropbox.svg',
    'joplinCloud': 'SyncTarget_JoplinCloud.svg',
    'onedrive': 'SyncTarget_OneDrive.svg',
};
function default_1(props) {
    const joplinCloudDescriptionRef = (0, react_1.useRef)(null);
    const closeDialog = (0, react_1.useCallback)(() => {
        props.dispatch({
            type: 'DIALOG_CLOSE',
            name: 'syncWizard',
        });
    }, [props.dispatch]);
    const onButtonRowClick = (0, react_1.useCallback)(() => {
        closeDialog();
    }, [closeDialog]);
    const { height: descriptionHeight } = (0, useElementSize_1.default)(joplinCloudDescriptionRef);
    function renderFeature(enabled, label) {
        const className = enabled ? 'fas fa-check' : 'fas fa-times';
        return (React.createElement(FeatureLine, { enabled: enabled, key: label },
            React.createElement(FeatureIcon, { className: className, role: 'img', "aria-label": enabled ? (0, locale_1._)('Check') : (0, locale_1._)('Not checked') }),
            React.createElement(FeatureLabel, null, label)));
    }
    function renderFeatures(name) {
        return (React.createElement(FeatureList, null, [
            renderFeature(true, (0, locale_1._)('Sync your notes')),
            renderFeature(name === 'joplinCloud', (0, locale_1._)('Publish notes to the internet')),
            renderFeature(name === 'joplinCloud', (0, locale_1._)('Collaborate on notebooks with others')),
        ]));
    }
    const onSelectButtonClick = (0, react_1.useCallback)(async (name) => {
        const routes = {
            'dropbox': { name: 'DropboxLogin', target: 7 },
            'onedrive': { name: 'OneDriveLogin', target: 3 },
            'joplinCloud': { name: 'JoplinCloudLogin', target: 10 },
        };
        const route = routes[name];
        if (!route)
            return; // throw error??
        Setting_1.default.setValue('sync.target', route.target);
        await Setting_1.default.saveAll();
        closeDialog();
        props.dispatch({
            type: 'NAV_GO',
            routeName: route.name,
        });
    }, [props.dispatch, closeDialog]);
    const baseId = (0, react_1.useId)();
    const [otherOptionsExpanded, setOtherOptionsExpanded] = (0, react_1.useState)(false);
    function renderSelectArea(info, describedById) {
        return (React.createElement(SelectButton, { level: Button_1.ButtonLevel.Primary, title: (0, locale_1._)('Select'), onClick: () => onSelectButtonClick(info.name), disabled: false, "aria-describedby": describedById }));
    }
    function renderActionArea(info, describedById) {
        if (info.name === 'joplinCloud') {
            return (React.createElement(React.Fragment, null,
                React.createElement(JoplinCloudSignUpCallToAction_1.default, { source: 'desktop-sync-wizard', primary: true }),
                React.createElement(LoginLink, { href: "#", onClick: event => { event.preventDefault(); void onSelectButtonClick(info.name); }, "aria-describedby": describedById }, (0, locale_1._)('Already have an account? Log in'))));
        }
        return renderSelectArea(info, describedById);
    }
    function renderSyncTarget(info, hero) {
        const key = `syncTarget_${info.name}`;
        const height = info.name !== 'joplinCloud' ? descriptionHeight : null;
        const logoImageName = logosImageNames[info.name];
        const logoImageSrc = logoImageName ? `${(0, bridge_1.default)().buildDir()}/images/${logoImageName}` : '';
        const logo = logoImageSrc ? React.createElement(SyncTargetLogo, { src: logoImageSrc, "aria-hidden": true }) : null;
        const descriptionComp = (React.createElement(SyncTargetDescription, { height: height, ref: info.name === 'joplinCloud' ? joplinCloudDescriptionRef : null }, info.description));
        const featuresComp = renderFeatures(info.name);
        const renderSlowSyncWarning = () => {
            if (info.name === 'joplinCloud')
                return null;
            return React.createElement(SlowSyncWarning, null, `⚠️ ${(0, locale_1._)('%s is not optimised for synchronising many small files so your initial synchronisation will be slow.', info.label)}`);
        };
        const headerId = `${baseId}-${info.id}`;
        return (React.createElement(SyncTargetBox, { id: key, key: key, hero: hero },
            React.createElement(SyncTargetTitle, { id: headerId },
                logo,
                info.label),
            descriptionComp,
            featuresComp,
            renderActionArea(info, headerId),
            renderSlowSyncWarning()));
    }
    const onSelfHostingClick = (0, react_1.useCallback)(() => {
        closeDialog();
        props.dispatch({
            type: 'NAV_GO',
            routeName: 'Config',
            props: {
                defaultSection: 'sync',
            },
        });
    }, [props.dispatch, closeDialog]);
    function renderContent() {
        const heroBoxes = [];
        const otherBoxes = [];
        for (const name of syncTargetNames) {
            const info = SyncTargetRegistry_1.default.infoByName(name);
            if (info.supportsSelfHosted)
                continue;
            if (info.name === 'joplinCloud') {
                heroBoxes.push(renderSyncTarget(info, true));
            }
            else {
                otherBoxes.push(renderSyncTarget(info, false));
            }
        }
        const selfHostingLabelId = `${baseId}-selfHosting`;
        const selfHostingLinkId = `${baseId}-selfHostingLink`;
        const selfHostingMessage = React.createElement(SelfHostingMessage, null,
            React.createElement("span", { id: selfHostingLabelId }, "Self-hosting? Joplin also supports various self-hosting options such as Nextcloud, WebDAV, AWS S3 and Joplin Server."),
            ' ',
            React.createElement("a", { href: "#", onClick: onSelfHostingClick, 
                // Include the link ID in aria-labelledby to include the link text in the
                // description. See
                // https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA7
                id: selfHostingLinkId, "aria-labelledby": `${selfHostingLabelId} ${selfHostingLinkId}` }, "Click here to select one"),
            ".");
        const otherOptionsRegionId = `${baseId}-otherOptions`;
        const otherOptions = React.createElement(OtherOptions, null,
            React.createElement(OtherOptionsToggle, { type: 'button', "aria-expanded": otherOptionsExpanded, "aria-controls": otherOptionsRegionId, onClick: () => setOtherOptionsExpanded(prev => !prev) },
                React.createElement("i", { className: otherOptionsExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right', "aria-hidden": true }),
                (0, locale_1._)('Other sync options')),
            React.createElement("div", { id: otherOptionsRegionId, hidden: !otherOptionsExpanded },
                React.createElement(OtherOptionsBoxes, null, otherBoxes),
                selfHostingMessage));
        return (React.createElement(ContentRoot, null,
            React.createElement(SyncTargetBoxes, null, heroBoxes),
            otherOptions));
    }
    function renderDialogWrapper() {
        return (React.createElement(StyledRoot, { expanded: otherOptionsExpanded },
            React.createElement(DialogTitle_1.default, { title: (0, locale_1._)('Sync your notes with Joplin Cloud to access them on all your devices. Other sync options are also available.'), justifyContent: "center" }),
            renderContent(),
            React.createElement(DialogButtonRow_1.default, { themeId: props.themeId, onClick: onButtonRowClick, okButtonShow: false, cancelButtonLabel: (0, locale_1._)('Close') })));
    }
    return (React.createElement(Dialog_1.default, { onCancel: closeDialog }, renderDialogWrapper()));
}
//# sourceMappingURL=Dialog.js.map