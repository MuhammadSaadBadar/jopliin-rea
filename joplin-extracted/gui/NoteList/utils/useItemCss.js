"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useItemCss = (itemCss) => {
    (0, react_1.useEffect)(() => {
        const element = document.createElement('style');
        element.setAttribute('type', 'text/css');
        element.appendChild(document.createTextNode(`
			.note-list-item {
				${itemCss};
			}
		`));
        document.head.appendChild(element);
        return () => {
            element.remove();
        };
    }, [itemCss]);
};
exports.default = useItemCss;
//# sourceMappingURL=useItemCss.js.map