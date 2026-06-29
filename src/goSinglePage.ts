import { App } from "obsidian";
import { goPageType, NavigationMode } from "./types/goPage";
import checkAlias from "./utils/checkAlias";
import getPageName from "./utils/getPageName";
import getPageNameInAlias from "./utils/getPageNameInAlias";
import navigateToParent from "./navigateToParent";

const goSinglePage = (
	upPage: string,
	goPage: goPageType,
	app: App,
	mode: NavigationMode
) => {
	let upPageName = getPageName(upPage);

	if (upPageName === null) {
		return;
	}
	if (checkAlias(upPageName)) {
		upPageName = getPageNameInAlias(upPageName);
	}

	navigateToParent(app, goPage, upPageName, mode);
};

export default goSinglePage;
