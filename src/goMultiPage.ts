import { MultiPageModal } from "./modal/MultiPageModal";
import { goPageType, NavigationMode } from "./types/goPage";
import checkAlias from "./utils/checkAlias";
import getPageName from "./utils/getPageName";
import type { App } from "obsidian";
import getPageNameInAlias from "./utils/getPageNameInAlias";
import navigateToParent from "./navigateToParent";

const goMultiPage = (
	upPages: Array<string>,
	goPage: goPageType,
	app: App,
	mode: NavigationMode
) => {
	upPages = upPages.reduce((prev: string[], upPage: string) => {
		let pageName = getPageName(upPage);
		if (pageName === null) {
			return prev;
		}
		if (checkAlias(pageName)) {
			pageName = getPageNameInAlias(pageName);
		}
		prev.push(pageName);
		return prev;
	}, []);

	if (upPages.length === 1) {
		navigateToParent(app, goPage, upPages[0], mode);
	} else {
		new MultiPageModal(app, goPage, upPages, mode).open();
	}
};

export default goMultiPage;
