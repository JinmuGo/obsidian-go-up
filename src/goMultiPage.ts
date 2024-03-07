import { MultiPageModal } from "./modal/MultiPageModal";
import { goPageType } from "./types/goPage";
import checkAlias from "./utils/checkAlias";
import getPageName from "./utils/getPageName";
import type { App } from "obsidian";
import getPageNameInAlias from "./utils/getPageNameInAlias";

const goMultiPage = (upPages: Array<string>, goPage: goPageType, app: App) => {
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
		goPage(upPages[0], "", false);
	} else {
		new MultiPageModal(app, goPage, upPages).open();
	}
};

export default goMultiPage;
