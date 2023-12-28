import { goPageType } from "./types/goPage";
import getPageName from "./utils/getPageName";

const goSinglePage = (upPage: string, goPage: goPageType) => {
	const upPageName = getPageName(upPage);
	if (upPageName === null) return;
	goPage(upPageName, "", false);
};

export default goSinglePage;
