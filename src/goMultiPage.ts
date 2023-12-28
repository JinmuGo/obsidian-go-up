import { MultiPageModal } from "./modal/MultiPageModal";
import { goPageType } from "./types/goPage";
import getPageName from "./utils/getPageName";
import type { App } from "obsidian";

const goMultiPage = (upPages: Array<string>, goPage: goPageType, app: App) => {
	upPages = upPages.reduce((prev: string[], upPage: string) => {
		const pageName = getPageName(upPage);
		if (pageName === null) return prev;
		prev.push(pageName);
		return prev;
	}, []);

	new MultiPageModal(app, goPage, upPages).open();
};

export default goMultiPage;
